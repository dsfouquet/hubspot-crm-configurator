// HubSales — "HubSpot light" Sales Hub demo view.
// Five sub-tabs (Workspace / Sequences / Documents / Meetings / Analytics) styled to
// feel like real 2025-era HubSpot Sales Hub screens. Benefits-only, demo-ready.
// No props, no new deps, no images. Pulls shared demo data + the session config.

import { useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  ReportCard,
  StatCard,
  HBarChart,
  LineChart,
  DataTable,
} from '../charts'
import { Tag, IconCalendar, IconMail, IconCheck, IconDoc, IconBell, IconEye } from '../uiIcons'
import {
  DEALS,
  MEETINGS_DEMO,
  DOCUMENTS_DEMO,
  SEQUENCE_DEMO,
  REVENUE_TREND,
  MONTHS,
  REP_PERFORMANCE,
  REP_ACTIVITY,
  PIPELINE_VALUES,
} from '../demoData'

const TABS = ['Workspace', 'Sequences', 'Documents', 'Meetings', 'Analytics']

// Count "email steps" in a configured workflow's node list. Email actions are
// action nodes whose label references sending an email (mail glyph / "Send Email").
function emailStepCount(wf) {
  const nodes = Array.isArray(wf?.nodes) ? wf.nodes : []
  return nodes.filter(
    (n) =>
      n &&
      (n.type === 'action' || n.kind === 'action') &&
      /email|\u{1F4E7}/iu.test(String(n.label || n.title || ''))
  ).length
}

