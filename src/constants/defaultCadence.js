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
