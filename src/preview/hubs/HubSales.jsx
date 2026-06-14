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
import {
  Tag,
  Avatar,
  IconCalendar,
  IconMail,
  IconCheck,
  IconCheckCircle,
  IconDoc,
  IconBell,
  IconEye,
  IconPhone,
  IconUser,
  IconBuilding,
  IconNote,
  IconClose,
} from '../uiIcons'
import {
  DEALS,
  CONTACTS,
  MEETINGS_DEMO,
  DOCUMENTS_DEMO,
  SEQUENCE_DEMO,
  REVENUE_TREND,
  MONTHS,
  REP_PERFORMANCE,
  REP_ACTIVITY,
  PIPELINE_VALUES,
} from '../demoData'

// Look up a demo contact by name (falls back to a minimal stub so the modal
// always renders something sensible even if a name doesn't match).
function findContact(name) {
  return (
    CONTACTS.find((c) => c.name === name) || {
      name,
      title: '',
      company: '',
      email: '',
      phone: '',
      lastActivity: '',
    }
  )
}

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

/* ------------------------------------------------------------------ */
/* CONTEXTUAL ACTION MODAL (local — patterned on HubCRM RecordModal)   */
/* ------------------------------------------------------------------ */

// Lightweight modal shell. White rounded card, click-backdrop + X to close.
// `payload` carries { kind, ... } and we render the matching mock body.
function ActionModal({ payload, onClose }) {
  if (!payload) return null
  return (
    <div
      className="fixed inset-0 z-50 bg-hs-navy/40 flex items-center justify-center p-6 font-preview"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between border-b border-hs-border px-4 py-2.5">
          <span className="text-[12px] font-medium text-hs-text-light">{payload.header}</span>
          <button
            onClick={onClose}
            className="text-hs-text-light hover:text-hs-navy leading-none p-0.5"
            title="Close"
          >
            <IconClose width={14} height={14} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {payload.kind === 'call' && <CallMock payload={payload} />}
          {payload.kind === 'email' && <EmailMock payload={payload} />}
          {payload.kind === 'todo' && <TodoMock payload={payload} />}
          {payload.kind === 'contact' && <ContactCard payload={payload} />}
        </div>
      </div>
    </div>
  )
}

// call → in-app HubSpot CALL window.
function CallMock({ payload }) {
  const c = payload.contact
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Avatar name={c.name} size={40} />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-hs-navy leading-tight">{c.name}</p>
          <p className="text-[11px] text-hs-text-light truncate">
            {c.title}
            {c.title && c.company ? ' · ' : ''}
            {c.company}
          </p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-hs-green bg-hs-green/10 rounded-[3px] px-1.5 py-0.5 shrink-0">
          <IconPhone width={11} height={11} />
          Calling from HubSpot
        </span>
      </div>

      {/* number + dialer */}
      <div className="mt-4 rounded-md border border-hs-border bg-hs-canvas/50 px-3 py-3 text-center">
        <p className="text-[10px] uppercase tracking-wide text-hs-text-light">Dialing</p>
        <p className="text-[18px] font-semibold text-hs-navy tabular-nums">{c.phone}</p>
        <p className="text-[10px] text-hs-text-light mt-0.5">via HubSpot calling · this number</p>
      </div>

      <button
        type="button"
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-hs-green text-white text-[13px] font-semibold rounded-md py-2.5 cursor-default"
      >
        <IconPhone width={15} height={15} />
        Call
      </button>

      <div className="mt-3">
        <p className="text-[11px] font-medium text-hs-text-dark mb-1">Call notes</p>
        <div className="rounded-md border border-hs-border px-3 py-2 text-[11px] text-hs-text-light leading-snug min-h-[56px]">
          Notes you take during the call log straight to {c.name}&apos;s timeline. The call is
          placed inside HubSpot — no separate phone, every call tracked automatically.
        </div>
      </div>
    </div>
  )
}

