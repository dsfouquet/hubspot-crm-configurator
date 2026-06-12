import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  WIDGET_CATEGORIES,
  AUTOMATION_HEALTH_WIDGETS,
  WIDGET_LABELS,
} from '../constants/defaultWidgets'
import { BarChart, LineChart, HBarChart, DonutChart, DataTable } from './charts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

// Big-number stat rendered inside the shared card chrome (no extra border).
function StatBlock({ value, delta, deltaGood = true, foot }) {
  return (
    <div className="py-1">
      <p className="text-[26px] font-preview font-semibold text-hs-navy leading-none">{value}</p>
      {delta && (
        <p
          className={`text-[12px] font-preview mt-1.5 ${
            deltaGood ? 'text-hs-green' : 'text-hs-red'
          }`}
        >
          {deltaGood ? '▲' : '▼'} {delta}
        </p>
      )}
      {foot && (
        <p className="text-[10px] font-preview text-hs-text-light mt-1.5">{foot}</p>
      )}
    </div>
  )
}

// Explicit per-widget dataset + chart. Each widget gets its OWN plausible data.
const WIDGET_DATA = {
  // ---- Sales Performance ----
  deals_closed_month: (
    <BarChart
      data={MONTHS.map((m, i) => ({ label: m, value: [6, 4, 8, 7, 9, 11][i] }))}
      color="#0091AE"
      height={120}
    />
  ),
  revenue_by_rep: (
    <HBarChart
      money
      data={[
        { label: 'Aimee Landry', value: 178000 },
        { label: 'You', value: 142000 },
        { label: 'Marcus Hebert', value: 96000 },
        { label: 'Catherine Roy', value: 41000 },
      ]}
    />
  ),
  pipeline_value_stage: (
    <BarChart
      money
      color="#6A78D1"
      height={120}
      data={[
        { label: 'Qualified', value: 148000 },
        { label: 'Demo', value: 226000 },
        { label: 'Proposal', value: 213000 },
        { label: 'Closing', value: 47000 },
      ]}
    />
  ),
  deal_velocity: <StatBlock value="47 days" delta="-6 days" deltaGood foot="Avg lead to close" />,
  won_vs_lost: (
    <DonutChart
      data={[
        { label: 'Won', value: 23, color: '#00BDA5' },
        { label: 'Lost', value: 14, color: '#F2545B' },
      ]}
      centerValue="62%"
      centerLabel="win rate"
      size={96}
    />
  ),

  // ---- Activity Tracking ----
  calls_logged: (
    <LineChart
      series={[{ name: 'Calls', color: '#FF7A59', points: [121, 134, 142, 158, 169, 187] }]}
      labels={MONTHS}
      height={120}
    />
  ),
  emails_sent: (
    <BarChart
      data={MONTHS.map((m, i) => ({ label: m, value: [412, 468, 503, 547, 521, 589][i] }))}
      color="#0091AE"
      height={120}
    />
  ),
  meetings_booked: (
    <LineChart
      series={[{ name: 'Meetings', color: '#00BDA5', points: [18, 24, 21, 29, 34, 42] }]}
      labels={MONTHS}
      height={120}
    />
  ),
  tasks_completed_overdue: (
    <DonutChart
      data={[
        { label: 'Completed', value: 134, color: '#00BDA5' },
        { label: 'Overdue', value: 7, color: '#F2545B' },
      ]}
      centerValue="95%"
      centerLabel="on time"
      size={96}
    />
  ),

  // ---- Forecast ----
  weighted_pipeline: <StatBlock value="$214K" delta="+$31K" deltaGood foot="Probability-weighted" />,
  forecast_vs_goal: (
    <BarChart
      money
      color="#6A78D1"
      height={120}
      data={[
        { label: 'Forecast', value: 214000, color: '#0091AE' },
        { label: 'Goal', value: 250000, color: '#CBD6E2' },
      ]}
    />
  ),
  deals_closing_month: (
    <DataTable
      compact
      columns={[
        { key: 'deal', label: 'Deal' },
        { key: 'amount', label: 'Amount', align: 'right' },
      ]}
      rows={[
        { deal: 'Gulf Coast Chem — Pumps', amount: '$84K' },
        { deal: 'Delta Refining — Retrofit', amount: '$61K' },
        { deal: 'Bayou Mfg — Service', amount: '$28K' },
      ]}
    />
  ),

  // ---- Customer Health ----
  open_tickets_status: (
    <DonutChart
      data={[
        { label: 'New', value: 2, color: '#0091AE' },
        { label: 'In Progress', value: 2, color: '#FF7A59' },
        { label: 'Waiting', value: 1, color: '#F5C26B' },
      ]}
      centerValue="5"
      centerLabel="open"
      size={96}
    />
  ),
  avg_ticket_resolution: (
    <LineChart
      series={[{ name: 'Days', color: '#0091AE', points: [3.4, 3.1, 2.7, 2.4, 2.0, 1.8] }]}
      labels={MONTHS}
      height={120}
    />
  ),
  contacts_by_lifecycle: (
    <DonutChart
      data={[
        { label: 'Lead', value: 5, color: '#7C98B6' },
        { label: 'MQL', value: 2, color: '#F5C26B' },
        { label: 'Customer', value: 5, color: '#00BDA5' },
        { label: 'Evangelist', value: 2, color: '#6A78D1' },
      ]}
      centerValue="14"
      centerLabel="contacts"
      size={96}
    />
  ),

  // ---- Automation Health ----
  active_workflows: <StatBlock value="5" foot="Currently live" />,
  workflow_enrollment: (
    <LineChart
      series={[{ name: 'Enrolled', color: '#6A78D1', points: [22, 31, 38, 47, 55, 64] }]}
      labels={MONTHS}
      height={120}
    />
  ),
  emails_via_automation: (
    <BarChart
      data={MONTHS.map((m, i) => ({ label: m, value: [124, 162, 198, 241, 276, 308][i] }))}
      color="#00BDA5"
      height={120}
    />
  ),
  tasks_by_automation: <StatBlock value="87" delta="+22%" deltaGood foot="Auto-created this month" />,
}

