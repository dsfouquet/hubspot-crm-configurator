// Customer-mode intake: 8 questions, one per screen. Short enough that a cold
// prospect finishes, deep enough to qualify (BANT) and personalize the build.
// Answers share keys with the presenter discovery (session.wizard) so the
// solution engine works unchanged. annualRevenue + yearsInBusiness + teamSize
// drive qualification (utils/qualification.js).

import { AVATARS, AVATAR_NAMES } from './avatars'

// Curated, research-backed pain set across the customer journey (~3-4 per stage).
// Grounded in Daniel's documented 12-pain library (P1-P12), the avatar hooks, and
// the RevOps positioning brief. Order within a stage = priority. The RevOps stage
// is the climax: "tie it all together." Each id maps to a SOLUTION_MAP entry.
// Curated Q6 set, copy and order locked with Daniel (June 2026). 12 pains across
// the 5 journey stages, in the order he wants them shown.
export const JOURNEY_PAIN_SET = [
  // Marketing — get found & capture leads
  'leads_fall_through', // slow to engage inbound leads
  'lead_gen_gap', // not enough qualified leads from marketing
  'landing_pages_gap', // not capturing leads to follow up
  'marketing_email_gap', // we never email the list
  'content_seo_gap', // nobody finds us online
  // Sales — work the deal to the close
  'quotes_no_followup', // quote follow-up isn't consistent
  'pipeline_in_head', // can't see open deals / status
  'tasks_slip', // right activity at the right time slips
  'rep_workload_unproven', // can't tie rep activity to revenue
  'key_person_risk', // it all lives in one rep's head
  'company_picture', // no complete view of a company
  'focus_scatter', // don't know who to spend time on
  'vip_segmentation', // can't tell VIPs from cold leads
  'relationship_gap', // building relationships is slow/hard
  // Service & Retention — keep & grow customers
  'no_reengagement', // past clients don't hear from us
  'inconsistent_onboarding', // every client gets a different experience
  'ticket_blindness', // can't see service issues
  'kb_faq_repeat', // answer the same questions over and over
  'surveys_nps_blind', // don't know unhappy until they're gone
  // Operations — the back office
  'reporting_excel_pain', // reporting is manual exports
  'admin_overload', // data entry eats selling time
  'ar_visibility', // don't know what's owed
  'quotes_invoices_split', // quoting and invoicing don't talk
  // RevOps — tie it all together
  'handoff_void', // lose jobs to slow handoffs
  'unknown_close_rate', // don't know why we win or lose
  'tools_dont_talk', // apps don't talk, data re-typed
  // AI — put AI to work
  'ai_manual_drafting', // general "haven't started with AI"
  'ai_followups', // AI drafts follow-ups
  'ai_summaries', // AI call/meeting notes
  'ai_research', // AI prospect research
  'ai_chatbot', // AI answers visitors
]

// Back-compat alias (was the universal core before the journey set).
export const CORE_PAINS = JOURNEY_PAIN_SET

// The curated set, with the avatar's most-relevant pains pinned to the front of
// their stage. Avatar pains that aren't in the curated set are ignored, so Q6
// always shows exactly the locked 12 — the avatar only reorders, never adds.
export function customerPainIds(industry) {
  const avatarPains = (AVATARS[industry]?.topPains || []).filter((id) =>
    JOURNEY_PAIN_SET.includes(id)
  )
  return [...new Set([...avatarPains, ...JOURNEY_PAIN_SET])]
}

// The pains question (Q6) is grouped into a mini customer-journey order so the
// prospect sees their problems the way a customer actually moves: Marketing →
// Sales → Service/Retention → Ops. Presentation only — the pain ids stored in
// wizard.pains are unchanged, so qualification/topLeak/autoBuild are unaffected.
export const JOURNEY_STAGES = [
  { key: 'marketing', label: 'Marketing', caption: 'Getting found & capturing leads' },
  { key: 'sales', label: 'Sales', caption: 'Working deals to the close' },
  { key: 'service', label: 'Service & Retention', caption: 'Keeping & growing customers' },
  { key: 'ops', label: 'Operations & Reporting', caption: 'The back office behind it all' },
  { key: 'revops', label: 'RevOps: tie it all together', caption: 'Make every team run off one connected system' },
  { key: 'ai', label: 'AI', caption: 'Put AI to work across your business' },
]

// Every pain id → its journey stage (Daniel's guidance: leads = Marketing;
// quotes/pipeline/tasks = Sales). Anything unmapped falls back to ops.
export const PAIN_STAGE = {
  // Marketing — attract & capture
  leads_fall_through: 'marketing',
  lead_gen_gap: 'marketing',
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
  key_person_risk: 'sales',
  // Service & Retention — keep & grow
  no_reengagement: 'service',
  inconsistent_onboarding: 'service',
  ticket_blindness: 'service',
  kb_faq_repeat: 'service',
  surveys_nps_blind: 'service',
  // Operations & Reporting — back office
  admin_overload: 'ops',
  reporting_excel_pain: 'ops',
  quotes_invoices_split: 'ops',
  ar_visibility: 'ops',
  // RevOps — connect it all together
  tools_dont_talk: 'revops',
  handoff_void: 'revops',
  unknown_close_rate: 'revops',
  // AI — put AI to work
  ai_manual_drafting: 'ai',
  ai_followups: 'ai',
  ai_summaries: 'ai',
  ai_research: 'ai',
  ai_chatbot: 'ai',
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
    hint: 'We use this to size your build. Never shared.',
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
    options: ['Just me (1)', 'Small team (2–5)', 'Mid-size team (6–20)', 'Large team (20+)', 'Enterprise (100+)'],
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
    hint: 'Check all that apply, grouped the way a customer actually moves',
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
    placeholder: 'In your own words. This becomes the headline of your build plan.',
    quickPicks: [
      'I want more leads',
      'I want to stop losing deals to slow follow-up',
      'I want to close more of the quotes I send',
      'I want my pipeline visible without opening 5 tabs',
      'I want past clients buying again',
      'I want my numbers in one dashboard',
      'I want my time back from admin',
      'I want one system instead of five',
    ],
  },
]
