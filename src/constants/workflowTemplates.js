// Pre-built automation workflow templates (spec Step 7.2).
// Node schema matches the plain-English generator output (spec 7.7):
//   { id, type: trigger|condition|action|delay|end, label, detail, next, nextElse }

// Compact node helper.
const N = (id, type, label, detail = '', next = null, nextElse = null) => ({
  id,
  type,
  label,
  detail,
  next,
  nextElse,
})

export const WORKFLOW_CATEGORIES = ['Sales Automation', 'Lead Nurture', 'Customer Success']

export const WORKFLOW_TEMPLATES = [
  // ---------------- SALES AUTOMATION ----------------
  {
    id: 'quote_follow_up',
    category: 'Sales Automation',
    name: 'Quote Follow-Up Sequence',
    description: 'Chase proposals automatically until the prospect replies.',
    triggerSummary: 'Deal stage → "Proposal Sent"',
    tier: 'pro',
    trigger: { type: 'deal_stage', label: 'Deal Stage = Proposal Sent' },
    nodes: [
      N('t', 'trigger', 'Deal Stage = Proposal Sent', 'When a deal moves to Proposal Sent', 'd1'),
      N('d1', 'delay', 'Wait 2 days', '', 'a1'),
      N('a1', 'action', 'Send Email: Quote Follow-Up #1', 'Friendly check-in', 'c1'),
      N('c1', 'condition', 'If no reply', 'Branch on prospect response', 'd2', 'end_replied'),
      N('d2', 'delay', 'Wait 3 days', '', 'a2'),
      N('a2', 'action', 'Send Email: Quote Follow-Up #2', 'Second nudge', 'a3'),
      N('a3', 'action', 'Create task for rep', 'Personal follow-up needed', 'end_done'),
      N('end_replied', 'end', 'Workflow Complete', 'Prospect replied'),
      N('end_done', 'end', 'Workflow Complete', 'Rep takes over'),
    ],
  },
  {
    id: 'new_lead_assignment',
    category: 'Sales Automation',
    name: 'New Lead Assignment',
    description: 'Route inbound leads to the right rep instantly.',
    triggerSummary: 'Contact form submitted',
    tier: 'starter',
    trigger: { type: 'form_submission', label: 'Contact form submitted' },
    nodes: [
      N('t', 'trigger', 'Contact form submitted', 'New form submission', 'a1'),
      N('a1', 'action', 'Assign owner', 'By territory / round robin', 'a2'),
      N('a2', 'action', 'Send welcome email', '', 'a3'),
      N('a3', 'action', 'Create follow-up task', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
  {
    id: 'deal_stale_alert',
    category: 'Sales Automation',
    name: 'Deal Stale Alert',
    description: 'Catch deals going cold before they die.',
    triggerSummary: 'No activity on deal for 14 days',
    tier: 'starter',
    trigger: { type: 'deal_inactivity', label: 'No deal activity for 14 days' },
    nodes: [
      N('t', 'trigger', 'No deal activity for 14 days', 'Deal has gone quiet', 'a1'),
      N('a1', 'action', 'Notify deal owner', '', 'a2'),
      N('a2', 'action', 'Create task: "Re-engage this deal"', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
  {
    id: 'closed_won_handoff',
    category: 'Sales Automation',
    name: 'Closed Won Handoff',
    description: 'Kick off onboarding the moment a deal closes.',
    triggerSummary: 'Deal stage → "Closed Won"',
    tier: 'starter',
    trigger: { type: 'deal_stage', label: 'Deal Stage = Closed Won' },
    nodes: [
      N('t', 'trigger', 'Deal Stage = Closed Won', '', 'a1'),
      N('a1', 'action', 'Notify CS team', '', 'a2'),
      N('a2', 'action', 'Create onboarding tasks', '', 'a3'),
      N('a3', 'action', 'Update lifecycle stage', 'Set to Customer', 'a4'),
      N('a4', 'action', 'Send intro email', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
  {
    id: 'closed_lost_reengage',
    category: 'Sales Automation',
    name: 'Closed Lost Re-engage',
    description: 'Circle back on lost deals when timing may have changed.',
    triggerSummary: 'Deal stage → "Closed Lost"',
    tier: 'pro',
    trigger: { type: 'deal_stage', label: 'Deal Stage = Closed Lost' },
    nodes: [
      N('t', 'trigger', 'Deal Stage = Closed Lost', '', 'd1'),
      N('d1', 'delay', 'Wait 90 days', '', 'a1'),
      N('a1', 'action', 'Enroll in re-engagement sequence', '', 'a2'),
      N('a2', 'action', 'Notify rep', '', 'end'),
      N('end', 'end', 'Enrolled in Sequence: Re-engagement', ''),
    ],
  },
  {
    id: 'pipeline_stage_mover',
    category: 'Sales Automation',
    name: 'Pipeline Stage Mover',
    description: 'Advance deals automatically when a meeting is booked.',
    triggerSummary: 'Meeting booked via HubSpot',
    tier: 'starter',
    trigger: { type: 'meeting_booked', label: 'Meeting booked via HubSpot' },
    nodes: [
      N('t', 'trigger', 'Meeting booked', 'Via HubSpot scheduler', 'a1'),
      N('a1', 'action', 'Move deal to "Qualified"', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },

  // ---------------- LEAD NURTURE ----------------
  {
    id: 'new_contact_welcome',
    category: 'Lead Nurture',
    name: 'New Contact Welcome',
    description: 'Warm up brand-new contacts with a value-first sequence.',
    triggerSummary: 'Contact created',
    tier: 'starter',
    trigger: { type: 'contact_created', label: 'Contact created' },
    nodes: [
      N('t', 'trigger', 'Contact created', '', 'a1'),
      N('a1', 'action', 'Send welcome email', '', 'd1'),
      N('d1', 'delay', 'Wait 3 days', '', 'a2'),
      N('a2', 'action', 'Send value email', '', 'a3'),
      N('a3', 'action', 'Enroll in sequence', '', 'end'),
      N('end', 'end', 'Enrolled in Sequence: Nurture', ''),
    ],
  },
  {
    id: 'lead_scoring_threshold',
    category: 'Lead Nurture',
    name: 'Lead Scoring Threshold',
    description: 'Hand hot leads to sales the second they heat up.',
    triggerSummary: 'HubSpot score reaches 50',
    tier: 'pro',
    trigger: { type: 'lead_score', label: 'HubSpot score reaches 50' },
    nodes: [
      N('t', 'trigger', 'HubSpot score ≥ 50', '', 'a1'),
      N('a1', 'action', 'Notify sales rep', '', 'a2'),
      N('a2', 'action', 'Change lifecycle to MQL', '', 'a3'),
      N('a3', 'action', 'Create outreach task', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
  {
    id: 'reengagement_campaign',
    category: 'Lead Nurture',
    name: 'Re-engagement Campaign',
    description: 'Win back contacts who have gone quiet.',
    triggerSummary: 'No email open in 60 days',
    tier: 'pro',
    trigger: { type: 'email_inactivity', label: 'No email open in 60 days' },
    nodes: [
      N('t', 'trigger', 'No email open in 60 days', '', 'a1'),
      N('a1', 'action', 'Send re-engagement email', '', 'c1'),
      N('c1', 'condition', 'If no click in 7 days', '', 'a2', 'end_clicked'),
      N('a2', 'action', 'Mark as unengaged', '', 'end_done'),
      N('end_clicked', 'end', 'Workflow Complete', 'Contact re-engaged'),
      N('end_done', 'end', 'Workflow Complete', 'Marked unengaged'),
    ],
  },

  // ---------------- CUSTOMER SUCCESS ----------------
  {
    id: 'qbr_reminder',
    category: 'Customer Success',
    name: 'QBR Reminder',
    description: 'Never miss a quarterly business review.',
    triggerSummary: 'Close date 90 days out',
    tier: 'starter',
    trigger: { type: 'date_property', label: 'Close date 90 days out' },
    nodes: [
      N('t', 'trigger', 'Close date 90 days out', '', 'a1'),
      N('a1', 'action', 'Create QBR task', '', 'a2'),
      N('a2', 'action', 'Send prep email to contact', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
  {
    id: 'renewal_alert',
    category: 'Customer Success',
    name: 'Renewal Alert',
    description: 'Open the renewal conversation with plenty of runway.',
    triggerSummary: 'Custom "Renewal Date" 60 days out',
    tier: 'pro',
    trigger: { type: 'date_property', label: 'Renewal Date 60 days out' },
    nodes: [
      N('t', 'trigger', 'Renewal Date 60 days out', 'Custom property', 'a1'),
      N('a1', 'action', 'Notify account owner', '', 'a2'),
      N('a2', 'action', 'Create renewal deal', '', 'a3'),
      N('a3', 'action', 'Send renewal email', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
  {
    id: 'ticket_escalation',
    category: 'Customer Success',
    name: 'Ticket Escalation',
    description: 'Escalate stuck support tickets before they fester.',
    triggerSummary: 'Ticket open > 48 hours with no update',
    tier: 'starter',
    trigger: { type: 'ticket_inactivity', label: 'Ticket open > 48h, no update' },
    nodes: [
      N('t', 'trigger', 'Ticket open > 48h, no update', '', 'a1'),
      N('a1', 'action', 'Reassign to manager', '', 'a2'),
      N('a2', 'action', 'Send apology email', '', 'a3'),
      N('a3', 'action', 'Create urgent task', '', 'end'),
      N('end', 'end', 'Workflow Complete', ''),
    ],
  },
]

// Count "action" steps in a workflow (used on cards).
export function actionCount(workflow) {
  return workflow.nodes.filter((n) => n.type === 'action').length
}

// Turn a template into a session workflow instance.
export function instantiateTemplate(template) {
  return {
    templateId: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    triggerSummary: template.triggerSummary,
    trigger: template.trigger,
    tier: template.tier,
    nodes: template.nodes.map((n) => ({ ...n })),
  }
}
