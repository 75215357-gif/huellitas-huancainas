from typing import List, Optional, Tuple, Dict, Any
from backend.backend.database import get_db_cursor, row_to_dict, rows_to_dicts
from backend.backend.schemas.usuarios import Usuario, UsuarioCreate, UsuarioUpdate

class UsuarioRepository:
    """Acceso a datos de usuarios en MySQL mediante pyodbc (Sin ORM)."""

    def listar_todos(self, rol: Optional[str] = None, estado_rescatista: Optional[str] = None) -> List[Usuario]:
        query = """
            SELECT id, dni, nombres, telefono, correo, rol, estado_rescatista,
                   DATE_FORMAT(fecha_registro, '%Y-%m-%d %H:%i') AS fecha_registro 
            FROM usuarios 
            WHERE 1=1
        """
        params = []
        if rol:
            query += " AND rol = ?"
            params.append(rol)
        if estado_rescatista:
            query += " AND estado_rescatista = ?"
            params.append(estado_rescatista)
        query += " ORDER BY id DESC"

        with get_db_cursor(commit=False) as cur:
            cur.execute(query, params)
            rows = rows_to_dicts(cur, cur.fetchall())
            for r in rows:
                if r.get("fecha_registro") and not isinstance(r["fecha_registro"], str):
                    r["fecha_registro"] = str(r["fecha_registro"])
                if not r.get("estado_rescatista"):
                    r["estado_rescatista"] = "ninguno"
            return [Usuario(**r) for r in rows]

    def obtener_por_id(self, user_id: int) -> Optional[Usuario]:
        query = """
            SELECT id, dni, nombres, telefono, correo, rol, estado_rescatista,
                   DATE_FORMAT(fecha_registro, '%Y-%m-%d %H:%i') AS fecha_registro 
            FROM usuarios 
            WHERE id = ?
        """
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (user_id,))
            row = row_to_dict(cur, cur.fetchone())
            if not row:
                return None
            if row.get("fecha_registro") and not isinstance(row["fecha_registro"], str):
                row["fecha_registro"] = str(row["fecha_registro"])
            if not row.get("estado_rescatista"):
                row["estado_rescatista"] = "ninguno"
            return Usuario(**row)

    def obtener_por_correo(self, correo: str) -> Optional[Dict[str, Any]]:
        query = "SELECT id, dni, nombres, telefono, correo, clave, rol, estado_rescatista FROM usuarios WHERE correo = ?"
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (correo,))
            return row_to_dict(cur, cur.fetchone())

    def obtener_por_dni(self, dni: str) -> Optional[Usuario]:
        query = "SELECT id, dni, nombres, telefono, correo, rol, estado_rescatista FROM usuarios WHERE dni = ?"
        with get_db_cursor(commit=False) as cur:
            cur.execute(query, (dni,))
            row = row_to_dict(cur, cur.fetchone())
            if not row:
                return None
            if not row.get("estado_rescatista"):
                row["estado_rescatista"] = "ninguno"
            return Usuario(**row)

    def crear(self, data: UsuarioCreate) -> Usuario:
        query = """
            INSERT INTO usuarios (dni, nombres, telefono, correo, clave, rol, estado_rescatista)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        params = (
            data.dni,
            data.nombres,
            data.telefono,
            data.correo,
            data.clave,
            data.rol,
            data.estado_rescatista or "ninguno"
        )
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, params)
            cur.execute("SELECT LAST_INSERT_ID()")
            nuevo_id = cur.fetchone()[0]
        return self.obtener_por_id(nuevo_id)

    def actualizar(self, user_id: int, data: UsuarioUpdate) -> Optional[Usuario]:
        campos = []
        valores = []
        data_dict = data.model_dump(exclude_unset=True)
        if not data_dict:
            return self.obtener_por_id(user_id)

        for campo, valor in data_dict.items():
            campos.append(f"{campo} = ?")
            valores.append(valor)
        valores.append(user_id)

        query = f"UPDATE usuarios SET {', '.join(campos)} WHERE id = ?"
        with get_db_cursor(commit=True) as cur:
            cur.execute(query, valores)
        return self.obtener_por_id(user_id)

    def eliminar(self, user_id: int) -> bool:
        with get_db_cursor(commit=True) as cur:
            cur.execute("DELETE FROM usuarios WHERE id = ?", (user_id,))
            return cur.rowcount > 0

usuario_repository = UsuarioRepository()
