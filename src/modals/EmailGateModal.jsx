import { useState } from 'react'
import { useStore } from '../store/useStore'
import { loadSessionByCode } from '../utils/sessionId'
import Logo from '../components/Logo'

// Landing gate (spec Section 1, async flow step 2): name + email before configuring.
// Also offers "Start Live Session" for Daniel (presenter flow) which skips the gate.
export default function EmailGateModal() {
  const beginAsyncSession = useStore((s) => s.beginAsyncSession)
  const startLiveSession = useStore((s) => s.startLiveSession)
  const loadSession = useStore((s) => s.loadSession)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [showRestore, setShowRestore] = useState(false)
  const [code, setCode] = useState('')
  const [restoreError, setRestoreError] = useState('')

  const restore = (e) => {
    e.preventDefault()
    const found = loadSessionByCode(code.trim().toUpperCase())
    if (!found) {
      setRestoreError('No session found for that code on this device.')
      return
    }
    loadSession(found)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('Please enter a valid email.')
    setError('')
    beginAsyncSession(name.trim(), email.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hs-navy/60 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-hs-canvas px-7 pt-7 pb-5 border-b border-hs-border">
          <Logo />
          <h1 className="mt-4 font-ui font-bold text-hs-navy text-2xl leading-tight">
            Design your HubSpot CRM
          </h1>
          <p className="mt-2 text-sm text-hs-text-dark font-ui">
            See exactly what your CRM will look like before you build it. Takes about 10
            minutes — your progress saves automatically.
          </p>
        </div>

        <form onSubmit={submit} className="px-7 py-6 space-y-4">
          <div>
            <label className="block text-[13px] font-ui font-semibold text-hs-text-dark mb-1">
              Your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-hs-border px-3 py-2 text-sm font-ui focus:outline-none focus:border-hs-blue"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-[13px] font-ui font-semibold text-hs-text-dark mb-1">
              Work email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-hs-border px-3 py-2 text-sm font-ui focus:outline-none focus:border-hs-blue"
              placeholder="jane@company.com"
            />
          </div>
          {error && <p className="text-sm text-hs-red font-ui">{error}</p>}
          <button
            type="submit"
            className="w-full bg-hs-orange hover:bg-hs-orange/90 text-white font-ui font-semibold py-2.5 rounded-md"
          >
            Start Designing →
          </button>
        </form>

        <div className="px-7 pb-6 space-y-3">
          {showRestore ? (
            <form onSubmit={restore} className="border-t border-hs-border pt-4">
              <label className="block text-[12px] font-ui font-semibold text-hs-text-dark mb-1">
                Enter your 6-character session code
              </label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="A3F7K2"
                  className="flex-1 rounded-md border border-hs-border px-3 py-2 text-sm font-ui tracking-widest uppercase focus:outline-none focus:border-hs-blue"
                />
                <button
                  type="submit"
                  className="text-[13px] font-ui font-semibold text-white bg-hs-navy px-4 py-2 rounded-md"
                >
                  Restore
                </button>
              </div>
              {restoreError && <p className="text-[12px] text-hs-red font-ui mt-1">{restoreError}</p>}
              <button
                type="button"
                onClick={() => setShowRestore(false)}
                className="text-[12px] font-ui text-hs-text-light mt-2 hover:text-hs-navy"
              >
                ← Back
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowRestore(true)}
              className="w-full text-[13px] font-ui font-medium text-hs-blue hover:underline py-1"
            >
              Have a session code? Restore it
            </button>
          )}

          <button
            onClick={startLiveSession}
            className="w-full text-[13px] font-ui font-medium text-hs-text-light hover:text-hs-navy py-2 border-t border-hs-border pt-4"
          >
            🎥 Start Live Session (presenter)
          </button>
        </div>
      </div>
    </div>
  )
}
