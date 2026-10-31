from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.schemas.cart import MAX_LINES, CartItemOut, LineIn

Recipient = Literal["partner", "friend", "parent", "colleague"]
Occasion = Literal["birthday", "anniversary", "wedding", "holiday"]
Ribbon = Literal["rose", "gold", "navy", "sage"]


class GiftBoxIn(BaseModel):
    items: list[LineIn] = Field(default_factory=list, max_length=MAX_LINES)
    budget: float = Field(default=100, ge=20, le=100000)
    ribbon: Ribbon = "rose"
    message: str = Field(default="", max_length=140)
    recipient: Recipient = "partner"
    occasion: Occasion = "birthday"
    interests: str = Field(default="", max_length=100)

    @field_validator("ribbon", "recipient", "occasion", mode="before")
    @classmethod
    def normalize_choice(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip().lower()
        return value


class GiftBoxOut(BaseModel):
    items: list[CartItemOut]
    budget: float
    ribbon: str
    message: str
    recipient: str
    occasion: str
    interests: str


class SuggestRequest(BaseModel):
    recipient: Recipient = "partner"
    occasion: Occasion = "birthday"
    budget: float = Field(default=100, ge=20, le=100000)
    interests: str = Field(default="", max_length=100)

    @field_validator("recipient", "occasion", mode="before")
    @classmethod
    def normalize_choice(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip().lower()
        return value


class SuggestResponse(BaseModel):
    items: list[CartItemOut]
    total_spent: float
    remaining: float
