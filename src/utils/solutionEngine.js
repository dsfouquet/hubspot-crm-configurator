// Solution engine: turns discovery answers into (1) a Fix Plan — problem cards
// with narratives and Crescent Connect build scope — and (2) a config patch
// applied to the session (workflows, widgets, cadence rules, pipeline stages).

import { SOLUTION_MAP, matchTextToLeaks, painLabel } from '../constants/solutionMap'
import { WORKFLOW_TEMPLATES, instantiateTemplate } from '../constants/workflowTemplates'
import { AVATAR_OBJECTS } from '../constants/avatars'

// Parse "Lead → Site Visit → Quote Sent → Won" (or commas, dashes, numbered
// lists) into pipeline stages. Returns null if fewer than 2 stages found.
export function parseDealStages(text) {
  if (!text) return null
  const parts = text
    .split(/→|->|=>|,|;|\n|(?:\s+then\s+)/i)
    .map((s) => s.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter((s) => s.length > 0 && s.length <= 40)
    .slice(0, 8)
  if (parts.length < 2) return null
  return parts.map((label, i) => {
    const l = label.toLowerCase()
    const isWon = /\bwon\b|closed.?won|sold|signed/.test(l)
    const isLost = /\blost\b|closed.?lost|dead/.test(l)
    return {
      key: `${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}_${i}`,
      label,
      probability: isWon ? 100 : isLost ? 0 : Math.round(((i + 1) / parts.length) * 80),
    }
  })
}

// Sales-cycle tuning: scale workflow wait times and stale-deal thresholds to the
// prospect's actual cycle, so a 6-month seller doesn't get 2-day nudges.
export function cycleTuning(salesCycle) {
  switch (salesCycle) {
    case 'Days':
      return { delayFactor: 0.5, staleDays: 5 }
    case 'A few weeks':
      return { delayFactor: 1, staleDays: 10 }
    case '1–3 months':
      return { delayFactor: 1.5, staleDays: 21 }
    case '3–12 months':
      return { delayFactor: 3, staleDays: 30 }
    case 'Over a year':
      return { delayFactor: 5, staleDays: 45 }
    default:
      return { delayFactor: 1, staleDays: 14 }
  }
}

// Scale every "Wait X days" delay node and stale-alert day count in a workflow.
function tuneWorkflowTiming(workflow, { delayFactor, staleDays }) {
  const scale = (n) => Math.max(1, Math.round(n * delayFactor))
  const nodes = workflow.nodes.map((n) => {
    let { label, detail } = n
    if (n.type === 'delay') {
      label = label.replace(/(\d+)\s*day/i, (_, d) => `${scale(Number(d))} day`)
      // Fix pluralization after scaling.
      label = label.replace(/\b1 days\b/, '1 day')
    }
    if (/14 days/.test(label)) label = label.replace('14 days', `${staleDays} days`)
    if (detail && /14 days/.test(detail)) detail = detail.replace('14 days', `${staleDays} days`)
    return { ...n, label, detail }
  })
  const triggerSummary = (workflow.triggerSummary || '').replace('14 days', `${staleDays} days`)
  return { ...workflow, nodes, triggerSummary }
}

// Industry-specific custom object suggestions — the thing their business tracks
// that HubSpot has no record type for.
const INDUSTRY_OBJECTS = {
  'Construction / Contracting': {
    singular: 'Job',
    plural: 'Jobs',
    description: 'Every job site with status, crew, and linked deals',
    properties: [
      { label: 'Site Address', type: 'Text' },
      { label: 'Job Status', type: 'Dropdown' },
      { label: 'Crew Lead', type: 'Text' },
      { label: 'Target Completion', type: 'Date' },
    ],
  },
  'Industrial / Manufacturing': {
    singular: 'Equipment',
    plural: 'Equipment',
    description: 'Installed equipment with model, serial, and service history',
    properties: [
      { label: 'Model Number', type: 'Text' },
      { label: 'Serial Number', type: 'Text' },
      { label: 'Location / Unit', type: 'Text' },
      { label: 'Next Service Due', type: 'Date' },
    ],
  },
  'Real Estate': {
    singular: 'Property',
    plural: 'Properties',
    description: 'Listings and properties tied to contacts and deals',
    properties: [
      { label: 'Address', type: 'Text' },
      { label: 'Listing Status', type: 'Dropdown' },
      { label: 'List Price', type: 'Number' },
    ],
  },
  'Professional Services': {
    singular: 'Project',
    plural: 'Projects',
    description: 'Client projects with phase, owner, and deadline',
    properties: [
      { label: 'Project Phase', type: 'Dropdown' },
      { label: 'Project Owner', type: 'Text' },
      { label: 'Due Date', type: 'Date' },
    ],
  },
  'Technology / Software': {
    singular: 'Subscription',
    plural: 'Subscriptions',
    description: 'Customer subscriptions with plan, seats, and renewal date',
    properties: [
      { label: 'Plan', type: 'Dropdown' },
      { label: 'Seats', type: 'Number' },
      { label: 'Renewal Date', type: 'Date' },
    ],
  },
  'Financial / Insurance': {
    singular: 'Policy',
    plural: 'Policies',
    description: 'Policies/accounts with type, status, and renewal date',
    properties: [
      { label: 'Policy Number', type: 'Text' },
      { label: 'Policy Type', type: 'Dropdown' },
      { label: 'Renewal Date', type: 'Date' },
    ],
  },
}

// Avatar industries (customer mode) first, then the presenter industry list.
function industryObjectDef(industry) {
  return AVATAR_OBJECTS[industry] || INDUSTRY_OBJECTS[industry] || null
}

export function industryObjectFor(industry) {
  const def = industryObjectDef(industry)
  if (!def) return null
  return {
    id: `obj_industry_${Date.now()}`,
    singular: def.singular,
    plural: def.plural,
    description: def.description,
    properties: def.properties.map((p, i) => ({
      key: `p_ind_${i}`,
      label: p.label,
      type: p.type,
    })),
    associations: ['Contacts', 'Companies', 'Deals'],
    suggestedByIndustry: industry,
  }
}

// Collect the leak ids the prospect selected (checklist + vent-box keyword match).
export function collectLeakIds(wizard) {
  // Pain checklists store SOLUTION_MAP ids directly in wizard.pains.
  const fromChecklist = (Array.isArray(wizard.pains) ? wizard.pains : []).filter(
    (id) => SOLUTION_MAP[id]
  )
  const fromVent = matchTextToLeaks(wizard.ventBox)

  // Answers that ARE pain signals, even without flagging the habit. These only
  // fire as a fallback — if the Ops habit matrix has an explicit answer for the
  // pain, the prospect's own answer wins (don't contradict an "Always").
  const opsHabits = wizard.opsHabits || {}
  const inferred = []
  // Tracking leads in 2+ places = scattered systems.
  const tracking = Array.isArray(wizard.currentTracking) ? wizard.currentTracking : []
  if (tracking.length >= 2 && !opsHabits.tools_dont_talk) inferred.push('tools_dont_talk')
  // Manual/Excel reporting or hours of meeting prep = reporting pain.
  if (
    !opsHabits.reporting_excel_pain &&
    (['Someone builds them manually each time', 'Exports + Excel every time'].includes(
      wizard.reportsToday
    ) ||
      wizard.meetingPrep === 'Someone spends hours prepping numbers')
  ) {
    inferred.push('reporting_excel_pain')
  }

  return [...new Set([...fromChecklist, ...fromVent, ...inferred])]
}

// Global Crescent Connect build items driven by tools/data answers (not leak-specific).
export function buildGlobalScope(wizard) {
  const items = []
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])

  const stages = parseDealStages(wizard.dealStages)
  if (stages) {
    items.push(`Custom pipeline built from your stages: ${stages.map((s) => s.label).join(' → ')}`)
  } else {
    items.push('Custom pipeline architecture designed around your sales process')
  }

  if (wizard.salesCycle) {
    const { staleDays } = cycleTuning(wizard.salesCycle)
    items.push(
      `Follow-up timing tuned to your ${wizard.salesCycle.toLowerCase()} sales cycle — stale-deal alerts at ${staleDays} days, not a generic default`
    )
  }

  const indObj = industryObjectDef(wizard.industry)
  if (indObj) {
    items.push(
      `Custom "${indObj.plural}" object so you can track ${indObj.plural.toLowerCase()} the way HubSpot tracks contacts`
    )
  }

  if (wizard.emailPlatform?.includes('Gmail'))
    items.push('Google Workspace connection — email and calendar sync for every rep')
  else if (wizard.emailPlatform?.includes('Outlook'))
    items.push('Microsoft 365 connection — Outlook email and calendar sync for every rep')

  if (
    wizard.accounting &&
    !['None', 'Something else', 'Spreadsheets / manual'].includes(wizard.accounting)
  ) {
    items.push(`${wizard.accounting} integration synced to deals and invoices`)
  }

  if (
    wizard.sharedInbox === 'Shared inboxes everyone works from' ||
    wizard.sharedInbox === 'One person forwards things around'
  ) {
    items.push('Shared team inbox (sales@/service@) set up in HubSpot Conversations — no more forwarding')
  }

  const tools = arr(wizard.connectTools)
  if (tools.includes('Website forms')) items.push('Website form capture wired into lead routing')
  if (tools.some((t) => t.startsWith('Chat'))) items.push('Slack/Teams deal and ticket notifications')
  if (tools.includes('Zapier / Make')) items.push('Zapier/Make automation bridges to your other tools')
  if (tools.includes('Facebook / Instagram ads')) items.push('Ad platform lead sync with source tracking')
  if (tools.some((t) => t.startsWith('Proposals'))) items.push('Proposal & e-sign integration (PandaDoc/DocuSign) tied to deals')
  if (tools.some((t) => t.startsWith('Lead databases'))) items.push('Lead database integration (ZoomInfo/Apollo) feeding clean prospects')
  if (tools.some((t) => t.startsWith('AI meeting notes'))) items.push('AI meeting notes synced to contact and deal records')
  if (tools.some((t) => t.startsWith('Project management'))) items.push('Project tool sync (ClickUp/Asana) from closed-won deals')
  if (tools.some((t) => t.startsWith('Phone'))) items.push('Calling/SMS integration with auto-logging')
  if (tools.some((t) => t.startsWith('Marketing'))) items.push('Marketing tool migration/sync into HubSpot')

  if (wizard.dataImport?.startsWith('Yes — clean'))
    items.push('Import of your existing contact and client list, mapped to the new structure')
  if (wizard.dataImport?.startsWith('Yes — but messy') || wizard.dataImport?.startsWith('Sort of'))
    items.push('Data rescue: spreadsheets, business cards, and phone contacts merged, deduped, and imported')

  if (arr(wizard.recurringRevenue).some((r) => r !== 'No recurring revenue' && r))
    items.push('Renewal and contract tracking modeled on your recurring revenue terms')

  items.push('Team training and a 30-day adoption check-in so this actually gets used')
  return items
}

