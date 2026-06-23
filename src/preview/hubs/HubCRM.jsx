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
import { Tag, IconStar, IconPuzzle } from '../uiIcons'
import { CONTACTS, COMPANIES, DEALS, TICKETS, TASKS, REPS } from '../demoData'
import RecordPopup from '../RecordPopup'
import { fmtK } from '../recordHelpers'
import { fireTabTour } from '../tour/events'

const TABS = ['Contacts', 'Companies', 'Deals', 'Tasks', 'Tickets']

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

// ---- Tasks -----------------------------------------------------------------
// HubSpot's 2025 Tasks refresh: tasks are a first-class CRM object with their own
// index page, saved views, and Table / Board views (we ship Table + Board here).

const TASK_PRIORITY_COLOR = { High: 'red', Medium: 'orange', Low: 'gray' }
const TASK_STATUS_COLOR = {
  'Not started': 'gray',
  'In progress': 'orange',
  Waiting: 'purple',
  Completed: 'green',
}
const TASK_TYPE_COLOR = { Call: 'blue', Email: 'purple', 'To-do': 'gray' }
// Fixed board columns, in workflow order, matching the Status property options.
const TASK_BOARD_STAGES = ['Not started', 'In progress', 'Waiting', 'Completed']
const TASK_VIEW_MODES = ['Table', 'Board']
// "Today" is pinned to the demo's reference date so the Due-today view is non-empty.
const TASK_TODAY = 'Jun 23, 2026'

const TASK_VIEWS = [
  { id: 'all', name: 'All tasks', description: 'Every task across your team', filter: () => true },
  {
    id: 'open',
    name: 'Open',
    description: 'Not yet completed',
    filter: (t) => t.status !== 'Completed',
  },
  {
    id: 'due_today',
    name: 'Due today',
    description: `Tasks due ${TASK_TODAY}`,
    filter: (t) => t.dueDate === TASK_TODAY && t.status !== 'Completed',
  },
  {
    id: 'high_priority',
    name: 'High priority',
    description: 'Flagged High, still open',
    filter: (t) => t.priority === 'High' && t.status !== 'Completed',
  },
  {
    id: 'completed',
    name: 'Completed',
    description: 'Done and logged',
    filter: (t) => t.status === 'Completed',
  },
]

function TaskCard({ task, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md border border-hs-border px-3 py-2.5 shadow-sm cursor-pointer hover:border-hs-orange"
    >
      <div className="hs-link text-[12px] font-semibold leading-tight">{task.name}</div>
      <div className="text-[10px] text-hs-text-light truncate">{task.company}</div>
      <div className="flex items-center gap-1.5 mt-2">
        <Tag color={TASK_TYPE_COLOR[task.type] || 'gray'}>{task.type}</Tag>
        <Tag color={TASK_PRIORITY_COLOR[task.priority] || 'gray'}>{task.priority}</Tag>
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-hs-text-light">
        <Avatar name={task.assignee} />
        <span className="truncate">{task.assignee}</span>
        <span className="ml-auto shrink-0">{task.dueDate}</span>
      </div>
    </div>
  )
}

