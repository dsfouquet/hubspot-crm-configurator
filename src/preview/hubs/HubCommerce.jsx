// HubCommerce — "HubSpot light" Commerce Hub demo view.
// Benefits-only, demo-ready. Quotes / Invoices / Payments sub-tabs.
// Pure JSX, no new deps, no images (styled divs only).
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  ReportCard,
  StatCard,
  HBarChart,
  LineChart,
  DataTable,
} from '../charts'
import { Tag, IconCheck } from '../uiIcons'
import {
  INVOICES,
  AR_AGING,
  DEALS,
  REVENUE_TREND,
  MONTHS,
  CONTACTS,
} from '../demoData'
import { industryCopy } from '../industryCopy'

const TABS = ['Quotes', 'Invoices', 'Payments']

const money = (n) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}K`.replace('.0K', 'K')
    : `$${n}`

const dollars = (n) => `$${n.toLocaleString('en-US')}`

export default function HubCommerce() {
  const [tab, setTab] = useState('Quotes')

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Sub-tab bar */}
      <div data-tour="commerce-tabs" className="border-b border-hs-border bg-white flex items-center px-4 shrink-0">
        {TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative text-[13px] py-2.5 px-3 -mb-px transition-colors ${
                active
                  ? 'text-hs-navy font-medium'
                  : 'text-hs-text-light hover:text-hs-text-dark'
              }`}
            >
              {t}
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-hs-orange rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div data-tour="commerce-content" className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        {tab === 'Quotes' && <QuotesTab />}
        {tab === 'Invoices' && <InvoicesTab />}
        {tab === 'Payments' && <PaymentsTab />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* QUOTES                                                              */
/* ------------------------------------------------------------------ */

// Quote-list view tabs (mirrors real HubSpot's saved views).
const QUOTE_VIEWS = [
  'All quotes',
  'Expiring soon',
  'Pending acceptance',
  'Pending approval',
]

// Status: colored dot + label, like the real Quotes index.
const QUOTE_STATUS = [
  { dot: '#00BDA5', label: 'Published' },
  { dot: '#00A4BD', label: 'Sent' },
  { dot: '#7C98B6', label: 'Draft' },
  { dot: '#00BDA5', label: 'Published' },
  { dot: '#F2545B', label: 'Expired' },
  { dot: '#00A4BD', label: 'Sent' },
  { dot: '#00BDA5', label: 'Published' },
]

const QUOTE_SIGNING = [
  'Signed',
  'Pending signature',
  'Not applicable',
  'Signed',
  'Not applicable',
  'Pending signature',
  'Not applicable',
]

const QUOTE_CREATED = [
  'Jun 4, 2026',
  'Jun 6, 2026',
  'Jun 9, 2026',
  'May 28, 2026',
  'May 12, 2026',
  'Jun 10, 2026',
  'Jun 11, 2026',
]

const QUOTE_NUMBERS = [
  '20260604-084201337',
  '20260606-091544210',
  '20260609-130277815',
  '20260528-074422509',
  '20260512-061190044',
  '20260610-145833612',
  '20260611-064204941',
]

// "Jun 4, 2026" -> "Jul 4, 2026" (create + 30 days, month-rounded for the demo).
const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function expiryFrom(dateStr) {
  const m = /(\w+) (\d+), (\d+)/.exec(dateStr)
  if (!m) return dateStr
  const idx = MONTHS_ABBR.indexOf(m[1])
  if (idx === -1) return dateStr
  const next = (idx + 1) % 12
  const year = next === 0 ? Number(m[3]) + 1 : Number(m[3])
  return `${MONTHS_ABBR[next]} ${m[2]}, ${year}`
}

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Owner avatar swatches keyed off rep name (stable per owner).
const OWNER_BG = {
  You: '#FF7A59',
  'Marcus Hebert': '#00A4BD',
  'Aimee Landry': '#00BDA5',
  'Catherine Roy': '#7C98B6',
}

function StatusDot({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-hs-text-dark">
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ background: status.dot }}
      />
      {status.label}
    </span>
  )
}

