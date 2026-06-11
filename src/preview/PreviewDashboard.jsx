import { useStore } from '../store/useStore'
import {
  WIDGET_CATEGORIES,
  AUTOMATION_HEALTH_WIDGETS,
  WIDGET_LABELS,
} from '../constants/defaultWidgets'
import { BarChart, LineChart, HBarChart, DonutChart } from './charts'
import { REVENUE_TREND, MONTHS, REP_PERFORMANCE, LEAD_SOURCES, AR_AGING } from './demoData'

// Real-feeling chart per widget, picked by what the label describes.
function WidgetBody({ label }) {
  if (/revenue|won|closed|forecast|weighted/i.test(label)) {
    return (
      <LineChart
        series={[{ name: 'Revenue', color: '#FF7A59', points: REVENUE_TREND }]}
        labels={MONTHS}
        money
        height={120}
      />
    )
  }
  if (/rep|leaderboard/i.test(label)) return <HBarChart data={REP_PERFORMANCE} money />
  if (/source|lifecycle|attribution/i.test(label))
    return <DonutChart data={LEAD_SOURCES} centerValue="103" centerLabel="leads" size={90} />
  if (/ticket|resolution/i.test(label))
    return <HBarChart data={AR_AGING.slice(0, 4)} color="#F2545B" />
  return (
    <BarChart
      data={MONTHS.map((m, i) => ({ label: m, value: [42, 51, 47, 63, 58, 71][i] }))}
      color="#0091AE"
      height={120}
    />
  )
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
      <WidgetBody label={label} />
    </div>
  )
}

export default function PreviewDashboard() {
  const dashboards = useStore((s) => s.session.dashboards)
  const hasWorkflows = useStore((s) => s.session.workflows.length > 0)
  const enabled = dashboards.widgets || []
  const customWidgets = dashboards.customWidgets || []

  const allStandard = WIDGET_CATEGORIES.flatMap((c) => c.widgets).filter((w) =>
    enabled.includes(w.id)
  )
  const automationOn = hasWorkflows
    ? AUTOMATION_HEALTH_WIDGETS.filter((w) => enabled.includes(w.id))
    : []

  const totalCards = allStandard.length + automationOn.length + customWidgets.length

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
            <div className="grid grid-cols-2 gap-2">
              {allStandard.map((w) => (
                <WidgetCard key={w.id} id={w.id} label={WIDGET_LABELS[w.id]} />
              ))}
              {customWidgets.map((w) => (
                <WidgetCard key={w.id} id={w.id} label={w.label} />
              ))}
            </div>

            {automationOn.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
                  ⚡ Automation Health
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {automationOn.map((w) => (
                    <WidgetCard key={w.id} id={w.id} label={WIDGET_LABELS[w.id]} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
