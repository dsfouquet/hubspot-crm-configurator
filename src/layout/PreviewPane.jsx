import { useStore } from '../store/useStore'
import { stepsForMode } from '../constants/steps'
import { PREVIEW_COMPONENTS } from '../preview/registry'

// Right preview pane — mimics the HubSpot UI. In presenter mode it goes full width
// and bumps font size ~20% for screen-share readability (spec 3.2).
export default function PreviewPane() {
  const currentStep = useStore((s) => s.currentStep)
  const presenterMode = useStore((s) => s.presenterMode)
  const STEPS = stepsForMode(useStore((s) => s.session.mode))
  const stepKey = STEPS[currentStep]?.key
  const render = PREVIEW_COMPONENTS[stepKey]
  if (!render) return null

  return (
    <section
      className={`flex-1 min-w-0 bg-hs-canvas overflow-y-auto hs-scroll font-preview ${
        presenterMode ? 'text-[1.2em]' : ''
      }`}
    >
      {render(currentStep)}
    </section>
  )
}
