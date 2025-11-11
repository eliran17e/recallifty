from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import search
from dotenv import load_dotenv
import os

app = FastAPI(title="Recallift API")

load_dotenv()  # loads .env variables into memory

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)

@app.get("/ping")
def ping():
    return {"message": "pong from Recallift"}

# 🧪 Temporary route to verify .env works
@app.get("/check_env")
def check_env():
    key = os.getenv("GEMINI_API_KEY")
    if key:
        return {"env_loaded": True, "key_preview": key[:6] + "..."}
    else:
        return {"env_loaded": False}
