import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  DISCOVERY_QUESTIONS,
  DISCOVERY_SECTIONS,
  ALL_PAIN_IDS,
  CLASSIC_LEAKS,
  painParts,
} from '../constants/discoveryQuestions'
import { StepHeader, StepBody } from '../shared/StepLayout'
import { buildFixPlan, buildConfigPatch } from '../utils/solutionEngine'

// One question's input control. Types: single / multi / textarea / pain-multi
// (checklist of pain ids rendered as bold word + short description) /
// single-from-pains (pick one of the pains already selected).
function QuestionControl({ question, compact = false }) {
  const wizard = useStore((s) => s.session.wizard)
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  const answer = wizard[question.key]

  const isPainMulti = question.type === 'pain-multi'
  const isPainSingle = question.type === 'single-from-pains'
  const isHabit = question.type === 'habit-matrix'
  const isSingle = question.type === 'single' || isPainSingle
  const isMulti = question.type === 'multi' || isPainMulti
  const isText = question.type === 'textarea'

  // Habit matrix (Always / Sometimes / Never): stores wizard[key] = {id: state}
  // and syncs the mapped pain into wizard.pains (always clears it).
  const setHabit = (id, state) => {
    const live = useStore.getState().session.wizard
    const habits = { ...(live[question.key] || {}), [id]: state }
    setWizardAnswer(question.key, habits)
    const pains = Array.isArray(live.pains) ? live.pains : []
    const without = pains.filter((p) => p !== id)
    setWizardAnswer('pains', state === 'always' ? without : [...without, id])
  }

  const options = isPainMulti
    ? question.painIds
    : isPainSingle
      ? (Array.isArray(wizard.pains) ? wizard.pains : [])
      : question.options || []

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

  // Render an option label — pains get bold word + light description.
  const OptionLabel = ({ opt }) => {
    if (isPainMulti || isPainSingle) {
      const { pain, desc } = painParts(opt)
      return (
        <span className="min-w-0">
          <span className="font-semibold text-hs-navy">{pain}</span>
          {desc && <span className="text-hs-text-dark"> — {desc}</span>}
        </span>
      )
    }
    return <span>{opt}</span>
  }

  return (
    <div>
      {isText && (
        <>
          <textarea
            value={answer || ''}
            onChange={(e) => setWizardAnswer(question.key, e.target.value)}
            placeholder={question.placeholder}
            rows={2}
            className="w-full rounded-md border border-hs-border px-2.5 py-1.5 text-[13px] font-ui resize-none focus:outline-none focus:border-hs-blue"
          />
          {question.quickPicks && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {question.quickPicks.map((p) => (
                <button
                  key={p}
                  onClick={() => setWizardAnswer(question.key, p)}
                  className={`rounded-full border px-2.5 py-0.5 text-[11.5px] font-ui ${
                    answer === p
                      ? 'border-hs-orange bg-hs-orange text-white'
                      : 'border-hs-border bg-hs-canvas text-hs-text-dark hover:border-hs-text-light'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {isHabit && (
        <div className="space-y-1.5">
          {question.statements.map((s) => {
            const state = (answer || {})[s.id]
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-md border border-hs-border bg-white px-2.5 py-1.5"
              >
                <span className="text-[12.5px] font-ui text-hs-text-dark min-w-0">
                  {s.statement}
                </span>
                <span className="inline-flex rounded-full border border-hs-border bg-hs-canvas p-0.5 shrink-0">
                  {['always', 'sometimes', 'never'].map((opt) => {
                    const colors = {
                      always: 'bg-hs-green text-white',
                      sometimes: 'bg-hs-orange text-white',
                      never: 'bg-hs-red text-white',
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => setHabit(s.id, opt)}
                        className={`text-[10.5px] font-ui font-medium px-2 py-0.5 rounded-full capitalize ${
                          state === opt ? colors[opt] : 'text-hs-text-light hover:text-hs-navy'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {isPainSingle && options.length === 0 && (
        <p className="text-[12px] font-ui text-hs-text-light">
          Check at least one problem in the earlier sections first.
        </p>
      )}

      {/* Classic research-backed leaks — picking one also checks the pain */}
      {isPainSingle && (
        <div className="mt-2.5">
          <p className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-1">
            Or one of the classics — where most companies bleed
          </p>
          <div className="space-y-1">
            {CLASSIC_LEAKS.map((c) => {
              const { pain } = painParts(c.painId)
              const sel = answer === c.painId
              return (
                <button
                  key={c.painId + c.stat}
                  onClick={() => {
                    const live = useStore.getState().session.wizard
                    const pains = Array.isArray(live.pains) ? live.pains : []
                    if (!pains.includes(c.painId)) setWizardAnswer('pains', [...pains, c.painId])
                    setWizardAnswer(question.key, sel ? undefined : c.painId)
                  }}
                  className={`w-full text-left rounded-md border px-2.5 py-1.5 ${
                    sel
                      ? 'border-hs-orange bg-hs-orange/10'
                      : 'border-hs-border bg-white hover:border-hs-text-light'
                  }`}
                >
                  <span className="text-[12px] font-ui">
                    <span className="font-semibold text-hs-navy">{pain}:</span>{' '}
                    <span className="text-hs-text-dark">{c.stat}</span>
                  </span>
                  <span className="block text-[9.5px] font-ui text-hs-text-light">
                    — {c.source}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {(isSingle || isMulti) && !isText && (
        <div
          className={isPainMulti || isPainSingle ? 'space-y-1' : 'flex flex-wrap gap-1.5'}
        >
          {options.map((opt) => {
            const sel = isSelected(opt)
            // Pains: slim full-width rows with check. Plain options: compact pills.
            if (isPainMulti || isPainSingle) {
              return (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={`w-full text-left flex items-center gap-2 rounded-md border px-2.5 py-1 text-[12.5px] font-ui transition-colors ${
                    sel
                      ? 'border-hs-orange bg-hs-orange/10'
                      : 'border-hs-border bg-white hover:border-hs-text-light'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-3.5 h-3.5 shrink-0 ${
                      isSingle ? 'rounded-full' : 'rounded'
                    } border ${
                      sel ? 'bg-hs-orange border-hs-orange text-white' : 'border-hs-border'
                    }`}
                  >
                    {sel && <span className="text-[9px] leading-none">✓</span>}
                  </span>
                  <OptionLabel opt={opt} />
                </button>
              )
            }
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`rounded-full border px-2.5 py-1 text-[12.5px] font-ui transition-colors ${
                  sel
                    ? 'border-hs-orange bg-hs-orange text-white font-medium'
                    : 'border-hs-border bg-white text-hs-text-dark hover:border-hs-text-light'
                }`}
              >
                {sel && <span className="mr-1">✓</span>}
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {question.allowOther && (
        <input
          value={otherValue}
          onChange={(e) => setOther(e.target.value)}
          placeholder="Other…"
          className="mt-1.5 w-44 rounded-full border border-hs-border px-2.5 py-1 text-[12.5px] font-ui focus:outline-none focus:border-hs-blue"
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

// Quick-essentials path: every pain in one compact checklist + deal stages.
const QUICK_QUESTIONS = [
  {
    key: 'pains',
    qid: 'pains_all',
    prompt: 'Which of these are problems right now?',
    type: 'pain-multi',
    painIds: ALL_PAIN_IDS,
  },
  DISCOVERY_QUESTIONS.find((q) => q.qid === 'dealStages'),
]

// Does this question have an answer? (drives the green section pills)
function hasAnswer(wizard, q) {
  const a = wizard[q.key]
  if (q.type === 'pain-multi') {
    return Array.isArray(a) && a.some((id) => q.painIds.includes(id))
  }
  if (q.type === 'habit-matrix') {
    return a && Object.keys(a).length > 0
  }
  if (Array.isArray(a)) return a.length > 0
  return Boolean(a && String(a).trim())
}

export default function Step1_Discovery({ index }) {
  const wizard = useStore((s) => s.session.wizard)
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

  // Mode toggle shown at the top of both paths.
  const ModeToggle = () => (
    <div className="mb-3 flex items-center gap-2">
      <div className="inline-flex rounded-full border border-hs-border bg-hs-canvas p-0.5">
        <button
          onClick={() => setQuickMode(false)}
          className={`text-[11px] font-ui font-medium px-2.5 py-1 rounded-full transition-colors ${
            !quickMode ? 'bg-white text-hs-navy shadow-sm' : 'text-hs-text-light hover:text-hs-navy'
          }`}
        >
          Full
        </button>
        <button
          onClick={() => setQuickMode(true)}
          className={`text-[11px] font-ui font-medium px-2.5 py-1 rounded-full transition-colors ${
            quickMode ? 'bg-white text-hs-navy shadow-sm' : 'text-hs-text-light hover:text-hs-navy'
          }`}
        >
          ⚡ Quick
        </button>
      </div>
      <span className="text-[11px] font-ui text-hs-text-light">
        {quickMode ? '2 questions · ~60 sec' : '~4 min · most tailored result'}
      </span>
    </div>
  )

  // ---- Quick-essentials skip path ----
  if (quickMode) {
    return (
      <StepBody>
        <StepHeader
          index={index}
          intro="Two questions — enough to build your fix plan. You can fill in the rest later."
        />
        <ModeToggle />
        <div className="rounded-lg border border-hs-border bg-white px-4 divide-y divide-hs-canvas">
          {QUICK_QUESTIONS.map((q) => (
            <div key={q.qid} className="py-3">
              <h3 className="font-ui font-semibold text-hs-navy text-[13px] mb-1.5">{q.prompt}</h3>
              <QuestionControl question={q} compact />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => goToStep(index + 2)}
            className="text-[12px] font-ui text-hs-text-light hover:text-hs-navy underline"
          >
            Just browse the demo (skip everything)
          </button>
          <button
            onClick={finish}
            disabled={building}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md disabled:opacity-50"
          >
            ⚡ Build My Fix Plan →
          </button>
        </div>
      </StepBody>
    )
  }

  // Prev / Next section controls — rendered both above and below the questions.
  const SectionNav = ({ className = '' }) => (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => setSectionIdx((n) => Math.max(0, n - 1))}
        disabled={sectionIdx === 0}
        className="text-[12px] font-ui font-medium text-hs-text-dark px-2.5 py-1 rounded-md border border-hs-border disabled:opacity-40"
      >
        ← {sectionIdx > 0 ? DISCOVERY_SECTIONS[sectionIdx - 1].label : 'Back'}
      </button>
      {isLastSection ? (
        <button
          onClick={finish}
          disabled={building}
          className="text-[12px] font-ui font-semibold text-white bg-hs-orange px-3.5 py-1 rounded-md disabled:opacity-50"
        >
          {building ? 'Building…' : '⚡ Build My Fix Plan →'}
        </button>
      ) : (
        <button
          onClick={() => setSectionIdx((n) => n + 1)}
          className="text-[12px] font-ui font-semibold text-white bg-hs-orange px-3.5 py-1 rounded-md"
        >
          {DISCOVERY_SECTIONS[sectionIdx + 1].label} →
        </button>
      )}
    </div>
  )

  // ---- Full discovery: one HUB SECTION per screen ----
  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Organized the way HubSpot is — answer what applies, skip what doesn't."
      />

      <ModeToggle />

      {/* Section pills — green when a section actually has answers */}
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {DISCOVERY_SECTIONS.map((s, i) => {
          const qs = DISCOVERY_QUESTIONS.filter((q) => q.section === s.key)
          const done = qs.some((q) => hasAnswer(wizard, q))
          const active = i === sectionIdx
          return (
            <button
              key={s.key}
              onClick={() => setSectionIdx(i)}
              className={`text-[11px] font-ui px-2 py-0.5 rounded-full ${
                active
                  ? 'bg-hs-orange text-white font-semibold'
                  : done
                    ? 'bg-hs-green/15 text-hs-green'
                    : 'bg-hs-canvas text-hs-text-light hover:text-hs-navy'
              }`}
            >
              {done && !active ? '✓ ' : ''}
              {s.label}
            </button>
          )
        })}
      </div>

      <SectionNav className="mb-3" />

      {/* One card per section; questions as compact rows */}
      <div className="rounded-lg border border-hs-border bg-white px-4 divide-y divide-hs-canvas">
        {sectionQuestions.map((q) => (
          <div key={q.qid} className="py-3">
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <h3 className="font-ui font-semibold text-hs-navy text-[13px]">{q.prompt}</h3>
              {(q.hint || q.type === 'multi' || q.optional) && (
                <span className="text-[10px] font-ui text-hs-text-light shrink-0">
                  {q.optional ? 'Optional' : q.hint || 'Select all that apply'}
                </span>
              )}
            </div>
            <QuestionControl question={q} />
          </div>
        ))}
      </div>

      <SectionNav className="mt-4" />
    </StepBody>
  )
}
