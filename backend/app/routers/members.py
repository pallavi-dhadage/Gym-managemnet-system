from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.member import MemberProfile
from app.models.operations import Trainer
from app.schemas.member import MemberDetailResponse, MemberProfileResponse, MemberProfileUpdate, AssignTrainerRequest
from app.core.dependencies import get_current_user, get_current_staff

router = APIRouter(prefix="/members", tags=["Members"])


@router.get("", response_model=List[MemberDetailResponse])
def list_members(
    search: Optional[str] = Query(None, description="Search by name, email, or member ID"),
    category: Optional[str] = Query(None, description="Filter by category: Ladies, Mens, Mixed"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: active, expired, pending"),
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """List all members with their profiles (Staff authorization required)."""
    query = db.query(User).filter(User.role == "member")

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            (User.full_name.ilike(s)) | (User.email.ilike(s)) | (User.phone.ilike(s))
        )

    users = query.order_by(User.created_at.desc()).all()

    results = []
    for u in users:
        profile = u.member_profile
        if category and profile and profile.category != category:
            continue
        if status_filter and profile and profile.status != status_filter:
            continue

        results.append(
            MemberDetailResponse(
                id=u.id,
                email=u.email,
                full_name=u.full_name,
                role=u.role,
                phone=u.phone,
                avatar_url=u.avatar_url,
                member_id=profile.member_id if profile else None,
                status=profile.status if profile else "active",
                category=profile.category if profile else "Mixed",
                join_date=profile.join_date if profile else None,
                profile=profile,
            )
        )
    return results


@router.get("/{user_id}", response_model=MemberDetailResponse)
def get_member(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get member details. Members can view their own profile; staff can view anyone."""
    if current_user.role == "member" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own profile.",
        )

    user = db.query(User).filter(User.id == user_id, User.role == "member").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    profile = user.member_profile
    return MemberDetailResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        avatar_url=user.avatar_url,
        member_id=profile.member_id if profile else None,
        status=profile.status if profile else "active",
        category=profile.category if profile else "Mixed",
        join_date=profile.join_date if profile else None,
        profile=profile,
    )


@router.put("/{user_id}/profile", response_model=MemberProfileResponse)
def update_member_profile(
    user_id: int,
    data: MemberProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update member physical metrics, goals, or notes."""
    if current_user.role == "member" and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    profile = db.query(MemberProfile).filter(MemberProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member profile not found")

    # Update provided fields
    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile


@router.post("/{user_id}/assign-trainer")
def assign_trainer(
    user_id: int,
    data: AssignTrainerRequest,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Assign a designated trainer to a member (Staff only)."""
    profile = db.query(MemberProfile).filter(MemberProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    trainer = db.query(Trainer).filter(Trainer.id == data.trainer_id).first()
    if not trainer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")

    profile.notes = f"trainer:{trainer.id}"
    db.commit()
    return {"message": "Trainer assigned successfully", "member_id": profile.member_id, "trainer_id": trainer.id}
