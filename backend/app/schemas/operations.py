from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, Field


# ── Inquiries ─────────────────────────────────────────────────────────────────
class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: Optional[str] = ""
    phone: str = Field(..., min_length=5)
    interest: Optional[str] = "General"
    message: Optional[str] = ""
    via: Optional[str] = "form"


class InquiryRespond(BaseModel):
    response: str = Field(..., min_length=1)
    status: Optional[str] = "responded"
    follow_up: Optional[date] = None
    follow_up_note: Optional[str] = ""


class InquiryResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = ""
    phone: str
    interest: str
    message: Optional[str] = ""
    status: str
    response: Optional[str] = ""
    via: str
    follow_up: Optional[date] = None
    follow_up_note: Optional[str] = ""
    converted_to_member: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Attendance ────────────────────────────────────────────────────────────────
class CheckInRequest(BaseModel):
    member_id: Optional[int] = None
    zone: Optional[str] = "Main Gym Floor"


class AttendanceResponse(BaseModel):
    id: str
    member_id: int
    session_date: date
    check_in_time: datetime
    zone: str
    member_name: Optional[str] = None
    created: bool = True

    class Config:
        from_attributes = True


# ── Workout & Diet Plans ───────────────────────────────────────────────────────
class WorkoutPlanCreate(BaseModel):
    member_id: int
    trainer_id: str
    workout_text: Optional[str] = ""
    diet_text: Optional[str] = ""


class WorkoutPlanResponse(BaseModel):
    id: str
    member_id: int
    trainer_id: str
    workout_text: str
    diet_text: str
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Equipment ─────────────────────────────────────────────────────────────────
class EquipmentCreate(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = "Cardio"
    qty: int = Field(default=1, ge=1)
    condition: str = "Good"
    last_maintenance: Optional[date] = None
    next_maintenance: Optional[date] = None
    status: str = "Available"
    location: Optional[str] = "Main Floor"


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    qty: Optional[int] = None
    condition: Optional[str] = None
    last_maintenance: Optional[date] = None
    next_maintenance: Optional[date] = None
    status: Optional[str] = None
    location: Optional[str] = None


class EquipmentResponse(EquipmentCreate):
    id: str

    class Config:
        from_attributes = True


# ── Product ───────────────────────────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = "Supplements"
    price: float = Field(..., ge=0)
    stock: int = Field(default=0, ge=0)
    sku: Optional[str] = ""
    emoji: Optional[str] = "📦"
    description: Optional[str] = ""


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    sku: Optional[str] = None
    emoji: Optional[str] = None
    description: Optional[str] = None


class ProductResponse(ProductCreate):
    id: str

    class Config:
        from_attributes = True


# ── Offer ─────────────────────────────────────────────────────────────────────
class OfferCreate(BaseModel):
    title: str = Field(..., min_length=1)
    code: str = Field(..., min_length=2)
    category: str = "Membership"
    discount_type: str = "Percentage"
    discount_value: float = Field(..., gt=0)
    start_date: date
    end_date: date
    max_uses: Optional[int] = None
    description: Optional[str] = ""
    is_active: Optional[bool] = True


class OfferUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    category: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    max_uses: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class OfferResponse(OfferCreate):
    id: str
    used_count: int = 0

    class Config:
        from_attributes = True


# ── Dashboard Summary ─────────────────────────────────────────────────────────
class DashboardSummaryResponse(BaseModel):
    total_members: int
    active_members: int
    pending_payments: int
    total_revenue: float
    total_trainers: int
    total_equipment: int
    open_inquiries: int
    recent_checkins: int
    summary: dict[str, Any]
