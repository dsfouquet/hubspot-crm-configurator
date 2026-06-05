import { STEPS } from '../constants/steps'
import Step1_Wizard from './Step1_Wizard'
import RecordStep from './RecordStep'
import Step6_CustomObjects from './Step6_CustomObjects'
import Step7_Workflows from './Step7_Workflows'
import Step8_Views from './Step8_Views'
import Step9_Dashboards from './Step9_Dashboards'
import Step10_Cadence from './Step10_Cadence'

// Placeholder shown until each step's real component is built (build phase 3+).
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
  wizard: (i) => <Step1_Wizard index={i} />,
  contacts: (i) => (
    <RecordStep
      index={i}
      slice="contacts"
      intro="Configure the fields and layout for your Contact records."
    />
  ),
  companies: (i) => (
    <RecordStep
      index={i}
      slice="companies"
      intro="Configure the fields and layout for your Company records."
    />
  ),
  deals: (i) => (
    <RecordStep
      index={i}
      slice="deals"
      intro="Configure your Deal records and pipeline stages."
      pipeline
      pipelineProbability
      pipelineTitle="Pipeline Stage Configurator"
    />
  ),
  tickets: (i) => (
    <RecordStep
      index={i}
      slice="tickets"
      intro="Configure your support Ticket records and pipeline."
      pipeline
      pipelineProbability={false}
      pipelineTitle="Ticket Pipeline Stages"
    />
  ),
  customObjects: (i) => <Step6_CustomObjects index={i} />,
  workflows: (i) => <Step7_Workflows index={i} />,
  views: (i) => <Step8_Views index={i} />,
  dashboards: (i) => <Step9_Dashboards index={i} />,
  cadence: (i) => <Step10_Cadence index={i} />,
  preview: (i) => <Placeholder index={i} />,
}
