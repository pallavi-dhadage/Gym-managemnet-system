from datetime import date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.plan import MembershipPlan
from app.models.payment import PaymentRecord
from app.models.subscription import Subscription
from app.schemas.payment import PaymentCreate, PaymentVerify, PaymentResponse
from app.core.dependencies import get_current_user, get_current_staff, STAFF_ROLES

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("", response_model=List[PaymentResponse])
def list_payments(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List payment transactions. Members view their own history; staff view all."""
    query = db.query(PaymentRecord)
    if current_user.role not in STAFF_ROLES:
        query = query.filter(PaymentRecord.user_id == current_user.id)
    if status_filter:
        query = query.filter(PaymentRecord.status == status_filter)

    records = query.order_by(PaymentRecord.created_at.desc()).all()
    results = []
    for r in records:
        results.append(
            PaymentResponse(
                id=r.id,
                user_id=r.user_id,
                plan_id=r.plan_id,
                amount=r.amount,
                transaction_reference=r.transaction_reference or "",
                payment_method=r.payment_method,
                status=r.status,
                created_at=r.created_at,
                plan_name=r.plan.name if r.plan else None,
                user_name=r.user.full_name if r.user else None,
            )
        )
    return results


@router.post("", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a payment record for verification (UPI, Card, Cash)."""
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == data.plan_id, MembershipPlan.is_active == True).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Active membership plan not found",
        )

    payment = PaymentRecord(
        user_id=current_user.id,
        plan_id=plan.id,
        amount=plan.price,
        transaction_reference=data.transaction_reference or "",
        payment_method=data.payment_method or "UPI",
        status="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return PaymentResponse(
        id=payment.id,
        user_id=payment.user_id,
        plan_id=payment.plan_id,
        amount=payment.amount,
        transaction_reference=payment.transaction_reference,
        payment_method=payment.payment_method,
        status=payment.status,
        created_at=payment.created_at,
        plan_name=plan.name,
        user_name=current_user.full_name,
    )


@router.post("/{payment_id}/verify", response_model=PaymentResponse)
def verify_payment(
    payment_id: int,
    data: PaymentVerify,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Verify or reject a payment (Staff only). Verifying activates membership and creates subscription."""
    payment = db.query(PaymentRecord).filter(PaymentRecord.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found")

    payment.status = data.status
    if data.status == "verified":
        # Activate member profile
        profile = payment.user.member_profile
        if profile:
            profile.status = "active"

        # Create or extend subscription
        start_d = date.today()
        end_d = start_d + timedelta(days=payment.plan.duration_days)
        sub = Subscription(
            member_id=profile.id if profile else payment.user_id,
            plan_id=payment.plan_id,
            start_date=start_d,
            end_date=end_d,
            status="active",
        )
        db.add(sub)

    db.commit()
    db.refresh(payment)

    return PaymentResponse(
        id=payment.id,
        user_id=payment.user_id,
        plan_id=payment.plan_id,
        amount=payment.amount,
        transaction_reference=payment.transaction_reference,
        payment_method=payment.payment_method,
        status=payment.status,
        created_at=payment.created_at,
        plan_name=payment.plan.name if payment.plan else None,
        user_name=payment.user.full_name if payment.user else None,
    )
