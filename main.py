from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, checkin, rrhh

app = FastAPI(
    title="APP RRHH – Bienestar & Productividad",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # luego se ajusta
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(checkin.router, prefix="/checkin", tags=["Check-in"])
app.include_router(rrhh.router, prefix="/rrhh", tags=["RRHH"])


@app.get("/")
def healthcheck():
    return {"status": "ok"}
