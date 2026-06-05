import { useStore } from '../store/useStore'
import { STEPS } from '../constants/steps'

// Vertical step list. Completed = green check, active = orange, future = gray.
// In presenter mode, collapses to a slim icon-only strip.
export default function StepNav({ collapsed = false }) {
  const currentStep = useStore((s) => s.currentStep)
  const completedSteps = useStore((s) => s.session.completedSteps)
  const goToStep = useStore((s) => s.goToStep)

  return (
    <nav
      className={`${
        collapsed ? 'w-14' : 'w-56'
      } shrink-0 bg-white border-r border-hs-border overflow-y-auto hs-scroll py-3`}
    >
      <ol className="flex flex-col gap-0.5 px-2">
        {STEPS.map((step, i) => {
          const isActive = i === currentStep
          const isDone = completedSteps.includes(step.key) && !isActive
          return (
            <li key={step.key}>
              <button
                onClick={() => goToStep(i)}
                title={step.label}
                className={`w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${
                  isActive
                    ? 'bg-hs-orange/10 text-hs-navy'
                    : 'text-hs-text-dark hover:bg-hs-canvas'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold shrink-0 ${
                    isActive
                      ? 'bg-hs-orange text-white'
                      : isDone
                        ? 'bg-hs-green text-white'
                        : 'bg-hs-canvas text-hs-text-light border border-hs-border'
                  }`}
                >
                  {isDone ? '✓' : i + 1}
                </span>
                {!collapsed && (
                  <span
                    className={`text-[13px] font-ui leading-tight ${
                      isActive ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {step.label}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
