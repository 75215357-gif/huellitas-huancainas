from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class SeguimientoBase(BaseModel):
    solicitud_id: int
    comentarios: str
    foto_avance: Optional[str] = None

class SeguimientoCreate(SeguimientoBase):
    pass

class Seguimiento(SeguimientoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
