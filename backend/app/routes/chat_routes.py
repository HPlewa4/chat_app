from fastapi import APIRouter
from app.database import chats_collection
from app.models.chat_models import MsgCreate, MsgOut
from typing import List

router = APIRouter()


@router.post("/message")
async def create_msg(message: MsgCreate):


    new_msg = {
        "user": message.user,
        "text": message.text
    }

    result = await chats_collection.insert_one(new_msg)

    return {
        "id": str(result.inserted_id)
    }

@router.get("/messages", response_model=List[MsgOut])
async def get_messages():
    messages_cursor = chats_collection.find({})
    messages = await messages_cursor.to_list(length=100)

    return [
        {
            "id": str(msg["_id"]),
            "user": msg["user"],
            "text": msg["text"]
        }
        for msg in messages
    ]