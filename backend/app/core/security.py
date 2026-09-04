from datetime import datetime, timedelta
from typing import Any, Optional, Union
from argon2 import PasswordHasher, Type
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError
from jose import jwt, JWTError
from app.config import settings

# Configure Argon2id hasher with OWASP-recommended parameters
ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,  # 64 MB
    parallelism=4,
    hash_len=32,
    salt_len=16,
    type=Type.ID,  # Argon2id
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored Argon2id hash."""
    if not plain_password or not hashed_password:
        return False
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Generate an Argon2id hash for a plain password."""
    return ph.hash(password)


def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token with user identifier, role, and expiration."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode = {
        "sub": str(subject),
        "user_id": subject,
        "role": role,
        "exp": expire,
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
