from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes, chat_routes
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_directory = Path(os.getenv("UPLOAD_DIR", "uploads"))
upload_directory.mkdir(parents=True, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=upload_directory),
    name="uploads",
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(user_routes.router, prefix="/users")
app.include_router(chat_routes.router, prefix="/chat")
