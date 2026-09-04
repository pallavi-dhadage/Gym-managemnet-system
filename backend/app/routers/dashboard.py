from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.member import MemberProfile
from app.models.payment import PaymentRecord
from app.models.operations import Trainer, Equipment, Inquiry, Attendance
from app.schemas.operations import DashboardSummaryResponse
from app.core.dependencies import get_current_staff

router = APIRouter(tags=["Dashboard"])


@router.get("/health")
def health_check():
    """Health check endpoint for monitoring uptime."""
    return {"status": "ok", "message": "GymForce FastAPI Backend is healthy and running."}


@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Retrieve full dashboard KPIs, active member counts, revenue, equipment, and recent check-ins."""
    total_members = db.query(User).filter(User.role == "member").count()
    active_members = db.query(MemberProfile).filter(MemberProfile.status == "active").count()
    pending_payments = db.query(PaymentRecord).filter(PaymentRecord.status == "pending").count()
    total_trainers = db.query(Trainer).count()
    total_equipment = db.query(Equipment).count()
    open_inquiries = db.query(Inquiry).filter(Inquiry.status.in_(["open", "follow_up_due"])).count()

    # Total verified revenue
    revenue_records = db.query(func.sum(PaymentRecord.amount)).filter(PaymentRecord.status == "verified").scalar()
    total_revenue = float(revenue_records or 0.0)

    # Today's checkins
    today = date.today()
    recent_checkins = db.query(Attendance).filter(Attendance.session_date == today).count()

    return DashboardSummaryResponse(
        total_members=total_members,
        active_members=active_members,
        pending_payments=pending_payments,
        total_revenue=total_revenue,
        total_trainers=total_trainers,
        total_equipment=total_equipment,
        open_inquiries=open_inquiries,
        recent_checkins=recent_checkins,
        summary={
            "members": total_members,
            "active": active_members,
            "revenue": total_revenue,
            "pending_payments": pending_payments,
            "inquiries": open_inquiries,
        },
    )
