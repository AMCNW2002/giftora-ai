"""Custom gift box: the user's saved draft + the AI suggestion. Registered users only."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_current_user, get_database
from app.schemas.gift_box import GiftBoxIn, GiftBoxOut, SuggestRequest, SuggestResponse
from app.services.catalog import NO_ID, hydrate_lines, merge_lines
from app.services.gift_suggester import suggest_box

router = APIRouter(prefix="/api/gift-box", tags=["Gift Box"])

DEFAULT_BOX = {"lines": [], "budget": 100, "ribbon": "rose", "message": "",
               "recipient": "partner", "occasion": "birthday", "interests": ""}


async def to_out(db: AsyncDatabase, doc: dict) -> GiftBoxOut:
    items = await hydrate_lines(db, doc["lines"])
    return GiftBoxOut(items=items, **{k: doc[k] for k in ("budget", "ribbon", "message", "recipient", "occasion", "interests")})


@router.get("", response_model=GiftBoxOut)
async def get_my_box(user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    doc = await db.gift_boxes.find_one({"user_id": user["_id"]})
    return await to_out(db, {**DEFAULT_BOX, **(doc or {})})


@router.put("", response_model=GiftBoxOut)
async def save_my_box(body: GiftBoxIn, user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    lines = merge_lines([line.model_dump() for line in body.items])
    try:
        await hydrate_lines(db, lines, strict=True)
    except ValueError as err:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(err))

    doc = {**body.model_dump(exclude={"items"}), "lines": lines, "updated_at": datetime.now(timezone.utc)}
    await db.gift_boxes.update_one({"user_id": user["_id"]}, {"$set": doc}, upsert=True)
    return await to_out(db, doc)


@router.post("/suggest", response_model=SuggestResponse)
async def suggest(body: SuggestRequest, user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    products = await db.products.find({}, NO_ID).to_list()
    return suggest_box(products, body.recipient, body.budget, body.interests)
