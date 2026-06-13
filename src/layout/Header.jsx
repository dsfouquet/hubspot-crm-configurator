import Logo from '../components/Logo'
import { useStore } from '../store/useStore'
import DownloadPdfButton from '../components/DownloadPdfButton'

// Top header bar. Two looks: normal mode (full chrome) vs. presenter mode (simplified).
export default function Header() {
  const presenterMode = useStore((s) => s.presenterMode)
  const togglePresenter = useStore((s) => s.togglePresenter)
  const toggleAdvisor = useStore((s) => s.toggleAdvisor)
  const name = useStore((s) => s.session.gate.name)
  const isCustomer = useStore((s) => s.session.mode) !== 'live'
  const currentStep = useStore((s) => s.currentStep)
  const goToStep = useStore((s) => s.goToStep)

  // Customer mode: clean chrome — no internal tools (presenter / advisor).
  if (isCustomer) {
    return (
      <header className="flex items-center justify-between h-14 px-5 bg-white border-b border-hs-border shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
          <span className="text-hs-border hidden sm:inline">|</span>
          <span className="font-ui font-semibold text-hs-navy text-[15px] truncate hidden sm:inline">
            Your CRM, built for you
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => goToStep(0)}
              className="text-[13px] font-ui font-medium text-hs-text-light hover:text-hs-navy px-3 py-1.5 rounded-[3px] border border-hs-border"
            >
              ↺ Start over
            </button>
          )}
          <DownloadPdfButton variant="header" />
        </div>
      </header>
    )
  }

  if (presenterMode) {
    return (
      <header className="flex items-center justify-between h-14 px-5 bg-white border-b border-hs-border shrink-0">
        <Logo />
        <h1 className="font-ui font-semibold text-hs-navy text-lg">
          {name ? `${name}'s` : 'Your'} HubSpot Blueprint
        </h1>
        <button
          onClick={togglePresenter}
          className="text-sm font-ui font-medium text-hs-text-light hover:text-hs-navy px-3 py-1.5 rounded-md border border-hs-border"
        >
          Exit Presenter Mode
        </button>
      </header>
    )
  }

  return (
    <header className="flex items-center justify-between h-14 px-5 bg-white border-b border-hs-border shrink-0">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="text-hs-border">|</span>
        <span className="font-ui font-semibold text-hs-navy text-[15px]">
          HubSpot CRM Configurator
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DownloadPdfButton variant="header" />
        <button
          onClick={togglePresenter}
          className="flex items-center gap-1.5 text-sm font-ui font-medium text-hs-text-dark hover:text-hs-navy px-3 py-1.5 rounded-md border border-hs-border hover:border-hs-text-light"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="2" y="6" width="13" height="12" rx="2" />
            <path d="M22 8l-7 4 7 4V8z" />
          </svg>
          Presenter Mode
        </button>
        <button
          onClick={toggleAdvisor}
          className="flex items-center gap-1.5 text-sm font-ui font-medium text-white bg-hs-navy hover:bg-hs-navy/90 px-3 py-1.5 rounded-md"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Advisor Panel
        </button>
      </div>
    </header>
  )
}
