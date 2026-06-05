import { useStore } from '../store/useStore'
import {
  WIDGET_CATEGORIES,
  AUTOMATION_HEALTH_WIDGETS,
  WIDGET_LABELS,
} from '../constants/defaultWidgets'

// A small placeholder chart glyph that varies by widget id for visual variety.
function MiniChart({ id }) {
  const kind = id.charCodeAt(0) % 3
  if (kind === 0) {
    // bars
    return (
      <div className="flex items-end gap-1 h-10">
        {[6, 10, 7, 12, 9].map((h, i) => (
          <div key={i} className="w-2 rounded-t bg-hs-blue/70" style={{ height: h * 3 }} />
        ))}
      </div>
    )
  }
  if (kind === 1) {
    // donut-ish
    return (
      <div
        className="w-10 h-10 rounded-full"
        style={{ background: 'conic-gradient(#FF7A59 0 60%, #CBD6E2 60% 100%)' }}
      />
    )
  }
  // line
  return (
    <svg viewBox="0 0 60 30" className="w-16 h-10">
      <polyline
        points="0,25 12,18 24,20 36,8 48,12 60,4"
        fill="none"
        stroke="#00BDA5"
        strokeWidth="2"
      />
    </svg>
  )
}

function WidgetCard({ id, label }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border p-3">
      <p className="text-[12px] font-preview font-medium text-hs-text-dark mb-2 leading-tight">
        {label}
      </p>
      <MiniChart id={id} />
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
