"""Register / login / who-am-I.  These are the ONLY public routes (besides /api/health)."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.api.deps import get_current_user, get_database
from app.core.security import DUMMY_HASH, create_access_token, hash_password, verify_password
from app.schemas.user import AuthResponse, LoginRequest, RegisterRequest, UserOut, user_to_out

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncDatabase = Depends(get_database)):
    new_user = {
        "name": body.name,
        "email": body.email,
        "password_hash": await hash_password(body.password),
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = await db.users.insert_one(new_user)  # unique index on email protects us here
    except DuplicateKeyError:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    new_user["_id"] = result.inserted_id
    return AuthResponse(user=user_to_out(new_user), token=create_access_token(str(result.inserted_id)))


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, db: AsyncDatabase = Depends(get_database)):
    user = await db.users.find_one({"email": body.email})
    # Always run bcrypt (even for unknown emails) so the response time is the same.
    valid = await verify_password(body.password, user["password_hash"] if user else DUMMY_HASH)
    if not user or not valid:
        # Same message for "no such email" and "wrong password" on purpose.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    return AuthResponse(user=user_to_out(user), token=create_access_token(str(user["_id"])))


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return user_to_out(user)
