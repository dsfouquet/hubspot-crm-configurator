import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  CUSTOMER_QUESTIONS,
  customerPainIds,
  customerPainGroups,
} from '../constants/customerQuestions'
import QuestionControl from '../shared/QuestionControl'
import { autoBuildSession } from '../utils/autoBuild'
import { qualify } from '../utils/qualification'

// Customer-mode intake: one question per screen, typeform-style. On finish it
// auto-builds the entire session (fix plan, pipeline, workflows, custom object,
// dashboard) from the avatar + answers, qualifies the prospect, and advances to
// the Build Plan step.
export default function CustomerIntake() {
  const wizard = useStore((s) => s.session.wizard)
  const [qIdx, setQIdx] = useState(0)
  const [building, setBuilding] = useState(false)

  const total = CUSTOMER_QUESTIONS.length
  const raw = CUSTOMER_QUESTIONS[qIdx]
  const isLast = qIdx === total - 1

  const advance = () => setQIdx((n) => Math.min(total - 1, n + 1))
  const back = () => setQIdx((n) => Math.max(0, n - 1))

  const finish = () => {
    if (building) return
    setBuilding(true)
    // Defer one tick so the button can paint its "Building…" state.
    setTimeout(() => {
      const state = useStore.getState()
      const { wizard: seeded, plan, patch } = autoBuildSession(state.session)
      state.patchSession({ wizard: seeded })
      state.applyFixPlan(plan, patch)
      state.setQualification(qualify(seeded))
      state.unlockPreview()
      state.markStepComplete(0)
      state.goToStep(1) // → Your Build Plan
    }, 30)
  }

  // Resolve dynamic pieces: avatar-weighted pains (flat list for the answered
  // check + topLeak source) and journey-ordered groups for rendering.
  const question = {
    ...raw,
    ...(raw.dynamicPains
      ? {
          painIds: customerPainIds(wizard.industry),
          groups: customerPainGroups(wizard.industry),
        }
      : {}),
    ...(raw.autoAdvance && !isLast
      ? { onPick: () => setTimeout(advance, 220) }
      : {}),
  }

  // Is the current question answered (for enabling Continue)?
  const answered = (() => {
    const a = wizard[question.key]
    if (question.type === 'pain-multi')
      return Array.isArray(a) && a.some((id) => question.painIds.includes(id))
    if (question.type === 'tracking-multi')
      return Boolean(a) && Object.values(a).some((arr) => Array.isArray(arr) && arr.length > 0)
    if (Array.isArray(a)) return a.length > 0
    return Boolean(a && String(a).trim())
  })()

  const canContinue = question.optional || answered
  const pct = Math.round(((qIdx + 1) / total) * 100)

  return (
    <div className="flex-1 w-full h-full overflow-y-auto hs-scroll bg-hs-canvas">
      <div className="max-w-xl mx-auto px-5 py-8 sm:py-12">
        <div className="flex items-center justify-end mb-6">
          <span className="text-[12px] font-ui text-hs-text-light">
            Question {qIdx + 1} of {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-hs-greatwhite mb-8 overflow-hidden">
          <div
            className="h-full bg-hs-orange rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <h2 className="font-ui font-semibold text-hs-navy text-xl sm:text-2xl leading-snug">
          {question.prompt}
        </h2>
        {(question.hint || question.optional) && (
          <p className="mt-1.5 text-[13px] font-ui text-hs-text-light">
            {question.optional ? 'Optional. Skip if nothing comes to mind.' : question.hint}
          </p>
        )}

        <div className="mt-5">
          <QuestionControl question={question} size="large" />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={qIdx === 0}
            className="text-[13px] font-ui font-medium text-hs-text-light hover:text-hs-navy disabled:opacity-0"
          >
            ← Back
          </button>
          {isLast ? (
            <button onClick={finish} disabled={building} className="hs-btn-primary">
              {building ? 'Building your CRM plan…' : 'Build my CRM plan →'}
            </button>
          ) : (
            <button onClick={advance} disabled={!canContinue} className="hs-btn-primary">
              Continue →
            </button>
          )}
        </div>

        <p className="mt-10 text-center text-[11px] font-ui text-hs-text-light">
          Built by Crescent Connect. HubSpot setup done for you, free for qualified
          Louisiana businesses.
        </p>
      </div>
    </div>
  )
}
