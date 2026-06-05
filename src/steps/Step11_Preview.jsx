import { useState } from 'react'
import { useStore } from '../store/useStore'
import { shareableUrl } from '../utils/sessionId'
import { sendCompletionEmails } from '../utils/emailSender'
import { exportPreviewPdf } from '../utils/pdfExport'
import SessionCodeModal from '../modals/SessionCodeModal'

import PreviewRecord from '../preview/PreviewRecord'
import PreviewDealRecord from '../preview/PreviewDealRecord'
import PreviewAutomations from '../preview/PreviewAutomations'
import PreviewDashboard from '../preview/PreviewDashboard'
import PreviewViews from '../preview/PreviewViews'
import PreviewCadence from '../preview/PreviewCadence'

const TABS = [
  { key: 'contact', label: 'Contact', render: () => <PreviewRecord slice="contacts" /> },
  { key: 'company', label: 'Company', render: () => <PreviewRecord slice="companies" /> },
  { key: 'deal', label: 'Deals', render: () => <PreviewDealRecord /> },
  { key: 'automations', label: 'Automations', render: () => <PreviewAutomations /> },
  { key: 'dashboard', label: 'Dashboard', render: () => <PreviewDashboard /> },
  { key: 'views', label: 'Views', render: () => <PreviewViews /> },
  { key: 'accountability', label: 'Accountability', render: () => <PreviewCadence /> },
]

// ---- Final email gate (async only) ----
function FinalGate({ onUnlock }) {
  const session = useStore((s) => s.session)
  const [name, setName] = useState(session.gate?.name || '')
  const [email, setEmail] = useState(session.gate?.email || '')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    setBusy(true)
    onUnlock({ name: name.trim(), email: email.trim() })
  }

  return (
    <div className="h-full flex items-center justify-center p-8 bg-hs-canvas">
      <div className="w-full max-w-md bg-white rounded-xl border border-hs-border shadow-sm overflow-hidden">
        <div className="bg-hs-navy px-6 py-5">
          <h2 className="font-preview font-semibold text-white text-xl">
            Your HubSpot blueprint is ready
          </h2>
          <p className="text-[13px] font-preview text-white/70 mt-1">
            See the full interactive preview and get a copy emailed to you.
          </p>
        </div>
        <div className="p-6 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md border border-hs-border px-3 py-2 text-sm font-ui focus:outline-none focus:border-hs-blue"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="w-full rounded-md border border-hs-border px-3 py-2 text-sm font-ui focus:outline-none focus:border-hs-blue"
          />
          <button
            onClick={submit}
            disabled={busy}
            className="w-full bg-hs-orange hover:bg-hs-orange/90 text-white font-ui font-semibold py-2.5 rounded-md disabled:opacity-60"
          >
            {busy ? 'Preparing…' : 'Send Me My Summary & View Preview'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Bottom action bar ----
function ActionBar() {
  const session = useStore((s) => s.session)
  const isLive = session.mode === 'live'
  const [showSession, setShowSession] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)

  const share = () => {
    navigator.clipboard?.writeText(shareableUrl(session.sessionId))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadPdf = async () => {
    setPdfBusy(true)
    await exportPreviewPdf('preview-export-root', `HubSpot-Blueprint-${session.sessionCode}.pdf`)
    setPdfBusy(false)
  }

  const calendly = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/'

  return (
    <>
      <div className="shrink-0 border-t border-hs-border bg-white px-5 py-3 flex items-center gap-2 flex-wrap">
        {isLive ? (
          <>
            <button
              onClick={() => setShowSession(true)}
              className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md"
            >
              Send Session Link to Prospect
            </button>
            <button
              onClick={() => setShowSession(true)}
              className="text-[13px] font-ui font-medium text-hs-text-dark border border-hs-border px-4 py-2 rounded-md hover:border-hs-text-light"
            >
              Generate Session Code
            </button>
            <button
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="text-[13px] font-ui font-medium text-hs-text-dark border border-hs-border px-4 py-2 rounded-md hover:border-hs-text-light disabled:opacity-50"
            >
              {pdfBusy ? 'Building PDF…' : 'Download PDF Summary'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md disabled:opacity-50"
            >
              {pdfBusy ? 'Building PDF…' : 'Download PDF Summary'}
            </button>
            <a
              href={calendly}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-ui font-medium text-white bg-hs-blue px-4 py-2 rounded-md"
            >
              Book a Call with Daniel
            </a>
            <button
              onClick={share}
              className="text-[13px] font-ui font-medium text-hs-text-dark border border-hs-border px-4 py-2 rounded-md hover:border-hs-text-light"
            >
              {copied ? '✓ Link copied' : 'Share This Preview'}
            </button>
          </>
        )}
      </div>
      {showSession && <SessionCodeModal onClose={() => setShowSession(false)} />}
    </>
  )
}

// ---- Main full-width Step 11 ----
export default function Step11_Preview() {
  const session = useStore((s) => s.session)
  const unlockPreview = useStore((s) => s.unlockPreview)
  const beginAsyncSession = useStore((s) => s.beginAsyncSession)
  const [tab, setTab] = useState('contact')

  const isLive = session.mode === 'live'
  const unlocked = isLive || session.previewUnlocked

  const handleUnlock = async ({ name, email }) => {
    beginAsyncSession(name, email)
    unlockPreview()
    // Fire-and-forget emails (don't block unlock on delivery).
    sendCompletionEmails({ ...session, gate: { name, email } })
  }

  if (!unlocked) {
    return <FinalGate onUnlock={handleUnlock} />
  }

  const active = TABS.find((t) => t.key === tab) || TABS[0]

  return (
    <div className="h-full flex flex-col bg-hs-canvas">
      {/* Mock HubSpot top nav */}
      <div className="shrink-0 bg-hs-navy px-5 py-0 flex items-center gap-1 overflow-x-auto hs-scroll">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[13px] font-preview px-3 py-3 border-b-2 whitespace-nowrap ${
              t.key === tab
                ? 'border-hs-orange text-white font-medium'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content (also the PDF export root) */}
      <div id="preview-export-root" className="flex-1 min-h-0 overflow-y-auto hs-scroll">
        {active.render()}
      </div>

      <ActionBar />
    </div>
  )
}
