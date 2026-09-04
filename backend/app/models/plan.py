from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class MembershipPlan(Base):
    __tablename__ = "membership_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(80), nullable=False)
    category = Column(String(30), default="Mixed")  # Ladies, Mens, Mixed
    duration_days = Column(Integer, default=30)
    price = Column(Float, default=0.0, nullable=False)
    description = Column(Text, default="")
    popular = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    payments = relationship("PaymentRecord", back_populates="plan")
    subscriptions = relationship("Subscription", back_populates="plan")
