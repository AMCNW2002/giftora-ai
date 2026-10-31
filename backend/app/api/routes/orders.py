"""Checkout + order history + promo codes. Registered users only."""
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_current_user, get_database
from app.schemas.order import OrderCreate, OrderOut, PromoRequest, PromoResponse
from app.services.catalog import hydrate_lines, merge_lines
from app.services.pricing import calculate_totals, find_promo

router = APIRouter(prefix="/api", tags=["Orders"])


def order_to_out(doc: dict) -> OrderOut:
    return OrderOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k not in ("_id", "user_id")})


@router.post("/promo/validate", response_model=PromoResponse)
async def validate_promo(body: PromoRequest, user: dict = Depends(get_current_user)):
    promo = find_promo(body.code)
    if promo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Invalid code. Try "GIFTORA10"')
    code, percent = promo
    return PromoResponse(code=code, discount_percent=percent, message=f"{percent}% promotional discount applied!")


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(body: OrderCreate, user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    lines = merge_lines([line.model_dump() for line in body.items])
    try:
        items = await hydrate_lines(db, lines, strict=True)
    except ValueError as err:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(err))

    promo = find_promo(body.promo_code)
    if body.promo_code and promo is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid promo code")

    subtotal = sum(i["price"] * i["qty"] for i in items)
    totals = calculate_totals(subtotal, promo[1] if promo else 0)

    order = {
        "user_id": user["_id"],
        "status": "placed",
        # snapshot: if the product price changes later, this old order stays the same
        "items": [{"product_id": i["id"], "name": i["name"], "price": i["price"], "qty": i["qty"], "image": i["image"]} for i in items],
        **totals,
        "promo_code": promo[0] if promo else None,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.orders.insert_one(order)
    order["_id"] = result.inserted_id

    await db.carts.delete_one({"user_id": user["_id"]})  # bag is empty after checkout
    return order_to_out(order)


@router.get("/orders", response_model=list[OrderOut])
async def my_orders(user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    docs = await db.orders.find({"user_id": user["_id"]}).sort("created_at", -1).to_list()
    return [order_to_out(d) for d in docs]


@router.get("/orders/{order_id}", response_model=OrderOut)
async def get_order(order_id: str, user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    try:
        oid = ObjectId(order_id)
    except InvalidId:
        raise HTTPException(404, "Order not found")
    # filtering by user_id means you can NEVER read someone else's order
    doc = await db.orders.find_one({"_id": oid, "user_id": user["_id"]})
    if doc is None:
        raise HTTPException(404, "Order not found")
    return order_to_out(doc)
