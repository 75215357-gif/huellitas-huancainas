from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.backend.apis.animales import router as animales_router
from backend.backend.apis.auth import router as auth_router
from backend.backend.apis.usuarios import router as usuarios_router
from backend.backend.apis.personas import router as personas_router
from backend.backend.apis.solicitudes import router as solicitudes_router
from backend.backend.apis.denuncias import router as denuncias_router
from backend.backend.apis.seguimientos import router as seguimientos_router

from backend.backend.services.exceptions import (
    UsuarioNotFoundError,
    UsuarioAlreadyExistsError,
    AnimalNotFoundError,
    AnimalAlreadyExistsError,
    DenunciaNotFoundError,
    DenunciaAlreadyExistsError,
    RescatistaNotFoundError,
    InvalidCredentialsError
)

app = FastAPI(
    title="Huellitas Huancaínas API",
    description="API REST conectada a MySQL mediante pyodbc (Sin ORM) para adopción animal.",
    version="1.0.0"
)

# Servir archivos estáticos de fotos de animales si existen
FOTOS_PATH = Path(__file__).resolve().parent.parent.parent / "public" / "fotos-animales"
if FOTOS_PATH.exists():
    app.mount("/fotos-animales", StaticFiles(directory=str(FOTOS_PATH)), name="fotos-animales")

# Configurar CORS para permitir comunicación fluida con el frontend de Angular (localhost:4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manejadores de Excepciones Personalizadas
@app.exception_handler(UsuarioNotFoundError)
def usuario_not_found_handler(request: Request, exc: UsuarioNotFoundError):
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(exc)})

@app.exception_handler(UsuarioAlreadyExistsError)
def usuario_already_exists_handler(request: Request, exc: UsuarioAlreadyExistsError):
    return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": str(exc)})

@app.exception_handler(AnimalNotFoundError)
def animal_not_found_handler(request: Request, exc: AnimalNotFoundError):
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(exc)})

@app.exception_handler(AnimalAlreadyExistsError)
def animal_already_exists_handler(request: Request, exc: AnimalAlreadyExistsError):
    return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": str(exc)})

@app.exception_handler(DenunciaNotFoundError)
def denuncia_not_found_handler(request: Request, exc: DenunciaNotFoundError):
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(exc)})

@app.exception_handler(RescatistaNotFoundError)
def rescatista_not_found_handler(request: Request, exc: RescatistaNotFoundError):
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(exc)})

@app.exception_handler(InvalidCredentialsError)
def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": str(exc)})

# Registrar Routers
app.include_router(auth_router)
app.include_router(animales_router)
app.include_router(usuarios_router)
app.include_router(personas_router)
app.include_router(solicitudes_router)
app.include_router(denuncias_router)
app.include_router(seguimientos_router)

@app.get("/", tags=["General"])
def root():
    return {
        "mensaje": "Bienvenido a la API de Huellitas Huancaínas",
        "estado": "operativo",
        "docs": "/docs"
    }

@app.get("/health", tags=["General"])
def health_check():
    return {"status": "ok", "db": "MySQL connected via pyodbc"}
