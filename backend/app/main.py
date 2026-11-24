import logging
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError

from app.database import client
from app.routes import user_routes, chat_routes, upload_routes

logger = logging.getLogger("uvicorn.error")

app = FastAPI()

# Comma-separated list, e.g. "http://localhost:3000,https://my-app.vercel.app"
origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_URL", "http://localhost:3000").split(",")
    if origin.strip()
]


# Registered before CORSMiddleware so CORS wraps it: crashes come back as JSON
# with CORS headers instead of a bare 500 the browser reports as a CORS error.
@app.middleware("http")
async def catch_unhandled_errors(request: Request, call_next):
    try:
        return await call_next(request)
    except PyMongoError as exc:
        logger.exception("Database error on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=503,
            content={"detail": f"Database unavailable ({type(exc).__name__}). Check MONGO_URL and MongoDB Atlas network access."},
        )
    except Exception as exc:
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error ({type(exc).__name__})"},
        )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/health/db")
async def db_health_check():
    try:
        await client.admin.command("ping")
    except PyMongoError as exc:
        logger.exception("Database health check failed")
        return JSONResponse(
            status_code=503,
            content={"status": "error", "error": type(exc).__name__},
        )
    return {"status": "ok"}


app.include_router(user_routes.router, prefix="/users")
app.include_router(chat_routes.router, prefix="/chat")
app.include_router(upload_routes.router, prefix="/uploads")
