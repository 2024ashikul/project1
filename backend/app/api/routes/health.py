from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.calculators import calculate_bmi

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


class BMIRequest(BaseModel):
    weight_kg: float
    height_cm: float


@router.post("/bmi")
def bmi_endpoint(req: BMIRequest):
    return calculate_bmi(req.weight_kg, req.height_cm)
