"""
MongoDB connection
------------------
We open ONE connection when the server starts and close it when it stops.
Every route gets the database through the `get_database` dependency
(see app/api/deps.py).
"""
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from app.core.config import get_settings

_client: AsyncMongoClient | None = None


async def connect_to_mongo() -> None:
    global _client
    settings = get_settings()
    _client = AsyncMongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=8000)
    try:
        await _client.admin.command("ping")  # fail fast if the URI / network is wrong
    except Exception as err:
        await _client.close()
        _client = None
        raise RuntimeError(
            "Cannot connect to MongoDB. Check: (1) MONGODB_URI in backend/.env is correct and the "
            "password has no unescaped special characters, (2) your IP address is allowed in Atlas "
            "-> Network Access, (3) your internet works."
        ) from err


async def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        await _client.close()
        _client = None


def get_db() -> AsyncDatabase:
    if _client is None:
        raise RuntimeError("MongoDB is not connected yet")
    return _client[get_settings().mongodb_db_name]
