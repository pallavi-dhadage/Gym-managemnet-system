from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.plan import MembershipPlan
from app.schemas.plan import PlanCreate, PlanUpdate, PlanResponse
from app.core.dependencies import get_current_staff, get_current_admin

router = APIRouter(prefix="/plans", tags=["Membership Plans"])


@router.get("", response_model=List[PlanResponse])
def list_plans(
    category: Optional[str] = Query(None, description="Filter by category: Ladies, Mens, Mixed"),
    active_only: bool = Query(True, description="Only return active plans"),
    db: Session = Depends(get_db),
):
    """Retrieve all available gym membership plans (publicly accessible)."""
    query = db.query(MembershipPlan)
    if active_only:
        query = query.filter(MembershipPlan.is_active == True)
    if category:
        query = query.filter(MembershipPlan.category.ilike(category))

    return query.order_by(MembershipPlan.price.asc()).all()


@router.get("/{plan_id}", response_model=PlanResponse)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    """Get single membership plan by ID."""
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return plan


@router.post("", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(
    data: PlanCreate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Create a new membership plan (Staff/Admin only)."""
    plan = MembershipPlan(**data.dict())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.put("/{plan_id}", response_model=PlanResponse)
def update_plan(
    plan_id: int,
    data: PlanUpdate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Update an existing membership plan."""
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(plan, field, val)

    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(
    plan_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Deactivate or remove a plan (Admin only)."""
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    plan.is_active = False
    db.commit()
    return None
