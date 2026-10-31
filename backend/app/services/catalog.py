"""Helpers that look products up in MongoDB and attach quantities to them."""
from pymongo.asynchronous.database import AsyncDatabase

NO_ID = {"_id": 0}  # projection: hide MongoDB's internal _id from product documents


async def products_by_id(db: AsyncDatabase, ids: list[int]) -> dict[int, dict]:
    cursor = db.products.find({"id": {"$in": list(set(ids))}}, NO_ID)
    return {p["id"]: p for p in await cursor.to_list()}


def merge_lines(lines: list[dict]) -> list[dict]:
    """[{product_id:1, qty:1}, {product_id:1, qty:2}] -> [{product_id:1, qty:3}]  (qty capped at 99)"""
    merged: dict[int, int] = {}
    for line in lines:
        merged[line["product_id"]] = min(99, merged.get(line["product_id"], 0) + line["qty"])
    return [{"product_id": pid, "qty": qty} for pid, qty in merged.items()]


async def hydrate_lines(db: AsyncDatabase, lines: list[dict], *, strict: bool = False) -> list[dict]:
    """
    Turn stored lines [{product_id, qty}] into full items (product fields + qty).
    strict=True  -> raise ValueError if a product does not exist (used when saving)
    strict=False -> silently skip products that were removed from the shop (used when reading)
    """
    found = await products_by_id(db, [line["product_id"] for line in lines])
    items = []
    for line in lines:
        product = found.get(line["product_id"])
        if product is None:
            if strict:
                raise ValueError(f"Product {line['product_id']} does not exist")
            continue
        items.append({**product, "qty": line["qty"]})
    return items
