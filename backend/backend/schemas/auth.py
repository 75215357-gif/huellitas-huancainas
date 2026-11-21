from pydantic import BaseModel, Field
from backend.backend.schemas.usuarios import Usuario

class LoginRequest(BaseModel):
    correo: str = Field(..., description="Correo del usuario registrado.", example="juan@gmail.com")
    clave: str = Field(..., min_length=8, description="Contraseña de la cuenta.", example="12345678")

class RegistroRequest(BaseModel):
    dni: str = Field(..., pattern=r"^\d{8}$")
    nombres: str = Field(..., min_length=3)
    telefono: str = Field(..., pattern=r"^9\d{8}$")
    correo: str = Field(...)
    rol: str = Field(default="adoptante")
    clave: str = Field(..., min_length=8)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: Usuario
