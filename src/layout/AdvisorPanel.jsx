import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import TierIndicator from '../shared/TierIndicator'
import { shareableUrl } from '../utils/sessionId'

// Daniel-only collapsible drawer (spec 3.3). Slides in from the right, sits on top
// of the preview — not part of the screen-share area in presenter mode.
export default function AdvisorPanel() {
  const advisorOpen = useStore((s) => s.advisorOpen)
  const toggleAdvisor = useStore((s) => s.toggleAdvisor)
  const advisorNotes = useStore((s) => s.session.advisorNotes)
  const setAdvisorNotes = useStore((s) => s.setAdvisorNotes)
  const sessionCode = useStore((s) => s.session.sessionCode)
  const sessionId = useStore((s) => s.session.sessionId)
  const [copied, setCopied] = useState('')

  const copy = (text, what) => {
    navigator.clipboard?.writeText(text)
    setCopied(what)
    setTimeout(() => setCopied(''), 1500)
  }

  // Escape closes the drawer.
  useEffect(() => {
    if (!advisorOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') toggleAdvisor()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advisorOpen, toggleAdvisor])

  if (!advisorOpen) return null

  return (
    <>
      {/* Click-away scrim (transparent — preview stays visible) */}
      <div className="fixed inset-0 z-30" onClick={toggleAdvisor} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Advisor panel"
        className="fixed top-0 right-0 z-40 h-full w-80 bg-white border-l border-hs-border shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-hs-border shrink-0">
          <span className="font-ui font-semibold text-hs-navy text-sm flex items-center gap-1.5">
            <span aria-hidden>🔒</span> Advisor Panel
          </span>
          <button
            onClick={toggleAdvisor}
            aria-label="Close advisor panel"
            className="text-hs-text-light hover:text-hs-navy text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hs-scroll p-4 space-y-5">
          {/* Live tier indicator */}
          <section>
            <h4 className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              Required HubSpot Tier
            </h4>
            <TierIndicator />
          </section>

          {/* Session controls */}
          <section>
            <h4 className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
              Session
            </h4>
            <div className="rounded-lg border border-hs-border p-3 font-ui space-y-2">
              <div>
                <div className="text-xs text-hs-text-light">Session code</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-hs-navy tracking-widest">
                    {sessionCode}
                  </span>
                  <button
                    onClick={() => copy(sessionCode, 'code')}
                    className="text-[12px] font-medium text-hs-blue hover:underline"
                  >
                    {copied === 'code' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => copy(shareableUrl(sessionId), 'link')}
                className="w-full text-[12px] font-medium text-white bg-hs-navy rounded px-2 py-1.5"
              >
                {copied === 'link' ? '✓ Link copied' : 'Copy session link'}
              </button>
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
