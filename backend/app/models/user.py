from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(120), nullable=False)
    role = Column(String(30), default="member", nullable=False)  # master_admin, staff, receptionist, trainer, member
    phone = Column(String(30), default="")
    avatar_url = Column(String(255), default="")
    gym = Column(String(100), default="GymForce HQ")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    member_profile = relationship("MemberProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    payments = relationship("PaymentRecord", back_populates="user", cascade="all, delete-orphan")
    trainer_profile = relationship("Trainer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    receptionist_profile = relationship("Receptionist", back_populates="user", uselist=False, cascade="all, delete-orphan")
