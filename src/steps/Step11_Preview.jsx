import { useState } from 'react'
import { useStore } from '../store/useStore'
import DownloadPdfButton from '../components/DownloadPdfButton'

import HubJourney from '../preview/hubs/HubJourney'
import HubCRM from '../preview/hubs/HubCRM'
import HubSales from '../preview/hubs/HubSales'
import HubMarketing from '../preview/hubs/HubMarketing'
import HubCommerce from '../preview/hubs/HubCommerce'
import HubService from '../preview/hubs/HubService'
import HubReporting from '../preview/hubs/HubReporting'
import PreviewAutomations from '../preview/PreviewAutomations'
import PreviewCadence from '../preview/PreviewCadence'

// HubSpot-light demo: left rail mirrors HubSpot's real hub navigation; each hub
// is a polished multi-screen demo view (benefits only — the Crescent Connect
// build work behind it lives in the Fix Plan, not here).
const HUBS = [
  { key: 'journey', label: 'Journey', icon: '🧭', render: () => <HubJourney /> },
  { key: 'crm', label: 'CRM', icon: '👥', render: () => <HubCRM /> },
  { key: 'marketing', label: 'Marketing', icon: '📣', render: () => <HubMarketing /> },
  { key: 'sales', label: 'Sales', icon: '💰', render: () => <HubSales /> },
  { key: 'commerce', label: 'Commerce', icon: '🧾', render: () => <HubCommerce /> },
  { key: 'service', label: 'Service', icon: '🛟', render: () => <HubService /> },
  { key: 'automations', label: 'Automations', icon: '⚡', render: () => <PreviewAutomations /> },
  { key: 'reporting', label: 'Reporting', icon: '📊', render: () => <HubReporting /> },
  { key: 'cadence', label: 'Accountability', icon: '🗓', render: () => <PreviewCadence /> },
]

// ---- Final gate (async only): capture name + email for lead records, no sending ----
function FinalGate({ onUnlock }) {
  const session = useStore((s) => s.session)
  const [name, setName] = useState(session.gate?.name || '')
  const [email, setEmail] = useState(session.gate?.email || '')

  const submit = () => {
    if (!name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    onUnlock({ name: name.trim(), email: email.trim() })
  }

  return (
    <div className="h-full flex items-center justify-center p-8 bg-hs-canvas">
      <div className="w-full max-w-md bg-white rounded-xl border border-hs-border shadow-sm overflow-hidden">
        <div className="bg-hs-navy px-6 py-5">
          <h2 className="font-preview font-semibold text-white text-xl">
            Your HubSpot demo is ready
          </h2>
          <p className="text-[13px] font-preview text-white/70 mt-1">
            Walk through every hub and download your blueprint as a PDF.
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
            className="w-full bg-hs-orange hover:bg-hs-orange/90 text-white font-ui font-semibold py-2.5 rounded-md"
          >
            View My HubSpot Demo →
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Bottom action bar ----
const BOOKING_URL =
  import.meta.env.VITE_BOOKING_URL ||
  'https://meetings-na2.hubspot.com/crescent/crm-demo-call'

function ActionBar() {
  const isCustomer = useStore((s) => s.session.mode) !== 'live'
  const goToStep = useStore((s) => s.goToStep)

  if (isCustomer) {
    // Customer funnel: the routed CTA lives on the Next Steps screen.
    return (
      <div className="shrink-0 border-t border-hs-border bg-white px-5 py-3 flex items-center justify-between gap-2 flex-wrap">
        <DownloadPdfButton variant="secondary" label="Download PDF Summary" />
        <button onClick={() => goToStep(3)} className="hs-btn-primary">
          See your next steps →
        </button>
      </div>
    )
  }

  return (
    <div className="shrink-0 border-t border-hs-border bg-white px-5 py-3 flex items-center gap-2 flex-wrap">
      <DownloadPdfButton variant="primary" label="Download PDF Summary" />
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noreferrer"
        className="text-[13px] font-ui font-medium text-white bg-hs-blue px-4 py-2 rounded-[3px]"
      >
        Book a Call with Daniel
      </a>
    </div>
  )
}

export default function Step11_Preview() {
  const session = useStore((s) => s.session)
  const unlockPreview = useStore((s) => s.unlockPreview)
  const beginAsyncSession = useStore((s) => s.beginAsyncSession)
  const [hub, setHub] = useState('journey')

  const isLive = session.mode === 'live'
  // Email is already captured at the front gate — don't ask twice.
  const unlocked = isLive || session.previewUnlocked || Boolean(session.gate?.email)

  const handleUnlock = ({ name, email }) => {
    beginAsyncSession(name, email)
    unlockPreview()
  }

  if (!unlocked) {
    return <FinalGate onUnlock={handleUnlock} />
  }

  const active = HUBS.find((h) => h.key === hub) || HUBS[0]

  return (
    <div className="h-full flex flex-col bg-hs-canvas">
      <div className="flex-1 flex min-h-0">
        {/* HubSpot-style left rail */}
        <nav className="shrink-0 w-44 bg-hs-navy flex flex-col py-2 overflow-y-auto hs-scroll">
          {/* Sprocket-ish brand mark */}
          <div className="px-4 py-2 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-hs-orange flex items-center justify-center text-white text-[13px]">
              ⚙
            </span>
            <span className="text-white/90 font-preview font-semibold text-[13px]">
              Your HubSpot
            </span>
          </div>
          {HUBS.map((h) => {
            const isActive = h.key === hub
            return (
              <button
                key={h.key}
                onClick={() => setHub(h.key)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-preview transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white border-l-[3px] border-hs-orange'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                }`}
              >
                <span className="text-[14px]">{h.icon}</span>
                {h.label}
              </button>
            )
          })}
          <div className="mt-auto px-4 py-3 text-[10px] font-preview text-white/40 leading-snug">
            Demo preview — your real portal is built by Crescent Connect.
          </div>
        </nav>

        {/* Active hub view (also the PDF export root) */}
        <div id="preview-export-root" className="flex-1 min-w-0 min-h-0">
          {active.render()}
        </div>
      </div>

      <ActionBar />
    </div>
  )
}
