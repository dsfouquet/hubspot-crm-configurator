// Solution engine: turns discovery answers into (1) a Fix Plan — problem cards
// with narratives and Crescent Connect build scope — and (2) a config patch
// applied to the session (workflows, widgets, cadence rules, pipeline stages).

import { SOLUTION_MAP, matchTextToLeaks } from '../constants/solutionMap'
import { leakIdFromLabel } from '../constants/discoveryQuestions'
import { WORKFLOW_TEMPLATES, instantiateTemplate } from '../constants/workflowTemplates'

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

// Collect the leak ids the prospect selected (checklist + vent-box keyword match).
export function collectLeakIds(wizard) {
  const fromChecklist = (Array.isArray(wizard.leaks) ? wizard.leaks : [])
    .map(leakIdFromLabel)
    .filter(Boolean)
  const fromVent = matchTextToLeaks(wizard.ventBox)
  return [...new Set([...fromChecklist, ...fromVent])]
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

  if (wizard.emailPlatform?.includes('Gmail'))
    items.push('Google Workspace connection — email and calendar sync for every rep')
  else if (wizard.emailPlatform?.includes('Outlook'))
    items.push('Microsoft 365 connection — Outlook email and calendar sync for every rep')

  if (wizard.accounting === 'QuickBooks') items.push('QuickBooks integration synced to deals and invoices')
  else if (wizard.accounting === 'Xero' || wizard.accounting === 'FreshBooks')
    items.push(`${wizard.accounting} integration synced to deals and invoices`)

  const tools = arr(wizard.connectTools)
  if (tools.includes('Website forms')) items.push('Website form capture wired into lead routing')
  if (tools.includes('Slack / Teams')) items.push('Slack/Teams deal and ticket notifications')
  if (tools.includes('Zapier / Make')) items.push('Zapier/Make automation bridges to your other tools')
  if (tools.includes('Facebook / Instagram ads')) items.push('Ad platform lead sync with source tracking')

  if (wizard.dataImport?.startsWith('Yes — clean'))
    items.push('Import of your existing contact and client list, mapped to the new structure')
  if (wizard.dataImport?.startsWith('Yes — but messy'))
    items.push('Data cleanup, dedupe, and import of your existing list — messy is normal, we handle it')

  if (arr(wizard.recurringRevenue).some((r) => r !== 'No recurring revenue' && r))
    items.push('Renewal and contract tracking modeled on your recurring revenue terms')

  items.push('Team training and a 30-day adoption check-in so this actually gets used')
  return items
}

// Build the full fix plan from wizard answers.
export function buildFixPlan(wizard) {
  const leakIds = collectLeakIds(wizard)
  const topLeakId = leakIdFromLabel(wizard.topLeak) || null

  const problems = leakIds
    .map((id) => {
      const sol = SOLUTION_MAP[id]
      if (!sol) return null
      return {
        id,
        title: sol.title,
        saidLabel:
          (Array.isArray(wizard.leaks) &&
            wizard.leaks.find((l) => leakIdFromLabel(l) === id)) ||
          sol.title,
        narrative: sol.narrative,
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
  }
}

// Compute the config patch the plan implies. Applied via store.applyFixPlan.
export function buildConfigPatch(session, plan) {
  const wizard = session.wizard || {}

  // Workflows: union of all problem workflows, skipping ones already added.
  const have = new Set(session.workflows.map((w) => w.templateId))
  const wanted = [...new Set(plan.problems.flatMap((p) => p.workflows))]
  const newWorkflows = wanted
    .filter((tid) => !have.has(tid))
    .map((tid) => WORKFLOW_TEMPLATES.find((t) => t.id === tid))
    .filter(Boolean)
    .map((t) => ({ ...instantiateTemplate(t), id: `wf_${t.id}_${Date.now()}` }))

  // Widgets: union into the dashboard.
  const widgetSet = new Set(session.dashboards.widgets || [])
  plan.problems.flatMap((p) => p.widgets).forEach((w) => widgetSet.add(w))

  // Cadence rules: merge all rule enables from the solution map.
  const rulePatch = {}
  plan.problems.forEach((p) => {
    Object.assign(rulePatch, SOLUTION_MAP[p.id]?.cadenceRules || {})
  })

  // Pipeline stages from their own words.
  const stages = parseDealStages(wizard.dealStages)

  return { newWorkflows, widgets: [...widgetSet], rulePatch, stages }
}
