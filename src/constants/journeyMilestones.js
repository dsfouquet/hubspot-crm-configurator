// Journey milestone metadata + smart defaults. The "Customer Journey" config
// step toggles these; HubJourney renders only the enabled ones. Defaults derive
// from discovery answers (no marketing signals -> journey starts at outreach),
// and the user's explicit overrides (session.journey.overrides) win.

export const JOURNEY_MILESTONES = [
  { id: 'search', phase: 'ATTRACT', icon: '🔍', label: 'Website & search (SEO)' },
  { id: 'ads', phase: 'ATTRACT', icon: '📢', label: 'Paid ads (Google / Meta / LinkedIn)' },
  { id: 'social', phase: 'ATTRACT', icon: '💬', label: 'Social & content engagement' },
  { id: 'cold_outreach', phase: 'ATTRACT', icon: '🧊', label: 'Cold outreach (sequences, calls, LinkedIn)' },
  { id: 'warm_outreach', phase: 'ATTRACT', icon: '🔥', label: 'Warm outreach (past clients, referrals)' },
  { id: 'direct', phase: 'ATTRACT', icon: '📞', label: 'Direct inbound calls & emails' },
  { id: 'form', phase: 'ATTRACT', icon: '📝', label: 'Website forms' },
  { id: 'route', phase: 'CONVERT', icon: '⚡', label: 'Instant lead routing (speed-to-lead)' },
  { id: 'ai_prep', phase: 'CONVERT', icon: '🤖', label: 'AI prep & playbooks' },
  { id: 'intel', phase: 'CONVERT', icon: '🗂', label: 'Detail capture for later' },
  { id: 'nurture', phase: 'CONVERT', icon: '📧', label: 'Marketing email nurture' },
  { id: 'score', phase: 'CONVERT', icon: '🎯', label: 'Lead scoring (MQL → SQL handoff)' },
  { id: 'sales_nurture', phase: 'CONVERT', icon: '🤙', label: 'Sales nurture (calls, visits, lunches)' },
  { id: 'meeting', phase: 'CLOSE', icon: '📅', label: 'Self-booking appointments' },
  { id: 'stages', phase: 'CLOSE', icon: '📊', label: 'Deal stages with automation' },
  { id: 'quote', phase: 'CLOSE', icon: '🧾', label: 'Quote → e-sign → deposit' },
  { id: 'handoff', phase: 'DELIVER', icon: '🤝', label: 'Closed-won handoff to ops' },
  { id: 'fulfill', phase: 'DELIVER', icon: '📦', label: 'Fulfillment & invoicing sync' },
  { id: 'support', phase: 'RETAIN', icon: '🛟', label: 'Service tickets & help desk' },
  { id: 'feedback', phase: 'RETAIN', icon: '⭐', label: 'Surveys, reviews & alerts' },
  { id: 'retain', phase: 'RETAIN', icon: '🔁', label: 'Renewals & re-engagement' },
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

  const on = new Set()
  // Core sales/ops/retain steps — always on by default.
  ;['direct', 'route', 'ai_prep', 'intel', 'sales_nurture', 'meeting', 'stages', 'quote',
    'handoff', 'fulfill', 'support', 'feedback', 'retain'].forEach((id) => on.add(id))

  if (marketingSignal) {
    on.add('search')
    on.add('form')
    on.add('social')
    on.add('nurture')
    on.add('score')
  }
  if (!answered || sources.includes('Paid ads') || pains.includes('marketing_attribution')) {
    on.add('ads')
  }
  if (!answered || sources.includes('Cold outreach') || team.includes('B2B Sales (outbound focused)')) {
    on.add('cold_outreach')
  }
  if (
    !answered ||
    sources.includes('Referrals') ||
    sources.includes('Repeat clients') ||
    sources.includes('Brokers / partners') ||
    pains.includes('no_reengagement')
  ) {
    on.add('warm_outreach')
  }
  return on
}

// Effective enabled state: explicit user override wins, else the derived default.
export function journeyEnabled(session, id) {
  const override = session?.journey?.overrides?.[id]
  if (override !== undefined) return override
  return journeyDefaults(session).has(id)
}
