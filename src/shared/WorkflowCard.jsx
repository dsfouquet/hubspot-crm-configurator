import { useState } from 'react'
import { useStore } from '../store/useStore'
import TierBadge from './TierBadge'
import { actionCount } from '../constants/workflowTemplates'

// A configured workflow in the config panel: editable name, trigger, actions, tier,
// plus View Flowchart / Edit / Remove (spec 7.4).
export default function WorkflowCard({ workflow }) {
  const updateWorkflow = useStore((s) => s.updateWorkflow)
  const removeWorkflow = useStore((s) => s.removeWorkflow)
  const setFocusedWorkflow = useStore((s) => s.setFocusedWorkflow)
  const focusedWorkflowId = useStore((s) => s.focusedWorkflowId)
  const [editing, setEditing] = useState(false)

  const isFocused = focusedWorkflowId === workflow.id

  return (
    <div
      className={`rounded-lg border bg-white overflow-hidden ${
        isFocused ? 'border-hs-orange' : 'border-hs-border'
      }`}
    >
      <div className="px-3 py-2.5">
        <div className="flex items-start gap-2">
          {editing ? (
            <input
              autoFocus
              value={workflow.name}
              onChange={(e) => updateWorkflow(workflow.id, { name: e.target.value })}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              className="flex-1 rounded border border-hs-blue px-2 py-1 text-[14px] font-ui font-semibold focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 text-left font-ui font-semibold text-hs-navy text-[14px] hover:text-hs-blue"
              title="Click to rename"
            >
              {workflow.name}
            </button>
          )}
          <TierBadge tier={workflow.tier} />
          <button
            onClick={() => removeWorkflow(workflow.id)}
            className="text-hs-text-light hover:text-hs-red text-sm leading-none"
            title="Remove workflow"
          >
            ×
          </button>
        </div>

        <p className="mt-1 text-[12px] font-ui text-hs-text-light">
          ⚡ {workflow.triggerSummary} · {actionCount(workflow)} action
          {actionCount(workflow) === 1 ? '' : 's'}
          {workflow.isFallback && (
            <span className="ml-1 text-hs-orange">· draft (edit me)</span>
          )}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setFocusedWorkflow(workflow.id)}
            className={`text-[12px] font-ui font-medium px-2.5 py-1 rounded border ${
              isFocused
                ? 'border-hs-orange text-hs-orange bg-hs-orange/5'
                : 'border-hs-border text-hs-blue hover:border-hs-blue'
            }`}
          >
            {isFocused ? '● Showing' : 'View Flowchart'}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-[12px] font-ui font-medium text-hs-text-dark px-2.5 py-1 rounded border border-hs-border hover:border-hs-text-light"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  )
}
