"""
Security helpers
----------------
1. Passwords are NEVER stored as plain text. We store a bcrypt hash.
2. After login we give the user a JWT token. The frontend sends it back in the
   header  "Authorization: Bearer <token>"  on every request.
"""
import asyncio
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import get_settings


# ---------- passwords ----------
def _hash_sync(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_sync(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:  # e.g. password longer than bcrypt's 72 byte limit
        return False


# bcrypt is slow on purpose (that is what makes it safe). We run it in a worker
# thread so the server can still answer other requests meanwhile.
async def hash_password(password: str) -> str:
    return await asyncio.to_thread(_hash_sync, password)


async def verify_password(password: str, password_hash: str) -> bool:
    return await asyncio.to_thread(_verify_sync, password, password_hash)


# A real-looking hash used when the email does not exist, so login takes the same
# time either way (stops attackers discovering which emails are registered).
DUMMY_HASH = _hash_sync("dummy-password-for-timing")


# ---------- tokens ----------
def create_access_token(user_id: str) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    """Return the user id inside the token, or None if the token is bad/expired."""
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
            options={"require": ["exp", "sub"]},
        )
    except jwt.PyJWTError:
        return None
    return payload.get("sub")
