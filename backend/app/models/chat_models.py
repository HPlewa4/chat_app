from datetime import datetime
from typing import List
from pydantic import BaseModel


class MsgCreate(BaseModel):
    user: str
    text: str
    session_id: str

class MsgOut(BaseModel):
    id: str
    user: str
    text: str
    session_id: str
    timestamp: datetime | None = None


class SessionCreate(BaseModel):
    current_user: str
    target_user: str

class SessionOut(BaseModel):
    id: str
    participants: List[str]
    last_message: str = "No messages yet"
    updated_at: datetime | None = None