import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SAMPLE, SAMPLE_ACTIVITY } from './sampleData'
import { DataTable } from './charts'
import {
  Tag,
  IconDollar,
  IconBuilding,
  IconUsers,
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconSquare,
  IconNote,
  IconInfo,
  IconCalendar,
  IconDoc,
  IconTicket,
} from './uiIcons'
import { CONTACTS, COMPANIES, TICKETS } from './demoData'

// Compact example index table per record type (shown under the record preview
// on the configurator steps, mirroring the final demo's list views).
const INDEX_TABLES = {
  contacts: {
    title: 'Example list view — Contacts',
    columns: [
      { key: 'name', label: 'Name', render: (v, r) => (
        <span>
          <span className="hs-link font-semibold">{v}</span>
          <span className="block text-[10px] text-hs-text-light">{r.title}</span>
        </span>
      ) },
      { key: 'company', label: 'Company' },
      { key: 'lifecycle', label: 'Lifecycle', render: (v) => <Tag color={{ Lead: 'blue', MQL: 'purple', Customer: 'green', Evangelist: 'orange' }[v] || 'gray'}>{v}</Tag> },
      { key: 'owner', label: 'Owner' },
      { key: 'lastActivity', label: 'Last Activity', render: (v) => <span className="text-hs-text-light">{v}</span> },
    ],
    rows: () => CONTACTS.slice(0, 6),
  },
  companies: {
    title: 'Example list view — Companies',
    columns: [
      { key: 'name', label: 'Company', render: (v) => <span className="hs-link font-semibold">{v}</span> },
      { key: 'city', label: 'City' },
      { key: 'industry', label: 'Industry' },
      { key: 'tier', label: 'Tier', render: (v) => <Tag color={{ 'Tier 1': 'green', 'Tier 2': 'blue' }[v] || 'gray'}>{v}</Tag> },
      { key: 'lifecycle', label: 'Lifecycle', render: (v) => <Tag color={{ Customer: 'green', Target: 'blue' }[v] || 'gray'}>{v}</Tag> },
    ],
    rows: () => COMPANIES.slice(0, 6),
  },
  tickets: {
    title: 'Example list view — Tickets',
    columns: [
      { key: 'name', label: 'Ticket', render: (v) => <span className="hs-link font-semibold">{v}</span> },
      { key: 'company', label: 'Company' },
      { key: 'priority', label: 'Priority', render: (v) => <Tag color={{ High: 'red', Medium: 'orange' }[v] || 'gray'}>{v}</Tag> },
      { key: 'status', label: 'Status', render: (v) => <Tag color={{ New: 'blue', 'In Progress': 'orange', Resolved: 'green' }[v] || 'purple'}>{v}</Tag> },
      { key: 'owner', label: 'Owner' },
    ],
    rows: () => TICKETS.slice(0, 6),
  },
}

const ACCENT = {
  contacts: '#0091AE',
  companies: '#6A78D1',
  deals: '#00BDA5',
  tickets: '#F2545B',
}

// Small reusable row card for section content. `icon` is an icon component.
function Row({ icon: Icon, title, sub, right }) {
  return (
    <div className="bg-white rounded-md border border-hs-border px-3 py-2 flex items-start gap-2.5">
      {Icon && (
        <span className="w-6 h-6 rounded-full bg-hs-koala text-hs-navydeep flex items-center justify-center shrink-0 mt-0.5">
          <Icon width={12} height={12} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-preview text-hs-text-dark leading-snug">{title}</p>
        {sub && <p className="text-[11px] font-preview text-hs-text-light">{sub}</p>}
      </div>
      {right && <span className="text-[12px] font-preview text-hs-green shrink-0">{right}</span>}
    </div>
  )
}

// Activity-type icons for the configured activity timeline (replaces the emoji
// glyphs stored in sampleData so the feed reads like product UI).
const ACTIVITY_ICON = {
  calls: IconPhone,
  emails: IconMail,
  meetings: IconCalendar,
  notes: IconNote,
  tasks: IconCheck,
  form_submissions: IconDoc,
  deals_created: IconDollar,
  ticket_updates: IconTicket,
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
        <Row icon={IconDollar} title="Gulf Coast — SIHI Vacuum Pump Package" sub="Proposal Sent" right="$84,500" />
        <Row icon={IconDollar} title="Gulf Coast — Seal Replacement Parts" sub="Qualified" right="$12,300" />
      </div>
    )
  }
  if (l.includes('company') || l.includes('account')) {
    return (
      <div className="space-y-2">
        <Row icon={IconBuilding} title="Gulf Coast Chemical" sub="Chemical Manufacturing · Baton Rouge, LA" />
        <Row icon={IconUsers} title="320 employees · $48M revenue" sub="Customer · Tier 1" />
      </div>
    )
  }
  if (l.includes('contact')) {
    return (
      <div className="space-y-2">
        <Row icon={IconUser} title="Maria Chen" sub="VP of Operations" />
        <Row icon={IconUser} title="James Boudreaux" sub="Maintenance Manager" />
        <Row icon={IconUser} title="Priya Nair" sub="Procurement Lead" />
      </div>
    )
  }
  if (l.includes('communication') || l.includes('email')) {
    return (
      <div className="space-y-2">
        <Row icon={IconMail} title="Quote follow-up #1" sub="Sent 3 days ago · Opened" />
        <Row icon={IconPhone} title="Call — discussed seal options" sub="2 days ago · 12 min" />
        <Row icon={IconMail} title="Intro + capability overview" sub="2 weeks ago · Replied" />
      </div>
    )
  }
  if (l.includes('task') || l.includes('reminder')) {
    return (
      <div className="space-y-2">
        <Row icon={IconCheck} title="Send updated pricing" sub="Due Jun 12 · You" />
        <Row icon={IconSquare} title="Confirm install window" sub="Due Jun 18 · You" />
      </div>
    )
  }
  if (l.includes('note')) {
    return (
      <div className="space-y-2">
        <Row icon={IconNote} title="Prefers Tier 1 response time" sub="1 week ago" />
        <Row icon={IconNote} title="Budget approved for Q3 capital" sub="2 weeks ago" />
      </div>
    )
  }
  if (l.includes('about') || l.includes('overview')) {
    return (
      <Row
        icon={IconInfo}
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
        return <Row key={a.key} icon={ACTIVITY_ICON[a.key]} title={entry.text} sub={entry.when} />
      })}
    </div>
  )
}

// Generic HubSpot-style record preview driven by the slice's enabled props/sections/activities.
// showIndexTable appends the example list view (used on configurator steps, not in popups).
export default function PreviewRecord({ slice, showIndexTable = false }) {
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

      {/* Example list view (mirrors the final demo's index pages) */}
      {showIndexTable && INDEX_TABLES[slice] && (
        <div className="mt-4 bg-white rounded-lg border border-hs-border p-4">
          <h3 className="text-[12px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
            {INDEX_TABLES[slice].title}
          </h3>
          <DataTable
            columns={INDEX_TABLES[slice].columns}
            rows={INDEX_TABLES[slice].rows()}
            compact
          />
        </div>
      )}
    </div>
  )
}
