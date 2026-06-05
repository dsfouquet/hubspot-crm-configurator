// View recommendation engine (spec Step 8). Maps wizardAnswers + workflows to a
// UNIONED list of suggested views — every matching motion contributes, so a team
// that does outbound + field gets both the Cold Call Queue and the Site Visit Schedule.

// A rule fires when `when(ctx)` is true, contributing one view.
const RULES = [
  {
    id: 'cold_call_queue',
    name: 'Cold Call Queue',
    recordType: 'Contacts',
    description: 'Contacts to call, ordered by priority.',
    reason: 'You selected cold calling',
    when: (c) => c.activities.includes('Cold calling / call blocking'),
  },
  {
    id: 'site_visit_schedule',
    name: 'Site Visit Schedule',
    recordType: 'Companies',
    description: 'Accounts due for an in-person visit.',
    reason: 'You do field / outside sales',
    when: (c) =>
      c.teamType.includes('Field Sales / Outside Sales') ||
      c.activities.includes('In-person visits / site calls'),
  },
  {
    id: 'revenue_forecast',
    name: 'Revenue Forecast View',
    recordType: 'Deals',
    description: 'Weighted pipeline by close month.',
    reason: 'Forecast visibility is a challenge',
    when: (c) =>
      c.challenges.includes('No visibility into pipeline / forecast') ||
      c.activities.includes('Pipeline review / forecasting'),
  },
  {
    id: 'stale_deals',
    name: 'Stale Deals (14+ days no activity)',
    recordType: 'Deals',
    description: 'Open deals going cold.',
    reason: 'Leads fall through the cracks',
    when: (c) => c.challenges.includes('Leads fall through the cracks'),
  },
  {
    id: 'sequence_enrollment',
    name: 'Sequence Enrollment Queue',
    recordType: 'Contacts',
    description: 'Contacts ready to enroll in outreach sequences.',
    reason: 'You selected email outreach',
    when: (c) => c.activities.includes('Email outreach / sequences'),
    tier: 'pro', // sequences require Pro
  },
  {
    id: 'pipeline_board',
    name: 'Pipeline Board by Stage',
    recordType: 'Deals',
    description: 'Kanban board of deals across your stages.',
    reason: 'You review pipeline',
    when: (c) => c.activities.includes('Pipeline review / forecasting'),
  },
  {
    id: 'open_tickets_priority',
    name: 'Open Tickets by Priority',
    recordType: 'Tickets',
    description: 'Support queue sorted by priority.',
    reason: 'You handle tickets / support',
    when: (c) => c.activities.includes('Ticket / support resolution'),
  },
  {
    id: 'renewal_tracker',
    name: 'Renewal Tracker',
    recordType: 'Deals',
    description: 'Upcoming renewals by date.',
    reason: 'You do account management / renewals',
    when: (c) => c.teamType.includes('Account Management / Renewals'),
  },
  {
    id: 'quotes_awaiting',
    name: 'Quotes Sent — Awaiting Response',
    recordType: 'Deals',
    description: 'Proposals out, no reply yet.',
    reason: 'You send proposals / quotes',
    when: (c) => c.activities.includes('Proposal / quoting'),
  },
  {
    id: 'rep_leaderboard',
    name: 'Rep Performance Leaderboard',
    recordType: 'Deals',
    description: 'Rep ranking by closed revenue + activity.',
    reason: 'Your team has 6+ people',
    when: (c) =>
      c.teamSize === 'Mid-size team (6–20)' || c.teamSize === 'Large team (20+)',
  },
  // Workflow-driven views
  {
    id: 'awaiting_quote_response',
    name: 'Awaiting Quote Response',
    recordType: 'Deals',
    description: 'Deals enrolled in the Quote Follow-Up automation.',
    reason: 'You added the Quote Follow-Up workflow',
    when: (c) => c.templateIds.includes('quote_follow_up'),
  },
  {
    id: 'reengage_candidates',
    name: 'Re-engage Candidates',
    recordType: 'Deals',
    description: 'Closed-lost deals queued for re-engagement.',
    reason: 'You added the Closed Lost Re-engage workflow',
    when: (c) => c.templateIds.includes('closed_lost_reengage'),
  },
]

function buildContext(session) {
  const w = session.wizard || {}
  const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  return {
    teamType: asArray(w.teamType),
    teamSize: typeof w.teamSize === 'string' ? w.teamSize : '',
    challenges: asArray(w.challenges),
    activities: asArray(w.activities),
    currentTools: asArray(w.currentTools),
    templateIds: (session.workflows || []).map((wf) => wf.templateId).filter(Boolean),
  }
}

// All recommended views for the current session (deduped, union of all firing rules).
export function recommendViews(session) {
  const ctx = buildContext(session)
  return RULES.filter((r) => {
    try {
      return r.when(ctx)
    } catch {
      return false
    }
  }).map(({ when, ...view }) => view)
}

// Final view list for previews/outputs: recommended (minus dismissed) + custom.
export function activeViews(session) {
  const views = session.views || { off: [], custom: [] }
  const off = views.off || []
  const recommended = recommendViews(session)
    .filter((v) => !off.includes(v.id))
    .map((v) => ({ ...v, source: 'recommended' }))
  const custom = (views.custom || []).map((v) => ({ ...v, source: 'custom' }))
  return [...recommended, ...custom]
}
