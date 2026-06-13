import { useState } from 'react'
import { useStore } from '../store/useStore'
import { activeViews } from '../utils/recommendations'
import { WIDGET_LABELS } from '../constants/defaultWidgets'
import { scopeOffers, OFFERS } from '../utils/offerScoper'
import WorkflowDiagram from './LazyWorkflowDiagram'
import { ReportCard, BarChart, LineChart, HBarChart, DonutChart } from './charts'
import {
  REVENUE_TREND,
  MONTHS,
  REP_PERFORMANCE,
  LEAD_SOURCES,
  AR_AGING,
} from './demoData'
import {
  IconBolt,
  IconStar,
  IconChart,
  IconWrench,
  IconCheck,
  IconChevronDown,
  IconStethoscope,
} from './hubIcons'

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
  if (/meeting/i.test(label)) {
    return (
      <ReportCard title={label} subtitle="LAST 6 MONTHS">
        <LineChart
          series={[{ name: 'Meetings', color: '#00BDA5', points: [18, 24, 21, 29, 34, 42] }]}
          labels={MONTHS}
        />
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

// "How this gets built" — pinned scope strip. Collapsed: three offer chips.
// Expanded: full offer cards + the global build scope.
function ScopeStrip({ session }) {
  const [open, setOpen] = useState(false)
  const scope = scopeOffers(session)
  const globalBuild = session.fixPlan?.globalBuild || []

  const blocks = [
    { offer: OFFERS.free, items: scope.free, rec: scope.recommended === 'free' },
    { offer: OFFERS.machine, items: scope.machine, rec: scope.recommended === 'machine' },
    { offer: OFFERS.retainer, items: scope.retainer, rec: false },
  ]

  return (
    <div className="shrink-0 bg-white border-b border-hs-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-2.5 flex items-center gap-2 text-left"
      >
        <span className="text-[11px] font-preview font-bold uppercase tracking-wide text-hs-navy shrink-0">
          How this gets built
        </span>
        <span className="flex-1 flex items-center gap-1.5 flex-wrap">
          {blocks.map(({ offer, items, rec }) =>
            items.length > 0 ? (
              <span
                key={offer.key}
                className={`text-[10px] font-preview rounded-[3px] px-2 py-0.5 ${
                  rec ? 'font-semibold' : ''
                }`}
                style={{ backgroundColor: `${offer.color}18`, color: offer.color }}
              >
                {offer.name} · {items.length}
              </span>
            ) : null
          )}
          {scope.hubsFiring.length >= 2 && (
            <span className="text-[10px] font-preview text-hs-text-light">
              spans {scope.hubsFiring.length} hubs
            </span>
          )}
        </span>
        <IconChevronDown
          width={14}
          height={14}
          className={`text-hs-text-light shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-3 grid grid-cols-1 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto hs-scroll">
          {blocks.map(
            ({ offer, items, rec }) =>
              items.length > 0 && (
                <div
                  key={offer.key}
                  className="bg-white rounded-[4px] border border-hs-border shadow-sm overflow-hidden"
                  style={{ borderTop: `3px solid ${offer.color}` }}
                >
                  <div className="px-3 pt-2 pb-1 flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-preview font-semibold text-hs-navy">
                      {offer.name}
                    </span>
                    {rec && (
                      <span className="text-[9px] font-preview font-bold uppercase tracking-wide text-white bg-hs-orange rounded-[3px] px-1.5 py-0.5">
                        Your starting point
                      </span>
                    )}
                  </div>
                  <ul className="px-3 pb-2 space-y-1">
                    {items.slice(0, 6).map((item, i) => (
                      <li key={i} className="text-[11px] font-preview text-hs-text-dark flex items-start gap-1.5">
                        <IconCheck
                          width={11}
                          height={11}
                          className="shrink-0 mt-0.5"
                          style={{ color: offer.color }}
                        />
                        {item}
                      </li>
                    ))}
                    {items.length > 6 && (
                      <li className="text-[11px] font-preview text-hs-text-light pl-[17px]">
                        +{items.length - 6} more
                      </li>
                    )}
                  </ul>
                </div>
              )
          )}
          {globalBuild.length > 0 && (
            <div className="md:col-span-3 bg-white rounded-[4px] border border-hs-border shadow-sm overflow-hidden border-t-[3px] border-t-hs-navy">
              <div className="px-3 pt-2 pb-1">
                <span className="text-[12px] font-preview font-semibold text-hs-navy">
                  Plus, across your whole setup
                </span>
              </div>
              <ul className="px-3 pb-2 space-y-1">
                {globalBuild.slice(0, 6).map((item, i) => (
                  <li key={i} className="text-[11px] font-preview text-hs-text-dark flex items-start gap-1.5">
                    <IconCheck width={11} height={11} className="shrink-0 mt-0.5 text-hs-green" />
                    {item}
                  </li>
                ))}
                {globalBuild.length > 6 && (
                  <li className="text-[11px] font-preview text-hs-text-light pl-[17px]">
                    +{globalBuild.length - 6} more
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Step 2 preview: pinned scope at top, then the focused problem's full story.
export default function PreviewFixPlan() {
  const session = useStore((s) => s.session)
  const focusedProblemId = useStore((s) => s.focusedProblemId)

  const fixPlan = session.fixPlan
  if (!fixPlan || fixPlan.problems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="hs-empty-state max-w-sm">
          <div className="w-12 h-12 rounded-[4px] bg-white border border-hs-border flex items-center justify-center shadow-sm text-hs-text-light">
            <IconStethoscope width={20} height={20} />
          </div>
          <h3 className="mt-2 font-preview font-semibold text-hs-navy">
            Your fix plan renders here
          </h3>
          <p className="text-sm text-hs-text-light font-preview">
            Complete discovery and each problem you name becomes a built solution you can see.
          </p>
        </div>
      </div>
    )
  }

  const problem =
    fixPlan.problems.find((p) => p.id === focusedProblemId) || fixPlan.problems[0]

  const installedWorkflows = session.workflows.filter((w) =>
    problem.workflows.includes(w.templateId)
  )
  const views = activeViews(session).filter((v) => problem.viewIds.includes(v.id))
  const widgets = problem.widgets.map((id) => WIDGET_LABELS[id] || id)

  return (
    <div className="h-full flex flex-col">
      <ScopeStrip session={session} />

      <div className="flex-1 min-h-0 overflow-y-auto hs-scroll">
        {/* Problem story */}
        <div className="px-5 py-4 bg-white border-b border-hs-border">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] font-preview text-hs-text-light">
              You said: "{problem.saidLabel}"
            </div>
            {problem.hub && (
              <span className="text-[10px] font-preview font-medium text-hs-blue bg-hs-blue/10 rounded-[3px] px-1.5 py-0.5 shrink-0">
                {problem.hub}
              </span>
            )}
          </div>
          <h2 className="font-preview font-semibold text-hs-navy text-xl leading-tight mt-0.5">
            {problem.title}
            {problem.isTop && (
              <span className="ml-2 align-middle text-[9px] font-bold uppercase tracking-wide text-white bg-hs-red rounded-[3px] px-1.5 py-0.5">
                Costing you the most
              </span>
            )}
          </h2>
          {problem.implication && (
            <p className="text-[13px] font-preview text-hs-red mt-1.5">
              <span className="font-semibold">The real cost:</span> {problem.implication}
            </p>
          )}
          <p className="text-[13px] font-preview text-hs-text-dark mt-1.5">{problem.narrative}</p>

          {/* What gets installed */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {installedWorkflows.map((w) => (
              <span key={w.id} className="inline-flex items-center gap-1 text-[11px] font-preview bg-hs-orange/10 text-hs-orange rounded-[3px] px-2 py-0.5">
                <IconBolt width={11} height={11} className="shrink-0" />
                {w.name}
              </span>
            ))}
            {views.map((v) => (
              <span key={v.id} className="inline-flex items-center gap-1 text-[11px] font-preview bg-hs-blue/10 text-hs-blue rounded-[3px] px-2 py-0.5">
                <IconStar width={11} height={11} className="shrink-0" />
                {v.name}
              </span>
            ))}
            {widgets.map((w) => (
              <span key={w} className="inline-flex items-center gap-1 text-[11px] font-preview bg-hs-green/10 text-hs-green rounded-[3px] px-2 py-0.5">
                <IconChart width={11} height={11} className="shrink-0" />
                {w}
              </span>
            ))}
          </div>

          {/* Crescent Connect builds */}
          <div className="mt-3 rounded-md bg-hs-navy px-3 py-2.5">
            <div className="text-[10px] font-preview font-semibold uppercase tracking-wide text-white/60 mb-1 flex items-center gap-1.5">
              <IconWrench width={11} height={11} className="shrink-0" />
              What Crescent Connect builds for you
            </div>
            <ul className="space-y-0.5">
              {problem.ccBuild.map((item, i) => (
                <li key={i} className="text-[12px] font-preview text-white/90 flex gap-1.5">
                  <span className="text-hs-orange shrink-0">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual: workflow diagram or realistic charts */}
        {installedWorkflows.length > 0 ? (
          <div className="h-80">
            <WorkflowDiagram workflow={installedWorkflows[0]} />
          </div>
        ) : problem.widgets.length > 0 ? (
          <div className="p-5">
            <div className="max-w-lg mx-auto space-y-3">
              {problem.widgets.map((id) => (
                <WidgetChart key={id} id={id} />
              ))}
              <p className="text-center text-[11px] font-preview text-hs-text-light">
                Sample data — your real numbers populate these automatically.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-[13px] font-preview text-hs-text-light p-6">
            This fix lives in your views and integrations — see it in the full HubSpot demo on
            the final step.
          </p>
        )}
      </div>
    </div>
  )
}
