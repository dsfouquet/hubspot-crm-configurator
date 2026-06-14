import { useState } from 'react'
import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import {
  JOURNEY_MILESTONES,
  journeyEnabled,
  journeyDefaults,
} from '../constants/journeyMilestones'

const PHASES = ['GENERATE', 'QUALIFY', 'WIN', 'DELIVER', 'KEEP']
const PHASE_COLORS = {
  GENERATE: '#FF7A59',
  QUALIFY: '#0091AE',
  WIN: '#6A78D1',
  DELIVER: '#00BDA5',
  KEEP: '#F5C26B',
}
const PHASE_LABEL = {
  GENERATE: 'Generate (get found and reach out)',
  QUALIFY: 'Qualify (capture, score, route)',
  WIN: 'Win (book, quote, close)',
  DELIVER: 'Deliver (hand off the work)',
  KEEP: 'Keep (service, reviews, repeat)',
}

// "Sales Process" config step: map how this business actually generates, sells,
// delivers, and keeps customers. Toggles are pre-set from discovery; the Sales
// Process demo (right pane) updates live. No marketing means it starts at outreach.
export default function StepJourneyConfig({ index }) {
  const session = useStore((s) => s.session)
  const setJourneyOverride = useStore((s) => s.setJourneyOverride)
  const resetJourneyOverrides = useStore((s) => s.resetJourneyOverrides)
  const addJourneyCustomStep = useStore((s) => s.addJourneyCustomStep)
  const removeJourneyCustomStep = useStore((s) => s.removeJourneyCustomStep)

  const customSteps = session.journey?.customSteps || []
  const [newTitle, setNewTitle] = useState('')
  const [newPhase, setNewPhase] = useState('GENERATE')
  const addStep = () => {
    if (!newTitle.trim()) return
    addJourneyCustomStep(newPhase, newTitle)
    setNewTitle('')
  }

  const defaults = journeyDefaults(session)
  const hasOverrides = Object.keys(session.journey?.overrides || {}).length > 0
  const enabledCount = JOURNEY_MILESTONES.filter((m) => journeyEnabled(session, m.id)).length

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="How does your business actually generate, sell, deliver, and keep customers? Toggle what applies, and the sales process on the right rebuilds itself."
      />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-ui text-hs-text-light">
          {enabledCount} of {JOURNEY_MILESTONES.length} steps in your sales process · pre-set from your
          discovery
        </span>
        {hasOverrides && (
          <button
            onClick={resetJourneyOverrides}
            className="text-[12px] font-ui text-hs-blue hover:underline"
          >
            Reset to suggested
          </button>
        )}
      </div>

      {PHASES.map((phase) => {
        const items = JOURNEY_MILESTONES.filter((m) => m.phase === phase)
        const color = PHASE_COLORS[phase]
        return (
          <section key={phase} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-ui font-bold uppercase tracking-[0.15em] text-white rounded px-2 py-0.5"
                style={{ backgroundColor: color }}
              >
                {phase}
              </span>
              <span className="flex-1 h-px" style={{ backgroundColor: `${color}40` }} />
            </div>
            <div className="space-y-1.5">
              {items.map((m) => {
                const on = journeyEnabled(session, m.id)
                const isDefault = defaults.has(m.id) === on
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2.5 rounded-md border px-3 py-2 ${
                      on ? 'border-hs-blue/40 bg-hs-blue/5' : 'border-hs-border bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setJourneyOverride(m.id, !on)}
                      className={`w-9 h-5 rounded-full shrink-0 relative transition-colors ${
                        on ? 'bg-hs-orange' : 'bg-hs-border'
                      }`}
                      title={on ? 'In your journey' : 'Not in your journey'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          on ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span
                      className={`flex-1 text-[13px] font-ui ${
                        on ? 'text-hs-text-dark' : 'text-hs-text-light'
                      }`}
                    >
                      {m.label}
                    </span>
                    {!isDefault && (
                      <span className="text-[9px] font-ui uppercase tracking-wide text-hs-blue border border-hs-blue/30 rounded px-1.5 py-0.5">
                        custom
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* Add a custom step the template did not capture */}
      <section className="mb-4 border-t border-hs-border pt-4">
        <h3 className="text-[13px] font-ui font-semibold text-hs-navy">Add a custom step</h3>
        <p className="text-[12px] font-ui text-hs-text-light mt-0.5 mb-2.5">
          Something they do that is not here? Type it and pick which section it belongs in.
        </p>
        <div className="flex flex-wrap items-stretch gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addStep()}
            maxLength={80}
            placeholder="What do they do? e.g. We do an on-site assessment"
            className="hs-input flex-1 min-w-[220px] px-3 py-2 text-[13px] font-ui"
          />
          <select
            value={newPhase}
            onChange={(e) => setNewPhase(e.target.value)}
            className="hs-input px-2 py-2 text-[13px] font-ui"
            aria-label="Which section"
          >
            {PHASES.map((p) => (
              <option key={p} value={p}>
                {PHASE_LABEL[p]}
              </option>
            ))}
          </select>
          <button
            onClick={addStep}
            disabled={!newTitle.trim()}
            className="hs-btn-primary disabled:opacity-40"
          >
            Add step
          </button>
        </div>

        {customSteps.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {customSteps.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2.5 rounded-md border border-hs-orange/40 bg-hs-orange/5 px-3 py-2"
              >
                <span
                  className="text-[9px] font-ui font-bold uppercase tracking-wide text-white rounded px-1.5 py-0.5 shrink-0"
                  style={{ backgroundColor: PHASE_COLORS[c.phase] }}
                >
                  {c.phase}
                </span>
                <span className="flex-1 text-[13px] font-ui text-hs-text-dark">{c.title}</span>
                <button
                  onClick={() => removeJourneyCustomStep(c.id)}
                  aria-label="Remove this custom step"
                  className="shrink-0 text-hs-text-light hover:text-hs-red text-[16px] leading-none px-1"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-[12px] font-ui text-hs-text-light">
        Example: skip every marketing step and the process opens directly with outreach, exactly how
        an outbound-only shop runs.
      </p>
    </StepBody>
  )
}
