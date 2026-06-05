import { useStore } from '../store/useStore'
import { STEPS } from '../constants/steps'

// Bottom bar: progress bar + step counter + Back/Next.
export default function Footer() {
  const currentStep = useStore((s) => s.currentStep)
  const nextStep = useStore((s) => s.nextStep)
  const prevStep = useStore((s) => s.prevStep)

  const pct = Math.round(((currentStep + 1) / STEPS.length) * 100)
  const isLast = currentStep === STEPS.length - 1

  return (
    <footer className="shrink-0 bg-white border-t border-hs-border">
      <div className="h-1 bg-hs-canvas">
        <div
          className="h-full bg-hs-orange transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="text-sm font-ui font-medium text-hs-text-dark px-4 py-2 rounded-md border border-hs-border hover:border-hs-text-light disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <span className="text-[13px] font-ui text-hs-text-light">
          Step {currentStep + 1} of {STEPS.length}
        </span>
        <button
          onClick={nextStep}
          disabled={isLast}
          className="text-sm font-ui font-semibold text-white bg-hs-orange hover:bg-hs-orange/90 px-5 py-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </footer>
  )
}
