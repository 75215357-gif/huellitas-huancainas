import base64
import time
import uuid
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Path as PathParam, Query, status
from pydantic import BaseModel
from backend.backend.schemas.animales import Animal, AnimalCreate, AnimalUpdate
from backend.backend.services.animales import animal_service

router = APIRouter(prefix="/animales", tags=["Animales"])

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent.parent
FOTOS_DIR = WORKSPACE_ROOT / "public" / "fotos-animales"

class SubirFotoRequest(BaseModel):
    nombre_archivo: str
    imagen_base64: str

@router.post("/subir-foto")
def subir_foto(data: SubirFotoRequest):
    """Guarda una imagen cargada (drag & drop o selector) directamente en public/fotos-animales."""
    try:
        FOTOS_DIR.mkdir(parents=True, exist_ok=True)
        raw_b64 = data.imagen_base64
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",", 1)[1]
        image_bytes = base64.b64decode(raw_b64)

        ext = ".jpg"
        if "." in data.nombre_archivo:
            candidate_ext = Path(data.nombre_archivo).suffix.lower()
            if candidate_ext in [".jpg", ".jpeg", ".png", ".webp"]:
                ext = candidate_ext

        safe_filename = f"mascota_{int(time.time())}_{uuid.uuid4().hex[:6]}{ext}"
        dest = FOTOS_DIR / safe_filename
        dest.write_bytes(image_bytes)

        full_url = f"http://localhost:8000/fotos-animales/{safe_filename}"
        return {
            "url": full_url,
            "nombre": safe_filename
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al procesar la imagen: {str(e)}"
        )

@router.get("", response_model=List[Animal])
def listar_animales(
    especie: Optional[str] = Query(None, description="Filtrar por especie: Perro o Gato"),
    tamano: Optional[str] = Query(None, description="Filtrar por tamaño: Pequeño, Mediano o Grande"),
    rescatista_id: Optional[int] = Query(None, description="Filtrar por ID de rescatista"),
    estado: Optional[str] = Query(None, description="Filtrar por estado: disponible, en_proceso, adoptado")
):
    return animal_service.listar(
        especie=especie,
        tamano=tamano,
        rescatista_id=rescatista_id,
        estado=estado
    )

@router.get("/{animal_id}", response_model=Animal)
def obtener_animal(animal_id: int = PathParam(..., description="ID del animal")):
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
