from typing import List, Optional
from backend.backend.database import get_db_cursor, row_to_dict, rows_to_dicts
from backend.backend.schemas.solicitudes import Solicitud, SolicitudCreate, SolicitudUpdateEstado
from backend.backend.repositories.animales import normalizar_foto_url

class SolicitudRepository:
    """Acceso a datos de solicitudes de adopción en MySQL con pyodbc (Sin ORM)."""

    def listar_todas(self, estado: Optional[str] = None, rescatista_id: Optional[int] = None) -> List[Solicitud]:
        query = """
            SELECT 
                s.id, 
                s.animal_id, 
                s.adoptante_id, 
                s.mensaje, 
                s.estado,
                DATE_FORMAT(s.fecha_solicitud, '%Y-%m-%d %H:%i') AS fecha_solicitud,
                a.nombre AS animal_nombre,
                a.especie AS animal_especie,
                a.foto AS animal_foto,
                a.rescatista_id AS rescatista_id,
                u.nombres AS adoptante_nombres,
                u.correo AS adoptante_correo,
                u.telefono AS adoptante_telefono,
                u.dni AS adoptante_dni
            FROM solicitudes s
            LEFT JOIN animales a ON s.animal_id = a.id
            LEFT JOIN usuarios u ON s.adoptante_id = u.id
            WHERE 1=1
        """
        params = []
        if estado:
            query += " AND s.estado = ?"
            params.append(estado)
        if rescatista_id:
            query += " AND a.rescatista_id = ?"
            params.append(rescatista_id)
        query += " ORDER BY s.id DESC"

        with get_db_cursor(commit=False) as cur:
            cur.execute(query, params)
            rows = rows_to_dicts(cur, cur.fetchall())
            for r in rows:
                if r.get("fecha_solicitud") and not isinstance(r["fecha_solicitud"], str):
                    r["fecha_solicitud"] = str(r["fecha_solicitud"])
                if r.get("animal_foto"):
                    r["animal_foto"] = normalizar_foto_url(r["animal_foto"])
            return [Solicitud(**r) for r in rows]

    def obtener_por_id(self, solicitud_id: int) -> Optional[Solicitud]:
        query = """
            SELECT 
                s.id, 
                s.animal_id, 
                s.adoptante_id, 
                s.mensaje, 
                s.estado,
                DATE_FORMAT(s.fecha_solicitud, '%Y-%m-%d %H:%i') AS fecha_solicitud,
                a.nombre AS animal_nombre,
                a.especie AS animal_especie,
                a.foto AS animal_foto,
                a.rescatista_id AS rescatista_id,
                u.nombres AS adoptante_nombres,
                u.correo AS adoptante_correo,
                u.telefono AS adoptante_telefono,
                u.dni AS adoptante_dni
            FROM solicitudes s
            LEFT JOIN animales a ON s.animal_id = a.id
            LEFT JOIN usuarios u ON s.adoptante_id = u.id
            WHERE s.id = ?
        """
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (solicitud_id,))
            row = row_to_dict(cur, cur.fetchone())
            if not row:
                return None
            if row.get("fecha_solicitud") and not isinstance(row["fecha_solicitud"], str):
                row["fecha_solicitud"] = str(row["fecha_solicitud"])
            if row.get("animal_foto"):
                row["animal_foto"] = normalizar_foto_url(row["animal_foto"])
            return Solicitud(**row)

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
