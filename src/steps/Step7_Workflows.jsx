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
import { generateWorkflowFromText } from '../utils/workflowGenerator'

function TemplateCard({ template }) {
  const addWorkflow = useStore((s) => s.addWorkflow)
  const added = useStore((s) => s.session.workflows.some((w) => w.templateId === template.id))

  return (
    <div className="rounded-lg border border-hs-border bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-ui font-semibold text-hs-navy text-[13px] leading-tight">
          {template.name}
        </h4>
        <TierBadge tier={template.tier} />
      </div>
      <p className="mt-1 text-[12px] font-ui text-hs-text-light">{template.description}</p>
      <p className="mt-1.5 text-[11px] font-ui text-hs-text-dark">
        <span className="text-hs-orange">⚡</span> {template.triggerSummary}
      </p>
      <button
        onClick={() => addWorkflow(instantiateTemplate(template))}
        disabled={added}
        className={`mt-2 w-full text-[12px] font-ui font-semibold py-1.5 rounded ${
          added
            ? 'bg-hs-green/10 text-hs-green cursor-default'
            : 'bg-hs-orange text-white hover:bg-hs-orange/90'
        }`}
      >
        {added ? '✓ Added' : '+ Add this automation'}
      </button>
    </div>
  )
}

export default function Step7_Workflows({ index }) {
  const workflows = useStore((s) => s.session.workflows)
  const addWorkflow = useStore((s) => s.addWorkflow)
  const [desc, setDesc] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genNote, setGenNote] = useState('')

  const generate = async () => {
    if (!desc.trim()) return
    setGenerating(true)
    setGenNote('')
    const wf = await generateWorkflowFromText(desc.trim())
    addWorkflow(wf)
    if (wf._reason === 'no_api_key') {
      setGenNote('Added a starter draft. (Connect a Claude API key to auto-generate full flows.)')
    } else if (wf._reason === 'error') {
      setGenNote('AI was unavailable, so we added an editable placeholder flow.')
    }
    setDesc('')
    setGenerating(false)
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

      {/* Custom builder */}
      <section className="mb-6">
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">
          Describe a custom automation
        </h3>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder='e.g. "When a deal is marked Closed Won, send a thank you email and create a 30-day check-in task"'
          className="w-full h-20 rounded-md border border-hs-border p-2.5 text-[13px] font-ui resize-none focus:outline-none focus:border-hs-blue"
        />
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={generate}
            disabled={generating || !desc.trim()}
            className="text-[13px] font-ui font-semibold text-white bg-hs-blue hover:bg-hs-blue/90 px-4 py-1.5 rounded disabled:opacity-40"
          >
            {generating ? 'Generating…' : '✨ Generate flowchart'}
          </button>
          {genNote && <span className="text-[12px] font-ui text-hs-text-light">{genNote}</span>}
        </div>
      </section>

      {/* Template library */}
      <section>
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2">Template Library</h3>
        {WORKFLOW_CATEGORIES.map((cat) => (
          <div key={cat} className="mb-4">
            <p className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              {cat}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {WORKFLOW_TEMPLATES.filter((t) => t.category === cat).map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </StepBody>
  )
}
