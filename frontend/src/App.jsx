import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import ImageUploadPanel from './components/ImageUploadPanel'
import BMIPanel from './components/BMIPanel'
import { runOCR, runVision, healthCheck } from './api'

export default function App() {
  const [tab, setTab] = useState('chat')
  const [status, setStatus] = useState('checking')
  const [ocrText, setOcrText] = useState('')
  const [visionSymptoms, setVisionSymptoms] = useState('')

  useEffect(() => {
    healthCheck()
      .then(ok => setStatus(ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'))
  }, [])

  function handleOcrToChat(text) {
    setOcrText(text)
    setTab('chat')
  }

  function handleVisionToChat(symptoms) {
    setVisionSymptoms(symptoms)
    setTab('chat')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={tab} onSelect={setTab} status={status} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        {tab === 'chat' && (
          <ChatPanel ocrText={ocrText} visionSymptoms={visionSymptoms} />
        )}
        {tab === 'ocr' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <ImageUploadPanel
              title="Prescription OCR"
              description="Upload an image of a prescription or medical report to extract the text."
              buttonLabel="Extract Text"
              onUpload={runOCR}
              resultKey="extracted_text"
              resultLabel="Extracted Text"
              onSendToChat={handleOcrToChat}
            />
          </div>
        )}
        {tab === 'vision' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <ImageUploadPanel
              title="Symptom Vision Analysis"
              description="Upload a photo of a visible symptom (rash, wound, swelling, etc.) for AI analysis."
              buttonLabel="Analyze Symptoms"
              onUpload={runVision}
              resultKey="symptoms"
              resultLabel="Detected Symptoms"
              onSendToChat={handleVisionToChat}
            />
          </div>
        )}
        {tab === 'bmi' && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <BMIPanel />
          </div>
        )}
      </main>
    </div>
  )
}
