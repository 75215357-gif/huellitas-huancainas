from typing import List
from fastapi import APIRouter, Path, status
from backend.backend.schemas.usuarios import Usuario, UsuarioCreate, UsuarioUpdate
from backend.backend.services.usuarios import usuario_service

router = APIRouter(prefix="/personas", tags=["Personas"])

@router.get("", response_model=List[Usuario])
def listar_personas():
    return usuario_service.listar()

@router.get("/{user_id}", response_model=Usuario)
def obtener_persona(user_id: int = Path(..., description="ID de la persona")):
    return usuario_service.obtener_por_id(user_id)
