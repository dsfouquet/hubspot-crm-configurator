import { useState } from 'react'
import { useStore } from '../store/useStore'

// Pipeline stage list: rename inline, reorder, set probability %, add/remove.
// showProbability=false for Tickets (no win-probability concept).
export default function PipelineConfigurator({ slice, showProbability = true }) {
  const stages = useStore((s) => s.session[slice].pipelineStages)
  const renameStage = useStore((s) => s.renameStage)
  const setStageProbability = useStore((s) => s.setStageProbability)
  const removeStage = useStore((s) => s.removeStage)
  const moveStage = useStore((s) => s.moveStage)
  const addStage = useStore((s) => s.addStage)

  const [newLabel, setNewLabel] = useState('')

  const commitAdd = () => {
    if (!newLabel.trim()) return
    addStage(slice, newLabel.trim())
    setNewLabel('')
  }

  return (
    <div>
      <ul className="space-y-1.5">
        {stages.map((st, i) => (
          <li
            key={st.key}
            className="flex items-center gap-2 rounded-md border border-hs-border bg-white px-2 py-1.5"
          >
            <span className="text-[11px] font-semibold text-hs-text-light w-5 text-center">
              {i + 1}
            </span>
            <div className="flex flex-col -my-1">
              <button
                onClick={() => moveStage(slice, st.key, -1)}
                disabled={i === 0}
                className="text-[10px] text-hs-text-light hover:text-hs-navy disabled:opacity-30 leading-none"
              >
                ▲
              </button>
              <button
                onClick={() => moveStage(slice, st.key, 1)}
                disabled={i === stages.length - 1}
                className="text-[10px] text-hs-text-light hover:text-hs-navy disabled:opacity-30 leading-none"
              >
                ▼
              </button>
            </div>
            <input
              value={st.label}
              onChange={(e) => renameStage(slice, st.key, e.target.value)}
              className="flex-1 rounded border border-transparent hover:border-hs-border focus:border-hs-blue px-2 py-1 text-[13px] font-ui focus:outline-none"
            />
            {showProbability && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={st.probability ?? ''}
                  onChange={(e) =>
                    setStageProbability(
                      slice,
                      st.key,
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }
                  className="w-14 rounded border border-hs-border px-1.5 py-1 text-[13px] font-ui text-right focus:outline-none focus:border-hs-blue"
                  placeholder="--"
                />
                <span className="text-[12px] text-hs-text-light">%</span>
              </div>
            )}
            <button
              onClick={() => removeStage(slice, st.key)}
              className="text-hs-text-light hover:text-hs-red text-sm"
              title="Remove stage"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commitAdd()}
          placeholder="New stage name"
          className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
        />
        <button
          onClick={commitAdd}
          className="text-[13px] font-ui font-semibold text-hs-blue hover:underline"
        >
          + Add stage
        </button>
      </div>
    </div>
  )
}
