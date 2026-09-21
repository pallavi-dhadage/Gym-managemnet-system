"""
gym/utils/seed.py
Seeds default plans into the database if they don't exist.
Only runs when tables are already present (safe for tests).
"""
import logging
from decimal import Decimal

log = logging.getLogger(__name__)

DEFAULT_PLANS = [
    {"name": "Monthly",   "description": "Full gym access for 1 month.",
     "price": Decimal("999"),   "duration_days": 30},
    {"name": "Quarterly", "description": "Best value — 3 months of full access.",
     "price": Decimal("2499"),  "duration_days": 90},
    {"name": "Annual",    "description": "Premium — 12 months unlimited access.",
     "price": Decimal("7999"),  "duration_days": 365},
]


def seed_plans(app) -> None:
    """Insert default plans if the plans table is empty.
    Silently skips if tables don't exist yet (e.g. first-run before migrate).
    """
    from sqlalchemy import inspect
    from gym.extensions import db
    from gym.models.membership import Plan

    with app.app_context():
        try:
            inspector = inspect(db.engine)
            if "plans" not in inspector.get_table_names():
                return          # Tables not created yet — skip seeding
            if Plan.query.count() == 0:
                for data in DEFAULT_PLANS:
                    db.session.add(Plan(**data, is_active=True))
                db.session.commit()
                log.info("Seeded %d default plans.", len(DEFAULT_PLANS))
        except Exception as exc:
            log.warning("seed_plans skipped: %s", exc)