// email → compose window addressed to the contact.
function EmailMock({ payload }) {
  const c = payload.contact
  return (
    <div className="p-4">
      <div className="space-y-px text-[12px]">
        <div className="flex items-center gap-2 border-b border-hs-border py-1.5">
          <span className="w-12 text-hs-text-light shrink-0">To</span>
          <span className="inline-flex items-center gap-1.5 bg-hs-canvas rounded-[3px] px-2 py-0.5">
            <Avatar name={c.name} size={16} />
            <span className="text-hs-text-dark">{c.email}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 border-b border-hs-border py-1.5">
          <span className="w-12 text-hs-text-light shrink-0">Subject</span>
          <span className="text-hs-text-dark font-medium">{payload.subject}</span>
        </div>
      </div>

      <div className="mt-3 text-[12px] text-hs-text-dark leading-relaxed space-y-2">
        <p>Hi {c.name.split(' ')[0]},</p>
        <p>{payload.bodyLine}</p>
        <p>Let me know what works and I&apos;ll get it over to you.</p>
        <p>Thanks,<br />You</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-hs-orange text-white text-[13px] font-semibold rounded-md px-4 py-2 cursor-default"
        >
          <IconMail width={14} height={14} />
          Send
        </button>
        <span className="text-[11px] text-hs-text-light">Logged to {c.name}&apos;s timeline</span>
      </div>
    </div>
  )
}

// todo → to-do detail popup with associated-record chip.
function TodoMock({ payload }) {
  const rec = payload.record // { type: 'contact' | 'deal', label, sub }
  return (
    <div className="p-4">
      <div className="flex items-start gap-2.5">
        <span className="w-4 h-4 mt-0.5 rounded-full border-2 border-hs-border shrink-0" />
        <p className="text-[13px] text-hs-text-dark leading-snug flex-1">{payload.text}</p>
      </div>

      {payload.due && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[11px] text-hs-text-light">Due</span>
          <Tag color={payload.overdue ? 'red' : 'gray'}>{payload.due}</Tag>
        </div>
      )}

      <div className="mt-4">
        <p className="text-[11px] font-medium text-hs-text-dark mb-1.5">Associated with</p>
        <span className="inline-flex items-center gap-2 border border-hs-border rounded-[3px] px-2.5 py-1.5 bg-hs-canvas/40">
          <span className="text-hs-text-light shrink-0">
            {rec.type === 'deal' ? (
              <IconBuilding width={13} height={13} />
            ) : (
              <IconUser width={13} height={13} />
            )}
          </span>
          <span className="min-w-0">
            <span className="hs-link text-[12px] font-medium block leading-tight">{rec.label}</span>
            {rec.sub && <span className="text-[10px] text-hs-text-light">{rec.sub}</span>}
          </span>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-hs-orange text-white text-[12px] font-semibold rounded-md px-3 py-1.5 cursor-default"
        >
          <IconCheckCircle width={13} height={13} />
          Mark complete
        </button>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-hs-text-light">
          <IconNote width={12} height={12} />
          Log activity
        </span>
      </div>
    </div>
  )
}

