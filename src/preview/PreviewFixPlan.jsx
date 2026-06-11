import { useStore } from '../store/useStore'
import { activeViews } from '../utils/recommendations'
import { WIDGET_LABELS } from '../constants/defaultWidgets'
import WorkflowDiagram from './WorkflowDiagram'
import { ReportCard, BarChart, LineChart, HBarChart, DonutChart } from './charts'
import {
  REVENUE_TREND,
  MONTHS,
  REP_PERFORMANCE,
  LEAD_SOURCES,
  AR_AGING,
} from './demoData'

// Pick a realistic chart for a widget id (used when a fix has no workflow diagram).
function WidgetChart({ id }) {
  const label = WIDGET_LABELS[id] || id
  if (/revenue|won|closed|forecast|weighted/i.test(label)) {
    return (
      <ReportCard title={label} subtitle="LAST 6 MONTHS">
        <LineChart
          series={[{ name: 'Revenue', color: '#FF7A59', points: REVENUE_TREND }]}
          labels={MONTHS}
          money
        />
      </ReportCard>
    )
  }
  if (/rep|leaderboard/i.test(label)) {
    return (
      <ReportCard title={label} subtitle="THIS QUARTER">
        <HBarChart data={REP_PERFORMANCE} money />
      </ReportCard>
    )
  }
  if (/source|lifecycle|attribution/i.test(label)) {
    return (
      <ReportCard title={label} subtitle="LAST 6 MONTHS">
        <DonutChart data={LEAD_SOURCES} centerValue="103" centerLabel="leads" />
      </ReportCard>
    )
  }
  if (/ticket|resolution/i.test(label)) {
    return (
      <ReportCard title={label} subtitle="OPEN BY AGE">
        <HBarChart data={AR_AGING.slice(0, 4)} color="#F2545B" />
      </ReportCard>
    )
  }
  return (
    <ReportCard title={label} subtitle="LAST 6 MONTHS">
      <BarChart
        data={MONTHS.map((m, i) => ({ label: m, value: [42, 51, 47, 63, 58, 71][i] }))}
        color="#0091AE"
      />
    </ReportCard>
  )
}

// Step 2 preview: the focused problem's fix, shown live — workflow diagram if it
// has one, plus the views and widgets it installed.
export default function PreviewFixPlan() {
  const session = useStore((s) => s.session)
  const focusedProblemId = useStore((s) => s.focusedProblemId)

  const fixPlan = session.fixPlan
  if (!fixPlan || fixPlan.problems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="mx-auto w-12 h-12 rounded-lg bg-white border border-hs-border flex items-center justify-center text-xl shadow-sm">
            🩺
          </div>
          <h3 className="mt-4 font-preview font-semibold text-hs-navy">
            Your fix plan renders here
          </h3>
          <p className="mt-2 text-sm text-hs-text-light font-preview">
            Complete discovery and each problem you name becomes a built solution you can see.
          </p>
        </div>
      </div>
    )
  }

  const problem =
    fixPlan.problems.find((p) => p.id === focusedProblemId) || fixPlan.problems[0]

  // The workflows this problem installed (match by templateId).
  const installedWorkflows = session.workflows.filter((w) =>
    problem.workflows.includes(w.templateId)
  )
  const views = activeViews(session).filter((v) => problem.viewIds.includes(v.id))
  const widgets = problem.widgets.map((id) => WIDGET_LABELS[id] || id)

  return (
    <div className="h-full flex flex-col">
      {/* Problem header */}
      <div className="shrink-0 px-5 py-3.5 bg-white border-b border-hs-border">
        <div className="text-[11px] font-preview text-hs-text-light">
          You said: “{problem.saidLabel}”
        </div>
        <h2 className="font-preview font-semibold text-hs-navy text-lg leading-tight">
          {problem.title}
        </h2>
        <p className="text-[13px] font-preview text-hs-text-dark mt-0.5">{problem.narrative}</p>
      </div>

      {/* What got installed */}
      <div className="shrink-0 px-5 py-2.5 bg-hs-canvas border-b border-hs-border flex flex-wrap gap-1.5">
        {installedWorkflows.map((w) => (
          <span
            key={w.id}
            className="text-[11px] font-preview bg-hs-orange/10 text-hs-orange rounded px-2 py-0.5"
          >
            ⚡ {w.name}
          </span>
        ))}
        {views.map((v) => (
          <span
            key={v.id}
            className="text-[11px] font-preview bg-hs-blue/10 text-hs-blue rounded px-2 py-0.5"
          >
            ★ {v.name}
          </span>
        ))}
        {widgets.map((w) => (
          <span
            key={w}
            className="text-[11px] font-preview bg-hs-green/10 text-hs-green rounded px-2 py-0.5"
          >
            📊 {w}
          </span>
        ))}
      </div>

      {/* Visual: workflow diagram when available, otherwise widget mock */}
      <div className="flex-1 min-h-0">
        {installedWorkflows.length > 0 ? (
          <WorkflowDiagram workflow={installedWorkflows[0]} />
        ) : (
          <div className="h-full overflow-y-auto hs-scroll p-5">
            {problem.widgets.length > 0 ? (
              <div className="max-w-lg mx-auto space-y-3">
                {problem.widgets.map((id) => (
                  <WidgetChart key={id} id={id} />
                ))}
                <p className="text-center text-[11px] font-preview text-hs-text-light">
                  Sample data — your real numbers populate these automatically.
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-[13px] font-preview text-hs-text-light max-w-xs">
                  This fix lives in your views and integrations — see it in the full HubSpot
                  demo on the final step.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
