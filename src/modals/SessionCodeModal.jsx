import { useState } from 'react'
import { useStore } from '../store/useStore'
import { shareableUrl } from '../utils/sessionId'
import { sendCompletionEmails } from '../utils/emailSender'

// Live-session handoff (spec Step 11, live mode): show the 6-char code the prospect
// can enter to restore their session, and optionally email them the continue-link.
export default function SessionCodeModal({ onClose }) {
  const session = useStore((s) => s.session)
  const [email, setEmail] = useState(session.gate?.email || '')
  const [copied, setCopied] = useState(false)
  const [sendState, setSendState] = useState('idle') // idle | sending | sent | error

  const url = shareableUrl(session.sessionId)

  const copyCode = () => {
    navigator.clipboard?.writeText(session.sessionCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sendLink = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    setSendState('sending')
    const res = await sendCompletionEmails({ ...session, gate: { ...session.gate, email } })
    setSendState(res.sent ? 'sent' : 'error')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hs-navy/60 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 h-14 border-b border-hs-border">
          <h2 className="font-ui font-semibold text-hs-navy">Hand off this session</h2>
          <button onClick={onClose} className="text-hs-text-light hover:text-hs-navy text-lg">
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Session code */}
          <div>
            <p className="text-[13px] font-ui font-semibold text-hs-text-dark mb-1">
              Session code
            </p>
            <p className="text-[12px] font-ui text-hs-text-light mb-2">
              The prospect enters this at the app URL to restore everything you built together.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 text-center text-2xl font-ui font-bold tracking-[0.3em] text-hs-navy bg-hs-canvas border border-hs-border rounded-lg py-3">
                {session.sessionCode}
              </div>
              <button
                onClick={copyCode}
                className="text-[13px] font-ui font-semibold text-white bg-hs-navy px-4 py-3 rounded-lg"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Email the link */}
          <div>
            <p className="text-[13px] font-ui font-semibold text-hs-text-dark mb-1">
              Email the continue-link to the prospect
            </p>
            <div className="flex items-center gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prospect@company.com"
                className="flex-1 rounded-md border border-hs-border px-3 py-2 text-sm font-ui focus:outline-none focus:border-hs-blue"
              />
              <button
                onClick={sendLink}
                disabled={sendState === 'sending'}
                className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md disabled:opacity-50"
              >
                {sendState === 'sending' ? 'Sending…' : 'Send link'}
              </button>
            </div>
            {sendState === 'sent' && (
              <p className="text-[12px] font-ui text-hs-green mt-1">✓ Link sent.</p>
            )}
            {sendState === 'error' && (
              <p className="text-[12px] font-ui text-hs-text-light mt-1">
                Email isn't configured yet — share the link below manually.
              </p>
            )}
          </div>

          {/* Copyable URL fallback */}
          <div className="text-[12px] font-ui text-hs-text-light break-all bg-hs-canvas border border-hs-border rounded-md p-2">
            {url}
          </div>
        </div>
      </div>
    </div>
  )
}
