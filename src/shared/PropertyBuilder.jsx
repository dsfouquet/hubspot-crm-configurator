import { useState } from 'react'
import { useStore } from '../store/useStore'
import { blankProperty } from '../constants/defaultProperties'

const FIELD_TYPES = ['Text', 'Number', 'Date', 'Dropdown', 'Checkbox', 'Multi-select']

// Property list for a record slice: locked + optional checkboxes + add-custom.
export default function PropertyBuilder({ slice }) {
  const properties = useStore((s) => s.session[slice].properties)
  const toggleProperty = useStore((s) => s.toggleProperty)
  const addProperty = useStore((s) => s.addProperty)
  const removeProperty = useStore((s) => s.removeProperty)

  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('Text')

  const commitAdd = () => {
    if (!name.trim()) return
    addProperty(slice, blankProperty(name.trim(), type))
    setName('')
    setType('Text')
    setAdding(false)
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5">
        {properties.map((p) => (
          <label
            key={p.key}
            className={`group flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[13px] font-ui cursor-pointer ${
              p.enabled
                ? 'border-hs-blue/40 bg-hs-blue/5'
                : 'border-hs-border bg-white hover:border-hs-text-light'
            } ${p.locked ? 'opacity-100' : ''}`}
          >
            <input
              type="checkbox"
              checked={p.enabled}
              disabled={p.locked}
              onChange={() => toggleProperty(slice, p.key)}
              className="accent-hs-orange"
            />
            <span className="flex-1 text-hs-text-dark truncate">{p.label}</span>
            {p.locked && (
              <span className="text-[10px] text-hs-text-light uppercase tracking-wide">
                req
              </span>
            )}
            <span className="text-[10px] text-hs-text-light">{p.type}</span>
            {p.custom && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  removeProperty(slice, p.key)
                }}
                className="text-hs-text-light hover:text-hs-red opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                ×
              </button>
            )}
          </label>
        ))}
      </div>

      {adding ? (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-hs-border p-2 bg-hs-canvas">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commitAdd()}
            placeholder="Property name"
            className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={commitAdd}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-3 py-1 rounded"
          >
            Add
          </button>
          <button
            onClick={() => setAdding(false)}
            className="text-[13px] font-ui text-hs-text-light px-1"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 text-[13px] font-ui font-medium text-hs-blue hover:underline"
        >
          + Add custom property
        </button>
      )}
    </div>
  )
}
