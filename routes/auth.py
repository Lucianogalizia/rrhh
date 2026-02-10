from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.settings import settings
from core.security import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    user = settings.TEST_USER

    if data.email != user["email"] or data.password != user["password"]:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({
        "email": user["email"],
        "team": user["team"],
        "role": user["role"]
    })

    return {
        "access_token": token,
        "user": {
            "name": user["name"],
            "lastname": user["lastname"],
            "email": user["email"],
            "team": user["team"]
        }
    }
