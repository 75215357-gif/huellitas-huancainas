class UsuarioNotFoundError(Exception):
    """Lanzada cuando un usuario no existe en la base de datos."""

class UsuarioAlreadyExistsError(Exception):
    """Lanzada cuando un correo o DNI ya está registrado."""

class AnimalNotFoundError(Exception):
    """Lanzada cuando un animal no existe."""

class AnimalAlreadyExistsError(Exception):
    """Lanzada cuando un animal ya existe."""

class DenunciaNotFoundError(Exception):
    """Lanzada cuando una denuncia no existe."""

class DenunciaAlreadyExistsError(Exception):
    """Lanzada cuando una denuncia ya existe."""

class RescatistaNotFoundError(Exception):
    """Lanzada cuando el rescatista asociado no existe o no tiene rol de rescatista."""

class InvalidCredentialsError(Exception):
    """Lanzada cuando el correo o contraseña son incorrectos."""
