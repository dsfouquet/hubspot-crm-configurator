// Offer scoper: walks the configured session and sorts every build item into
// Crescent Connect's offer ladder — what the Free CRM Setup covers, what requires
// the 30-Day Revenue Machine, and what the Sales Activation Retainer runs monthly.
// Scope boundaries mirror offers/0-free-crm-setup and offers/1-30-day-revenue-machine.
// NO PRICING here by design — pricing is never public (Daniel, 2026-06-10).

import { qualify } from './qualification'

export const OFFERS = {
  diy: {
    key: 'diy',
    name: 'DIY CRM Build Guide',
    tagline: 'Build it yourself, the right way, with our exact playbook.',
    color: '#7C5CFC',
  },
  free: {
    key: 'free',
    name: 'Free CRM Setup',
    tagline: 'Done-for-you in 7 days. One call, one spreadsheet.',
    color: '#00BDA5',
  },
  machine: {
    key: 'machine',
    name: 'The 30-Day Revenue Machine',
    tagline: 'The full build: every workflow automated and dashboarded in 30 days.',
    color: '#FF7A59',
  },
  retainer: {
    key: 'retainer',
    name: 'Sales Activation Retainer',
    tagline: 'After the install: we run the outreach and keep the pipeline moving.',
    color: '#2D3E50',
  },
}

