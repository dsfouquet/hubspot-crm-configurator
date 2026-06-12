import { STEPS } from '../constants/steps'
import PreviewDiscovery from './PreviewDiscovery'
import PreviewFixPlan from './PreviewFixPlan'
import PreviewRecord from './PreviewRecord'
import PreviewDealRecord from './PreviewDealRecord'
import PreviewCustomObjects from './PreviewCustomObjects'
import PreviewAutomations from './PreviewAutomations'
import PreviewViews from './PreviewViews'
import PreviewDashboard from './PreviewDashboard'
import PreviewCadence from './PreviewCadence'
import Step11_Preview from '../steps/Step11_Preview'
import HubJourney from './hubs/HubJourney'

// Placeholder preview shown until each step's real preview is built.
function PreviewPlaceholder({ index }) {
  const step = STEPS[index]
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-12 h-12 rounded-lg bg-white border border-hs-border flex items-center justify-center text-xl shadow-sm">
          🪄
        </div>
        <h3 className="mt-4 font-preview font-semibold text-hs-navy">
          Live Preview — {step.label}
        </h3>
        <p className="mt-2 text-sm text-hs-text-light font-preview">
          As you configure this step, a live HubSpot-style preview will render here.
        </p>
      </div>
    </div>
  )
}

// Maps step key → preview component. Replace placeholders as previews are built.
export const PREVIEW_COMPONENTS = {
  wizard: () => <PreviewDiscovery />,
  fixPlan: () => <PreviewFixPlan />,
  contacts: () => <PreviewRecord slice="contacts" showIndexTable />,
  companies: () => <PreviewRecord slice="companies" showIndexTable />,
  deals: () => <PreviewDealRecord />,
  tickets: () => <PreviewRecord slice="tickets" showIndexTable />,
  customObjects: () => <PreviewCustomObjects />,
  workflows: () => <PreviewAutomations />,
  views: () => <PreviewViews />,
  dashboards: () => <PreviewDashboard />,
  cadence: () => <PreviewCadence />,
  journeyMap: () => <HubJourney />,
  preview: () => <Step11_Preview />,
}
