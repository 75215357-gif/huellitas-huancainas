from typing import List, Optional
from fastapi import APIRouter, Path, Query, status
from backend.backend.schemas.animales import Animal, AnimalCreate, AnimalUpdate
from backend.backend.services.animales import animal_service

router = APIRouter(prefix="/animales", tags=["Animales"])

@router.get("", response_model=List[Animal])
def listar_animales(
    especie: Optional[str] = Query(None, description="Filtrar por especie: Perro o Gato"),
    tamano: Optional[str] = Query(None, description="Filtrar por tamaño: Pequeño, Mediano o Grande")
):
    return animal_service.listar(especie=especie, tamano=tamano)

@router.get("/{animal_id}", response_model=Animal)
def obtener_animal(animal_id: int = Path(..., description="ID del animal")):
    return animal_service.obtener_por_id(animal_id)

@router.post("", response_model=Animal, status_code=status.HTTP_201_CREATED)
def crear_animal(data: AnimalCreate):
    return animal_service.crear(data)

@router.patch("/{animal_id}", response_model=Animal)
def actualizar_animal(animal_id: int, data: AnimalUpdate):
    return animal_service.actualizar(animal_id, data)

@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_animal(animal_id: int):
    animal_service.eliminar(animal_id)
