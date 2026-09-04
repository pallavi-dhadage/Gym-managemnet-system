from datetime import date
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class MemberProfile(Base):
    __tablename__ = "member_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    member_id = Column(String(30), unique=True, index=True, nullable=False)
    gender = Column(String(20), default="")
    category = Column(String(30), default="Mixed")  # Ladies, Mens, Mixed
    date_of_birth = Column(Date, nullable=True)
    address = Column(Text, default="")
    emergency_contact = Column(String(60), default="")
    join_date = Column(Date, default=date.today)
    status = Column(String(20), default="active")  # active, expired, pending, inactive
    height = Column(String(20), default="")
    weight = Column(String(20), default="")
    bmi = Column(String(20), default="")
    goal = Column(String(100), default="fitness")
    diet_plan = Column(String(120), default="")
    notes = Column(Text, default="")

    # Relationships
    user = relationship("User", back_populates="member_profile")
    subscriptions = relationship("Subscription", back_populates="member", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="member", cascade="all, delete-orphan")
    workout_diet_plans = relationship("WorkoutDietPlan", back_populates="member", cascade="all, delete-orphan")
    trials = relationship("Trial", back_populates="member")
