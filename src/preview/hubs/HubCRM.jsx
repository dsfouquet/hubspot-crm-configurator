// HubCRM — "HubSpot light" demo view. Renders Contacts / Companies / Deals / Tickets
// the way a real 2025-era HubSpot CRM portal looks: index pages with saved-view tabs,
// a deal kanban driven by the user's configured pipeline stages, and a ticket board.
// Benefits-only demo surface — non-functional search/buttons are styled to feel real.
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { activeViews } from '../../utils/recommendations'
import {
  StatCard,
  DataTable,
} from '../charts'
import { Tag, IconStar } from '../uiIcons'
import { CONTACTS, COMPANIES, DEALS, TICKETS, REPS } from '../demoData'
import PreviewRecord from '../PreviewRecord'
import PreviewDealRecord from '../PreviewDealRecord'

const TABS = ['Contacts', 'Companies', 'Deals', 'Tickets']

// Default deal pipeline stages used when the session has none configured yet.
const DEAL_STAGES_FALLBACK = [
  { key: 'appointment', label: 'Appointment scheduled' },
  { key: 'qualified', label: 'Qualified to buy' },
  { key: 'proposal', label: 'Proposal sent' },
  { key: 'negotiation', label: 'In negotiation' },
  { key: 'won', label: 'Closed won' },
]

// Record-page popup: clicking any row/card opens the same record preview the
// configurator steps show (exactly as the user configured it on the left tabs).
function RecordModal({ slice, record, session, onClose }) {
  if (!slice) return null
  // A specific deal was clicked → show that single deal's record detail (no board).
  const dealStages =
    session?.deals?.pipelineStages?.length > 0
      ? session.deals.pipelineStages
      : DEAL_STAGES_FALLBACK
  const showDealDetail = slice === 'deals' && record
  return (
    <div
      className="fixed inset-0 z-50 bg-hs-navy/50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-hs-canvas rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between bg-white border-b border-hs-border px-4 py-2.5">
          <span className="text-[12px] font-medium text-hs-text-light">
            {showDealDetail ? 'Deal record' : 'Record preview · exactly as you configured it'}
          </span>
          <button
            onClick={onClose}
            className="text-hs-text-light hover:text-hs-navy text-[18px] leading-none px-1"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {showDealDetail ? (
            <DealRecordDetail deal={record} stages={dealStages} />
          ) : slice === 'deals' ? (
            <PreviewDealRecord />
          ) : (
            <PreviewRecord slice={slice} />
          )}
        </div>
      </div>
    </div>
  )
}

// ---- small shared bits -----------------------------------------------------

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const AVATAR_BG = ['#FF7A59', '#0091AE', '#00BDA5', '#6A78D1', '#F2545B', '#2D3E50']
function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_BG.length
  return AVATAR_BG[h]
}

function Avatar({ name, square = false }) {
  return (
    <span
      className={`inline-flex items-center justify-center text-[10px] font-semibold text-white shrink-0 ${
        square ? 'rounded' : 'rounded-full'
      }`}
      style={{ width: 28, height: 28, background: avatarColor(name) }}
    >
      {initials(name)}
    </span>
  )
}

// Mock index-page header: search input, count, Create button.
function IndexHeader({ count, noun, createLabel }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="relative flex-1 max-w-sm">
        <svg
          viewBox="0 0 16 16"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          fill="none"
          stroke="#7C98B6"
          strokeWidth="1.6"
        >
          <circle cx="7" cy="7" r="4.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
        </svg>
        <input
          readOnly
          placeholder={`Search ${noun}`}
          className="w-full text-[12px] text-hs-text-dark placeholder:text-hs-text-light bg-white border border-hs-border rounded-md pl-8 pr-3 py-1.5 outline-none cursor-default"
        />
      </div>
      <span className="text-[12px] text-hs-text-light whitespace-nowrap">
        {count} {noun}
      </span>
      <button
        type="button"
        className="hs-btn-primary ml-auto whitespace-nowrap cursor-default"
        style={{ padding: '6px 12px', fontSize: 12 }}
      >
        {createLabel}
      </button>
    </div>
  )
}

