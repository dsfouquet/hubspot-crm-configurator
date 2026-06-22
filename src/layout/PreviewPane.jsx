import { useStore } from '../store/useStore'
import { stepsForMode } from '../constants/steps'
import { PREVIEW_COMPONENTS } from '../preview/registry'
import ZoomFrame from '../preview/ZoomFrame'

// Right preview pane — mimics the HubSpot UI. In presenter mode it goes full width
// and bumps font size ~20% for screen-share readability (spec 3.2). ZoomFrame owns
// the scroll so the presenter zoom can scale the demo without clipping.
export default function PreviewPane() {
  const currentStep = useStore((s) => s.currentStep)
  const presenterMode = useStore((s) => s.presenterMode)
  const STEPS = stepsForMode(useStore((s) => s.session.mode))
  const stepKey = STEPS[currentStep]?.key
  const render = PREVIEW_COMPONENTS[stepKey]
  if (!render) return null

  // The full hub preview (Step11) zooms its own demo region internally. The two
  // ReactFlow surfaces (Fix Plan story diagram + Automations flowchart) must NOT
  // sit inside a CSS transform:scale ancestor — ReactFlow measures node/edge
  // geometry off the live DOM, and a scaled ancestor distorts it (edges drop,
  // the diagram clips off the bottom). They carry ReactFlow's own zoom controls,
  // which already zoom out past 50%/25%, so they self-manage. Everything else
  // gets the in-panel ZoomFrame (25%–250%).
  const selfZooms = stepKey === 'preview' || stepKey === 'fixPlan' || stepKey === 'workflows'

  return (
    <section
      className={`flex-1 min-w-0 bg-hs-canvas overflow-hidden font-preview ${
        presenterMode ? 'text-[1.2em]' : ''
      }`}
    >
      {selfZooms ? render(currentStep) : <ZoomFrame>{render(currentStep)}</ZoomFrame>}
    </section>
  )
}
