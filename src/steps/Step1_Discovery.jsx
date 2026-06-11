import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  DISCOVERY_QUESTIONS,
  DISCOVERY_SECTIONS,
} from '../constants/discoveryQuestions'
import { StepHeader, StepBody } from '../shared/StepLayout'
import { buildFixPlan, buildConfigPatch } from '../utils/solutionEngine'

// Discovery intake (Step 1). One question per screen, grouped into sections.
// Finishing builds the Fix Plan and pre-configures the whole session.
export default function Step1_Discovery({ index }) {
  const wizard = useStore((s) => s.session.wizard)
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  const applyFixPlan = useStore((s) => s.applyFixPlan)
  const goToStep = useStore((s) => s.goToStep)
  const markStepComplete = useStore((s) => s.markStepComplete)
  const [q, setQ] = useState(0)
  const [building, setBuilding] = useState(false)

  const question = DISCOVERY_QUESTIONS[q]
  const answer = wizard[question.key]
  const isLast = q === DISCOVERY_QUESTIONS.length - 1
  const section = DISCOVERY_SECTIONS.find((s) => s.key === question.section)
  const sectionIndex = DISCOVERY_SECTIONS.findIndex((s) => s.key === question.section)

  // Options for "which costs the most" come from the user's leak selections.
  const options =
    question.type === 'single-from-leaks'
      ? Array.isArray(wizard.leaks) && wizard.leaks.length
        ? wizard.leaks
        : []
      : question.options || []

  const isSingle = question.type === 'single' || question.type === 'single-from-leaks'
  const isMulti = question.type === 'multi'
  const isText = question.type === 'textarea'

  const isSelected = (opt) =>
    isSingle ? answer === opt : Array.isArray(answer) && answer.includes(opt)

  const toggle = (opt) => {
    if (isSingle) {
      setWizardAnswer(question.key, opt)
      return
    }
    // Multi: read fresh store state so rapid toggles don't clobber each other.
    const live = useStore.getState().session.wizard[question.key]
    const current = Array.isArray(live) ? live : []
    setWizardAnswer(
      question.key,
      current.includes(opt) ? current.filter((o) => o !== opt) : [...current, opt]
    )
  }

  const otherValue = (() => {
    if (!question.allowOther) return ''
    if (isSingle)
      return typeof answer === 'string' && !options.includes(answer) ? answer : ''
    const live = Array.isArray(answer) ? answer : []
    return live.find((a) => !options.includes(a)) || ''
  })()

  const setOther = (text) => {
    if (isSingle) {
      setWizardAnswer(question.key, text)
      return
    }
    const live = useStore.getState().session.wizard[question.key]
    const presets = Array.isArray(live) ? live.filter((a) => options.includes(a)) : []
    setWizardAnswer(question.key, text.trim() ? [...presets, text] : presets)
  }

  const finish = () => {
    setBuilding(true)
    const freshWizard = useStore.getState().session.wizard
    const plan = buildFixPlan(freshWizard)
    const patch = buildConfigPatch(useStore.getState().session, plan)
    applyFixPlan(plan, patch)
    markStepComplete(index)
    goToStep(index + 1) // → Your Fix Plan
    setBuilding(false)
  }

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Tell us how your business actually runs. We'll build your HubSpot fix from it."
      />

      {/* Section breadcrumbs */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {DISCOVERY_SECTIONS.map((s, i) => (
          <span
            key={s.key}
            className={`text-[11px] font-ui px-2 py-0.5 rounded-full ${
              i === sectionIndex
                ? 'bg-hs-orange text-white font-semibold'
                : i < sectionIndex
                  ? 'bg-hs-green/15 text-hs-green'
                  : 'bg-hs-canvas text-hs-text-light'
            }`}
          >
            {i + 1}. {s.label}
          </span>
        ))}
      </div>

      {/* Question progress dots */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {DISCOVERY_QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === q ? 'w-5 bg-hs-orange' : i < q ? 'w-2.5 bg-hs-green' : 'w-2.5 bg-hs-border'
            }`}
          />
        ))}
      </div>

      <div className="rounded-lg border border-hs-border bg-white p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-ui font-semibold text-hs-navy text-lg">{question.prompt}</h3>
          {(question.hint || isMulti || question.optional) && (
            <span className="text-[12px] font-ui text-hs-text-light shrink-0">
              {question.optional ? 'Optional' : question.hint || 'Select all that apply'}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {isText && (
            <textarea
              value={answer || ''}
              onChange={(e) => setWizardAnswer(question.key, e.target.value)}
              placeholder={question.placeholder}
              className="w-full h-24 rounded-md border border-hs-border p-3 text-[14px] font-ui resize-none focus:outline-none focus:border-hs-blue"
            />
          )}

          {question.type === 'single-from-leaks' && options.length === 0 && (
            <p className="text-[13px] font-ui text-hs-text-light">
              No problems selected on the previous question — go back and pick at least one, or
              skip ahead.
            </p>
          )}

          {(isSingle || isMulti) &&
            options.map((opt) => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`w-full text-left flex items-center gap-3 rounded-md border px-3 py-2.5 text-[14px] font-ui transition-colors ${
                  isSelected(opt)
                    ? 'border-hs-orange bg-hs-orange/10 text-hs-navy'
                    : 'border-hs-border bg-white text-hs-text-dark hover:border-hs-text-light'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-4 h-4 shrink-0 ${
                    isSingle ? 'rounded-full' : 'rounded'
                  } border ${
                    isSelected(opt)
                      ? 'bg-hs-orange border-hs-orange text-white'
                      : 'border-hs-border'
                  }`}
                >
                  {isSelected(opt) && <span className="text-[10px] leading-none">✓</span>}
                </span>
                {opt}
              </button>
            ))}

          {question.allowOther && (
            <input
              value={otherValue}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Other (type your own)…"
              className="w-full rounded-md border border-hs-border px-3 py-2.5 text-[14px] font-ui focus:outline-none focus:border-hs-blue"
            />
          )}

          {/* Optional inline text rider (e.g. "put a number on it") */}
          {question.optionalText && (
            <div className="pt-1">
              <label className="block text-[12px] font-ui text-hs-text-light mb-1">
                {question.optionalText.label}
              </label>
              <input
                value={wizard[question.optionalText.key] || ''}
                onChange={(e) => setWizardAnswer(question.optionalText.key, e.target.value)}
                placeholder={question.optionalText.placeholder}
                className="w-full rounded-md border border-hs-border px-3 py-2 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
              />
            </div>
          )}
        </div>

        {/* Question nav */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setQ((n) => Math.max(0, n - 1))}
            disabled={q === 0}
            className="text-[13px] font-ui font-medium text-hs-text-dark px-3 py-1.5 rounded-md border border-hs-border disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-[12px] font-ui text-hs-text-light">
            {q + 1} of {DISCOVERY_QUESTIONS.length}
          </span>
          {isLast ? (
            <button
              onClick={finish}
              disabled={building}
              className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-1.5 rounded-md disabled:opacity-50"
            >
              {building ? 'Building…' : '⚡ Build My Fix Plan →'}
            </button>
          ) : (
            <button
              onClick={() => setQ((n) => Math.min(DISCOVERY_QUESTIONS.length - 1, n + 1))}
              className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-1.5 rounded-md"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </StepBody>
  )
}