// Saved-view tab row — clickable views that actually filter the table, plus the
// user's recommended views from the configurator (appended, marked with a
// marigold star and also clickable — they filter the table just like the
// built-in views).
function SavedViews({ views, active, onPick, extraViews = [] }) {
  const tabClass = (isActive) =>
    `text-[12px] px-3 pb-2 whitespace-nowrap -mb-px border-b-2 ${
      isActive
        ? 'font-medium text-hs-navy border-hs-orange'
        : 'text-hs-text-light hover:text-hs-navy border-transparent'
    }`
  return (
    <div className="flex items-center gap-1 mb-1.5 border-b border-hs-border overflow-x-auto">
      {views.map((v) => {
        const isActive = v.id === active
        return (
          <button key={v.id} onClick={() => onPick(v.id)} className={tabClass(isActive)}>
            {v.name}
            {v.count != null && (
              <span className={`ml-1 ${isActive ? 'text-hs-text-light' : 'text-hs-border'}`}>
                {v.count}
              </span>
            )}
          </button>
        )
      })}
      {extraViews.map((v) => {
        const isActive = v.id === active
        return (
          <button
            key={v.id}
            onClick={() => onPick(v.id)}
            className={`inline-flex items-center gap-1 ${tabClass(isActive)}`}
            title="Built for you from your fix plan"
          >
            <IconStar width={10} height={10} className="text-hs-marigold shrink-0" />
            {v.name}
            {v.count != null && (
              <span className={`${isActive ? 'text-hs-text-light' : 'text-hs-border'}`}>
                {v.count}
              </span>
            )}
          </button>
        )
      })}
      <span className="text-[12px] text-hs-text-light px-2 pb-2 whitespace-nowrap cursor-default">
        + Add view
      </span>
    </div>
  )
}

// Plain-English one-liner shown under the saved-view tab row describing what the
// currently-active view is filtering to.
function ViewDescription({ text }) {
  if (!text) return null
  return <div className="text-[11px] text-hs-text-light mb-3">{text}</div>
}

function IndexCard({ children }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border p-4">{children}</div>
  )
}

