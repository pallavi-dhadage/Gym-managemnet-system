from datetime import datetime, date
from gym.extensions import db


class Plan(db.Model):
    """Membership plan catalogue (e.g. Monthly, Quarterly, Annual)."""
    __tablename__ = "plans"

    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(80),  nullable=False, unique=True)
    description   = db.Column(db.Text,        nullable=True)
    price         = db.Column(db.Numeric(10, 2), nullable=False)
    duration_days = db.Column(db.Integer,     nullable=False)   # e.g. 30, 90, 365
    is_active     = db.Column(db.Boolean,     default=True, nullable=False)
    created_at    = db.Column(db.DateTime,    default=datetime.utcnow, nullable=False)

    memberships   = db.relationship("Membership", back_populates="plan", lazy="dynamic")

    def __repr__(self):
        return f"<Plan {self.name} ₹{self.price}/{self.duration_days}d>"


class Membership(db.Model):
    """A member's active/pending/expired membership record."""
    __tablename__ = "memberships"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id",
                           ondelete="CASCADE"), nullable=False, index=True)
    plan_id    = db.Column(db.Integer, db.ForeignKey("plans.id",
                           ondelete="RESTRICT"), nullable=False)

    # status: PENDING | ACTIVE | EXPIRED | CANCELLED
    status     = db.Column(db.String(20), nullable=False, default="PENDING")

    start_date = db.Column(db.Date,    nullable=True)   # set when ACTIVE
    end_date   = db.Column(db.Date,    nullable=True)   # set when ACTIVE
    reminder_sent = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user    = db.relationship("User",    back_populates="memberships")
    plan    = db.relationship("Plan",    back_populates="memberships")
    payments = db.relationship("Payment", back_populates="membership",
                               lazy="dynamic", cascade="all, delete-orphan")

    @property
    def is_expired(self) -> bool:
        if self.end_date and self.status == "ACTIVE":
            return date.today() > self.end_date
        return False

    @property
    def days_remaining(self) -> int | None:
        if self.end_date and self.status == "ACTIVE":
            delta = (self.end_date - date.today()).days
            return max(delta, 0)
        return None

    def __repr__(self):
        return f"<Membership user={self.user_id} plan={self.plan_id} [{self.status}]>"
