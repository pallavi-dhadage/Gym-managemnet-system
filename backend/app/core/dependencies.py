from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)

STAFF_ROLES = {"master_admin", "staff", "receptionist", "trainer"}


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Validate Bearer JWT and return the authenticated User object."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Return user if token is provided and valid, otherwise None."""
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        return None
    return db.query(User).filter(User.id == payload.get("user_id")).first()


def require_roles(allowed_roles: List[str]):
    """Dependency factory ensuring current user has one of the allowed roles."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of {allowed_roles}",
            )
        return current_user
    return role_checker


def get_current_staff(current_user: User = Depends(get_current_user)) -> User:
    """Ensure current user is a gym staff member (admin, staff, receptionist, trainer)."""
    if current_user.role not in STAFF_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff authorization required",
        )
    return current_user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure current user is Master Admin."""
    if current_user.role != "master_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Master Admin authorization required",
        )
    return current_user
