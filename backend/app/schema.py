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

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: RoleEnum

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

    class Config:
        orm_mode = True
