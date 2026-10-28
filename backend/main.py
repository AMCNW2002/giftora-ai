from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import create_user, get_product_by_id, get_products, get_user_by_email, seed_demo_user, seed_products

app = FastAPI(
    title="Giftora AI API",
    description="Sample full-stack backend for Giftora AI using local product data and MongoDB-ready storage.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: str
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str = Field(..., min_length=6)


class ChatRequest(BaseModel):
    message: str


class GiftBoxRequest(BaseModel):
    recipient: str = "partner"
    occasion: str = "birthday"
    budget: float = 100.0
    interests: str = ""


@app.on_event("startup")
def startup_event():
    seed_products()
    seed_demo_user()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Giftora AI API",
        "database": "mongodb-ready",
    }


@app.get("/api/products")
def list_products():
    return {"products": get_products()}


@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    product = get_product_by_id(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/api/auth/register")
def register_user_route(payload: UserRegister):
    existing = get_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")

    user = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "password": payload.password,
        "memberSince": "Recently",
    }
    saved_user = create_user(user)
    return {
        "user": {"name": saved_user["name"], "email": saved_user["email"], "memberSince": saved_user["memberSince"]},
        "token": "demo-jwt-token-giftora",
    }


@app.post("/api/auth/login")
def login_user_route(payload: UserLogin):
    user = get_user_by_email(payload.email.lower())
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.get("password") != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "user": {"name": user["name"], "email": user["email"], "memberSince": user.get("memberSince", "Recently")},
        "token": "demo-jwt-token-giftora",
    }


@app.post("/api/chat")
def chat_route(payload: ChatRequest):
    lower = (payload.message or "").lower()
    if lower.startswith("hi") or "hello" in lower:
        reply = "Warm greetings! Tell me the recipient, occasion, and budget and I’ll build a custom gift box."
    elif "ship" in lower or "delivery" in lower:
        reply = "🚚 We offer express delivery and complimentary gift wrapping on select orders."
    elif "order" in lower or "track" in lower:
        reply = "📦 Every Giftora order includes tracking and a handwritten note for your recipient."
    elif "box" in lower or "budget" in lower or "gift" in lower:
        reply = "🎁 Use the Gift Box Builder to create a curated set tailored to budget, interests, and occasion."
    else:
        reply = "I can suggest premium gifts, build a custom box, or help with delivery and gifting ideas."

    return {"reply": reply}


@app.post("/api/gift-box/suggest")
def suggest_gift_box_route(payload: GiftBoxRequest):
    affinity_map = {
        "partner": ["jewelry", "flowers", "personalized"],
        "friend": ["hampers", "personalized", "tech"],
        "parent": ["hampers", "personalized", "flowers"],
        "colleague": ["tech", "hampers", "personalized"],
    }

    preferred_categories = affinity_map.get(payload.recipient, ["personalized", "hampers"])
    scored = []

    for product in get_products():
        score = float(product["rating"])
        if product["category"] in preferred_categories:
            score += 3.0
        if payload.interests:
            q = payload.interests.lower()
            if q in (product.get("name") or "").lower() or q in (product.get("description") or "").lower():
                score += 2.0
        scored.append({"item": product, "score": score})

    scored.sort(key=lambda row: row["score"], reverse=True)
    picked: List[Dict[str, Any]] = []
    spent = 0.0

    for row in scored:
        if len(picked) >= 5:
            break
        item = row["item"]
        if spent + float(item["price"]) <= float(payload.budget):
            picked.append({**item, "qty": 1})
            spent += float(item["price"])

    if not picked:
        affordable = [p for p in get_products() if float(p["price"]) <= float(payload.budget)]
        if affordable:
            picked = [{**affordable[0], "qty": 1}]
            spent = float(affordable[0]["price"])

    return {
        "items": picked,
        "totalSpent": round(spent, 2),
        "remaining": round(max(0.0, float(payload.budget) - spent), 2),
    }


@app.get("/")
def root():
    return {"message": "Giftora AI backend is running"}
