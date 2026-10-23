import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import settings
from backend.app.db.session import engine, Base, SessionLocal
from backend.app.db.seed import seed_database
from backend.app.api.routes import health, scans, verification, safety_checks, reports, medicines, reference

# Setup logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("dawalens.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed initial clinical compendia
    logger.info("Initializing DawaLens database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    logger.info("DawaLens Backend startup sequence completed.")
    yield
    # Shutdown
    logger.info("DawaLens Backend shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Deterministic Medication Safety & Packaging AI Vision Engine API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error processing {request.method} {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "SERVER_ERROR",
            "message": "An internal error occurred during safety processing.",
            "detail": str(exc) if settings.DEBUG else "Contact clinical support.",
        },
    )


# Mount API v1 Routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(scans.router, prefix="/api/v1")
app.include_router(verification.router, prefix="/api/v1")
app.include_router(safety_checks.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(medicines.router, prefix="/api/v1")
app.include_router(reference.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api_v1": "/api/v1",
        "rule_version": settings.CLINICAL_RULE_VERSION,
    }
