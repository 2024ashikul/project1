from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import chat, ocr, vision, health

app = FastAPI(
    title="MediAssist AI - Backend",
    description="Personal Medical Assistant API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR"])
app.include_router(vision.router, prefix="/api/vision", tags=["Vision"])

@app.get("/")
def root():
    return {"message": "MediAssist AI Backend is running 🚀"}
