import { useStore } from '../store/useStore'
import { STEPS } from '../constants/steps'

// Consistent step header (step number + title + optional intro text).
export function StepHeader({ index, intro }) {
  const step = STEPS[index]
  return (
    <div className="mb-5">
      <div className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
        Step {index + 1} of {STEPS.length}
      </div>
      <h2 className="mt-1 font-ui font-semibold text-hs-navy text-xl">{step.label}</h2>
      {intro && <p className="mt-2 text-sm text-hs-text-dark font-ui">{intro}</p>}
    </div>
  )
}

// Titled config block with a thin divider.
export function ConfigSection({ title, hint, children }) {
  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-ui font-semibold text-hs-navy text-[15px]">{title}</h3>
        {hint && <span className="text-[12px] font-ui text-hs-text-light">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

// Wraps a step body with the standard padding + scroll.
export function StepBody({ children }) {
  const presenterMode = useStore((s) => s.presenterMode)
  return <div className={`p-6 ${presenterMode ? 'hidden' : ''}`}>{children}</div>
}
