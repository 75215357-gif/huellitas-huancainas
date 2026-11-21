from typing import List, Optional
from backend.backend.database import get_db_cursor, row_to_dict, rows_to_dicts
from backend.backend.schemas.solicitudes import Solicitud, SolicitudCreate, SolicitudUpdateEstado

class SolicitudRepository:
    """Acceso a datos de solicitudes de adopción en MySQL con pyodbc (Sin ORM)."""

    def listar_todas(self, estado: Optional[str] = None) -> List[Solicitud]:
        query = "SELECT id, animal_id, adoptante_id, mensaje, estado FROM solicitudes WHERE 1=1"
        params = []
        if estado:
            query += " AND estado = ?"
            params.append(estado)
        query += " ORDER BY id DESC"

        with get_db_cursor(commit=False) as cur:
            cur.execute(query, params)
            rows = rows_to_dicts(cur, cur.fetchall())
            return [Solicitud(**r) for r in rows]

    def obtener_por_id(self, solicitud_id: int) -> Optional[Solicitud]:
        query = "SELECT id, animal_id, adoptante_id, mensaje, estado FROM solicitudes WHERE id = ?"
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (solicitud_id,))
            row = row_to_dict(cur, cur.fetchone())
            return Solicitud(**row) if row else None

    def crear(self, data: SolicitudCreate) -> Solicitud:
        query = """
            INSERT INTO solicitudes (animal_id, adoptante_id, mensaje, estado)
            VALUES (?, ?, ?, 'pendiente')
        """
        params = (data.animal_id, data.adoptante_id, data.mensaje)
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, params)
            cur.execute("SELECT LAST_INSERT_ID()")
            nuevo_id = cur.fetchone()[0]
        return self.obtener_por_id(nuevo_id)

    def actualizar_estado(self, solicitud_id: int, estado: str) -> Optional[Solicitud]:
        query = "UPDATE solicitudes SET estado = ? WHERE id = ?"
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, (estado, solicitud_id))
        return self.obtener_por_id(solicitud_id)

solicitud_repository = SolicitudRepository()
