from datetime import date
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.user import UserResponse


class MemberProfileBase(BaseModel):
    gender: Optional[str] = ""
    category: Optional[str] = "Mixed"
    date_of_birth: Optional[date] = None
    address: Optional[str] = ""
    emergency_contact: Optional[str] = ""
    height: Optional[str] = ""
    weight: Optional[str] = ""
    bmi: Optional[str] = ""
    goal: Optional[str] = "fitness"
    diet_plan: Optional[str] = ""
    notes: Optional[str] = ""


class MemberProfileUpdate(MemberProfileBase):
    status: Optional[str] = None


class MemberProfileResponse(MemberProfileBase):
    id: int
    user_id: int
    member_id: str
    join_date: date
    status: str

    class Config:
        from_attributes = True


class MemberDetailResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    phone: Optional[str] = ""
    avatar_url: Optional[str] = ""
    member_id: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    join_date: Optional[date] = None
    profile: Optional[MemberProfileResponse] = None

    class Config:
        from_attributes = True


class AssignTrainerRequest(BaseModel):
    trainer_id: str
