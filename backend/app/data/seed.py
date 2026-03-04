from datetime import datetime

from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import DESCENDING, IndexModel

from app.data.mock_data import BOURSE, DASHBOARD, EPARGNE, IMMOBILIER, PRIVATE_EQUITY
from app.dependencies import hash_password

DEMO_USER_ID = "demo-user-001"
DEMO_EMAIL = "demo@aura.fr"
DEMO_PASSWORD = "demo1234"

_DOMAIN_DATA = {
    "dashboard": DASHBOARD,
    "epargne": EPARGNE,
    "bourse": BOURSE,
    "immobilier": IMMOBILIER,
    "private_equity": PRIVATE_EQUITY,
}


async def _create_indexes(db: AsyncIOMotorDatabase) -> None:
    """Create all required indexes for multi-tenant data isolation."""
    # users: unique email
    await db["users"].create_index("email", unique=True)

    # patrimoine_data: unique compound {user_id, domain}
    await db["patrimoine_data"].create_index(
        [("user_id", 1), ("domain", 1)], unique=True
    )

    # documents: user_id + upload_date descending
    await db["documents"].create_index(
        [("user_id", 1), ("upload_date", DESCENDING)]
    )

    # upload_history: user_id + timestamp descending
    await db["upload_history"].create_index(
        [("user_id", 1), ("timestamp", DESCENDING)]
    )

    # audit_log: user_id + timestamp, and user_id + domain
    await db["audit_log"].create_indexes([
        IndexModel([("user_id", 1), ("timestamp", DESCENDING)]),
        IndexModel([("user_id", 1), ("domain", 1)]),
    ])

    print("[seed] Indexes created for all collections")


async def seed_if_empty(db: AsyncIOMotorDatabase | None) -> None:
    if db is None:
        print("[seed] No database connection, skipping seed")
        return

    await _create_indexes(db)

    # Seed demo user if no users exist
    user_count = await db["users"].count_documents({})
    if user_count == 0:
        user_doc = {
            "_id": DEMO_USER_ID,
            "email": DEMO_EMAIL,
            "hashed_password": hash_password(DEMO_PASSWORD),
            "nom": "Dupont",
            "prenom": "Jean",
            "role": "abonne",
            "preferences": {},
            "onboarding_completed": False,
            "created_at": datetime.utcnow(),
            "last_login": None,
        }
        await db["users"].insert_one(user_doc)
        print(f"[seed] Created demo user: {DEMO_EMAIL} / {DEMO_PASSWORD}")

    # Seed patrimoine_data for demo user (5 domains)
    patri_count = await db["patrimoine_data"].count_documents({"user_id": DEMO_USER_ID})
    if patri_count == 0:
        now = datetime.utcnow()
        docs = [
            {
                "user_id": DEMO_USER_ID,
                "domain": domain,
                "data": data,
                "updated_at": now,
            }
            for domain, data in _DOMAIN_DATA.items()
        ]
        await db["patrimoine_data"].insert_many(docs)
        print(f"[seed] Inserted {len(docs)} patrimoine documents for demo user")
    else:
        print("[seed] Patrimoine data already exists for demo user, skipping")
