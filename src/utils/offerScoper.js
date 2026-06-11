// Offer scoper: walks the configured session and sorts every build item into
// Crescent Connect's offer ladder — what the Free CRM Setup covers, what requires
// the 30-Day Revenue Machine, and what the Sales Activation Retainer runs monthly.
// Scope boundaries mirror offers/0-free-crm-setup and offers/1-30-day-revenue-machine.
// NO PRICING here by design — pricing is never public (Daniel, 2026-06-10).

export const OFFERS = {
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

  // ---------- Free CRM Setup (the 7-day scope, capped) ----------
  const stages = session.deals?.pipelineStages || []
  free.push(`1 sales pipeline built from your stages (${stages.map((s) => s.label).join(' → ')})`)
  free.push('Contact, company, deal & ticket properties configured for your industry')
  if (w.emailPlatform?.includes('Gmail')) free.push('Gmail + Google Calendar connected')
  else if (w.emailPlatform?.includes('Outlook')) free.push('Outlook + calendar connected')
  else free.push('Email + calendar connected')
  if (arr(w.connectTools).includes('Website forms')) free.push('1 website lead form wired in')
  if (w.dataImport?.startsWith('Yes — clean'))
    free.push('Your contact list imported & de-duped (up to 5,000 records)')

  // The single included automation = their top-priority workflow.
  const topProblem = session.fixPlan?.problems?.[0]
  const firstWorkflow = workflows.find((wf) =>
    topProblem ? topProblem.workflows.includes(wf.templateId) : true
  )
  if (firstWorkflow) free.push(`1 automation included — yours: "${firstWorkflow.name}"`)
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
    machine.push('Branching (if/else) automation logic — HubSpot Pro workflows')
  if ((session.customObjects || []).length > 0) {
    machine.push(
      `Custom object${session.customObjects.length === 1 ? '' : 's'}: ${session.customObjects
        .map((o) => o.plural || o.singular)
        .filter(Boolean)
        .join(', ')} — Pro feature, built and associated to your records`
    )
  }
  if (leaks.includes('ticket_blindness'))
    machine.push('Service ticket pipeline with escalation automation')
  if (w.accounting && !['None', 'Something else'].includes(w.accounting))
    machine.push(`${w.accounting} accounting integration — invoices and AR visible on deals`)
  if (leaks.includes('ar_visibility') && (!w.accounting || w.accounting === 'None'))
    machine.push('Accounting/AR visibility integration')
  const widgetCount = (session.dashboards?.widgets || []).length
  if (widgetCount > 5)
    machine.push(`Multi-dashboard reporting suite (${widgetCount} widgets vs. 1 free dashboard)`)
  if (w.dataImport?.startsWith('Yes — but messy'))
    machine.push('Data cleanup, dedupe, and enrichment of your messy list (beyond basic de-dupe)')
  if (leaks.includes('marketing_attribution'))
    machine.push('Lead-source-to-revenue attribution reporting')
  const tools = arr(w.connectTools)
  if (tools.includes('Slack / Teams')) machine.push('Slack/Teams notification wiring')
  if (tools.includes('Zapier / Make')) machine.push('Zapier/Make bridges to your other tools')
  if (tools.includes('Facebook / Instagram ads')) machine.push('Ad platform lead sync')
  if (leaks.includes('inconsistent_onboarding'))
    machine.push('Sales-to-service handoff workflows and onboarding playbook')

  // ---------- Sales Activation Retainer (ongoing execution) ----------
  if (arr(w.leadSources).includes('Cold outreach'))
    retainer.push('Monthly cold outreach sent on your behalf — your CRM, our execution')
  if (leaks.includes('quotes_no_followup'))
    retainer.push('Stalled-quote follow-up worked by a human, not just automation')
  const meetingsOn = (session.cadence?.meetings || []).filter((m) => m.enabled)
  if (meetingsOn.length > 0)
    retainer.push('Dashboard reviews on your cadence — we read the numbers with you')
  retainer.push('Monthly optimization: one new automation, view, or fix every month')

  // ---------- Recommendation ----------
  const recommended = machine.length >= 3 ? 'machine' : 'free'
  const diyNote =
    w.teamSize === 'Just me (1)'
      ? 'Solo operator? There is also a self-paced DIY CRM Build Guide if you would rather build it yourself.'
      : null

  return { free, machine, retainer, recommended, diyNote }
}
