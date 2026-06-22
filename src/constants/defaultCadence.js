// Accountability cadence defaults (spec Step 10).

export function defaultCadence() {
  return {
    operatingSystem: OS_CUSTOM,
    meetings: [
      {
        key: 'daily_standup',
        label: 'Daily Standup',
        enabled: false,
        day: 'Every weekday',
        time: '8:30 AM',
        agenda: "Yesterday's wins, today's plan, blockers",
      },
      {
        key: 'weekly_pipeline',
        label: 'Weekly Pipeline Review',
        enabled: true,
        day: 'Monday',
        time: '9:00 AM',
        agenda: 'Deal-by-deal review, next steps, stuck deals',
      },
      {
        key: 'monthly_forecast',
        label: 'Monthly Forecast Review',
        enabled: false,
        day: 'First Monday',
        time: '10:00 AM',
        agenda: 'Commit vs. goal, risk review',
      },
      {
        key: 'qbr',
        label: 'QBR (Quarterly Business Review)',
        enabled: false,
        day: 'Quarterly',
        time: '1:00 PM',
        agenda: 'Account health, renewals, expansion',
      },
      // Meetings that only become fast/possible once the data lives in HubSpot.
      {
        key: 'rep_one_on_one',
        label: 'Sales Director 1:1s (per rep)',
        enabled: false,
        day: 'Friday',
        time: '2:00 PM',
        agenda: "Rep's dashboard up on screen: activity, stale deals, next steps — coaching from data, not recall",
      },
      {
        key: 'owner_revenue_review',
        label: "Owner's Revenue Review",
        enabled: false,
        day: 'Monday',
        time: '7:30 AM',
        agenda: 'One dashboard: closed revenue, weighted pipeline, AR aging, tickets — 15 minutes, no reports requested',
      },
      {
        key: 'smarketing',
        label: 'Marketing-Sales Alignment',
        enabled: false,
        day: 'First Monday',
        time: '11:00 AM',
        agenda: 'Lead quality by source, MQL→SQL conversion, campaign ROI — both teams looking at the same numbers',
      },
      {
        key: 'ops_handoff_review',
        label: 'Ops Handoff Review',
        enabled: false,
        day: 'Thursday',
        time: '3:00 PM',
        agenda: 'Closed-won handoffs this week, onboarding task completion, fulfillment blockers',
      },
      {
        key: 'service_escalation',
        label: 'Service & Escalation Huddle',
        enabled: false,
        day: 'Every weekday',
        time: '8:15 AM',
        agenda: 'Open tickets by priority, SLA risks, low NPS alerts — 10 minutes off the help desk board',
      },
    ],
    rules: {
      flagNoActivityDays: 14,
      flagNoActivityEnabled: true,
      requireNextStep: true,
      autoRemindOverdueDays: 2,
      autoRemindEnabled: true,
      requireCloseDatePastStage: 'Qualified',
      requireCloseDateEnabled: true,
      minCallsPerWeek: 20,
      minCallsEnabled: false,
    },
    notifications: {
      channels: ['In-app', 'Email digest'],
      frequency: 'Daily',
    },
  }
}

// ---- Business operating systems ----
// A prospect on a named operating system (EOS, etc.) gets its standard meeting
// rhythm pre-loaded, mapped onto the HubSpot objects that actually run it. EOS
// is the one most LA small businesses run; room to add Scaling Up / 4DX later.
export const OS_CUSTOM = 'Custom / none'
export const OS_EOS = 'EOS (Entrepreneurial Operating System)'
export const OPERATING_SYSTEMS = [OS_CUSTOM, OS_EOS]

// EOS meetings (tagged eos:true so they can be added/removed cleanly when the
// operating system is switched). The Weekly Level 10 follows its fixed agenda.
export const EOS_MEETINGS = [
  {
    key: 'eos_l10',
    label: 'Weekly Level 10 Meeting',
    enabled: true,
    eos: true,
    day: 'Monday',
    time: '9:00 AM',
    agenda:
      'Segue · Scorecard · Rock review · Headlines · To-Do list · IDS (Identify, Discuss, Solve) · Conclude — same 90 minutes, every week',
  },
  {
    key: 'eos_quarterly',
    label: 'Quarterly Pulsing (Rock-setting)',
    enabled: true,
    eos: true,
    day: 'Quarterly',
    time: '9:00 AM',
    agenda: 'Review last quarter’s Rocks, set 3–7 company and individual Rocks for the next 90 days',
  },
  {
    key: 'eos_annual',
    label: 'Annual Planning (2-day)',
    enabled: false,
    eos: true,
    day: 'Quarterly',
    time: '9:00 AM',
    agenda: 'V/TO review, one-year plan, next-quarter Rocks, and team health',
  },
]

// How each EOS component lives inside HubSpot (shown in the preview so it’s clear
// EOS runs IN the CRM, not in a separate spreadsheet).
export const EOS_HUBSPOT_MAPPING = [
  { eos: 'Scorecard', hs: 'A weekly KPI dashboard, 5–15 measurables, one owner per row' },
  { eos: 'Rocks', hs: 'Quarterly priorities tracked as HubSpot Goals and a Rocks task list' },
  { eos: 'To-Do List', hs: 'HubSpot tasks due within 7 days, each owned and dated' },
  { eos: 'Issues (IDS)', hs: 'An Issues list worked top-down in the Level 10 each week' },
  { eos: 'Accountability Chart', hs: 'Every seat is a real owner on records, dashboards, and tasks' },
]

export const NOTIFICATION_CHANNELS = [
  'In-app',
  'Email digest',
  'Mobile push (HubSpot app)',
  'SMS / text',
  'Slack',
  'Microsoft Teams',
]
export const NOTIFICATION_FREQUENCIES = ['Real-time', 'Daily', 'Weekly']
export const DAYS = [
  'Every weekday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'First Monday',
  'Quarterly',
]
