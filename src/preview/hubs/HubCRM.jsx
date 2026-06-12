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
  Pill,
} from '../charts'
import { CONTACTS, COMPANIES, DEALS, TICKETS, REPS } from '../demoData'
import PreviewRecord from '../PreviewRecord'
import PreviewDealRecord from '../PreviewDealRecord'

const TABS = ['Contacts', 'Companies', 'Deals', 'Tickets']

// Record-page popup: clicking any row/card opens the same record preview the
// configurator steps show (exactly as the user configured it on the left tabs).
function RecordModal({ slice, onClose }) {
  if (!slice) return null
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
            Record preview · exactly as you configured it
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
          {slice === 'deals' ? <PreviewDealRecord /> : <PreviewRecord slice={slice} />}
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
        className="ml-auto text-[12px] font-medium text-white bg-hs-orange rounded-md px-3 py-1.5 whitespace-nowrap cursor-default"
      >
        {createLabel}
      </button>
    </div>
  )
}

// Saved-view tab row — clickable views that actually filter the table, plus the
// user's recommended views from the configurator (appended, also clickable but
// shown unfiltered since their criteria are conceptual).
function SavedViews({ views, active, onPick, extraViews = [] }) {
  return (
    <div className="flex items-center gap-1 mb-3 border-b border-hs-border overflow-x-auto">
      {views.map((v) => {
        const isActive = v.id === active
        return (
          <button
            key={v.id}
            onClick={() => onPick(v.id)}
            className={`text-[12px] px-3 pb-2 whitespace-nowrap -mb-px border-b-2 ${
              isActive
                ? 'font-medium text-hs-navy border-hs-orange'
                : 'text-hs-text-light hover:text-hs-navy border-transparent'
            }`}
          >
            {v.name}
            {v.count != null && (
              <span className={`ml-1 ${isActive ? 'text-hs-text-light' : 'text-hs-border'}`}>
                {v.count}
              </span>
            )}
          </button>
        )
      })}
      {extraViews.map((v) => (
        <span
          key={v.id}
          className="text-[12px] text-hs-text-light px-3 pb-2 whitespace-nowrap cursor-default"
          title="Built for you from your fix plan"
        >
          ★ {v.name}
        </span>
      ))}
      <span className="text-[12px] text-hs-text-light px-2 pb-2 whitespace-nowrap cursor-default">
        + Add view
      </span>
    </div>
  )
}

function IndexCard({ children }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border p-4">{children}</div>
  )
}

