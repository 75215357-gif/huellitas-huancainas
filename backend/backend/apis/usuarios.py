from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from backend.backend.schemas.usuarios import Usuario, UsuarioCreate, UsuarioUpdate
from backend.backend.services.usuarios import usuario_service

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("", response_model=List[Usuario])
def listar_usuarios(
    rol: Optional[str] = Query(None),
    estado_rescatista: Optional[str] = Query(None)
):
    return usuario_service.listar(rol=rol, estado_rescatista=estado_rescatista)

@router.get("/{user_id}", response_model=Usuario)
def obtener_usuario(user_id: int = Path(..., description="ID del usuario")):
    return usuario_service.obtener_por_id(user_id)

@router.post("", response_model=Usuario, status_code=status.HTTP_201_CREATED)
def crear_usuario(data: UsuarioCreate):
    return usuario_service.crear(data)

@router.patch("/{user_id}", response_model=Usuario)
def actualizar_usuario(user_id: int, data: UsuarioUpdate):
    return usuario_service.actualizar(user_id, data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(user_id: int):
    usuario_service.eliminar(user_id)
