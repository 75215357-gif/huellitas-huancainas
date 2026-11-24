import time
from backend.backend.repositories.usuarios import usuario_repository, UsuarioRepository
from backend.backend.schemas.auth import LoginRequest, RegistroRequest, AuthResponse
from backend.backend.schemas.usuarios import Usuario, UsuarioCreate
from backend.backend.services.exceptions import InvalidCredentialsError, UsuarioAlreadyExistsError

class AuthService:
    def __init__(self, user_repo: UsuarioRepository = usuario_repository):
        self.user_repo = user_repo

    def login(self, data: LoginRequest) -> AuthResponse:
        row = self.user_repo.obtener_por_correo(data.correo)
        if not row or row["clave"] != data.clave:
            raise InvalidCredentialsError("Credenciales inválidas. Correo o contraseña incorrectos.")

        usuario = Usuario(
            id=row["id"],
            dni=row["dni"],
            nombres=row["nombres"],
            telefono=row["telefono"],
            correo=row["correo"],
            rol=row["rol"],
            estado_rescatista=row.get("estado_rescatista") or "ninguno"
        )
        token = f"token_{usuario.id}_{int(time.time())}"
        return AuthResponse(access_token=token, token_type="bearer", usuario=usuario)

    def registro(self, data: RegistroRequest) -> AuthResponse:
        if self.user_repo.obtener_por_correo(data.correo):
            raise UsuarioAlreadyExistsError("El correo electrónico ya está registrado.")
        if self.user_repo.obtener_por_dni(data.dni):
            raise UsuarioAlreadyExistsError("El DNI ya está registrado.")

        # Si el usuario solicita ser rescatista, queda como adoptante con estado 'pendiente'
        # hasta que un administrador lo verifique y apruebe en el Panel de Administrador.
        if data.rol == "rescatista":
            rol_asignado = "adoptante"
            estado_rescatista = "pendiente"
        elif data.rol == "admin":
            rol_asignado = "admin"
            estado_rescatista = "aprobado"
        else:
            rol_asignado = "adoptante"
            estado_rescatista = "ninguno"

        usuario_create = UsuarioCreate(
            dni=data.dni,
            nombres=data.nombres,
            telefono=data.telefono,
            correo=data.correo,
            rol=rol_asignado,
            estado_rescatista=estado_rescatista,
            clave=data.clave
        )
        nuevo_usuario = self.user_repo.crear(usuario_create)
        token = f"token_{nuevo_usuario.id}_{int(time.time())}"
        return AuthResponse(access_token=token, token_type="bearer", usuario=nuevo_usuario)

auth_service = AuthService()
