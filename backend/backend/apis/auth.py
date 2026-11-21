from fastapi import APIRouter, status
from backend.backend.schemas.auth import LoginRequest, RegistroRequest, AuthResponse
from backend.backend.services.auth import auth_service

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest):
    return auth_service.login(data)

@router.post("/registro", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def registro(data: RegistroRequest):
    return auth_service.registro(data)
