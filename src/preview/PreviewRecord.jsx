import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SAMPLE, SAMPLE_ACTIVITY } from './sampleData'

const ACCENT = {
  contacts: '#0091AE',
  companies: '#6A78D1',
  deals: '#00BDA5',
  tickets: '#F2545B',
}

// Small reusable row card for section content.
function Row({ icon, title, sub, right }) {
  return (
    <div className="bg-white rounded-md border border-hs-border px-3 py-2 flex items-start gap-2.5">
      {icon && <span className="text-[14px] leading-none mt-0.5">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-preview text-hs-text-dark leading-snug">{title}</p>
        {sub && <p className="text-[11px] font-preview text-hs-text-light">{sub}</p>}
      </div>
      {right && <span className="text-[12px] font-preview text-hs-green shrink-0">{right}</span>}
    </div>
  )
}

const Empty = ({ children }) => (
  <p className="text-[13px] font-preview text-hs-text-light">{children}</p>
)

// Render the right-pane content for whichever section tab is active.
// Matches on keywords in the section label so custom sections still resolve sensibly.
function SectionContent({ label, record }) {
  const l = label.toLowerCase()

  if (l.includes('deal')) {
    return (
      <div className="space-y-2">
        <Row icon="💰" title="Gulf Coast — SIHI Vacuum Pump Package" sub="Proposal Sent" right="$84,500" />
        <Row icon="💰" title="Gulf Coast — Seal Replacement Parts" sub="Qualified" right="$12,300" />
      </div>
    )
  }
  if (l.includes('company') || l.includes('account')) {
    return (
      <div className="space-y-2">
        <Row icon="🏢" title="Gulf Coast Chemical" sub="Chemical Manufacturing · Baton Rouge, LA" />
        <Row icon="👥" title="320 employees · $48M revenue" sub="Customer · Tier 1" />
      </div>
    )
  }
  if (l.includes('contact')) {
    return (
      <div className="space-y-2">
        <Row icon="👤" title="Maria Chen" sub="VP of Operations" />
        <Row icon="👤" title="James Boudreaux" sub="Maintenance Manager" />
        <Row icon="👤" title="Priya Nair" sub="Procurement Lead" />
      </div>
    )
  }
  if (l.includes('communication') || l.includes('email')) {
    return (
      <div className="space-y-2">
        <Row icon="📧" title="Quote follow-up #1" sub="Sent 3 days ago · Opened" />
        <Row icon="📞" title="Call — discussed seal options" sub="2 days ago · 12 min" />
        <Row icon="📧" title="Intro + capability overview" sub="2 weeks ago · Replied" />
      </div>
    )
  }
  if (l.includes('task') || l.includes('reminder')) {
    return (
      <div className="space-y-2">
        <Row icon="✓" title="Send updated pricing" sub="Due Jun 12 · You" />
        <Row icon="◻️" title="Confirm install window" sub="Due Jun 18 · You" />
      </div>
    )
  }
  if (l.includes('note')) {
    return (
      <div className="space-y-2">
        <Row icon="📝" title="Prefers Tier 1 response time" sub="1 week ago" />
        <Row icon="📝" title="Budget approved for Q3 capital" sub="2 weeks ago" />
      </div>
    )
  }
  if (l.includes('about') || l.includes('overview')) {
    return (
      <Row
        icon="ℹ️"
        title="Key account — primary contact for all rotating equipment at Gulf Coast."
        sub="Owned by Daniel Fouquet · Last activity 2 days ago"
      />
    )
  }

  // Default + "Activity Feed": the configured activity timeline.
  const enabledActivities = record.activities.filter((a) => a.enabled)
  if (enabledActivities.length === 0) return <Empty>No activity types selected.</Empty>
  return (
    <div className="space-y-2">
      {enabledActivities.map((a) => {
        const entry = SAMPLE_ACTIVITY[a.key]
        if (!entry) return null
        return <Row key={a.key} icon={entry.icon} title={entry.text} sub={entry.when} />
      })}
    </div>
  )
}

// Generic HubSpot-style record preview driven by the slice's enabled props/sections/activities.
export default function PreviewRecord({ slice }) {
  const record = useStore((s) => s.session[slice])
  const sample = SAMPLE[slice]
  const accent = ACCENT[slice] || '#0091AE'

  const enabledProps = record.properties.filter((p) => p.enabled)
  const enabledSections = record.sections.filter((s) => s.enabled)

  const [activeKey, setActiveKey] = useState(enabledSections[0]?.key)

  // Keep the active tab valid if sections are toggled/removed.
  useEffect(() => {
    if (!enabledSections.some((s) => s.key === activeKey)) {
      setActiveKey(enabledSections[0]?.key)
    }
  }, [enabledSections, activeKey])

  const activeSection = enabledSections.find((s) => s.key === activeKey) || enabledSections[0]

  return (
    <div className="p-5">
      {/* Record header */}
      <div className="bg-white rounded-t-lg border border-hs-border px-5 py-4 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-preview font-semibold"
          style={{ backgroundColor: accent }}
        >
          {sample.initials}
        </div>
        <div className="min-w-0">
          <h2 className="font-preview font-semibold text-hs-navy text-lg leading-tight truncate">
            {sample.title}
          </h2>
          <p className="text-[13px] text-hs-text-light font-preview truncate">{sample.subtitle}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="bg-white border-x border-hs-border px-5 py-2 flex gap-2">
        {['Note', 'Email', 'Call', 'Task', 'Meeting'].map((a) => (
          <span
            key={a}
            className="text-[12px] font-preview text-hs-blue border border-hs-border rounded px-2.5 py-1"
          >
            {a}
          </span>
        ))}
      </div>

      {/* Body: left = About (properties), right = section tabs + content */}
      <div className="grid grid-cols-5 gap-0 border-x border-b border-hs-border rounded-b-lg overflow-hidden">
        {/* Left: About card */}
        <div className="col-span-2 bg-white border-r border-hs-border p-4">
          <h3 className="text-[12px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-3">
            About this {slice.replace(/s$/, '')}
          </h3>
          <dl className="space-y-2.5">
            {enabledProps.map((p) => (
              <div key={p.key}>
                <dt className="text-[11px] font-preview text-hs-text-light">{p.label}</dt>
                <dd className="text-[13px] font-preview text-hs-text-dark">
                  {sample.values[p.key] ?? <span className="text-hs-text-light">—</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: clickable section tabs + active section content */}
        <div className="col-span-3 bg-hs-canvas p-4">
          <div className="flex flex-wrap gap-1 mb-4 border-b border-hs-border">
            {enabledSections.map((sec) => {
              const active = sec.key === activeSection?.key
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveKey(sec.key)}
                  className={`text-[12px] font-preview px-2.5 py-1.5 -mb-px border-b-2 ${
                    active
                      ? 'bg-white text-hs-navy border-hs-orange font-medium rounded-t'
                      : 'text-hs-text-light border-transparent hover:text-hs-navy'
                  }`}
                >
                  {sec.label}
                </button>
              )
            })}
          </div>

          {activeSection ? (
            <SectionContent label={activeSection.label} record={record} />
          ) : (
            <Empty>No sections enabled.</Empty>
          )}
        </div>
      </div>
    </div>
  )
}
