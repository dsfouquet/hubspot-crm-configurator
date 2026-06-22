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

// Per-widget explainer for the click-through detail view: a plain-English blurb
// plus the HubSpot data/objects that actually generate the report. This is what
// turns "Deals Closed This Month" from a pretty chart into "here's exactly where
// this number comes from in your CRM."
export const WIDGET_META = {
  deals_closed_month: {
    blurb: 'How many deals you closed each month, so you can see momentum at a glance.',
    sources: ['Deal records where Deal Stage = Closed Won', 'Grouped by Close Date (month)'],
  },
  revenue_by_rep: {
    blurb: 'Closed revenue credited to each rep, the leaderboard without the spreadsheet.',
    sources: ['Sum of Deal Amount on Closed Won deals', 'Grouped by Deal Owner'],
  },
  pipeline_value_stage: {
    blurb: 'How much open deal value is sitting in each stage of your pipeline right now.',
    sources: ['Sum of Deal Amount on open deals', 'Grouped by Deal Stage'],
  },
  deal_velocity: {
    blurb: 'Average time a deal takes from first touch to close.',
    sources: ['Deal create date → Close Date on Closed Won deals', 'Averaged across the period'],
  },
  won_vs_lost: {
    blurb: 'Your win rate across every decided deal.',
    sources: ['Count of Closed Won vs Closed Lost deals', 'Win rate = Won ÷ (Won + Lost)'],
  },
  calls_logged: {
    blurb: 'Calls your team logged over time, the raw activity behind the revenue.',
    sources: ['Call engagements logged on contacts and deals', 'Counted by logged date'],
  },
  emails_sent: {
    blurb: 'Emails your reps sent each month.',
    sources: ['Email engagements logged to the Sent activity', 'Counted per rep / month'],
  },
  meetings_booked: {
    blurb: 'Meetings booked over time, including self-scheduled ones.',
    sources: ['Meeting engagements and scheduler bookings', 'Counted by meeting date'],
  },
  tasks_completed_overdue: {
    blurb: 'How many tasks got finished on time versus slipped past due.',
    sources: ['Task records by Status', 'Compared against each task’s Due Date'],
  },
  weighted_pipeline: {
    blurb: 'Pipeline value discounted by each stage’s probability, a realistic forecast number.',
    sources: ['Sum of (Deal Amount × Stage probability) across open deals'],
  },
  forecast_vs_goal: {
    blurb: 'Where your forecast lands against the number you committed to.',
    sources: ['Weighted pipeline + Closed Won revenue', 'Compared to a Goal target you set'],
  },
  deals_closing_month: {
    blurb: 'The specific deals expected to close this month.',
    sources: ['Open deals where Close Date falls in the current month'],
  },
  open_tickets_status: {
    blurb: 'Every open service ticket, split by where it stands.',
    sources: ['Ticket records on the support pipeline', 'Grouped by Status'],
  },
  avg_ticket_resolution: {
    blurb: 'How long it takes, on average, to resolve a ticket.',
    sources: ['Ticket create date → close date', 'Averaged per month'],
  },
  contacts_by_lifecycle: {
    blurb: 'Your whole database split by where each contact is in the lifecycle.',
    sources: ['Contact records grouped by Lifecycle Stage'],
  },
  active_workflows: {
    blurb: 'How many automations are live and working in the background.',
    sources: ['Count of Workflows currently turned on'],
  },
  workflow_enrollment: {
    blurb: 'How many records your automations enrolled over time.',
    sources: ['Workflow enrollment events', 'Counted by month'],
  },
  emails_via_automation: {
    blurb: 'Emails sent automatically by your workflows, work your team didn’t have to do.',
    sources: ['Automated email sends triggered by Workflows'],
  },
  tasks_by_automation: {
    blurb: 'Tasks your automations created so nothing relies on someone remembering.',
    sources: ['Task records created by Workflow actions'],
  },
}

export function widgetMeta(id) {
  return (
    WIDGET_META[id] || {
      blurb: 'A custom report built for your business.',
      sources: ['Configured from the HubSpot objects and properties this metric needs'],
    }
  )
}
