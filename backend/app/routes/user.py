from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.auth import verify_password, get_db, get_hashed_password
from app.models.models import User
from app.schema import UserCreate, UserLogin, UserOut
from app.utils.jwt import create_token
from typing import Optional, cast
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Auth"])

@router.post("/signup", response_model=UserOut)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        hashed_password=get_hashed_password(user_data.password),
        role=user_data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    response = JSONResponse(content=UserOut.model_validate(user).model_dump())
    create_token({"user_id": user.id, "role": user.role}, response)
    return response

@router.post("/login", response_model=UserOut)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user:Optional[User] = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, cast(str, user.hashed_password)):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    response = JSONResponse(content=UserOut.model_validate(user).model_dump())
    create_token({"user_id": user.id, "role": user.role}, response)
    return response

@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out successfully."})
    response.delete_cookie("access_token", path="/")
    return response
    
