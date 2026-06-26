const BASE = '/api'

export async function sendChat({ user_input, chat_history, ocr_text, vision_symptoms }) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_input, chat_history, ocr_text, vision_symptoms }),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Chat failed')
  return res.json() // { answer }
}

export async function runOCR(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/ocr`, { method: 'POST', body: form })
  if (!res.ok) throw new Error((await res.json()).detail || 'OCR failed')
  return res.json() // { extracted_text }
}

export async function runVision(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/vision`, { method: 'POST', body: form })
  if (!res.ok) throw new Error((await res.json()).detail || 'Vision failed')
  return res.json() // { symptoms }
}

export async function calcBMI(weight_kg, height_cm) {
  const res = await fetch(`${BASE}/bmi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weight_kg, height_cm }),
  })
  if (!res.ok) throw new Error('BMI calculation failed')
  return res.json() // { bmi, category, emoji, water_intake_liters }
}

export async function healthCheck() {
  const res = await fetch(`${BASE}/health`)
  return res.ok
}
