// Customer-mode auto-build: takes the 8-question intake and produces the same
// rich session a full 13-step presenter walkthrough would — by seeding the
// unanswered wizard fields from the prospect's market avatar, then running the
// existing solution engine, then topping up with the avatar's default workflows.

import { AVATARS } from '../constants/avatars'
import { WORKFLOW_TEMPLATES, instantiateTemplate } from '../constants/workflowTemplates'
import { buildFixPlan, buildConfigPatch } from './solutionEngine'

const MIN_WORKFLOWS = 3
const MAX_WORKFLOWS = 5

export function autoBuildSession(session) {
  const avatar = AVATARS[session.wizard?.industry]
  const wizard = { ...session.wizard }

  // Seed presenter-flow inputs the prospect never saw, from their avatar.
  if (avatar) {
    if (!wizard.dealStages) wizard.dealStages = avatar.pipelineStages.join(' → ')
    if (!wizard.salesCycle) wizard.salesCycle = avatar.salesCycle
    if (!wizard.leadSources || wizard.leadSources.length === 0)
      wizard.leadSources = avatar.leadSources
  }

  const plan = buildFixPlan(wizard)
  const patch = buildConfigPatch({ ...session, wizard }, plan)

  // Top up workflows with the avatar's defaults so the automation preview is
  // never thin, even when the prospect only checked one or two pains.
  if (avatar) {
    const have = new Set([
      ...(session.workflows || []).map((w) => w.templateId),
      ...patch.newWorkflows.map((w) => w.templateId),
    ])
    for (const tid of avatar.workflows) {
      const total = (session.workflows || []).length + patch.newWorkflows.length
      if (total >= MAX_WORKFLOWS) break
      if (have.has(tid)) continue
      const t = WORKFLOW_TEMPLATES.find((x) => x.id === tid)
      if (!t) continue
      patch.newWorkflows.push({
        ...instantiateTemplate(t),
        id: `wf_${t.id}_${Date.now()}_${patch.newWorkflows.length}`,
      })
      have.add(tid)
    }
    // Still thin? Backfill from the general template library.
    if ((session.workflows || []).length + patch.newWorkflows.length < MIN_WORKFLOWS) {
      for (const t of WORKFLOW_TEMPLATES) {
        const total = (session.workflows || []).length + patch.newWorkflows.length
        if (total >= MIN_WORKFLOWS) break
        if (have.has(t.id)) continue
        patch.newWorkflows.push({
          ...instantiateTemplate(t),
          id: `wf_${t.id}_${Date.now()}_${patch.newWorkflows.length}`,
        })
        have.add(t.id)
      }
    }
  }

  return { wizard, plan, patch }
}
