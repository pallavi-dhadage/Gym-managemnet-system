from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(Integer, ForeignKey("membership_plans.id", ondelete="RESTRICT"), nullable=False)
    amount = Column(Float, default=0.0, nullable=False)
    transaction_reference = Column(String(120), default="")
    payment_method = Column(String(40), default="UPI")  # UPI, Card, Cash, NetBanking
    status = Column(String(20), default="pending")  # pending, verified, rejected, failed
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="payments")
    plan = relationship("MembershipPlan", back_populates="payments")
