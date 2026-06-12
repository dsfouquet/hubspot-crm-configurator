import { useState } from 'react'
import { useStore } from '../store/useStore'
import { activeViews } from '../utils/recommendations'
import { WIDGET_LABELS } from '../constants/defaultWidgets'
import { scopeOffers, OFFERS } from '../utils/offerScoper'
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
                className={`text-[10px] font-preview rounded-full px-2 py-0.5 ${
                  rec ? 'text-white font-semibold' : ''
                }`}
                style={{
                  backgroundColor: rec ? offer.color : `${offer.color}18`,
                  color: rec ? '#fff' : offer.color,
                }}
              >
                {offer.name} · {items.length}
                {rec ? ' ★' : ''}
              </span>
            ) : null
          )}
          {scope.hubsFiring.length >= 2 && (
            <span className="text-[10px] font-preview text-hs-text-light">
              spans {scope.hubsFiring.length} hubs
            </span>
          )}
        </span>
        <span
          className={`text-hs-text-light text-[12px] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-3 grid grid-cols-1 gap-2 max-h-72 overflow-y-auto hs-scroll">
          {blocks.map(
            ({ offer, items, rec }) =>
              items.length > 0 && (
                <div
                  key={offer.key}
                  className="rounded-md border overflow-hidden"
                  style={{ borderColor: rec ? offer.color : '#CBD6E2' }}
                >
                  <div className="px-3 py-1.5" style={{ backgroundColor: `${offer.color}12` }}>
                    <span className="text-[12px] font-preview font-bold" style={{ color: offer.color }}>
                      {offer.name}
                    </span>
                    {rec && (
                      <span className="ml-2 text-[9px] font-preview font-bold uppercase text-white bg-hs-orange rounded px-1.5 py-0.5">
                        Your starting point
                      </span>
                    )}
                  </div>
                  <ul className="px-3 py-1.5 space-y-0.5">
                    {items.map((item, i) => (
                      <li key={i} className="text-[11px] font-preview text-hs-text-dark flex gap-1.5">
                        <span style={{ color: offer.color }} className="shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
          {globalBuild.length > 0 && (
            <div className="rounded-md border border-hs-border overflow-hidden">
              <div className="px-3 py-1.5 bg-hs-canvas">
                <span className="text-[12px] font-preview font-bold text-hs-navy">
                  Plus, across your whole setup
                </span>
              </div>
              <ul className="px-3 py-1.5 space-y-0.5">
                {globalBuild.map((item, i) => (
                  <li key={i} className="text-[11px] font-preview text-hs-text-dark flex gap-1.5">
                    <span className="text-hs-green shrink-0">✓</span>
                    {item}
                  </li>
                ))}
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
              <span className="text-[10px] font-preview font-medium text-hs-blue border border-hs-blue/30 rounded px-1.5 py-0.5 shrink-0">
                {problem.hub}
              </span>
            )}
          </div>
          <h2 className="font-preview font-semibold text-hs-navy text-xl leading-tight mt-0.5">
            {problem.title}
            {problem.isTop && (
              <span className="ml-2 align-middle text-[9px] font-bold uppercase tracking-wide text-white bg-hs-red rounded px-1.5 py-0.5">
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
              <span key={w.id} className="text-[11px] font-preview bg-hs-orange/10 text-hs-orange rounded px-2 py-0.5">
                ⚡ {w.name}
              </span>
            ))}
            {views.map((v) => (
              <span key={v.id} className="text-[11px] font-preview bg-hs-blue/10 text-hs-blue rounded px-2 py-0.5">
                ★ {v.name}
              </span>
            ))}
            {widgets.map((w) => (
              <span key={w} className="text-[11px] font-preview bg-hs-green/10 text-hs-green rounded px-2 py-0.5">
                📊 {w}
              </span>
            ))}
          </div>

          {/* Crescent Connect builds */}
          <div className="mt-3 rounded-md bg-hs-navy px-3 py-2.5">
            <div className="text-[10px] font-preview font-semibold uppercase tracking-wide text-white/60 mb-1">
              🔧 What Crescent Connect builds for you
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
