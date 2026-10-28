import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from pymongo import MongoClient

from sample_products import SAMPLE_PRODUCTS

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "GiftoraAi")


def normalize_document(doc: Dict[str, Any]) -> Dict[str, Any]:
    normalized = {}
    for key, value in doc.items():
        if key == "_id":
            continue
        if isinstance(value, datetime):
            normalized[key] = value.isoformat()
        else:
            normalized[key] = value
    return normalized


fallback_db: Dict[str, List[Dict[str, Any]]] = {
    "products": [dict(product) for product in SAMPLE_PRODUCTS],
    "users": [
        {
            "name": "Demo User",
            "email": "demo@giftora.ai",
            "password": "demo123",
            "memberSince": "Recently",
        }
    ],
}

client: Optional[MongoClient] = None
if MONGODB_URI:
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
    except Exception:
        client = None


def get_db():
    if client is not None:
        return client[MONGODB_DATABASE]
    return None


def seed_products():
    db = get_db()
    if db is None:
        return [dict(product) for product in fallback_db["products"]]

    product_collection = db["products"]
    if product_collection.count_documents({}) == 0:
        product_collection.insert_many([dict(product) for product in SAMPLE_PRODUCTS])
    return [normalize_document(doc) for doc in product_collection.find({})]


def seed_demo_user():
    db = get_db()
    if db is None:
        for user in fallback_db["users"]:
            if user["email"] == "demo@giftora.ai":
                return dict(user)
        fallback_db["users"].append(
            {
                "name": "Demo User",
                "email": "demo@giftora.ai",
                "password": "demo123",
                "memberSince": "Recently",
            }
        )
        return dict(fallback_db["users"][-1])

    users = db["users"]
    if users.count_documents({"email": "demo@giftora.ai"}) == 0:
        users.insert_one({
            "name": "Demo User",
            "email": "demo@giftora.ai",
            "password": "demo123",
            "memberSince": "Recently",
        })
    return users.find_one({"email": "demo@giftora.ai"})


def get_products():
    db = get_db()
    if db is None:
        return [dict(product) for product in fallback_db["products"]]

    products = [normalize_document(doc) for doc in db["products"].find({})]
    if not products:
        return seed_products()
    return products


def get_product_by_id(product_id: int):
    db = get_db()
    if db is None:
        for item in fallback_db["products"]:
            if item["id"] == product_id:
                return dict(item)
        return None

    product = db["products"].find_one({"id": product_id})
    return None if product is None else normalize_document(product)


def get_users_collection():
    db = get_db()
    if db is None:
        return None
    return db["users"]


def create_user(user_payload: Dict[str, Any]):
    db = get_db()
    if db is None:
        user = dict(user_payload)
        fallback_db["users"].append(user)
        return dict(user)

    users = db["users"]
    existing = users.find_one({"email": user_payload["email"]})
    if existing:
        return normalize_document(existing)
    users.insert_one(dict(user_payload))
    return dict(user_payload)


def get_user_by_email(email: str):
    db = get_db()
    if db is None:
        for user in fallback_db["users"]:
            if user.get("email") == email:
                return dict(user)
        return None

    user = db["users"].find_one({"email": email})
    return None if user is None else normalize_document(user)
