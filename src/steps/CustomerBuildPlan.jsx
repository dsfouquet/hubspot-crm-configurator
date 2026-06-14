import { useState } from 'react'
import { useStore } from '../store/useStore'
import { painParts } from '../constants/discoveryQuestions'

// Small inline icons for the "what's in the build" tiles.
const svg = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const TileIcons = {
  pipeline: (
    <svg {...svg}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="9" y2="18" /></svg>
  ),
  bolt: (
    <svg {...svg}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  chart: (
    <svg {...svg}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="3" y1="20" x2="21" y2="20" /></svg>
  ),
  database: (
    <svg {...svg}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>
  ),
  contacts: (
    <svg {...svg}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
  ),
}

// Customer-mode Step 2: a single-column, guided build plan. One idea per card:
// "you said X is leaking money → here's exactly what we build to plug it."
// No split panes, no diagrams, no offer matrix — that depth lives in the
// presenter flow. One clear next action: see it live.
export default function CustomerBuildPlan() {
  const session = useStore((s) => s.session)
  const goToStep = useStore((s) => s.goToStep)
  const markStepComplete = useStore((s) => s.markStepComplete)

  const fixPlan = session.fixPlan
  const problems = fixPlan?.problems || []
  const stages = session.deals?.pipelineStages || []
  const workflowCount = (session.workflows || []).length
  const customObj = (session.customObjects || [])[0]

  // Cards collapsed by default — the page opens clean and the detail is one tap away.
  const [openId, setOpenId] = useState(null)
  const expandedId = openId

  const next = () => {
    markStepComplete(1)
    goToStep(2)
  }

  if (problems.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto hs-scroll bg-hs-canvas">
        <div className="max-w-2xl mx-auto px-5 py-12 text-center">
          <h2 className="font-ui font-bold text-hs-navy text-2xl">
            Tell us where it hurts first
          </h2>
          <p className="mt-2 text-[14px] font-ui text-hs-text-dark">
            Answer the quick questions and we'll map your build plan automatically.
          </p>
          <button onClick={() => goToStep(0)} className="hs-btn-primary mt-5">
            ← Back to the questions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto hs-scroll bg-hs-canvas">
      <div className="max-w-2xl mx-auto px-5 py-8 sm:py-10">
        <div className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
          Step 2 of 4 · Your build plan
        </div>
        <h1 className="mt-1 font-ui font-bold text-hs-navy text-2xl sm:text-3xl leading-tight">
          Here's what we'll build for you in 7 days
        </h1>
        <p className="mt-2 text-[15px] font-ui text-hs-text-dark">
          From your answers, we found {problems.length} place{problems.length === 1 ? '' : 's'} revenue is
          slipping. Each one has a fix, and we build all of it into your CRM before you ever log in.
        </p>

        {/* Their #1 goal, front and center */}
        {fixPlan.topGoal && (
          <div className="mt-5 rounded-lg bg-hs-navydeep px-4 py-3">
            <div className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-orange">
              Your goal
            </div>
            <p className="text-[14px] font-ui text-white italic mt-0.5">
              "{fixPlan.topGoal}"
            </p>
          </div>
        )}

        {/* What's in the build — visual tiles (icon + count + what it is). Heading
            gives them context so the numbers aren't a guessing game. */}
        <div className="mt-6 mb-2 text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
          What we set up in your CRM
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { icon: TileIcons.pipeline, value: stages.length, label: 'pipeline stages, set up for your deals' },
            { icon: TileIcons.bolt, value: workflowCount, label: `${workflowCount === 1 ? 'automation' : 'automations'} doing the follow-up for you` },
            { icon: TileIcons.chart, value: 1, label: 'owner dashboard with your key numbers' },
            customObj
              ? { icon: TileIcons.database, value: 1, label: `${customObj.singular || customObj.plural} tracker, built just for your business` }
              : { icon: TileIcons.contacts, value: '✓', label: 'your contacts imported and organized' },
          ].map((t) => (
            <div
              key={t.label}
              className="bg-white border border-hs-border rounded-lg px-3 py-3 flex items-start gap-2.5"
            >
              <span className="shrink-0 w-8 h-8 rounded-md bg-hs-orange/10 text-hs-orange flex items-center justify-center">
                {t.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-ui font-bold text-hs-navy text-[18px] leading-none">
                  {t.value}
                </span>
                <span className="block text-[11px] font-ui text-hs-text-light leading-snug mt-1">
                  {t.label}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* One card per leak */}
        <div className="mt-7 space-y-3">
          {problems.map((p, i) => {
            const { pain } = painParts(p.id)
            const isOpen = expandedId === p.id
            return (
              <div
                key={p.id}
                className={`bg-white border rounded-lg overflow-hidden transition-shadow ${
                  isOpen ? 'border-hs-orange shadow-sm' : 'border-hs-border'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : p.id)}
                  className="w-full text-left px-4 py-3.5 flex items-center gap-3"
                  aria-expanded={isOpen}
                >
                  <span className="w-6 h-6 rounded-full bg-hs-orange/10 text-hs-orange text-[12px] font-ui font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-ui font-semibold text-hs-navy text-[15px] leading-snug">
                      {p.title}
                    </span>
                    <span className="block text-[12px] font-ui text-hs-text-light truncate">
                      You said: "{pain}"
                    </span>
                  </span>
                  {p.isTop && (
                    <span className="text-[9px] font-ui font-bold uppercase tracking-wide text-white bg-hs-red rounded px-1.5 py-0.5 shrink-0">
                      Biggest leak
                    </span>
                  )}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-hs-text-light shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-4 pb-4 border-t border-hs-greatwhite pt-3 transition-opacity duration-300 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <p className="text-[13.5px] font-ui text-hs-text-dark">
                        {p.narrative}
                      </p>
                      <div className="mt-3">
                        <div className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                          What Crescent Connect builds for you
                        </div>
                        <ul className="space-y-1">
                          {(p.ccBuild || []).map((item, j) => (
                            <li
                              key={j}
                              className="text-[13px] font-ui text-hs-text-dark flex gap-2"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className="text-hs-green shrink-0 mt-0.5"
                                aria-hidden
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* One clear next action */}
        <div className="mt-8 text-center">
          <button onClick={next} className="hs-btn-primary !px-8 !py-3 !text-[15px]">
            See it live in your HubSpot →
          </button>
          <div className="mt-3">
            <button
              onClick={() => goToStep(0)}
              className="text-[13px] font-ui text-hs-text-light hover:text-hs-navy underline"
            >
              ← Change my answers
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
