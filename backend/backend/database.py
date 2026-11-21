import pyodbc
from contextlib import contextmanager
from typing import Generator, Dict, Any, List, Optional
from backend.backend.config import (
    DB_DSN, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DRIVER
)

def get_connection_string() -> str:
    """
    Construye la cadena de conexión para pyodbc hacia MySQL.
    Si existe un DSN configurado, se utiliza priorizando el DSN de usuario.
    """
    if DB_DSN:
        return f"DSN={DB_DSN};DATABASE={DB_NAME};UID={DB_USER};PWD={DB_PASSWORD};"
    return (
        f"DRIVER={{{DB_DRIVER}}};"
        f"SERVER={DB_HOST};"
        f"PORT={DB_PORT};"
        f"DATABASE={DB_NAME};"
        f"UID={DB_USER};"
        f"PWD={DB_PASSWORD};"
    )

def row_to_dict(cursor: pyodbc.Cursor, row: pyodbc.Row) -> Optional[Dict[str, Any]]:
    """Convierte una tupla pyodbc.Row en un diccionario clave-valor según los nombres de columna."""
    if not row:
        return None
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))

def rows_to_dicts(cursor: pyodbc.Cursor, rows: List[pyodbc.Row]) -> List[Dict[str, Any]]:
    """Convierte una lista de pyodbc.Row en una lista de diccionarios."""
    if not rows:
        return []
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in rows]

@contextmanager
def get_db_cursor(commit: bool = True) -> Generator[pyodbc.Cursor, None, None]:
    """
    Context manager para operaciones SQL nativas con pyodbc (Sin ORM).
    Asegura la apertura, commit (opcional) y cierre de la conexión.
    """
    conn_str = get_connection_string()
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    try:
        yield cursor
        if commit:
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
