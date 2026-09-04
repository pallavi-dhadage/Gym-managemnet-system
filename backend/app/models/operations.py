import uuid
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Date, DateTime, Text, Boolean, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Receptionist(Base):
    __tablename__ = "receptionists"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    shift_timing = Column(String(100), default="Morning (6 AM - 2 PM)")

    user = relationship("User", back_populates="receptionist_profile")
    inquiries = relationship("Inquiry", back_populates="handled_by_receptionist")


class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialization = Column(String(120), default="Strength & Conditioning")
    bio = Column(Text, default="")
    experience_years = Column(Integer, default=3)
    rating = Column(Float, default=4.9)

    user = relationship("User", back_populates="trainer_profile")
    workout_diet_plans = relationship("WorkoutDietPlan", back_populates="trainer")


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(120), nullable=False)
    email = Column(String(120), default="")
    phone = Column(String(30), nullable=False)
    interest = Column(String(100), default="General")
    message = Column(Text, default="")
    status = Column(String(30), default="open")  # open, responded, follow_up_due, closed, converted
    response = Column(Text, default="")
    via = Column(String(30), default="form")  # form, chat, walk-in, phone, sms
    follow_up = Column(Date, nullable=True)
    follow_up_note = Column(Text, default="")
    converted_to_member = Column(Boolean, default=False)
    handled_by_id = Column(String(36), ForeignKey("receptionists.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    handled_by_receptionist = relationship("Receptionist", back_populates="inquiries")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    member_id = Column(Integer, ForeignKey("member_profiles.id", ondelete="CASCADE"), nullable=False)
    session_date = Column(Date, default=date.today, nullable=False)
    check_in_time = Column(DateTime, default=datetime.utcnow)
    zone = Column(String(50), default="Main Gym Floor")  # Cardio Zone, Free Weights, Crossfit, Studio

    __table_args__ = (
        UniqueConstraint("member_id", "session_date", name="unique_member_session_date"),
    )

    member = relationship("MemberProfile", back_populates="attendance_records")


class WorkoutDietPlan(Base):
    __tablename__ = "workout_diet_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    member_id = Column(Integer, ForeignKey("member_profiles.id", ondelete="CASCADE"), nullable=False)
    trainer_id = Column(String(36), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=False)
    workout_text = Column(Text, default="")
    diet_text = Column(Text, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("MemberProfile", back_populates="workout_diet_plans")
    trainer = relationship("Trainer", back_populates="workout_diet_plans")


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String(36), primary_key=True, default=lambda: f"EQ-{uuid.uuid4().hex[:6].upper()}")
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="Cardio")  # Cardio, Strength, Free Weights, Functional
    qty = Column(Integer, default=1)
    condition = Column(String(30), default="Good")  # Good, Fair, Needs Repair
    last_maintenance = Column(Date, nullable=True)
    next_maintenance = Column(Date, nullable=True)
    status = Column(String(30), default="Available")  # Available, Under Maintenance, Out of Service
    location = Column(String(100), default="Main Floor")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: f"PRD-{uuid.uuid4().hex[:6].upper()}")
    name = Column(String(120), nullable=False)
    category = Column(String(60), default="Supplements")  # Supplements, Equipment, Accessories, Apparel
    price = Column(Float, default=0.0, nullable=False)
    stock = Column(Integer, default=0)
    sku = Column(String(50), default="")
    emoji = Column(String(20), default="📦")
    description = Column(Text, default="")


class Offer(Base):
    __tablename__ = "offers"

    id = Column(String(36), primary_key=True, default=lambda: f"OFF-{uuid.uuid4().hex[:6].upper()}")
    title = Column(String(120), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    category = Column(String(50), default="Membership")  # Membership, Product, Seasonal, Referral
    discount_type = Column(String(30), default="Percentage")  # Percentage, Fixed Amount
    discount_value = Column(Float, default=0.0, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    max_uses = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0)
    description = Column(Text, default="")
    is_active = Column(Boolean, default=True)
