"""
Runs once at server start:
  1. creates indexes (fast lookups + "email must be unique")
  2. puts the starter products into the database if they are not there yet
"""
from pymongo.asynchronous.database import AsyncDatabase

from app.db.seed_data import PRODUCTS


async def create_indexes(db: AsyncDatabase) -> None:
    await db.users.create_index("email", unique=True)  # no two accounts with the same email
    await db.products.create_index("id", unique=True)
    await db.carts.create_index("user_id", unique=True)  # one cart per user
    await db.gift_boxes.create_index("user_id", unique=True)  # one box draft per user
    await db.orders.create_index([("user_id", 1), ("created_at", -1)])
    await db.chat_messages.create_index([("user_id", 1), ("created_at", -1)])


async def seed_products(db: AsyncDatabase) -> None:
    # $setOnInsert = "only write this if the product does not exist yet",
    # so restarting the server never overwrites changes you made in the database.
    for product in PRODUCTS:
        await db.products.update_one({"id": product["id"]}, {"$setOnInsert": product}, upsert=True)


async def init_db(db: AsyncDatabase) -> None:
    await create_indexes(db)
    await seed_products(db)
