from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.operations import WorkoutDietPlan, Equipment, Product, Offer, Trainer
from app.schemas.operations import (
    WorkoutPlanCreate, WorkoutPlanResponse,
    EquipmentCreate, EquipmentUpdate, EquipmentResponse,
    ProductCreate, ProductUpdate, ProductResponse,
    OfferCreate, OfferUpdate, OfferResponse,
)
from app.core.dependencies import get_current_user, get_current_staff, require_roles

router = APIRouter(tags=["Operations & Store"])


# ── Workouts & Diet Plans ──────────────────────────────────────────────────────
@router.get("/workouts", response_model=List[WorkoutPlanResponse])
def get_workouts(
    member_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve workout and diet plans for a member."""
    query = db.query(WorkoutDietPlan)
    if current_user.role == "member":
        profile = current_user.member_profile
        if not profile:
            return []
        query = query.filter(WorkoutDietPlan.member_id == profile.id)
    elif member_id:
        query = query.filter(WorkoutDietPlan.member_id == member_id)

    return query.order_by(WorkoutDietPlan.updated_at.desc()).all()


@router.post("/workouts", response_model=WorkoutPlanResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_workout_plan(
    data: WorkoutPlanCreate,
    current_user: User = Depends(require_roles(["trainer", "master_admin"])),
    db: Session = Depends(get_db),
):
    """Assign or update a custom workout and diet routine (Trainer only)."""
    plan = db.query(WorkoutDietPlan).filter(WorkoutDietPlan.member_id == data.member_id).first()
    if plan:
        plan.trainer_id = data.trainer_id
        plan.workout_text = data.workout_text or ""
        plan.diet_text = data.diet_text or ""
    else:
        plan = WorkoutDietPlan(
            member_id=data.member_id,
            trainer_id=data.trainer_id,
            workout_text=data.workout_text or "",
            diet_text=data.diet_text or "",
        )
        db.add(plan)

    db.commit()
    db.refresh(plan)
    return plan


# ── Equipment Management ───────────────────────────────────────────────────────
@router.get("/equipment", response_model=List[EquipmentResponse])
def list_equipment(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """List gym equipment inventory and maintenance schedules (Staff only)."""
    query = db.query(Equipment)
    if category and category != "All":
        query = query.filter(Equipment.category == category)
    return query.all()


@router.post("/equipment", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
def add_equipment(
    data: EquipmentCreate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Add a new gym equipment item to tracking."""
    item = Equipment(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/equipment/{equipment_id}", response_model=EquipmentResponse)
def update_equipment(
    equipment_id: str,
    data: EquipmentUpdate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Update equipment status, condition, or maintenance dates."""
    item = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment item not found")

    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/equipment/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment(
    equipment_id: str,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Remove equipment item."""
    item = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment item not found")
    db.delete(item)
    db.commit()
    return None


# ── Store Products ─────────────────────────────────────────────────────────────
@router.get("/products", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Browse store inventory (supplements, gear, accessories)."""
    query = db.query(Product)
    if category and category != "All":
        query = query.filter(Product.category == category)
    return query.all()


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Add product to gym shop (Staff only)."""
    product = Product(**data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    data: ProductUpdate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Update product price, stock, or details."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Delete a product from the catalog."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return None


# ── Offers & Discounts ─────────────────────────────────────────────────────────
@router.get("/offers", response_model=List[OfferResponse])
def list_offers(
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    """List promotional offers and coupon codes."""
    query = db.query(Offer)
    if active_only:
        query = query.filter(Offer.is_active == True)
    return query.all()


@router.post("/offers", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(
    data: OfferCreate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Create a new promotional discount or coupon code."""
    code_clean = data.code.strip().upper()
    if db.query(Offer).filter(Offer.code == code_clean).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Coupon code already exists")

    offer = Offer(**{**data.dict(), "code": code_clean})
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


@router.put("/offers/{offer_id}", response_model=OfferResponse)
def update_offer(
    offer_id: str,
    data: OfferUpdate,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Edit offer details or validity."""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")

    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            if field == "code":
                val = val.strip().upper()
            setattr(offer, field, val)

    db.commit()
    db.refresh(offer)
    return offer


@router.delete("/offers/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer(
    offer_id: str,
    current_user: User = Depends(get_current_staff),
    db: Session = Depends(get_db),
):
    """Delete or deactivate an offer."""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    db.delete(offer)
    db.commit()
    return None
