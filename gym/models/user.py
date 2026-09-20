from datetime import datetime
from flask_login import UserMixin
from gym.extensions import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(120), nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone         = db.Column(db.String(20),  nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    # roles: member | trainer | admin
    role          = db.Column(db.String(20),  nullable=False, default="member")
    is_active     = db.Column(db.Boolean,     default=True,  nullable=False)
    created_at    = db.Column(db.DateTime,    default=datetime.utcnow, nullable=False)
    updated_at    = db.Column(db.DateTime,    default=datetime.utcnow,
                              onupdate=datetime.utcnow, nullable=False)

    # ── Relationships ──────────────────────────────────────────────────────────
    memberships    = db.relationship("Membership", back_populates="user",
                                     lazy="dynamic", cascade="all, delete-orphan",
                                     foreign_keys="Membership.user_id")
    payments       = db.relationship("Payment", back_populates="user",
                                     lazy="dynamic", cascade="all, delete-orphan",
                                     foreign_keys="Payment.user_id")
    notes_received = db.relationship("TrainerNote", back_populates="member",
                                     lazy="dynamic", cascade="all, delete-orphan",
                                     foreign_keys="TrainerNote.member_id")
    notes_written  = db.relationship("TrainerNote", back_populates="trainer",
                                     lazy="dynamic",
                                     foreign_keys="TrainerNote.trainer_id")

    # ── Helpers ────────────────────────────────────────────────────────────────
    @property
    def active_membership(self):
        """Return the current ACTIVE membership or None."""
        from gym.models.membership import Membership  # avoid circular
        return (self.memberships
                .filter_by(status="ACTIVE")
                .order_by(Membership.end_date.desc())
                .first())

    @property
    def pending_membership(self):
        """Return the latest PENDING membership or None."""
        return (self.memberships
                .filter_by(status="PENDING")
                .order_by(self.__class__.created_at.desc())
                .first())

    def __repr__(self):
        return f"<User {self.email} [{self.role}]>"
