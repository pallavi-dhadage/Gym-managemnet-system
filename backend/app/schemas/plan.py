from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class PlanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    category: Optional[str] = "Mixed"  # Ladies, Mens, Mixed
    duration_days: int = Field(default=30, ge=1)
    price: float = Field(default=0.0, ge=0)
    description: Optional[str] = ""
    popular: Optional[bool] = False
    is_active: Optional[bool] = True


class PlanCreate(PlanBase):
    pass


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    duration_days: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    popular: Optional[bool] = None
    is_active: Optional[bool] = None


class PlanResponse(PlanBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
