"""AI concierge chat. Every message is saved in MongoDB. Registered users only."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_current_user, get_database
from app.schemas.chat import ChatHistoryItem, ChatRequest, ChatResponse
from app.services.chatbot import get_reply

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest, user: dict = Depends(get_current_user), db: AsyncDatabase = Depends(get_database)):
    reply = get_reply(body.message)
    await db.chat_messages.insert_one(
        {"user_id": user["_id"], "message": body.message, "reply": reply, "created_at": datetime.now(timezone.utc)}
    )
    return ChatResponse(reply=reply)


@router.get("/history", response_model=list[ChatHistoryItem])
async def history(
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database),
):
    docs = await db.chat_messages.find({"user_id": user["_id"]}).sort("created_at", -1).limit(limit).to_list()
    return [ChatHistoryItem(**d) for d in reversed(docs)]
