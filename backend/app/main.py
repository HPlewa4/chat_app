from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes, chat_routes, upload_routes
import os

api = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

@api.get("/health")
async def health_check():
    return {"status": "ok"}


api.include_router(user_routes.router, prefix="/users")
api.include_router(chat_routes.router, prefix="/chat")
api.include_router(upload_routes.router, prefix="/uploads")

app = CORSMiddleware(
    api,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
