# ── Stage 1: Build frontend ──
FROM node:20-slim AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ── Stage 2: Python backend + static frontend ──
FROM python:3.12-slim
WORKDIR /app

# Install uv and dependencies
RUN pip install --no-cache-dir uv
COPY backend/pyproject.toml .
RUN uv pip install --system --no-cache .

# Copy backend code
COPY backend/app/ app/

# Copy built frontend into /app/static
COPY --from=frontend-build /app/dist /app/static

# Create uploads dir
RUN mkdir -p /data/uploads

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
