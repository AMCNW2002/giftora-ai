"""Each user's shopping bag, saved in MongoDB (collection: carts). Registered users only."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_current_user, get_database
from app.schemas.cart import CartOut, CartUpdate
from app.services.catalog import hydrate_lines, merge_lines
from app.services.pricing import calculate_totals

router = APIRouter(prefix="/api/cart", tags=["Cart"])


async def build_cart_response(db: AsyncDatabase, lines: list[dict]) -> CartOut:
    items = await hydrate_lines(db, lines)
    subtotal = sum(i["price"] * i["qty"] for i in items)
    totals = calculate_totals(subtotal)
    return CartOut(items=items, subtotal=totals["subtotal"], shipping=totals["shipping"], total=totals["total"])


@router.get("", response_model=CartOut)
async def get_cart(user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    cart = await db.carts.find_one({"user_id": user["_id"]})
    return await build_cart_response(db, cart["lines"] if cart else [])


@router.put("", response_model=CartOut)
async def save_cart(body: CartUpdate, user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    lines = merge_lines([line.model_dump() for line in body.items])
    try:
        await hydrate_lines(db, lines, strict=True)  # make sure every product really exists
    except ValueError as err:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(err))

    await db.carts.update_one(
        {"user_id": user["_id"]},
        {"$set": {"lines": lines, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return await build_cart_response(db, lines)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    await db.carts.delete_one({"user_id": user["_id"]})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
