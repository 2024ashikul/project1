import { MessageSquare, ScanLine, Eye, Activity } from 'lucide-react'

const tabs = [
  { id: 'chat', label: 'Chat', Icon: MessageSquare },
  { id: 'ocr', label: 'Prescription OCR', Icon: ScanLine },
  { id: 'vision', label: 'Symptom Vision', Icon: Eye },
  { id: 'bmi', label: 'BMI Calculator', Icon: Activity },
]

export default function Sidebar({ active, onSelect, status }) {
  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      flexShrink: 0,
    }}>
      <div style={{ paddingLeft: 8, marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
          Medi<span style={{ color: 'var(--accent)' }}>Assist</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>AI Medical Assistant</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-sub)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingLeft: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: status === 'online' ? 'var(--accent)' : status === 'checking' ? 'var(--yellow)' : 'var(--red)',
        }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {status === 'online' ? 'Backend connected' : status === 'checking' ? 'Connecting...' : 'Backend offline'}
        </span>
      </div>
    </aside>
  )
}
