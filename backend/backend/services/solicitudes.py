from typing import List, Optional
from backend.backend.repositories.solicitudes import solicitud_repository, SolicitudRepository
from backend.backend.repositories.animales import animal_repository
from backend.backend.schemas.solicitudes import Solicitud, SolicitudCreate
from backend.backend.services.exceptions import AnimalNotFoundError

class SolicitudService:
    def __init__(self, repo: SolicitudRepository = solicitud_repository):
        self.repo = repo

    def listar(self, estado: Optional[str] = None, rescatista_id: Optional[int] = None) -> List[Solicitud]:
        return self.repo.listar_todas(estado=estado, rescatista_id=rescatista_id)

    def obtener_por_id(self, solicitud_id: int) -> Solicitud:
        solicitud = self.repo.obtener_por_id(solicitud_id)
        if not solicitud:
            raise Exception("Solicitud no encontrada")
        return solicitud

    def crear(self, data: SolicitudCreate) -> Solicitud:
        animal = animal_repository.obtener_por_id(data.animal_id)
        if not animal:
            raise AnimalNotFoundError("El animal solicitado no existe.")
        return self.repo.crear(data)

    def cambiar_estado(self, solicitud_id: int, estado: str) -> Solicitud:
        solicitud = self.obtener_por_id(solicitud_id)
        res = self.repo.actualizar_estado(solicitud_id, estado)
        if estado == "aprobada":
            from backend.backend.schemas.animales import AnimalUpdate
            animal_repository.actualizar(solicitud.animal_id, AnimalUpdate(estado="adoptado"))
        return res

solicitud_service = SolicitudService()
