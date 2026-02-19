# -------- BUILD FRONTEND --------
FROM node:20-alpine AS webbuild
WORKDIR /web

COPY apps/web/package.json apps/web/package-lock.json* ./
RUN npm install

COPY apps/web ./
RUN npm run build

# -------- BUILD BACKEND --------
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar backend
COPY main.py /app/main.py
COPY core /app/core
COPY domain /app/domain
COPY routes /app/routes
COPY store /app/store

RUN pip install --no-cache-dir fastapi uvicorn[standard] python-jose[cryptography] pydantic openai

# Copiar frontend exportado
COPY --from=webbuild /web/out /app/static

# Verificar que el directorio static existe y tiene contenido
RUN test -d /app/static && test "$(ls -A /app/static)" || (echo "ERROR: /app/static está vacío o no existe" && exit 1)

EXPOSE 8080

# FIX: PORT con valor por defecto 8080 para evitar fallo si Cloud Run no lo inyecta a tiempo
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
