from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import auth, checkin, rrhh

app = FastAPI(
    title="APP RRHH",
    version="0.1.0"
)

# CORS (por si más adelante separás servicios)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 API bajo /api
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(checkin.router, prefix="/api/checkin", tags=["Check-in"])
app.include_router(rrhh.router, prefix="/api/rrhh", tags=["RRHH"])

@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}

# 🔹 Frontend estático (Next export)
app.mount("/", StaticFiles(directory="static", html=True), name="static")