const fmtK = (n) =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n.toLocaleString()}`

// Concrete filters for the configurator's recommended ("built for you") views,
// keyed by recommended-view id. Each returns a sensible non-empty subset of the
// demo rows for its record type. Any recommended view WITHOUT an entry here
// falls back to the first ~60% of rows (never an empty table) via fallbackSubset.
const RECOMMENDED_FILTERS = {
  // Contacts
  cold_call_queue: (c) =>
    c.lifecycle === 'Lead' || c.lifecycle === 'MQL' || !c.engaged,
  sequence_enrollment: (c) =>
    (c.lifecycle === 'Lead' || c.lifecycle === 'MQL') && c.lifecycle !== 'Customer',
  // Companies
  site_visit_schedule: (c) => c.tier === 'Tier 1' || c.tier === 'Tier 2',
  // Deals
  reengage_candidates: (d) => d.age > 10,
  stale_deals: (d) => d.age >= 14,
  quotes_awaiting: (d) => d.stage >= 2,
  awaiting_quote_response: (d) => d.stage >= 2,
  revenue_forecast: () => true,
  pipeline_board: () => true,
  renewal_tracker: (d) => d.name.toLowerCase().includes('contract') || d.stage >= 3,
  rep_leaderboard: () => true,
  // Tickets
  open_tickets_priority: (t) => t.status !== 'Resolved' && t.status !== 'Closed',
}

// Apply a recommended view's filter to a row set. Falls back to the first ~60%
// of rows when no specific filter is defined, so the table is never empty.
function applyRecommended(viewId, rows) {
  const fn = RECOMMENDED_FILTERS[viewId]
  if (fn) {
    const out = rows.filter(fn)
    if (out.length > 0) return out
  }
  return rows.slice(0, Math.max(1, Math.ceil(rows.length * 0.6)))
}

// ---- Contacts --------------------------------------------------------------

// Common contact views every sales team asks for — each really filters the table.
const CONTACT_VIEWS = [
  { id: 'all', name: 'All contacts', description: 'Everyone in your CRM', filter: () => true },
  {
    id: 'leads',
    name: 'Leads',
    description: 'Not yet customers — lifecycle is Lead or MQL',
    filter: (c) => c.lifecycle === 'Lead' || c.lifecycle === 'MQL',
  },
  {
    id: 'customers',
    name: 'Customers',
    description: 'Closed-won, now paying you',
    filter: (c) => c.lifecycle === 'Customer',
  },
  {
    id: 'evangelists',
    name: 'Evangelists',
    description: 'Happy customers who refer you',
    filter: (c) => c.lifecycle === 'Evangelist',
  },
  {
    id: 'decision',
    name: 'Decision Makers',
    description: 'Contacts flagged as the buyer',
    filter: (c) => c.decisionMaker,
  },
  {
    id: 'reengage',
    name: 'Re-engagement',
    description: 'Gone quiet or past clients to win back',
    filter: (c) => !c.engaged || c.lifecycle === 'Past client',
  },
]

const LIFECYCLE_COLOR = {
  Lead: 'blue',
  MQL: 'purple',
  Customer: 'green',
  Evangelist: 'orange',
  'Past client': 'gray',
}

function ContactsTab({ session, onOpen }) {
  const recommended = activeViews(session)
    .filter((v) => v.recordType === 'Contacts')
    .map((v) => ({ ...v, count: applyRecommended(v.id, CONTACTS).length }))
  const [view, setView] = useState('all')
  const viewDefs = CONTACT_VIEWS.map((v) => ({ ...v, count: CONTACTS.filter(v.filter).length }))
  const builtIn = CONTACT_VIEWS.find((v) => v.id === view)
  const rec = recommended.find((v) => v.id === view)
  const rows = builtIn
    ? CONTACTS.filter(builtIn.filter)
    : applyRecommended(view, CONTACTS)
  const activeDesc = (builtIn || rec)?.description
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (_v, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} />
          <div className="min-w-0">
            <div className="hs-link font-semibold leading-tight truncate">
              {row.name}
            </div>
            <div className="text-[10px] text-hs-text-light truncate">{row.title}</div>
          </div>
        </div>
      ),
    },
    { key: 'company', label: 'Company' },
    {
      key: 'lifecycle',
      label: 'Lifecycle',
      render: (v) => <Tag color={LIFECYCLE_COLOR[v] || 'gray'}>{v}</Tag>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (v) => <span className="hs-link">{v}</span>,
    },
    { key: 'phone', label: 'Phone' },
    { key: 'owner', label: 'Contact Owner' },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      render: (v) => <span className="text-hs-text-light">{v}</span>,
    },
  ]
  return (
    <div>
      <IndexHeader count={rows.length} noun="contacts" createLabel="Create contact" />
      <IndexCard>
        <SavedViews views={viewDefs} active={view} onPick={setView} extraViews={recommended} />
        <ViewDescription text={activeDesc} />
        <DataTable columns={columns} rows={rows} onRowClick={() => onOpen('contacts')} />
      </IndexCard>
    </div>
  )
}

// ---- Companies -------------------------------------------------------------

const TIER_COLOR = { 'Tier 1': 'green', 'Tier 2': 'blue', 'Tier 3': 'gray' }

const COMPANY_VIEWS = [
  { id: 'all', name: 'All companies', description: 'Every company record', filter: () => true },
  {
    id: 'customers',
    name: 'Customers',
    description: "Companies you've closed",
    filter: (c) => c.lifecycle === 'Customer',
  },
  {
    id: 'target',
    name: 'Target Market',
    description: 'Fit your ideal-customer profile',
    filter: (c) => c.lifecycle === 'Target',
  },
  {
    id: 'reengage',
    name: 'Re-engagement',
    description: 'No recent activity',
    filter: (c) => c.lifecycle === 'Past client',
  },
  {
    id: 'tier1',
    name: 'Key Accounts',
    description: 'Your Tier-1 strategic accounts',
    filter: (c) => c.tier === 'Tier 1',
  },
]

function CompaniesTab({ session, onOpen }) {
  const recommended = activeViews(session)
    .filter((v) => v.recordType === 'Companies')
    .map((v) => ({ ...v, count: applyRecommended(v.id, COMPANIES).length }))
  const [view, setView] = useState('all')
  const viewDefs = COMPANY_VIEWS.map((v) => ({ ...v, count: COMPANIES.filter(v.filter).length }))
  const builtIn = COMPANY_VIEWS.find((v) => v.id === view)
  const rec = recommended.find((v) => v.id === view)
  const filtered = builtIn
    ? COMPANIES.filter(builtIn.filter)
    : applyRecommended(view, COMPANIES)
  const activeDesc = (builtIn || rec)?.description
  const columns = [
    {
      key: 'name',
      label: 'Company Name',
      render: (_v, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} square />
          <span className="hs-link font-semibold">{row.name}</span>
        </div>
      ),
    },
    { key: 'city', label: 'City' },
    { key: 'industry', label: 'Industry' },
    {
      key: 'tier',
      label: 'Tier',
      render: (v) => <Tag color={TIER_COLOR[v] || 'gray'}>{v}</Tag>,
    },
    { key: 'owner', label: 'Owner' },
  ]
  // owner rotates through REPS (companies have no owner field of their own)
  const rows = filtered.map((c, i) => ({ ...c, owner: REPS[i % REPS.length] }))
  return (
    <div>
      <IndexHeader count={rows.length} noun="companies" createLabel="Create company" />
      <IndexCard>
        <SavedViews views={viewDefs} active={view} onPick={setView} extraViews={recommended} />
        <ViewDescription text={activeDesc} />
        <DataTable columns={columns} rows={rows} onRowClick={() => onOpen('companies')} />
      </IndexCard>
    </div>
  )
}

// ---- Deals (kanban) --------------------------------------------------------

function DealCard({ deal, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md border border-hs-border px-3 py-2.5 shadow-sm cursor-pointer hover:border-hs-orange"
    >
      <div className="hs-link text-[12px] font-semibold leading-tight truncate">
        {deal.name}
      </div>
      <div className="text-[10px] text-hs-text-light truncate">{deal.company}</div>
      <div className="text-[13px] font-semibold text-hs-green mt-1.5">
        {fmtK(deal.amount)}
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-hs-text-light">
        <Avatar name={deal.owner} />
        <span className="truncate">{deal.closeDate}</span>
      </div>
      {deal.age > 10 && (
        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-hs-orange">
          <span className="w-1.5 h-1.5 rounded-full bg-hs-orange shrink-0" />
          {deal.age} days in stage
        </div>
      )}
    </div>
  )
}

// Board / Table / Calendar — the three ways HubSpot lets you look at a pipeline.
const DEAL_VIEW_MODES = ['Board', 'Table', 'Calendar']

function DealsBoard({ cols, onOpen }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {cols.map((col) => {
        const sum = col.deals.reduce((s, d) => s + d.amount, 0)
        return (
          <div key={col.key} className="w-56 shrink-0">
            <div className="bg-white rounded-t-lg border border-hs-border border-b-0 px-3 py-2">
              <div className="text-[12px] font-semibold text-hs-navy truncate">{col.label}</div>
              <div className="text-[10px] text-hs-text-light">
                {col.deals.length} deals · {fmtK(sum)}
              </div>
            </div>
            <div className="bg-hs-canvas border border-hs-border rounded-b-lg p-2 space-y-2 min-h-[120px]">
              {col.deals.length === 0 ? (
                <div className="text-[10px] text-hs-text-light text-center py-6">No deals</div>
              ) : (
                col.deals.map((d, i) => (
                  <DealCard key={i} deal={d} onClick={() => onOpen('deals', d)} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DealsTable({ cols, onOpen }) {
  const rows = cols.flatMap((col) => col.deals.map((d) => ({ ...d, stageLabel: col.label })))
  const columns = [
    {
      key: 'name',
      label: 'Deal',
      render: (v, row) => (
        <div className="min-w-0">
          <div className="hs-link font-semibold leading-tight truncate">{v}</div>
          <div className="text-[10px] text-hs-text-light truncate">{row.company}</div>
        </div>
      ),
    },
    { key: 'stageLabel', label: 'Stage', render: (v) => <Tag color="blue">{v}</Tag> },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (v) => <span className="font-semibold text-hs-green">{fmtK(v)}</span>,
    },
    { key: 'closeDate', label: 'Close Date' },
    { key: 'owner', label: 'Owner' },
    {
      key: 'age',
      label: 'In Stage',
      align: 'right',
      render: (v) => (
        <span className={v > 10 ? 'text-hs-orange font-medium' : 'text-hs-text-light'}>
          {v} days
        </span>
      ),
    },
  ]
  return (
    <IndexCard>
      <DataTable columns={columns} rows={rows} onRowClick={(row) => onOpen('deals', row)} />
    </IndexCard>
  )
}

// June 2026 calendar (Jun 1 was a Monday) with deals pinned to close dates;
// deals closing later are listed under "Coming months".
function DealsCalendar() {
  const juneDeals = {}
  const later = []
  DEALS.forEach((d) => {
    const m = d.closeDate.match(/^Jun (\d+)/)
    if (m) (juneDeals[Number(m[1])] ||= []).push(d)
    else later.push(d)
  })
  const firstWeekday = 1 // Monday
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= 30; day++) cells.push(day)

  return (
    <IndexCard>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[13px] font-semibold text-hs-navy">June 2026 · by close date</h4>
        <span className="text-[11px] text-hs-text-light">‹ &nbsp; ›</span>
      </div>
      <div className="grid grid-cols-7 gap-px bg-hs-border rounded overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-hs-canvas text-center text-[9px] uppercase tracking-wide text-hs-text-light py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="bg-white min-h-[52px] p-1">
            {day && (
              <>
                <div className="text-[9px] text-hs-text-light">{day}</div>
                {(juneDeals[day] || []).map((d) => (
                  <div
                    key={d.name}
                    className="mt-0.5 rounded bg-hs-orange/10 border border-hs-orange/30 px-1 py-0.5"
                    title={d.name}
                  >
                    <div className="text-[8px] font-semibold text-hs-navy truncate">{d.name}</div>
                    <div className="text-[8px] text-hs-green font-medium">{fmtK(d.amount)}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
      {later.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-hs-text-light mb-1">
            Coming months
          </p>
          <div className="flex flex-wrap gap-1.5">
            {later.map((d) => (
              <span
                key={d.name}
                className="text-[10px] bg-hs-canvas border border-hs-border rounded px-2 py-1 text-hs-text-dark"
              >
                {d.closeDate.replace(', 2026', '')} · {d.name.split(' — ')[0]} · {fmtK(d.amount)}
              </span>
            ))}
          </div>
        </div>
      )}
    </IndexCard>
  )
}

// Built-in deal saved view shown first; recommended deal views are appended.
const DEAL_DEFAULT_VIEW = {
  id: 'all_deals',
  name: 'All deals',
  description: 'Your open deals across every stage',
}

function DealsTab({ session, onOpen }) {
  const [mode, setMode] = useState('Board')
  const recommended = activeViews(session)
    .filter((v) => v.recordType === 'Deals')
    .map((v) => ({ ...v, count: applyRecommended(v.id, DEALS).length }))
  const [view, setView] = useState(DEAL_DEFAULT_VIEW.id)
  const builtInView = { ...DEAL_DEFAULT_VIEW, count: DEALS.length }
  const rec = recommended.find((v) => v.id === view)
  const isDefault = view === DEAL_DEFAULT_VIEW.id
  const deals = isDefault ? DEALS : applyRecommended(view, DEALS)
  const activeDesc = isDefault ? DEAL_DEFAULT_VIEW.description : rec?.description

  const stages =
    session.deals?.pipelineStages?.length > 0
      ? session.deals.pipelineStages
      : [{ key: 'default', label: 'Pipeline' }]

  // bucket the active view's deals into stage columns, clamping the stored index
  const cols = stages.map((st) => ({ ...st, deals: [] }))
  deals.forEach((d) => {
    const idx = Math.min(Math.max(d.stage, 0), cols.length - 1)
    cols[idx].deals.push(d)
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-hs-navy">Sales Pipeline</h3>
        <span className="text-[12px] text-hs-text-light">{deals.length} deals</span>
        {/* View switcher */}
        <div className="inline-flex rounded-md border border-hs-border bg-white p-0.5 ml-2">
          {DEAL_VIEW_MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-[11px] px-2.5 py-1 rounded ${
                mode === m
                  ? 'bg-hs-navy text-white font-medium'
                  : 'text-hs-text-light hover:text-hs-navy'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="hs-btn-primary ml-auto cursor-default" style={{ padding: '6px 12px', fontSize: 12 }}
        >
          Create deal
        </button>
      </div>
      <SavedViews views={[builtInView]} active={view} onPick={setView} extraViews={recommended} />
      <ViewDescription text={activeDesc} />
      {mode === 'Board' && <DealsBoard cols={cols} onOpen={onOpen} />}
      {mode === 'Table' && <DealsTable cols={cols} onOpen={onOpen} />}
      {mode === 'Calendar' && <DealsCalendar />}
    </div>
  )
}

// ---- Single deal record detail (modal click-through) -----------------------

// Tiny inline icons for the activity timeline — no emojis, HubSpot-flat style.
function TimelineIcon({ type }) {
  const common = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'w-3.5 h-3.5' }
  switch (type) {
    case 'email':
      return (
        <svg {...common}>
          <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
          <path d="M2 4l6 5 6-5" />
        </svg>
      )
    case 'call':
      return (
        <svg {...common}>
          <path d="M3 3.5c0 5 4.5 9.5 9.5 9.5l1-2.5-3-1.5-1.5 1.5C7 9.5 6.5 9 5 6.5L6.5 5 5 2 3 3.5z" />
        </svg>
      )
    case 'note':
      return (
        <svg {...common}>
          <path d="M3 2.5h7L13 5.5v8H3z" />
          <path d="M5.5 7.5h5M5.5 10h5" />
        </svg>
      )
    case 'stage':
      return (
        <svg {...common}>
          <path d="M2 8h9" />
          <path d="M8 5l3 3-3 3" />
          <circle cx="13" cy="8" r="1" />
        </svg>
      )
    case 'task':
    default:
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" />
          <path d="M5.5 8l1.5 1.5L11 6" />
        </svg>
      )
  }
}

// Horizontal pipeline progress bar highlighting the deal's current stage.
function StageProgress({ stages, current }) {
  return (
    <div className="flex items-stretch gap-0.5 mt-1">
      {stages.map((st, i) => {
        const done = i < current
        const active = i === current
        return (
          <div
            key={st.key || i}
            title={st.label}
            className={`flex-1 min-w-0 text-center text-[9px] leading-tight px-1 py-1 truncate border ${
              active
                ? 'bg-hs-orange text-white border-hs-orange font-semibold'
                : done
                ? 'bg-hs-green/10 text-hs-green border-hs-green/30'
                : 'bg-white text-hs-text-light border-hs-border'
            }`}
            style={{ borderRadius: 3 }}
          >
            {st.label}
          </div>
        )
      })}
    </div>
  )
}

// "About this deal" property row.
function PropRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-hs-canvas last:border-0">
      <span className="text-[11px] text-hs-text-light shrink-0">{label}</span>
      <span className="text-[12px] text-hs-text-dark text-right min-w-0">{children}</span>
    </div>
  )
}

// HubSpot-style single deal record: header + About (left) + Activity (right).
// NO kanban board. Uses the clicked deal's real data where possible.
function DealRecordDetail({ deal, stages }) {
  const stageIdx = Math.min(Math.max(deal.stage ?? 0, 0), stages.length - 1)
  const stageLabel = stages[stageIdx]?.label || 'Pipeline'
  const dealType = deal.age > 10 ? 'Existing business' : 'New business'
  const priority = deal.amount >= 50000 ? 'High' : deal.amount >= 15000 ? 'Medium' : 'Low'
  const priorityColor = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'gray'

  // Mock activity timeline anchored to the deal's real fields.
  const timeline = [
    { type: 'note', title: 'Note added', body: `Logged scope + next steps for ${deal.company}.`, when: '2 hours ago' },
    { type: 'email', title: `Email to ${deal.owner}`, body: `Re: ${deal.name} — sent updated pricing.`, when: 'Yesterday' },
    { type: 'stage', title: `Stage changed to ${stageLabel}`, body: `Moved forward in the pipeline.`, when: '3 days ago' },
    { type: 'call', title: 'Call logged', body: `Discovery call with ${deal.company}. 12 min.`, when: '5 days ago' },
    { type: 'task', title: 'Task created', body: `Follow up before ${deal.closeDate}.`, when: '1 week ago' },
  ]

  return (
    <div className="bg-hs-canvas">
      {/* Header */}
      <div className="bg-white border-b border-hs-border px-5 py-4">
        <div className="flex items-start gap-3">
          <Avatar name={deal.company} square />
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-semibold text-hs-navy leading-tight truncate">
              {deal.name}
            </div>
            <div className="text-[12px] text-hs-text-light truncate">
              <span className="hs-link">{deal.company}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[20px] font-semibold text-hs-green leading-none">
              {fmtK(deal.amount)}
            </div>
            <div className="mt-1">
              <Tag color="blue">{stageLabel}</Tag>
            </div>
          </div>
        </div>
        <StageProgress stages={stages} current={stageIdx} />
      </div>

      {/* Body: two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
        {/* LEFT — About this deal */}
        <div className="bg-white rounded-lg border border-hs-border p-4">
          <h4 className="text-[12px] font-semibold text-hs-navy uppercase tracking-wide mb-2">
            About this deal
          </h4>
          <PropRow label="Amount">
            <span className="font-semibold text-hs-green">{fmtK(deal.amount)}</span>
          </PropRow>
          <PropRow label="Deal stage">
            <Tag color="blue">{stageLabel}</Tag>
          </PropRow>
          <PropRow label="Close date">{deal.closeDate}</PropRow>
          <PropRow label="Deal owner">
            <span className="inline-flex items-center gap-1.5 justify-end">
              <Avatar name={deal.owner} />
              {deal.owner}
            </span>
          </PropRow>
          <PropRow label="Company">
            <span className="hs-link">{deal.company}</span>
          </PropRow>
          <PropRow label="Days in stage">
            <span className={deal.age > 10 ? 'text-hs-orange font-medium' : ''}>
              {deal.age} days
            </span>
          </PropRow>
          <PropRow label="Deal type">{dealType}</PropRow>
          <PropRow label="Priority">
            <Tag color={priorityColor}>{priority}</Tag>
          </PropRow>
        </div>

        {/* RIGHT — Activity timeline */}
        <div className="bg-white rounded-lg border border-hs-border p-4">
          <h4 className="text-[12px] font-semibold text-hs-navy uppercase tracking-wide mb-3">
            Activity
          </h4>
          <ol className="space-y-3">
            {timeline.map((ev, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-hs-canvas text-hs-text-light shrink-0">
                  <TimelineIcon type={ev.type} />
                </span>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-hs-text-dark leading-tight">
                    {ev.title}
                  </div>
                  <div className="text-[11px] text-hs-text-light truncate">{ev.body}</div>
                  <div className="text-[10px] text-hs-text-light mt-0.5">{ev.when}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

// ---- Tickets ---------------------------------------------------------------

const PRIORITY_COLOR = { High: 'red', Medium: 'orange', Low: 'gray' }
const STATUS_COLOR = {
  New: 'blue',
  'In Progress': 'orange',
  'Waiting on Customer': 'purple',
  Resolved: 'green',
  Closed: 'gray',
}

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

const TICKET_DEFAULT_VIEW = {
  id: 'all_tickets',
  name: 'All tickets',
  description: 'Every support ticket across all stages',
}

function TicketsTab({ session, onOpen }) {
  const recommended = activeViews(session)
    .filter((v) => v.recordType === 'Tickets')
    .map((v) => ({ ...v, count: applyRecommended(v.id, TICKETS).length }))
  const [view, setView] = useState(TICKET_DEFAULT_VIEW.id)
  const builtInView = { ...TICKET_DEFAULT_VIEW, count: TICKETS.length }
  const rec = recommended.find((v) => v.id === view)
  const isDefault = view === TICKET_DEFAULT_VIEW.id
  const tickets = isDefault ? TICKETS : applyRecommended(view, TICKETS)
  const activeDesc = isDefault ? TICKET_DEFAULT_VIEW.description : rec?.description

  const stages =
    session.tickets?.pipelineStages?.length > 0
      ? session.tickets.pipelineStages
      : [{ key: 'new', label: 'New' }]

  // match each ticket's status loosely to a stage; unmatched land in the first column
  const cols = stages.map((st) => ({ ...st, tickets: [] }))
  tickets.forEach((t) => {
    let idx = cols.findIndex((c) => norm(c.label) === norm(t.status))
    if (idx < 0) idx = cols.findIndex((c) => norm(c.label).includes(norm(t.status)) || norm(t.status).includes(norm(c.label)))
    if (idx < 0) idx = 0
    cols[idx].tickets.push(t)
  })

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Open tickets" value="5" />
        <StatCard label="Avg response" value="2.4h" delta="0.6h" deltaGood />
        <StatCard label="SLA met" value="94%" delta="3%" deltaGood />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-hs-navy">Support Pipeline</h3>
        <span className="text-[12px] text-hs-text-light">{tickets.length} tickets</span>
        <button
          type="button"
          className="hs-btn-primary ml-auto cursor-default" style={{ padding: '6px 12px', fontSize: 12 }}
        >
          Create ticket
        </button>
      </div>
      <SavedViews views={[builtInView]} active={view} onPick={setView} extraViews={recommended} />
      <ViewDescription text={activeDesc} />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cols.map((col) => (
          <div key={col.key} className="w-56 shrink-0">
            <div className="bg-white rounded-t-lg border border-hs-border border-b-0 px-3 py-2">
              <div className="text-[12px] font-semibold text-hs-navy truncate">
                {col.label}
              </div>
              <div className="text-[10px] text-hs-text-light">
                {col.tickets.length} tickets
              </div>
            </div>
            <div className="bg-hs-canvas border border-hs-border rounded-b-lg p-2 space-y-2 min-h-[120px]">
              {col.tickets.length === 0 ? (
                <div className="text-[10px] text-hs-text-light text-center py-6">
                  No tickets
                </div>
              ) : (
                col.tickets.map((t, i) => (
                  <div
                    key={i}
                    onClick={() => onOpen('tickets')}
                    className="bg-white rounded-md border border-hs-border px-3 py-2.5 shadow-sm cursor-pointer hover:border-hs-orange"
                  >
                    <div className="hs-link text-[12px] font-semibold leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-hs-text-light truncate">
                      {t.company}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Tag color={PRIORITY_COLOR[t.priority] || 'gray'}>
                        {t.priority}
                      </Tag>
                      <Tag color={STATUS_COLOR[t.status] || 'gray'}>{t.status}</Tag>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-hs-text-light">
                      <Avatar name={t.owner} />
                      <span className="truncate">{t.owner}</span>
                      <span className="ml-auto shrink-0">{t.age}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Shell -----------------------------------------------------------------

export default function HubCRM() {
  const [tab, setTab] = useState('Contacts')
  const [openRecord, setOpenRecord] = useState(null)
  const session = useStore((s) => s.session)

  // onOpen(slice, record?) — record is an optional payload (e.g. a clicked deal)
  // that drives a single-record detail view instead of the generic preview.
  const openRecordWith = (slice, record = null) => setOpenRecord({ slice, record })

  return (
    <div className="h-full flex flex-col font-preview">
      {/* sub-tab bar */}
      <div className="flex items-center gap-1 px-4 border-b border-hs-border bg-white shrink-0">
        {TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`text-[13px] px-3 py-2.5 -mb-px border-b-2 transition-colors ${
                active
                  ? 'text-hs-navy font-medium border-hs-orange'
                  : 'text-hs-text-light border-transparent hover:text-hs-navy'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        {tab === 'Contacts' && <ContactsTab session={session} onOpen={openRecordWith} />}
        {tab === 'Companies' && <CompaniesTab session={session} onOpen={openRecordWith} />}
        {tab === 'Deals' && <DealsTab session={session} onOpen={openRecordWith} />}
        {tab === 'Tickets' && <TicketsTab session={session} onOpen={openRecordWith} />}
      </div>

      <RecordModal
        slice={openRecord?.slice}
        record={openRecord?.record}
        session={session}
        onClose={() => setOpenRecord(null)}
      />
    </div>
  )
}