// Build the full fix plan from wizard answers.
export function buildFixPlan(wizard) {
  const leakIds = collectLeakIds(wizard)
  const topLeakId = SOLUTION_MAP[wizard.topLeak] ? wizard.topLeak : null

  const problems = leakIds
    .map((id) => {
      const sol = SOLUTION_MAP[id]
      if (!sol) return null
      return {
        id,
        title: sol.title,
        saidLabel: painLabel(id),
        narrative: sol.narrative,
        implication: sol.implication || '',
        hub: sol.hub || 'Sales Hub',
        workflows: sol.workflows,
        viewIds: sol.viewIds,
        widgets: sol.widgets,
        ccBuild: sol.ccBuild,
        isTop: id === topLeakId,
      }
    })
    .filter(Boolean)
    // Costliest problem first, then checklist order.
    .sort((a, b) => (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0))

  return {
    generatedAt: new Date().toISOString(),
    problems,
    globalBuild: buildGlobalScope(wizard),
    mondayScreen: wizard.mondayScreen || '',
    topLeakCost: wizard.topLeakCost || '',
    topGoal: wizard.topGoal || '',
  }
}

// Compute the config patch the plan implies. Applied via store.applyFixPlan.
export function buildConfigPatch(session, plan) {
  const wizard = session.wizard || {}
  const tuning = cycleTuning(wizard.salesCycle)

  // Workflows: union of all problem workflows, skipping ones already added.
  // Every installed workflow gets its delays/thresholds tuned to their cycle.
  const have = new Set(session.workflows.map((w) => w.templateId))
  const wanted = [...new Set(plan.problems.flatMap((p) => p.workflows))]
  const newWorkflows = wanted
    .filter((tid) => !have.has(tid))
    .map((tid) => WORKFLOW_TEMPLATES.find((t) => t.id === tid))
    .filter(Boolean)
    .map((t) =>
      tuneWorkflowTiming(
        { ...instantiateTemplate(t), id: `wf_${t.id}_${Date.now()}` },
        tuning
      )
    )

  // Widgets: union into the dashboard.
  const widgetSet = new Set(session.dashboards.widgets || [])
  plan.problems.flatMap((p) => p.widgets).forEach((w) => widgetSet.add(w))

  // Cadence rules: merge all rule enables, with the stale threshold cycle-tuned.
  const rulePatch = { flagNoActivityDays: tuning.staleDays }
  plan.problems.forEach((p) => {
    Object.assign(rulePatch, SOLUTION_MAP[p.id]?.cadenceRules || {})
  })

  // Pipeline stages from their own words.
  const stages = parseDealStages(wizard.dealStages)

  // Industry custom object (skipped if one with the same name already exists).
  const indObj = industryObjectFor(wizard.industry)
  const newCustomObjects =
    indObj &&
    session.customObjects.length < 5 &&
    !session.customObjects.some((o) => (o.plural || o.singular) === indObj.plural)
      ? [indObj]
      : []

  return { newWorkflows, widgets: [...widgetSet], rulePatch, stages, newCustomObjects }
}
