from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

class UsuarioBase(BaseModel):
    dni: str = Field(..., pattern=r"^\d{8}$", description="Documento Nacional de Identidad (8 dígitos).", example="12345678")
    nombres: str = Field(..., min_length=3, description="Nombres y apellidos del usuario.", example="Ana Torres")
    telefono: str = Field(..., pattern=r"^9\d{8}$", description="Celular peruano de 9 dígitos.", example="987654321")
    correo: str = Field(..., description="Correo electrónico.", example="ana@gmail.com")
    rol: Literal["adoptante", "rescatista", "admin"] = Field(default="adoptante", description="Rol del usuario.")

class UsuarioCreate(UsuarioBase):
    clave: str = Field(..., min_length=8, description="Contraseña de la cuenta.")

class UsuarioUpdate(BaseModel):
    nombres: Optional[str] = Field(default=None, min_length=3)
    telefono: Optional[str] = Field(default=None, pattern=r"^9\d{8}$")
    correo: Optional[str] = None
    rol: Optional[Literal["adoptante", "rescatista", "admin"]] = None
    clave: Optional[str] = Field(default=None, min_length=8)

class Usuario(UsuarioBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
