from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Query
from app.database import messages_collection, sessions_collection, users_collection
from app.models.chat_models import MsgCreate, MsgOut, SessionCreate, SessionOut


router = APIRouter()


@router.post("/message")
async def create_msg(message: MsgCreate):


    new_msg = {
        "user": message.user,
        "text": message.text,
        "session_id": message.session_id,
        "timestamp": datetime.now(timezone.utc)
    }

    result = await messages_collection.insert_one(new_msg)


    current_time = datetime.now(timezone.utc)
    await sessions_collection.update_one(
        {"_id": ObjectId(message.session_id)}, 
        {"$set": {"last_message": message.text, "updated_at": current_time}}
    )


    return {
        "id": str(result.inserted_id),
        "user": new_msg["user"],
        "text": new_msg["text"],
        "session_id": new_msg["session_id"]
    }

@router.get("/messages", response_model=list[MsgOut])
async def get_messages(session_id: str = Query(...)):
    messages_cursor = messages_collection.find({"session_id": session_id})
    
    messages = await messages_cursor.sort("timestamp", 1).to_list(length=100)

    return [
        {
            "id": str(msg["_id"]),
            "user": msg["user"],
            "text": msg["text"],
            "session_id": msg["session_id"]
        }
        for msg in messages
    ]


@router.post("/session", response_model=SessionOut)
async def get_or_create_session(payload: SessionCreate):
    existing_session = await sessions_collection.find_one({
        "participants": {"$all": [payload.current_user, payload.target_user]}
    })

    if existing_session:
        last_msg_doc = await messages_collection.find_one(
            {"session_id": str(existing_session["_id"])},
            sort=[("timestamp", -1)]
        )
        last_msg = last_msg_doc["text"] if last_msg_doc else "No messages yet"

        return {
            "id": str(existing_session["_id"]),
            "participants": existing_session["participants"],
            "last_message": last_msg,
            "updated_at": existing_session.get("updated_at", datetime.now(timezone.utc))
        }

    current_time = datetime.now(timezone.utc)
    new_session = {
        "participants": [payload.current_user, payload.target_user],
        "updated_at": current_time
    }
    result = await sessions_collection.insert_one(new_session)

    return {
        "id": str(result.inserted_id),
        "participants": new_session["participants"],
        "last_message": "No messages yet",
        "updated_at": current_time
    }


@router.get("/sessions", response_model=list[SessionOut])
async def get_user_sessions(username: str = Query(...)):

    cursor = sessions_collection.find(
        {"participants": username}
    ).sort("updated_at", -1)

    sessions = await cursor.to_list(length=50)

    session_list = []

    for s in sessions:
        session_id_str = str(s["_id"])

        last_msg_doc = await messages_collection.find_one(
            {"session_id": session_id_str},
            sort=[("timestamp", -1)]
        )

        last_msg = last_msg_doc["text"] if last_msg_doc else "No messages yet"

        other_user = next(
            p for p in s["participants"]
            if p != username
        )

        user_doc = await users_collection.find_one(
            {"username": other_user},
            {
                "_id": 0,
                "profile_pic": 1
            }
        )

        session_list.append({
            "id": session_id_str,
            "participants": s["participants"],
            "last_message": last_msg[:25],
            "updated_at": s.get("updated_at"),
            "profile_pic": user_doc.get("profile_pic") if user_doc else None
        })

    return session_list