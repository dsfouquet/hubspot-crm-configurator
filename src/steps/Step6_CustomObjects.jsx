import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'

const FIELD_TYPES = ['Text', 'Number', 'Date', 'Dropdown', 'Checkbox', 'Multi-select']
const ASSOCIATABLE = ['Contacts', 'Companies', 'Deals', 'Tickets']

function CustomObjectCard({ obj, index }) {
  const updateCustomObject = useStore((s) => s.updateCustomObject)
  const removeCustomObject = useStore((s) => s.removeCustomObject)
  const [open, setOpen] = useState(!obj.singular)
  const [propName, setPropName] = useState('')
  const [propType, setPropType] = useState('Text')

  const addProp = () => {
    if (!propName.trim()) return
    updateCustomObject(obj.id, {
      properties: [
        ...obj.properties,
        { key: `p_${Date.now()}`, label: propName.trim(), type: propType },
      ],
    })
    setPropName('')
    setPropType('Text')
  }

  const removeProp = (key) =>
    updateCustomObject(obj.id, { properties: obj.properties.filter((p) => p.key !== key) })

  const toggleAssoc = (a) => {
    const has = obj.associations.includes(a)
    updateCustomObject(obj.id, {
      associations: has ? obj.associations.filter((x) => x !== a) : [...obj.associations, a],
    })
  }

  return (
    <div className="rounded-lg border border-hs-border bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-hs-canvas border-b border-hs-border">
        <button onClick={() => setOpen((o) => !o)} className="text-hs-text-light text-xs">
          {open ? '▼' : '▶'}
        </button>
        <span className="text-[13px]">🧩</span>
        <span className="flex-1 font-ui font-semibold text-hs-navy text-[14px]">
          {obj.plural || obj.singular || `Custom Object ${index + 1}`}
        </span>
        <span className="text-[11px] font-ui text-white bg-hs-orange px-1.5 py-0.5 rounded">
          Pro
        </span>
        <button
          onClick={() => removeCustomObject(obj.id)}
          className="text-hs-text-light hover:text-hs-red text-sm"
          title="Remove object"
        >
          ×
        </button>
      </div>

      {open && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
                Name (singular)
              </label>
              <input
                value={obj.singular}
                onChange={(e) => updateCustomObject(obj.id, { singular: e.target.value })}
                placeholder="Equipment"
                className="w-full rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
              />
            </div>
            <div>
              <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
                Name (plural)
              </label>
              <input
                value={obj.plural}
                onChange={(e) => updateCustomObject(obj.id, { plural: e.target.value })}
                placeholder="Equipment"
                className="w-full rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
              Description
            </label>
            <input
              value={obj.description}
              onChange={(e) => updateCustomObject(obj.id, { description: e.target.value })}
              placeholder="What does this object track?"
              className="w-full rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
            />
          </div>

          {/* Properties */}
          <div>
            <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
              Properties
            </label>
            {obj.properties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {obj.properties.map((p) => (
                  <span
                    key={p.key}
                    className="inline-flex items-center gap-1 text-[12px] font-ui bg-hs-canvas border border-hs-border rounded px-2 py-1"
                  >
                    {p.label}
                    <span className="text-hs-text-light">· {p.type}</span>
                    <button
                      onClick={() => removeProp(p.key)}
                      className="text-hs-text-light hover:text-hs-red"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                value={propName}
                onChange={(e) => setPropName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addProp()}
                placeholder="Property name"
                className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
              />
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={addProp}
                className="text-[13px] font-ui font-semibold text-hs-blue hover:underline"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Associations */}
          <div>
            <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
              Associations (links to)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ASSOCIATABLE.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAssoc(a)}
                  className={`text-[13px] font-ui px-2.5 py-1 rounded-full border ${
                    obj.associations.includes(a)
                      ? 'border-hs-blue/40 bg-hs-blue/10 text-hs-text-dark'
                      : 'border-hs-border bg-white text-hs-text-light hover:border-hs-text-light'
                  }`}
                >
                  {obj.associations.includes(a) ? '✓ ' : '+ '}
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Step6_CustomObjects({ index }) {
  const customObjects = useStore((s) => s.session.customObjects)
  const addCustomObject = useStore((s) => s.addCustomObject)

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Custom objects let you track things HubSpot doesn't have out of the box — equipment, job sites, projects, locations, etc."
      />

      <div className="mb-3 rounded-md bg-hs-orange/10 border border-hs-orange/30 px-3 py-2 text-[13px] font-ui text-hs-text-dark">
        ⚡ Custom objects require HubSpot <strong>Professional</strong>. Adding one updates your
        tier indicator automatically.
      </div>

      <div className="space-y-3">
        {customObjects.map((obj, i) => (
          <CustomObjectCard key={obj.id} obj={obj} index={i} />
        ))}
      </div>

      {customObjects.length < 5 ? (
        <button
          onClick={addCustomObject}
          className="mt-3 w-full rounded-lg border-2 border-dashed border-hs-border text-hs-blue font-ui font-medium py-3 hover:border-hs-blue hover:bg-hs-blue/5"
        >
          + Add Custom Object ({customObjects.length}/5)
        </button>
      ) : (
        <p className="mt-3 text-[13px] font-ui text-hs-text-light text-center">
          Maximum of 5 custom objects reached.
        </p>
      )}
    </StepBody>
  )
}
