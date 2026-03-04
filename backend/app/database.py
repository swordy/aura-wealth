from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ServerSelectionTimeoutError

from app.config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None
_mongo_available: bool = False


async def connect_db() -> None:
    global _client, _db, _mongo_available
    try:
        _client = AsyncIOMotorClient(
            settings.mongodb_uri, serverSelectionTimeoutMS=3000
        )
        # Force a connection check
        await _client.admin.command("ping")
        _db = _client[settings.db_name]
        _mongo_available = True
        print("[db] Connected to MongoDB")
    except (ServerSelectionTimeoutError, Exception) as e:
        print(f"[db] MongoDB unavailable ({e}), using fallback mock data")
        _client = None
        _db = None
        _mongo_available = False


async def close_db() -> None:
    global _client, _db, _mongo_available
    if _client:
        _client.close()
    _client = None
    _db = None
    _mongo_available = False


def get_db() -> AsyncIOMotorDatabase | None:
    return _db


def is_mongo_available() -> bool:
    return _mongo_available