export function scopeOffers(session) {
  const w = session.wizard || {}
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  const leaks = (session.fixPlan?.problems || []).map((p) => p.id)
  const workflows = session.workflows || []
  const free = []
  const machine = []
  const retainer = []

  // ---------- DIY CRM Build Guide (self-serve, for unqualified prospects) ----------
  // Same outcome, their hands. Mirrors offers/2-diy-guide-$497.
  const diy = [
    '8-video step-by-step HubSpot setup course',
    '30-page written build guide you follow at your own pace',
    `Importable pipeline & workflow templates for your industry${
      w.industry ? ` (${w.industry})` : ''
    }`,
    'Contact, company & deal property templates to import',
    '100 cold email templates + 50 subject lines by industry',
    'The exact dashboard layout we build, recreated by you',
    '$497 credit toward a done-for-you build when you are ready',
  ]

  // ---------- Free CRM Setup (the 7-day scope, capped) ----------
  const stages = session.deals?.pipelineStages || []
  free.push(`1 sales pipeline built from your stages (${stages.map((s) => s.label).join(' → ')})`)
  free.push('Contact, company, deal & ticket properties configured for your industry')
  if (w.emailPlatform?.includes('Gmail')) free.push('Gmail + Google Calendar connected')
  else if (w.emailPlatform?.includes('Outlook')) free.push('Outlook + calendar connected')
  else free.push('Email + calendar connected')
  if (arr(w.connectTools).includes('Website forms') || leaks.includes('landing_pages_gap'))
    free.push('1 website lead form wired in')
  if (leaks.includes('kb_faq_repeat')) free.push('1 basic FAQ chatbot flow')
  if (w.dataImport?.startsWith('Yes — clean'))
    free.push('Your contact list imported & de-duped (up to 5,000 records)')

  // The single included automation = their top-priority workflow.
  const topProblem = session.fixPlan?.problems?.[0]
  const firstWorkflow = workflows.find((wf) =>
    topProblem ? topProblem.workflows.includes(wf.templateId) : true
  )
  if (firstWorkflow) free.push(`1 automation included, yours: "${firstWorkflow.name}"`)
  free.push('5 email templates + 10 snippets + meeting scheduler')
  free.push('Quote follow-up task cadence (3 / 7 / 14-day reminders)')
  free.push('1 owner dashboard: leads, deals, pipeline value, close rate')
  free.push('Bonus: 100 cold outreach emails sent on your behalf')

  // ---------- 30-Day Revenue Machine (everything past the free caps) ----------
  const extraWorkflows = workflows.filter((wf) => wf.id !== firstWorkflow?.id)
  if (extraWorkflows.length > 0) {
    machine.push(
      `${extraWorkflows.length} additional automation${extraWorkflows.length === 1 ? '' : 's'}: ${extraWorkflows
        .map((wf) => wf.name)
        .join(', ')}`
    )
  }
  if (workflows.some((wf) => wf.nodes?.some((n) => n.type === 'condition')))
    machine.push('Branching (if/else) automation logic, built on HubSpot Pro workflows')
  if ((session.customObjects || []).length > 0) {
    machine.push(
      `Custom object${session.customObjects.length === 1 ? '' : 's'}: ${session.customObjects
        .map((o) => o.plural || o.singular)
        .filter(Boolean)
        .join(', ')} (a Pro feature), built and associated to your records`
    )
  }
  if (leaks.includes('ticket_blindness'))
    machine.push('Service ticket pipeline with escalation automation')
  if (w.accounting && !['None', 'Something else', 'Spreadsheets / manual'].includes(w.accounting))
    machine.push(`${w.accounting} accounting integration: invoices and AR visible on deals`)
  if (leaks.includes('ar_visibility') && (!w.accounting || w.accounting === 'None'))
    machine.push('Accounting/AR visibility integration')
  const widgetCount = (session.dashboards?.widgets || []).length
  if (widgetCount > 5)
    machine.push(`Multi-dashboard reporting suite (${widgetCount} widgets vs. 1 free dashboard)`)
  if (w.dataImport?.startsWith('Yes — but messy') || w.dataImport?.startsWith('Sort of'))
    machine.push('Data rescue: cleanup, dedupe, and enrichment of your scattered list (beyond basic de-dupe)')
  if (leaks.includes('marketing_attribution'))
    machine.push('Lead-source-to-revenue attribution reporting')
  const tools = arr(w.connectTools)
  if (tools.some((t) => t.startsWith('Chat'))) machine.push('Slack/Teams notification wiring')
  if (tools.includes('Zapier / Make')) machine.push('Zapier/Make bridges to your other tools')
  if (tools.includes('Facebook / Instagram ads')) machine.push('Ad platform lead sync')
  if (tools.some((t) => t.startsWith('Proposals'))) machine.push('Proposal & e-sign integration tied to deals')
  if (tools.some((t) => t.startsWith('Lead databases'))) machine.push('Lead database integration (ZoomInfo/Apollo)')
  if (tools.some((t) => t.startsWith('AI meeting notes'))) machine.push('AI meeting-notes sync to records')
  if (tools.some((t) => t.startsWith('Phone'))) machine.push('Calling/SMS integration with auto-logging')
  if (leaks.includes('inconsistent_onboarding'))
    machine.push('Sales-to-service handoff workflows and onboarding playbook')
  // Beyond-sales hub pains
  if (leaks.includes('marketing_email_gap'))
    machine.push('Marketing automation: nurture sequence + monthly newsletter template')
  if (leaks.includes('landing_pages_gap'))
    machine.push('Full lead capture: up to 5 forms + landing pages with routing')
  if (leaks.includes('quotes_invoices_split'))
    machine.push('HubSpot Quotes + payments, connected to your accounting')
  if (leaks.includes('kb_faq_repeat'))
    machine.push('Knowledge base + chat-to-ticket escalation (beyond the basic chatbot)')
  if (leaks.includes('surveys_nps_blind'))
    machine.push('NPS/CSAT survey automation with low-score alerts')
  if (leaks.includes('reporting_excel_pain'))
    machine.push('Your Excel reports rebuilt as live custom dashboards')
  if (leaks.includes('ai_manual_drafting'))
    machine.push('AI summaries + AI-drafted follow-ups configured for your team')

  // ---------- Sales Activation Retainer (ongoing execution) ----------
  if (arr(w.leadSources).includes('Cold outreach'))
    retainer.push('Monthly cold outreach sent on your behalf: your CRM, our execution')
  if (leaks.includes('quotes_no_followup'))
    retainer.push('Stalled-quote follow-up worked by a human, not just automation')
  const meetingsOn = (session.cadence?.meetings || []).filter((m) => m.enabled)
  if (meetingsOn.length > 0)
    retainer.push('Dashboard reviews on your cadence: we read the numbers with you')
  if (leaks.includes('content_seo_gap'))
    retainer.push('Content / SEO is its own engagement; we scope it with you after the install')
  retainer.push('Monthly optimization: one new automation, view, or fix every month')

  // ---------- Recommendation ----------
  // BANT gate first: an unqualified prospect (under the revenue / tenure / team
  // floor for the Free Setup) is routed to the self-serve DIY Guide, never to a
  // Free Setup or a Core Offer pitch. Matches the funnel spec in crescent CLAUDE.md.
  // Only THEN, for qualified prospects: 2+ hubs firing = Core Offer conversation.
  const hubsFiring = [
    ...new Set((session.fixPlan?.problems || []).map((p) => p.hub).filter(Boolean)),
  ]
  // Only the customer funnel collects BANT (revenue / tenure / team), so only it
  // can fail qualification. Presenter mode has no annualRevenue field and must keep
  // its free-vs-machine logic untouched.
  const bantEvaluated = Boolean(session.qualification) || Boolean(w.annualRevenue)
  const verdict = session.qualification || qualify(w)
  // A 100+ person team is always a full-build (Core Offer) + retainer fit. It
  // never routes to the Free Setup or DIY guide, regardless of other signals.
  const isEnterprise = w.teamSize === 'Enterprise (100+)'
  const qualified = isEnterprise ? true : bantEvaluated ? verdict.qualified : true
  const recommended = isEnterprise
    ? 'machine'
    : bantEvaluated && !qualified
      ? 'diy'
      : hubsFiring.length >= 2 || machine.length >= 3
        ? 'machine'
        : 'free'
  const diyNote =
    qualified && w.teamSize === 'Just me (1)'
      ? 'Solo operator? There is also a self-paced DIY CRM Build Guide if you would rather build it yourself.'
      : null

  // Plain-English reasons the Free Setup can't cover the FULL scope — i.e. why
  // the Core Offer (30-Day Revenue Machine) is the real fit. Derived from the
  // same signals that populate machine[]. Used by the 3-card CTA.
  const freeBlockers = []
  if (hubsFiring.length >= 2)
    freeBlockers.push(
      `Your needs span ${hubsFiring.join(' + ')}. The Free Setup builds one workspace, not the whole operation`
    )
  const extraWfCount = workflows.filter((wf) => wf.id !== firstWorkflow?.id).length
  if (extraWfCount > 0)
    freeBlockers.push(
      `${extraWfCount + 1} automations to build. The Free Setup includes just 1 simple automation`
    )
  if (workflows.some((wf) => wf.nodes?.some((n) => n.type === 'condition')))
    freeBlockers.push('Branching (if/then) automations, a HubSpot Pro capability')
  if ((session.customObjects || []).length > 0)
    freeBlockers.push(
      `Custom "${(session.customObjects[0].plural || session.customObjects[0].singular)}" object, a HubSpot Pro feature`
    )
  if (w.accounting && !['None', 'Something else', 'Spreadsheets / manual'].includes(w.accounting))
    freeBlockers.push(`${w.accounting} integration: invoices and AR synced onto deals`)
  if ((session.dashboards?.widgets || []).length > 5)
    freeBlockers.push('A multi-dashboard reporting suite. The Free Setup includes 1 owner dashboard')
  if (w.dataImport?.startsWith('Yes — but messy') || w.dataImport?.startsWith('Sort of'))
    freeBlockers.push('A messy, scattered list to rescue. The Free Setup covers a clean import up to 5,000 contacts')
  if (['50–100', '100+'].includes(w.monthlyVolume))
    freeBlockers.push(`High lead volume (${w.monthlyVolume}/mo) needs routing + scoring beyond the free scope`)
  if (isEnterprise)
    freeBlockers.push('A 100+ person team needs multi-user roles, permissions, and routing well beyond the Free Setup’s single-workspace scope')

  return { free, machine, retainer, diy, recommended, qualified, diyNote, hubsFiring, freeBlockers }
}
