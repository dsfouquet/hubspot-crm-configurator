// Discovery intake, organized by HubSpot's hubs (Daniel's request 2026-06):
// Your Business → CRM & Data → Sales → Marketing → Service → Commerce →
// Ops & Reporting → Priorities. Pain checklists store SOLUTION_MAP ids in the
// shared `pains` answer key; display labels (bold word + short desc) come from
// the solution map (single source of truth). Curated from Daniel's discovery
// call script + sales/discovery-questions/Discovery-Questions-By-Hub.md.
// Call-only questions (team access, urgency/decision, branding) stay out.

import { SOLUTION_MAP } from './solutionMap'

export const DISCOVERY_SECTIONS = [
  { key: 'business', label: 'Your Business' },
  { key: 'crm', label: 'CRM & Data' },
  { key: 'sales', label: 'Sales' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'service', label: 'Service' },
  { key: 'commerce', label: 'Commerce' },
  { key: 'ops', label: 'Ops & Reporting' },
  { key: 'priorities', label: 'Priorities' },
]

// Pain ids per hub section (each pain appears exactly once).
export const PAINS_BY_SECTION = {
  crm: ['pipeline_in_head', 'no_reengagement', 'tasks_slip'],
  sales: [
    'quotes_no_followup',
    'leads_fall_through',
    'playbook_gap',
    'rep_workload_unproven',
    'admin_overload',
  ],
  marketing: [
    'marketing_email_gap',
    'landing_pages_gap',
    'content_seo_gap',
    'marketing_attribution',
  ],
  service: ['ticket_blindness', 'kb_faq_repeat', 'surveys_nps_blind', 'inconsistent_onboarding'],
  commerce: ['quotes_invoices_split', 'ar_visibility'],
  ops: ['tools_dont_talk', 'reporting_excel_pain', 'unknown_close_rate', 'ai_manual_drafting'],
}

export const ALL_PAIN_IDS = Object.values(PAINS_BY_SECTION).flat()

const painQuestion = (section, prompt) => ({
  key: 'pains', // all checklists share one answer array of ids
  qid: `pains_${section}`,
  section,
  prompt,
  type: 'pain-multi',
  hint: 'Select all that apply',
  painIds: PAINS_BY_SECTION[section],
})

export const DISCOVERY_QUESTIONS = [
  // ---------- Your Business ----------
  {
    key: 'topGoal',
    qid: 'topGoal',
    section: 'business',
    prompt: "What's the #1 thing you want to fix or improve in the next 30 days?",
    type: 'textarea',
    placeholder: 'In your own words — this becomes the headline of your fix plan.',
  },
  {
    key: 'businessDescription',
    qid: 'businessDescription',
    section: 'business',
    prompt: 'What does your business do, and who do you sell to?',
    type: 'textarea',
    placeholder: 'e.g. "Commercial HVAC install and service for hospitals and schools."',
  },
  {
    key: 'industry',
    qid: 'industry',
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
    qid: 'teamType',
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
    qid: 'teamSize',
    section: 'business',
    prompt: 'How many people are on your team, including you?',
    type: 'single',
    options: ['Just me (1)', 'Small team (2–5)', 'Mid-size team (6–20)', 'Large team (20+)'],
  },
  {
    key: 'monthlyVolume',
    qid: 'monthlyVolume',
    section: 'business',
    prompt: 'How many new leads, quotes, or proposals per month?',
    type: 'single',
    options: ['Fewer than 10', '10–25', '25–50', '50–100', '100+'],
  },
  {
    key: 'recurringRevenue',
    qid: 'recurringRevenue',
    section: 'business',
    prompt: 'Does your business have recurring revenue?',
    type: 'multi',
    hint: 'Select all that apply',
    options: ['Service contracts', 'Retainers', 'Subscriptions', 'Renewals', 'No recurring revenue'],
  },

  // ---------- CRM & Data ----------
  {
    key: 'currentTracking',
    qid: 'currentTracking',
    section: 'crm',
    prompt: 'What do you use today to track leads, deals, and customers?',
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
    key: 'dataImport',
    qid: 'dataImport',
    section: 'crm',
    prompt: 'Do you have an existing list of contacts or clients to bring in?',
    type: 'single',
    options: ['Yes — clean and exportable', 'Yes — but messy and incomplete', 'No existing list'],
  },
  painQuestion('crm', 'Any of these CRM problems sound familiar?'),

  // ---------- Sales ----------
  {
    key: 'dealStages',
    qid: 'dealStages',
    section: 'sales',
    prompt: 'Name the stages a deal goes through, in order, in your own words.',
    type: 'textarea',
    hint: 'We build your actual pipeline from this',
    placeholder: 'e.g. Lead → Site Visit → Quote Sent → Negotiation → Won',
  },
  {
    key: 'leadSources',
    qid: 'leadSources',
    section: 'sales',
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
    qid: 'avgDealSize',
    section: 'sales',
    prompt: "What's your average deal or project size?",
    type: 'single',
    options: ['Under $5K', '$5K–$25K', '$25K–$100K', '$100K+'],
  },
  {
    key: 'salesCycle',
    qid: 'salesCycle',
    section: 'sales',
    prompt: 'How long is your typical sales cycle, first contact to close?',
    type: 'single',
    options: ['Days', 'A few weeks', '1–3 months', '3–12 months', 'Over a year'],
  },
  painQuestion('sales', 'Where is your sales process leaking?'),

  // ---------- Marketing ----------
  painQuestion('marketing', 'How is marketing actually going?'),

  // ---------- Service ----------
  painQuestion('service', 'What happens after the sale?'),

  // ---------- Commerce ----------
  {
    key: 'accounting',
    qid: 'accounting',
    section: 'commerce',
    prompt: 'What accounting software are you on?',
    type: 'single',
    options: ['QuickBooks', 'Xero', 'FreshBooks', 'Something else', 'None'],
  },
  painQuestion('commerce', 'Any friction between selling and getting paid?'),

  // ---------- Ops & Reporting ----------
  {
    key: 'emailPlatform',
    qid: 'emailPlatform',
    section: 'ops',
    prompt: 'What email does your team use for business?',
    type: 'single',
    options: ['Gmail / Google Workspace', 'Outlook / Microsoft 365', 'Other'],
  },
  {
    key: 'connectTools',
    qid: 'connectTools',
    section: 'ops',
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
  painQuestion('ops', 'How do systems and numbers feel day to day?'),

  // ---------- Priorities ----------
  {
    key: 'topLeak',
    qid: 'topLeak',
    section: 'priorities',
    prompt: 'Of everything you checked, which one is costing you the most money?',
    type: 'single-from-pains',
    optionalText: {
      key: 'topLeakCost',
      label: 'Put a number on it if you can (optional)',
      placeholder: 'e.g. $50K/year in quotes that go quiet',
    },
  },
  {
    key: 'mondayScreen',
    qid: 'mondayScreen',
    section: 'priorities',
    prompt: "What's the one screen or report you'd open every Monday morning if it existed?",
    type: 'textarea',
    placeholder: 'e.g. "Every open quote, who owns it, and how long it\'s been sitting."',
  },
  {
    key: 'ventBox',
    qid: 'ventBox',
    section: 'priorities',
    prompt: 'Anything else broken? Describe it in your own words.',
    type: 'textarea',
    optional: true,
    placeholder: "Type it like you'd vent to a colleague. We'll match it to fixes.",
  },
]

// Display label parts for a pain id (bold word + description).
export function painParts(id) {
  const s = SOLUTION_MAP[id]
  return s ? { pain: s.pain || id, desc: s.painDesc || '' } : { pain: id, desc: '' }
}
