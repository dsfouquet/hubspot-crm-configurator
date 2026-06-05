import { useState } from 'react'
import { useStore } from '../store/useStore'
import { WIZARD_QUESTIONS } from '../constants/wizardQuestions'
import { StepHeader, StepBody } from '../shared/StepLayout'

// One-question-per-screen wizard (spec Step 1). Drives recommendations in Steps 7 & 8.
export default function Step1_Wizard({ index }) {
  const wizard = useStore((s) => s.session.wizard)
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  const [q, setQ] = useState(0)

  const question = WIZARD_QUESTIONS[q]
  const answer = wizard[question.key]
  const isLastQuestion = q === WIZARD_QUESTIONS.length - 1

  const selectSingle = (opt) => setWizardAnswer(question.key, opt)

  const toggleMulti = (opt) => {
    const current = Array.isArray(answer) ? answer : []
    if (current.includes(opt)) {
      setWizardAnswer(question.key, current.filter((o) => o !== opt))
    } else {
      if (question.max && current.length >= question.max) return
      setWizardAnswer(question.key, [...current, opt])
    }
  }

  const isSelected = (opt) =>
    question.type === 'single' ? answer === opt : Array.isArray(answer) && answer.includes(opt)

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="A few quick questions so we can tailor your views, dashboards, and automations."
      />

      {/* Question progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {WIZARD_QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === q ? 'w-6 bg-hs-orange' : i < q ? 'w-3 bg-hs-green' : 'w-3 bg-hs-border'
            }`}
          />
        ))}
      </div>

      <div className="rounded-lg border border-hs-border bg-white p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-ui font-semibold text-hs-navy text-lg">{question.prompt}</h3>
          <span className="text-[12px] font-ui text-hs-text-light shrink-0 ml-3">
            {question.type === 'multi'
              ? question.max
                ? `Select up to ${question.max}`
                : 'Select all that apply'
              : 'Pick one'}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => (question.type === 'single' ? selectSingle(opt) : toggleMulti(opt))}
              className={`w-full text-left flex items-center gap-3 rounded-md border px-3 py-2.5 text-[14px] font-ui transition-colors ${
                isSelected(opt)
                  ? 'border-hs-orange bg-hs-orange/10 text-hs-navy'
                  : 'border-hs-border bg-white text-hs-text-dark hover:border-hs-text-light'
              }`}
            >
              <span
                className={`flex items-center justify-center w-4 h-4 shrink-0 ${
                  question.type === 'single' ? 'rounded-full' : 'rounded'
                } border ${
                  isSelected(opt) ? 'bg-hs-orange border-hs-orange text-white' : 'border-hs-border'
                }`}
              >
                {isSelected(opt) && <span className="text-[10px] leading-none">✓</span>}
              </span>
              {opt}
            </button>
          ))}

          {question.allowOther && (
            <input
              value={
                typeof answer === 'string' && !question.options.includes(answer) ? answer : ''
              }
              onChange={(e) => setWizardAnswer(question.key, e.target.value)}
              placeholder="Other (type your own)…"
              className="w-full rounded-md border border-hs-border px-3 py-2.5 text-[14px] font-ui focus:outline-none focus:border-hs-blue"
            />
          )}
        </div>

        {/* Inner question nav */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setQ((n) => Math.max(0, n - 1))}
            disabled={q === 0}
            className="text-[13px] font-ui font-medium text-hs-text-dark px-3 py-1.5 rounded-md border border-hs-border disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-[12px] font-ui text-hs-text-light">
            Question {q + 1} of {WIZARD_QUESTIONS.length}
          </span>
          {isLastQuestion ? (
            <span className="text-[13px] font-ui text-hs-green font-medium">
              ✓ Use "Next →" to continue
            </span>
          ) : (
            <button
              onClick={() => setQ((n) => Math.min(WIZARD_QUESTIONS.length - 1, n + 1))}
              className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-1.5 rounded-md"
            >
              Next question →
            </button>
          )}
        </div>
      </div>
    </StepBody>
  )
}
