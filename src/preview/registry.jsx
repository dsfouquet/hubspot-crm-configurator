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
        <div className="mx-auto w-12 h-12 rounded-lg bg-white border border-hs-border flex items-center justify-center text-hs-orange shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 6.2L11 5M3 21l9-9" />
          </svg>
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
  tasks: () => <PreviewRecord slice="tasks" showIndexTable />,
  tickets: () => <PreviewRecord slice="tickets" showIndexTable />,
  customObjects: () => <PreviewCustomObjects />,
  workflows: () => <PreviewAutomations />,
  views: () => <PreviewViews />,
  dashboards: () => <PreviewDashboard />,
  cadence: () => <PreviewCadence />,
  journeyMap: () => <HubJourney />,
  preview: () => <Step11_Preview />,
}
