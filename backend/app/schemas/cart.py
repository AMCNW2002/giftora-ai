from pydantic import BaseModel, Field

from app.schemas.product import ProductOut

MAX_QTY = 99
MAX_LINES = 50


class LineIn(BaseModel):
    """One line the frontend sends: only the product id + quantity.
    Prices are NEVER taken from the browser, we read them from the database."""
    product_id: int
    qty: int = Field(ge=1, le=MAX_QTY)


class CartUpdate(BaseModel):
    items: list[LineIn] = Field(max_length=MAX_LINES)


class CartItemOut(ProductOut):
    qty: int


class CartOut(BaseModel):
    items: list[CartItemOut]
    subtotal: float
    shipping: float
    total: float
