"""
Health calculators (pure Python, no ML dependency).
"""


def calculate_bmi(weight_kg: float, height_cm: float) -> dict:
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    water_intake_liters = (weight_kg * 35) / 1000

    if bmi < 18.5:
        category = "Underweight"
        emoji = "📉"
    elif bmi < 25:
        category = "Normal Weight"
        emoji = "✅"
    elif bmi < 30:
        category = "Overweight"
        emoji = "📈"
    else:
        category = "Obese"
        emoji = "⚠️"

    return {
        "bmi": round(bmi, 2),
        "category": category,
        "emoji": emoji,
        "water_intake_liters": round(water_intake_liters, 1),
    }
