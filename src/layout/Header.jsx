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
        <DownloadPdfButton variant="header" />
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
          <span>🎥</span> Presenter Mode
        </button>
        <button
          onClick={toggleAdvisor}
          className="flex items-center gap-1.5 text-sm font-ui font-medium text-white bg-hs-navy hover:bg-hs-navy/90 px-3 py-1.5 rounded-md"
        >
          <span>🔒</span> Advisor Panel
        </button>
      </div>
    </header>
  )
}
