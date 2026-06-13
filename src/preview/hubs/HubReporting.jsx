// HubReporting — "HubSpot light" Reporting view for the preview portal.
// Four dashboards (Sales Overview, Rep Activity, Marketing, Service) built from
// the shared chart library + realistic demo data, so the reports read like a real
// business's live HubSpot dashboards rather than placeholder toys.

import { useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  ReportCard,
  StatCard,
  BarChart,
  HBarChart,
  LineChart,
  DonutChart,
  DataTable,
} from '../charts'
import {
  REVENUE_TREND,
  MONTHS,
  PIPELINE_VALUES,
  REP_PERFORMANCE,
  REP_ACTIVITY,
  LEAD_SOURCES,
  EMAIL_PERFORMANCE,
  TICKETS,
  AR_AGING,
  DEALS,
} from '../demoData'

const TABS = ['Sales Overview', 'Rep Activity', 'Marketing', 'Service']

const money = (n) =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`

// ---- Persistent filters bar ----
function FilterChip({ children }) {
  return (
    <button className="inline-flex items-center gap-1 text-[11px] text-hs-text-dark bg-white border border-hs-border rounded px-2 py-1 hover:bg-hs-canvas">
      {children}
    </button>
  )
}

function FiltersBar({ title }) {
  return (
    <div className="bg-white border-b border-hs-border px-4 py-2 flex items-center gap-2 flex-wrap">
      <h3 className="text-[14px] font-semibold text-hs-navy mr-2">{title}</h3>
      <FilterChip>Date range: Last 6 months ▾</FilterChip>
      <FilterChip>Owner: All ▾</FilterChip>
      <FilterChip>Pipeline: Sales ▾</FilterChip>
      <button className="hs-btn-primary ml-auto" style={{ padding: '4px 12px', fontSize: 11 }}>
        Share
      </button>
    </div>
  )
}

// ===== Dashboard 1: Sales Overview =====
function SalesOverview({ stageLabels }) {
  // Chart only the stages that actually exist in the user's pipeline.
  const count = Math.min(Math.max(stageLabels.length, 3), PIPELINE_VALUES.length)
  const pipelineData = PIPELINE_VALUES.slice(0, count).map((v, i) => ({
    label: (stageLabels[i] || `Stage ${i + 1}`).split(' ')[0],
    value: v,
  }))

  const closingRows = DEALS.slice(0, 4).map((d) => ({
    name: d.name,
    amount: d.amount,
    closeDate: d.closeDate,
    owner: d.owner,
  }))

  const dealCols = [
    { key: 'name', label: 'Deal' },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (v) => `$${v.toLocaleString()}`,
    },
    { key: 'closeDate', label: 'Close Date' },
    { key: 'owner', label: 'Owner' },
  ]

  return (
    <>
      <div className="col-span-2 grid grid-cols-4 gap-3">
        <StatCard label="Closed revenue (6 mo)" value="$1.26M" delta="14%" />
        <StatCard label="Open pipeline" value="$382K" />
        <StatCard label="Win rate" value="38%" delta="6%" />
        <StatCard label="Avg deal size" value="$63.6K" />
      </div>

      <ReportCard title="Closed revenue by month" subtitle="LAST 6 MONTHS">
        <LineChart
          series={[{ name: 'Revenue', color: '#FF7A59', points: REVENUE_TREND }]}
          labels={MONTHS}
          money
        />
      </ReportCard>

      <ReportCard title="Pipeline value by stage" subtitle="OPEN DEALS · SALES PIPELINE">
        <BarChart data={pipelineData} money color="#0091AE" />
      </ReportCard>

      <ReportCard title="Revenue by rep" subtitle="CLOSED WON · LAST 6 MONTHS">
        <HBarChart data={REP_PERFORMANCE} money />
      </ReportCard>

      <ReportCard
        title="Deals closing this month"
        subtitle="WEIGHTED BY STAGE PROBABILITY"
        footer="Forecast: $214K weighted"
      >
        <DataTable columns={dealCols} rows={closingRows} compact />
      </ReportCard>
    </>
  )
}

// ===== Dashboard 2: Rep Activity =====
function RepActivity() {
  const activityCols = [
    { key: 'label', label: 'Rep' },
    { key: 'calls', label: 'Calls', align: 'right' },
    { key: 'emails', label: 'Emails', align: 'right' },
    { key: 'meetings', label: 'Meetings', align: 'right' },
  ]

  const callsData = REP_ACTIVITY.map((r) => ({ label: r.label, value: r.calls }))

  return (
    <>
      <div className="col-span-2 grid grid-cols-4 gap-3">
        <StatCard label="Calls logged" value="195" delta="18%" />
        <StatCard label="Emails sent" value="548" />
        <StatCard label="Meetings booked" value="42" delta="9%" />
        <StatCard label="Tasks overdue" value="7" delta="3" deltaGood={false} />
      </div>

      <ReportCard title="Activity by rep" subtitle="LAST 6 MONTHS">
        <DataTable columns={activityCols} rows={REP_ACTIVITY} compact />
      </ReportCard>

      <ReportCard title="Calls by rep" subtitle="LAST 6 MONTHS">
        <HBarChart data={callsData} color="#0091AE" />
      </ReportCard>

      <ReportCard
        title="Meetings trend"
        subtitle="MEETINGS BOOKED PER MONTH"
        footer="Logged automatically from connected email + calling — zero manual entry."
      >
        <LineChart
          series={[{ name: 'Meetings', color: '#6A78D1', points: [22, 26, 29, 33, 38, 42] }]}
          labels={MONTHS}
        />
      </ReportCard>
    </>
  )
}

// ===== Dashboard 3: Marketing =====
function Marketing() {
  // Leads → revenue, aligned to LEAD_SOURCES order (referrals/repeat convert best).
  const leadRevenue = [
    { label: 'Referrals', value: 112000 },
    { label: 'Website', value: 68000 },
    { label: 'Cold outreach', value: 41000 },
    { label: 'Repeat clients', value: 52000 },
    { label: 'Events', value: 12000 },
  ]

  return (
    <>
      <div className="col-span-2 grid grid-cols-4 gap-3">
        <StatCard label="Emails sent" value="1,240" />
        <StatCard label="Open rate" value="41.2%" delta="5.1%" />
        <StatCard label="New leads" value="103" />
        <StatCard label="Marketing-sourced revenue" value="$285K" />
      </div>

      <ReportCard title="Lead sources" subtitle="NEW LEADS · LAST 6 MONTHS">
        <DonutChart data={LEAD_SOURCES} centerValue="103" centerLabel="leads" />
      </ReportCard>

      <ReportCard title="Open rate trend" subtitle="EMAIL OPEN RATE BY MONTH">
        <LineChart
          series={[{ name: 'Open rate', color: '#FF7A59', points: EMAIL_PERFORMANCE.trend }]}
          labels={MONTHS}
        />
      </ReportCard>

      <ReportCard title="Leads → revenue by source" subtitle="CLOSED REVENUE ATTRIBUTED TO SOURCE">
        <HBarChart data={leadRevenue} money color="#00BDA5" />
      </ReportCard>
    </>
  )
}

// ===== Dashboard 4: Service =====
function Service() {
  const priorityColors = { High: '#F2545B', Medium: '#FF7A59', Low: '#7C98B6' }
  const counts = TICKETS.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1
    return acc
  }, {})
  const priorityData = ['High', 'Medium', 'Low']
    .filter((p) => counts[p])
    .map((p) => ({ label: p, value: counts[p], color: priorityColors[p] }))

  return (
    <>
      <div className="col-span-2 grid grid-cols-4 gap-3">
        <StatCard label="Open tickets" value="5" />
        <StatCard label="Avg resolution" value="1.8 days" delta="0.4 days" />
        <StatCard label="SLA met" value="94%" />
        <StatCard label="NPS" value="62" delta="7" />
      </div>

      <ReportCard title="Tickets by priority" subtitle="OPEN TICKETS">
        <DonutChart data={priorityData} centerValue={TICKETS.length} centerLabel="open" />
      </ReportCard>

      <ReportCard title="AR aging" subtitle="OUTSTANDING RECEIVABLES BY AGE">
        <HBarChart data={AR_AGING} money color="#F2545B" />
      </ReportCard>

      <ReportCard
        title="Resolution time trend"
        subtitle="AVG DAYS TO RESOLVE BY MONTH"
        footer="Lower is better"
      >
        <LineChart
          series={[{ name: 'Days to resolve', color: '#00BDA5', points: [3.1, 2.8, 2.6, 2.3, 2.0, 1.8] }]}
          labels={MONTHS}
        />
      </ReportCard>
    </>
  )
}

export default function HubReporting() {
  const session = useStore((s) => s.session)
  const [active, setActive] = useState(TABS[0])

  const stageLabels =
    session.deals?.pipelineStages?.length > 0
      ? session.deals.pipelineStages.map((st) => st.label)
      : ['Prospecting', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won']

  const overviewTitle = session.dashboards?.name || 'Sales Command Center'
  const titles = {
    'Sales Overview': overviewTitle,
    'Rep Activity': 'Rep Activity',
    Marketing: 'Marketing Performance',
    Service: 'Service & Receivables',
  }

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Sub-tab bar */}
      <div className="border-b border-hs-border bg-white flex items-center px-2">
        {TABS.map((tab) => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`text-[13px] px-3 py-2.5 -mb-px border-b-2 ${
                isActive
                  ? 'text-hs-navy font-medium border-hs-orange'
                  : 'text-hs-text-light border-transparent hover:text-hs-text-dark'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Filters bar */}
      <FiltersBar title={titles[active]} />

      {/* Dashboard content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        <div className="grid grid-cols-2 gap-3">
          {active === 'Sales Overview' && <SalesOverview stageLabels={stageLabels} />}
          {active === 'Rep Activity' && <RepActivity />}
          {active === 'Marketing' && <Marketing />}
          {active === 'Service' && <Service />}
        </div>
      </div>
    </div>
  )
}
