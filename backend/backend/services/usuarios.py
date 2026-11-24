from typing import List, Optional
from backend.backend.repositories.usuarios import usuario_repository, UsuarioRepository
from backend.backend.schemas.usuarios import Usuario, UsuarioCreate, UsuarioUpdate
from backend.backend.services.exceptions import UsuarioNotFoundError, UsuarioAlreadyExistsError

class UsuarioService:
    def __init__(self, repo: UsuarioRepository = usuario_repository):
        self.repo = repo

    def listar(self, rol: Optional[str] = None, estado_rescatista: Optional[str] = None) -> List[Usuario]:
        return self.repo.listar_todos(rol=rol, estado_rescatista=estado_rescatista)

    def obtener_por_id(self, user_id: int) -> Usuario:
        user = self.repo.obtener_por_id(user_id)
        if not user:
            raise UsuarioNotFoundError(f"Usuario con ID {user_id} no encontrado")
        return user

    def crear(self, data: UsuarioCreate) -> Usuario:
        if self.repo.obtener_por_correo(data.correo):
            raise UsuarioAlreadyExistsError("El correo electrónico ya se encuentra registrado.")
        if self.repo.obtener_por_dni(data.dni):
            raise UsuarioAlreadyExistsError("El DNI ya se encuentra registrado.")
        return self.repo.crear(data)

    def actualizar(self, user_id: int, data: UsuarioUpdate) -> Usuario:
        self.obtener_por_id(user_id)
        return self.repo.actualizar(user_id, data)

    def eliminar(self, user_id: int) -> bool:
        self.obtener_por_id(user_id)
        return self.repo.eliminar(user_id)

usuario_service = UsuarioService()
