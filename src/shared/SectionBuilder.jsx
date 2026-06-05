import { useState } from 'react'
import { useStore } from '../store/useStore'

// Record-page sections: toggle on/off, reorder up/down, add custom, remove custom.
// (Spec calls for draggable; we use up/down controls — same reorder outcome, no DnD dep.)
export default function SectionBuilder({ slice }) {
  const sections = useStore((s) => s.session[slice].sections)
  const toggleSection = useStore((s) => s.toggleSection)
  const addSection = useStore((s) => s.addSection)
  const removeSection = useStore((s) => s.removeSection)
  const moveSection = useStore((s) => s.moveSection)

  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')

  const commitAdd = () => {
    if (!label.trim()) return
    addSection(slice, label.trim())
    setLabel('')
    setAdding(false)
  }

  return (
    <div>
      <ul className="space-y-1">
        {sections.map((sec, i) => (
          <li
            key={sec.key}
            className="flex items-center gap-2 rounded-md border border-hs-border bg-white px-2.5 py-1.5"
          >
            <div className="flex flex-col -my-1">
              <button
                onClick={() => moveSection(slice, sec.key, -1)}
                disabled={i === 0}
                className="text-[10px] text-hs-text-light hover:text-hs-navy disabled:opacity-30 leading-none"
              >
                ▲
              </button>
              <button
                onClick={() => moveSection(slice, sec.key, 1)}
                disabled={i === sections.length - 1}
                className="text-[10px] text-hs-text-light hover:text-hs-navy disabled:opacity-30 leading-none"
              >
                ▼
              </button>
            </div>
            <input
              type="checkbox"
              checked={sec.enabled}
              onChange={() => toggleSection(slice, sec.key)}
              className="accent-hs-orange"
            />
            <span
              className={`flex-1 text-[13px] font-ui ${
                sec.enabled ? 'text-hs-text-dark' : 'text-hs-text-light line-through'
              }`}
            >
              {sec.label}
            </span>
            <button
              onClick={() => removeSection(slice, sec.key)}
              className="text-hs-text-light hover:text-hs-red text-sm"
              title="Remove section"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commitAdd()}
            placeholder="Section name"
            className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
          />
          <button
            onClick={commitAdd}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-3 py-1 rounded"
          >
            Add
          </button>
          <button onClick={() => setAdding(false)} className="text-[13px] text-hs-text-light px-1">
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 text-[13px] font-ui font-medium text-hs-blue hover:underline"
        >
          + Add section
        </button>
      )}
    </div>
  )
}
