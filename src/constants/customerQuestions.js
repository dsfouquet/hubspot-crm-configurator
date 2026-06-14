// Customer-mode intake: 8 questions, one per screen. Short enough that a cold
// prospect finishes, deep enough to qualify (BANT) and personalize the build.
// Answers share keys with the presenter discovery (session.wizard) so the
// solution engine works unchanged. annualRevenue + yearsInBusiness + teamSize
// drive qualification (utils/qualification.js).

import { AVATARS, AVATAR_NAMES } from './avatars'

// Universal pains every market recognizes — merged with the avatar's top pains.
export const CORE_PAINS = [
  'leads_fall_through',
  'quotes_no_followup',
  'pipeline_in_head',
  'tasks_slip',
  'no_reengagement',
  'reporting_excel_pain',
  'admin_overload',
  'tools_dont_talk',
]

// Avatar-weighted pain list: their market's top pains first, then the core set.
export function customerPainIds(industry) {
  const avatarPains = AVATARS[industry]?.topPains || []
  return [...new Set([...avatarPains, ...CORE_PAINS])].slice(0, 10)
}

// The pains question (Q6) is grouped into a mini customer-journey order so the
// prospect sees their problems the way a customer actually moves: Marketing →
// Sales → Service/Retention → Ops. Presentation only — the pain ids stored in
// wizard.pains are unchanged, so qualification/topLeak/autoBuild are unaffected.
export const JOURNEY_STAGES = [
  { key: 'marketing', label: 'Marketing', caption: 'Getting found & capturing leads' },
  { key: 'sales', label: 'Sales', caption: 'Working deals to the close' },
  { key: 'service', label: 'Service & Retention', caption: 'Keeping & growing customers' },
  { key: 'ops', label: 'Operations & Reporting', caption: 'The back office that ties it together' },
]

// Every pain id → its journey stage (Daniel's guidance: leads = Marketing;
// quotes/pipeline/tasks = Sales). Anything unmapped falls back to ops.
export const PAIN_STAGE = {
  // Marketing — attract & capture
  leads_fall_through: 'marketing',
  marketing_email_gap: 'marketing',
  landing_pages_gap: 'marketing',
  content_seo_gap: 'marketing',
  marketing_attribution: 'marketing',
  // Sales — work the deal
  quotes_no_followup: 'sales',
  pipeline_in_head: 'sales',
  tasks_slip: 'sales',
  contact_context: 'sales',
  company_picture: 'sales',
  focus_scatter: 'sales',
  vip_segmentation: 'sales',
  relationship_gap: 'sales',
  playbook_gap: 'sales',
  rep_workload_unproven: 'sales',
  // Service & Retention — keep & grow
  no_reengagement: 'service',
  inconsistent_onboarding: 'service',
  ticket_blindness: 'service',
  kb_faq_repeat: 'service',
  surveys_nps_blind: 'service',
  // Operations & Reporting — back office
  admin_overload: 'ops',
  tools_dont_talk: 'ops',
  reporting_excel_pain: 'ops',
  unknown_close_rate: 'ops',
  ai_manual_drafting: 'ops',
  quotes_invoices_split: 'ops',
  ar_visibility: 'ops',
}

// Build the journey-ordered groups for Q6 from the same avatar-weighted pain set
// (so the 10-cap / weighting is preserved). Empty stages are dropped.
export function customerPainGroups(industry) {
  const ids = customerPainIds(industry)
  return JOURNEY_STAGES.map((stage) => ({
    ...stage,
    painIds: ids.filter((id) => (PAIN_STAGE[id] || 'ops') === stage.key),
  })).filter((g) => g.painIds.length > 0)
}

export const CUSTOMER_QUESTIONS = [
  {
    key: 'industry',
    qid: 'industry',
    prompt: 'What kind of business do you run?',
    type: 'single',
    allowOther: true,
    autoAdvance: true,
    options: AVATAR_NAMES,
  },
  {
    key: 'annualRevenue',
    qid: 'annualRevenue',
    prompt: 'Roughly, what was your revenue last year?',
    hint: 'We use this to size your build — never shared.',
    type: 'single',
    autoAdvance: true,
    options: ['Under $250K', '$250K – $1M', '$1M – $5M', '$5M+'],
  },
  {
    key: 'yearsInBusiness',
    qid: 'yearsInBusiness',
    prompt: 'How long have you been in business?',
    type: 'single',
    autoAdvance: true,
    options: ['Less than a year', '1 – 3 years', '3 – 10 years', '10+ years'],
  },
  {
    key: 'teamSize',
    qid: 'teamSize',
    prompt: 'How many people are on your team, including you?',
    type: 'single',
    autoAdvance: true,
    options: ['Just me (1)', 'Small team (2–5)', 'Mid-size team (6–20)', 'Large team (20+)'],
  },
  {
    key: 'currentTracking',
    qid: 'currentTracking',
    prompt: 'Where do leads and customers live today?',
    hint: 'Select all that apply',
    type: 'multi',
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
    key: 'pains',
    qid: 'pains_customer',
    prompt: 'Where is it costing you money? This is your customer journey, start to finish.',
    hint: 'Check all that apply — grouped the way a customer actually moves',
    type: 'pain-multi',
    // painIds + journey groups resolved at render time from wizard.industry
    dynamicPains: true,
  },
  {
    key: 'topLeak',
    qid: 'topLeak',
    prompt: 'Which one hurts the most?',
    hint: 'Your build plan leads with this',
    type: 'single-from-pains',
    optionalText: {
      key: 'topLeakCost',
      label: 'Put a number on it if you can (optional)',
      placeholder: 'e.g. $50K/year in quotes that go quiet',
    },
  },
  {
    key: 'topGoal',
    qid: 'topGoal',
    prompt: 'If we fix one thing in the next 30 days, what should it be?',
    type: 'textarea',
    optional: true,
    placeholder: 'In your own words — this becomes the headline of your build plan.',
    quickPicks: [
      'I want more leads',
      'I want to close more deals',
      'I want faster follow-up',
      'I want my time back',
      'I want more repeat business',
      'I want to scale fast',
    ],
  },
]
