import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import TierBadge from '../shared/TierBadge'
import { recommendViews } from '../utils/recommendations'

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
  const toggleRecommendedView = useStore((s) => s.toggleRecommendedView)
  const addCustomView = useStore((s) => s.addCustomView)
  const removeCustomView = useStore((s) => s.removeCustomView)

  const recommendations = recommendViews(session)

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
