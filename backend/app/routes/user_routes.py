from fastapi import APIRouter
from app.database import users_collection
from app.models.user_models import UserCreate
from app.auth import hash_password

router = APIRouter()


@router.post("/create-test")
async def create_user(user: UserCreate):

    hashed_password = hash_password(user.password)

    new_user = {
        "email": user.email,
        "password": hashed_password
    }

    result = await users_collection.insert_one(new_user)

    return {
        "message": "User added",
        "id": str(result.inserted_id)
    }