from fastapi import APIRouter, HTTPException, Query, status, UploadFile, File
from app.database import users_collection
from app.models.user_models import UserRegister, UserLogin, UserSearch
from app.auth import hash_password, verify_password
from pathlib import Path
from uuid import uuid4
import shutil


router = APIRouter()
UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/register")
async def register_user(user: UserRegister):
    existing_user = await users_collection.find_one({
        "$or": [
            {"email": user.email},
            {"username": user.username}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="Username or Email already registered"
        )

    hashed_pw = hash_password(user.password)
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_pw
    }
    
    result = await users_collection.insert_one(new_user)
    
    return {
        "message": "User registered successfully",
        "username": user.username,
        "id": str(result.inserted_id)
    }
    
@router.post("/login")
async def login_user(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "email": db_user["email"],
        "username": db_user["username"],
        "profile_pic": db_user.get("profile_pic")
    }

@router.get("/search", response_model=list[UserSearch])
async def search_users(
    q: str = Query(...),
    current_email: str = Query(...)
):
    users = await users_collection.find(
        {
            "$and": [
                {
                    "username": {
                        "$regex": q,
                        "$options": "i"
                    }
                },
                {
                    "email": {
                        "$ne": current_email
                    }
                }
            ]
        },
        {
            "_id": 0,
            "username": 1,
            "profile_pic": 1
        }
    ).to_list(length=20)

    return users


@router.post("/avatar")
async def upload_avatar(
    email: str,
    file: UploadFile = File(...)
):
    db_user = await users_collection.find_one({"email": email})

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )

    extension = Path(file.filename).suffix
    filename = f"{uuid4()}{extension}"

    filepath = UPLOAD_DIR / filename

    with filepath.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    profile_pic = f"avatars/{filename}"

    await users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "profile_pic": profile_pic
            }
        }
    )

    return {
        "message": "Profile picture updated",
        "profile_pic": profile_pic
    }