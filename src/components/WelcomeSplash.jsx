import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

// Brief full-screen welcome shown right after the gate is passed.
// Async: "Welcome, {name} — let's customize your build. Time to plug the leaks."
// Live:  "Let's begin your HubSpot demo. Watch your sales process run itself."
// Auto-dismisses after ~4.4s; any click skips.
export default function WelcomeSplash({ onDone }) {
  const name = useStore((s) => s.session.gate.name)
  const isLive = useStore((s) => s.session.mode === 'live')
  const [stage, setStage] = useState(0)

  const first = (name || '').trim().split(/\s+/)[0]

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 900)
    const t2 = setTimeout(() => setStage(2), 3800)
    const t3 = setTimeout(onDone, 4400)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      onClick={onDone}
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-hs-navy cursor-pointer transition-opacity duration-500 ${
        stage === 2 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Pulsing crescent mark */}
      <svg width="56" height="56" viewBox="0 0 32 32" className="animate-pulse mb-6">
        <path d="M22 4a12 12 0 1 0 0 24 9 9 0 0 1 0-24Z" fill="#FF7A59" />
        <circle cx="23" cy="16" r="2.5" fill="#FFFFFF" />
      </svg>

      <h1
        className={`font-ui font-bold text-white text-3xl text-center transition-all duration-700 ${
          stage >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {isLive ? "Let's begin your HubSpot demo" : first ? `Welcome, ${first}` : 'Welcome'}
      </h1>

      <p
        className={`mt-3 font-ui text-white/80 text-lg text-center transition-all duration-700 ${
          stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {isLive ? (
          'Watch your sales process run itself.'
        ) : (
          <>
            Let's customize your build —{' '}
            <span className="text-hs-orange font-semibold">time to plug the leaks.</span>
          </>
        )}
      </p>

      <p className="absolute bottom-6 text-[11px] font-ui text-white/40">click to skip</p>
    </div>
  )
}
