import { useStore } from '../store/useStore'
import { activeViews } from '../utils/recommendations'
import { WIDGET_LABELS } from '../constants/defaultWidgets'
import WorkflowDiagram from './WorkflowDiagram'

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
          <div className="h-full flex items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-2">
              {widgets.length > 0 ? (
                widgets.map((w) => (
                  <div key={w} className="bg-white rounded-lg border border-hs-border p-3">
                    <p className="text-[12px] font-preview font-medium text-hs-text-dark mb-2">
                      {w}
                    </p>
                    <div className="flex items-end gap-1 h-9">
                      {[5, 9, 6, 11, 8, 12].map((h, i) => (
                        <div
                          key={i}
                          className="w-3 rounded-t bg-hs-blue/60"
                          style={{ height: h * 3 }}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[13px] font-preview text-hs-text-light">
                  This fix lives in your views and integrations — see the full preview in the
                  final step.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
