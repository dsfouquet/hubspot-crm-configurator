import { useStore } from '../store/useStore'

// Daniel-only collapsible drawer (spec 3.3). Slides in from the right, sits on top
// of the preview — not part of the screen-share area in presenter mode.
// Tier indicator is stubbed here and fully wired in build phase 6.
export default function AdvisorPanel() {
  const advisorOpen = useStore((s) => s.advisorOpen)
  const toggleAdvisor = useStore((s) => s.toggleAdvisor)
  const advisorNotes = useStore((s) => s.session.advisorNotes)
  const setAdvisorNotes = useStore((s) => s.setAdvisorNotes)
  const sessionCode = useStore((s) => s.session.sessionCode)

  if (!advisorOpen) return null

  return (
    <>
      {/* Click-away scrim (transparent — preview stays visible) */}
      <div className="fixed inset-0 z-30" onClick={toggleAdvisor} />
      <aside className="fixed top-0 right-0 z-40 h-full w-80 bg-white border-l border-hs-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b border-hs-border shrink-0">
          <span className="font-ui font-semibold text-hs-navy text-sm flex items-center gap-1.5">
            🔒 Advisor Panel
          </span>
          <button
            onClick={toggleAdvisor}
            className="text-hs-text-light hover:text-hs-navy text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hs-scroll p-4 space-y-5">
          {/* Tier indicator — wired to tierCalculator in phase 6 */}
          <section>
            <h4 className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              Required HubSpot Tier
            </h4>
            <div className="rounded-lg border border-hs-border p-3 text-sm text-hs-text-light font-ui">
              Tier indicator loads once configuration begins.
            </div>
          </section>

          {/* Session controls */}
          <section>
            <h4 className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              Session
            </h4>
            <div className="rounded-lg border border-hs-border p-3 font-ui">
              <div className="text-xs text-hs-text-light">Session code</div>
              <div className="text-lg font-semibold text-hs-navy tracking-widest">
                {sessionCode}
              </div>
            </div>
          </section>

          {/* Discovery notes — private, never in prospect output */}
          <section>
            <h4 className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              Discovery Notes
            </h4>
            <textarea
              value={advisorNotes}
              onChange={(e) => setAdvisorNotes(e.target.value)}
              placeholder="Private scratch pad — not shared with the prospect."
              className="w-full h-40 rounded-lg border border-hs-border p-3 text-sm font-ui resize-none focus:outline-none focus:border-hs-blue"
            />
          </section>
        </div>
      </aside>
    </>
  )
}
