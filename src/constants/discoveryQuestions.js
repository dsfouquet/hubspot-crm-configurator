// Discovery intake (replaces the old 5-question wizard). Curated from Daniel's
// full discovery call script — only questions that drive the solution engine,
// tier calculation, or Crescent Connect build scoping. Call-only questions
// (team access detail, urgency/decision, branding) are intentionally excluded.

export const DISCOVERY_SECTIONS = [
  { key: 'business', label: 'Your Business' },
  { key: 'process', label: 'Your Sales Process' },
  { key: 'leaks', label: 'Where Revenue Is Leaking' },
  { key: 'hubs', label: 'Beyond Sales' },
  { key: 'tools', label: 'Tools & Data' },
]

// "Beyond Sales" pain checklist — covers the other HubSpot hubs (Marketing,
// Content, Commerce, Service, Reporting, AI) in the same pain-first voice as
// the revenue-leak checklist. Authored 2026-06 (no prior question bank existed).
export const HUB_PAIN_OPTIONS = [
  { id: 'marketing_email_gap', label: "We never email our list — no newsletter, no nurture, nothing consistent" },
  { id: 'landing_pages_gap', label: "Our website doesn't capture leads — visitors come and go invisibly" },
  { id: 'content_seo_gap', label: "Nobody finds us online — we have no blog, SEO, or content presence" },
  { id: 'quotes_invoices_split', label: 'Quoting and invoicing live in separate tools that don\'t talk to each other' },
  { id: 'kb_faq_repeat', label: 'We answer the same customer questions over and over by phone or email' },
  { id: 'surveys_nps_blind', label: "We don't know if customers are happy until they're already gone" },
  { id: 'reporting_excel_pain', label: 'Building any report means hours of exporting and Excel wrangling' },
  { id: 'ai_manual_drafting', label: 'My team hand-writes every email and call summary AI could draft' },
  { id: 'tools_dont_talk', label: "Our tools don't talk — someone re-types the same data into multiple systems" },
  { id: 'tasks_slip', label: 'Important tasks live in memory and chat messages, and things slip' },
]

// Revenue-leak checklist (verbatim from Daniel's discovery script, section 3).
export const LEAK_OPTIONS = [
  { id: 'quotes_no_followup', label: 'Quotes go out and we never follow up consistently' },
  { id: 'unknown_close_rate', label: "We don't know our close rate without digging through emails" },
  { id: 'leads_fall_through', label: 'Leads come in and fall through the cracks before anyone responds' },
  { id: 'pipeline_in_head', label: 'Our pipeline lives in my head or a spreadsheet, not a shared system' },
  { id: 'rep_workload_unproven', label: "A couple reps do most of the work and we can't prove it" },
  { id: 'no_reengagement', label: "Past clients aren't getting re-engaged or renewed automatically" },
  { id: 'marketing_attribution', label: 'Marketing spend has no clear connection to closed revenue' },
  { id: 'admin_overload', label: 'Too much time on admin, data entry, and manual emails' },
  { id: 'inconsistent_onboarding', label: 'New clients get a different experience depending on who handles them' },
  { id: 'ticket_blindness', label: "Can't see tickets or service issues without calling someone" },
  { id: 'ar_visibility', label: "Don't know what's in accounts receivable without running a report" },
  { id: 'playbook_gap', label: 'No written sales process — every rep sells their own way' },
]

