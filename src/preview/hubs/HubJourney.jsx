import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { industryCopy } from '../industryCopy'
import {
  integrationsForStep,
  searchIntegrations,
} from '../../constants/integrationsCatalog'

// The Customer Journey tab: every milestone from first touch to rising LTV,
// with HubSpot woven through and an integration node on each step showing what
// existing software plugs in. Clean from afar; click any step for detail.
// Touchpoint descriptions informed by HubSpot-published product docs
// (flywheel, lifecycle stages, Breeze AI, Commerce Hub — June 2026).

const PHASE_COLORS = {
  ATTRACT: '#FF7A59',
  CONVERT: '#0091AE',
  CLOSE: '#6A78D1',
  DELIVER: '#00BDA5',
  RETAIN: '#F5C26B',
}

const Chip = ({ children, accent }) => (
  <span
    className={`inline-block text-[10px] font-preview rounded-full px-2 py-0.5 ${
      accent
        ? 'bg-hs-orange/10 text-hs-orange border border-hs-orange/30'
        : 'bg-hs-canvas border border-hs-border text-hs-text-dark'
    }`}
  >
    {children}
  </span>
)

// Handoff banner between teams — the "seamless baton pass" moments.
function Handoff({ from, to }) {
  return (
    <div className="flex items-center gap-2 ml-12 mb-3">
      <span className="text-[10px] font-preview font-bold uppercase tracking-wide bg-white border border-hs-border rounded-full px-2.5 py-1 text-hs-text-dark">
        {from} <span className="text-hs-orange mx-0.5">→</span> {to}
      </span>
      <span className="text-[10px] font-preview text-hs-text-light">
        automatic handoff — nothing dropped, nothing re-typed
      </span>
    </div>
  )
}

