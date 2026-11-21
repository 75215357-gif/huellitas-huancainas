import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables desde el archivo .env ubicado en backend/.env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DB_DSN = os.getenv("DB_DSN", "MySQL_Huellitas")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "huellitas_huancainas")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "75215357")
DB_DRIVER = os.getenv("DB_DRIVER", "MySQL ODBC 8.0 Unicode Driver")

SECRET_KEY = os.getenv("SECRET_KEY", "huellitas_secret_key_2026_segura")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
