import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { readUrlRoute } from '../utils/sessionId'
import { fetchSharedSession } from '../utils/shareSession'
import Step11_Preview from '../steps/Step11_Preview'
import BlueprintDocument from '../components/BlueprintDocument'

// Full-screen centered message for loading / not-found states.
function Notice({ title, subtitle }) {
  return (
    <div className="h-screen flex items-center justify-center bg-hs-canvas p-8">
      <div className="text-center max-w-sm">
        <img
          src="/cc-mark.png"
          alt="Crescent Connect"
          className="h-10 w-auto mx-auto mb-5 opacity-90"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <h1 className="font-preview font-semibold text-hs-navy text-xl">{title}</h1>
        {subtitle && (
          <p className="text-[13px] font-ui text-hs-text-light mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

// Read-only preview surface served at /p/<code>. Fetches the shared session,
// hydrates the store in 'preview' mode, then renders ONLY the HubSpot preview —
// no header, step nav, footer, or email gate. Nothing here writes to storage.
export default function SharedPreview() {
  const hydrate = useStore((s) => s.hydrateSharedPreview)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    const { code } = readUrlRoute()
    fetchSharedSession(code)
      .then((session) => {
        if (cancelled) return
        if (!session) {
          setStatus('error')
          return
        }
        hydrate(session)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [hydrate])

  if (status === 'loading') return <Notice title="Loading your HubSpot preview…" />
  if (status === 'error')
    return (
      <Notice
        title="Preview not found"
        subtitle="This link may have expired or been removed. Ask Daniel for a fresh one."
      />
    )

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <Step11_Preview readOnly />
      </div>
      {/* Off-screen printable doc — target for the Download PDF button */}
      <div
        aria-hidden
        style={{ position: 'absolute', left: -10000, top: 0, pointerEvents: 'none' }}
      >
        <BlueprintDocument />
      </div>
    </div>
  )
}