function TasksTab({ session, onOpen }) {
  const [mode, setMode] = useState('Table')
  const recommended = activeViews(session)
    .filter((v) => v.recordType === 'Tasks')
    .map((v) => ({ ...v, count: applyRecommended(v.id, TASKS).length }))
  const [view, setView] = useState('all')
  const viewDefs = TASK_VIEWS.map((v) => ({ ...v, count: TASKS.filter(v.filter).length }))
  const builtIn = TASK_VIEWS.find((v) => v.id === view)
  const rec = recommended.find((v) => v.id === view)
  const tasks = builtIn ? TASKS.filter(builtIn.filter) : applyRecommended(view, TASKS)
  const activeDesc = (builtIn || rec)?.description

  const cols = TASK_BOARD_STAGES.map((label) => ({
    key: label,
    label,
    tasks: tasks.filter((t) => t.status === label),
  }))

  const columns = [
    {
      key: 'name',
      label: 'Title',
      render: (_v, row) => (
        <div className="min-w-0">
          <div className="hs-link font-semibold leading-tight truncate">{row.name}</div>
          <div className="text-[10px] text-hs-text-light truncate">{row.company}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (v) => <Tag color={TASK_TYPE_COLOR[v] || 'gray'}>{v}</Tag>,
    },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'priority',
      label: 'Priority',
      render: (v) => <Tag color={TASK_PRIORITY_COLOR[v] || 'gray'}>{v}</Tag>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <Tag color={TASK_STATUS_COLOR[v] || 'gray'}>{v}</Tag>,
    },
    { key: 'assignee', label: 'Assigned To' },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-hs-navy">Tasks</h3>
        <span className="text-[12px] text-hs-text-light">{tasks.length} tasks</span>
        <div className="inline-flex rounded-md border border-hs-border bg-white p-0.5 ml-2">
          {TASK_VIEW_MODES.map((m) => (
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
          className="hs-btn-primary ml-auto cursor-default"
          style={{ padding: '6px 12px', fontSize: 12 }}
        >
          Create task
        </button>
      </div>
      <SavedViews views={viewDefs} active={view} onPick={setView} extraViews={recommended} />
      <ViewDescription text={activeDesc} />
      {mode === 'Table' ? (
        <IndexCard>
          <DataTable columns={columns} rows={tasks} onRowClick={() => onOpen('tasks')} />
        </IndexCard>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {cols.map((col) => (
            <div key={col.key} className="w-56 shrink-0">
              <div className="bg-white rounded-t-lg border border-hs-border border-b-0 px-3 py-2">
                <div className="text-[12px] font-semibold text-hs-navy truncate">{col.label}</div>
                <div className="text-[10px] text-hs-text-light">{col.tasks.length} tasks</div>
              </div>
              <div className="bg-hs-canvas border border-hs-border rounded-b-lg p-2 space-y-2 min-h-[120px]">
                {col.tasks.length === 0 ? (
                  <div className="text-[10px] text-hs-text-light text-center py-6">No tasks</div>
                ) : (
                  col.tasks.map((t, i) => (
                    <TaskCard key={i} task={t} onClick={() => onOpen('tasks')} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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

// ---- Custom objects --------------------------------------------------------

// A configured custom object shown as its own CRM record type: a HubSpot-style
// index header + a record card listing the object's custom properties (values
// empty — the point is showing the schema, not data).
function CustomObjectTab({ object }) {
  const name = object.plural || object.singular || 'Custom Object'
  const singular = (object.singular || object.plural || 'record').toLowerCase()
  const props = object.properties || []
  return (
    <div>
      <IndexHeader count={0} noun={name.toLowerCase()} createLabel={`Create ${singular}`} />
      <IndexCard>
        <div className="flex items-start gap-3 mb-4">
          <span className="w-9 h-9 rounded-[3px] bg-hs-orange/10 text-hs-orange flex items-center justify-center shrink-0">
            <IconPuzzle width={16} height={16} />
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-hs-navy">{name}</div>
            <div className="text-[12px] text-hs-text-light">
              {object.description || 'Custom object'} · Custom object
            </div>
          </div>
        </div>

        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-hs-text-light mb-2">
          About this {singular}
        </h4>
        {props.length === 0 ? (
          <p className="text-[12px] text-hs-text-light italic">No custom properties yet.</p>
        ) : (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            {props.map((p) => (
              <div key={p.key}>
                <dt className="text-[11px] text-hs-text-light">
                  {p.label} <span className="text-hs-border">· {p.type}</span>
                </dt>
                <dd className="text-[13px] text-hs-text-light">—</dd>
              </div>
            ))}
          </dl>
        )}

        {object.associations?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              Associated with
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {object.associations.map((a) => (
                <Tag key={a} color="blue">{a}</Tag>
              ))}
            </div>
          </div>
        )}
      </IndexCard>
    </div>
  )
}

// ---- Shell -----------------------------------------------------------------

export default function HubCRM() {
  const [tab, setTab] = useState('Contacts')
  const [openRecord, setOpenRecord] = useState(null)
  const session = useStore((s) => s.session)
  const customObjects = session.customObjects || []
  const activeCustom = customObjects.find((o) => o.id === tab)

  // onOpen(slice, record?) — record is an optional payload (e.g. a clicked deal)
  // that drives a single-record detail view instead of the generic preview.
  const openRecordWith = (slice, record = null) => setOpenRecord({ slice, record })

  return (
    <div className="h-full flex flex-col font-preview">
      {/* sub-tab bar */}
      <div
        data-tour="crm-tabs"
        className="flex items-center gap-1 px-4 border-b border-hs-border bg-white shrink-0 overflow-x-auto hs-scroll"
      >
        {TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t)
                fireTabTour('crm', t)
              }}
              className={`text-[13px] px-3 py-2.5 -mb-px border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'text-hs-navy font-medium border-hs-orange'
                  : 'text-hs-text-light border-transparent hover:text-hs-navy'
              }`}
            >
              {t}
            </button>
          )
        })}
        {customObjects.map((o) => {
          const active = o.id === tab
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setTab(o.id)}
              className={`inline-flex items-center gap-1.5 text-[13px] px-3 py-2.5 -mb-px border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'text-hs-navy font-medium border-hs-orange'
                  : 'text-hs-text-light border-transparent hover:text-hs-navy'
              }`}
            >
              <IconPuzzle width={12} height={12} className="text-hs-orange shrink-0" />
              {o.plural || o.singular || 'Custom Object'}
            </button>
          )
        })}
      </div>

      {/* content */}
      <div data-tour="crm-content" className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        {tab === 'Contacts' && <ContactsTab session={session} onOpen={openRecordWith} />}
        {tab === 'Companies' && <CompaniesTab session={session} onOpen={openRecordWith} />}
        {tab === 'Deals' && <DealsTab session={session} onOpen={openRecordWith} />}
        {tab === 'Tasks' && <TasksTab session={session} onOpen={openRecordWith} />}
        {tab === 'Tickets' && <TicketsTab session={session} onOpen={openRecordWith} />}
        {activeCustom && <CustomObjectTab object={activeCustom} />}
      </div>

      <RecordPopup
        slice={openRecord?.slice}
        record={openRecord?.record}
        session={session}
        onOpenRecord={openRecordWith}
        onClose={() => setOpenRecord(null)}
      />
    </div>
  )
}
