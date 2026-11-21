from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

class AnimalBase(BaseModel):
    nombre: str = Field(..., description="Nombre del animal.", example="Toby")
    especie: Literal["Perro", "Gato"] = Field(..., description="Especie del animal.")
    edad: str = Field(..., description="Edad aproximada.", example="2 años")
    tamano: Literal["Pequeño", "Mediano", "Grande"] = Field(..., description="Tamaño del animal.")
    caracter: str = Field(..., description="Descripción del temperamento.", example="Juguetón y cariñoso")
    vacunado: bool = Field(default=False, description="Indica si cuenta con vacunas.")
    esterilizado: bool = Field(default=False, description="Indica si está esterilizado.")
    foto: str = Field(..., description="Ruta o URL de la foto.")
    estado: Literal["disponible", "en_proceso", "adoptado"] = Field(default="disponible")

class AnimalCreate(AnimalBase):
    rescatista_id: Optional[int] = Field(default=None, description="ID del rescatista responsable.")

class AnimalUpdate(BaseModel):
    nombre: Optional[str] = None
    especie: Optional[Literal["Perro", "Gato"]] = None
    edad: Optional[str] = None
    tamano: Optional[Literal["Pequeño", "Mediano", "Grande"]] = None
    caracter: Optional[str] = None
    vacunado: Optional[bool] = None
    esterilizado: Optional[bool] = None
    foto: Optional[str] = None
    estado: Optional[Literal["disponible", "en_proceso", "adoptado"]] = None

class Animal(AnimalBase):
    id: int
    rescatista_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
