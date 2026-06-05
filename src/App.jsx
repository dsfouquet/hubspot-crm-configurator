import { useStore } from './store/useStore'
import Header from './layout/Header'
import StepNav from './layout/StepNav'
import ConfigPanel from './layout/ConfigPanel'
import PreviewPane from './layout/PreviewPane'
import Footer from './layout/Footer'
import AdvisorPanel from './layout/AdvisorPanel'
import EmailGateModal from './modals/EmailGateModal'

export default function App() {
  const gatePassed = useStore((s) => s.gatePassed)
  const presenterMode = useStore((s) => s.presenterMode)
  const toggleAdvisor = useStore((s) => s.toggleAdvisor)

  // Landing gate blocks the app until name+email (async) or Start Live Session.
  if (!gatePassed) return <EmailGateModal />

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      {/* Main split area */}
      <div className="flex-1 flex min-h-0 relative">
        {presenterMode ? (
          // Presenter mode: slim icon nav + full-width preview
          <>
            <StepNav collapsed />
            <PreviewPane />
            {/* Floating advisor button (hidden from screen-share side of the eye) */}
            <button
              onClick={toggleAdvisor}
              className="fixed bottom-5 right-5 z-20 w-11 h-11 rounded-full bg-hs-navy text-white shadow-lg flex items-center justify-center"
              title="Advisor Panel"
            >
              🔒
            </button>
          </>
        ) : (
          // Normal mode: step nav (chrome) + a 30/70 config|preview content area
          <>
            <StepNav />
            <div className="flex-1 flex min-w-0">
              <ConfigPanel />
              <PreviewPane />
            </div>
          </>
        )}

        <AdvisorPanel />
      </div>

      {!presenterMode && <Footer />}
    </div>
  )
}
