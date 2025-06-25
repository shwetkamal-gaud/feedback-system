from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, Text
from app.database import Base
import enum
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

class RoleEnum(str, enum.Enum):
    manager = "manager"
    employee = "employee"


class RequestStatus(str, enum.Enum):
    pending = "pending"
    fulfilled = "fulfilled"
    rejected = "rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="members", foreign_keys=[team_id])
    managing_team = relationship("Team", back_populates="manager", uselist=False, foreign_keys="Team.manager_id")

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

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    manager = relationship("User", back_populates="managing_team", foreign_keys=[manager_id])
    members = relationship("User", back_populates="team", foreign_keys="User.team_id")

class FeedbackRequest(Base):
    __tablename__ = "feedbackReq"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
    message = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notification"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

