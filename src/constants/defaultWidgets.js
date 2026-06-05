// Dashboard widget catalog (spec Step 9), grouped by category.
// `tier` marks widgets that push the required HubSpot tier (forecast/custom reporting).
export const WIDGET_CATEGORIES = [
  {
    category: 'Sales Performance',
    widgets: [
      { id: 'deals_closed_month', label: 'Deals Closed This Month' },
      { id: 'revenue_by_rep', label: 'Revenue by Rep' },
      { id: 'pipeline_value_stage', label: 'Pipeline Value by Stage' },
      { id: 'deal_velocity', label: 'Deal Velocity' },
      { id: 'won_vs_lost', label: 'Won vs. Lost' },
    ],
  },
  {
    category: 'Activity Tracking',
    widgets: [
      { id: 'calls_logged', label: 'Calls Logged' },
      { id: 'emails_sent', label: 'Emails Sent' },
      { id: 'meetings_booked', label: 'Meetings Booked' },
      { id: 'tasks_completed_overdue', label: 'Tasks Completed vs. Overdue' },
    ],
  },
  {
    category: 'Forecast',
    tier: 'pro',
    widgets: [
      { id: 'weighted_pipeline', label: 'Weighted Pipeline', tier: 'pro' },
      { id: 'forecast_vs_goal', label: 'Forecasted Revenue vs. Goal', tier: 'pro' },
      { id: 'deals_closing_month', label: 'Deals Closing This Month', tier: 'pro' },
    ],
  },
  {
    category: 'Customer Health',
    widgets: [
      { id: 'open_tickets_status', label: 'Open Tickets by Status' },
      { id: 'avg_ticket_resolution', label: 'Avg Ticket Resolution Time' },
      { id: 'contacts_by_lifecycle', label: 'Contacts by Lifecycle Stage' },
    ],
  },
]

// Automation Health widgets — auto-populated only if workflows were configured (Step 7).
export const AUTOMATION_HEALTH_WIDGETS = [
  { id: 'active_workflows', label: 'Active Workflows Count' },
  { id: 'workflow_enrollment', label: 'Workflow Enrollment This Month' },
  { id: 'emails_via_automation', label: 'Emails Sent via Automation' },
  { id: 'tasks_by_automation', label: 'Tasks Created by Automation' },
]

// Sensible starter set enabled by default.
export function defaultWidgets() {
  return [
    'deals_closed_month',
    'pipeline_value_stage',
    'won_vs_lost',
    'calls_logged',
    'meetings_booked',
  ]
}

// Flat lookup of every widget label (for previews/outputs).
export const WIDGET_LABELS = Object.fromEntries(
  [...WIDGET_CATEGORIES.flatMap((c) => c.widgets), ...AUTOMATION_HEALTH_WIDGETS].map((w) => [
    w.id,
    w.label,
  ])
)