const fmtK = (n) =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n.toLocaleString()}`

// ---- Contacts --------------------------------------------------------------

// Common contact views every sales team asks for — each really filters the table.
const CONTACT_VIEWS = [
  { id: 'all', name: 'All contacts', filter: () => true },
  { id: 'leads', name: 'Leads', filter: (c) => c.lifecycle === 'Lead' || c.lifecycle === 'MQL' },
  { id: 'customers', name: 'Customers', filter: (c) => c.lifecycle === 'Customer' },
  { id: 'evangelists', name: 'Evangelists', filter: (c) => c.lifecycle === 'Evangelist' },
  { id: 'decision', name: 'Decision Makers', filter: (c) => c.decisionMaker },
  {
    id: 'reengage',
    name: 'Re-engagement',
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
  const recommended = activeViews(session).filter((v) => v.recordType === 'Contacts')
  const [view, setView] = useState('all')
  const viewDefs = CONTACT_VIEWS.map((v) => ({ ...v, count: CONTACTS.filter(v.filter).length }))
  const rows = CONTACTS.filter(CONTACT_VIEWS.find((v) => v.id === view).filter)
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (_v, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} />
          <div className="min-w-0">
            <div className="font-semibold text-hs-navy leading-tight truncate">
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
      render: (v) => <Pill color={LIFECYCLE_COLOR[v] || 'gray'}>{v}</Pill>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (v) => <span className="text-hs-blue">{v}</span>,
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
        <DataTable columns={columns} rows={rows} onRowClick={() => onOpen('contacts')} />
      </IndexCard>
    </div>
  )
}

// ---- Companies -------------------------------------------------------------

const TIER_COLOR = { 'Tier 1': 'green', 'Tier 2': 'blue', 'Tier 3': 'gray' }

const COMPANY_VIEWS = [
  { id: 'all', name: 'All companies', filter: () => true },
  { id: 'customers', name: 'Customers', filter: (c) => c.lifecycle === 'Customer' },
  { id: 'target', name: 'Target Market', filter: (c) => c.lifecycle === 'Target' },
  { id: 'reengage', name: 'Re-engagement', filter: (c) => c.lifecycle === 'Past client' },
  { id: 'tier1', name: 'Key Accounts', filter: (c) => c.tier === 'Tier 1' },
]

function CompaniesTab({ session, onOpen }) {
  const recommended = activeViews(session).filter((v) => v.recordType === 'Companies')
  const [view, setView] = useState('all')
  const viewDefs = COMPANY_VIEWS.map((v) => ({ ...v, count: COMPANIES.filter(v.filter).length }))
  const filtered = COMPANIES.filter(COMPANY_VIEWS.find((v) => v.id === view).filter)
  const columns = [
    {
      key: 'name',
      label: 'Company Name',
      render: (_v, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} square />
          <span className="font-semibold text-hs-navy">{row.name}</span>
        </div>
      ),
    },
    { key: 'city', label: 'City' },
    { key: 'industry', label: 'Industry' },
    {
      key: 'tier',
      label: 'Tier',
      render: (v) => <Pill color={TIER_COLOR[v] || 'gray'}>{v}</Pill>,
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
      <div className="text-[12px] font-semibold text-hs-navy leading-tight truncate">
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
                  <DealCard key={i} deal={d} onClick={() => onOpen('deals')} />
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
          <div className="font-semibold text-hs-navy leading-tight truncate">{v}</div>
          <div className="text-[10px] text-hs-text-light truncate">{row.company}</div>
        </div>
      ),
    },
    { key: 'stageLabel', label: 'Stage', render: (v) => <Pill color="blue">{v}</Pill> },
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
      <DataTable columns={columns} rows={rows} onRowClick={() => onOpen('deals')} />
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

function DealsTab({ session, onOpen }) {
  const [mode, setMode] = useState('Board')
  const stages =
    session.deals?.pipelineStages?.length > 0
      ? session.deals.pipelineStages
      : [{ key: 'default', label: 'Pipeline' }]

  // bucket deals into stage columns, clamping the stored index into range
  const cols = stages.map((st) => ({ ...st, deals: [] }))
  DEALS.forEach((d) => {
    const idx = Math.min(Math.max(d.stage, 0), cols.length - 1)
    cols[idx].deals.push(d)
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-hs-navy">Sales Pipeline</h3>
        <span className="text-[12px] text-hs-text-light">{DEALS.length} deals</span>
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
          className="ml-auto text-[12px] font-medium text-white bg-hs-orange rounded-md px-3 py-1.5 cursor-default"
        >
          Create deal
        </button>
      </div>
      {mode === 'Board' && <DealsBoard cols={cols} onOpen={onOpen} />}
      {mode === 'Table' && <DealsTable cols={cols} onOpen={onOpen} />}
      {mode === 'Calendar' && <DealsCalendar />}
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

function TicketsTab({ session, onOpen }) {
  const stages =
    session.tickets?.pipelineStages?.length > 0
      ? session.tickets.pipelineStages
      : [{ key: 'new', label: 'New' }]

  // match each ticket's status loosely to a stage; unmatched land in the first column
  const cols = stages.map((st) => ({ ...st, tickets: [] }))
  TICKETS.forEach((t) => {
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
        <span className="text-[12px] text-hs-text-light">{TICKETS.length} tickets</span>
        <button
          type="button"
          className="ml-auto text-[12px] font-medium text-white bg-hs-orange rounded-md px-3 py-1.5 cursor-default"
        >
          Create ticket
        </button>
      </div>
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
                    <div className="text-[12px] font-semibold text-hs-navy leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-hs-text-light truncate">
                      {t.company}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Pill color={PRIORITY_COLOR[t.priority] || 'gray'}>
                        {t.priority}
                      </Pill>
                      <Pill color={STATUS_COLOR[t.status] || 'gray'}>{t.status}</Pill>
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
        {tab === 'Contacts' && <ContactsTab session={session} onOpen={setOpenRecord} />}
        {tab === 'Companies' && <CompaniesTab session={session} onOpen={setOpenRecord} />}
        {tab === 'Deals' && <DealsTab session={session} onOpen={setOpenRecord} />}
        {tab === 'Tickets' && <TicketsTab session={session} onOpen={setOpenRecord} />}
      </div>

      <RecordModal slice={openRecord} onClose={() => setOpenRecord(null)} />
    </div>
  )
}
