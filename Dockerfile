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

# copiar backend
COPY main.py /app/main.py
COPY core /app/core
COPY domain /app/domain
COPY routes /app/routes
COPY store /app/store

RUN pip install --no-cache-dir fastapi uvicorn[standard] python-jose[cryptography] pydantic

# copiar frontend exportado
COPY --from=webbuild /web/out /app/static

EXPOSE 8080
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]

