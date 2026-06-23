import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SAMPLE, SAMPLE_ACTIVITY } from './sampleData'
import { DataTable } from './charts'
import {
  Tag,
  IconDollar,
  IconBuilding,
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconNote,
  IconInfo,
  IconCalendar,
  IconTicket,
} from './uiIcons'
import { CONTACTS, COMPANIES, TICKETS } from './demoData'
import { money } from './recordHelpers'
import {
  associatedCompany,
  associatedContacts,
  associatedDeals,
  associatedTickets,
  toFeatured,
} from './associations'

// Example list view per record type (shown under the record preview on the
// configurator steps, mirroring the final demo's index pages). Columns are NOT
// hardcoded — they're driven by whichever properties are enabled on the left, so
// checking a property adds it both to the record card AND to this list view.
const LIFECYCLE_COLORS = { Lead: 'blue', MQL: 'purple', Customer: 'green', Evangelist: 'orange', Target: 'blue', 'Past client': 'gray' }
const TIER_COLORS = { 'Tier 1': 'green', 'Tier 2': 'blue', 'Tier 3': 'gray' }
const PRIORITY_COLORS = { High: 'red', Medium: 'orange', Low: 'gray' }
const STATUS_COLORS = { New: 'blue', 'In Progress': 'orange', Resolved: 'green', Closed: 'gray', 'Waiting on Customer': 'purple' }

// Per-slice: the pinned identity column, property keys covered by it (skipped as
// their own columns), the demo rows, and a resolver mapping a property key to the
// matching demo-row field. Anything without per-row demo data falls back to the
// single-record SAMPLE value, then an em-dash.
const LIST_CONFIG = {
  contacts: {
    title: 'Example list view — Contacts',
    rows: () => CONTACTS.slice(0, 7),
    skip: ['first_name', 'last_name'],
    identity: {
      key: 'name',
      label: 'Name',
      render: (r) => (
        <span>
          <span className="hs-link font-semibold">{r.name}</span>
          <span className="block text-[10px] text-hs-text-light">{r.title}</span>
        </span>
      ),
    },
    cell: {
      email: (r) => r.email,
      phone: (r) => r.phone,
      job_title: (r) => r.title,
      contact_owner: (r) => r.owner,
      last_activity_date: (r) => <span className="text-hs-text-light">{r.lastActivity}</span>,
      lifecycle_stage: (r) => <Tag color={LIFECYCLE_COLORS[r.lifecycle] || 'gray'}>{r.lifecycle}</Tag>,
    },
  },
  companies: {
    title: 'Example list view — Companies',
    rows: () => COMPANIES.slice(0, 7),
    skip: ['company_name', 'domain'],
    identity: {
      key: 'name',
      label: 'Company',
      render: (r) => <span className="hs-link font-semibold">{r.name}</span>,
    },
    cell: {
      city_state: (r) => r.city,
      lifecycle_stage: (r) => <Tag color={LIFECYCLE_COLORS[r.lifecycle] || 'gray'}>{r.lifecycle}</Tag>,
      customer_tier: (r) => <Tag color={TIER_COLORS[r.tier] || 'gray'}>{r.tier}</Tag>,
    },
  },
  tickets: {
    title: 'Example list view — Tickets',
    rows: () => TICKETS.slice(0, 7),
    skip: ['ticket_name', 'pipeline'],
    identity: {
      key: 'name',
      label: 'Ticket',
      render: (r) => <span className="hs-link font-semibold">{r.name}</span>,
    },
    cell: {
      status: (r) => <Tag color={STATUS_COLORS[r.status] || 'purple'}>{r.status}</Tag>,
      priority: (r) => <Tag color={PRIORITY_COLORS[r.priority] || 'gray'}>{r.priority}</Tag>,
    },
  },
}

// Build the list columns from the enabled properties, honoring saved column order.
function buildListColumns(slice, enabledProps, columnOrder, sample) {
  const cfg = LIST_CONFIG[slice]
  if (!cfg) return null
  let props = enabledProps.filter((p) => !cfg.skip.includes(p.key))
  if (columnOrder && columnOrder.length) {
    const rank = (k) => {
      const i = columnOrder.indexOf(k)
      return i < 0 ? 999 : i
    }
    props = props.slice().sort((a, b) => rank(a.key) - rank(b.key))
  }
  const cols = props.map((p) => {
    const resolve = cfg.cell[p.key]
    return {
      key: p.key,
      label: p.label,
      render: (_v, r) => {
        const out = resolve ? resolve(r) : undefined
        if (out !== undefined && out !== null && out !== '') return out
        const fb = sample?.values?.[p.key]
        return fb != null && fb !== '' ? fb : <span className="text-hs-text-light">—</span>
      },
    }
  })
  return [
    { key: cfg.identity.key, label: cfg.identity.label, render: (_v, r) => cfg.identity.render(r) },
    ...cols,
  ]
}

