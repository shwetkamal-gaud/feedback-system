import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from typing import Dict, Any, cast
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()

SECRET_KEY = cast(str, os.getenv("SECRET_KEY"))
ALGORITHM = cast(str, os.getenv("ALGORITHM"))
IS_DEV = os.getenv("ENV", "development") == "development"

def  create_token(data: Dict[str, Any], response: JSONResponse):
    expiration = datetime.now(timezone.utc) + timedelta(minutes=360)
    data.update({"exp": expiration})
    if not SECRET_KEY or not ALGORITHM:
        raise ValueError("Missing SECRET_KEY or ALGORITHM in environment variables.")
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=not IS_DEV,
    samesite="lax" if IS_DEV else "none",
    max_age=360*60
    )
    

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None