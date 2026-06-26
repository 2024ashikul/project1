from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from PIL import Image
import io

from app.ml.gemini import extract_text_from_image

router = APIRouter()


class OCRResponse(BaseModel):
    extracted_text: str


@router.post("", response_model=OCRResponse)
async def ocr_endpoint(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Only JPG/PNG images are supported.")
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        text = extract_text_from_image(image)
        return OCRResponse(extracted_text=text)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
