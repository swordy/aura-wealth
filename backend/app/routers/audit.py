from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query

from app.database import get_db, is_mongo_available
from app.dependencies import get_current_user
from app.models.user import UserInDB

router = APIRouter()


@router.get("/audit-log")
async def get_audit_log(
    user: UserInDB = Depends(get_current_user),
    domain: str | None = Query(None),
    days: int = Query(30, ge=1, le=365),
):
    if not is_mongo_available():
        return []

    db = get_db()
    since = datetime.utcnow() - timedelta(days=days)

    query: dict = {"user_id": user.id, "timestamp": {"$gte": since}}
    if domain:
        query["domain"] = domain

    cursor = db.audit_log.find(query).sort("timestamp", -1).limit(200)
    entries = []
    async for doc in cursor:
        entries.append({
            "id": str(doc["_id"]),
            "userId": doc["user_id"],
            "action": doc["action"],
            "domain": doc["domain"],
            "field": doc.get("field"),
            "oldValue": doc.get("old_value"),
            "newValue": doc.get("new_value"),
            "source": doc.get("source", "manual"),
            "timestamp": doc["timestamp"].isoformat() if isinstance(doc["timestamp"], datetime) else doc["timestamp"],
        })

    return entries
