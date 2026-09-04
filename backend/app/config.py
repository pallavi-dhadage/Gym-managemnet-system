import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "GymForce API"
    PROJECT_DESCRIPTION: str = "Modern FastAPI backend for GymForce Gym Management System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-gymforce-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # PostgreSQL Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/postgres")


    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = [
        "Authorization",
        "Content-Type",
        "X-CSRF-Token",
        "X-CSRFToken",
        "X-XSRF-TOKEN",
        "X-Requested-With",
        "Accept",
        "Origin",
    ]
    CORS_EXPOSE_HEADERS: List[str] = ["X-CSRF-Token", "Content-Disposition"]

    # CSRF Protection Settings
    CSRF_ENABLED: bool = True
    CSRF_COOKIE_NAME: str = "csrftoken"
    CSRF_HEADER_NAME: str = "X-CSRF-Token"
    CSRF_COOKIE_SECURE: bool = False  # Set to True for HTTPS in production
    CSRF_COOKIE_SAMESITE: str = "lax"
    CSRF_COOKIE_MAX_AGE: int = 86400  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()

