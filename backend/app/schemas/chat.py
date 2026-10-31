from datetime import datetime

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)


class ChatResponse(BaseModel):
    reply: str


class ChatHistoryItem(BaseModel):
    message: str
    reply: str
    created_at: datetime
