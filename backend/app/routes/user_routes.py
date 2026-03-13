from fastapi import APIRouter, HTTPException, status
from app.database import users_collection
from app.models.user_models import UserRegister, UserLogin
from app.auth import hash_password, verify_password

router = APIRouter()

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
        "username": db_user["username"]
    }