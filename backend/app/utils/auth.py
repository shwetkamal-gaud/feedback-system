from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt
from .jwt import decode_token
from ..database import SessionLocal
from ..models.models import User
from fastapi import Request

def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing access token in cookie")
    return token.replace("Bearer ", "")



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_hashed_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password:str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_current_user(token: str = Depends(get_token_from_cookie), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_role(role: str):
    def wrapper(user: User = Depends(get_current_user)):
        if user.role.value != role:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return wrapper
