import { useEffect, useRef, useState } from 'react'
import { useStore } from './store/useStore'
import WelcomeSplash from './components/WelcomeSplash'
import Header from './layout/Header'
import StepNav from './layout/StepNav'
import ConfigPanel from './layout/ConfigPanel'
import PreviewPane from './layout/PreviewPane'
import Footer from './layout/Footer'
import AdvisorPanel from './layout/AdvisorPanel'
import SplitPane from './layout/SplitPane'
import EmailGateModal from './modals/EmailGateModal'
import Step11_Preview from './steps/Step11_Preview'
import BlueprintDocument from './components/BlueprintDocument'
import { STEPS } from './constants/steps'

export default function App() {
  const gatePassed = useStore((s) => s.gatePassed)
  const presenterMode = useStore((s) => s.presenterMode)
  const toggleAdvisor = useStore((s) => s.toggleAdvisor)
  const currentStep = useStore((s) => s.currentStep)
  const saveNow = useStore((s) => s.saveNow)

  const isPreviewStep = STEPS[currentStep].key === 'preview'

  // Welcome splash: fires once when the gate transitions to passed.
  const [showSplash, setShowSplash] = useState(false)
  const prevGate = useRef(gatePassed)
  useEffect(() => {
    if (!prevGate.current && gatePassed) setShowSplash(true)
    prevGate.current = gatePassed
  }, [gatePassed])

  // Flush the session to localStorage on tab close / hide (beats the 500ms debounce).
  useEffect(() => {
    const flush = () => saveNow()
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', flush)
    return () => {
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', flush)
    }
  }, [saveNow])

  // Landing gate blocks the app until name+email (async) or Start Live Session.
  if (!gatePassed) return <EmailGateModal />

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showSplash && <WelcomeSplash onDone={() => setShowSplash(false)} />}
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
        ) : isPreviewStep ? (
          // Final step: nav + full-width tabbed HubSpot preview
          <>
            <StepNav />
            <div className="flex-1 min-w-0">
              <Step11_Preview />
            </div>
          </>
        ) : (
          // Normal mode: step nav (chrome) + a user-resizable config|preview split
          <>
            <StepNav />
            <SplitPane left={<ConfigPanel />} right={<PreviewPane />} />
          </>
        )}

        <AdvisorPanel />
      </div>

      {!presenterMode && !isPreviewStep && <Footer />}

      {/* Off-screen printable doc — target for PDF export (available anytime) */}
      <div
        aria-hidden
        style={{ position: 'absolute', left: -10000, top: 0, pointerEvents: 'none' }}
      >
        <BlueprintDocument />
      </div>
    </div>
  )
}
