import { STEPS } from '../constants/steps'

// Placeholder shown until each step's real component is built (build phase 2+).
function Placeholder({ index }) {
  const step = STEPS[index]
  return (
    <div className="p-6">
      <div className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
        Step {index + 1}
      </div>
      <h2 className="mt-1 font-ui font-semibold text-hs-navy text-xl">{step.label}</h2>
      <p className="mt-3 text-sm text-hs-text-light font-ui">
        This step's configuration UI is coming in the next build pass.
      </p>
    </div>
  )
}

// Maps step key → config component. Replace placeholders as steps are built.
export const STEP_COMPONENTS = {
  wizard: (i) => <Placeholder index={i} />,
  contacts: (i) => <Placeholder index={i} />,
  companies: (i) => <Placeholder index={i} />,
  deals: (i) => <Placeholder index={i} />,
  tickets: (i) => <Placeholder index={i} />,
  customObjects: (i) => <Placeholder index={i} />,
  workflows: (i) => <Placeholder index={i} />,
  views: (i) => <Placeholder index={i} />,
  dashboards: (i) => <Placeholder index={i} />,
  cadence: (i) => <Placeholder index={i} />,
  preview: (i) => <Placeholder index={i} />,
}
