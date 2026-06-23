import { useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  StatCard,
  DonutChart,
} from '../charts'
import { Tag, IconWarning, IconSearch, IconBook, IconCheck } from '../uiIcons'
import { TICKETS, KB_ARTICLES, NPS_DATA } from '../demoData'

const SUB_TABS = ['Help Desk', 'Knowledge Base', 'Surveys']

// Avatar initials from a name ("Catherine Roy" -> "CR")
function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

const PRIORITY_PILL = { High: 'red', Medium: 'orange', Low: 'gray' }

// Loose match a ticket's status string to a configured stage label.
function matchStage(status = '', stageLabels = []) {
  const s = status.toLowerCase().trim()
  // exact-ish match first
  let idx = stageLabels.findIndex((l) => l.toLowerCase().trim() === s)
  if (idx !== -1) return idx
  // contains either direction
  idx = stageLabels.findIndex(
    (l) =>
      l.toLowerCase().includes(s) || s.includes(l.toLowerCase()),
  )
  return idx // -1 if no match -> caller buckets into first column
}

export default function HubService() {
  const [tab, setTab] = useState('Help Desk')

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Sub-tab bar */}
      <div data-tour="service-tabs" className="flex items-center gap-1 px-4 border-b border-hs-border bg-white">
        {SUB_TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-2.5 text-[13px] font-preview transition-colors ${
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
      <div data-tour="service-content" className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        {tab === 'Help Desk' && <HelpDesk />}
        {tab === 'Knowledge Base' && <KnowledgeBase />}
        {tab === 'Surveys' && <Surveys />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Help Desk                                                          */
/* ------------------------------------------------------------------ */
function HelpDesk() {
  const session = useStore((s) => s.session)
  const configured = session?.tickets?.pipelineStages || []
  const stageLabels =
    configured.length > 0
      ? configured.map((st) => st.label)
      : ['New', 'In Progress', 'Waiting on Customer', 'Resolved']

  // Distribute tickets into columns by loose status match.
  const columns = stageLabels.map(() => [])
  TICKETS.forEach((ticket) => {
    const idx = matchStage(ticket.status, stageLabels)
    columns[idx === -1 ? 0 : idx].push(ticket)
  })

  // Pick one High-priority ticket to flag with an SLA chip.
  const slaTicket = TICKETS.find((t) => t.priority === 'High')

  return (
    <div className="flex flex-col gap-4">
      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Open tickets" value="5" />
        <StatCard
          label="Avg. first response"
          value="2.4h"
          delta="0.8h"
          deltaGood
        />
        <StatCard label="SLA met" value="94%" delta="3%" deltaGood />
        <StatCard label="Resolved this week" value="12" />
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-3 min-w-[640px]"
          style={{ gridTemplateColumns: `repeat(${stageLabels.length}, minmax(0, 1fr))` }}
        >
          {stageLabels.map((label, ci) => (
            <div
              key={label + ci}
              className="bg-hs-canvas rounded-lg border border-hs-border/70"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-hs-border/70">
                <span className="text-[12px] font-preview font-semibold text-hs-text-dark truncate">
                  {label}
                </span>
                <span className="text-[11px] font-preview text-hs-text-light bg-white rounded-full px-2 py-0.5 border border-hs-border">
                  {columns[ci].length}
                </span>
              </div>
              <div className="p-2 flex flex-col gap-2 min-h-[80px]">
                {columns[ci].map((ticket, ti) => {
                  const isSla = ticket === slaTicket
                  return (
                    <div
                      key={ticket.name + ti}
                      className="bg-white rounded-md border border-hs-border p-2.5 shadow-sm"
                    >
                      <p className="text-[12px] font-preview font-semibold text-hs-navy truncate">
                        {ticket.name}
                      </p>
                      <p className="text-[11px] font-preview text-hs-text-light truncate">
                        {ticket.company}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <Tag color={PRIORITY_PILL[ticket.priority] || 'gray'}>
                          {ticket.priority}
                        </Tag>
                        {isSla && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-preview font-semibold text-hs-red bg-hs-red/10 rounded-[3px] px-1.5 py-0.5">
                            <IconWarning width={10} height={10} className="shrink-0" />
                            SLA: 1h left
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-hs-blue text-white text-[9px] font-preview font-semibold"
                          title={ticket.owner}
                        >
                          {initials(ticket.owner)}
                        </span>
                        <span className="text-[10px] font-preview text-hs-text-light">
                          {ticket.age}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] font-preview text-hs-text-light italic">
        Stuck tickets auto-escalate after 48 hours — nobody has to remember.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Knowledge Base                                                     */
/* ------------------------------------------------------------------ */
function KnowledgeBase() {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero search */}
      <div className="bg-hs-navy rounded-lg px-6 py-8 text-center">
        <h2 className="text-[20px] font-preview font-semibold text-white">
          How can we help?
        </h2>
        <p className="text-[12px] font-preview text-white/70 mt-1">
          Search our knowledge base for answers
        </p>
        <div className="mt-4 max-w-md mx-auto flex items-center bg-white rounded-md overflow-hidden shadow-sm">
          <span className="pl-3 text-hs-text-light"><IconSearch width={14} height={14} /></span>
          <input
            type="text"
            readOnly
            placeholder="Search for articles, guides, and FAQs…"
            className="flex-1 px-3 py-2.5 text-[13px] font-preview text-hs-text-dark placeholder:text-hs-text-light outline-none"
          />
          <button className="bg-hs-orange text-white text-[13px] font-preview font-medium px-4 py-2.5">
            Search
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Self-serve resolutions this month" value="38" />
        <StatCard label="Tickets deflected" value="22%" />
      </div>

      {/* Article grid */}
      <div>
        <h3 className="text-[13px] font-preview font-semibold text-hs-navy mb-2">
          Popular articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KB_ARTICLES.map((a) => (
            <div
              key={a.title}
              className="bg-white rounded-lg border border-hs-border p-4 flex gap-3 hover:border-hs-blue transition-colors"
            >
              <span className="text-hs-blue mt-0.5"><IconBook width={18} height={18} /></span>
              <div className="min-w-0">
                <p className="text-[13px] font-preview font-semibold text-hs-navy">
                  {a.title}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] font-preview text-hs-text-light">
                  <span>{a.views} views</span>
                  <span className="flex items-center gap-1 text-hs-green">
                    <IconCheck width={11} height={11} className="shrink-0" />
                    {a.helpful} found helpful
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Surveys (NPS)                                                      */
/* ------------------------------------------------------------------ */
function scoreColor(score) {
  if (score >= 9) return 'green'
  if (score >= 7) return 'gray'
  return 'red'
}

const BADGE_CLASS = {
  green: 'bg-hs-green text-white',
  gray: 'bg-hs-border text-hs-text-dark',
  red: 'bg-hs-red text-white',
}

function Surveys() {
  const donutData = [
    { label: 'Promoters', value: NPS_DATA.promoters, color: '#00BDA5' },
    { label: 'Passives', value: NPS_DATA.passives, color: '#CBD6E2' },
    { label: 'Detractors', value: NPS_DATA.detractors, color: '#F2545B' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NPS score card */}
        <div className="bg-white rounded-lg border border-hs-border p-5 flex flex-col items-center">
          <p className="text-[56px] font-preview font-bold text-hs-green leading-none">
            {NPS_DATA.score}
          </p>
          <p className="text-[12px] font-preview text-hs-text-light mt-1">
            Net Promoter Score
          </p>
          <div className="mt-4">
            <DonutChart
              data={donutData}
              centerValue="62"
              centerLabel="NPS"
            />
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] font-preview text-hs-text-light">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-hs-green inline-block" />
              Promoters {NPS_DATA.promoters}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-hs-border inline-block" />
              Passives {NPS_DATA.passives}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-hs-red inline-block" />
              Detractors {NPS_DATA.detractors}%
            </span>
          </div>
        </div>

        {/* Recent responses */}
        <div className="bg-white rounded-lg border border-hs-border p-4">
          <h3 className="text-[13px] font-preview font-semibold text-hs-navy mb-3">
            Recent responses
          </h3>
          <div className="flex flex-col gap-2.5">
            {NPS_DATA.responses.map((r, i) => {
              const c = scoreColor(r.score)
              return (
                <div
                  key={r.company + i}
                  className="border border-hs-border rounded-md p-3 flex gap-3"
                >
                  <span
                    className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-[13px] font-preview font-bold ${BADGE_CLASS[c]}`}
                  >
                    {r.score}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-preview font-semibold text-hs-navy">
                      {r.company}
                    </p>
                    <p className="text-[11px] font-preview text-hs-text-dark italic">
                      “{r.comment}”
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="bg-hs-blue/10 border border-hs-blue/30 rounded-lg px-4 py-3">
        <p className="text-[12px] font-preview text-hs-text-dark">
          <span className="font-semibold text-hs-blue">Low scores alert the account owner instantly</span>{' '}
          — save the account before it churns.
        </p>
      </div>
    </div>
  )
}
