from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.member import MemberProfile
from app.models.operations import Attendance
from app.schemas.operations import CheckInRequest, AttendanceResponse
from app.core.dependencies import get_current_user, get_current_staff, STAFF_ROLES

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceResponse)
def check_in_member(
    data: CheckInRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check in a member for today's session. Prevents duplicate check-ins on the same calendar day."""
    if current_user.role == "member":
        profile = current_user.member_profile
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member profile not found")
        member_id = profile.id
    else:
        if not data.member_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="member_id is required for staff check-in")
        profile = db.query(MemberProfile).filter(MemberProfile.id == data.member_id).first()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
        member_id = profile.id

    today = date.today()
    existing = db.query(Attendance).filter(
        Attendance.member_id == member_id,
        Attendance.session_date == today,
    ).first()

    if existing:
        return AttendanceResponse(
            id=existing.id,
            member_id=existing.member_id,
            session_date=existing.session_date,
            check_in_time=existing.check_in_time,
            zone=existing.zone,
            member_name=profile.user.full_name if profile and profile.user else None,
            created=False,
        )

    record = Attendance(
        member_id=member_id,
        session_date=today,
        check_in_time=datetime.utcnow(),
        zone=data.zone or "Main Gym Floor",
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AttendanceResponse(
        id=record.id,
        member_id=record.member_id,
        session_date=record.session_date,
        check_in_time=record.check_in_time,
        zone=record.zone,
        member_name=profile.user.full_name if profile and profile.user else None,
        created=True,
    )


@router.get("/log", response_model=List[AttendanceResponse])
def attendance_log(
    target_date: Optional[date] = Query(None, description="Filter by date (defaults to all/recent)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve check-in logs. Members see their own; staff see all."""
    query = db.query(Attendance)
    if current_user.role not in STAFF_ROLES:
        profile = current_user.member_profile
        if not profile:
            return []
        query = query.filter(Attendance.member_id == profile.id)

    if target_date:
        query = query.filter(Attendance.session_date == target_date)

    records = query.order_by(Attendance.check_in_time.desc()).limit(100).all()
    results = []
    for r in records:
        results.append(
            AttendanceResponse(
                id=r.id,
                member_id=r.member_id,
                session_date=r.session_date,
                check_in_time=r.check_in_time,
                zone=r.zone,
                member_name=r.member.user.full_name if r.member and r.member.user else None,
                created=False,
            )
        )
    return results


@router.get("/stats")
def attendance_stats(
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Get high-level attendance metrics for dashboard charts."""
    today = date.today()
    today_count = db.query(Attendance).filter(Attendance.session_date == today).count()
    total_records = db.query(Attendance).count()

    # Zone breakdown
    zone_counts = (
        db.query(Attendance.zone, func.count(Attendance.id))
        .group_by(Attendance.zone)
        .all()
    )
    zones = [{"zone": z, "count": c} for z, c in zone_counts]

    return {
        "today_checkins": today_count,
        "total_checkins": total_records,
        "zones": zones,
    }
