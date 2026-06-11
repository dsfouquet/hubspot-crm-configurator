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

const TABS = ['Contacts', 'Companies', 'Deals', 'Tickets']

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

// Saved-view tab row: "All ___" active, plus recommended views for this record type.
function SavedViews({ allLabel, views }) {
  return (
    <div className="flex items-center gap-1 mb-3 border-b border-hs-border overflow-x-auto">
      <span className="text-[12px] font-medium text-hs-navy border-b-2 border-hs-orange px-3 pb-2 whitespace-nowrap -mb-px">
        {allLabel}
      </span>
      {views.map((v) => (
        <span
          key={v.id}
          className="text-[12px] text-hs-text-light hover:text-hs-navy px-3 pb-2 whitespace-nowrap cursor-default"
        >
          {v.name}
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

function ContactsTab({ session }) {
  const views = activeViews(session).filter((v) => v.recordType === 'Contacts')
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
      <IndexHeader count={CONTACTS.length} noun="contacts" createLabel="Create contact" />
      <IndexCard>
        <SavedViews allLabel="All contacts" views={views} />
        <DataTable columns={columns} rows={CONTACTS} />
      </IndexCard>
    </div>
  )
}

// ---- Companies -------------------------------------------------------------

const TIER_COLOR = { 'Tier 1': 'green', 'Tier 2': 'blue', 'Tier 3': 'gray' }

function CompaniesTab({ session }) {
  const views = activeViews(session).filter((v) => v.recordType === 'Companies')
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
  const rows = COMPANIES.map((c, i) => ({ ...c, owner: REPS[i % REPS.length] }))
  return (
    <div>
      <IndexHeader count={COMPANIES.length} noun="companies" createLabel="Create company" />
      <IndexCard>
        <SavedViews allLabel="All companies" views={views} />
        <DataTable columns={columns} rows={rows} />
      </IndexCard>
    </div>
  )
}

// ---- Deals (kanban) --------------------------------------------------------

function DealCard({ deal }) {
  return (
    <div className="bg-white rounded-md border border-hs-border px-3 py-2.5 shadow-sm">
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

function DealsTab({ session }) {
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
        <button
          type="button"
          className="ml-auto text-[12px] font-medium text-white bg-hs-orange rounded-md px-3 py-1.5 cursor-default"
        >
          Create deal
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cols.map((col) => {
          const sum = col.deals.reduce((s, d) => s + d.amount, 0)
          return (
            <div key={col.key} className="w-56 shrink-0">
              <div className="bg-white rounded-t-lg border border-hs-border border-b-0 px-3 py-2">
                <div className="text-[12px] font-semibold text-hs-navy truncate">
                  {col.label}
                </div>
                <div className="text-[10px] text-hs-text-light">
                  {col.deals.length} deals · {fmtK(sum)}
                </div>
              </div>
              <div className="bg-hs-canvas border border-hs-border rounded-b-lg p-2 space-y-2 min-h-[120px]">
                {col.deals.length === 0 ? (
                  <div className="text-[10px] text-hs-text-light text-center py-6">
                    No deals
                  </div>
                ) : (
                  col.deals.map((d, i) => <DealCard key={i} deal={d} />)
                )}
              </div>
            </div>
          )
        })}
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

function TicketsTab({ session }) {
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
                    className="bg-white rounded-md border border-hs-border px-3 py-2.5 shadow-sm"
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
        {tab === 'Contacts' && <ContactsTab session={session} />}
        {tab === 'Companies' && <CompaniesTab session={session} />}
        {tab === 'Deals' && <DealsTab session={session} />}
        {tab === 'Tickets' && <TicketsTab session={session} />}
      </div>
    </div>
  )
}
