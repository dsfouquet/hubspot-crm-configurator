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
      'Every deal gets logged with a stage and an outcome. Won vs. lost, by rep, by source. One dashboard, zero email archaeology.',
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
      'Your deal stages, the ones you just named, become a shared board. Anyone can see every deal, its stage, its value, and who owns it in five seconds.',
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
      'Source-to-revenue reporting (full multi-touch attribution requires Enterprise, we scope what tier you actually need)',
      'Ad platform and website form connections so sources log themselves',
    ],
    keywords: ['marketing', 'ads', 'attribution', 'roi', 'spend', 'what works'],
  },

  admin_overload: {
    title: 'Admin work that does itself',
    narrative:
      'Welcome emails, data entry, task creation, handoffs, all automated. Your team sells; the system types.',
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

  payment_automation: {
    title: 'Getting paid runs itself',
    narrative:
      'Deposits get collected on the quote, customers pay online from the invoice, and overdue invoices chase themselves on a schedule. The cash comes in without anyone playing collections.',
    workflows: [],
    viewIds: ['quotes_awaiting'],
    widgets: [],
    cadenceRules: {},
    tierFeatures: [{ feature: 'quotes_payments', tier: 'starter' }],
    ccBuild: [
      'Pay link and deposit collection built onto your quotes',
      'Online payment from the invoice connected to your accounting software',
      'Automatic overdue-invoice reminder sequence so you stop chasing checks',
    ],
    keywords: ['get paid', 'getting paid', 'deposit', 'pay online', 'payment link', 'overdue', 'chase payment', 'collections', 'net 30', 'net terms'],
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
      'Lead forms and landing pages wired straight into the CRM. Every visitor who raises a hand becomes a routed, owned lead.',
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
      'Content and SEO are their own discipline. HubSpot Content Hub can host it, but the writing and strategy are a separate engagement we scope with you.',
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
      'Automatic satisfaction surveys after every closed ticket and milestone. Unhappy scores alert you while there is still time to save the account.',
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
      'The numbers you wrangle in Excel become live dashboards, always current, zero exports.',
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
      'Follow-up emails, call summaries, and record overviews drafted by AI inside HubSpot. Your team reviews and sends instead of starting from blank.',
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

  playbook_gap: {
    title: 'One sales process, written down and enforced',
    narrative:
      'Your best rep\'s approach becomes the playbook every deal follows: stage requirements, scripts, and next steps built into the pipeline itself.',
    workflows: [],
    viewIds: ['pipeline_board'],
    widgets: [],
    cadenceRules: { requireNextStep: true },
    tierFeatures: [{ feature: 'playbooks', tier: 'pro' }],
    ccBuild: [
      'Sales playbook documented from how your best rep actually sells',
      'Stage-by-stage required fields so no deal advances half-baked',
      'HubSpot Playbooks cards your reps see right on the deal record',
    ],
    keywords: ['playbook', 'sales process', 'own way', 'no process', 'consistent process', 'training new'],
  },
  tools_dont_talk: {
    title: 'Tools that finally talk to each other',
    narrative:
      'The re-typing stops: your CRM, email, calendar, accounting, and other tools sync automatically, so the same data lives everywhere without anyone copying it.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'Integration map of your full tool stack: what syncs, what gets replaced',
      'Native + Zapier/Make connections built and tested',
      'One source of truth: no more "which system is right?"',
    ],
    keywords: ['re-type', 'retype', 'copy paste', "don't talk", 'sync', 'double entry', 'duplicate entry'],
  },
  contact_context: {
    title: 'The whole relationship, on the record',
    narrative:
      'What each person is working on, their pain points, their history with you, captured on the contact record automatically, so the knowledge survives vacations, turnover, and bad memories.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'Custom properties for the intel you actually use (projects, pain points, preferences)',
      'AI call summaries writing notes to the record automatically',
      'Record layouts that put the story front and center',
    ],
    keywords: ['notes on', 'remember', 'in their head', 'what they were working', 'context'],
  },
  company_picture: {
    title: 'One screen per company',
    narrative:
      'Every company record shows who works there, every open deal and ticket, recent conversations, and even company news. The full account picture without opening five tabs.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'Company records wired to all their contacts, deals, and tickets',
      'Breeze Intelligence enrichment (size, industry, news) on every account',
      'Account-view layout built for how you actually review accounts',
    ],
    keywords: ['who works there', 'company news', 'account view', 'org chart'],
  },
  focus_scatter: {
    title: 'Know exactly who deserves your time',
    narrative:
      'When the data lives in one clean system, "who should I call today?" answers itself: who is hot, who has gone quiet, and who has never heard from you at all.',
    workflows: ['deal_stale_alert'],
    viewIds: [],
    widgets: ['contacts_by_lifecycle'],
    cadenceRules: { flagNoActivityEnabled: true },
    ccBuild: [
      'Last-touched and never-contacted views so no one slips through',
      'Priority ranking for who deserves attention this week',
      'De-scattering: every list, inbox, and notebook merged into one system',
    ],
    keywords: ['data is everywhere', 'who to call', 'heard from us', 'scattered', 'where to spend time'],
  },
  vip_segmentation: {
    title: 'Customers, leads, and VIPs, obvious at a glance',
    narrative:
      'Lifecycle stages and tiers label every record automatically: lead vs. customer vs. your best relationships. Every list, view, and email targets exactly the right group.',
    workflows: [],
    viewIds: [],
    widgets: ['contacts_by_lifecycle'],
    cadenceRules: {},
    ccBuild: [
      'Lifecycle stages configured to your definitions (lead to customer to VIP)',
      'Contact tiering for your most valuable relationships',
      'Saved segments per group so targeting is one click',
    ],
    keywords: ['vip', 'customer vs lead', 'tier', 'who is a customer', 'segment'],
  },
  relationship_gap: {
    title: 'Build the relationships that win the work',
    narrative:
      'Consistent, personal touches with the right people: visit cadences, check-in reminders, and personal-detail tracking that make every interaction feel like you remembered everything.',
    workflows: [],
    viewIds: ['site_visit_schedule'],
    widgets: ['meetings_booked'],
    cadenceRules: { requireNextStep: true },
    ccBuild: [
      'Relationship cadences: who to visit, call, or take to lunch, and when',
      'Personal-detail properties (interests, history, preferences) on key contacts',
      'Decision-maker mapping per account so you court the right people',
    ],
    keywords: ['relationship', 'not close enough', 'rapport', 'trust', 'know them better'],
  },
  tasks_slip: {
    title: 'Nothing lives in memory anymore',
    narrative:
      'Every commitment becomes a task tied to a contact or deal, with owners, due dates, and automatic reminders, visible by person and by week.',
    workflows: ['deal_stale_alert'],
    viewIds: [],
    widgets: ['tasks_completed_overdue'],
    cadenceRules: { autoRemindEnabled: true, requireNextStep: true },
    ccBuild: [
      'Task templates auto-created at each pipeline stage',
      'Recurring task cadences for the things that happen every week/month',
      'Completion-rate visibility by person for your Monday meeting',
    ],
    keywords: ['tasks slip', 'forgot', 'fell through', 'memory', 'slack message', 'dropped ball', 'not written down'],
  },

  // ---- RevOps / cross-cutting (added June 2026 from the documented pain library) ----
  key_person_risk: {
    title: "The business that doesn't walk out the door",
    narrative:
      'Every relationship, deal, and next step lives in the CRM instead of one person\'s head. If your top rep leaves, the book of business stays. The new hire picks up exactly where they left off.',
    workflows: ['new_lead_assignment'],
    viewIds: ['pipeline_board'],
    widgets: ['rep_activity', 'pipeline_value_stage'],
    cadenceRules: { requireNextStep: true },
    ccBuild: [
      'Every account, contact, and open deal documented in the CRM, not in memory',
      'Logged activity and next steps on every relationship, so coverage survives a departure',
      'Ownership and reassignment rules so a leaving rep\'s book transfers cleanly',
    ],
    keywords: ['bus factor', 'in her head', 'in his head', 'if they leave', 'top rep', 'single point', 'one person knows', 'walks out'],
  },
  handoff_void: {
    title: 'No more leads dying between teams',
    narrative:
      'Marketing, sales, and operations run off one system, so a lead never lands in a void at the handoff. Qualified leads route to the right rep instantly, closed-won kicks off delivery, and nothing waits on someone remembering to forward an email.',
    workflows: ['new_lead_assignment', 'closed_won_handoff'],
    viewIds: ['stale_deals'],
    widgets: ['contacts_by_lifecycle'],
    cadenceRules: { requireNextStep: true },
    ccBuild: [
      'Lead routing + lifecycle stages so marketing-qualified leads reach sales automatically',
      'Closed-won to onboarding handoff workflow so delivery starts itself',
      'A shared definition of "qualified" so nothing falls between marketing, sales, and ops',
    ],
    keywords: ['handoff', 'hand-off', 'falls through', 'between teams', 'lost in the gap', 'nobody owns', 'marketing and sales', 'disconnected teams'],
  },
  lead_gen_gap: {
    title: 'A marketing engine that fills the pipeline',
    narrative:
      'Your site, content, and ads become a steady source of qualified leads. Forms and landing pages capture them, campaigns are tracked to revenue, and every lead flows into the CRM ready to work instead of hoping referrals show up.',
    workflows: ['new_lead_assignment', 'new_contact_welcome'],
    viewIds: [],
    widgets: ['contacts_by_lifecycle'],
    cadenceRules: {},
    ccBuild: [
      'Lead-capture forms and landing pages wired straight into the CRM',
      'Lead-source tracking so you know which channels actually produce',
      'A nurture campaign that warms up the "not yet ready" leads over time',
    ],
    keywords: ['not enough leads', 'more leads', 'lead generation', 'lead gen', 'qualified leads', 'need leads', 'empty pipeline', 'slow month'],
  },

  // ---- AI — where AI can take work off the team's plate ----
  ai_followups: {
    title: 'AI writes the first draft of every follow-up',
    narrative:
      'Breeze AI drafts follow-up emails and replies in your voice, ready to review and send, so chasing a quote or answering a prospect takes seconds, not a blank page.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'AI email drafting set up in your inbox and on deals',
      'Reply suggestions tuned to how your team actually writes',
      'One-click send after a quick human review',
    ],
    keywords: ['draft emails', 'write emails', 'follow-up by hand', 'ai email', 'reply suggestions', 'compose'],
  },
  ai_summaries: {
    title: 'Every call and meeting summarizes itself',
    narrative:
      'AI records, transcribes, and summarizes calls and meetings, then writes the next steps straight onto the contact, so nobody types notes from memory again.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'AI call and meeting summaries logged to the record automatically',
      'Next steps and tasks pulled out of the conversation',
      'Searchable transcripts on every contact and deal',
    ],
    keywords: ['meeting notes', 'call notes', 'summary', 'transcribe', 'ai notes', 'recap', 'minutes'],
  },
  ai_research: {
    title: 'AI researches the prospect before you call',
    narrative:
      'Breeze enriches each contact and company and briefs the rep before outreach (size, role, recent news) so the first touch is personalized without an hour of digging.',
    workflows: [],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'AI prospect and company enrichment on new leads',
      'Pre-call briefs generated automatically',
      'Personalized opening lines drafted for outreach',
    ],
    keywords: ['research prospects', 'enrich', 'background', 'ai research', 'company info', 'lookup'],
  },
  ai_chatbot: {
    title: 'AI answers visitors the moment they land',
    narrative:
      'An AI chat agent answers website questions, qualifies the visitor, and books a meeting or routes a hot lead to a rep, instantly, day or night.',
    workflows: ['new_lead_assignment'],
    viewIds: [],
    widgets: [],
    cadenceRules: {},
    ccBuild: [
      'AI website chat trained on your business and FAQs',
      'Instant qualification and meeting booking',
      'Hot-lead routing to the right rep in real time',
    ],
    keywords: ['chatbot', 'chat', 'website visitors', 'after hours', 'instant answers', 'ai chat', 'live chat'],
  },
}

