import os
import warnings

class Settings:
    APP_NAME = "APP RRHH"

    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_ALGORITHM = "HS256"

    TEST_USER = {
        "email": os.getenv("TEST_USER_EMAIL", "demo@empresa.com"),
        "password": os.getenv("TEST_USER_PASSWORD", "Demo123!"),
        "name": os.getenv("TEST_USER_NAME", "Usuario"),
        "lastname": os.getenv("TEST_USER_LASTNAME", "Prueba"),
        "team": os.getenv("TEST_USER_TEAM", "Operaciones"),
        "role": "user"
    }

    def __init__(self):
        # FIX: JWT_SECRET obligatorio en producción. Si no está seteado, advertir fuerte.
        if not self.JWT_SECRET:
            warnings.warn(
                "⚠️  JWT_SECRET no está configurado como variable de entorno. "
                "Usando valor de fallback inseguro. NO usar en producción.",
                stacklevel=2
            )
            self.JWT_SECRET = "super-secret-dev-INSEGURO"


settings = Settings()
