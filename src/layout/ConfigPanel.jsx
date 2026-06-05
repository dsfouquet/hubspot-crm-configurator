import { useStore } from '../store/useStore'
import { STEPS } from '../constants/steps'
import { STEP_COMPONENTS } from '../steps/registry'

// Left configuration panel — renders the current step's config UI.
export default function ConfigPanel() {
  const currentStep = useStore((s) => s.currentStep)
  const stepKey = STEPS[currentStep].key
  const render = STEP_COMPONENTS[stepKey]

  return (
    <section className="w-[30%] min-w-[340px] shrink-0 bg-white border-r border-hs-border overflow-y-auto hs-scroll">
      {render(currentStep)}
    </section>
  )
}
