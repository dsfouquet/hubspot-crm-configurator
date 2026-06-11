import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  DISCOVERY_QUESTIONS,
  DISCOVERY_SECTIONS,
} from '../constants/discoveryQuestions'
import { StepHeader, StepBody } from '../shared/StepLayout'
import { buildFixPlan, buildConfigPatch } from '../utils/solutionEngine'

// One question's input control (single / multi / textarea / single-from-leaks),
// shared by the full section view and the quick-essentials skip path.
function QuestionControl({ question, compact = false }) {
  const wizard = useStore((s) => s.session.wizard)
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  const answer = wizard[question.key]

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
      setWizardAnswer(question.key, answer === opt ? undefined : opt)
      return
    }
    // Read fresh store state so rapid toggles don't clobber each other.
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

  return (
    <div>
      {isText && (
        <textarea
          value={answer || ''}
          onChange={(e) => setWizardAnswer(question.key, e.target.value)}
          placeholder={question.placeholder}
          className={`w-full ${compact ? 'h-16' : 'h-20'} rounded-md border border-hs-border p-2.5 text-[13px] font-ui resize-none focus:outline-none focus:border-hs-blue`}
        />
      )}

      {question.type === 'single-from-leaks' && options.length === 0 && (
        <p className="text-[12px] font-ui text-hs-text-light">
          Select at least one problem above first.
        </p>
      )}

      {(isSingle || isMulti) && (
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`text-left flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[13px] font-ui transition-colors ${
                isSelected(opt)
                  ? 'border-hs-orange bg-hs-orange/10 text-hs-navy'
                  : 'border-hs-border bg-white text-hs-text-dark hover:border-hs-text-light'
              }`}
            >
              <span
                className={`flex items-center justify-center w-3.5 h-3.5 shrink-0 ${
                  isSingle ? 'rounded-full' : 'rounded'
                } border ${
                  isSelected(opt)
                    ? 'bg-hs-orange border-hs-orange text-white'
                    : 'border-hs-border'
                }`}
              >
                {isSelected(opt) && <span className="text-[9px] leading-none">✓</span>}
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}

      {question.allowOther && (
        <input
          value={otherValue}
          onChange={(e) => setOther(e.target.value)}
          placeholder="Other (type your own)…"
          className="mt-1.5 w-full rounded-md border border-hs-border px-2.5 py-1.5 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
        />
      )}

      {question.optionalText && (
        <div className="mt-1.5">
          <label className="block text-[11px] font-ui text-hs-text-light mb-0.5">
            {question.optionalText.label}
          </label>
          <OptionalTextInput optionalText={question.optionalText} />
        </div>
      )}
    </div>
  )
}

function OptionalTextInput({ optionalText }) {
  const value = useStore((s) => s.session.wizard[optionalText.key] || '')
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  return (
    <input
      value={value}
      onChange={(e) => setWizardAnswer(optionalText.key, e.target.value)}
      placeholder={optionalText.placeholder}
      className="w-full rounded-md border border-hs-border px-2.5 py-1.5 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
    />
  )
}

// The two questions that make a fix plan possible — required before skipping.
const ESSENTIAL_KEYS = ['leaks', 'dealStages']

export default function Step1_Discovery({ index }) {
  const applyFixPlan = useStore((s) => s.applyFixPlan)
  const goToStep = useStore((s) => s.goToStep)
  const markStepComplete = useStore((s) => s.markStepComplete)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [quickMode, setQuickMode] = useState(false)
  const [building, setBuilding] = useState(false)

  const section = DISCOVERY_SECTIONS[sectionIdx]
  const sectionQuestions = DISCOVERY_QUESTIONS.filter((q) => q.section === section.key)
  const isLastSection = sectionIdx === DISCOVERY_SECTIONS.length - 1

  const finish = () => {
    setBuilding(true)
    const state = useStore.getState()
    const plan = buildFixPlan(state.session.wizard)
    const patch = buildConfigPatch(state.session, plan)
    applyFixPlan(plan, patch)
    markStepComplete(index)
    goToStep(index + 1) // → Your Fix Plan
    setBuilding(false)
  }

  // ---- Quick-essentials skip path: just the leak checklist + deal stages ----
  if (quickMode) {
    const essentials = DISCOVERY_QUESTIONS.filter((q) => ESSENTIAL_KEYS.includes(q.key))
    return (
      <StepBody>
        <StepHeader
          index={index}
          intro="30 seconds, two questions — enough to build your fix plan. You can fill in the rest later."
        />
        <div className="space-y-4">
          {essentials.map((q) => (
            <div key={q.key} className="rounded-lg border border-hs-border bg-white p-4">
              <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-2.5">
                {q.prompt}
              </h3>
              <QuestionControl question={q} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setQuickMode(false)}
            className="text-[13px] font-ui text-hs-text-light hover:text-hs-navy"
          >
            ← Back to full discovery
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToStep(index + 2)} // skip everything → Contacts
              className="text-[12px] font-ui text-hs-text-light hover:text-hs-navy underline"
            >
              Skip everything
            </button>
            <button
              onClick={finish}
              disabled={building}
              className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md disabled:opacity-50"
            >
              ⚡ Build My Fix Plan →
            </button>
          </div>
        </div>
      </StepBody>
    )
  }

  // ---- Full discovery: one SECTION per screen, all questions visible ----
  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Tell us how your business actually runs. We'll build your HubSpot fix from it."
      />

      {/* Section tabs */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {DISCOVERY_SECTIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setSectionIdx(i)}
            className={`text-[12px] font-ui px-2.5 py-1 rounded-full ${
              i === sectionIdx
                ? 'bg-hs-orange text-white font-semibold'
                : i < sectionIdx
                  ? 'bg-hs-green/15 text-hs-green'
                  : 'bg-hs-canvas text-hs-text-light hover:text-hs-navy'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* All questions in this section, stacked */}
      <div className="space-y-4">
        {sectionQuestions.map((q) => (
          <div key={q.key} className="rounded-lg border border-hs-border bg-white p-4">
            <div className="flex items-baseline justify-between gap-3 mb-2.5">
              <h3 className="font-ui font-semibold text-hs-navy text-[15px]">{q.prompt}</h3>
              {(q.hint || q.type === 'multi' || q.optional) && (
                <span className="text-[11px] font-ui text-hs-text-light shrink-0">
                  {q.optional ? 'Optional' : q.hint || 'Select all that apply'}
                </span>
              )}
            </div>
            <QuestionControl question={q} />
          </div>
        ))}
      </div>

      {/* Section nav */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setSectionIdx((n) => Math.max(0, n - 1))}
          disabled={sectionIdx === 0}
          className="text-[13px] font-ui font-medium text-hs-text-dark px-3 py-1.5 rounded-md border border-hs-border disabled:opacity-40"
        >
          ← {sectionIdx > 0 ? DISCOVERY_SECTIONS[sectionIdx - 1].label : 'Back'}
        </button>
        <button
          onClick={() => setQuickMode(true)}
          className="text-[12px] font-ui text-hs-text-light hover:text-hs-navy underline"
        >
          In a hurry? Quick version
        </button>
        {isLastSection ? (
          <button
            onClick={finish}
            disabled={building}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-1.5 rounded-md disabled:opacity-50"
          >
            {building ? 'Building…' : '⚡ Build My Fix Plan →'}
          </button>
        ) : (
          <button
            onClick={() => setSectionIdx((n) => n + 1)}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-1.5 rounded-md"
          >
            {DISCOVERY_SECTIONS[sectionIdx + 1].label} →
          </button>
        )}
      </div>
    </StepBody>
  )
}
