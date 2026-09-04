from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = ""
    avatar_url: Optional[str] = ""
    gym: Optional[str] = "GymForce HQ"


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    phone: Optional[str] = ""
    role: Optional[str] = "member"
    gym: Optional[str] = "GymForce HQ"
    gender: Optional[str] = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    selected_role: Optional[str] = None


class UserPasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    gym: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    phone: Optional[str] = ""
    avatar_url: Optional[str] = ""
    gym: Optional[str] = "GymForce HQ"
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