// SPIN layer (sales/discovery-questions/Discovery-Questions-By-Hub.md):
// each problem carries its Implication line — the "what is this costing you"
// framing shown on fix-plan cards and the PDF — plus the HubSpot hub it maps to.
// Routing rule from that doc: 2+ hubs firing = Core Offer conversation.
const SPIN_EXTRAS = {
  quotes_no_followup: {
    hub: 'Sales Hub',
    implication: 'If a $50K quote dies once a quarter from no follow-up, what is that costing you in a year?',
  },
  unknown_close_rate: {
    hub: 'Reporting',
    implication: "If you can't measure close rate by rep, source, and service line, you don't know which to fix first, and fixing the wrong one isn't free.",
  },
  leads_fall_through: {
    hub: 'Sales Hub',
    implication: 'The competitor who called your last lead back in 5 minutes. What did that conversation cost you?',
  },
  pipeline_in_head: {
    hub: 'CRM',
    implication: 'If your best rep walked out tomorrow, how much of what is in their head walks out with them?',
  },
  rep_workload_unproven: {
    hub: 'Reporting',
    implication: 'If your #1 rep trains the next hire, how long before that hire is actually useful, and what does that gap cost?',
  },
  no_reengagement: {
    hub: 'CRM',
    implication: 'If even 5% of your old customers re-engaged once a year, what would that add to revenue?',
  },
  marketing_attribution: {
    hub: 'Marketing Hub',
    implication: "Spending $3K/month on ads with no closed deal tied to any campaign. How do you decide what to cut and what to scale?",
  },
  admin_overload: {
    hub: 'Operations',
    implication: 'If your reps got back 10 hours a week from admin, how many more closed deals is that in a year?',
  },
  inconsistent_onboarding: {
    hub: 'Service Hub',
    implication: 'Two clients getting two different experiences. What does that do to referrals and reviews?',
  },
  ticket_blindness: {
    hub: 'Service Hub',
    implication: 'The issue that never gets resolved costs more than the slow one. It becomes a lost client. How many are open right now?',
  },
  ar_visibility: {
    hub: 'Commerce Hub',
    implication: 'If $50K sits in outstanding invoices and 20% go 60+ days past due, that is $10K you are lending for free.',
  },
  marketing_email_gap: {
    hub: 'Marketing Hub',
    implication: 'A list that never gets emailed loses about 20% of its value a year to attrition. How long has yours been sitting?',
  },
  landing_pages_gap: {
    hub: 'Marketing Hub',
    implication: '300 visitors a month and none fill out a form. Every one is anonymous. What is it worth to identify even 5%?',
  },
  content_seo_gap: {
    hub: 'Content Hub',
    implication: 'If competitors own page one for your top service keywords, what share of inbound are you handing them?',
  },
  quotes_invoices_split: {
    hub: 'Commerce Hub',
    implication: 'If your process adds 7 days from proposal to payment across 50 deals a year, what is the cumulative cash-flow hit?',
  },
  payment_automation: {
    hub: 'Commerce Hub',
    implication: 'Every week a payment sits uncollected is a week you are financing your customer for free. How many invoices are past due right now?',
  },
  kb_faq_repeat: {
    hub: 'Service Hub',
    implication: '30 minutes a day answering repeat questions is 10+ hours a month of payroll spent on answers a page could give.',
  },
  surveys_nps_blind: {
    hub: 'Service Hub',
    implication: 'A client who stays three years vs. one who leaves after year one. If slow service loses you two a year, what is that number?',
  },
  reporting_excel_pain: {
    hub: 'Reporting',
    implication: 'If your revenue report is always two weeks behind, how many decisions last quarter ran on stale numbers?',
  },
  ai_manual_drafting: {
    hub: 'AI',
    implication: 'Twenty hand-written emails a day per rep that AI could draft. What is that in hours a month?',
  },
  playbook_gap: {
    hub: 'Sales Hub',
    implication: 'If every rep sells their own way, your best practices retire the day your best rep does.',
  },
  tools_dont_talk: {
    hub: 'Operations',
    implication: '30 minutes a day copying data between tools is 10+ hours a month. What is that person\'s hourly cost?',
  },
  contact_context: {
    hub: 'CRM',
    implication: 'When a rep leaves, every undocumented relationship leaves with them. What did the last departure cost?',
  },
  company_picture: {
    hub: 'CRM',
    implication: 'If reviewing one account takes five tabs and three people, how many accounts never get reviewed at all?',
  },
  focus_scatter: {
    hub: 'CRM',
    implication: 'B2B contact data decays ~30% a year. How much of your scattered list is already dead?',
  },
  vip_segmentation: {
    hub: 'CRM',
    implication: "If your best customers get the same attention as cold leads, you're overpaying for one and underserving the other.",
  },
  relationship_gap: {
    hub: 'Sales Hub',
    implication: 'You are 60-70% likely to sell to an existing relationship and 5-20% to a stranger. Where is your time actually going?',
  },
  tasks_slip: {
    hub: 'Operations',
    implication: 'One dropped task in client delivery. What is the downstream cost in rework and client trust?',
  },
  key_person_risk: {
    hub: 'RevOps',
    implication: 'If your top producer left tomorrow, would the book survive the quarter, or walk out with them?',
  },
  handoff_void: {
    hub: 'RevOps',
    implication: 'A lead that dies in the gap between marketing and sales never shows up in a report. How many did last month?',
  },
  lead_gen_gap: {
    hub: 'Marketing Hub',
    implication: 'If marketing produced 10 more qualified leads a month at your close rate, what would that add to revenue this year?',
  },
  ai_followups: {
    hub: 'AI',
    implication: 'If every rep got two selling hours a week back from drafting emails, what is that across the team in a year?',
  },
  ai_summaries: {
    hub: 'AI',
    implication: 'How many details get lost between a call and the CRM because someone had to remember to write them down?',
  },
  ai_research: {
    hub: 'AI',
    implication: 'An hour of manual research per deal, across every deal. What is that costing in reps not selling?',
  },
  ai_chatbot: {
    hub: 'AI',
    implication: 'How many after-hours visitors leave without an answer because nobody was online to reply?',
  },
}

