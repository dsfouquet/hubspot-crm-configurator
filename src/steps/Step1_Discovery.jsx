import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  DISCOVERY_QUESTIONS,
  DISCOVERY_SECTIONS,
  ALL_PAIN_IDS,
} from '../constants/discoveryQuestions'
import { StepHeader, StepBody } from '../shared/StepLayout'
import QuestionControl from '../shared/QuestionControl'
import { buildFixPlan, buildConfigPatch } from '../utils/solutionEngine'

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
          Quick
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
              <QuestionControl question={q} />
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
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-[3px] disabled:opacity-50"
          >
            Build My Fix Plan →
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
        className="text-[12px] font-ui font-medium text-hs-text-dark px-2.5 py-1 rounded-[3px] border border-hs-border disabled:opacity-40"
      >
        ← {sectionIdx > 0 ? DISCOVERY_SECTIONS[sectionIdx - 1].label : 'Back'}
      </button>
      {isLastSection ? (
        <button
          onClick={finish}
          disabled={building}
          className="text-[12px] font-ui font-semibold text-white bg-hs-orange px-3.5 py-1 rounded-[3px] disabled:opacity-50"
        >
          {building ? 'Building…' : 'Build My Fix Plan →'}
        </button>
      ) : (
        <button
          onClick={() => setSectionIdx((n) => n + 1)}
          className="text-[12px] font-ui font-semibold text-white bg-hs-orange px-3.5 py-1 rounded-[3px]"
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
            <h3 className="font-ui font-semibold text-hs-navy text-[13px] leading-snug">
              {q.prompt}
            </h3>
            {(q.hint || q.type === 'multi' || q.optional) && (
              <p className="text-[10px] font-ui text-hs-text-light mt-0.5 mb-1.5">
                {q.optional ? 'Optional' : q.hint || 'Select all that apply'}
              </p>
            )}
            {!(q.hint || q.type === 'multi' || q.optional) && <div className="mb-1.5" />}
            <QuestionControl question={q} />
          </div>
        ))}
      </div>

      <SectionNav className="mt-4" />
    </StepBody>
  )
}
