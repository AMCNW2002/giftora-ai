from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.cart import MAX_LINES, LineIn


class OrderCreate(BaseModel):
    items: list[LineIn] = Field(min_length=1, max_length=MAX_LINES)
    promo_code: str | None = Field(default=None, max_length=30)


class OrderItemOut(BaseModel):
    product_id: int
    name: str
    price: float
    qty: int
    image: str


class OrderOut(BaseModel):
    id: str
    status: str
    items: list[OrderItemOut]
    subtotal: float
    discount_percent: int
    discount_amount: float
    shipping: float
    total: float
    promo_code: str | None = None
    created_at: datetime


class PromoRequest(BaseModel):
    code: str = Field(min_length=1, max_length=30)


class PromoResponse(BaseModel):
    code: str
    discount_percent: int
    message: str
