import pathlib
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import close_db, connect_db, get_db
from app.data.seed import seed_if_empty
from app.routers import audit, auth, bourse, dashboard, documents, epargne, immobilier, private_equity

STATIC_DIR = pathlib.Path(__file__).resolve().parent.parent / "static"


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    await connect_db()
    await seed_if_empty(get_db())
    yield
    await close_db()


app = FastAPI(
    title="Aura Wealth API",
    version="0.1.0",
    docs_url=f"{settings.api_prefix}/docs",
    openapi_url=f"{settings.api_prefix}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.environment != "development" else [settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(f"{settings.api_prefix}/health")
async def health_check():
    return {"status": "ok", "environment": settings.environment}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(dashboard.router, prefix=settings.api_prefix)
app.include_router(epargne.router, prefix=settings.api_prefix)
app.include_router(bourse.router, prefix=settings.api_prefix)
app.include_router(immobilier.router, prefix=settings.api_prefix)
app.include_router(private_equity.router, prefix=settings.api_prefix)
app.include_router(documents.router, prefix=settings.api_prefix)
app.include_router(audit.router, prefix=settings.api_prefix)


# ── Serve frontend static files in production ──
if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

    @app.get("/{path:path}")
    async def serve_spa(request: Request, path: str):
        """Serve frontend SPA — try static file first, fallback to index.html."""
        file = STATIC_DIR / path
        if file.is_file():
            return FileResponse(file)
        return FileResponse(STATIC_DIR / "index.html")
