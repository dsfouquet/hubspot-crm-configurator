import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import { painParts } from '../constants/discoveryQuestions'

// Step 2: the Fix Plan. LEFT is a clean clickable problem list — the full story
// (real cost, narrative, toolkit, Crescent Connect builds, diagrams) lives on
// the RIGHT after a click, with the scope of work pinned at the top there.
export default function Step2_FixPlan({ index }) {
  const fixPlan = useStore((s) => s.session.fixPlan)
  const focusedProblemId = useStore((s) => s.focusedProblemId)
  const setFocusedProblem = useStore((s) => s.setFocusedProblem)
  const goToStep = useStore((s) => s.goToStep)
  const isCustomer = useStore((s) => s.session.mode) !== 'live'

  if (!fixPlan || fixPlan.problems.length === 0) {
    return (
      <StepBody>
        <StepHeader
          index={index}
          intro="Your personalized fix plan appears here after discovery."
        />
        <div className="rounded-lg border-2 border-dashed border-hs-border p-6 text-center">
          <p className="text-[14px] font-ui text-hs-text-dark mb-3">
            {fixPlan
              ? 'No problems selected in discovery — go back and check the ones that apply.'
              : "Answer the discovery questions first and we'll build your fix plan automatically."}
          </p>
          <button
            onClick={() => goToStep(index - 1)}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md"
          >
            ← Go to Discovery
          </button>
        </div>
      </StepBody>
    )
  }

  const activeId = focusedProblemId || fixPlan.problems[0]?.id

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro={
          isCustomer
            ? `Here's what Crescent Connect will build for you in 7 days — ${
                fixPlan.problems.length
              } leak${
                fixPlan.problems.length === 1 ? '' : 's'
              } found, fixes pre-built. Click one to see the full fix on the right.`
            : `${fixPlan.problems.length} leak${
                fixPlan.problems.length === 1 ? '' : 's'
              } found, fixes pre-built. Click one to see the full fix on the right.`
        }
      />

      {fixPlan.topGoal && (
        <div className="mb-3 rounded-lg bg-hs-navy px-3.5 py-2.5">
          <div className="text-[9px] font-ui font-semibold uppercase tracking-wide text-hs-orange mb-0.5">
            Your #1 fix for the next 30 days
          </div>
          <p className="text-[13px] font-ui text-white italic">"{fixPlan.topGoal}"</p>
        </div>
      )}

      {/* Slim clickable problem list */}
      <div className="space-y-1.5">
        {fixPlan.problems.map((p) => {
          const isActive = activeId === p.id
          const { pain } = painParts(p.id)
          return (
            <button
              key={p.id}
              onClick={() => setFocusedProblem(p.id)}
              className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                isActive
                  ? 'border-hs-orange bg-hs-orange/5'
                  : 'border-hs-border bg-white hover:border-hs-text-light'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-ui font-bold text-hs-navy text-[13px] shrink-0">{pain}</span>
                <span className="flex-1 font-ui text-hs-text-dark text-[12.5px] truncate">
                  {p.title}
                </span>
                {p.isTop && (
                  <span className="text-[8.5px] font-ui font-bold uppercase tracking-wide text-white bg-hs-red rounded px-1.5 py-0.5 shrink-0">
                    $$$
                  </span>
                )}
                {p.hub && (
                  <span className="text-[9px] font-ui font-medium text-hs-blue border border-hs-blue/30 rounded px-1 py-0.5 shrink-0">
                    {p.hub.replace(' Hub', '')}
                  </span>
                )}
                <span
                  className={`text-[11px] shrink-0 ${isActive ? 'text-hs-orange' : 'text-hs-border'}`}
                >
                  →
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {fixPlan.mondayScreen && (
        <div className="mt-3 rounded-md border border-hs-blue/30 bg-hs-blue/5 px-3 py-2">
          <span className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-blue">
            Your Monday screen:{' '}
          </span>
          <span className="text-[12px] font-ui text-hs-text-dark italic">
            "{fixPlan.mondayScreen}"
          </span>
        </div>
      )}

      <p className="mt-3 text-[12px] font-ui text-hs-text-dark italic">
        If nothing changes in the next 12 months, where does that leave the business?
      </p>
      <p className="mt-1.5 text-[11px] font-ui text-hs-text-light">
        {isCustomer
          ? 'Everything here is already built into your preview — next, see it as a working HubSpot portal.'
          : 'Everything here is already loaded into the configurator — keep clicking Next to fine-tune.'}
      </p>
    </StepBody>
  )
}
