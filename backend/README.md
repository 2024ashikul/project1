# MediAssist AI — Backend

FastAPI backend with modular ML layer.

## Structure
```
backend/
├── main.py                  # FastAPI app + CORS + router registration
├── requirements.txt
├── .env.example
└── app/
    ├── core/
    │   └── config.py        # Env vars (API keys, paths)
    ├── ml/
    │   ├── rag.py           # RAG chain (LangChain + Groq + ChromaDB)
    │   ├── gemini.py        # Vision symptom checker + OCR
    │   └── calculators.py   # BMI / health calculators
    └── api/
        └── routes/
            ├── health.py    # GET /api/health  POST /api/bmi
            ├── chat.py      # POST /api/chat
            ├── ocr.py       # POST /api/ocr
            └── vision.py    # POST /api/vision
```

## Setup
```bash
cp .env.example .env
# fill in your API keys in .env

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| POST | /api/bmi | BMI + water intake calculator |
| POST | /api/chat | RAG chat (supports OCR + vision context) |
| POST | /api/ocr | Extract text from prescription image |
| POST | /api/vision | Analyze visible symptoms from image |

Interactive docs: http://localhost:8000/docs
