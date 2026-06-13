import { useStore } from '../store/useStore'
import WorkflowDiagram from './LazyWorkflowDiagram'
import TierBadge from '../shared/TierBadge'
import { IconBolt } from './uiIcons'

// Step 7 preview: a chip selector + the focused workflow's live ReactFlow diagram.
export default function PreviewAutomations() {
  const workflows = useStore((s) => s.session.workflows)
  const focusedWorkflowId = useStore((s) => s.focusedWorkflowId)
  const setFocusedWorkflow = useStore((s) => s.setFocusedWorkflow)

  if (workflows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="hs-empty-state font-preview max-w-sm">
          <div className="w-12 h-12 rounded-lg bg-white border border-hs-border flex items-center justify-center text-hs-marigold shadow-sm mb-1">
            <IconBolt width={22} height={22} />
          </div>
          <h3 className="font-semibold text-hs-navy text-[15px]">No automations yet</h3>
          <p className="text-sm text-hs-text-light">
            Add a template or describe one in plain English. Its flowchart renders here in real
            time.
          </p>
        </div>
      </div>
    )
  }

  const focused = workflows.find((w) => w.id === focusedWorkflowId) || workflows[0]

  return (
    <div className="h-full flex flex-col">
      {/* Workflow selector chips */}
      <div className="shrink-0 px-4 py-3 border-b border-hs-border bg-white">
        <div className="flex flex-wrap gap-1.5">
          {workflows.map((w) => {
            const active = w.id === focused.id
            return (
              <button
                key={w.id}
                onClick={() => setFocusedWorkflow(w.id)}
                className={`text-[12px] font-preview px-2.5 py-1 rounded-[3px] border ${
                  active
                    ? 'border-hs-orange bg-hs-orange/10 text-hs-navy font-medium'
                    : 'border-hs-border text-hs-text-light hover:border-hs-text-light'
                }`}
              >
                {w.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Focused workflow header */}
      <div className="shrink-0 px-4 py-2.5 bg-hs-canvas border-b border-hs-border flex items-center justify-between">
        <div>
          <h3 className="font-preview font-semibold text-hs-navy text-[15px]">{focused.name}</h3>
          <p className="text-[12px] font-preview text-hs-text-light flex items-center gap-1">
            <IconBolt width={11} height={11} className="text-hs-marigold shrink-0" />
            {focused.triggerSummary}
          </p>
        </div>
        <TierBadge tier={focused.tier} size="md" />
      </div>

      {/* Diagram */}
      <div className="flex-1 min-h-0">
        <WorkflowDiagram workflow={focused} />
      </div>
    </div>
  )
}
