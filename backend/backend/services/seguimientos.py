from typing import List
from backend.backend.repositories.seguimientos import seguimiento_repository, SeguimientoRepository
from backend.backend.repositories.solicitudes import solicitud_repository
from backend.backend.schemas.seguimientos import Seguimiento, SeguimientoCreate

class SeguimientoService:
    def __init__(self, repo: SeguimientoRepository = seguimiento_repository):
        self.repo = repo

    def listar_por_solicitud(self, solicitud_id: int) -> List[Seguimiento]:
        return self.repo.listar_por_solicitud(solicitud_id)

    def crear(self, data: SeguimientoCreate) -> Seguimiento:
        solicitud = solicitud_repository.obtener_por_id(data.solicitud_id)
        if not solicitud:
            raise Exception("La solicitud asociada no existe.")
        return self.repo.crear(data)

seguimiento_service = SeguimientoService()