export default function HubJourney() {
  const session = useStore((s) => s.session)
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState([])

  const copy = industryCopy(session.wizard?.industry)
  const stages = session.deals?.pipelineStages?.map((s) => s.label) || []
  const stageStr = stages.length ? stages.join(' → ') : 'Prospecting → Qualified → Proposal → Won'
  const accounting =
    session.wizard?.accounting && !['None', 'Something else'].includes(session.wizard.accounting)
      ? session.wizard.accounting
      : 'your accounting software'

  const STEPS = [
    // ---------------- ATTRACT ----------------
    {
      id: 'search',
      phase: 'ATTRACT',
      icon: '🔍',
      title: 'They search for what they need',
      summary: `Someone Googles ${copy.searchExample} — your site and content are built to get found.`,
      detail:
        'SEO-tuned pages and content bring in people already looking for what you sell. Every visit is tracked from the first click, so you know what brought them in before you ever talk.',
      tools: ['Website tracking', 'SEO / Content Hub', 'Source attribution'],
    },
    {
      id: 'ads',
      phase: 'ATTRACT',
      icon: '📢',
      title: 'Ads bring in the rest',
      summary: `Google, Facebook, and LinkedIn ads run from inside HubSpot — leads sync straight to the CRM.`,
      detail:
        `Someone clicks ${copy.adExample} and their info lands in HubSpot automatically — no exporting lead lists. Ad reporting goes past clicks to actual cost-per-lead and closed revenue per campaign, so you finally know which spend works.`,
      tools: ['Ads management', 'Lead ad sync', 'ROI reporting'],
    },
    {
      id: 'social',
      phase: 'ATTRACT',
      icon: '💬',
      title: 'They engage with your content and LinkedIn posts',
      summary: 'Likes, comments, and follows get tied back to real contacts — interest you can act on.',
      detail:
        'Social posts publish from one calendar, and engagement is monitored and connected to contact records. When a prospect keeps engaging with your posts, that signal feeds their lead score instead of disappearing into the feed.',
      tools: ['Social publishing', 'Engagement monitoring', 'Campaign tracking'],
    },
    {
      id: 'direct',
      phase: 'ATTRACT',
      icon: '📞',
      title: 'Or they just call or email you directly',
      summary: 'Inbound calls and emails log themselves — every conversation lands on the contact record.',
      detail:
        'Calls are tracked and recorded right in HubSpot — office lines and cell phones alike — while team email and live chat flow into one shared inbox. Whether they found you through a form or just picked up the phone, the record is the same; nothing lives only in one person\'s inbox.',
      tools: ['Call tracking', 'Office & cell phones', 'Shared inbox', 'Email logging'],
    },
    {
      id: 'form',
      phase: 'ATTRACT',
      icon: '📝',
      title: 'They fill out your form',
      summary: 'The form creates a contact instantly — with their source and page history attached.',
      detail:
        'The submission becomes a contact record with everything they typed plus where they came from. They get an instant acknowledgment so they know you saw them.',
      tools: ['Forms', 'Auto-acknowledgment', 'Contact record'],
    },

    // ---------------- CONVERT ----------------
    {
      id: 'route',
      phase: 'CONVERT',
      icon: '⚡',
      title: 'The lead routes to a salesperson in seconds',
      summary: 'Owner assigned automatically, rep notified on their phone, call task created.',
      detail:
        'Routing rules assign the right rep by territory or round-robin, with the full form details in the notification. Speed-to-lead wins deals — the company that calls back first usually gets the job.',
      tools: ['Lead routing', 'Mobile notifications', 'Tasks'],
    },
    {
      id: 'ai_prep',
      phase: 'CONVERT',
      icon: '🤖',
      title: 'AI preps the rep before the call',
      summary: 'Breeze AI enriches the contact and company, then pulls up the right playbook.',
      detail:
        'Company size, industry, and role fill in automatically from Breeze Intelligence. The rep opens a playbook card with the questions to ask for this type of lead — the first call sounds like the fifth.',
      tools: ['Breeze Intelligence', 'Playbooks', 'AI record summaries'],
    },
    {
      id: 'intel',
      phase: 'CONVERT',
      icon: '🗂',
      title: 'Every detail gets captured for later',
      summary: 'Call notes, kids\' names, budget timing, competitor mentions — saved on the record, not in someone\'s head.',
      detail:
        'AI call summaries and playbook answers write themselves to contact properties. Six months later, anyone on the team can pick up the relationship exactly where it left off — even if the original rep is gone.',
      tools: ['AI call summaries', 'Custom properties', 'Timeline history'],
    },
    {
      id: 'nurture',
      phase: 'CONVERT',
      icon: '📧',
      title: 'Not ready yet? Marketing keeps them warm',
      summary: 'They get useful marketing emails — every open and click quietly raises their lead score.',
      detail:
        'A "just looking" contact drops into a nurture sequence instead of a rep\'s memory. Reading your emails, revisiting pricing, downloading a guide — each action scores them higher while your team works the hot ones.',
      tools: ['Email nurture', 'Lead scoring', 'Engagement tracking'],
    },
    {
      id: 'score',
      phase: 'CONVERT',
      icon: '🎯',
      title: 'Score crosses the line — sales gets pinged',
      summary: 'MQL becomes SQL automatically. The rep gets a hot lead, not a cold list.',
      detail:
        'When fit + engagement cross your threshold, the lifecycle stage advances and the owner is notified with the full engagement history. Marketing and sales stop arguing about lead quality — the data decides.',
      tools: ['Lifecycle stages', 'Scoring thresholds', 'Auto-notifications'],
      handoff: { from: 'Marketing', to: 'Sales' },
    },

    {
      id: 'sales_nurture',
      phase: 'CONVERT',
      icon: '🤙',
      title: 'Sales nurtures the qualified lead — their way',
      summary: 'Calls, emails, drop-bys, lunches — every touch logs itself, and tasks queue the next one.',
      detail:
        'Once sales owns the lead, the relationship work starts: phone calls from the truck, personal emails, in-person visits. HubSpot logs each touch automatically and creates the next follow-up task, so a 3-month courtship never goes quiet by accident. Sales sequences handle the routine touches while the rep handles the human ones.',
      tools: ['Sales sequences', 'Call + visit logging', 'Follow-up task cadences', 'Mobile app'],
    },

    // ---------------- CLOSE ----------------
    {
      id: 'meeting',
      phase: 'CLOSE',
      icon: '📅',
      title: 'Appointments book themselves',
      summary: 'A calendar link kills the back-and-forth; the follow-up email already went out.',
      detail:
        'After the call, an automatic follow-up includes the rep\'s booking link. The prospect picks a slot, it lands on the calendar, and the meeting logs to the record. Reschedules handle themselves.',
      tools: ['Meeting scheduler', 'Auto follow-up', 'Calendar sync'],
    },
    {
      id: 'stages',
      phase: 'CLOSE',
      icon: '📊',
      title: 'The deal moves through your stages',
      summary: stageStr,
      detail:
        'Each stage transition fires its own automation: tasks for the rep, pings to the office so the proposal keeps moving, alerts when a deal sits too long. Re-engagement sequences pick up the ones that stall.',
      tools: ['Stage automation', 'Internal pings', 'Stale-deal alerts'],
    },
    {
      id: 'quote',
      phase: 'CLOSE',
      icon: '🧾',
      title: 'Quote, signature, deposit — one motion',
      summary: 'The quote generates from the deal; they sign and pay in one link. Follow-up chases itself.',
      detail:
        'Branded quotes build from deal data with e-signature and a payment link. If it goes quiet, the follow-up sequence runs. Documents in your other systems link right on the deal, so everything about this customer is one click away.',
      tools: ['Quotes (CPQ)', 'E-sign + payments', 'Quote follow-up sequence'],
      handoff: { from: 'Sales', to: 'Commerce' },
    },

    // ---------------- DELIVER ----------------
    {
      id: 'handoff',
      phase: 'DELIVER',
      icon: '🤝',
      title: 'Closed won — operations takes the baton',
      summary: 'The delivery team is notified with full context. The customer never repeats themselves.',
      detail:
        'The handoff workflow notifies ops/service, creates the onboarding checklist, and sends the customer a kickoff email — the same way every time, no matter who closed it. Everything sales learned travels with the record.',
      tools: ['Handoff workflows', 'Onboarding tasks', 'Internal notifications'],
      handoff: { from: 'Sales', to: 'Operations' },
    },
    {
      id: 'fulfill',
      phase: 'DELIVER',
      icon: '📦',
      title: 'Fulfillment and invoicing run connected',
      summary: `Projects sync to your work tools; invoices sync to ${accounting}. No re-typing anywhere.`,
      detail:
        'The deal becomes a project in your project tool and an invoice in your accounting software, automatically. Payment status shows back on the deal record, so anyone can answer "did they pay?" without calling bookkeeping.',
      tools: ['Project sync', `${accounting} sync`, 'Payment visibility'],
    },

    // ---------------- RETAIN ----------------
    {
      id: 'support',
      phase: 'RETAIN',
      icon: '🛟',
      title: 'When something breaks, service sees it instantly',
      summary: 'Tickets with owners and SLAs — and the full sales history right there.',
      detail:
        'Support requests become tickets with priorities and escalation rules. Because service sees the whole relationship — deals, notes, promises made — the customer never has to explain who they are.',
      tools: ['Help desk', 'SLA escalation', 'Knowledge base'],
      handoff: { from: 'Operations', to: 'Service' },
    },
    {
      id: 'feedback',
      phase: 'RETAIN',
      icon: '⭐',
      title: 'SMS + email ask how it went',
      summary: 'Happy customers get pointed to Google reviews. Unhappy ones alert you before they churn.',
      detail:
        'NPS/CSAT surveys go out by text and email after delivery. High scores trigger a review request while the goodwill is fresh; low scores alert the account owner immediately — you hear it from HubSpot, not from a lost renewal.',
      tools: ['NPS / CSAT surveys', 'SMS', 'Review requests', 'Low-score alerts'],
    },
    {
      id: 'retain',
      phase: 'RETAIN',
      icon: '🔁',
      title: 'Retention and re-engagement run on autopilot',
      summary: 'Renewals trigger early, lapsed customers get win-back sequences — LTV climbs.',
      detail:
        'Renewal dates create deals and alerts 60 days out. Quiet customers drop into re-engagement sequences; past clients stay on segmented lists that actually get emailed. Delighted customers refer the next ones — the flywheel spins itself.',
      tools: ['Renewal alerts', 'Win-back sequences', 'Segments', 'LTV reporting'],
    },
  ]

  const results = searchIntegrations(query)
  const pickIntegration = (integ) => {
    setHighlight(integ.journeySteps)
    setQuery(integ.name)
    const first = STEPS.find((s) => integ.journeySteps.includes(s.id))
    if (first) {
      setOpen(first.id)
      document.getElementById(`journey-${first.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  let lastPhase = null

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Header + integration search */}
      <div className="shrink-0 bg-white border-b border-hs-border px-5 py-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-hs-navy text-[16px]">
              Your customer journey, run as one revenue operation
            </h2>
            <p className="text-[12px] text-hs-text-light">
              First touch to rising LTV — click any step for detail. 🔌 shows what plugs in.
            </p>
          </div>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlight([])
              }}
              placeholder="🔌 Already use other tools? Search them…"
              className="w-72 rounded-md border border-hs-border px-3 py-1.5 text-[12px] focus:outline-none focus:border-hs-blue"
            />
            {results.length > 0 && highlight.length === 0 && (
              <div className="absolute right-0 mt-1 w-72 bg-white border border-hs-border rounded-md shadow-lg z-20 overflow-hidden">
                {results.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => pickIntegration(r)}
                    className="w-full text-left px-3 py-2 hover:bg-hs-canvas border-b border-hs-canvas last:border-0"
                  >
                    <span className="text-[12px] font-medium text-hs-navy">{r.name}</span>
                    <span className="block text-[10px] text-hs-text-light">{r.blurb}</span>
                  </button>
                ))}
              </div>
            )}
            {highlight.length > 0 && (
              <p className="absolute right-0 mt-1 text-[10px] text-hs-green whitespace-nowrap">
                ✓ Plugs in at {highlight.length} step{highlight.length === 1 ? '' : 's'} — highlighted below
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto hs-scroll bg-hs-canvas">
        <div className="max-w-2xl mx-auto px-6 py-6">
          {/* RevOps framing — why one system across every step matters */}
          <div className="mb-5 rounded-lg bg-white border border-hs-border p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-hs-orange mb-1">
              This is Revenue Operations (RevOps)
            </div>
            <p className="text-[12px] text-hs-text-dark leading-relaxed">
              Most businesses run marketing, sales, fulfillment, billing, and service as separate
              systems with people re-typing data in between — and revenue leaks at every seam.
              RevOps connects all of it on one platform, so a customer moves from first click to
              renewal as <span className="font-semibold text-hs-navy">one continuous process</span>:
              every team sees the same record, every handoff is automatic, and every step below
              feeds the next. Companies staff a VP of RevOps at $250K+/year to run this — HubSpot
              is how it runs itself.
            </p>
          </div>
          {STEPS.map((step, i) => {
            const color = PHASE_COLORS[step.phase]
            const isOpen = open === step.id
            const isHighlighted = highlight.includes(step.id)
            const showPhase = step.phase !== lastPhase
            lastPhase = step.phase
            const isLast = i === STEPS.length - 1
            const integs = integrationsForStep(step.id)

            return (
              <div key={step.id} id={`journey-${step.id}`}>
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

                {step.handoff && <Handoff from={step.handoff.from} to={step.handoff.to} />}

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
                    } ${isHighlighted ? 'ring-2 ring-hs-green' : ''}`}
                    style={{ borderColor: isOpen ? color : '#CBD6E2' }}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-semibold text-hs-navy leading-snug">
                          {step.title}
                        </h3>
                        <span className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {integs.length > 0 && (
                            <span
                              className="text-[9px] text-hs-text-light bg-hs-canvas border border-hs-border rounded-full px-1.5 py-0.5"
                              title={`${integs.length} integrations plug in here`}
                            >
                              🔌 {integs.length}
                            </span>
                          )}
                          <span
                            className={`text-hs-text-light text-[12px] transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          >
                            ▾
                          </span>
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
                        {integs.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-hs-text-light mb-1">
                              🔌 Plug in what you already use
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {integs.map((g) => (
                                <Chip key={g.name} accent={highlight.length > 0 && query === g.name}>
                                  {g.name}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )
          })}

          {/* LTV closer */}
          <div className="mt-1 mb-4 ml-13 rounded-lg bg-hs-navy px-5 py-4 text-center">
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
