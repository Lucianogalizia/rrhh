from datetime import datetime, timedelta
from jose import jwt
from core.settings import settings

def create_access_token(data: dict, expires_minutes: int = 480):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
