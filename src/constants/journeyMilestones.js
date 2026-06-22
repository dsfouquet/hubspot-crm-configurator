// Sales-process step metadata + smart defaults. The "Sales Process" config step
// toggles these; HubJourney renders only the enabled ones. Defaults derive from
// discovery answers, and the user's explicit overrides (session.journey.overrides)
// win.
//
// Reframed June 2026 from the buyer's customer journey to the SELLER'S sales
// process (Generate -> Qualify -> Win -> Deliver -> Keep): the team handoffs and
// the connecting tools (phone, text, quoting, accounting, service) map to a
// sales-process frame, which is what the product actually is.

export const JOURNEY_MILESTONES = [
  { id: 'gen_find', phase: 'GENERATE', icon: '🔍', label: 'Get found (SEO + content)' },
  { id: 'gen_ads', phase: 'GENERATE', icon: '📈', label: 'Ads that pay for themselves' },
  { id: 'gen_referral', phase: 'GENERATE', icon: '🤝', label: 'Referrals captured and worked' },
  { id: 'gen_outreach', phase: 'GENERATE', icon: '📣', label: 'Outreach runs in the background' },
  { id: 'gen_events', phase: 'GENERATE', icon: '🎟️', label: 'Events feed the CRM' },
  { id: 'gen_phone', phase: 'GENERATE', icon: '📞', label: 'Call and text from the CRM' },
  { id: 'capture', phase: 'QUALIFY', icon: '📥', label: 'Everything lands on one record' },
  { id: 'route_score', phase: 'QUALIFY', icon: '⚡', label: 'Score and route to a rep' },
  { id: 'warm', phase: 'QUALIFY', icon: '📧', label: 'Stay-warm nurture and alert' },
  { id: 'meeting', phase: 'WIN', icon: '📅', label: 'Self-booking and reminder texts' },
  { id: 'ai_prep', phase: 'WIN', icon: '🤖', label: 'AI deal summaries and playbooks' },
  { id: 'win_pitch', phase: 'WIN', icon: '🎯', label: 'Guided pitch every rep follows' },
  { id: 'stages', phase: 'WIN', icon: '📊', label: 'Deal pipeline with automation' },
  { id: 'quote', phase: 'WIN', icon: '🧾', label: 'Quote, sign, deposit' },
  { id: 'handoff', phase: 'DELIVER', icon: '🤝', label: 'Closed-won handoff to ops' },
  { id: 'team_record', phase: 'DELIVER', icon: '📦', label: 'Team works off the same record' },
  { id: 'invoicing', phase: 'DELIVER', icon: '💵', label: 'Invoicing and books in sync' },
  { id: 'support', phase: 'KEEP', icon: '🛟', label: 'Service tickets and help desk' },
  { id: 'feedback', phase: 'KEEP', icon: '⭐', label: 'Surveys, reviews, and alerts' },
  { id: 'keep_expand', phase: 'KEEP', icon: '🚀', label: 'The next offer pitches itself' },
  { id: 'retain', phase: 'KEEP', icon: '🔁', label: 'Win-backs and renewals' },
]

const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])

// Derive which steps SHOULD be on, from discovery answers.
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
  // Core capture/qualify/win/deliver/keep steps + calling are always on; a seller
  // always works the phone and texts.
  ;['gen_phone', 'capture', 'route_score', 'warm', 'meeting', 'ai_prep', 'win_pitch', 'stages',
    'quote', 'handoff', 'team_record', 'invoicing', 'support', 'feedback', 'keep_expand',
    'retain'].forEach((id) => on.add(id))

  if (marketingSignal) on.add('gen_find')
  if (outreachSignal) on.add('gen_outreach')
  // Referrals get their own card whenever referrals/repeat business is a source,
  // or when nothing is answered yet (full showcase).
  const referralSignal =
    !answered ||
    sources.includes('Referrals') ||
    sources.includes('Repeat clients') ||
    sources.includes('Brokers / partners')
  if (referralSignal) on.add('gen_referral')

  // Paid ads: active when they run ads (lead source or the marketing question).
  const adsSignal =
    !answered ||
    sources.includes('Paid ads') ||
    (Array.isArray(w.runningAds) && w.runningAds.some((a) => a && a !== 'Not running paid ads'))
  if (adsSignal) on.add('gen_ads')

  // Events / trade shows.
  const eventsSignal = !answered || sources.includes('Events / trade shows')
  if (eventsSignal) on.add('gen_events')

  return on
}

// Effective enabled state: explicit user override wins, else the derived default.
export function journeyEnabled(session, id) {
  const override = session?.journey?.overrides?.[id]
  if (override !== undefined) return override
  return journeyDefaults(session).has(id)
}
