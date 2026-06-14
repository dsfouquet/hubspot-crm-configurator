import { useStore } from '../store/useStore'
import {
  IconCheck,
  IconBell,
  IconEye,
  IconWarning,
  IconTarget,
  IconCheckCircle,
  IconBolt,
  IconDollar,
} from './uiIcons'

// Adoption → ROI argument: software only pays off when the team actually uses it.
const ADOPTION_STEPS = [
  {
    title: 'Use it daily',
    body: 'The team logs every call, email, and deal — no side spreadsheets.',
  },
  {
    title: 'The data gets trustworthy',
    body: 'Dashboards reflect reality, so reports stop being guesswork.',
  },
  {
    title: 'You hit the number',
    body: 'A forecast you can act on, sooner — and revenue follows.',
  },
]

const WHY_CARDS = [
  {
    icon: IconWarning,
    accent: 'text-hs-orange',
    bar: 'bg-hs-orange',
    head: 'CRMs fail from low adoption, not bad software.',
    sub: 'The tool is rarely the problem. Unused tools are.',
  },
  {
    icon: IconEye,
    accent: 'text-hs-blue',
    bar: 'bg-hs-blue',
    head: 'Teams that review pipeline weekly forecast far more accurately.',
    sub: 'A steady cadence turns a CRM into a decision tool.',
  },
  {
    icon: IconBolt,
    accent: 'text-hs-green',
    bar: 'bg-hs-green',
    head: 'Accountability rules let the CRM nudge the team.',
    sub: 'The system reminds people, so you do not have to.',
  },
]

