import uuid
from datetime import date, timedelta
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    member_id = Column(Integer, ForeignKey("member_profiles.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(Integer, ForeignKey("membership_plans.id", ondelete="RESTRICT"), nullable=False)
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String(20), default="active")  # active, expired, cancelled

    # Relationships
    member = relationship("MemberProfile", back_populates="subscriptions")
    plan = relationship("MembershipPlan", back_populates="subscriptions")


class Trial(Base):
    __tablename__ = "trials"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(30), unique=True, index=True, nullable=False)
    member_id = Column(Integer, ForeignKey("member_profiles.id", ondelete="SET NULL"), nullable=True)
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, default=lambda: date.today() + timedelta(days=2), nullable=False)
    status = Column(String(20), default="active")  # active, expired, converted

    # Relationships
    member = relationship("MemberProfile", back_populates="trials")
