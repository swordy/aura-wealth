"""
Patrimoine data service — handles all writes to patrimoine_data + audit logging.
Routers NEVER write directly to DB; they call these functions.

When MongoDB is unavailable (dev mode), uses an in-memory store so writes still work.
"""

import copy
from datetime import datetime

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.data.mock_data import BOURSE, DASHBOARD, EPARGNE, IMMOBILIER, PRIVATE_EQUITY

_DEFAULTS = {
    "dashboard": DASHBOARD,
    "epargne": EPARGNE,
    "bourse": BOURSE,
    "immobilier": IMMOBILIER,
    "private_equity": PRIVATE_EQUITY,
}

# In-memory store for dev mode (no MongoDB). Keyed by (user_id, domain).
_mem_store: dict[tuple[str, str], dict] = {}


def _flatten_dict(d: dict, parent_key: str = "") -> dict:
    """Flatten nested dict: {'a': {'b': 1}} → {'a.b': 1}"""
    items: list[tuple[str, object]] = []
    for k, v in d.items():
        key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(_flatten_dict(v, key).items())
        else:
            items.append((key, v))
    return dict(items)


def _get_nested(d: dict, path: str) -> object:
    """Get value by dot-notation path: _get_nested({'a': {'b': 1}}, 'a.b') → 1"""
    keys = path.split(".")
    current = d
    for k in keys:
        if isinstance(current, dict):
            current = current.get(k)
        else:
            return None
    return current


def _deep_merge(base: dict, patch: dict) -> dict:
    """Recursively merge patch into base. Returns new dict."""
    result = dict(base)
    for k, v in patch.items():
        if isinstance(v, dict) and isinstance(result.get(k), dict):
            result[k] = _deep_merge(result[k], v)
        else:
            result[k] = v
    return result


def _unflatten_dict(d: dict) -> dict:
    """Convert dot-notation keys to nested dict: {'a.b': 1} → {'a': {'b': 1}}"""
    result: dict = {}
    for key, val in d.items():
        parts = key.split(".")
        current = result
        for part in parts[:-1]:
            current = current.setdefault(part, {})
        current[parts[-1]] = val
    return result


def _apply_array_ops(data: dict, patch: dict) -> tuple[dict, dict, list]:
    """Extract __append_ and __delete_ keys, apply array operations."""
    data = copy.deepcopy(data)
    clean_patch = {}
    audit_entries: list[tuple[str, str, object, object]] = []

    for key, val in patch.items():
        if key.startswith("__append_"):
            arr_key = key[len("__append_"):]
            arr = data.get(arr_key, [])
            if isinstance(arr, list):
                audit_entries.append((arr_key, "append", None, val))
                arr.append(val)
                data[arr_key] = arr
        elif key.startswith("__delete_"):
            arr_key = key[len("__delete_"):]
            arr = data.get(arr_key, [])
            if isinstance(arr, list) and isinstance(val, int) and 0 <= val < len(arr):
                old_item = arr[val]
                audit_entries.append((arr_key, "delete", old_item, None))
                arr.pop(val)
                data[arr_key] = arr
        else:
            clean_patch[key] = val

    return clean_patch, data, audit_entries


def _deep_merge_with_arrays(base: dict, patch: dict) -> dict:
    """Like _deep_merge but handles numeric keys as array indices."""
    result = dict(base)
    for k, v in patch.items():
        if k.isdigit() and isinstance(result, dict):
            result[k] = v
        elif isinstance(v, dict):
            existing = result.get(k)
            if isinstance(existing, list):
                for idx_str, item_val in v.items():
                    if idx_str.isdigit():
                        idx = int(idx_str)
                        if 0 <= idx < len(existing):
                            existing[idx] = item_val
                result[k] = existing
            elif isinstance(existing, dict):
                result[k] = _deep_merge_with_arrays(existing, v)
            else:
                result[k] = v
        else:
            result[k] = v
    return result


# ─── Public API ───────────────────────────────────────────────────────────────


async def get_domain_data(db: AsyncIOMotorDatabase | None, user_id: str, domain: str) -> dict | None:
    """Get a user's data for a specific domain."""
    if db is not None:
        doc = await db.patrimoine_data.find_one({"user_id": user_id, "domain": domain})
        if doc:
            return doc["data"]
        return None

    # In-memory fallback
    key = (user_id, domain)
    if key in _mem_store:
        return copy.deepcopy(_mem_store[key])
    return None


