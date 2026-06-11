import { useState } from 'react'
import { useStore } from '../../store/useStore'

// The Customer Journey tab: how marketing, sales, ops, billing, and service
// actually flow once HubSpot is involved — from the first Google search to
// reviews, renewals, and rising LTV. Clean vertical timeline from afar;
// every step expands for the "what HubSpot does behind this" detail.

const PHASE_COLORS = {
  ATTRACT: '#FF7A59',
  CONVERT: '#0091AE',
  CLOSE: '#6A78D1',
  DELIVER: '#00BDA5',
  RETAIN: '#F5C26B',
}

const Chip = ({ children }) => (
  <span className="inline-block text-[10px] font-preview bg-hs-canvas border border-hs-border text-hs-text-dark rounded-full px-2 py-0.5">
    {children}
  </span>
)

export default function HubJourney() {
  const session = useStore((s) => s.session)
  const [open, setOpen] = useState(null)

  const stages = session.deals?.pipelineStages?.map((s) => s.label) || []
  const stageStr = stages.length ? stages.join(' → ') : 'Prospecting → Qualified → Proposal → Won'
  const accounting =
    session.wizard?.accounting && !['None', 'Something else'].includes(session.wizard.accounting)
      ? session.wizard.accounting
      : 'your accounting software'

  const STEPS = [
    {
      id: 'search',
      phase: 'ATTRACT',
      icon: '🔍',
      title: 'A customer Googles what they need',
      summary: 'Your website and ads are built to get found — and every visit is tracked.',
      detail:
        'Whether they come from search, a referral, or an ad, the visit carries its source. From the very first click you know what marketing actually brought them in.',
      tools: ['Website tracking', 'Ads integration', 'Source attribution'],
    },
    {
      id: 'form',
      phase: 'ATTRACT',
      icon: '📝',
      title: 'They fill out your HubSpot form',
      summary: 'The form creates a contact instantly — no inbox, no spreadsheet, no waiting.',
      detail:
        'The submission becomes a contact record with everything they typed, their source, and the page they came from. They get an instant acknowledgment email so they know you saw them.',
      tools: ['Forms', 'Auto-acknowledgment', 'Contact record'],
    },
    {
      id: 'route',
      phase: 'CONVERT',
      icon: '⚡',
      title: 'The lead routes to a salesperson in seconds',
      summary: 'Owner assigned automatically, rep notified, call task created. Speed-to-lead wins deals.',
      detail:
        'Routing rules assign the right rep by territory or round-robin. The rep gets a notification on desktop and phone with the full form details, plus a task to call now — because the company that calls back first usually wins.',
      tools: ['Lead routing', 'Notifications', 'Tasks'],
    },
    {
      id: 'ai_prep',
      phase: 'CONVERT',
      icon: '🤖',
      title: 'AI preps the rep before the call',
      summary: 'HubSpot AI researches the contact and company, then pulls up the right playbook.',
      detail:
        'Company size, industry, and role get enriched onto the record automatically. The rep opens a playbook card with the questions to ask and the talk track for this type of lead — so the first call sounds like the fifth.',
      tools: ['Breeze AI enrichment', 'Playbooks', 'Record summaries'],
    },
    {
      id: 'nurture',
      phase: 'CONVERT',
      icon: '📧',
      title: 'Not ready yet? Nurture takes over',
      summary: 'General inquiries get marketing emails. Engagement raises their lead score automatically.',
      detail:
        'If they just hit "contact us" and go quiet, they drop into a nurture sequence. Every open and click bumps their lead score; when it crosses the threshold, they flip to a sales-qualified lead and the rep gets pinged. Nobody is chasing cold leads, and nobody misses a warm one.',
      tools: ['Email nurture', 'Lead scoring', 'MQL → SQL workflow'],
    },
    {
      id: 'meeting',
      phase: 'CLOSE',
      icon: '📅',
      title: 'Call happens, meeting books itself, deal created',
      summary: 'Follow-up email sends automatically; the scheduler kills the back-and-forth.',
      detail:
        'After the call, a follow-up email goes out and the prospect books the next meeting from a calendar link. The opportunity becomes a deal in your pipeline with every conversation already logged on it.',
      tools: ['Meeting scheduler', 'Auto follow-up', 'Deal record'],
    },
    {
      id: 'stages',
      phase: 'CLOSE',
      icon: '📊',
      title: 'The deal moves through your stages',
      summary: stageStr,
      detail:
        'Each stage transition fires its own automation: tasks for the rep, pings to the office so proposals keep moving, alerts if a deal sits too long. Nothing depends on someone remembering.',
      tools: ['Stage automation', 'Internal notifications', 'Stale-deal alerts'],
    },
    {
      id: 'quote',
      phase: 'CLOSE',
      icon: '🧾',
      title: 'Quote sent straight from the deal',
      summary: 'Branded quote, e-signature, deposit link — and the follow-up sequence starts itself.',
      detail:
        'The quote generates from the deal record and the prospect can sign and pay a deposit in one link. If it goes quiet, the follow-up sequence chases it automatically. Links to documents in your external systems live right on the deal, so everything about this customer is one click away.',
      tools: ['Quotes', 'E-sign + payments', 'Quote follow-up sequence', 'External doc links'],
    },
    {
      id: 'handoff',
      phase: 'DELIVER',
      icon: '🤝',
      title: 'Closed won — fulfillment kicks off the same way every time',
      summary: 'Ops and service get notified, onboarding tasks create themselves, invoicing syncs.',
      detail:
        `The moment a deal closes, the handoff workflow notifies the delivery team, builds the onboarding checklist, and sends the customer a kickoff email. The deal syncs to ${accounting} so invoicing starts without re-typing anything.`,
      tools: ['Handoff workflow', 'Onboarding tasks', `${accounting} sync`],
    },
    {
      id: 'feedback',
      phase: 'RETAIN',
      icon: '⭐',
      title: 'SMS + email ask how it went',
      summary: 'Happy customers get pointed to reviews. Unhappy ones alert you before they churn.',
      detail:
        'A satisfaction survey goes out by text and email after delivery. High scores trigger a Google review request while the goodwill is fresh. Low scores alert the account owner immediately — you hear it from HubSpot, not from a lost renewal.',
      tools: ['SMS + email surveys', 'Review requests', 'Low-score alerts'],
    },
    {
      id: 'retain',
      phase: 'RETAIN',
      icon: '🔁',
      title: 'Retention and re-engagement run on autopilot',
      summary: 'Renewals trigger early, lapsed customers get win-back sequences — LTV climbs.',
      detail:
        'Renewal dates create deals and alerts 60 days out. Customers who go quiet drop into re-engagement sequences. Past clients stay on segmented lists that actually get emailed. The same customer is worth more every year, without anyone keeping a spreadsheet of who to call.',
      tools: ['Renewal alerts', 'Re-engagement sequences', 'Segments', 'LTV reporting'],
    },
  ]

  let lastPhase = null

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-hs-border px-5 py-3">
        <h2 className="font-semibold text-hs-navy text-[16px]">Your customer journey, with HubSpot in it</h2>
        <p className="text-[12px] text-hs-text-light">
          From the first Google search to reviews and renewals — click any step for the detail.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto hs-scroll bg-hs-canvas">
        <div className="max-w-2xl mx-auto px-6 py-6">
          {STEPS.map((step, i) => {
            const color = PHASE_COLORS[step.phase]
            const isOpen = open === step.id
            const showPhase = step.phase !== lastPhase
            lastPhase = step.phase
            const isLast = i === STEPS.length - 1

            return (
              <div key={step.id}>
                {showPhase && (
                  <div className={`flex items-center gap-2 ${i === 0 ? '' : 'mt-5'} mb-2.5`}>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.15em] text-white rounded px-2 py-0.5"
                      style={{ backgroundColor: color }}
                    >
                      {step.phase}
                    </span>
                    <span className="flex-1 h-px" style={{ backgroundColor: `${color}40` }} />
                  </div>
                )}

                <div className="flex gap-3">
                  {/* Timeline rail */}
                  <div className="flex flex-col items-center shrink-0 w-10">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[17px] bg-white shadow-sm"
                      style={{ border: `2px solid ${color}` }}
                    >
                      {step.icon}
                    </span>
                    {!isLast && (
                      <span className="w-0.5 flex-1 my-1" style={{ backgroundColor: '#CBD6E2' }} />
                    )}
                  </div>

                  {/* Card */}
                  <button
                    onClick={() => setOpen(isOpen ? null : step.id)}
                    className={`flex-1 text-left bg-white rounded-lg border mb-3 transition-all ${
                      isOpen ? 'shadow-md' : 'hover:shadow-sm'
                    }`}
                    style={{ borderColor: isOpen ? color : '#CBD6E2' }}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-semibold text-hs-navy leading-snug">
                          {step.title}
                        </h3>
                        <span
                          className={`text-hs-text-light text-[12px] shrink-0 mt-0.5 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          ▾
                        </span>
                      </div>
                      <p className="text-[12px] text-hs-text-dark mt-0.5">{step.summary}</p>
                    </div>

                    {isOpen && (
                      <div className="px-4 pb-3.5 border-t border-hs-canvas pt-3">
                        <p className="text-[12px] text-hs-text-dark leading-relaxed">{step.detail}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {step.tools.map((t) => (
                            <Chip key={t}>{t}</Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )
          })}

          {/* LTV closer */}
          <div className="ml-13 mt-1 mb-4 rounded-lg bg-hs-navy px-5 py-4 text-center">
            <p className="text-[13px] text-white font-medium">
              Same customers. Same team. Every step connected —
              <span className="text-hs-orange"> and lifetime value climbing on its own.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
