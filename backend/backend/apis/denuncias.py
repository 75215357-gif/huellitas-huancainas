from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from backend.backend.schemas.denuncias import Denuncia, DenunciaCreate, DenunciaUpdate
from backend.backend.services.denuncias import denuncia_service

router = APIRouter(prefix="/denuncias", tags=["Denuncias"])

@router.get("", response_model=List[Denuncia])
def listar_denuncias(estado: Optional[str] = Query(None)):
    return denuncia_service.listar(estado=estado)

@router.get("/{denuncia_id}", response_model=Denuncia)
def obtener_denuncia(denuncia_id: int = Path(...)):
    return denuncia_service.obtener_por_id(denuncia_id)

@router.post("", response_model=Denuncia, status_code=status.HTTP_201_CREATED)
def crear_denuncia(data: DenunciaCreate):
    return denuncia_service.crear(data)

@router.patch("/{denuncia_id}", response_model=Denuncia)
def actualizar_denuncia(denuncia_id: int, data: DenunciaUpdate):
    return denuncia_service.actualizar(denuncia_id, data)
