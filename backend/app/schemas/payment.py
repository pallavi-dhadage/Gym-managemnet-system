from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    plan_id: int
    transaction_reference: Optional[str] = ""
    payment_method: Optional[str] = "UPI"


class PaymentVerify(BaseModel):
    status: str = Field(..., pattern="^(verified|rejected)$")


class PaymentResponse(BaseModel):
    id: int
    user_id: int
    plan_id: int
    amount: float
    transaction_reference: Optional[str] = ""
    payment_method: str
    status: str
    created_at: datetime
    plan_name: Optional[str] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True
