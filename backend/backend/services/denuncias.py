from typing import List, Optional
from backend.backend.repositories.denuncias import denuncia_repository, DenunciaRepository
from backend.backend.schemas.denuncias import Denuncia, DenunciaCreate, DenunciaUpdate
from backend.backend.services.exceptions import DenunciaNotFoundError

class DenunciaService:
    def __init__(self, repo: DenunciaRepository = denuncia_repository):
        self.repo = repo

    def listar(self, estado: Optional[str] = None) -> List[Denuncia]:
        return self.repo.listar_todas(estado=estado)

    def obtener_por_id(self, denuncia_id: int) -> Denuncia:
        denuncia = self.repo.obtener_por_id(denuncia_id)
        if not denuncia:
            raise DenunciaNotFoundError("Denuncia no encontrada.")
        return denuncia

    def crear(self, data: DenunciaCreate) -> Denuncia:
        return self.repo.crear(data)

    def actualizar(self, denuncia_id: int, data: DenunciaUpdate) -> Denuncia:
        self.obtener_por_id(denuncia_id)
        return self.repo.actualizar(denuncia_id, data)

denuncia_service = DenunciaService()
