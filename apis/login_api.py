from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.config import Config

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", tags=["Login"])
async def login(request: LoginRequest):
    """
    Endpoint to authenticate users.

    Args:
        request (LoginRequest): Contains username and password.

    Returns:
        dict: Authentication status.
    """
    if request.username == Config.ADMIN_USERNAME and request.password == Config.ADMIN_PASSWORD:
        return {"status": "success", "message": "Login successful."}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