const ACCENT = {
  contacts: '#0091AE',
  companies: '#6A78D1',
  deals: '#00BDA5',
  tickets: '#F2545B',
}

const NOUN = { contacts: 'contact', companies: 'company', deals: 'deal', tickets: 'ticket' }

const ACTION_ICON = { Note: IconNote, Email: IconMail, Call: IconPhone, Task: IconCheck, Meeting: IconCalendar }

// Activity-type icons for the configured activity timeline (replaces the emoji
// glyphs stored in sampleData so the feed reads like product UI).
const ACTIVITY_ICON = {
  calls: IconPhone,
  emails: IconMail,
  meetings: IconCalendar,
  notes: IconNote,
  tasks: IconCheck,
  form_submissions: IconInfo,
  deals_created: IconDollar,
  ticket_updates: IconTicket,
}

// Which HubSpot region a configured section belongs to. About → left identity rail,
// activity/comms/notes → center timeline, everything else (associations, tasks,
// line items) → right sidebar cards. Keeps the preview "exactly as configured" while
// laying out like a real HubSpot record.
function sectionRegion(label) {
  const l = label.toLowerCase()
  if (l.includes('about') || l.includes('overview')) return 'left'
  if (l.includes('activity') || l.includes('communication') || l.includes('email') || l.includes('note'))
    return 'center'
  return 'right'
}

const Empty = ({ children }) => (
  <p className="text-[13px] font-preview text-hs-text-light">{children}</p>
)

// Small reusable timeline row.
function Row({ icon: Icon, title, sub }) {
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
    </div>
  )
}

