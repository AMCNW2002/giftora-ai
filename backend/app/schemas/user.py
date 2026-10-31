"""Shapes of the data for register / login (Pydantic checks them automatically)."""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        v = " ".join(v.split())
        if len(v) < 2:
            raise ValueError("Name is too short")
        return v

    @field_validator("email")
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.lower()

    @field_validator("password")
    @classmethod
    def password_rules(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:  # bcrypt can only use the first 72 bytes
            raise ValueError("Password is too long (max 72 bytes)")
        if v.isdigit() or v.isalpha():
            raise ValueError("Password must contain both letters and numbers")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.lower()


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    member_since: str  # e.g. "Oct 2026"


class AuthResponse(BaseModel):
    user: UserOut
    token: str


def user_to_out(doc: dict) -> UserOut:
    """Turn a MongoDB user document into the safe public version (no password!)."""
    created: datetime = doc["created_at"]
    return UserOut(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        member_since=created.strftime("%b %Y"),
    )
