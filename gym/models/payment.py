from datetime import datetime
from gym.extensions import db


class Payment(db.Model):
    """Payment record linked to a membership (UPI / UTR flow)."""
    __tablename__ = "payments"

    id             = db.Column(db.Integer, primary_key=True)
    membership_id  = db.Column(db.Integer, db.ForeignKey("memberships.id",
                               ondelete="CASCADE"), nullable=False, index=True)
    user_id        = db.Column(db.Integer, db.ForeignKey("users.id",
                               ondelete="CASCADE"), nullable=False, index=True)

    amount         = db.Column(db.Numeric(10, 2), nullable=False)
    utr            = db.Column(db.String(50),  nullable=True, unique=True)
    upi_id         = db.Column(db.String(100), nullable=True)   # gym UPI id at time of payment
    screenshot_path = db.Column(db.String(255), nullable=True)  # relative path in static/uploads

    # status: SUBMITTED | VERIFIED | REJECTED
    status         = db.Column(db.String(20),  nullable=False, default="SUBMITTED")

    submitted_at   = db.Column(db.DateTime,    default=datetime.utcnow, nullable=False)
    verified_at    = db.Column(db.DateTime,    nullable=True)
    verified_by_id = db.Column(db.Integer,     db.ForeignKey("users.id",
                               ondelete="SET NULL"), nullable=True)
    rejection_reason = db.Column(db.Text,      nullable=True)

    # Relationships
    membership   = db.relationship("Membership", back_populates="payments")
    user         = db.relationship("User", foreign_keys=[user_id],
                                   back_populates="payments")
    verified_by  = db.relationship("User", foreign_keys=[verified_by_id])

    def __repr__(self):
        return f"<Payment utr={self.utr} [{self.status}]>"
