// Step navigation definition (spec Section 3.4). Order is authoritative.
// STEPS is the full presenter/live-session flow. CUSTOMER_STEPS is the short
// prospect-facing funnel: intake → build plan → preview → routed CTA.
export const STEPS = [
  { key: 'wizard', label: 'Discovery', short: 'Discovery' },
  { key: 'fixPlan', label: 'Your Fix Plan', short: 'Fix Plan' },
  { key: 'contacts', label: 'Contacts', short: 'Contacts' },
  { key: 'companies', label: 'Companies', short: 'Companies' },
  { key: 'deals', label: 'Deals', short: 'Deals' },
  { key: 'tickets', label: 'Tickets / Support', short: 'Tickets' },
  { key: 'customObjects', label: 'Custom Objects', short: 'Objects' },
  { key: 'workflows', label: 'Automation Workflows', short: 'Automation' },
  { key: 'views', label: 'Views & Tabs', short: 'Views' },
  { key: 'dashboards', label: 'Dashboards', short: 'Dashboards' },
  { key: 'cadence', label: 'Accountability Cadence', short: 'Cadence' },
  { key: 'journeyMap', label: 'Sales Process', short: 'Process' },
  { key: 'preview', label: 'Your HubSpot Preview', short: 'Preview' },
]

export const PRESENTER_STEPS = STEPS

export const CUSTOMER_STEPS = [
  { key: 'wizard', label: 'About Your Business', short: 'Questions' },
  { key: 'fixPlan', label: 'Your Build Plan', short: 'Build Plan' },
  { key: 'preview', label: 'Your HubSpot Preview', short: 'Preview' },
  { key: 'cta', label: 'Next Steps', short: 'Next Steps' },
]

// Pure helper (no store import — useStore imports this file).
// mode 'live' = Daniel-driven deep configurator; anything else = customer funnel.
export const stepsForMode = (mode) => (mode === 'live' ? PRESENTER_STEPS : CUSTOMER_STEPS)