// Custom widgets (label only) get a generic BarChart with values derived from
// the label's char codes, so two different customs render different bars.
function customBody(label) {
  const seed = (label || 'Custom').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)
  const data = MONTHS.map((m, i) => ({
    label: m,
    value: 30 + ((seed * (i + 3)) % 70),
  }))
  return <BarChart data={data} color="#0091AE" height={120} />
}

function WidgetBody({ id, label }) {
  if (WIDGET_DATA[id]) return WIDGET_DATA[id]
  return customBody(label)
}

function WidgetCard({ id, label }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border p-3">
      <p className="text-[12px] font-preview font-semibold text-hs-navy mb-0.5 leading-tight">
        {label}
      </p>
      <p className="text-[9px] font-preview uppercase tracking-wide text-hs-text-light mb-1.5">
        Last 6 months
      </p>
      <WidgetBody id={id} label={label} />
    </div>
  )
}

const ALL_FILTER = 'All'
const AUTOMATION_FILTER = 'Automation Health'

export default function PreviewDashboard() {
  const dashboards = useStore((s) => s.session.dashboards)
  const hasWorkflows = useStore((s) => s.session.workflows.length > 0)
  const enabled = dashboards.widgets || []
  const customWidgets = dashboards.customWidgets || []

  const [filter, setFilter] = useState(ALL_FILTER)

  // Enabled standard widgets, grouped by their category.
  const enabledByCategory = WIDGET_CATEGORIES.map((c) => ({
    category: c.category,
    widgets: c.widgets.filter((w) => enabled.includes(w.id)),
  }))
  const allStandard = enabledByCategory.flatMap((c) => c.widgets)

  const automationOn = hasWorkflows
    ? AUTOMATION_HEALTH_WIDGETS.filter((w) => enabled.includes(w.id))
    : []

  const totalCards = allStandard.length + automationOn.length + customWidgets.length

  // Build chip list: All, each category, then Automation Health (only if workflows).
  const chips = [
    ALL_FILTER,
    ...WIDGET_CATEGORIES.map((c) => c.category),
    ...(hasWorkflows ? [AUTOMATION_FILTER] : []),
  ]
  // If the active filter is gated off (workflows removed), fall back to All.
  const activeFilter = chips.includes(filter) ? filter : ALL_FILTER

  // Resolve which standard cards show under the current filter.
  const showAll = activeFilter === ALL_FILTER
  const standardToShow = showAll
    ? allStandard
    : enabledByCategory.find((c) => c.category === activeFilter)?.widgets || []
  // Custom widgets have no category — show them only under "All".
  const customToShow = showAll ? customWidgets : []
  const automationToShow =
    showAll || activeFilter === AUTOMATION_FILTER ? automationOn : []

  return (
    <div className="p-5">
      <div className="bg-white rounded-t-lg border border-hs-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-preview font-semibold text-hs-navy text-lg">{dashboards.name}</h2>
        <span className="text-[12px] font-preview text-hs-text-light">{totalCards} widgets</span>
      </div>

      <div className="border-x border-b border-hs-border rounded-b-lg bg-hs-canvas p-3">
        {totalCards === 0 ? (
          <p className="text-center text-[13px] font-preview text-hs-text-light py-8">
            Toggle widgets on the left to build your dashboard.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {chips.map((chip) => {
                const active = chip === activeFilter
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFilter(chip)}
                    className={`text-[11px] font-preview rounded-full px-2.5 py-1 border transition-colors ${
                      active
                        ? 'bg-hs-navy text-white border-hs-navy'
                        : 'bg-white text-hs-text-dark border-hs-border hover:border-hs-navy'
                    }`}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>

            {standardToShow.length === 0 &&
            customToShow.length === 0 &&
            automationToShow.length === 0 ? (
              <p className="text-center text-[12px] font-preview text-hs-text-light py-6">
                No enabled widgets in this category.
              </p>
            ) : (
              <>
                {(standardToShow.length > 0 || customToShow.length > 0) && (
                  <div className="grid grid-cols-2 gap-2">
                    {standardToShow.map((w) => (
                      <WidgetCard key={w.id} id={w.id} label={WIDGET_LABELS[w.id]} />
                    ))}
                    {customToShow.map((w) => (
                      <WidgetCard key={w.id} id={w.id} label={w.label} />
                    ))}
                  </div>
                )}

                {automationToShow.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
                      ⚡ Automation Health
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {automationToShow.map((w) => (
                        <WidgetCard key={w.id} id={w.id} label={WIDGET_LABELS[w.id]} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
