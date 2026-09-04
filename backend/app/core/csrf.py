import hashlib
import hmac
import logging
import secrets
import time
from typing import Optional, Set
from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response
from app.config import settings

logger = logging.getLogger("gymforce.security.csrf")

SAFE_METHODS: Set[str] = {"GET", "HEAD", "OPTIONS", "TRACE"}
DEFAULT_EXEMPT_PATHS: Set[str] = {
    "/",
    "/api/health",
    "/api/docs",
    "/api/redoc",
    "/api/openapi.json",
    "/api/csrf-token",
}


def generate_csrf_token(secret_key: Optional[str] = None) -> str:
    """
    Generate a cryptographic URL-safe CSRF token with a UNIX timestamp and HMAC-SHA256 signature.
    Format: <random_entropy>.<timestamp>.<hmac_signature>
    """
    secret = (secret_key or settings.SECRET_KEY).encode("utf-8")
    raw_token = secrets.token_urlsafe(32)
    timestamp = str(int(time.time()))
    payload = f"{raw_token}.{timestamp}"
    signature = hmac.new(secret, payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload}.{signature}"


def validate_csrf_token(token: str, secret_key: Optional[str] = None, max_age_seconds: int = 86400) -> bool:
    """
    Validate a signed CSRF token, verifying its structure, expiration time, and HMAC signature.
    """
    if not token or not isinstance(token, str) or token.count(".") != 2:
        return False

    try:
        raw_token, timestamp_str, provided_sig = token.split(".")
        timestamp = int(timestamp_str)
        current_time = int(time.time())

        # Check expiration (default 24 hours)
        if current_time - timestamp > max_age_seconds or timestamp > current_time + 300:
            return False

        secret = (secret_key or settings.SECRET_KEY).encode("utf-8")
        payload = f"{raw_token}.{timestamp_str}"
        expected_sig = hmac.new(secret, payload.encode("utf-8"), hashlib.sha256).hexdigest()

        return hmac.compare_digest(provided_sig, expected_sig)
    except Exception:
        return False


class CSRFMiddleware(BaseHTTPMiddleware):
    """
    OWASP Double-Submit Cookie + Cryptographic HMAC Signed Token CSRF Protection Middleware.
    
    1. Safe requests (GET, HEAD, OPTIONS) automatically receive a CSRF cookie and X-CSRF-Token header.
    2. State-mutating requests (POST, PUT, PATCH, DELETE) require a valid, signed 'X-CSRF-Token' header.
    3. If a 'csrftoken' cookie is present, the header token must match the cookie value.
    """

    def __init__(self, app, exempt_paths: Optional[Set[str]] = None):
        super().__init__(app)
        self.exempt_paths = set(exempt_paths or DEFAULT_EXEMPT_PATHS)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # 1. Skip validation for exempt paths and docs
        is_exempt = (
            path in self.exempt_paths
            or path.startswith("/api/docs")
            or path.startswith("/api/redoc")
            or path.startswith("/api/openapi")
        )

        # 2. Handle Safe HTTP methods (GET, HEAD, OPTIONS, TRACE)
        if request.method in SAFE_METHODS or is_exempt:
            response: Response = await call_next(request)
            
            # Ensure client receives a CSRF cookie if not already set
            cookie_name = settings.CSRF_COOKIE_NAME
            if cookie_name not in request.cookies and not is_exempt:
                token = generate_csrf_token()
                response.set_cookie(
                    key=cookie_name,
                    value=token,
                    max_age=settings.CSRF_COOKIE_MAX_AGE,
                    httponly=False,  # Allow frontend JavaScript/SPA to read and mirror in header
                    samesite=settings.CSRF_COOKIE_SAMESITE,
                    secure=settings.CSRF_COOKIE_SECURE,
                    path="/",
                )
                response.headers["X-CSRF-Token"] = token
            return response

        # 3. For mutating methods (POST, PUT, PATCH, DELETE), enforce CSRF verification
        header_token = (
            request.headers.get("x-csrf-token")
            or request.headers.get("x-csrftoken")
            or request.headers.get("x-xsrf-token")
        )
        cookie_token = request.cookies.get(settings.CSRF_COOKIE_NAME)

        # Require a valid signed CSRF token in header
        if not header_token or not validate_csrf_token(header_token, max_age_seconds=settings.CSRF_COOKIE_MAX_AGE):
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "detail": "CSRF verification failed: Missing or invalid 'X-CSRF-Token' request header.",
                    "code": "CSRF_INVALID_OR_MISSING",
                },
            )

        # If a CSRF cookie is present, verify that header and cookie match (Double-Submit validation)
        if cookie_token and not hmac.compare_digest(cookie_token, header_token):
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "detail": "CSRF verification failed: 'X-CSRF-Token' header does not match CSRF cookie.",
                    "code": "CSRF_COOKIE_MISMATCH",
                },
            )

        # Token is valid, proceed with request
        response: Response = await call_next(request)
        return response