function QuotesTab() {
  // Industry-specific quote-document template (line-item names + bill-to).
  const industry = useStore((s) => s.session?.wizard?.industry)
  const q = industryCopy(industry).quote

  const [view, setView] = useState('All quotes')

  // ~7 quote rows built from the demo deals.
  const quotes = DEALS.slice(0, 7).map((d, i) => ({
    id: i,
    title: d.name,
    company: d.company,
    amount: d.amount,
    status: QUOTE_STATUS[i],
    signing: QUOTE_SIGNING[i],
    owner: d.owner,
    created: QUOTE_CREATED[i],
    number: QUOTE_NUMBERS[i],
  }))

  const [selectedId, setSelectedId] = useState(0)
  const selected = quotes.find((x) => x.id === selectedId) || quotes[0]

  // Build the quote-document line items for the SELECTED quote: take the
  // industry template's item names and scale their amounts so they sum to this
  // quote's total. Last line absorbs the rounding remainder. This makes each
  // quote's document distinct instead of every one showing the same numbers.
  const tmplTotal = q.lines.reduce((s, l) => s + l.price, 0) || 1
  let running = 0
  const quoteLines = q.lines.map((l, i) => {
    const isLast = i === q.lines.length - 1
    const amount = isLast
      ? selected.amount - running
      : Math.round((l.price / tmplTotal) * selected.amount)
    running += amount
    return { desc: l.item, amount }
  })
  const quoteSubtotal = quoteLines.reduce((s, l) => s + l.amount, 0)

  // Two sample contacts for the preview panel's Contacts block.
  const contacts =
    CONTACTS.filter((c) => c.company === selected.company).slice(0, 2)
      .length >= 2
      ? CONTACTS.filter((c) => c.company === selected.company).slice(0, 2)
      : CONTACTS.slice(selected.id % 5, (selected.id % 5) + 2)

  return (
    <div className="flex gap-4 h-full">
      {/* LEFT — quote list */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* View tabs */}
        <div className="flex items-center gap-1 mb-3 border-b border-hs-border">
          {QUOTE_VIEWS.map((v) => {
            const active = v === view
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`relative text-[13px] py-2 px-3 -mb-px transition-colors ${
                  active
                    ? 'text-hs-navy font-medium'
                    : 'text-hs-text-light hover:text-hs-text-dark'
                }`}
              >
                {v}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-hs-orange rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* List table */}
        <div className="bg-white rounded-[3px] border border-hs-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-hs-border bg-hs-canvas/40">
                {['Title', 'Status', 'Amount', 'Signing status', 'Owner', 'Create date'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`text-[11px] uppercase tracking-wide text-hs-text-light font-semibold py-2.5 px-3 ${
                        i === 2 ? 'text-right' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {quotes.map((qr) => {
                const active = qr.id === selectedId
                return (
                  <tr
                    key={qr.id}
                    onClick={() => setSelectedId(qr.id)}
                    className={`cursor-pointer border-b border-hs-border last:border-0 transition-colors ${
                      active
                        ? 'bg-hs-koala border-l-2 border-l-hs-orange'
                        : 'hover:bg-hs-canvas/50 border-l-2 border-l-transparent'
                    }`}
                  >
                    <td className="py-2.5 px-3 max-w-[180px]">
                      <span className="hs-link text-[13px] block truncate">
                        {qr.title}
                      </span>
                      <span className="text-[11px] text-hs-text-light block truncate">
                        {qr.company}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusDot status={qr.status} />
                    </td>
                    <td className="py-2.5 px-3 text-right text-[13px] text-hs-text-dark tabular-nums">
                      {dollars(qr.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-[12px] text-hs-text-light whitespace-nowrap">
                      {qr.signing}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[9px] font-semibold shrink-0"
                          style={{ background: OWNER_BG[qr.owner] || '#7C98B6' }}
                        >
                          {initials(qr.owner)}
                        </span>
                        <span className="text-[12px] text-hs-text-dark whitespace-nowrap">
                          {qr.owner}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[12px] text-hs-text-light whitespace-nowrap">
                      {qr.created}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT — preview panel */}
      <div className="w-[320px] shrink-0">
        <div className="bg-white rounded-[3px] border border-hs-border overflow-hidden max-h-full flex flex-col">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-hs-border">
            <p className="text-[14px] font-semibold text-hs-navy leading-snug">
              {selected.title}
            </p>
            <p className="text-[24px] font-bold text-hs-green leading-tight tabular-nums mt-1">
              {dollars(selected.amount)}
            </p>
            <p className="text-[11px] text-hs-text-light mt-0.5">
              Quote #{selected.number}
            </p>
            <div className="mt-2">
              <StatusDot status={selected.status} />
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* About this quote */}
            <div className="px-4 py-3 border-b border-hs-border">
              <p className="text-[10px] uppercase tracking-wide text-hs-text-light font-semibold mb-2">
                About this quote
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-hs-text-light">Owner</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[8px] font-semibold shrink-0"
                      style={{ background: OWNER_BG[selected.owner] || '#7C98B6' }}
                    >
                      {initials(selected.owner)}
                    </span>
                    <span className="text-[12px] text-hs-text-dark">
                      {selected.owner}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-hs-text-light">Create date</span>
                  <span className="text-[12px] text-hs-text-dark">
                    {selected.created}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-hs-text-light">
                    Expiration date
                  </span>
                  <span className="text-[12px] text-hs-text-dark">
                    {expiryFrom(selected.created)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-hs-text-light">
                    Signing status
                  </span>
                  <span className="text-[12px] text-hs-text-dark">
                    {selected.signing}
                  </span>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="px-4 py-3 border-b border-hs-border">
              <p className="text-[10px] uppercase tracking-wide text-hs-text-light font-semibold mb-2">
                Contacts ({contacts.length})
              </p>
              <div className="space-y-2.5">
                {contacts.map((c) => (
                  <div key={c.email} className="flex items-start gap-2">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-[10px] font-semibold shrink-0"
                      style={{ background: '#0091AE' }}
                    >
                      {initials(c.name)}
                    </span>
                    <div className="min-w-0 leading-tight">
                      <span className="hs-link text-[12px] block truncate">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-hs-text-light block truncate">
                        {c.title}
                      </span>
                      <span className="hs-link text-[11px] block truncate">
                        {c.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact branded quote doc */}
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-hs-text-light font-semibold mb-2">
                Quote document
              </p>
              <div className="rounded-[3px] border border-hs-border overflow-hidden">
                <div
                  className="px-3 py-2.5 flex items-center justify-between text-white"
                  style={{ background: 'linear-gradient(135deg,#2D3E50,#0091AE)' }}
                >
                  <span className="text-[11px] font-semibold">Your Company</span>
                  <span className="text-[10px] opacity-80">#Q-{2041 + selected.id}</span>
                </div>
                <table className="w-full">
                  <tbody>
                    {quoteLines.map((l) => (
                      <tr key={l.desc} className="border-b border-hs-canvas">
                        <td className="text-[10px] text-hs-text-dark py-1.5 px-3 leading-tight">
                          {l.desc}
                        </td>
                        <td className="text-[10px] text-hs-text-dark py-1.5 px-3 text-right tabular-nums whitespace-nowrap">
                          {dollars(l.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-3 py-2 space-y-1 border-t border-hs-border">
                  <div className="flex justify-between text-[10px] text-hs-text-light">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{dollars(quoteSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-hs-text-light">
                    <span>Tax (estimated)</span>
                    <span className="tabular-nums">{dollars(0)}</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-bold text-hs-navy border-t border-hs-border pt-1">
                    <span>Total</span>
                    <span className="tabular-nums">{dollars(selected.amount)}</span>
                  </div>
                </div>
                <div className="px-3 py-2 border-t border-hs-border bg-hs-canvas/40 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-[3px] px-2 py-0.5"
                    style={{ background: '#E5F8F6', color: '#00A38D' }}
                  >
                    <IconCheck width={10} height={10} className="shrink-0" /> e-Sign
                  </span>
                  <span className="hs-link text-[11px]">View quote</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* INVOICES                                                            */
/* ------------------------------------------------------------------ */

const INVOICE_PILL = { Paid: 'green', Open: 'blue', Overdue: 'red' }

function InvoicesTab() {
  return (
    <div className="space-y-4">
      {/* Stat row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Outstanding" value="$131K" />
        <StatCard label="Overdue" value="$43K" delta="$12K" deltaGood={false} />
        <StatCard label="Collected this month" value="$74K" delta="$18K" deltaGood />
        <StatCard label="Avg days to pay" value="18" delta="4 days" deltaGood />
      </div>

      {/* Invoices table */}
      <ReportCard
        title="Invoices"
        subtitle="All invoices, current billing period"
      >
        <DataTable
          columns={[
            { key: 'number', label: 'Invoice #' },
            { key: 'company', label: 'Company' },
            {
              key: 'amount',
              label: 'Amount',
              align: 'right',
              render: (v) => <span className="tabular-nums">{dollars(v)}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (v) => <Tag color={INVOICE_PILL[v]}>{v}</Tag>,
            },
            { key: 'due', label: 'Due' },
          ]}
          rows={INVOICES}
        />
      </ReportCard>

      {/* AR aging */}
      <ReportCard
        title="AR aging"
        subtitle="Outstanding receivables by age"
        footer="Synced two-ways with QuickBooks — no double entry."
      >
        <HBarChart data={AR_AGING} money color="#F2545B" />
      </ReportCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* PAYMENTS                                                            */
/* ------------------------------------------------------------------ */

function PaymentsTab() {
  const collected = REVENUE_TREND.map((n) => Math.round(n * 0.4))
  const series = [{ name: 'Collected', color: '#00BDA5', points: collected }]

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT — payment link mock */}
      <div className="space-y-2">
        <div className="mx-auto max-w-[300px] bg-white rounded-xl border border-hs-border shadow-[0_4px_20px_rgba(45,62,80,0.12)] overflow-hidden">
          {/* Header */}
          <div
            className="px-5 py-4 text-white"
            style={{ background: 'linear-gradient(135deg,#2D3E50,#0091AE)' }}
          >
            <p className="text-[13px] font-semibold leading-tight">
              Your Company
            </p>
            <p className="text-[10px] opacity-80">Secure payment request</p>
          </div>

          {/* Amount */}
          <div className="px-5 pt-4 pb-2 text-center">
            <p className="text-[11px] text-hs-text-light">
              Deposit for Quote #Q-2047
            </p>
            <p className="text-[30px] font-bold text-hs-navy leading-tight tabular-nums">
              $25,350
            </p>
          </div>

          {/* Card inputs (fake) */}
          <div className="px-5 pb-3 space-y-2">
            <div>
              <label className="text-[9px] uppercase tracking-wide text-hs-text-light">
                Card number
              </label>
              <div className="mt-1 h-8 rounded-md border border-hs-border px-3 flex items-center text-[12px] text-hs-text-dark tabular-nums tracking-widest">
                4242&nbsp;4242&nbsp;4242&nbsp;4242
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[9px] uppercase tracking-wide text-hs-text-light">
                  Expiry
                </label>
                <div className="mt-1 h-8 rounded-md border border-hs-border px-3 flex items-center text-[12px] text-hs-text-dark tabular-nums">
                  08 / 28
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[9px] uppercase tracking-wide text-hs-text-light">
                  CVC
                </label>
                <div className="mt-1 h-8 rounded-md border border-hs-border px-3 flex items-center text-[12px] text-hs-text-dark tabular-nums">
                  •••
                </div>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <div className="px-5 pb-3">
            <button
              className="w-full text-[13px] font-semibold text-white rounded-md py-2.5 shadow-sm"
              style={{ background: '#FF7A59' }}
            >
              Pay $25,350
            </button>
          </div>

          {/* Secured footer */}
          <div className="px-5 py-2.5 border-t border-hs-border flex items-center justify-center gap-1.5 text-[10px] text-hs-text-light">
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Secured by HubSpot Payments
          </div>
        </div>
        <p className="text-[11px] text-hs-text-light text-center px-1">
          One link. Customer pays by card or ACH in seconds.
        </p>
      </div>

      {/* RIGHT — collected trend + stat */}
      <div className="space-y-4">
        <ReportCard
          title="Collected by month"
          subtitle="Payments captured through HubSpot"
        >
          <LineChart series={series} labels={MONTHS} money />
        </ReportCard>

        <StatCard
          label="Same-day payment rate"
          value="64%"
          delta="12%"
          deltaGood
        />
      </div>
    </div>
  )
}
