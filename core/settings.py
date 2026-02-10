import os

class Settings:
    APP_NAME = "APP RRHH"

    JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-dev")
    JWT_ALGORITHM = "HS256"

    TEST_USER = {
        "email": os.getenv("TEST_USER_EMAIL", "demo@empresa.com"),
        "password": os.getenv("TEST_USER_PASSWORD", "Demo123!"),
        "name": os.getenv("TEST_USER_NAME", "Usuario"),
        "lastname": os.getenv("TEST_USER_LASTNAME", "Prueba"),
        "team": os.getenv("TEST_USER_TEAM", "Operaciones"),
        "role": "user"
    }


settings = Settings()
