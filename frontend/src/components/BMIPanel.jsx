import { useState } from 'react'
import { calcBMI } from '../api'
import { Loader2 } from 'lucide-react'

export default function BMIPanel() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCalc() {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    if (!w || !h || w <= 0 || h <= 0) { setError('Enter valid weight and height.'); return }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await calcBMI(w, h)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, value, onChange, placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '10px 12px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text)',
          fontSize: 14,
          width: '100%',
        }}
      />
    </div>
  )

  const bmiColor = result
    ? result.bmi < 18.5 ? '#58a6ff'
    : result.bmi < 25 ? 'var(--accent)'
    : result.bmi < 30 ? 'var(--yellow)'
    : 'var(--red)'
    : 'var(--accent)'

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>BMI Calculator</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Calculate your Body Mass Index and daily water intake recommendation.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Field label="Weight (kg)" value={weight} onChange={setWeight} placeholder="e.g. 70" />
        <Field label="Height (cm)" value={height} onChange={setHeight} placeholder="e.g. 175" />
      </div>

      <button
        onClick={handleCalc}
        disabled={loading}
        style={{
          width: '100%',
          padding: '11px',
          background: loading ? 'var(--border)' : 'var(--accent)',
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
        {loading ? 'Calculating…' : 'Calculate'}
      </button>

      {error && (
        <div style={{ marginTop: 14, color: 'var(--red)', fontSize: 13 }}>⚠️ {error}</div>
      )}

      {result && (
        <div style={{ marginTop: 24, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 48, fontFamily: 'var(--font-display)', fontWeight: 700, color: bmiColor, lineHeight: 1 }}>
              {result.bmi}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>BMI</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{result.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: bmiColor, marginTop: 4 }}>{result.category}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Category</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>💧</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#58a6ff', marginTop: 4 }}>{result.water_intake_liters} L</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Daily water intake</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
