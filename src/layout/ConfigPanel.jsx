import { useStore } from '../store/useStore'
import { stepsForMode } from '../constants/steps'
import { STEP_COMPONENTS } from '../steps/registry'

// Left configuration panel — renders the current step's config UI.
export default function ConfigPanel() {
  const currentStep = useStore((s) => s.currentStep)
  const STEPS = stepsForMode(useStore((s) => s.session.mode))
  const stepKey = STEPS[currentStep]?.key
  const render = STEP_COMPONENTS[stepKey]
  if (!render) return null

  return (
    <section className="w-full bg-white border-r border-hs-border overflow-y-auto hs-scroll">
      {render(currentStep)}
    </section>
  )
}
