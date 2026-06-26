import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function ImageUploadPanel({ title, description, buttonLabel, onUpload, resultKey, resultLabel, onSendToChat }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function handleFile(f) {
    if (!f) return
    setFile(f)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  async function handleSubmit() {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await onUpload(file)
      setResult(data[resultKey])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>{description}</p>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: '2px dashed var(--border)',
          borderRadius: 12,
          padding: '36px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'var(--surface)',
          transition: 'border-color 0.15s',
          marginBottom: 16,
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
        ) : (
          <>
            <Upload size={28} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
            <div style={{ color: 'var(--text-sub)', fontSize: 13 }}>Drop an image here or click to select</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>JPG / PNG</div>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      </div>

      {file && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Selected: <span style={{ color: 'var(--text-sub)' }}>{file.name}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        style={{
          padding: '10px 22px',
          background: !file || loading ? 'var(--border)' : 'var(--accent)',
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'background 0.15s',
        }}
      >
        {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
        {loading ? 'Processing…' : buttonLabel}
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(248,81,73,0.1)', borderRadius: 8, color: 'var(--red)', fontSize: 13, display: 'flex', gap: 8 }}>
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}>
            <CheckCircle size={14} /> {resultLabel}
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.6 }}>{result}</pre>
          {onSendToChat && (
            <button
              onClick={() => onSendToChat(result)}
              style={{
                marginTop: 12,
                padding: '7px 16px',
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Send to Chat →
            </button>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
