// Accountability cadence defaults (spec Step 10).

export function defaultCadence() {
  return {
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

export const NOTIFICATION_CHANNELS = ['In-app', 'Email digest', 'Slack']
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
