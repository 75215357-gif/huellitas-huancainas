from typing import List, Optional
from backend.backend.database import get_db_cursor, row_to_dict, rows_to_dicts
from backend.backend.schemas.seguimientos import Seguimiento, SeguimientoCreate

class SeguimientoRepository:
    """Acceso a datos de seguimiento post-adopción con pyodbc (Sin ORM)."""

    def listar_por_solicitud(self, solicitud_id: int) -> List[Seguimiento]:
        query = "SELECT id, solicitud_id, comentarios, foto_avance FROM seguimientos WHERE solicitud_id = ? ORDER BY id DESC"
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (solicitud_id,))
            rows = rows_to_dicts(cur, cur.fetchall())
            return [Seguimiento(**r) for r in rows]

    def crear(self, data: SeguimientoCreate) -> Seguimiento:
        query = """
            INSERT INTO seguimientos (solicitud_id, comentarios, foto_avance)
            VALUES (?, ?, ?)
        """
        params = (data.solicitud_id, data.comentarios, data.foto_avance)
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, params)
            cur.execute("SELECT LAST_INSERT_ID()")
            nuevo_id = cur.fetchone()[0]
        with get_db_cursor(commit=False) as cur:
            cur.execute("SELECT id, solicitud_id, comentarios, foto_avance FROM seguimientos WHERE id = ?", (nuevo_id,))
            row = row_to_dict(cur, cur.fetchone())
            return Seguimiento(**row)

seguimiento_repository = SeguimientoRepository()
