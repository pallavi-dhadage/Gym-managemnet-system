import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ── Security ───────────────────────────────────────────────────────────────
    SECRET_KEY = os.environ.get("SECRET_KEY") or "change-me-in-production"
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600   # 1 hour

    # ── Database ───────────────────────────────────────────────────────────────
    _base = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or \
        f"sqlite:///{os.path.join(_base, 'gym.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    # ── Session ────────────────────────────────────────────────────────────────
    SESSION_COOKIE_HTTPONLY  = True
    SESSION_COOKIE_SAMESITE  = "Lax"
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 86400   # 1 day

    # ── Mail (SMTP) ────────────────────────────────────────────────────────────
    MAIL_SERVER   = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT     = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS  = True
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER", "noreply@gymforce.local")

    # ── UPI ────────────────────────────────────────────────────────────────────
    GYM_UPI_ID   = os.environ.get("GYM_UPI_ID", "gym@upi")
    GYM_NAME     = os.environ.get("GYM_NAME", "GymForce")

    # ── Rate Limiting ──────────────────────────────────────────────────────────
    RATELIMIT_DEFAULT = "200 per day;50 per hour"
    RATELIMIT_STORAGE_URI = "memory://"

    # ── Upload ─────────────────────────────────────────────────────────────────
    MAX_CONTENT_LENGTH = 2 * 1024 * 1024   # 2 MB
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "uploads")


class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = False


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True      # HTTPS only
    REMEMBER_COOKIE_SECURE = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
    RATELIMIT_ENABLED = False


config = {
    "development": DevelopmentConfig,
    "production":  ProductionConfig,
    "testing":     TestingConfig,
    "default":     DevelopmentConfig,
}
