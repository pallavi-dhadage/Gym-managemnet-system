from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.member import MemberProfile
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse, UserUpdate, UserPasswordChange
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user account (defaults to member role with automatic member profile)."""
    email_clean = data.email.strip().lower()
    if db.query(User).filter(User.email.ilike(email_clean)).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # Create User
    user = User(
        email=email_clean,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name.strip(),
        phone=data.phone.strip() if data.phone else "",
        role=data.role or "member",
        gym=data.gym or "GymForce HQ",
        avatar_url=data.full_name.strip()[:2].upper(),
    )
    db.add(user)
    db.flush()

    # Automatically create MemberProfile if registered as member
    if user.role == "member":
        member_id = f"M-{user.id:04d}"
        profile = MemberProfile(
            user_id=user.id,
            member_id=member_id,
            category="Ladies" if (data.gender or "").lower() == "female" else "Mens",
            gender=data.gender or "",
            status="active",
        )
        db.add(profile)

    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, token_type="bearer", user=user)


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email and password, optional role tab validation."""
    email_clean = data.email.strip().lower()
    user = db.query(User).filter(User.email.ilike(email_clean)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support.",
        )

    # Optional role check if passed
    if data.selected_role:
        role_map = {
            "Master Admin": "master_admin",
            "Trainer": "trainer",
            "Staff": "staff",
            "Receptionist": "receptionist",
            "Gym Member": "member",
        }
        expected = role_map.get(data.selected_role)
        if expected and user.role != expected:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This account is registered as '{user.role}'. Please select the corresponding role tab.",
            )

    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, token_type="bearer", user=user)


@router.post("/token", response_model=TokenResponse)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """OAuth2 compatible token login for Swagger UI interactive testing."""
    email_clean = form_data.username.strip().lower()
    user = db.query(User).filter(User.email.ilike(email_clean)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(access_token=token, token_type="bearer", user=user)


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get profile of the currently logged-in user."""
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update current user's profile information."""
    if data.full_name is not None:
        current_user.full_name = data.full_name.strip()
    if data.phone is not None:
        current_user.phone = data.phone.strip()
    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url
    if data.gym is not None:
        current_user.gym = data.gym

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
def change_password(data: UserPasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Change current user's password."""
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}
