import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { sendChat } from '../api'

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: 'var(--accent)', marginRight: 8, flexShrink: 0, marginTop: 2,
        }}>M</div>
      )}
      <div style={{
        maxWidth: '72%',
        background: isUser ? 'var(--accent)' : 'var(--surface-2)',
        color: isUser ? '#fff' : 'var(--text)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        padding: '10px 14px',
        fontSize: 13.5,
        lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
      }}>
        {content}
      </div>
    </div>
  )
}

export default function ChatPanel({ ocrText, visionSymptoms }) {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError('')

    const userMsg = { role: 'user', content: text }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setLoading(true)

    try {
      const { answer } = await sendChat({
        user_input: text,
        chat_history: history,
        ocr_text: ocrText || null,
        vision_symptoms: visionSymptoms || null,
      })
      setHistory([...newHistory, { role: 'assistant', content: answer }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {(ocrText || visionSymptoms) && (
        <div style={{
          padding: '10px 16px',
          background: 'var(--accent-dim)',
          borderBottom: '1px solid var(--border)',
          fontSize: 12,
          color: 'var(--accent)',
        }}>
          {ocrText && <span>📄 OCR text attached · </span>}
          {visionSymptoms && <span>👁️ Vision analysis attached</span>}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {history.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🩺</div>
            <div style={{ fontSize: 15, color: 'var(--text-sub)', fontWeight: 500 }}>Ask me anything medical</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Powered by RAG over your medical books</div>
          </div>
        )}
        {history.map((msg, i) => <Message key={i} {...msg} />)}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            Thinking...
          </div>
        )}
        {error && (
          <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 8, padding: '8px 12px', background: 'rgba(248,81,73,0.1)', borderRadius: 6 }}>
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 8,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your symptoms or ask a medical question…"
          rows={2}
          style={{
            flex: 1,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 12px',
            color: 'var(--text)',
            fontSize: 13,
            resize: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '0 14px',
            background: loading || !input.trim() ? 'var(--border)' : 'var(--accent)',
            color: '#fff',
            borderRadius: 8,
            transition: 'background 0.15s',
          }}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
