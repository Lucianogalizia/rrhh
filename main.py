import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import auth, checkin, rrhh

# Orígenes permitidos: leídos desde variable de entorno o restringidos en producción
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else ["*"]

app = FastAPI(
    title="APP RRHH",
    version="0.1.0"
)

# FIX: CORS restringido por variable de entorno. En dev sigue funcionando con "*".
# En producción, setear ALLOWED_ORIGINS=https://tu-dominio.com en Cloud Run.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API bajo /api
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(checkin.router, prefix="/api/checkin", tags=["Check-in"])
app.include_router(rrhh.router, prefix="/api/rrhh", tags=["RRHH"])

@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}

# FIX: Montar frontend estático solo si el directorio existe,
# para evitar excepción de arranque si el build del frontend falló.
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir) and os.listdir(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    print("⚠️  Advertencia: directorio 'static/' no encontrado o vacío. Frontend no disponible.")