async def put_domain_data(
    db: AsyncIOMotorDatabase | None, user_id: str, domain: str, new_data: dict
) -> dict:
    """Replace entire domain data. Logs full replacement to audit."""
    now = datetime.utcnow()

    if db is not None:
        old_doc = await db.patrimoine_data.find_one({"user_id": user_id, "domain": domain})
        old_data = old_doc["data"] if old_doc else {}

        await db.patrimoine_data.update_one(
            {"user_id": user_id, "domain": domain},
            {"$set": {"data": new_data, "updated_at": now}},
            upsert=True,
        )

        await db.audit_log.insert_one({
            "user_id": user_id,
            "action": "update",
            "domain": domain,
            "field": None,
            "old_value": old_data,
            "new_value": new_data,
            "source": "manual",
            "timestamp": now,
        })
    else:
        _mem_store[(user_id, domain)] = copy.deepcopy(new_data)

    return new_data


async def patch_domain_data(
    db: AsyncIOMotorDatabase | None, user_id: str, domain: str, patch: dict,
    source: str = "manual",
) -> dict:
    """Partial merge of patch into existing domain data. Logs each changed field.

    Special keys:
    - __append_<field>: append value to array field
    - __delete_<field>: delete item at index from array field
    - <field>.<index>: update array item at index (via dot-notation unflatten)
    - Regular keys: deep merge into data
    """
    now = datetime.utcnow()

    if db is not None:
        old_doc = await db.patrimoine_data.find_one({"user_id": user_id, "domain": domain})
        old_data = old_doc["data"] if old_doc else {}
    else:
        key = (user_id, domain)
        old_data = copy.deepcopy(_mem_store.get(key, _DEFAULTS.get(domain, {})))

    # Handle array operations first
    clean_patch, new_data, array_audit = _apply_array_ops(old_data, patch)

    # Handle dot-notation and regular merge for remaining keys
    if clean_patch:
        nested_patch = _unflatten_dict(clean_patch)
        new_data = _deep_merge_with_arrays(new_data, nested_patch)

    if db is not None:
        await db.patrimoine_data.update_one(
            {"user_id": user_id, "domain": domain},
            {"$set": {"data": new_data, "updated_at": now}},
            upsert=True,
        )

        # Log array operations
        for field_path, action, old_val, new_val in array_audit:
            await db.audit_log.insert_one({
                "user_id": user_id,
                "action": action,
                "domain": domain,
                "field": field_path,
                "old_value": old_val,
                "new_value": new_val,
                "source": source,
                "timestamp": now,
            })

        # Log each changed field individually for regular patches
        if clean_patch:
            nested_patch = _unflatten_dict(clean_patch)
            flat_patch = _flatten_dict(nested_patch)
            for field_path, new_val in flat_patch.items():
                old_val = _get_nested(old_data, field_path)
                if old_val != new_val:
                    await db.audit_log.insert_one({
                        "user_id": user_id,
                        "action": "update",
                        "domain": domain,
                        "field": field_path,
                        "old_value": old_val,
                        "new_value": new_val,
                        "source": source,
                        "timestamp": now,
                    })
    else:
        _mem_store[(user_id, domain)] = new_data

    return new_data


async def reset_domain_data(
    db: AsyncIOMotorDatabase | None, user_id: str, domain: str
) -> dict:
    """Reset domain data to mock defaults. Logs reset action."""
    now = datetime.utcnow()
    default_data = copy.deepcopy(_DEFAULTS.get(domain, {}))

    if db is not None:
        old_doc = await db.patrimoine_data.find_one({"user_id": user_id, "domain": domain})
        old_data = old_doc["data"] if old_doc else {}

        await db.patrimoine_data.update_one(
            {"user_id": user_id, "domain": domain},
            {"$set": {"data": default_data, "updated_at": now}},
            upsert=True,
        )

        await db.audit_log.insert_one({
            "user_id": user_id,
            "action": "reset",
            "domain": domain,
            "field": None,
            "old_value": old_data,
            "new_value": default_data,
            "source": "reset",
            "timestamp": now,
        })
    else:
        _mem_store[(user_id, domain)] = default_data

    return default_data
