from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

class DenunciaBase(BaseModel):
    titulo: str = Field(..., max_length=200)
    descripcion: str
    ubicacion: str = Field(..., max_length=255)
    contacto: Optional[str] = None
    estado: Literal["pendiente", "en_revision", "atendida"] = "pendiente"

class DenunciaCreate(BaseModel):
    titulo: str
    descripcion: str
    ubicacion: str
    contacto: Optional[str] = None

class DenunciaUpdate(BaseModel):
    estado: Literal["pendiente", "en_revision", "atendida"]

class Denuncia(DenunciaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
