from typing import List, Optional
from backend.backend.database import get_db_cursor, row_to_dict, rows_to_dicts
from backend.backend.schemas.denuncias import Denuncia, DenunciaCreate, DenunciaUpdate

class DenunciaRepository:
    """Acceso a datos de denuncias en MySQL mediante pyodbc (Sin ORM)."""

    def listar_todas(self, estado: Optional[str] = None) -> List[Denuncia]:
        query = "SELECT id, titulo, descripcion, ubicacion, contacto, estado FROM denuncias WHERE 1=1"
        params = []
        if estado:
            query += " AND estado = ?"
            params.append(estado)
        query += " ORDER BY id DESC"

        with get_db_cursor(commit=False) as cur:
            cur.execute(query, params)
            rows = rows_to_dicts(cur, cur.fetchall())
            return [Denuncia(**r) for r in rows]

    def obtener_por_id(self, denuncia_id: int) -> Optional[Denuncia]:
        query = "SELECT id, titulo, descripcion, ubicacion, contacto, estado FROM denuncias WHERE id = ?"
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (denuncia_id,))
            row = row_to_dict(cur, cur.fetchone())
            return Denuncia(**row) if row else None

    def crear(self, data: DenunciaCreate) -> Denuncia:
        query = """
            INSERT INTO denuncias (titulo, descripcion, ubicacion, contacto, estado)
            VALUES (?, ?, ?, ?, 'pendiente')
        """
        params = (data.titulo, data.descripcion, data.ubicacion, data.contacto)
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, params)
            cur.execute("SELECT LAST_INSERT_ID()")
            nuevo_id = cur.fetchone()[0]
        return self.obtener_por_id(nuevo_id)

    def actualizar(self, denuncia_id: int, data: DenunciaUpdate) -> Optional[Denuncia]:
        query = "UPDATE denuncias SET estado = ? WHERE id = ?"
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (data.estado, denuncia_id))
        return self.obtener_por_id(denuncia_id)

denuncia_repository = DenunciaRepository()
