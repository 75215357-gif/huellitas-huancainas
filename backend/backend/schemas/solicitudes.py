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
    fecha_solicitud: Optional[str] = None
    animal_nombre: Optional[str] = None
    animal_especie: Optional[str] = None
    animal_foto: Optional[str] = None
    rescatista_id: Optional[int] = None
    adoptante_nombres: Optional[str] = None
    adoptante_correo: Optional[str] = None
    adoptante_telefono: Optional[str] = None
    adoptante_dni: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
