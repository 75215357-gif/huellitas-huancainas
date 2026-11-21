from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

class SolicitudBase(BaseModel):
    animal_id: int
    adoptante_id: int
    mensaje: Optional[str] = None
    estado: Literal["pendiente", "aprobada", "rechazada"] = "pendiente"

class SolicitudCreate(BaseModel):
    animal_id: int
    adoptante_id: int
    mensaje: Optional[str] = None

class SolicitudUpdateEstado(BaseModel):
    estado: Literal["pendiente", "aprobada", "rechazada"]

class Solicitud(SolicitudBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
