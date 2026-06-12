import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import TierBadge from '../shared/TierBadge'
import { recommendViews } from '../utils/recommendations'
import { VIEW_TEMPLATE_GROUPS, ALL_VIEW_TEMPLATES } from '../constants/defaultViews'

// Collapsed-by-default template group with toggleable view rows.
function TemplateGroup({ group, templates, chosen, onToggle }) {
  const [open, setOpen] = useState(false)
  const chosenCount = templates.filter((t) => chosen.includes(t.id)).length
  return (
    <div className="border border-hs-border rounded-md overflow-hidden mb-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-hs-canvas text-left"
      >
        <span className="text-[12.5px] font-ui font-semibold text-hs-navy">
          {group}
          <span className="ml-2 text-[11px] font-normal text-hs-text-light">
            {templates.length} templates{chosenCount > 0 ? ` · ${chosenCount} added` : ''}
          </span>
        </span>
        <span className={`text-hs-text-light text-[12px] transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="p-2 space-y-1 bg-hs-canvas">
          {templates.map((t) => {
            const on = chosen.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => onToggle(t.id)}
                title={t.description}
                className={`w-full flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left ${
                  on ? 'border-hs-orange bg-hs-orange/10' : 'border-hs-border bg-white hover:border-hs-text-light'
                }`}
              >
                <span className="flex-1 text-[12.5px] font-ui text-hs-text-dark">{t.name}</span>
                <span className="text-[10px] font-ui text-hs-text-light border border-hs-border rounded px-1.5 py-0.5">
                  {t.recordType}
                </span>
                <span className={`text-[12px] font-ui font-semibold ${on ? 'text-hs-green' : 'text-hs-orange'}`}>
                  {on ? '✓' : '+'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const RECORD_TYPES = ['Contacts', 'Companies', 'Deals', 'Tickets']

const RecordBadge = ({ type }) => (
  <span className="text-[10px] font-ui font-medium text-hs-text-light border border-hs-border rounded px-1.5 py-0.5">
    {type}
  </span>
)

export default function Step8_Views({ index }) {
  const session = useStore((s) => s.session)
  const off = useStore((s) => s.session.views.off || [])
  const custom = useStore((s) => s.session.views.custom || [])
  const chosenTemplates = useStore((s) => s.session.views.templates || [])
  const toggleRecommendedView = useStore((s) => s.toggleRecommendedView)
  const toggleTemplateView = useStore((s) => s.toggleTemplateView)
  const addCustomView = useStore((s) => s.addCustomView)
  const removeCustomView = useStore((s) => s.removeCustomView)

  const recommendations = recommendViews(session)
  const chosenTemplateViews = ALL_VIEW_TEMPLATES.filter((t) => chosenTemplates.includes(t.id))

  const [name, setName] = useState('')
  const [recordType, setRecordType] = useState('Deals')
  const [description, setDescription] = useState('')

  const commitAdd = () => {
    if (!name.trim()) return
    addCustomView({ name: name.trim(), recordType, description: description.trim() })
    setName('')
    setDescription('')
  }

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Based on your answers, here are the views we recommend. Toggle any off, or add your own."
      />

      {/* Chosen templates surface at the top */}
      {chosenTemplateViews.length > 0 && (
        <section className="mb-5">
          <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">
            Your Views ({chosenTemplateViews.length})
          </h3>
          <div className="space-y-1.5">
            {chosenTemplateViews.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-md border border-hs-orange/40 bg-hs-orange/5 px-3 py-1.5"
              >
                <span className="flex-1 text-[13px] font-ui font-medium text-hs-navy">{t.name}</span>
                <span className="text-[10px] font-ui text-hs-text-light border border-hs-border rounded px-1.5 py-0.5">
                  {t.recordType}
                </span>
                <button
                  onClick={() => toggleTemplateView(t.id)}
                  className="text-hs-text-light hover:text-hs-red text-sm"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">
          Recommended Views ({recommendations.length})
        </h3>
        {recommendations.length === 0 ? (
          <p className="text-[13px] font-ui text-hs-text-light">
            Answer more of the wizard (Step 1) to unlock tailored view recommendations.
          </p>
        ) : (
          <div className="space-y-2">
            {recommendations.map((v) => {
              const on = !off.includes(v.id)
              return (
                <div
                  key={v.id}
                  className={`rounded-lg border p-3 ${
                    on ? 'border-hs-blue/40 bg-hs-blue/5' : 'border-hs-border bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleRecommendedView(v.id)}
                      className={`mt-0.5 w-9 h-5 rounded-full shrink-0 relative transition-colors ${
                        on ? 'bg-hs-orange' : 'bg-hs-border'
                      }`}
                      title={on ? 'Enabled' : 'Disabled'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          on ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-ui font-semibold text-hs-navy text-[13px]">
                          {v.name}
                        </span>
                        <RecordBadge type={v.recordType} />
                        {v.tier && <TierBadge tier={v.tier} />}
                      </div>
                      <p className="text-[12px] font-ui text-hs-text-light">{v.description}</p>
                      <p className="text-[11px] font-ui text-hs-blue mt-0.5">→ {v.reason}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Template library — collapsed groups */}
      <section className="mb-6">
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">Template Library</h3>
        {VIEW_TEMPLATE_GROUPS.map((g) => (
          <TemplateGroup
            key={g.group}
            group={g.group}
            templates={g.templates}
            chosen={chosenTemplates}
            onToggle={toggleTemplateView}
          />
        ))}
      </section>

      {/* Custom views */}
      <section>
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">Custom Views</h3>
        {custom.length > 0 && (
          <div className="space-y-2 mb-2">
            {custom.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-hs-border bg-white p-3 flex items-start gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-ui font-semibold text-hs-navy text-[13px]">{v.name}</span>
                    <RecordBadge type={v.recordType} />
                  </div>
                  {v.description && (
                    <p className="text-[12px] font-ui text-hs-text-light">{v.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeCustomView(v.id)}
                  className="text-hs-text-light hover:text-hs-red text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="rounded-lg border border-hs-border bg-hs-canvas p-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="View name"
              className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
            />
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commitAdd()}
            placeholder="Description (optional)"
            className="w-full rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
          />
          <button
            onClick={commitAdd}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-1.5 rounded"
          >
            + Add custom view
          </button>
        </div>
      </section>
    </StepBody>
  )
}
