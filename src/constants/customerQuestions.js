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
    prompt: 'Which of these is costing you money right now?',
    hint: 'Select all that apply',
    type: 'pain-multi',
    // painIds resolved at render time via customerPainIds(wizard.industry)
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
      'More leads',
      'Close more deals',
      'Faster follow-up',
      'Less admin time',
      'More repeat business',
    ],
  },
]
