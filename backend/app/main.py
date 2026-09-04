from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.seed import seed_database
from app.core.csrf import CSRFMiddleware, generate_csrf_token
from app.routers import (
    auth_router,
    members_router,
    plans_router,
    payments_router,
    subscriptions_router,
    attendance_router,
    inquiries_router,
    operations_router,
    dashboard_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize database tables and seed initial demo data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# 1. Add CSRF Protection Middleware
app.add_middleware(CSRFMiddleware)

# 2. Add CORS Middleware (outermost, handles preflight OPTIONS and sets CORS headers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
    expose_headers=settings.CORS_EXPOSE_HEADERS,
)

# Mount all API routers under the /api prefix
api_prefix = settings.API_PREFIX
app.include_router(auth_router, prefix=api_prefix)
app.include_router(members_router, prefix=api_prefix)
app.include_router(plans_router, prefix=api_prefix)
app.include_router(payments_router, prefix=api_prefix)
app.include_router(subscriptions_router, prefix=api_prefix)
app.include_router(attendance_router, prefix=api_prefix)
app.include_router(inquiries_router, prefix=api_prefix)
app.include_router(operations_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)


@app.get("/api/csrf-token", tags=["Security"])
def get_csrf_token(response: Response):
    """
    Public endpoint to retrieve a fresh cryptographic CSRF token and set the csrftoken cookie.
    Clients include this token in the 'X-CSRF-Token' request header on mutating requests.
    """
    token = generate_csrf_token()
    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=token,
        max_age=settings.CSRF_COOKIE_MAX_AGE,
        httponly=False,
        samesite=settings.CSRF_COOKIE_SAMESITE,
        secure=settings.CSRF_COOKIE_SECURE,
        path="/",
    )
    response.headers["X-CSRF-Token"] = token
    return {
        "csrf_token": token,
        "header_name": settings.CSRF_HEADER_NAME,
        "cookie_name": settings.CSRF_COOKIE_NAME,
    }


@app.get("/")
def root():
    """Root entry point with service metadata and documentation links."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/api/docs",
        "redoc": "/api/redoc",
        "health": "/api/health",
        "csrf": "/api/csrf-token",
        "message": "GymForce FastAPI Backend is up and running.",
    }

