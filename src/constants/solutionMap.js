// Solution map: each revenue leak -> the HubSpot fix (workflows, views, widgets,
// cadence rules) AND what Crescent Connect actually builds to make it real.
// The ccBuild lists are the differentiation layer: HubSpot is the toolkit,
// Crescent Connect is the builder. None of this works out of the box.

export const SOLUTION_MAP = {
  quotes_no_followup: {
    title: 'Quotes that chase themselves',
    narrative:
      'The moment a quote goes out, HubSpot starts a follow-up sequence automatically. Nothing goes quiet unless the customer actually says no.',
    workflows: ['quote_follow_up'],
    viewIds: ['quotes_awaiting'],
    widgets: ['pipeline_value_stage', 'deals_closed_month'],
    cadenceRules: { flagNoActivityEnabled: true },
    ccBuild: [
      'Quote Follow-Up workflow timed to your actual sales cycle',
      'Follow-up email copy written in your voice, not template-speak',
      '"Quote Sent Date" property wired into your proposal process',
      '"Awaiting Quote Response" view filtered to your pipeline',
    ],
    keywords: ['quote', 'proposal', 'follow up', 'follow-up', 'no response', 'goes quiet', 'never hear back'],
  },

  unknown_close_rate: {
    title: 'Close rate without the digging',
    narrative:
      'Every deal gets logged with a stage and an outcome. Won vs. lost, by rep, by source — one dashboard, zero email archaeology.',
    workflows: [],
    viewIds: ['revenue_forecast'],
    widgets: ['won_vs_lost', 'deal_velocity', 'revenue_by_rep'],
    cadenceRules: {},
    ccBuild: [
      'Won/Lost reporting configured around your definitions of a win',
      'Close-rate dashboard by rep, lead source, and deal size',
      'Historical deal import so you start with a baseline, not a blank chart',
    ],
    keywords: ['close rate', 'win rate', 'conversion rate', 'hit rate', 'reporting'],
  },

  leads_fall_through: {
    title: 'No lead left sitting',
    narrative:
      'New leads get assigned to an owner instantly, with an automatic first-touch email and a follow-up task. Deals that go idle get flagged before they die.',
    workflows: ['new_lead_assignment', 'deal_stale_alert'],
    viewIds: ['stale_deals'],
    widgets: ['tasks_completed_overdue'],
    cadenceRules: { flagNoActivityEnabled: true, requireNextStep: true },
    ccBuild: [
      'Lead routing rules built for how your team actually divides territory',
      'Stale-deal alerts tuned to your sales cycle, not a generic 30 days',
      'Website form capture wired straight into the CRM',
    ],
    keywords: ['cracks', 'slip', 'fall through', 'nobody responds', 'no response', 'forgot', 'lost track', 'lead'],
  },

  pipeline_in_head: {
    title: 'One pipeline everyone can see',
    narrative:
      'Your deal stages — the ones you just named — become a shared board. Anyone can see every deal, its stage, its value, and who owns it in five seconds.',
    workflows: ['pipeline_stage_mover'],
    viewIds: ['pipeline_board'],
    widgets: ['pipeline_value_stage'],
    cadenceRules: { requireNextStep: true },
    ccBuild: [
      'Pipeline built from YOUR stages and your language, not HubSpot defaults',
      'Stage-by-stage probability and required fields, so data stays clean',
      'Migration of every deal out of the spreadsheet (or your head) into the board',
    ],
    keywords: ['spreadsheet', 'my head', 'excel', 'whiteboard', 'visibility', 'shared', 'pipeline'],
  },

  rep_workload_unproven: {
    title: 'Prove who is producing',
    narrative:
      'Calls, emails, meetings, and revenue tracked per rep automatically. The leaderboard does the awkward conversation for you.',
    workflows: [],
    viewIds: ['rep_leaderboard'],
    widgets: ['calls_logged', 'emails_sent', 'meetings_booked', 'revenue_by_rep'],
    cadenceRules: { minCallsEnabled: true },
    ccBuild: [
      'Activity tracking that logs calls and emails automatically from your inbox',
      'Rep leaderboard with the metrics you actually manage to',
      'Weekly activity-minimum rules with automatic flags, not nagging',
    ],
    keywords: ['rep', 'accountability', 'who is working', 'prove', 'leaderboard', 'activity', 'lazy'],
  },

  no_reengagement: {
    title: 'Past clients come back on autopilot',
    narrative:
      'Lost deals get a re-engagement sequence after 90 days. Renewals trigger alerts and a new deal 60 days out. Your back book works itself.',
    workflows: ['closed_lost_reengage', 'renewal_alert'],
    viewIds: ['renewal_tracker', 'reengage_candidates'],
    widgets: ['contacts_by_lifecycle'],
    cadenceRules: {},
    ccBuild: [
      'Renewal Date property and renewal pipeline modeled on your contract terms',
      'Re-engagement sequences written for your relationships, not cold spam',
      'Flagging of active clients vs. past clients vs. dead leads during import',
    ],
    keywords: ['renewal', 're-engage', 'past client', 'old customer', 'repeat', 'contract', 'win back'],
  },

  marketing_attribution: {
    title: 'Marketing spend tied to closed revenue',
    narrative:
      'Every contact carries its source from first touch to closed deal, so you can see what referrals, ads, and events actually return.',
    workflows: [],
    viewIds: [],
    widgets: ['won_vs_lost'],
    cadenceRules: {},
    tierFeatures: [{ feature: 'multi_touch_attribution', tier: 'enterprise' }],
    ccBuild: [
      'Lead-source tracking enforced on every new contact and deal',
      'Source-to-revenue reporting (full multi-touch attribution requires Enterprise — we scope what tier you actually need)',
      'Ad platform and website form connections so sources log themselves',
    ],
    keywords: ['marketing', 'ads', 'attribution', 'roi', 'spend', 'what works'],
  },

  admin_overload: {
    title: 'Admin work that does itself',
    narrative:
      'Welcome emails, data entry, task creation, handoffs — automated. Your team sells; the system types.',
    workflows: ['new_contact_welcome', 'closed_won_handoff'],
    viewIds: [],
    widgets: ['tasks_completed_overdue'],
    cadenceRules: { autoRemindEnabled: true },
    ccBuild: [
      'Automation of your specific repetitive tasks, mapped during onboarding',
      'Email and calendar sync so logging happens without anyone typing',
      'Templates for the 10 emails your team sends over and over',
    ],
    keywords: ['admin', 'data entry', 'manual', 'typing', 'time', 'busywork', 'paperwork'],
  },

  inconsistent_onboarding: {
    title: 'Every client gets your best onboarding',
    narrative:
      'The moment a deal closes, the same handoff sequence fires every time: internal notifications, onboarding tasks, a polished intro email.',
    workflows: ['closed_won_handoff'],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'Closed-won playbook built from how your best handoffs already work',
      'Onboarding task templates assigned to the right people automatically',
      'Client-facing kickoff emails in your brand voice',
    ],
    keywords: ['onboarding', 'handoff', 'inconsistent', 'different experience', 'kickoff', 'new client'],
  },

  ticket_blindness: {
    title: 'Service issues on one screen',
    narrative:
      'Every ticket gets a pipeline, a priority, and an owner. Stuck tickets escalate automatically after 48 hours. No more calling around to find out.',
    workflows: ['ticket_escalation'],
    viewIds: ['open_tickets_priority'],
    widgets: ['open_tickets_status', 'avg_ticket_resolution'],
    cadenceRules: {},
    ccBuild: [
      'Ticket pipeline modeled on how your service requests actually flow',
      'Escalation rules tuned to your response-time commitments',
      'Ticket intake from email and web forms, auto-routed by category',
    ],
    keywords: ['ticket', 'service', 'support', 'issue', 'complaint', 'repair'],
  },

  ar_visibility: {
    title: 'Receivables without running a report',
    narrative:
      'Deal records carry invoice status from your accounting software, so who-owes-what shows up next to the rest of the customer picture.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'QuickBooks (or Xero/FreshBooks) connection synced to deal records',
      'Invoice-status properties and an AR aging view inside the CRM',
      'Alerts when an invoice ages past your threshold',
    ],
    keywords: ['receivable', 'invoice', 'ar ', 'owed', 'payment', 'quickbooks', 'unpaid'],
  },

  // ---------------- BEYOND SALES: other HubSpot hubs ----------------
  marketing_email_gap: {
    title: 'Your list finally hears from you',
    narrative:
      'A welcome-and-nurture sequence runs automatically for every new contact, plus a monthly newsletter template your team can actually keep up with.',
    workflows: ['new_contact_welcome'],
    viewIds: [],
    widgets: ['emails_sent'],
    cadenceRules: {},
    tierFeatures: [{ feature: 'email_sending', tier: 'starter' }],
    ccBuild: [
      'Nurture sequence written in your voice, not template-speak',
      'Monthly newsletter template your team fills in, not builds',
      'List segments so the right people get the right message',
    ],
    keywords: ['newsletter', 'email list', 'nurture', 'email marketing', 'never email'],
  },
  landing_pages_gap: {
    title: 'A website that captures, not just sits there',
    narrative:
      'Lead forms and landing pages wired straight into the CRM — every visitor who raises a hand becomes a routed, owned lead.',
    workflows: ['new_lead_assignment'],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    tierFeatures: [{ feature: 'forms', tier: 'starter' }],
    ccBuild: [
      'Lead capture forms embedded on your site (with auto-acknowledgment)',
      'Landing pages for your offers and ads',
      'Form-to-CRM-to-follow-up routing, no manual handoff',
    ],
    keywords: ['landing page', 'website lead', 'web form', 'capture', 'website visitors'],
  },
  content_seo_gap: {
    title: 'Getting found online',
    narrative:
      'Content and SEO are their own discipline — HubSpot Content Hub can host it, but the writing and strategy are a separate engagement we scope with you.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'Honest scoping: content creation is not part of the CRM install',
      'Content Hub readiness assessment if you want HubSpot to host blog/SEO',
      'Referral or separate content engagement, scoped to your market',
    ],
    keywords: ['blog', 'seo', 'content', 'google ranking', 'found online', 'social media'],
  },
  quotes_invoices_split: {
    title: 'Quote to invoice in one motion',
    narrative:
      'Quotes generate from deal records, invoices follow from quotes, and payment status shows up right on the deal. One system, no re-typing.',
    workflows: [],
    viewIds: ['quotes_awaiting'],
    widgets: [],
    cadenceRules: {},
    tierFeatures: [{ feature: 'quotes_payments', tier: 'starter' }],
    ccBuild: [
      'HubSpot Quotes module branded to your business',
      'Quote-to-invoice flow connected to your accounting software',
      'Payment status visible on every deal record',
    ],
    keywords: ['invoice', 'quoting tool', 'billing', 'payment', 're-enter', 'retype'],
  },
  kb_faq_repeat: {
    title: 'Answer it once, reuse it forever',
    narrative:
      'The questions your team answers daily become a chatbot flow and a help library, so customers self-serve and your inbox quiets down.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    tierFeatures: [{ feature: 'knowledge_base', tier: 'pro' }],
    ccBuild: [
      'FAQ chatbot flow built from your real top-10 questions',
      'Knowledge base articles drafted from how your team already answers',
      'Chat-to-ticket escalation when self-serve isn\'t enough',
    ],
    keywords: ['same questions', 'faq', 'knowledge base', 'over and over', 'repeat'],
  },
  surveys_nps_blind: {
    title: 'Hear unhappiness before the churn',
    narrative:
      'Automatic satisfaction surveys after every closed ticket and milestone — unhappy scores alert you while there is still time to save the account.',
    workflows: [],
    viewIds: [],
    widgets: ['avg_ticket_resolution'],
    cadenceRules: {},
    tierFeatures: [{ feature: 'customer_surveys', tier: 'pro' }],
    ccBuild: [
      'NPS / CSAT surveys triggered at the moments that matter',
      'Low-score alerts routed to the account owner immediately',
      'Review-request automation for the happy ones',
    ],
    keywords: ['nps', 'survey', 'csat', 'happy', 'churn', 'unhappy', 'reviews'],
  },
  reporting_excel_pain: {
    title: 'Reports that build themselves',
    narrative:
      'The numbers you wrangle in Excel become live dashboards — always current, zero exports.',
    workflows: [],
    viewIds: ['revenue_forecast'],
    widgets: ['won_vs_lost', 'deal_velocity'],
    cadenceRules: {},
    tierFeatures: [{ feature: 'custom_reporting', tier: 'pro' }],
    ccBuild: [
      'Your Excel reports rebuilt as live HubSpot dashboards',
      'Custom report builder configured for your specific metrics',
      'A Monday-morning dashboard that replaces the spreadsheet ritual',
    ],
    keywords: ['excel', 'export', 'spreadsheet report', 'hours', 'wrangling', 'manual report'],
  },
  ai_manual_drafting: {
    title: 'AI drafts it, your team approves it',
    narrative:
      'Follow-up emails, call summaries, and record overviews drafted by AI inside HubSpot — your team reviews and sends instead of starting from blank.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    tierFeatures: [{ feature: 'ai_features', tier: 'pro' }],
    ccBuild: [
      'AI-drafted follow-up emails tuned to your voice (owner approves before send)',
      'AI call and meeting summaries configured on every record',
      'Team training on where AI saves time and where it doesn\'t',
    ],
    keywords: ['ai', 'chatgpt', 'drafting', 'summaries', 'hand-write', 'manually write'],
  },
}

// Match free text (the vent box) to leak ids by keyword. Local fallback that
// works without any AI key; the Claude-powered version can replace/extend this.
export function matchTextToLeaks(text) {
  if (!text) return []
  const t = text.toLowerCase()
  return Object.entries(SOLUTION_MAP)
    .filter(([, sol]) => sol.keywords.some((k) => t.includes(k)))
    .map(([id]) => id)
}
