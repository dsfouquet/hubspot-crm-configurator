import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import {
  JOURNEY_MILESTONES,
  journeyEnabled,
  journeyDefaults,
} from '../constants/journeyMilestones'

const PHASES = ['ATTRACT', 'CONVERT', 'CLOSE', 'DELIVER', 'RETAIN']
const PHASE_COLORS = {
  ATTRACT: '#FF7A59',
  CONVERT: '#0091AE',
  CLOSE: '#6A78D1',
  DELIVER: '#00BDA5',
  RETAIN: '#F5C26B',
}

// "Customer Journey" config step: map how this business actually markets, sells,
// and operates. Toggles are pre-set from discovery; the Journey demo (right pane)
// updates live — no marketing means the journey starts at cold/warm outreach.
export default function StepJourneyConfig({ index }) {
  const session = useStore((s) => s.session)
  const setJourneyOverride = useStore((s) => s.setJourneyOverride)
  const resetJourneyOverrides = useStore((s) => s.resetJourneyOverrides)

  const defaults = journeyDefaults(session)
  const hasOverrides = Object.keys(session.journey?.overrides || {}).length > 0
  const enabledCount = JOURNEY_MILESTONES.filter((m) => journeyEnabled(session, m.id)).length

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="How does your business actually attract, sell, deliver, and retain? Toggle what applies — the journey on the right rebuilds itself."
      />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-ui text-hs-text-light">
          {enabledCount} of {JOURNEY_MILESTONES.length} steps in your journey · pre-set from your
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
                    <span className="text-[15px] shrink-0">{m.icon}</span>
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

      <p className="text-[12px] font-ui text-hs-text-light">
        Example: skip every marketing step and the journey opens directly with cold and warm
        outreach — exactly how an outbound-only shop runs.
      </p>
    </StepBody>
  )
}
