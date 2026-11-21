from typing import List
from fastapi import APIRouter, Path, Query, status
from backend.backend.schemas.seguimientos import Seguimiento, SeguimientoCreate
from backend.backend.services.seguimientos import seguimiento_service

router = APIRouter(prefix="/seguimientos", tags=["Seguimientos"])

@router.get("", response_model=List[Seguimiento])
def listar_seguimientos(solicitud_id: int = Query(...)):
    return seguimiento_service.listar_por_solicitud(solicitud_id)

@router.post("", response_model=Seguimiento, status_code=status.HTTP_201_CREATED)
def crear_seguimiento(data: SeguimientoCreate):
    return seguimiento_service.crear(data)
