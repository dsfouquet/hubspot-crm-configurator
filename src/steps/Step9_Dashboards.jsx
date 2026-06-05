import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import TierBadge from '../shared/TierBadge'
import {
  WIDGET_CATEGORIES,
  AUTOMATION_HEALTH_WIDGETS,
} from '../constants/defaultWidgets'

function WidgetToggle({ widget }) {
  const enabled = useStore((s) => s.session.dashboards.widgets?.includes(widget.id))
  const toggleWidget = useStore((s) => s.toggleWidget)
  return (
    <button
      onClick={() => toggleWidget(widget.id)}
      className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-[13px] font-ui ${
        enabled
          ? 'border-hs-green/40 bg-hs-green/10 text-hs-text-dark'
          : 'border-hs-border bg-white text-hs-text-light hover:border-hs-text-light'
      }`}
    >
      <span
        className={`flex items-center justify-center w-4 h-4 rounded shrink-0 ${
          enabled ? 'bg-hs-green text-white' : 'border border-hs-border'
        }`}
      >
        {enabled && <span className="text-[10px] leading-none">✓</span>}
      </span>
      <span className="flex-1">{widget.label}</span>
      {widget.tier && <TierBadge tier={widget.tier} />}
    </button>
  )
}

export default function Step9_Dashboards({ index }) {
  const name = useStore((s) => s.session.dashboards.name)
  const setDashboardName = useStore((s) => s.setDashboardName)
  const hasWorkflows = useStore((s) => s.session.workflows.length > 0)
  const customWidgets = useStore((s) => s.session.dashboards.customWidgets || [])
  const addCustomWidget = useStore((s) => s.addCustomWidget)
  const removeCustomWidget = useStore((s) => s.removeCustomWidget)

  const [cwName, setCwName] = useState('')
  const [cwDesc, setCwDesc] = useState('')

  const commitCustom = () => {
    if (!cwName.trim()) return
    addCustomWidget({ label: cwName.trim(), description: cwDesc.trim() })
    setCwName('')
    setCwDesc('')
  }

  return (
    <StepBody>
      <StepHeader index={index} intro="Dashboards give your team at-a-glance visibility." />

      {/* Dashboard name */}
      <div className="mb-5">
        <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
          Dashboard name
        </label>
        <input
          value={name}
          onChange={(e) => setDashboardName(e.target.value)}
          className="w-full rounded-md border border-hs-border px-3 py-2 text-[14px] font-ui focus:outline-none focus:border-hs-blue"
        />
      </div>

      {WIDGET_CATEGORIES.map((cat) => (
        <section key={cat.category} className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-ui font-semibold text-hs-navy text-[14px]">{cat.category}</h3>
            {cat.tier && <TierBadge tier={cat.tier} />}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {cat.widgets.map((w) => (
              <WidgetToggle key={w.id} widget={w} />
            ))}
          </div>
        </section>
      ))}

      {/* Automation Health — only if workflows configured */}
      <section className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-ui font-semibold text-hs-navy text-[14px]">Automation Health</h3>
          <span className="text-[11px] font-ui text-hs-text-light">auto-populated</span>
        </div>
        {hasWorkflows ? (
          <div className="grid grid-cols-2 gap-1.5">
            {AUTOMATION_HEALTH_WIDGETS.map((w) => (
              <WidgetToggle key={w.id} widget={w} />
            ))}
          </div>
        ) : (
          <p className="text-[13px] font-ui text-hs-text-light">
            Add automations in Step 7 to unlock automation-health widgets.
          </p>
        )}
      </section>

      {/* Custom widget */}
      <section>
        <h3 className="font-ui font-semibold text-hs-navy text-[14px] mb-2">Custom Widget</h3>
        {customWidgets.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {customWidgets.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-2 rounded-md border border-hs-border bg-white px-2.5 py-1.5"
              >
                <span className="flex-1 text-[13px] font-ui text-hs-text-dark">{w.label}</span>
                <button
                  onClick={() => removeCustomWidget(w.id)}
                  className="text-hs-text-light hover:text-hs-red text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={cwName}
            onChange={(e) => setCwName(e.target.value)}
            placeholder="Widget name"
            className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
          />
          <input
            value={cwDesc}
            onChange={(e) => setCwDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commitCustom()}
            placeholder="Description"
            className="flex-1 rounded border border-hs-border px-2 py-1 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
          />
          <button
            onClick={commitCustom}
            className="text-[13px] font-ui font-semibold text-hs-blue hover:underline whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </section>
    </StepBody>
  )
}
