import { useState } from 'react'
import { useStore } from '../store/useStore'
import { painParts } from '../constants/discoveryQuestions'

// Customer-mode Step 2: a single-column, guided build plan. One idea per card:
// "you said X is leaking money → here's exactly what we build to plug it."
// No split panes, no diagrams, no offer matrix — that depth lives in the
// presenter flow. One clear next action: see it live.
export default function CustomerBuildPlan() {
  const session = useStore((s) => s.session)
  const goToStep = useStore((s) => s.goToStep)
  const markStepComplete = useStore((s) => s.markStepComplete)
  const [openId, setOpenId] = useState(null)

  const fixPlan = session.fixPlan
  const problems = fixPlan?.problems || []
  const stages = session.deals?.pipelineStages || []
  const workflowCount = (session.workflows || []).length
  const customObj = (session.customObjects || [])[0]

  const expandedId = openId || problems[0]?.id

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
          We found {problems.length} revenue leak{problems.length === 1 ? '' : 's'} in
          your answers. Each one gets a fix, built into your CRM before you ever log in.
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

        {/* What's in the build — quick chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            `${stages.length}-stage pipeline in your language`,
            `${workflowCount} automations`,
            '1 owner dashboard',
            ...(customObj ? [`Custom "${customObj.plural || customObj.singular}" tracker`] : []),
            'Your contacts imported & de-duped',
          ].map((c) => (
            <span
              key={c}
              className="text-[12px] font-ui font-medium text-hs-navy bg-white border border-hs-border rounded-full px-3 py-1"
            >
              {c}
            </span>
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
                  onClick={() => setOpenId(isOpen ? `closed_${p.id}` : p.id)}
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
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-hs-greatwhite pt-3">
                    {p.implication && (
                      <p className="text-[13px] font-ui text-hs-red">
                        <span className="font-semibold">The real cost:</span> {p.implication}
                      </p>
                    )}
                    <p className="text-[13.5px] font-ui text-hs-text-dark mt-1.5">
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
                )}
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