// Mock accountability dashboard: cadence schedule, active rules, sample notification.
export default function PreviewCadence() {
  const cadence = useStore((s) => s.session.cadence)
  const meetings = cadence.meetings.filter((m) => m.enabled)
  const rules = cadence.rules

  const activeRules = []
  if (rules.flagNoActivityEnabled)
    activeRules.push(`Flag deals idle > ${rules.flagNoActivityDays} days`)
  if (rules.requireNextStep) activeRules.push('Next step required on open deals')
  if (rules.autoRemindEnabled)
    activeRules.push(`Remind on tasks overdue > ${rules.autoRemindOverdueDays} days`)
  if (rules.requireCloseDateEnabled)
    activeRules.push(`Close date required past ${rules.requireCloseDatePastStage}`)
  if (rules.minCallsEnabled) activeRules.push(`Min ${rules.minCallsPerWeek} calls/week`)

  return (
    <div className="p-5 space-y-4">
      {/* Why accountability matters: adoption → ROI */}
      <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
        <div className="bg-hs-navy px-4 py-2.5 flex items-center gap-2">
          <span className="text-hs-orange shrink-0">
            <IconDollar width={15} height={15} />
          </span>
          <h2 className="font-preview font-semibold text-white text-[15px]">
            Why this matters
          </h2>
        </div>
        <div className="p-4">
          <p className="text-[13px] font-preview text-hs-text-dark leading-snug">
            <strong className="text-hs-navy">Software doesn&rsquo;t create ROI — usage does.</strong>{' '}
            <span className="text-hs-text-light">
              The CRM only pays off when the team actually works it. Faster adoption is
              faster return.
            </span>
          </p>

          {/* Adoption → ROI mini timeline */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-0">
            {ADOPTION_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex sm:flex-1 items-start sm:items-stretch gap-3 sm:gap-0"
              >
                <div className="flex sm:flex-col sm:items-center sm:text-center shrink-0">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-hs-orange text-white text-[12px] font-preview font-semibold shrink-0">
                      {i + 1}
                    </span>
                    {i < ADOPTION_STEPS.length - 1 && (
                      <span className="hidden sm:block h-0.5 flex-1 bg-hs-orange/30 mx-1" />
                    )}
                  </div>
                </div>
                <div className="sm:px-2 sm:pt-2 sm:text-center">
                  <p className="text-[12px] font-preview font-semibold text-hs-navy leading-tight">
                    {step.title}
                  </p>
                  <p className="text-[11px] font-preview text-hs-text-light leading-snug mt-0.5">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Supporting stat / insight cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {WHY_CARDS.map((c) => (
              <div
                key={c.head}
                className="bg-white rounded-[3px] border border-hs-border p-2.5 flex gap-2"
              >
                <span className={`w-0.5 rounded-full ${c.bar} shrink-0`} />
                <div>
                  <span className={`${c.accent}`}>
                    <c.icon width={13} height={13} />
                  </span>
                  <p className="text-[12px] font-preview font-semibold text-hs-text-dark leading-snug mt-1">
                    {c.head}
                  </p>
                  <p className="text-[11px] font-preview text-hs-text-light leading-snug mt-0.5">
                    {c.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cadence schedule */}
      <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
        <div className="bg-hs-navy px-4 py-2.5">
          <h2 className="font-preview font-semibold text-white text-[15px]">Team Cadence</h2>
        </div>
        <div className="p-3">
          {meetings.length === 0 ? (
            <p className="text-[13px] font-preview text-hs-text-light">No meetings scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {meetings.map((m) => (
                <li key={m.key} className="flex items-start gap-3">
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-[11px] font-preview font-semibold text-hs-orange">
                      {m.day.length > 8 ? m.day.slice(0, 8) : m.day}
                    </div>
                    <div className="text-[10px] font-preview text-hs-text-light">{m.time}</div>
                  </div>
                  <div className="flex-1 border-l-2 border-hs-orange/40 pl-3">
                    <p className="text-[13px] font-preview font-medium text-hs-navy">{m.label}</p>
                    {m.agenda && (
                      <p className="text-[12px] font-preview text-hs-text-light">{m.agenda}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Active rules */}
      <div className="bg-white rounded-lg border border-hs-border p-3">
        <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
          Active Accountability Rules
        </p>
        {activeRules.length === 0 ? (
          <p className="text-[13px] font-preview text-hs-text-light">No rules enabled.</p>
        ) : (
          <ul className="space-y-1">
            {activeRules.map((r) => (
              <li key={r} className="text-[13px] font-preview text-hs-text-dark flex items-center gap-2">
                <IconCheck width={12} height={12} className="text-hs-green shrink-0" /> {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sample notification + channels */}
      <div className="bg-white rounded-lg border border-hs-border p-3">
        <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
          Notifications · {cadence.notifications.frequency}
        </p>
        <div className="space-y-2">
          {[
            {
              icon: IconBell,
              iconColor: 'text-hs-orange',
              text: <><strong>Gulf Coast — Vacuum Pump Package</strong> has had no activity in 15 days.</>,
              action: 'Re-engage this deal →',
              style: 'border-hs-orange/30 bg-hs-orange/5',
            },
            {
              icon: IconEye,
              iconColor: 'text-hs-green',
              text: <><strong>Maria Chen</strong> just viewed your quote — 3rd time today.</>,
              action: 'Strike while it\'s hot: call now →',
              style: 'border-hs-green/30 bg-hs-green/5',
            },
            {
              icon: IconWarning,
              iconColor: 'text-hs-red',
              text: <><strong>Crescent City Logistics</strong> rated their last service a 4/10.</>,
              action: 'Account owner alerted — save the relationship →',
              style: 'border-hs-red/30 bg-hs-red/5',
            },
            {
              icon: IconTarget,
              iconColor: 'text-hs-blue',
              text: <><strong>Gloria Washington</strong> crossed the lead-score threshold — now a sales-qualified lead.</>,
              action: 'Assigned to Catherine with full history →',
              style: 'border-hs-blue/30 bg-hs-blue/5',
            },
            {
              icon: IconCheckCircle,
              iconColor: 'text-hs-text-light',
              text: <>3 tasks overdue for <strong>Marcus Hebert</strong> — auto-reminder sent.</>,
              action: 'View his task queue →',
              style: 'border-hs-border bg-white',
            },
          ].map((n, i) => (
            <div
              key={i}
              className={`rounded-md border px-3 py-2 flex items-start gap-2 ${n.style}`}
            >
              <span className={`${n.iconColor} shrink-0 mt-0.5`}>
                <n.icon width={14} height={14} />
              </span>
              <div>
                <p className="text-[13px] font-preview text-hs-text-dark leading-snug">{n.text}</p>
                <p className="text-[11px] font-preview text-hs-text-light">{n.action}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-2">
          {cadence.notifications.channels.map((ch) => (
            <span
              key={ch}
              className="text-[11px] font-preview font-semibold bg-hs-blue/10 text-hs-blue rounded-[3px] px-2 py-0.5"
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
