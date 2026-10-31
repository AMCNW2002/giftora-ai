"""
Giftora AI - backend entry point.   Start it with:   uvicorn app.main:app --reload
Open http://localhost:8000/docs to try every endpoint in the browser.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, cart, chat, gift_box, orders, products
from app.core.config import get_settings
from app.db.database import close_mongo_connection, connect_to_mongo, get_db
from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- runs when the server starts ---
    await connect_to_mongo()
    await init_db(get_db())
    yield
    # --- runs when the server stops ---
    await close_mongo_connection()


settings = get_settings()
app = FastAPI(title="Giftora AI API", version="1.0.0", lifespan=lifespan)

# CORS: tells the browser "this frontend website is allowed to call me"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Each file in app/api/routes is one "router" (a group of related endpoints)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(gift_box.router)
app.include_router(orders.router)
app.include_router(chat.router)


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "ok"}
