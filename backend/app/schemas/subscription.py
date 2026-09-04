from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class SubscriptionResponse(BaseModel):
    id: str
    member_id: int
    plan_id: int
    start_date: date
    end_date: date
    status: str
    plan_name: Optional[str] = None

    class Config:
        from_attributes = True


class TrialCreate(BaseModel):
    phone: str = Field(..., min_length=5, max_length=30)
    member_id: Optional[int] = None


class TrialResponse(BaseModel):
    id: str
    phone: str
    member_id: Optional[int] = None
    start_date: date
    end_date: date
    status: str

    class Config:
        from_attributes = True
