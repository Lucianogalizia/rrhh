from fastapi import Header, HTTPException
from core.security import decode_token

def get_current_user(authorization: str = Header(default="")) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta token Bearer")

    token = authorization.split(" ", 1)[1].strip()
    payload = decode_token(token)

    if not payload or "email" not in payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    return payload
