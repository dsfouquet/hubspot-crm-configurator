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
  Pill,
} from '../charts'
import { INVOICES, AR_AGING, DEALS, REVENUE_TREND, MONTHS } from '../demoData'
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
      <div className="border-b border-hs-border bg-white flex items-center px-4 shrink-0">
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
      <div className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
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

const QUOTE_STATUS = [
  { color: 'green', label: 'Signed' },
  { color: 'orange', label: 'Awaiting reply' },
  { color: 'gray', label: 'Draft' },
  { color: 'green', label: 'Signed' },
  { color: 'orange', label: 'Awaiting reply' },
]

const QUOTE_SENT = [
  'Jun 4, 2026',
  'Jun 6, 2026',
  'Jun 9, 2026',
  'May 28, 2026',
  'Jun 10, 2026',
]

function QuotesTab() {
  // Industry-specific quote document (line items, bill-to, quote number).
  const industry = useStore((s) => s.session?.wizard?.industry)
  const q = industryCopy(industry).quote
  const quoteLines = q.lines.map((l) => ({ desc: l.item, qty: 1, amount: l.price }))
  const quoteSubtotal = quoteLines.reduce((s, l) => s + l.amount, 0)

  const rows = DEALS.slice(0, 5).map((d, i) => ({
    quote: d.name,
    amount: d.amount,
    status: QUOTE_STATUS[i],
    sent: QUOTE_SENT[i],
  }))

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT — branded quote document */}
      <div className="space-y-2">
        <div className="bg-white rounded-lg border border-hs-border shadow-[0_2px_12px_rgba(45,62,80,0.10)] overflow-hidden">
          {/* Document header */}
          <div className="px-5 pt-5 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-md flex items-center justify-center text-white text-[15px] font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg,#2D3E50,#0091AE)' }}
              >
                YC
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-hs-navy">
                  Your Company
                </p>
                <p className="text-[10px] text-hs-text-light">
                  Your logo & brand colors here
                </p>
              </div>
            </div>
            <div className="text-right leading-tight">
              <p className="text-[15px] font-bold text-hs-navy">QUOTE</p>
              <p className="text-[11px] text-hs-text-light">#{q.number}</p>
            </div>
          </div>

          {/* Bill-to */}
          <div className="px-5 pb-3">
            <p className="text-[9px] uppercase tracking-wide text-hs-text-light mb-0.5">
              Bill to
            </p>
            <p className="text-[12px] font-medium text-hs-text-dark leading-tight">
              {q.billTo.company}
            </p>
            <p className="text-[11px] text-hs-text-light leading-tight">
              {q.billTo.contact}
            </p>
            <p className="text-[11px] text-hs-text-light leading-tight">
              Baton Rouge, LA
            </p>
          </div>

          {/* Line items */}
          <div className="px-5">
            <table className="w-full">
              <thead>
                <tr className="border-y border-hs-border">
                  <th className="text-left text-[9px] uppercase tracking-wide text-hs-text-light py-1.5">
                    Description
                  </th>
                  <th className="text-center text-[9px] uppercase tracking-wide text-hs-text-light py-1.5 w-10">
                    Qty
                  </th>
                  <th className="text-right text-[9px] uppercase tracking-wide text-hs-text-light py-1.5 w-24">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {quoteLines.map((l) => (
                  <tr key={l.desc} className="border-b border-hs-canvas">
                    <td className="text-[11px] text-hs-text-dark py-2 pr-2 leading-tight">
                      {l.desc}
                    </td>
                    <td className="text-[11px] text-hs-text-light py-2 text-center">
                      {l.qty}
                    </td>
                    <td className="text-[11px] text-hs-text-dark py-2 text-right tabular-nums">
                      {dollars(l.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-5 pt-2 pb-4">
            <div className="ml-auto w-44 space-y-1">
              <div className="flex justify-between text-[11px] text-hs-text-light">
                <span>Subtotal</span>
                <span className="tabular-nums">{dollars(quoteSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-hs-text-light">
                <span>Tax (estimated)</span>
                <span className="tabular-nums">{dollars(Math.max(0, q.total - quoteSubtotal))}</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold text-hs-navy border-t border-hs-border pt-1.5 mt-1">
                <span>Total</span>
                <span className="tabular-nums">{dollars(q.total)}</span>
              </div>
            </div>
          </div>

          {/* Signature + CTA */}
          <div className="px-5 py-3 border-t border-hs-border bg-hs-canvas/40 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2.5 py-1"
              style={{ background: '#E5F8F6', color: '#00BDA5' }}
            >
              <span>✓</span> Signed electronically
            </span>
            <button
              className="text-[12px] font-semibold text-white rounded-md px-4 py-1.5 shadow-sm"
              style={{ background: '#FF7A59' }}
            >
              Pay deposit
            </button>
          </div>
        </div>
        <p className="text-[11px] text-hs-text-light px-1">
          Prospect signs and pays the deposit in one link.
        </p>
      </div>

      {/* RIGHT — quote status table + stat */}
      <div className="space-y-4">
        <ReportCard
          title="Quotes sent"
          subtitle="Live status of outstanding quotes"
        >
          <DataTable
            columns={[
              { key: 'quote', label: 'Quote' },
              {
                key: 'amount',
                label: 'Amount',
                align: 'right',
                render: (v) => (
                  <span className="tabular-nums">{dollars(v)}</span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (v) => <Pill color={v.color}>{v.label}</Pill>,
              },
              { key: 'sent', label: 'Sent' },
            ]}
            rows={rows}
          />
        </ReportCard>

        <StatCard
          label="Avg time quote → signed"
          value="6.2 days"
          delta="3.1 days"
          deltaGood
        />
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
              render: (v) => <Pill color={INVOICE_PILL[v]}>{v}</Pill>,
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
