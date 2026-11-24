from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from backend.backend.schemas.solicitudes import Solicitud, SolicitudCreate, SolicitudUpdateEstado
from backend.backend.services.solicitudes import solicitud_service

router = APIRouter(prefix="/solicitudes", tags=["Solicitudes"])

@router.get("", response_model=List[Solicitud])
def listar_solicitudes(
    estado: Optional[str] = Query(None),
    rescatista_id: Optional[int] = Query(None)
):
    return solicitud_service.listar(estado=estado, rescatista_id=rescatista_id)

@router.get("/{solicitud_id}", response_model=Solicitud)
def obtener_solicitud(solicitud_id: int = Path(...)):
    return solicitud_service.obtener_por_id(solicitud_id)

@router.post("", response_model=Solicitud, status_code=status.HTTP_201_CREATED)
def crear_solicitud(data: SolicitudCreate):
    return solicitud_service.crear(data)

@router.patch("/{solicitud_id}/estado", response_model=Solicitud)
def cambiar_estado(solicitud_id: int, data: SolicitudUpdateEstado):
    return solicitud_service.cambiar_estado(solicitud_id, data.estado)
