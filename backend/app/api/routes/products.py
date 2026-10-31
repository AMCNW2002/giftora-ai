"""Product catalogue. Registered users only."""
import re
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_current_user, get_database
from app.schemas.product import ProductOut
from app.services.catalog import NO_ID

router = APIRouter(prefix="/api/products", tags=["Products"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[ProductOut])
async def list_products(
    category: str | None = Query(None, max_length=30),
    search: str | None = Query(None, max_length=60),
    sort: Literal["featured", "price-low", "price-high", "rating"] = "featured",
    db: AsyncDatabase = Depends(get_database),
):
    query: dict = {}
    category_name = (category or "").strip()
    if category_name and category_name.lower() != "all":
        # Accept user input in any case while still matching database values.
        query["category"] = {"$regex": re.escape(category_name.lower()), "$options": "i"}
    products = await db.products.find(query, NO_ID).to_list()

    if search:  # simple filter in Python (fine for a small catalogue)
        q = search.strip().lower()
        products = [
            p for p in products
            if q in p["name"].lower() or q in p["description"].lower() or q in p["category"].lower()
        ]

    if sort == "price-low":
        products.sort(key=lambda p: p["price"])
    elif sort == "price-high":
        products.sort(key=lambda p: -p["price"])
    elif sort == "rating":
        products.sort(key=lambda p: -p["rating"])
    else:  # featured: Bestsellers first, then by id
        products.sort(key=lambda p: (p.get("tag") != "Bestseller", p["id"]))
    return products


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncDatabase = Depends(get_database)):
    product = await db.products.find_one({"id": product_id}, NO_ID)
    if product is None:
        raise HTTPException(404, f"Product #{product_id} not found")
    return product
