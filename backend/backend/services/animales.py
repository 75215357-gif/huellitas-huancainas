from typing import List, Optional
from backend.backend.repositories.animales import animal_repository, AnimalRepository
from backend.backend.repositories.usuarios import usuario_repository, UsuarioRepository
from backend.backend.schemas.animales import Animal, AnimalCreate, AnimalUpdate
from backend.backend.services.exceptions import AnimalNotFoundError, RescatistaNotFoundError

class AnimalService:
    def __init__(self, repo: AnimalRepository = animal_repository, user_repo: UsuarioRepository = usuario_repository):
        self.repo = repo
        self.user_repo = user_repo

    def listar(
        self,
        especie: Optional[str] = None,
        tamano: Optional[str] = None,
        rescatista_id: Optional[int] = None,
        estado: Optional[str] = None
    ) -> List[Animal]:
        return self.repo.listar_todos(
            especie=especie,
            tamano=tamano,
            rescatista_id=rescatista_id,
            estado=estado
        )

    def obtener_por_id(self, animal_id: int) -> Animal:
        animal = self.repo.obtener_por_id(animal_id)
        if not animal:
            raise AnimalNotFoundError(f"No se encontró el animal con ID {animal_id}")
        return animal

    def crear(self, data: AnimalCreate) -> Animal:
        if data.rescatista_id:
            rescatista = self.user_repo.obtener_por_id(data.rescatista_id)
            if not rescatista:
                raise RescatistaNotFoundError("El rescatista especificado no existe.")
        return self.repo.crear(data)

    def actualizar(self, animal_id: int, data: AnimalUpdate) -> Animal:
        animal = self.obtener_por_id(animal_id)
        return self.repo.actualizar(animal_id, data)

    def eliminar(self, animal_id: int) -> bool:
        self.obtener_por_id(animal_id)
        return self.repo.eliminar(animal_id)

animal_service = AnimalService()