Object.entries(SPIN_EXTRAS).forEach(([id, extra]) => {
  if (SOLUTION_MAP[id]) Object.assign(SOLUTION_MAP[id], extra)
})

// Checklist display labels: one-word pain (bold in UI) + short description.
const PAIN_LABELS = {
  quotes_no_followup: { pain: 'Quote follow-up', painDesc: 'after we send a quote, follow-up isn’t consistent' },
  unknown_close_rate: { pain: 'Close rate', painDesc: 'we don’t know why we win or lose deals, so we don’t know where to improve' },
  lead_gen_gap: { pain: 'Lead generation', painDesc: 'not enough qualified leads coming from marketing' },
  leads_fall_through: { pain: 'Leads', painDesc: 'sales takes too long to engage the ones who fill a form or reach out' },
  pipeline_in_head: { pain: 'Pipeline', painDesc: "we can't see every open deal, where it stands, and what's been followed up on" },
  rep_workload_unproven: { pain: 'Reps', painDesc: 'we have reps but can’t see how their activity impacts revenue' },
  no_reengagement: { pain: 'Re-engagement', painDesc: 'past clients don’t hear from us enough for new opportunities' },
  marketing_attribution: { pain: 'Attribution', painDesc: 'marketing spend has no clear tie to closed revenue' },
  admin_overload: { pain: 'Admin', painDesc: 'data entry and manual emails eat selling time' },
  inconsistent_onboarding: { pain: 'Onboarding', painDesc: 'every client gets a different experience' },
  ticket_blindness: { pain: 'Tickets', painDesc: "can't see service issues without calling someone" },
  ar_visibility: { pain: 'Receivables', painDesc: "don't know what's owed without running a report" },
  playbook_gap: { pain: 'Process', painDesc: 'nothing written down, every rep sells their own way' },
  marketing_email_gap: { pain: 'Email', painDesc: 'we never send marketing emails to our list, no newsletter, no nurture' },
  landing_pages_gap: { pain: 'Capture', painDesc: "we aren't capturing leads anywhere we can easily follow up" },
  content_seo_gap: { pain: 'Visibility', painDesc: 'nobody finds us online, no blog, SEO, or content' },
  quotes_invoices_split: { pain: 'Billing', painDesc: "quoting and invoicing live in tools that don't talk" },
  payment_automation: { pain: 'Getting paid', painDesc: 'collecting deposits and chasing overdue invoices is all manual' },
  kb_faq_repeat: { pain: 'FAQs', painDesc: 'we answer the same customer questions over and over' },
  surveys_nps_blind: { pain: 'Feedback', painDesc: "we don't know customers are unhappy until they're gone" },
  reporting_excel_pain: { pain: 'Reports', painDesc: 'every report or dashboard wastes time on exports and spreadsheets, nothing’s automated' },
  ai_manual_drafting: { pain: 'AI opportunity', painDesc: "we know there are processes AI could handle, we just haven't started yet" },
  ai_followups: { pain: 'AI follow-ups', painDesc: 'we write every follow-up and reply by hand' },
  ai_summaries: { pain: 'AI notes', painDesc: 'calls and meetings have no automatic summary or next steps' },
  ai_research: { pain: 'AI research', painDesc: 'we research every prospect and account by hand' },
  ai_chatbot: { pain: 'AI chat', painDesc: 'website visitors get no instant answers, day or night' },
  tools_dont_talk: { pain: 'Sync', painDesc: "our apps and programs don't talk, so the same data gets re-typed into multiple systems" },
  tasks_slip: { pain: 'Tasks', painDesc: 'engaging the right customer at the right time slips, we can’t prioritize the best activities' },
  contact_context: { pain: 'Context', painDesc: "what each person's working on, their pain points, it lives in reps' heads" },
  company_picture: { pain: 'Org picture', painDesc: "can't get a complete view of a customer's company, who works there, and what's happening, in one place" },
  focus_scatter: { pain: 'Focus', painDesc: "data's everywhere, we don't know who to spend time on or who's heard from us" },
  vip_segmentation: { pain: 'VIPs', painDesc: "can't tell customers from leads from our best relationships at a glance" },
  relationship_gap: { pain: 'Relationships', painDesc: 'building deep enough relationships with the right people is slow and hard' },
  key_person_risk: { pain: 'Key-person risk', painDesc: 'all contacts and opportunities live in one rep’s head. If they leave, so does the info' },
  handoff_void: { pain: 'Handoffs', painDesc: 'we lose jobs and customers to slow handoffs and miscommunication between departments' },
}

Object.entries(PAIN_LABELS).forEach(([id, labels]) => {
  if (SOLUTION_MAP[id]) Object.assign(SOLUTION_MAP[id], labels)
})

// Full display label for a pain id, e.g. "Quotes: follow-up goes silent...".
export function painLabel(id) {
  const s = SOLUTION_MAP[id]
  return s ? `${s.pain}: ${s.painDesc}` : id
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