export const DISCOVERY_QUESTIONS = [
  // ---------- Section 1: Your Business ----------
  {
    key: 'topGoal',
    section: 'business',
    prompt: "What's the #1 thing you want to fix or improve in the next 30 days?",
    type: 'textarea',
    placeholder: 'In your own words — this becomes the headline of your fix plan.',
  },
  {
    key: 'businessDescription',
    section: 'business',
    prompt: 'What does your business do, and who do you sell to?',
    type: 'textarea',
    placeholder: 'e.g. "Commercial HVAC install and service for hospitals and schools across south Louisiana."',
  },
  {
    key: 'industry',
    section: 'business',
    prompt: 'What industry are you in?',
    type: 'single',
    allowOther: true,
    options: [
      'Construction / Contracting',
      'Industrial / Manufacturing',
      'Professional Services',
      'Real Estate',
      'Healthcare',
      'Technology / Software',
      'Financial / Insurance',
    ],
  },
  {
    key: 'teamType',
    section: 'business',
    prompt: 'How does your team sell?',
    type: 'multi',
    hint: 'Select all that apply',
    allowOther: true,
    options: [
      'B2B Sales (outbound focused)',
      'B2B Sales (inbound/marketing led)',
      'Field Sales / Outside Sales',
      'Account Management / Renewals',
      'Professional Services / Project-based',
    ],
  },
  {
    key: 'teamSize',
    section: 'business',
    prompt: 'How many people are on your team, including you?',
    type: 'single',
    options: ['Just me (1)', 'Small team (2–5)', 'Mid-size team (6–20)', 'Large team (20+)'],
  },
  {
    key: 'monthlyVolume',
    section: 'business',
    prompt: 'How many new leads, quotes, or proposals do you generate per month?',
    type: 'single',
    options: ['Fewer than 10', '10–25', '25–50', '50–100', '100+'],
  },
  {
    key: 'recurringRevenue',
    section: 'business',
    prompt: 'Does your business have recurring revenue?',
    type: 'multi',
    hint: 'Select all that apply',
    options: ['Service contracts', 'Retainers', 'Subscriptions', 'Renewals', 'No recurring revenue'],
  },

  // ---------- Section 2: Your Sales Process ----------
  {
    key: 'dealStages',
    section: 'process',
    prompt: 'Name the stages a deal goes through, in order, in your own words.',
    type: 'textarea',
    hint: 'We build your actual pipeline from this',
    placeholder: 'e.g. Lead → Site Visit → Quote Sent → Negotiation → Won',
  },
  {
    key: 'leadSources',
    section: 'process',
    prompt: 'How does most of your new business come in?',
    type: 'multi',
    hint: 'Select all that apply',
    options: [
      'Referrals',
      'Inbound / website',
      'Cold outreach',
      'Repeat clients',
      'Paid ads',
      'Events / trade shows',
      'Brokers / partners',
    ],
  },
  {
    key: 'avgDealSize',
    section: 'process',
    prompt: "What's your average deal or project size?",
    type: 'single',
    options: ['Under $5K', '$5K–$25K', '$25K–$100K', '$100K+'],
  },
  {
    key: 'salesCycle',
    section: 'process',
    prompt: 'How long is your typical sales cycle, first contact to close?',
    type: 'single',
    options: ['Days', 'A few weeks', '1–3 months', '3–12 months', 'Over a year'],
  },

  // ---------- Section 3: Where Revenue Is Leaking ----------
  {
    key: 'leaks',
    section: 'leaks',
    prompt: 'Which of these are problems in your business right now?',
    type: 'multi',
    hint: 'Be honest — select all that apply',
    options: LEAK_OPTIONS.map((l) => l.label),
  },
  {
    key: 'topLeak',
    section: 'leaks',
    prompt: 'Which one is costing you the most money right now?',
    type: 'single-from-leaks', // options come from the user's `leaks` selections
    optionalText: {
      key: 'topLeakCost',
      label: 'Put a number on it if you can (optional)',
      placeholder: 'e.g. $50K/year in quotes that go quiet',
    },
  },
  {
    key: 'mondayScreen',
    section: 'leaks',
    prompt: "What's the one screen or report you'd open every Monday morning if it existed?",
    type: 'textarea',
    placeholder: 'e.g. "Every open quote, who owns it, and how long it\'s been sitting."',
  },
  {
    key: 'ventBox',
    section: 'leaks',
    prompt: 'Anything else broken? Describe it in your own words.',
    type: 'textarea',
    optional: true,
    placeholder: 'Type it like you\'d vent to a colleague. We\'ll match it to fixes.',
  },

  // ---------- Section 4: Beyond Sales (other HubSpot hubs) ----------
  {
    key: 'hubPains',
    section: 'hubs',
    prompt: 'Any of these sound familiar outside of sales?',
    type: 'multi',
    hint: 'Marketing, service, billing, reporting — select all that apply',
    options: HUB_PAIN_OPTIONS.map((h) => h.label),
  },

  // ---------- Section 5: Tools & Data ----------
  {
    key: 'currentTracking',
    section: 'tools',
    prompt: 'What do you use right now to track leads, quotes, and follow-ups?',
    type: 'single',
    allowOther: true,
    options: [
      'Spreadsheet',
      'Email inbox',
      'Paper / whiteboard',
      'HubSpot (barely using it)',
      'Another CRM (Salesforce, GHL, Pipedrive...)',
      'Nothing structured',
    ],
  },
  {
    key: 'emailPlatform',
    section: 'tools',
    prompt: 'What email does your team use for business?',
    type: 'single',
    options: ['Gmail / Google Workspace', 'Outlook / Microsoft 365', 'Other'],
  },
  {
    key: 'accounting',
    section: 'tools',
    prompt: 'What accounting software are you on?',
    type: 'single',
    options: ['QuickBooks', 'Xero', 'FreshBooks', 'Something else', 'None'],
  },
  {
    key: 'connectTools',
    section: 'tools',
    prompt: 'What else would you want connected to your CRM?',
    type: 'multi',
    hint: 'Select all that apply',
    options: [
      'Google / Outlook Calendar',
      'Website forms',
      'QuickBooks',
      'Slack / Teams',
      'Zapier / Make',
      'Facebook / Instagram ads',
    ],
  },
  {
    key: 'dataImport',
    section: 'tools',
    prompt: 'Do you have an existing list of contacts or clients to bring in?',
    type: 'single',
    options: [
      'Yes — clean and exportable',
      'Yes — but messy and incomplete',
      'No existing list',
    ],
  },
]

// Map a leak label back to its id (answers store labels for readability).
export function leakIdFromLabel(label) {
  return LEAK_OPTIONS.find((l) => l.label === label)?.id || null
}

export function hubPainIdFromLabel(label) {
  return HUB_PAIN_OPTIONS.find((h) => h.label === label)?.id || null
}