// contact/company info card for meeting rows.
function ContactCard({ payload }) {
  const c = payload.contact
  const m = payload.meeting
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Avatar name={c.name} size={40} />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-hs-navy leading-tight">{c.name}</p>
          <p className="text-[11px] text-hs-text-light truncate">
            {c.title}
            {c.title && c.company ? ' · ' : ''}
            {c.company}
          </p>
        </div>
      </div>

      {m && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-hs-blue/5 border border-hs-blue/15 px-3 py-2">
          <span className="text-hs-blue shrink-0">
            <IconCalendar width={14} height={14} />
          </span>
          <p className="text-[11px] text-hs-text-dark leading-snug">
            <span className="font-medium">{m.type}</span> · {m.time}
          </p>
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-1.5 text-[12px]">
        {c.email && (
          <div className="flex items-center gap-2">
            <span className="text-hs-text-light shrink-0">
              <IconMail width={13} height={13} />
            </span>
            <span className="hs-link">{c.email}</span>
          </div>
        )}
        {c.phone && (
          <div className="flex items-center gap-2">
            <span className="text-hs-text-light shrink-0">
              <IconPhone width={13} height={13} />
            </span>
            <span className="text-hs-text-dark">{c.phone}</span>
          </div>
        )}
        {c.company && (
          <div className="flex items-center gap-2">
            <span className="text-hs-text-light shrink-0">
              <IconBuilding width={13} height={13} />
            </span>
            <span className="text-hs-text-dark">{c.company}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-medium text-hs-text-dark mb-1.5">Recent activity</p>
        <div className="space-y-1.5">
          {(payload.activity || []).map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-hs-border mt-1.5 shrink-0" />
              <p className="text-[11px] text-hs-text-light leading-snug">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HubSales() {
  const [tab, setTab] = useState('Workspace')
  const session = useStore((s) => s.session)
  const [modal, setModal] = useState(null)

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
        {tab === 'Workspace' && <Workspace session={session} onOpen={setModal} />}
        {tab === 'Sequences' && <Sequences session={session} />}
        {tab === 'Documents' && <Documents />}
        {tab === 'Meetings' && <Meetings onOpen={setModal} />}
        {tab === 'Analytics' && <Analytics />}
      </div>

      <ActionModal payload={modal} onClose={() => setModal(null)} />
    </div>
  )
}

// Build the modal payload for a clicked task, by task type.
function taskPayload(t) {
  const c = findContact(t.contact)
  if (t.type === 'call') {
    return { kind: 'call', header: 'Call · HubSpot', contact: c }
  }
  if (t.type === 'email') {
    return {
      kind: 'email',
      header: 'New email',
      contact: c,
      subject: t.subject,
      bodyLine: t.bodyLine,
    }
  }
  // todo
  return {
    kind: 'todo',
    header: 'To-do',
    text: t.label,
    due: t.due,
    overdue: t.overdue,
    record: t.record,
  }
}

// Build the contact info-card payload for a clicked meeting row.
function meetingPayload(m) {
  const c = findContact(m.with)
  return {
    kind: 'contact',
    header: 'Contact',
    contact: c,
    meeting: m,
    activity: [
      `Meeting scheduled — ${m.type}`,
      c.lastActivity ? `Last activity ${c.lastActivity}` : 'Synced from your calendar',
      `Associated company: ${c.company || m.company}`,
    ],
  }
}

/* ------------------------------------------------------------------ */
/* 1) WORKSPACE                                                        */
/* ------------------------------------------------------------------ */

const TODAY_TASKS = [
  {
    label: 'Call Maria Chen re: vacuum pump quote',
    due: 'Due 9:00 AM',
    overdue: false,
    type: 'call',
    contact: 'Maria Chen',
  },
  {
    label: 'Send updated pricing to Bayou Fabrication',
    due: 'Due 11:30 AM',
    overdue: false,
    type: 'email',
    contact: 'Tommy Guidry',
    subject: 'Updated pricing — plasma table install',
    bodyLine:
      'Reworked the numbers on the plasma table package after our walkthrough — attached is the updated quote with the revised lead time.',
  },
  {
    label: 'Log site walkthrough notes — Gulf Coast Chemical',
    due: 'Due 1:00 PM',
    overdue: false,
    type: 'todo',
    contact: 'Maria Chen',
    record: {
      type: 'contact',
      label: 'Maria Chen',
      sub: 'VP of Operations · Gulf Coast Chemical',
    },
  },
  {
    label: 'Follow up on stale deal: Acadiana Phase 2',
    due: 'Overdue',
    overdue: true,
    type: 'todo',
    contact: 'Sarah Thibodeaux',
    record: {
      type: 'deal',
      label: 'Acadiana — Site Equipment Phase 2',
      sub: '$128,000 · Acadiana Builders Group',
    },
  },
  {
    label: 'Confirm Thursday meeting with Priya Nair',
    due: 'Due 4:00 PM',
    overdue: false,
    type: 'email',
    contact: 'Priya Nair',
    subject: 'Confirming Thursday 1:00 PM — contract renewal',
    bodyLine:
      "Just confirming we're still good for Thursday at 1:00 to walk through the annual service contract renewal.",
  },
]

// Small inline glyph that signals the action a task row will trigger.
function TaskTypeIcon({ type }) {
  if (type === 'call') return <IconPhone width={12} height={12} />
  if (type === 'email') return <IconMail width={12} height={12} />
  return <IconCheck width={12} height={12} />
}

function Workspace({ session, onOpen }) {
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
              <button
                key={t.label}
                type="button"
                onClick={() => onOpen(taskPayload(t))}
                className="w-full text-left flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-hs-canvas/70 transition-colors group"
              >
                <span className="w-4 h-4 rounded-full border-2 border-hs-border shrink-0" />
                <span className="w-5 h-5 rounded-[3px] bg-hs-canvas text-hs-text-light flex items-center justify-center shrink-0 group-hover:text-hs-blue">
                  <TaskTypeIcon type={t.type} />
                </span>
                <span className="text-[12px] text-hs-text-dark flex-1 leading-snug">
                  {t.label}
                </span>
                <Tag color={t.overdue ? 'red' : 'gray'}>{t.due}</Tag>
              </button>
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
                <button
                  key={m.with + m.time}
                  type="button"
                  onClick={() => onOpen(meetingPayload(m))}
                  className="w-full text-left flex items-start gap-3 px-2 py-2 rounded-md hover:bg-hs-canvas/70 transition-colors"
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
                </button>
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
              <span className="font-semibold">SIHI Vacuum Proposal.pdf</span>
            </p>
            <p className="text-[10px] text-white/60">2m ago · Gulf Coast Chemical</p>
          </div>
          <span className="text-[10px] text-hs-orange font-medium shrink-0">View →</span>
        </div>

        {/* View-tracking detail: how long, which pages */}
        <DocumentViewDetail />
      </div>
    </div>
  )
}

// Per-document engagement readout: total time + time spent per page.
function DocumentViewDetail() {
  const totalLabel = '4m 12s total'
  const pages = [
    { name: 'Pricing', seconds: 150, label: '2m 30s' },
    { name: 'Scope', seconds: 52, label: '52s' },
    { name: 'Terms', seconds: 50, label: '50s' },
  ]
  const max = Math.max(...pages.map((p) => p.seconds))

  return (
    <div className="mt-3 ml-12 max-w-md rounded-lg border border-hs-border bg-white p-3">
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-full bg-hs-blue/10 text-hs-blue flex items-center justify-center shrink-0">
          <IconEye width={13} height={13} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-hs-text-dark leading-snug">
            <span className="font-semibold text-hs-navy">Maria Chen</span> viewed{' '}
            <span className="font-semibold text-hs-navy">SIHI Vacuum Proposal</span>
          </p>
          <p className="text-[11px] text-hs-text-light">
            {totalLabel} · spent 2m 30s on the Pricing page, 50s on Terms
          </p>
        </div>
        <Tag color="green">High intent</Tag>
      </div>

      {/* Per-page time bars */}
      <div className="mt-3 space-y-1.5">
        <p className="text-[10px] uppercase tracking-wide text-hs-text-light">Time on page</p>
        {pages.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-14 text-[11px] text-hs-text-dark shrink-0">{p.name}</span>
            <span className="flex-1 h-2 rounded-full bg-hs-canvas overflow-hidden">
              <span
                className="block h-full rounded-full bg-hs-blue"
                style={{ width: `${Math.round((p.seconds / max) * 100)}%` }}
              />
            </span>
            <span className="w-12 text-[11px] text-hs-text-light text-right shrink-0 tabular-nums">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2.5 text-[11px] text-hs-text-light leading-snug">
        She lingered on Pricing — that&apos;s your follow-up signal. Call while it&apos;s top of mind.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4) MEETINGS                                                         */
/* ------------------------------------------------------------------ */

const CAL_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const HIGHLIGHT_DAYS = [11, 12, 18]
const TIME_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM']

function Meetings({ onOpen }) {
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
              <button
                key={m.with + m.time}
                type="button"
                onClick={() => onOpen(meetingPayload(m))}
                className="w-full text-left flex items-start gap-3 px-1 py-2.5 border-b border-hs-canvas last:border-0 hover:bg-hs-canvas/50 transition-colors"
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
              </button>
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
