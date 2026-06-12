import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import TierBadge from '../shared/TierBadge'
import WorkflowCard from '../shared/WorkflowCard'
import {
  WORKFLOW_TEMPLATES,
  WORKFLOW_CATEGORIES,
  instantiateTemplate,
} from '../constants/workflowTemplates'
import { fallbackWorkflow } from '../utils/workflowGenerator'

function TemplateRow({ template }) {
  const addWorkflow = useStore((s) => s.addWorkflow)
  const added = useStore((s) => s.session.workflows.some((w) => w.templateId === template.id))

  return (
    <div
      title={template.description}
      className="border border-hs-border rounded-md px-3 py-2 bg-white"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="font-ui font-semibold text-hs-navy text-[13px] leading-tight truncate">
            {template.name}
          </h4>
          <TierBadge tier={template.tier} />
        </div>
        <button
          onClick={() => addWorkflow(instantiateTemplate(template))}
          disabled={added}
          className={`shrink-0 text-[12px] font-ui font-semibold ${
            added
              ? 'text-hs-green cursor-default'
              : 'text-hs-orange hover:text-hs-orange/80 px-2 py-0.5 rounded border border-hs-orange/40'
          }`}
        >
          {added ? '✓ Added' : '+ Add'}
        </button>
      </div>
      <p className="mt-1 text-[11px] font-ui text-hs-text-light">
        <span className="text-hs-orange">⚡</span> {template.triggerSummary}
      </p>
    </div>
  )
}

function CategoryAccordion({ cat, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const templates = WORKFLOW_TEMPLATES.filter((t) => t.category === cat)
  const addedIds = useStore((s) => s.session.workflows.map((w) => w.templateId))
  const addedCount = templates.filter((t) => addedIds.includes(t.id)).length

  return (
    <div className="mb-2 border border-hs-border rounded-md overflow-hidden bg-hs-canvas">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left bg-white hover:bg-hs-canvas"
      >
        <span className="text-[13px] font-ui font-semibold text-hs-navy">
          {cat}
          <span className="ml-2 text-[11px] font-normal text-hs-text-light">
            {templates.length} template{templates.length === 1 ? '' : 's'}
            {addedCount > 0 ? ` · ${addedCount} added` : ''}
          </span>
        </span>
        <span
          className={`text-hs-text-light text-[12px] transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="p-2 space-y-1.5">
          {templates.map((t) => (
            <TemplateRow key={t.id} template={t} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Step7_Workflows({ index }) {
  const workflows = useStore((s) => s.session.workflows)
  const addWorkflow = useStore((s) => s.addWorkflow)
  const [desc, setDesc] = useState('')

  const addDraft = () => {
    if (!desc.trim()) return
    addWorkflow(fallbackWorkflow(desc.trim()))
    setDesc('')
  }

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Pick the automations that matter most to your team. We'll show you exactly what they look like."
      />

      {/* Configured workflows */}
      {workflows.length > 0 && (
        <section className="mb-6">
          <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">
            Your Automations ({workflows.length})
          </h3>
          <div className="space-y-2">
            {workflows.map((w) => (
              <WorkflowCard key={w.id} workflow={w} />
            ))}
          </div>
        </section>
      )}

      {/* Template library */}
      <section className="mb-6">
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">Template Library</h3>
        {WORKFLOW_CATEGORIES.map((cat, i) => (
          <CategoryAccordion key={cat} cat={cat} defaultOpen={i === 0} />
        ))}
      </section>

      {/* Custom draft builder */}
      <section>
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">
          Need something not in the library?
        </h3>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder='e.g. "When a deal is marked Closed Won, send a thank you email and create a 30-day check-in task"'
          className="hs-input w-full h-20 p-2.5 text-[13px] font-ui resize-none"
        />
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={addDraft}
            disabled={!desc.trim()}
            className="text-[13px] font-ui font-semibold text-white bg-hs-blue hover:bg-hs-blue/90 px-4 py-1.5 rounded-[3px] disabled:opacity-40"
          >
            + Add as a draft
          </button>
          <span className="text-[12px] font-ui text-hs-text-light">
            We scope custom automations together during your build.
          </span>
        </div>
      </section>
    </StepBody>
  )
}
