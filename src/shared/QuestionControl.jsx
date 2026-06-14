import { useState } from 'react'
import { useStore } from '../store/useStore'
import { CLASSIC_LEAKS, painParts } from '../constants/discoveryQuestions'

// One question's input control, shared by the presenter discovery (Step 1) and
// the customer intake. Types: single / multi / textarea / habit-matrix /
// pain-multi (checklist of pain ids rendered as bold word + short description) /
// single-from-pains (pick one of the pains already selected).
// `size`: 'compact' (presenter, dense rows) or 'large' (customer, tap targets).
export default function QuestionControl({ question, size = 'compact' }) {
  const wizard = useStore((s) => s.session.wizard)
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  const answer = wizard[question.key]
  const large = size === 'large'
  const [showClassics, setShowClassics] = useState(false)

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
      const next = answer === opt ? undefined : opt
      setWizardAnswer(question.key, next)
      if (next !== undefined) question.onPick?.(next)
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

  // Size-dependent row padding/text.
  const rowText = large ? 'text-[14px] px-3.5 py-2.5' : 'text-[12.5px] px-2.5 py-1'

  // One selectable row (used flat and inside journey-stage groups).
  const renderRow = (opt) => {
    const sel = isSelected(opt)
    return (
      <button
        key={opt}
        type="button"
        onClick={() => toggle(opt)}
        className={`w-full text-left flex items-center gap-2.5 rounded-md border font-ui transition-colors ${rowText} ${
          sel
            ? 'border-hs-orange bg-hs-orange/10'
            : 'border-hs-border bg-white hover:border-hs-text-light'
        }`}
      >
        <span
          className={`flex items-center justify-center ${large ? 'w-[18px] h-[18px]' : 'w-3.5 h-3.5'} shrink-0 ${
            isSingle ? 'rounded-full' : 'rounded'
          } border ${sel ? 'bg-hs-orange border-hs-orange text-white' : 'border-hs-border'}`}
        >
          {sel && <span className={`${large ? 'text-[11px]' : 'text-[9px]'} leading-none`}>✓</span>}
        </span>
        <OptionLabel opt={opt} />
      </button>
    )
  }

  return (
    <div>
      {isText && (
        <>
          <textarea
            value={answer || ''}
            onChange={(e) => setWizardAnswer(question.key, e.target.value)}
            placeholder={question.placeholder}
            rows={large ? 3 : 2}
            className={`hs-input w-full resize-none ${large ? 'text-[15px] px-3.5 py-2.5' : 'text-[13px] px-2.5 py-1.5'} font-ui`}
          />
          {question.quickPicks && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {question.quickPicks.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setWizardAnswer(question.key, p)}
                  className={`rounded-full border font-ui ${large ? 'text-[13px] px-3.5 py-1.5' : 'text-[11.5px] px-2.5 py-0.5'} ${
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
                        type="button"
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

      {(isSingle || isMulti) && !isText && (
        // Grouped pain-multi (journey-ordered sections) when question.groups is set;
        // otherwise a flat vertical list. Each option is a full-width row: round
        // check for single-select, square for multi-select.
        isPainMulti && question.groups?.length ? (
          <div className={large ? 'space-y-5' : 'space-y-4'}>
            {question.groups.map((group) => (
              <div key={group.key}>
                <div className="mb-1.5">
                  <span className="text-[11px] font-ui font-bold uppercase tracking-wide text-hs-orange">
                    {group.label}
                  </span>
                  {group.caption && (
                    <span className="text-[11px] font-ui text-hs-text-light"> · {group.caption}</span>
                  )}
                </div>
                <div className={large ? 'space-y-2' : 'space-y-1'}>
                  {group.painIds.map((opt) => renderRow(opt))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={large ? 'space-y-2' : 'space-y-1'}>
            {options.map((opt) => renderRow(opt))}
          </div>
        )
      )}

      {/* Classic research-backed leaks — secondary, collapsed by default so the
          prospect's own selections stay the star. Picking one also checks the pain. */}
      {isPainSingle && !question.hideClassics && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowClassics((v) => !v)}
            className="text-[12px] font-ui font-medium text-hs-calypso hover:underline"
          >
            {showClassics
              ? 'Hide the classics'
              : 'Not sure? See where most companies bleed →'}
          </button>
          {showClassics && (
            <div className="space-y-1 mt-2">
              {CLASSIC_LEAKS.map((c) => {
                const { pain } = painParts(c.painId)
                const sel = answer === c.painId
                return (
                  <button
                    key={c.painId + c.stat}
                    type="button"
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
          )}
        </div>
      )}

      {question.allowOther && (
        <input
          value={otherValue}
          onChange={(e) => setOther(e.target.value)}
          placeholder="Other…"
          className={`hs-input mt-2 w-full font-ui ${large ? 'text-[14px] px-3.5 py-2' : 'text-[12.5px] px-2.5 py-1.5'}`}
        />
      )}

      {question.optionalText && (
        <div className="mt-2">
          <label className="block text-[11px] font-ui text-hs-text-light mb-0.5">
            {question.optionalText.label}
          </label>
          <OptionalTextInput optionalText={question.optionalText} large={large} />
        </div>
      )}
    </div>
  )
}

function OptionalTextInput({ optionalText, large }) {
  const value = useStore((s) => s.session.wizard[optionalText.key] || '')
  const setWizardAnswer = useStore((s) => s.setWizardAnswer)
  return (
    <input
      value={value}
      onChange={(e) => setWizardAnswer(optionalText.key, e.target.value)}
      placeholder={optionalText.placeholder}
      className={`hs-input w-full font-ui ${large ? 'text-[14px] px-3.5 py-2' : 'text-[13px] px-2.5 py-1.5'}`}
    />
  )
}