// Center-column content for an activity/comms/notes section.
function CenterSection({ label, record }) {
  const l = label.toLowerCase()

  if (l.includes('communication')) {
    return (
      <div className="space-y-2">
        <Row icon={IconMail} title="Quote follow-up #1" sub="Sent 3 days ago · Opened" />
        <Row icon={IconPhone} title="Call — discussed seal options" sub="2 days ago · 12 min" />
        <Row icon={IconMail} title="Intro + capability overview" sub="2 weeks ago · Replied" />
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

// A single clickable (or static) row inside a right-rail association card.
function AssocRow({ onClick, title, sub, right }) {
  const clickable = !!onClick
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`w-full text-left flex items-start gap-2 rounded-md border border-hs-border bg-white px-2.5 py-2 ${
        clickable ? 'hover:border-hs-calypso cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className={`text-[12px] leading-snug truncate ${clickable ? 'hs-link font-medium' : 'text-hs-text-dark'}`}>
          {title}
        </p>
        {sub && <p className="text-[11px] text-hs-text-light truncate">{sub}</p>}
      </div>
      {right && <span className="text-[12px] text-hs-green font-medium shrink-0">{right}</span>}
    </button>
  )
}

// Right-rail association card (Companies / Deals / Contacts / Tickets / Tasks / Line items),
// resolved from the featured record's company so links open the real example records.
function AssocCard({ label, companyName, excludeName, dealStages, openRecord }) {
  const l = label.toLowerCase()
  let Icon = IconInfo
  let rows = []

  if (l.includes('deal')) {
    Icon = IconDollar
    rows = associatedDeals(companyName).map((d) => {
      const idx = Math.min(Math.max(d.stage ?? 0, 0), (dealStages?.length || 1) - 1)
      const stage = dealStages?.[idx]?.label
      return {
        key: d.name,
        title: d.name,
        sub: stage || `Close ${d.closeDate}`,
        right: money(d.amount),
        onClick: () => openRecord('deals', d),
      }
    })
  } else if (l.includes('company') || l.includes('account')) {
    Icon = IconBuilding
    const c = associatedCompany(companyName)
    rows = [
      {
        key: c.name,
        title: c.name,
        sub: [c.industry, c.city].filter(Boolean).join(' · '),
        onClick: () => openRecord('companies', c),
      },
    ]
  } else if (l.includes('contact')) {
    Icon = IconUser
    rows = associatedContacts(companyName, excludeName).map((c) => ({
      key: c.name,
      title: c.name,
      sub: c.title,
      onClick: () => openRecord('contacts', c),
    }))
  } else if (l.includes('ticket')) {
    Icon = IconTicket
    rows = associatedTickets(companyName).map((t) => ({
      key: t.name,
      title: t.name,
      sub: t.status,
      onClick: () => openRecord('tickets', t),
    }))
  } else if (l.includes('task') || l.includes('reminder')) {
    Icon = IconCheck
    rows = [
      { key: 'task1', title: 'Send updated pricing', sub: 'Due Jun 12 · You' },
      { key: 'task2', title: 'Confirm install window', sub: 'Due Jun 18 · You' },
    ]
  } else if (l.includes('line item')) {
    Icon = IconDollar
    rows = [
      { key: 'li1', title: 'SIHI LPHA 55307 vacuum pump', sub: 'Qty 1', right: '$71,200' },
      { key: 'li2', title: 'Mechanical seal kit', sub: 'Qty 2', right: '$13,300' },
    ]
  }

  return (
    <div className="bg-white rounded-lg border border-hs-border">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-hs-border">
        <Icon width={13} height={13} className="text-hs-text-light shrink-0" />
        <span className="text-[12px] font-semibold text-hs-navy truncate">{label}</span>
        <span className="text-[11px] text-hs-text-light">({rows.length})</span>
        <span className="ml-auto text-[11px] text-hs-blue cursor-default shrink-0">+ Add</span>
      </div>
      {rows.length > 0 ? (
        <div className="p-2 space-y-1.5">
          {rows.map((r) => (
            <AssocRow key={r.key} title={r.title} sub={r.sub} right={r.right} onClick={r.onClick} />
          ))}
        </div>
      ) : (
        <p className="px-3 py-2.5 text-[11px] text-hs-text-light">No associated records.</p>
      )}
    </div>
  )
}

// Generic HubSpot-style record preview driven by the slice's enabled props/sections/activities.
// Three-column layout (identity + About | activity timeline | association cards), mirroring a
// real HubSpot record page. `featured` overrides the default SAMPLE record (used when an
// association is clicked); `onOpenRecord` lets a host (HubCRM modal) handle navigation —
// without it, this component hosts its own popup. `showIndexTable` appends the example list view.
export default function PreviewRecord({ slice, showIndexTable = false, featured, onOpenRecord }) {
  const record = useStore((s) => s.session[slice])
  const reorderColumn = useStore((s) => s.reorderColumn)
  const dealStages = useStore((s) => s.session.deals.pipelineStages)
  const sample = featured || SAMPLE[slice]
  const accent = ACCENT[slice] || '#0091AE'

  const enabledProps = record.properties.filter((p) => p.enabled)
  const enabledSections = record.sections.filter((s) => s.enabled)

  const listCfg = LIST_CONFIG[slice]
  const listColumns = buildListColumns(slice, enabledProps, record.columnOrder, sample)

  // In-place navigation stack when no external handler is supplied (per-step preview
  // pane). Clicking an association redirects to that record in place (with a Back
  // link), like a real HubSpot record link — not a popup overlay.
  const [stack, setStack] = useState([])
  const navCurrent = stack[stack.length - 1]
  const openRecord = onOpenRecord || ((s, r) => setStack((prev) => [...prev, { slice: s, record: r }]))

  const centerSections = enabledSections.filter((s) => sectionRegion(s.label) === 'center')
  const rightSections = enabledSections.filter((s) => sectionRegion(s.label) === 'right')
  const showAbout = enabledSections.some((s) => sectionRegion(s.label) === 'left')

  const [activeCenter, setActiveCenter] = useState(centerSections[0]?.key)
  useEffect(() => {
    if (!centerSections.some((s) => s.key === activeCenter)) {
      setActiveCenter(centerSections[0]?.key)
    }
  }, [centerSections, activeCenter])
  const activeSection = centerSections.find((s) => s.key === activeCenter) || centerSections[0]

  const companyName =
    slice === 'companies'
      ? sample.company || sample.title
      : sample.company || 'Gulf Coast Chemical'
  const email = sample.values?.email || sample.values?.domain

  // In-place redirect: render the navigated-to record (with a Back link) instead
  // of the featured one. Clicks inside keep pushing onto the same stack.
  if (!onOpenRecord && navCurrent) {
    return (
      <div className="p-5">
        <button
          type="button"
          onClick={() => setStack((prev) => prev.slice(0, -1))}
          className="hs-link text-[13px] font-preview mb-3 inline-flex items-center gap-1"
        >
          ← Back
        </button>
        <PreviewRecord
          slice={navCurrent.slice}
          featured={toFeatured(navCurrent.slice, navCurrent.record, dealStages)}
          onOpenRecord={openRecord}
        />
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex bg-white rounded-lg border border-hs-border overflow-hidden">
        {/* LEFT — identity + actions + About */}
        <div data-tour="record-identity" className="w-[248px] shrink-0 border-r border-hs-border">
          <div className="flex flex-col items-center text-center px-4 pt-5 pb-4 border-b border-hs-border">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-preview font-semibold text-lg mb-2"
              style={{ backgroundColor: accent }}
            >
              {sample.initials}
            </div>
            <h2 className="font-preview font-semibold text-hs-navy text-[15px] leading-tight">
              {sample.title}
            </h2>
            <p className="text-[12px] text-hs-text-light font-preview leading-snug mt-0.5">
              {sample.subtitle}
            </p>
            {email && <span className="hs-link text-[12px] font-preview mt-1 break-all">{email}</span>}
          </div>

          {/* Action bar — icon + label, like HubSpot's record actions */}
          <div data-tour="record-actions" className="flex justify-center gap-1 px-2 py-3 border-b border-hs-border">
            {['Note', 'Email', 'Call', 'Task', 'Meeting'].map((a) => {
              const Icon = ACTION_ICON[a]
              return (
                <div key={a} className="flex flex-col items-center gap-1 w-11">
                  <span className="w-8 h-8 rounded-full border border-hs-border text-hs-blue flex items-center justify-center">
                    <Icon width={14} height={14} />
                  </span>
                  <span className="text-[9px] font-preview text-hs-text-light">{a}</span>
                </div>
              )
            })}
          </div>

          {showAbout && (
            <div className="p-4">
              <h3 className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-3">
                About this {NOUN[slice] || 'record'}
              </h3>
              <dl className="space-y-2.5">
                {enabledProps.map((p) => (
                  <div key={p.key}>
                    <dt className="text-[11px] font-preview text-hs-text-light">{p.label}</dt>
                    <dd className="text-[13px] font-preview text-hs-text-dark">
                      {sample.values?.[p.key] ?? <span className="text-hs-text-light">—</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* CENTER — activity tabs + timeline */}
        <div data-tour="record-center" className="flex-1 min-w-0 bg-hs-canvas">
          <div className="bg-white border-b border-hs-border px-4 flex gap-5">
            {['Overview', 'Activities', 'Intelligence'].map((t) => {
              const active = t === 'Activities'
              return (
                <span
                  key={t}
                  className={`text-[13px] font-preview py-2.5 -mb-px border-b-2 ${
                    active
                      ? 'text-hs-navy font-medium border-hs-orange'
                      : 'text-hs-text-light border-transparent'
                  }`}
                >
                  {t}
                </span>
              )
            })}
          </div>

          <div className="p-4">
            {centerSections.length === 0 ? (
              <Empty>No activity sections enabled.</Empty>
            ) : (
              <>
                {centerSections.length > 1 && (
                  <div className="flex flex-wrap gap-1 mb-3 border-b border-hs-border">
                    {centerSections.map((sec) => {
                      const active = sec.key === activeSection?.key
                      return (
                        <button
                          key={sec.key}
                          onClick={() => setActiveCenter(sec.key)}
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
                )}
                {activeSection && <CenterSection label={activeSection.label} record={record} />}
              </>
            )}
          </div>
        </div>

        {/* RIGHT — association cards */}
        {rightSections.length > 0 && (
          <div data-tour="record-associations" className="w-[280px] shrink-0 bg-hs-canvas border-l border-hs-border p-3 space-y-2.5">
            {rightSections.map((sec) => (
              <AssocCard
                key={sec.key}
                label={sec.label}
                companyName={companyName}
                excludeName={slice === 'contacts' ? sample.title : undefined}
                dealStages={dealStages}
                openRecord={openRecord}
              />
            ))}
          </div>
        )}
      </div>

      {/* Example list view (mirrors the final demo's index pages). Columns track
          the enabled properties; drag a header to reorder. */}
      {showIndexTable && listCfg && listColumns && (
        <div className="mt-4 bg-white rounded-lg border border-hs-border p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-[12px] font-preview font-semibold uppercase tracking-wide text-hs-text-light">
              {listCfg.title}
            </h3>
            <span className="text-[10px] font-preview text-hs-text-light">
              Drag a column to reorder
            </span>
          </div>
          <DataTable
            columns={listColumns}
            rows={listCfg.rows()}
            compact
            onReorder={(from, to) => reorderColumn(slice, from, to)}
          />
        </div>
      )}
    </div>
  )
}
