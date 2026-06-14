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
import ZoomFrame from '../preview/ZoomFrame'
import {
  IconJourney,
  IconCRM,
  IconMarketing,
  IconSales,
  IconCommerce,
  IconService,
  IconAutomations,
  IconReporting,
  IconCadence,
  IconSearch,
  IconGear,
  IconBell,
  IconHelp,
} from '../preview/hubIcons'

// HubSpot-light demo: left rail mirrors HubSpot's real hub navigation; each hub
// is a polished multi-screen demo view (benefits only — the Crescent Connect
// build work behind it lives in the Fix Plan, not here).
const HUBS = [
  { key: 'journey', label: 'Journey', Icon: IconJourney, render: () => <HubJourney /> },
  { key: 'crm', label: 'CRM', Icon: IconCRM, render: () => <HubCRM /> },
  { key: 'marketing', label: 'Marketing', Icon: IconMarketing, render: () => <HubMarketing /> },
  { key: 'sales', label: 'Sales', Icon: IconSales, render: () => <HubSales /> },
  { key: 'commerce', label: 'Commerce', Icon: IconCommerce, render: () => <HubCommerce /> },
  { key: 'service', label: 'Service', Icon: IconService, render: () => <HubService /> },
  { key: 'automations', label: 'Automations', Icon: IconAutomations, render: () => <PreviewAutomations /> },
  { key: 'reporting', label: 'Reporting', Icon: IconReporting, render: () => <HubReporting /> },
  { key: 'cadence', label: 'Accountability', Icon: IconCadence, render: () => <PreviewCadence /> },
]

// HubSpot-style global top bar: sprocket, search pill, settings/notifications,
// account chip — the chrome that makes the demo read as the real product.
function TopBar() {
  const gate = useStore((s) => s.session.gate)
  const initials =
    (gate?.name || 'You')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'YO'
  const company = gate?.email?.split('@')[1]?.split('.')[0]

  return (
    <div className="shrink-0 h-12 bg-hs-navy flex items-center gap-3 px-3 font-preview">
      <img
        src="/cc-mark-white.png"
        alt="Crescent Connect"
        className="h-7 w-auto shrink-0"
        aria-hidden
      />
      {/* Search pill */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-2 h-8 px-3 rounded bg-white/10 border border-white/20 text-white/50 text-[12.5px]">
          <IconSearch width={13} height={13} />
          Search {company ? `${company} CRM` : 'HubSpot'}
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1 text-white/70">
        <span className="p-2 rounded hover:bg-white/10" title="Settings">
          <IconGear width={15} height={15} />
        </span>
        <span className="p-2 rounded hover:bg-white/10" title="Notifications">
          <IconBell width={15} height={15} />
        </span>
        <span className="p-2 rounded hover:bg-white/10" title="Help">
          <IconHelp width={15} height={15} />
        </span>
      </div>
      <div className="flex items-center gap-2 pl-2 border-l border-white/15">
        <span className="w-7 h-7 rounded-full bg-hs-calypso text-white text-[11px] font-semibold flex items-center justify-center">
          {initials}
        </span>
        <span className="text-white/80 text-[12.5px] hidden sm:block">
          {company ? `${company[0].toUpperCase()}${company.slice(1)}` : 'Your Company'}
        </span>
      </div>
    </div>
  )
}

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
            className="hs-input w-full px-3 py-2 text-sm font-ui"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="hs-input w-full px-3 py-2 text-sm font-ui"
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
      <div className="shrink-0 border-t border-hs-border bg-white px-5 py-3 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => goToStep(1)}
          className="text-[13px] font-ui font-medium text-hs-text-light hover:text-hs-navy"
        >
          ← Back to your build plan
        </button>
        <span className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
          Step 3 of 4
        </span>
        <span className="flex-1" />
        <DownloadPdfButton variant="secondary" label="Download PDF" />
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
      <TopBar />
      <div className="flex-1 flex min-h-0">
        {/* HubSpot-style left rail */}
        <nav className="shrink-0 w-12 md:w-44 bg-hs-navy flex flex-col py-2 overflow-y-auto hs-scroll">
          {HUBS.map((h) => {
            const isActive = h.key === hub
            const Icon = h.Icon
            return (
              <button
                key={h.key}
                onClick={() => setHub(h.key)}
                title={h.label}
                aria-label={h.label}
                className={`flex items-center gap-2.5 px-3.5 md:px-4 py-2.5 text-left text-[13px] font-preview transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white border-l-[3px] border-hs-orange'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                }`}
              >
                <Icon width={15} height={15} className="shrink-0" />
                <span className="hidden md:inline">{h.label}</span>
              </button>
            )
          })}
          <div className="mt-auto px-4 py-3 text-[10px] font-preview text-white/40 leading-snug hidden md:block">
            Demo preview — your real portal is built by Crescent Connect.
          </div>
        </nav>

        {/* Active hub view (also the PDF export root). Zoom magnifies just this
            demo region — the rail, top bar, and action bar stay fixed. */}
        <div id="preview-export-root" className="flex-1 min-w-0 min-h-0">
          <ZoomFrame>{active.render()}</ZoomFrame>
        </div>
      </div>

      <ActionBar />
    </div>
  )
}
