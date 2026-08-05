from fastapi import APIRouter, HTTPException, Response

from app.database import avatars_collection


router = APIRouter()


@router.get("/avatars/{filename}")
async def get_avatar(filename: str):
    avatar = await avatars_collection.find_one(
        {"filename": filename},
        {"_id": 0, "content_type": 1, "data": 1},
    )

    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")

    return Response(
        content=avatar["data"],
        media_type=avatar["content_type"],
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
