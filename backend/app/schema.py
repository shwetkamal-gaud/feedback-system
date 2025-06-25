from pydantic import BaseModel, EmailStr
from typing import  List
from enum import Enum
from datetime import datetime

class RoleEnum(str, Enum):
    manager = "manager"
    employee = "employee"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: RoleEnum
    name: str
    team_name:str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: RoleEnum
    name: str
    model_config = {
        "from_attributes": True
    }


class FeedbackCreate(BaseModel):
    employee_id: int
    strengths: str
    areas_to_improve: str
    sentiment: str  
    tags: List[str]
    is_anonymous: bool = False

class FeedbackOut(BaseModel):
    id: int
    manager_id: int
    employee_id: int
    strengths: str
    areas_to_improve: str
    sentiment: str
    tags: str
    timestamp: datetime
    acknowledged: bool
    is_anonymous: bool

    model_config = {
        "from_attributes": True
    }

class FeedbackRequestIn(BaseModel):
    message: str | None = None 


class FeedbackRequestOut(BaseModel):
    id: int
    employee_id: int
    manager_id: int
    message: str | None
    status: str  
    timestamp: datetime

    model_config = {
        "from_attributes": True
    }

class NotificationOut(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }