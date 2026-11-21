from typing import List, Optional
from backend.backend.database import get_db_cursor, row_to_dict, rows_to_dicts
from backend.backend.schemas.animales import Animal, AnimalCreate, AnimalUpdate

class AnimalRepository:
    """Acceso a datos de animales en MySQL mediante pyodbc (Sin ORM)."""

    def listar_todos(self, especie: Optional[str] = None, tamano: Optional[str] = None) -> List[Animal]:
        query = "SELECT id, nombre, especie, edad, tamano, caracter, vacunado, esterilizado, foto, estado, rescatista_id FROM animales WHERE 1=1"
        params = []
        if especie:
            query += " AND especie = ?"
            params.append(especie)
        if tamano:
            query += " AND tamano = ?"
            params.append(tamano)
        query += " ORDER BY id ASC"

        with get_db_cursor(commit=False) as cur:
            cur.execute(query, params)
            rows = rows_to_dicts(cur, cur.fetchall())
            # Convertir 0/1 a booleanos
            for r in rows:
                r["vacunado"] = bool(r["vacunado"])
                r["esterilizado"] = bool(r["esterilizado"])
            return [Animal(**r) for r in rows]

    def obtener_por_id(self, animal_id: int) -> Optional[Animal]:
        query = "SELECT id, nombre, especie, edad, tamano, caracter, vacunado, esterilizado, foto, estado, rescatista_id FROM animales WHERE id = ?"
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (animal_id,))
            row = row_to_dict(cur, cur.fetchone())
            if not row:
                return None
            row["vacunado"] = bool(row["vacunado"])
            row["esterilizado"] = bool(row["esterilizado"])
            return Animal(**row)

    def crear(self, data: AnimalCreate) -> Animal:
        query = """
            INSERT INTO animales (nombre, especie, edad, tamano, caracter, vacunado, esterilizado, foto, estado, rescatista_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        params = (
            data.nombre,
            data.especie,
            data.edad,
            data.tamano,
            data.caracter,
            1 if data.vacunado else 0,
            1 if data.esterilizado else 0,
            data.foto,
            data.estado,
            data.rescatista_id
        )
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, params)
            cur.execute("SELECT LAST_INSERT_ID()")
            nuevo_id = cur.fetchone()[0]
        return self.obtener_por_id(nuevo_id)

    def actualizar(self, animal_id: int, data: AnimalUpdate) -> Optional[Animal]:
        campos = []
        valores = []
        data_dict = data.model_dump(exclude_unset=True)
        if not data_dict:
            return self.obtener_por_id(animal_id)

        for campo, valor in data_dict.items():
            campos.append(f"{campo} = ?")
            if isinstance(valor, bool):
                valores.append(1 if valor else 0)
            else:
                valores.append(valor)
        valores.append(animal_id)

        query = f"UPDATE animales SET {', '.join(campos)} WHERE id = ?"
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, valores)
        return self.obtener_por_id(animal_id)

    def eliminar(self, animal_id: int) -> bool:
        with get_db_cursor(commit=True) as cur:
            cur.execute("DELETE FROM animales WHERE id = ?", (animal_id,))
            return cur.rowcount > 0

animal_repository = AnimalRepository()
