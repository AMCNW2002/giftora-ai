"""
Dependencies = small functions FastAPI runs BEFORE your route code.

`get_current_user` is the "security guard":
  - reads the "Authorization: Bearer <token>" header
  - checks the token
  - loads the user from MongoDB
  - if anything is wrong -> 401 and the route never runs
Put `Depends(get_current_user)` on a route (or a whole router) = "registered users only".
"""
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pymongo.asynchronous.database import AsyncDatabase

from app.core.security import decode_access_token
from app.db.database import get_db

bearer_scheme = HTTPBearer(auto_error=False)  # shows the "Authorize" button in /docs


def get_database() -> AsyncDatabase:
    return get_db()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncDatabase = Depends(get_database),
) -> dict:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Please sign in to continue",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise unauthorized

    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise unauthorized
    if user is None:  # account was deleted after the token was issued
        raise unauthorized
    return user
