from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, Text
from app.database import Base
import enum
from datetime import datetime, timezone

class RoleEnum(str, enum.Enum):
    manager = "manager"
    employee = "employee"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), nullable=False)
    team_id = Column(Integer, index=True, nullable=True)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    manager_id = Column(Integer, ForeignKey("users.id"))
    employee_id = Column(Integer, ForeignKey("users.id"))
    strengths = Column(Text)
    areas_to_improve = Column(Text)
    sentiment = Column(String)
    tags = Column(String)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    acknowledged = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=False)
