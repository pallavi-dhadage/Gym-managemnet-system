from datetime import date, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.subscription import Subscription, Trial
from app.schemas.subscription import SubscriptionResponse, TrialCreate, TrialResponse
from app.core.dependencies import get_current_user, get_current_staff, STAFF_ROLES

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions & Trials"])


@router.get("", response_model=List[SubscriptionResponse])
def list_subscriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List subscriptions. Members view their own; staff view all."""
    query = db.query(Subscription)
    if current_user.role not in STAFF_ROLES:
        profile = current_user.member_profile
        if not profile:
            return []
        query = query.filter(Subscription.member_id == profile.id)

    subs = query.order_by(Subscription.end_date.desc()).all()
    results = []
    for s in subs:
        results.append(
            SubscriptionResponse(
                id=s.id,
                member_id=s.member_id,
                plan_id=s.plan_id,
                start_date=s.start_date,
                end_date=s.end_date,
                status=s.status,
                plan_name=s.plan.name if s.plan else None,
            )
        )
    return results


@router.post("/trials", response_model=TrialResponse, status_code=status.HTTP_201_CREATED)
def request_free_trial(data: TrialCreate, db: Session = Depends(get_db)):
    """Public endpoint to register for a 2-day free gym trial pass."""
    existing = db.query(Trial).filter(Trial.phone == data.phone.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A free trial pass has already been issued for this phone number.",
        )

    start_d = date.today()
    end_d = start_d + timedelta(days=2)
    trial = Trial(
        phone=data.phone.strip(),
        member_id=data.member_id,
        start_date=start_d,
        end_date=end_d,
        status="active",
    )
    db.add(trial)
    db.commit()
    db.refresh(trial)
    return trial


@router.get("/trials", response_model=List[TrialResponse])
def list_trials(
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """List all registered trial passes (Staff only)."""
    return db.query(Trial).order_by(Trial.start_date.desc()).all()
