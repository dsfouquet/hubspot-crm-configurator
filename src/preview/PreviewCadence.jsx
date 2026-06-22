import { useState } from 'react'
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
  IconCalendar,
} from './uiIcons'
import { OS_EOS, EOS_HUBSPOT_MAPPING } from '../constants/defaultCadence'

// Chevron used in every section header — rotates when the section is open.
function Chevron({ open }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// Unified collapsible card: navy header bar (icon + title + summary + chevron)
// over a smoothly animated grid-rows body.
function Section({ icon: Icon, title, summary, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full bg-hs-navy px-4 py-2.5 flex items-center gap-2 text-left"
      >
        <span className="text-hs-orange shrink-0">
          <Icon width={15} height={15} />
        </span>
        <h2 className="font-preview font-semibold text-white text-[15px] leading-tight">
          {title}
        </h2>
        {summary && (
          <span className="font-preview text-[11px] text-white/55 leading-tight ml-1">
            {summary}
          </span>
        )}
        <span className="ml-auto text-white/70">
          <Chevron open={open} />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

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

  // Start every section collapsed — the page opens clean; detail is one tap away.
  const [open, setOpen] = useState({
    why: false,
    cadence: false,
    rules: false,
    notifications: false,
  })
  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }))

  // Sales rules come from the configured cadence; the rest are the standard
  // cross-hub rules we set up so the CRM nudges every team, not just sales.
  const activeRules = []
  if (rules.flagNoActivityEnabled)
    activeRules.push(`Flag deals idle over ${rules.flagNoActivityDays} days`)
  if (rules.requireNextStep) activeRules.push('Next step required on open deals')
  if (rules.autoRemindEnabled)
    activeRules.push(`Remind on tasks overdue past ${rules.autoRemindOverdueDays} days`)
  if (rules.requireCloseDateEnabled)
    activeRules.push(`Close date required past ${rules.requireCloseDatePastStage}`)
  if (rules.minCallsEnabled) activeRules.push(`Minimum ${rules.minCallsPerWeek} calls per week`)

  const ruleGroups = [
    {
      hub: 'Sales',
      rules: [
        ...activeRules,
        'Rotate untouched leads back to the team queue after 30 days',
      ],
    },
    {
      hub: 'Marketing',
      rules: [
        'Alert sales the moment a lead re-engages (revisits pricing or opens 3+ emails)',
        'Flag any form submission with no follow-up within one business day',
        'Stop emailing contacts who unsubscribed or hard-bounced',
      ],
    },
    {
      hub: 'Service',
      rules: [
        'Escalate any ticket that breaches its SLA to a manager',
        'Alert the account owner on any survey score below 7',
        'Open a renewal task automatically 60 days before a contract ends',
      ],
    },
    {
      hub: 'Operations',
      rules: [
        'Flag any deal or company with no owner assigned',
        'Require a company and amount before a deal can reach Proposal',
        'Run a weekly duplicate and data-health check',
      ],
    },
  ].filter((g) => g.rules.length)
  const totalRules = ruleGroups.reduce((n, g) => n + g.rules.length, 0)

  const channels = cadence.notifications.channels

  const NOTIFICATIONS = [
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
  ]

  const isEos = cadence.operatingSystem === OS_EOS

  return (
    <div className="p-5 space-y-4">
      {/* EOS framing — only when an operating system is selected. */}
      {isEos && (
        <div className="rounded-lg border border-hs-orange/30 bg-hs-orange/5 p-4">
          <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-orange mb-1">
            Your EOS rhythm, running in HubSpot
          </p>
          <p className="text-[12.5px] font-preview text-hs-text-dark leading-snug mb-2.5">
            The Level 10 and quarterly Rocks aren&rsquo;t a separate spreadsheet anymore. Every part
            of EOS lives on the records, dashboards, and tasks your team already works.
          </p>
          <dl className="space-y-1">
            {EOS_HUBSPOT_MAPPING.map((m) => (
              <div key={m.eos} className="flex gap-2 text-[12px] font-preview">
                <dt className="font-semibold text-hs-navy shrink-0 w-32">{m.eos}</dt>
                <dd className="text-hs-text-light">{m.hs}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Why accountability matters: adoption → ROI */}
      <Section
        icon={IconDollar}
        title="Why this matters"
        summary="Adoption → ROI"
        open={open.why}
        onToggle={() => toggle('why')}
      >
        <div className="p-4">
          <p className="text-[13px] font-preview text-hs-text-dark leading-snug">
            <strong className="text-hs-navy">Software doesn&rsquo;t create ROI — usage does.</strong>{' '}
            <span className="text-hs-text-light">
              The CRM only pays off when the team actually works it. Faster adoption is
              faster return.
            </span>
          </p>

          {/* Adoption → ROI mini timeline — number on top, label + body beneath. */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {ADOPTION_STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <span className="mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-hs-orange text-white text-[13px] font-preview font-semibold">
                  {i + 1}
                </span>
                <p className="text-[12px] font-preview font-semibold text-hs-navy leading-tight mt-2">
                  {step.title}
                </p>
                <p className="text-[11px] font-preview text-hs-text-light leading-snug mt-0.5">
                  {step.body}
                </p>
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
      </Section>

      {/* Cadence schedule */}
      <Section
        icon={IconCalendar}
        title="Team Cadence"
        summary={`${meetings.length} meeting${meetings.length === 1 ? '' : 's'}/week`}
        open={open.cadence}
        onToggle={() => toggle('cadence')}
      >
        <div className="p-4">
          {meetings.length === 0 ? (
            <p className="text-[13px] font-preview text-hs-text-light">No meetings scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {meetings.map((m) => (
                <li key={m.key} className="flex items-start gap-3">
                  <div className="shrink-0 w-20 text-center">
                    <div className="text-[11px] font-preview font-semibold text-hs-orange leading-tight">
                      {m.day}
                    </div>
                    <div className="text-[10px] font-preview text-hs-text-light mt-0.5">{m.time}</div>
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
      </Section>

      {/* Active rules */}
      <Section
        icon={IconCheck}
        title="Accountability Rules"
        summary={`${totalRules} active`}
        open={open.rules}
        onToggle={() => toggle('rules')}
      >
        <div className="p-4 space-y-3.5">
          {ruleGroups.map((g) => (
            <div key={g.hub}>
              <p className="text-[10px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-1.5 pb-1 border-b border-hs-greatwhite">
                {g.hub}
              </p>
              <ul className="space-y-1.5">
                {g.rules.map((r) => (
                  <li
                    key={r}
                    className="text-[13px] font-preview text-hs-text-dark flex items-start gap-2"
                  >
                    <IconCheck width={12} height={12} className="text-hs-green shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Sample notification + channels */}
      <Section
        icon={IconBell}
        title="Notifications"
        summary={`${cadence.notifications.frequency} · ${channels.length} channel${channels.length === 1 ? '' : 's'}`}
        open={open.notifications}
        onToggle={() => toggle('notifications')}
      >
        <div className="p-4">
          <div className="space-y-2">
            {NOTIFICATIONS.map((n, i) => (
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
          <div className="flex flex-wrap gap-1.5 mt-3">
            {channels.map((ch) => (
              <span
                key={ch}
                className="text-[11px] font-preview font-semibold bg-hs-blue/10 text-hs-blue rounded-[3px] px-2 py-0.5"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
