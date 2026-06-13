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
  crm: [
    'pipeline_in_head',
    'contact_context',
    'company_picture',
    'focus_scatter',
    'vip_segmentation',
    'no_reengagement',
    'tasks_slip',
  ],
  sales: [
    'quotes_no_followup',
    'leads_fall_through',
    'relationship_gap',
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

// Every diagnostic section is answered as POSITIVE habit statements on an
// Always / Sometimes / Never scale. "Never" and "Sometimes" both fire the
// mapped pain id into wizard.pains; "Always" clears it. (setHabit in
// shared/QuestionControl.jsx does the syncing.) Each statement's `id` is the
// SOLUTION_MAP pain id, so the fix plan, topLeak picker, and preview all keep
// working unchanged. Order matches PAINS_BY_SECTION.
export const HABITS_BY_SECTION = {
  crm: [
    { id: 'pipeline_in_head', statement: 'Everyone can see every deal, its stage, and who owns it in one shared place' },
    { id: 'contact_context', statement: "Anyone can see what a contact is working on and their history without asking around" },
    { id: 'company_picture', statement: 'We can see a company, who works there, and what is happening in one view' },
    { id: 'focus_scatter', statement: 'We always know who to follow up with and who has gone quiet' },
    { id: 'vip_segmentation', statement: 'We can tell our best customers and VIPs apart from cold leads at a glance' },
    { id: 'no_reengagement', statement: 'Past clients hear from us regularly, not never' },
    { id: 'tasks_slip', statement: 'Follow-up tasks live in one system and nothing slips' },
  ],
  sales: [
    { id: 'quotes_no_followup', statement: 'Every quote we send gets followed up until we get an answer' },
    { id: 'leads_fall_through', statement: 'New leads get a fast response — nothing falls through the cracks' },
    { id: 'relationship_gap', statement: 'We have built deep relationships with the right decision-makers' },
    { id: 'playbook_gap', statement: 'We have a written sales process every rep follows' },
    { id: 'rep_workload_unproven', statement: "We can see each rep's activity and what is working" },
    { id: 'admin_overload', statement: 'Our reps spend their time selling, not on data entry and manual emails' },
  ],
  marketing: [
    { id: 'marketing_email_gap', statement: 'We email our list regularly (newsletter, nurture)' },
    { id: 'landing_pages_gap', statement: 'Our website captures leads for us' },
    { id: 'content_seo_gap', statement: 'We publish content / stay visible online' },
    { id: 'marketing_attribution', statement: 'We can tie marketing spend to closed revenue' },
  ],
  service: [
    { id: 'ticket_blindness', statement: 'We can see every open service issue without calling someone' },
    { id: 'kb_faq_repeat', statement: 'Common questions are answered by a knowledge base, not us repeating ourselves' },
    { id: 'surveys_nps_blind', statement: 'We know how happy our customers are before they leave' },
    { id: 'inconsistent_onboarding', statement: 'Every new customer gets the same smooth onboarding' },
  ],
  commerce: [
    { id: 'quotes_invoices_split', statement: 'Quoting and invoicing work together, not in disconnected tools' },
    { id: 'ar_visibility', statement: 'We can see what is owed and overdue without running a special report' },
  ],
  ops: [
    { id: 'tools_dont_talk', statement: 'Our tools share data automatically — we do not re-type the same info' },
    { id: 'reporting_excel_pain', statement: 'Reports are live dashboards, not hours of exports and Excel' },
    { id: 'unknown_close_rate', statement: 'We know our close rate by rep, source, and deal size anytime' },
    { id: 'ai_manual_drafting', statement: 'We let AI draft the follow-ups and summaries our team would hand-write' },
  ],
}

// Back-compat alias (marketing was the original habit pilot).
export const MARKETING_HABITS = HABITS_BY_SECTION.marketing

// "Classic leaks" — research-backed places companies lose the most money.
// Picking one ALSO checks the mapped pain. Stats sourced June 2026 (HBR/MIT
// lead-response study, sales follow-up research, Marketing Metrics, Cognism
// data-decay, Retently churn causes, Rakuten/eMarketer, Salesforce State of Sales).
export const CLASSIC_LEAKS = [
  { painId: 'leads_fall_through', stat: 'Wait 30 minutes to call a lead and you are 21x less likely to qualify it.', source: 'Harvard Business Review / MIT' },
  { painId: 'quotes_no_followup', stat: '80% of sales take 5+ follow-ups — 44% of reps quit after one.', source: 'Sales follow-up research' },
  { painId: 'no_reengagement', stat: 'You are 60-70% likely to sell to an existing customer, 5-20% to a stranger.', source: 'Marketing Metrics' },
  { painId: 'focus_scatter', stat: 'B2B contact data decays ~30% a year as people change jobs.', source: 'Cognism' },
  { painId: 'inconsistent_onboarding', stat: 'Bad onboarding drives roughly 1 in 4 customers to churn.', source: 'Retently' },
  { painId: 'marketing_attribution', stat: 'Marketers admit ~26% of budget is wasted on the wrong channels.', source: 'Rakuten / eMarketer' },
  { painId: 'admin_overload', stat: 'Sales reps spend just 28% of their week actually selling.', source: 'Salesforce State of Sales' },
]

export const ALL_PAIN_IDS = Object.values(PAINS_BY_SECTION).flat()

// Each section's diagnostic is a positive-statement habit matrix. Per-section
// answer key (e.g. crmHabits) holds {painId: 'always'|'sometimes'|'never'};
// the shared wizard.pains array is kept in sync by setHabit.
const habitQuestion = (section, prompt) => ({
  key: `${section}Habits`,
  qid: `habits_${section}`,
  section,
  prompt,
  type: 'habit-matrix',
  hint: 'Be honest — Always, Sometimes, or Never',
  statements: HABITS_BY_SECTION[section],
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
    quickPicks: [
      'More leads',
      'Close more deals',
      'Faster follow-up',
      'Less admin time',
      'More repeat business',
    ],
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
    type: 'multi',
    hint: 'Select all that apply',
    allowOther: true,
    options: [
      'Spreadsheet',
      'Email inbox',
      'Paper / whiteboard',
      'HubSpot (barely using it)',
      'Another CRM (Salesforce, GHL, Pipedrive...)',
      'My phone / memory',
      'Nothing structured',
    ],
  },
  {
    key: 'dataImport',
    qid: 'dataImport',
    section: 'crm',
    prompt: 'Do you have an existing list of contacts or clients to bring in?',
    type: 'single',
    options: [
      'Yes — clean and exportable',
      'Yes — but messy and incomplete',
      'Sort of — some on a spreadsheet, some business cards, some in my phone',
      'No existing list',
    ],
  },
  habitQuestion('crm', 'How is your CRM and contact data holding up? Be honest.'),

  // ---------- Sales ----------
  {
    key: 'dealStages',
    qid: 'dealStages',
    section: 'sales',
    prompt: 'Name the stages a deal goes through, in order, in your own words.',
    type: 'textarea',
    hint: 'One per line or commas — we build your pipeline from this',
    placeholder: 'Lead, Site Visit, Quote Sent, Negotiation, Won',
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
  habitQuestion('sales', 'How is your sales process actually running? Be honest.'),

  // ---------- Marketing ----------
  habitQuestion('marketing', 'How is marketing actually going? Be honest.'),

  // ---------- Service ----------
  habitQuestion('service', 'How is everything after the sale? Be honest.'),

  // ---------- Commerce ----------
  {
    key: 'accounting',
    qid: 'accounting',
    section: 'commerce',
    prompt: 'What accounting software are you on?',
    type: 'single',
    options: [
      'QuickBooks Online',
      'QuickBooks Desktop',
      'Xero',
      'FreshBooks',
      'Sage',
      'NetSuite',
      'Wave',
      'BQE Core',
      'Spreadsheets / manual',
      'Something else',
      'None',
    ],
  },
  habitQuestion('commerce', 'How is the money side — quoting to getting paid? Be honest.'),

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
    key: 'sharedInbox',
    qid: 'sharedInbox',
    section: 'ops',
    prompt: 'How does your team handle shared email (sales@, info@, service@)?',
    type: 'single',
    options: [
      'Shared inboxes everyone works from',
      'One person forwards things around',
      'Each rep only sees their own inbox',
      "We don't have shared addresses",
    ],
  },
  {
    key: 'reportsToday',
    qid: 'reportsToday',
    section: 'ops',
    prompt: 'How do reports happen today?',
    type: 'single',
    options: [
      'Someone builds them manually each time',
      'Exports + Excel every time',
      'Mix of manual and automated',
      'Live dashboards we open anytime',
      "We don't really run reports",
    ],
  },
  {
    key: 'meetingPrep',
    qid: 'meetingPrep',
    section: 'ops',
    prompt: 'Before a leadership or sales meeting…',
    type: 'single',
    options: [
      'Someone spends hours prepping numbers',
      'We wing it from memory',
      "Data's live — we just open the dashboard",
    ],
  },
  {
    key: 'connectTools',
    qid: 'connectTools',
    section: 'ops',
    prompt: 'What else would you want connected to your CRM?',
    type: 'multi',
    hint: 'Select all that apply',
    options: [
      'Calendar (Google / Outlook)',
      'Website forms',
      'Accounting (QuickBooks, BQE...)',
      'Proposals & e-sign (PandaDoc, DocuSign...)',
      'Lead databases (ZoomInfo, Apollo...)',
      'Marketing & email tools (Mailchimp...)',
      'AI meeting notes (Fireflies, Otter, Zoom...)',
      'Project management (ClickUp, Asana...)',
      'Phone / SMS',
      'Chat (Slack / Teams)',
      'Zapier / Make',
      'Facebook / Instagram ads',
    ],
  },
  habitQuestion('ops', 'How do your systems and numbers feel day to day? Be honest.'),

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