export default function HubSales() {
  const [tab, setTab] = useState('Workspace')
  const session = useStore((s) => s.session)

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Sub-tab bar */}
      <div className="border-b border-hs-border bg-white px-4 flex items-center gap-1 shrink-0">
        {TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative text-[13px] px-3 py-2.5 transition-colors ${
                active
                  ? 'text-hs-navy font-medium'
                  : 'text-hs-text-light hover:text-hs-text-dark'
              }`}
            >
              {t}
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-hs-orange rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        {tab === 'Workspace' && <Workspace session={session} />}
        {tab === 'Sequences' && <Sequences session={session} />}
        {tab === 'Documents' && <Documents />}
        {tab === 'Meetings' && <Meetings />}
        {tab === 'Analytics' && <Analytics />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 1) WORKSPACE                                                        */
/* ------------------------------------------------------------------ */

const TODAY_TASKS = [
  { label: 'Call Maria Chen re: vacuum pump quote', due: 'Due 9:00 AM', overdue: false },
  { label: 'Send updated pricing to Bayou Fabrication', due: 'Due 11:30 AM', overdue: false },
  { label: 'Log site walkthrough notes — Gulf Coast Chemical', due: 'Due 1:00 PM', overdue: false },
  { label: 'Follow up on stale deal: Acadiana Phase 2', due: 'Overdue', overdue: true },
  { label: 'Confirm Thursday meeting with Priya Nair', due: 'Due 4:00 PM', overdue: false },
]

function Workspace({ session }) {
  const stages = session?.deals?.pipelineStages || []
  const pipeline = PIPELINE_VALUES.slice(0, 4).map((value, i) => ({
    label: stages[i]?.label || `Stage ${i + 1}`,
    value,
  }))

  return (
    <div className="space-y-4">
      {/* Greeting bar */}
      <div className="bg-white rounded-lg border border-hs-border px-4 py-3">
        <h3 className="text-[15px] font-semibold text-hs-navy leading-tight">
          Good morning — here&apos;s your day
        </h3>
        <p className="text-[12px] text-hs-text-light">
          Wednesday, June 11 · You have a focused day ahead. Knock out the top tasks first.
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Tasks due today" value="6" />
        <StatCard label="Meetings today" value="2" />
        <StatCard label="Open deals" value="$382K" delta="$54K" deltaGood />
        <StatCard label="Quotes awaiting reply" value="4" />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's tasks */}
        <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
          <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
            <h4 className="text-[13px] font-semibold text-hs-navy">Today&apos;s tasks</h4>
            <span className="text-[11px] text-hs-text-light">5 of 6 remaining</span>
          </div>
          <div className="px-2 pb-2">
            {TODAY_TASKS.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-hs-canvas/70"
              >
                <span className="w-4 h-4 rounded-full border-2 border-hs-border shrink-0" />
                <span className="text-[12px] text-hs-text-dark flex-1 leading-snug">
                  {t.label}
                </span>
                <Tag color={t.overdue ? 'red' : 'gray'}>{t.due}</Tag>
              </div>
            ))}
          </div>
        </div>

        {/* Today's meetings + mini pipeline */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
            <div className="px-4 pt-3 pb-1.5">
              <h4 className="text-[13px] font-semibold text-hs-navy">Today&apos;s meetings</h4>
            </div>
            <div className="px-2 pb-2">
              {MEETINGS_DEMO.map((m) => (
                <div
                  key={m.with + m.time}
                  className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-hs-canvas/70"
                >
                  <div className="w-9 h-9 rounded-md bg-hs-blue/10 flex items-center justify-center text-hs-blue shrink-0">
                    <IconCalendar width={15} height={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-hs-navy truncate">
                      {m.with} · {m.company}
                    </p>
                    <p className="text-[11px] text-hs-text-light">
                      {m.time} · {m.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ReportCard title="Pipeline summary" subtitle="Open value by stage">
            <HBarChart data={pipeline} money color="#0091AE" />
          </ReportCard>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2) SEQUENCES                                                        */
/* ------------------------------------------------------------------ */

function SeqStat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-[18px] font-semibold text-hs-navy leading-none">{value}</p>
      <p className="text-[10px] text-hs-text-light mt-0.5">{label}</p>
    </div>
  )
}

function Sequences({ session }) {
  const seq = SEQUENCE_DEMO
  const workflows = (session?.workflows || []).filter((w) => emailStepCount(w) >= 2)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-hs-navy">Sequences</h3>
          <p className="text-[11px] text-hs-text-light">
            Automated, personalized email cadences that run while you&apos;re in the field.
          </p>
        </div>
        <span className="hs-btn-primary cursor-default" style={{ padding: '6px 12px', fontSize: 12 }}>
          Enroll contacts
        </span>
      </div>

      {/* Featured sequence */}
      <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
        <div className="px-4 pt-3 pb-3 border-b border-hs-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-[13px] font-semibold text-hs-navy">{seq.name}</h4>
            <Tag color="green">Active</Tag>
          </div>
          <div className="flex items-center gap-6 pr-1">
            <SeqStat label="Enrolled" value={seq.enrolled} />
            <SeqStat label="Open rate" value={seq.openRate} />
            <SeqStat label="Reply rate" value={seq.replyRate} />
          </div>
        </div>

        {/* Vertical step timeline */}
        <div className="px-4 py-3">
          <div className="relative pl-2">
            {/* connector line */}
            <span className="absolute left-[58px] top-3 bottom-3 w-px bg-hs-border" />
            {seq.steps.map((step) => {
              const isEmail = step.type === 'Email'
              return (
                <div key={step.day + step.label} className="relative flex items-center gap-3 py-2">
                  <span className="w-12 text-[10px] text-hs-text-light text-right shrink-0">
                    {step.day}
                  </span>
                  <span
                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isEmail ? 'bg-hs-orange/10 text-hs-orange' : 'bg-hs-blue/10 text-hs-blue'
                    }`}
                  >
                    {isEmail ? <IconMail width={12} height={12} /> : <IconCheck width={12} height={12} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] text-hs-text-dark leading-snug">{step.label}</p>
                    <p className="text-[10px] text-hs-text-light">{step.type} step</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Session-derived sequences */}
      {workflows.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-hs-text-light px-1">
            From your configured automations
          </p>
          {workflows.map((wf, i) => (
            <div
              key={wf.id || wf.name || i}
              className="bg-white rounded-lg border border-hs-border px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-full bg-hs-orange/10 text-hs-orange flex items-center justify-center shrink-0">
                  <IconMail width={12} height={12} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-hs-navy truncate">{wf.name}</p>
                  <p className="text-[10px] text-hs-text-light truncate">
                    {emailStepCount(wf)} email steps
                    {wf.triggerSummary ? ` · ${wf.triggerSummary}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-hs-text-light">
                  {9 + ((i * 7) % 22)} enrolled
                </span>
                <Tag color="green">Active</Tag>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3) DOCUMENTS                                                        */
/* ------------------------------------------------------------------ */

function Documents() {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (val) => (
        <span className="flex items-center gap-2">
          <IconDoc width={13} height={13} className="text-hs-text-light shrink-0" />
          <span className="hs-link font-medium">{val}</span>
        </span>
      ),
    },
    { key: 'views', label: 'Views', align: 'right' },
    { key: 'lastViewed', label: 'Last viewed' },
  ]

  return (
    <div className="space-y-4">
      <ReportCard
        title="Sales documents"
        subtitle="Trackable PDFs you share with prospects"
        footer="3 documents · 101 total views this month"
      >
        <DataTable columns={columns} rows={DOCUMENTS_DEMO} />
      </ReportCard>

      {/* Notification callout */}
      <div className="bg-white rounded-lg border border-hs-border p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-hs-green/10 flex items-center justify-center text-hs-green shrink-0">
            <IconBell width={15} height={15} />
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-semibold text-hs-navy">
              You get notified the moment a prospect opens a document
            </h4>
            <p className="text-[12px] text-hs-text-light leading-snug">
              No more guessing whether they read your quote. Time your follow-up perfectly.
            </p>
          </div>
        </div>

        {/* Mock notification toast */}
        <div className="mt-3 ml-12 flex items-center gap-3 bg-hs-navy text-white rounded-lg px-3 py-2.5 shadow-sm max-w-md">
          <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <IconEye width={13} height={13} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] leading-snug">
              <span className="font-semibold">Maria Chen</span> viewed{' '}
              <span className="font-semibold">Capabilities Overview.pdf</span>
            </p>
            <p className="text-[10px] text-white/60">2m ago · Gulf Coast Chemical</p>
          </div>
          <span className="text-[10px] text-hs-orange font-medium shrink-0">View →</span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4) MEETINGS                                                         */
/* ------------------------------------------------------------------ */

const CAL_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const HIGHLIGHT_DAYS = [11, 12, 18]
const TIME_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM']

function Meetings() {
  // Build a simple month grid: June 2026 starts on a Monday (offset 1).
  const offset = 1
  const daysInMonth = 30
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scheduler mock */}
        <ReportCard title="Book a meeting" subtitle="June 2026">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {CAL_DAYS.map((d, i) => (
              <div
                key={i}
                className="text-[10px] text-hs-text-light text-center font-medium py-1"
              >
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />
              const highlighted = HIGHLIGHT_DAYS.includes(d)
              const isToday = d === 11
              return (
                <div
                  key={d}
                  className={`text-[11px] text-center py-1.5 rounded-md ${
                    isToday
                      ? 'bg-hs-orange text-white font-semibold'
                      : highlighted
                        ? 'bg-hs-blue/10 text-hs-blue font-medium cursor-pointer'
                        : 'text-hs-text-dark hover:bg-hs-canvas'
                  }`}
                >
                  {d}
                </div>
              )
            })}
          </div>

          <p className="text-[11px] font-medium text-hs-text-dark mb-2">
            Available times · Thursday, June 11
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {TIME_SLOTS.map((t, i) => (
              <button
                key={t}
                className={`text-[12px] py-2 rounded-md border transition-colors ${
                  i === 0
                    ? 'border-hs-blue text-hs-blue bg-hs-blue/5 font-medium'
                    : 'border-hs-border text-hs-text-dark hover:border-hs-blue hover:text-hs-blue'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Booking link copy-style input */}
          <p className="text-[11px] text-hs-text-light mb-1">Your booking link</p>
          <div className="flex items-stretch border border-hs-border rounded-md overflow-hidden">
            <span className="flex-1 text-[12px] text-hs-text-dark px-3 py-2 bg-hs-canvas/50 truncate">
              meetings.yourcompany.com/you
            </span>
            <span className="text-[12px] text-white bg-hs-blue px-3 py-2 font-medium shrink-0">
              Copy
            </span>
          </div>
        </ReportCard>

        {/* Upcoming meetings */}
        <ReportCard title="Upcoming meetings" subtitle="Synced to your calendar automatically">
          <div className="-mx-1">
            {MEETINGS_DEMO.map((m) => (
              <div
                key={m.with + m.time}
                className="flex items-start gap-3 px-1 py-2.5 border-b border-hs-canvas last:border-0"
              >
                <div className="w-10 h-10 rounded-md bg-hs-blue/10 flex flex-col items-center justify-center text-hs-blue shrink-0">
                  <IconCalendar width={15} height={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-hs-navy truncate">{m.with}</p>
                  <p className="text-[11px] text-hs-text-light truncate">
                    {m.company} · {m.type}
                  </p>
                </div>
                <span className="text-[11px] text-hs-text-dark font-medium text-right shrink-0">
                  {m.time}
                </span>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5) ANALYTICS                                                        */
/* ------------------------------------------------------------------ */

function Analytics() {
  const activityColumns = [
    { key: 'label', label: 'Rep' },
    { key: 'calls', label: 'Calls', align: 'right' },
    { key: 'emails', label: 'Emails', align: 'right' },
    { key: 'meetings', label: 'Meetings', align: 'right' },
  ]

  return (
    <div className="space-y-4">
      {/* Filters bar mock */}
      <div className="bg-white rounded-lg border border-hs-border px-4 py-2.5 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-hs-text-light">Showing:</span>
        <span className="text-[12px] text-hs-text-dark border border-hs-border rounded-md px-2.5 py-1">
          Date range: Last 6 months ▾
        </span>
        <span className="text-[12px] text-hs-text-dark border border-hs-border rounded-md px-2.5 py-1">
          Owner: All ▾
        </span>
        <span className="ml-auto text-[11px] text-hs-blue font-medium">Export</span>
      </div>

      {/* Report grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportCard title="Closed revenue" subtitle="Closed-won by month">
          <LineChart
            series={[{ name: 'Revenue', color: '#FF7A59', points: REVENUE_TREND }]}
            labels={MONTHS}
            money
          />
        </ReportCard>

        <ReportCard title="Revenue by rep" subtitle="Closed-won, last 6 months">
          <HBarChart data={REP_PERFORMANCE} money color="#00BDA5" />
        </ReportCard>

        <ReportCard title="Activity by rep" subtitle="Logged calls, emails & meetings">
          <DataTable columns={activityColumns} rows={REP_ACTIVITY} compact />
        </ReportCard>

        <ReportCard title="Sales KPIs" subtitle="Team performance at a glance">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Win rate" value="38%" delta="6%" deltaGood />
            <StatCard label="Avg deal size" value="$63.6K" />
            <StatCard label="Avg sales cycle" value="47 days" />
          </div>
        </ReportCard>
      </div>
    </div>
  )
}
