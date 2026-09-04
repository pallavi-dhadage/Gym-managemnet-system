from app.routers.auth import router as auth_router
from app.routers.members import router as members_router
from app.routers.plans import router as plans_router
from app.routers.payments import router as payments_router
from app.routers.subscriptions import router as subscriptions_router
from app.routers.attendance import router as attendance_router
from app.routers.inquiries import router as inquiries_router
from app.routers.operations import router as operations_router
from app.routers.dashboard import router as dashboard_router

__all__ = [
    "auth_router",
    "members_router",
    "plans_router",
    "payments_router",
    "subscriptions_router",
    "attendance_router",
    "inquiries_router",
    "operations_router",
    "dashboard_router",
]
