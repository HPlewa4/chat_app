from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirm_password: str

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    profile_pic: Optional[str] = None

class UserSearch(BaseModel):
    username: str
    profile_pic: Optional[str] = None