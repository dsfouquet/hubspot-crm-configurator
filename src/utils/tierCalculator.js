// Tier calculator (spec 4.2 / 4.3). Walks the full config state, maps each enabled
// feature to its required HubSpot tier, and returns the highest tier required plus
// a feature -> tier breakdown. Reads labels/colors/pricing from hubspotTiers.json.

import tiers from '../data/hubspotTiers.json'
import { activeViews } from './recommendations'
import { actionCount } from '../constants/workflowTemplates'

const ORDER = ['free', 'starter', 'pro', 'enterprise']
const rank = (t) => ORDER.indexOf(t)
const label = (feature) => tiers.featureLabels[feature] || feature

// Build the list of triggered features from the session config.
function collectTriggers(session) {
  const triggers = [] // { feature, tier, detail }
  const add = (feature, tier, detail) => triggers.push({ feature, tier, detail })

  // Base records — always Free.
  add('contacts', 'free')
  add('companies', 'free')
  add('deals', 'free')
  if (session.tickets?.properties?.length) add('tickets', 'free')

  // Basic dashboard widgets — Free (non-forecast widgets present).
  const widgets = session.dashboards?.widgets || []
  const forecastWidgetIds = ['weighted_pipeline', 'forecast_vs_goal', 'deals_closing_month']
  const hasBasicWidgets = widgets.some((w) => !forecastWidgetIds.includes(w))
  if (hasBasicWidgets) add('basic_dashboards', 'free')

  // Custom objects — Pro.
  if ((session.customObjects?.length || 0) > 0) {
    add('custom_objects', 'pro', `${session.customObjects.length} object${session.customObjects.length === 1 ? '' : 's'}`)
  }

  // Automation workflows — Starter (simple) or Pro (advanced/branching).
  const workflows = session.workflows || []
  const proWorkflows = workflows.filter(
    (w) => w.tier === 'pro' || w.nodes?.some((n) => n.type === 'condition')
  )
  const starterWorkflows = workflows.filter((w) => !proWorkflows.includes(w))
  if (starterWorkflows.length) {
    add('simple_automation', 'starter', `${starterWorkflows.length} workflow${starterWorkflows.length === 1 ? '' : 's'}`)
  }
  if (proWorkflows.length) {
    add('workflows_advanced', 'pro', `${proWorkflows.length} workflow${proWorkflows.length === 1 ? '' : 's'}`)
  }
  // A workflow that enrolls in a sequence (or sends multiple emails) → Sequences (Pro).
  const usesSequences = workflows.some(
    (w) =>
      w.nodes?.some((n) => /sequence/i.test(n.label || '')) ||
      (w.nodes?.filter((n) => /email/i.test(n.label || '')).length || 0) >= 2
  )
  if (usesSequences) add('sequences', 'pro')

  // Views — sequence enrollment queue implies Sequences (Pro).
  const views = activeViews(session)
  if (views.some((v) => v.id === 'sequence_enrollment')) add('sequences', 'pro')

  // Forecast dashboard widgets → Revenue Forecasting (Pro).
  if (widgets.some((w) => forecastWidgetIds.includes(w))) add('forecasting', 'pro')

  // Monthly forecast cadence → Revenue Forecasting (Pro).
  const forecastMeeting = session.cadence?.meetings?.find((m) => m.key === 'monthly_forecast')
  if (forecastMeeting?.enabled) add('forecasting', 'pro')

  // Custom report widgets → Custom Report Builder (Pro).
  if ((session.dashboards?.customWidgets?.length || 0) > 0) add('custom_reporting', 'pro')

  // Dedupe by feature, keeping the highest tier + first detail seen.
  const byFeature = {}
  for (const t of triggers) {
    const existing = byFeature[t.feature]
    if (!existing || rank(t.tier) > rank(existing.tier)) {
      byFeature[t.feature] = { ...t, detail: t.detail ?? existing?.detail }
    } else if (t.detail && !existing.detail) {
      existing.detail = t.detail
    }
  }
  return Object.values(byFeature).map((t) => ({ ...t, label: label(t.feature) }))
}

export function calculateRequiredTier(session) {
  const triggers = collectTriggers(session)
  const requiredTier = triggers.reduce(
    (max, t) => (rank(t.tier) > rank(max) ? t.tier : max),
    'free'
  )

  // Features that push the bill up (at the required tier) vs. those included below.
  const drivers = triggers.filter((t) => t.tier === requiredTier && requiredTier !== 'free')
  const included = triggers.filter((t) => rank(t.tier) < rank(requiredTier))

  const tierInfo = tiers.tiers[requiredTier]
  return {
    requiredTier,
    requiredLabel: tierInfo.label,
    requiredColor: tierInfo.color,
    monthlyPerSeat: tierInfo.monthlyPerSeat ?? 0,
    triggers, // full list
    drivers, // features at the required tier
    included, // features available at lower tiers
    order: ORDER,
  }
}
