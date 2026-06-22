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
  { id: 'gen_find', phase: 'GENERATE', icon: '🔍', label: 'Found online' },
  { id: 'gen_ads', phase: 'GENERATE', icon: '📈', label: 'Ads with ROI' },
  { id: 'gen_referral', phase: 'GENERATE', icon: '🤝', label: 'Referral capture' },
  { id: 'gen_outreach', phase: 'GENERATE', icon: '📣', label: 'Auto outreach' },
  { id: 'gen_events', phase: 'GENERATE', icon: '🎟️', label: 'Event capture' },
  { id: 'gen_phone', phase: 'GENERATE', icon: '📞', label: 'Calls & texts' },
  { id: 'capture', phase: 'QUALIFY', icon: '📥', label: 'One record' },
  { id: 'route_score', phase: 'QUALIFY', icon: '⚡', label: 'Score & route' },
  { id: 'warm', phase: 'QUALIFY', icon: '📧', label: 'Lead nurture' },
  { id: 'meeting', phase: 'WIN', icon: '📅', label: 'Self-booking' },
  { id: 'ai_prep', phase: 'WIN', icon: '🤖', label: 'AI prep' },
  { id: 'win_pitch', phase: 'WIN', icon: '🎯', label: 'Guided pitch' },
  { id: 'stages', phase: 'WIN', icon: '📊', label: 'Deal board' },
  { id: 'quote', phase: 'WIN', icon: '🧾', label: 'Quote & sign' },
  { id: 'handoff', phase: 'DELIVER', icon: '🤝', label: 'Auto handoff' },
  { id: 'team_record', phase: 'DELIVER', icon: '📦', label: 'Shared record' },
  { id: 'invoicing', phase: 'DELIVER', icon: '💵', label: 'Invoicing' },
  { id: 'support', phase: 'KEEP', icon: '🛟', label: 'Support tickets' },
  { id: 'feedback', phase: 'KEEP', icon: '⭐', label: 'Feedback & reviews' },
  { id: 'keep_expand', phase: 'KEEP', icon: '🚀', label: 'Auto upsell' },
  { id: 'retain', phase: 'KEEP', icon: '🔁', label: 'Renewals' },
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
