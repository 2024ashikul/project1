"""
Gemini-powered image analysis:
  - analyze_symptoms_from_image : visual symptom checker
  - extract_text_from_image     : prescription / report OCR
"""
import google.generativeai as genai
from PIL import Image

from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
_MODEL = "gemini-2.5-flash"


def analyze_symptoms_from_image(image: Image.Image) -> str:
    """
    Returns a plain-text description of visible symptoms in Bengali.
    Never returns a diagnosis — only observable findings.
    """
    try:
        model = genai.GenerativeModel(_MODEL)
        prompt = (
            "You are an expert clinical observer. Look at this medical image "
            "(e.g., skin rash, wound, eye redness) and accurately describe the "
            "visible symptoms in 2-3 short sentences. "
            "DO NOT provide a diagnosis, disease name, or medical advice. "
            "Just describe what you see physically (color, shape, texture, location). "
            "Reply in Bengali."
        )
        response = model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        raise RuntimeError(f"Vision analysis failed: {e}")


def extract_text_from_image(image: Image.Image) -> str:
    """
    OCR a medical prescription or lab report image.
    Returns the extracted text (medicines, dosages, instructions).
    """
    try:
        model = genai.GenerativeModel(_MODEL)
        prompt = (
            "You are an expert pharmacist and medical document reader. "
            "Carefully read this medical prescription or lab report. "
            "Extract all text, focusing heavily on: "
            "1. Medicine names  2. Dosages (e.g., 500mg, 1+0+1)  "
            "3. Duration (e.g., for 5 days)  4. Any medical advice or test results. "
            "If handwritten, use your medical knowledge to accurately decipher terms. "
            "Format the extracted text neatly. Do not give medical advice here, just extract."
        )
        response = model.generate_content([prompt, image])
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {e}")
