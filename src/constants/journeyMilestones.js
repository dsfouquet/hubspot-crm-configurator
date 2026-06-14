// Journey milestone metadata + smart defaults. The "Customer Journey" config
// step toggles these; HubJourney renders only the enabled ones. Defaults derive
// from discovery answers (no marketing signals -> journey starts at outreach),
// and the user's explicit overrides (session.journey.overrides) win.
//
// Step set was consolidated (June 2026) from 21 milestones to 14 so the board
// scans in seconds: the lead-source channels merged into find_online / outreach /
// inbound, and the convert phase folded scoring + sales-nurture into nurture.

export const JOURNEY_MILESTONES = [
  { id: 'find_online', phase: 'ATTRACT', icon: '🔍', label: 'They find you (search, ads, content)' },
  { id: 'outreach', phase: 'ATTRACT', icon: '📣', label: 'Outreach runs in the background' },
  { id: 'inbound', phase: 'ATTRACT', icon: '📥', label: 'Inbound calls, emails, and forms' },
  { id: 'route', phase: 'CONVERT', icon: '⚡', label: 'Instant lead routing (speed-to-lead)' },
  { id: 'nurture', phase: 'CONVERT', icon: '📧', label: 'Stay-warm nurture and sales alert' },
  { id: 'ai_prep', phase: 'CONVERT', icon: '🤖', label: 'AI prep and playbooks' },
  { id: 'meeting', phase: 'CLOSE', icon: '📅', label: 'Self-booking appointments' },
  { id: 'stages', phase: 'CLOSE', icon: '📊', label: 'Deal stages with automation' },
  { id: 'quote', phase: 'CLOSE', icon: '🧾', label: 'Quote, sign, deposit' },
  { id: 'handoff', phase: 'DELIVER', icon: '🤝', label: 'Closed-won handoff to ops' },
  { id: 'fulfill', phase: 'DELIVER', icon: '📦', label: 'Fulfillment and invoicing sync' },
  { id: 'support', phase: 'RETAIN', icon: '🛟', label: 'Service tickets and help desk' },
  { id: 'feedback', phase: 'RETAIN', icon: '⭐', label: 'Surveys, reviews, and alerts' },
  { id: 'retain', phase: 'RETAIN', icon: '🔁', label: 'Renewals and re-engagement' },
]

const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])

// Derive which milestones SHOULD be on, from discovery answers.
// Unanswered discovery -> everything on (full showcase).
export function journeyDefaults(session) {
  const w = session?.wizard || {}
  const sources = arr(w.leadSources)
  const team = arr(w.teamType)
  const pains = arr(w.pains)
  const answered = sources.length > 0 || team.length > 0

  const marketingSignal =
    !answered ||
    sources.includes('Inbound / website') ||
    sources.includes('Paid ads') ||
    sources.includes('Events / trade shows') ||
    team.includes('B2B Sales (inbound/marketing led)') ||
    ['marketing_email_gap', 'landing_pages_gap', 'content_seo_gap', 'marketing_attribution'].some(
      (p) => pains.includes(p)
    )

  const outreachSignal =
    !answered ||
    sources.includes('Cold outreach') ||
    sources.includes('Referrals') ||
    sources.includes('Repeat clients') ||
    sources.includes('Brokers / partners') ||
    team.includes('B2B Sales (outbound focused)') ||
    pains.includes('no_reengagement')

  const on = new Set()
  // Core convert/close/deliver/retain steps + inbound capture are always on.
  ;['inbound', 'route', 'nurture', 'ai_prep', 'meeting', 'stages', 'quote',
    'handoff', 'fulfill', 'support', 'feedback', 'retain'].forEach((id) => on.add(id))

  if (marketingSignal) on.add('find_online')
  if (outreachSignal) on.add('outreach')
  return on
}

// Effective enabled state: explicit user override wins, else the derived default.
export function journeyEnabled(session, id) {
  const override = session?.journey?.overrides?.[id]
  if (override !== undefined) return override
  return journeyDefaults(session).has(id)
}
