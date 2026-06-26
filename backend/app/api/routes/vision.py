from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from PIL import Image
import io

from app.ml.gemini import analyze_symptoms_from_image

router = APIRouter()


class VisionResponse(BaseModel):
    symptoms: str


@router.post("", response_model=VisionResponse)
async def vision_endpoint(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Only JPG/PNG images are supported.")
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        symptoms = analyze_symptoms_from_image(image)
        return VisionResponse(symptoms=symptoms)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
