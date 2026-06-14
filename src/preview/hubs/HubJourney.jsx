import { useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import Spotlight from '../Spotlight'
import {
  integrationsForStep,
  searchIntegrations,
} from '../../constants/integrationsCatalog'
import { journeyEnabled } from '../../constants/journeyMilestones'
import { IconSearch, IconPlug, IconCheck, IconArrowRight } from '../hubIcons'

// The Customer Journey tab: a HORIZONTAL PHASE BOARD (Attract → Convert → Close →
// Deliver → Retain), each phase holding a few copy-only step cards. Click any card
// for a spotlight with the full story + the HubSpot tools + where your tools plug
// in. No per-card icons by design: clear copy reads faster than a pictogram.
// Step set consolidated to 14 (June 2026) on expert review for scannability.

const PHASE_ORDER = ['ATTRACT', 'CONVERT', 'CLOSE', 'DELIVER', 'RETAIN']

// One calm palette: navy phase labels + a single orange accent for active states.
const ACCENT = '#FF7A59'
const PHASE_COLORS = {
  ATTRACT: '#2D3E50',
  CONVERT: '#2D3E50',
  CLOSE: '#2D3E50',
  DELIVER: '#2D3E50',
  RETAIN: '#2D3E50',
}

// Plain-language sublabel under each phase chip, for first-time readers.
const PHASE_SUBLABELS = {
  ATTRACT: 'Get found',
  CONVERT: 'Capture & qualify',
  CLOSE: 'Win the deal',
  DELIVER: 'Do the work',
  RETAIN: 'Keep & grow',
}

// Department handoffs render at the boundary ENTERING each phase (keyed by the
// phase the handoff FOLLOWS). The baton passes automatically, nothing re-typed.
const BOUNDARY_HANDOFFS = {
  ATTRACT: [{ from: 'Marketing', to: 'Sales' }], // shows entering CONVERT
  CLOSE: [{ from: 'Sales', to: 'Operations' }], // shows entering DELIVER
  DELIVER: [{ from: 'Operations', to: 'Service' }], // shows entering RETAIN
}

const Chip = ({ children, accent }) => (
  <span
    className={`inline-block text-[10px] font-preview rounded-[3px] px-2 py-0.5 ${
      accent
        ? 'bg-hs-orange/10 text-hs-orange border border-hs-orange/30'
        : 'bg-hs-canvas border border-hs-border text-hs-text-dark'
    }`}
  >
    {children}
  </span>
)

export default function HubJourney() {
  const session = useStore((s) => s.session)
  const [open, setOpen] = useState(null) // { id, rect } of the spotlighted card
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState([])
  const cardRefs = useRef({})

  const openStepFrom = (id, rect) => {
    const r =
      rect ||
      cardRefs.current[id]?.getBoundingClientRect() || {
        left: window.innerWidth / 2 - 80,
        top: window.innerHeight / 2 - 40,
        width: 160,
        height: 80,
      }
    setOpen({ id, rect: r })
  }

  const stages = session.deals?.pipelineStages?.map((s) => s.label) || []
  const stageStr = stages.length ? stages.join(' → ') : 'Prospecting → Qualified → Proposal → Won'
  const accounting =
    session.wizard?.accounting &&
    !['None', 'Something else', 'Spreadsheets / manual'].includes(session.wizard.accounting)
      ? session.wizard.accounting
      : 'your accounting software'

  const STEPS = [
    // ---------------- ATTRACT ----------------
    {
      id: 'find_online',
      phase: 'ATTRACT',
      title: 'They find you through search, ads, and your content',
      summary:
        'However a stranger discovers you, Google, an ad, or a LinkedIn post, the visit is tracked from the first click.',
      detail:
        'Your SEO pages, paid ads, and social posts all run from one place and feed the same CRM. Every visitor is tracked from the first click, so you know what brought them in before you ever talk. Ad reporting goes past clicks to real cost-per-lead and closed revenue per campaign, so you finally know which spend works.',
      tools: ['Website tracking', 'Ads management', 'Social publishing', 'Source attribution'],
    },
    {
      id: 'outreach',
      phase: 'ATTRACT',
      title: 'Outreach runs in the background while you sell',
      summary:
        'Cold and warm outreach work themselves: sequences to new targets and to the past clients you already have.',
      detail:
        'Build a target list and the sequence sends emails, queues call tasks, and prompts LinkedIn touches on schedule. The same engine works your back book: past clients you have not touched in months and referral partners due for a check-in. Opens, clicks, and replies all log, and a reply pauses the sequence and pings the rep.',
      tools: ['Sales sequences', 'Segments & lists', 'Breeze prospecting', 'Reply tracking'],
    },
    {
      id: 'inbound',
      phase: 'ATTRACT',
      title: 'However they reach you, it all lands in one place',
      summary:
        'Calls, emails, and form fills become the same contact record, with their source and history attached.',
      detail:
        'A form submission, an inbound call, a direct email: they all create or update one contact record with everything the person shared and where they came from. Nothing lives only in someone inbox or on a sticky note. The prospect gets an instant acknowledgment so they know you saw them.',
      tools: ['Forms', 'Call tracking', 'Shared inbox', 'Contact record'],
    },

    // ---------------- CONVERT ----------------
    {
      id: 'route',
      phase: 'CONVERT',
      title: 'Every lead routes to the right rep in seconds',
      summary:
        'The owner is assigned automatically and the rep is notified on their phone, with a call task ready.',
      detail:
        'Routing rules assign by territory or round-robin, with the full lead details in the notification. Speed-to-lead wins deals: the company that calls back first usually gets the job.',
      tools: ['Lead routing', 'Mobile notifications', 'Tasks'],
    },
    {
      id: 'nurture',
      phase: 'CONVERT',
      title: 'Not ready to buy? They stay warm, and sales gets pinged when they heat up',
      summary:
        'A not-yet-ready lead drops into nurture. When their interest crosses the line, the rep gets the hot hand-raise.',
      detail:
        'Useful marketing emails keep a "just looking" contact engaged instead of forgotten. Every open, click, and pricing-page revisit quietly raises their score. When fit and interest cross your threshold, the lifecycle stage advances and the owner is notified with the full history. Marketing and sales stop arguing about lead quality, the data decides.',
      tools: ['Email nurture', 'Lead scoring', 'Lifecycle stages', 'Auto-notifications'],
    },
    {
      id: 'ai_prep',
      phase: 'CONVERT',
      title: 'AI preps your rep before the call',
      summary:
        'Breeze enriches the contact and company, then surfaces the right playbook, so the first call sounds like the fifth.',
      detail:
        'Company size, industry, and role fill in automatically. The rep opens a playbook with the questions to ask for this kind of lead, and AI call summaries write the notes back to the record afterward. Six months later anyone can pick up the relationship where it left off, even if the original rep is gone.',
      tools: ['Breeze Intelligence', 'Playbooks', 'AI call summaries'],
    },

    // ---------------- CLOSE ----------------
    {
      id: 'meeting',
      phase: 'CLOSE',
      title: 'Appointments book themselves',
      summary: 'A calendar link kills the back-and-forth, and the follow-up email already went out.',
      detail:
        'After the call, an automatic follow-up includes the rep booking link. The prospect picks a slot, it lands on the calendar, and the meeting logs to the record. Reschedules handle themselves.',
      tools: ['Meeting scheduler', 'Auto follow-up', 'Calendar sync'],
    },
    {
      id: 'stages',
      phase: 'CLOSE',
      title: 'Deals move through your stages on their own',
      summary: stageStr,
      detail:
        'Each stage transition fires its own automation: tasks for the rep, pings to the office so the proposal keeps moving, and alerts when a deal sits too long. Re-engagement sequences pick up the ones that stall.',
      tools: ['Stage automation', 'Internal pings', 'Stale-deal alerts'],
    },
    {
      id: 'quote',
      phase: 'CLOSE',
      title: 'Quote, sign, and deposit in one motion',
      summary:
        'The quote builds from the deal. They sign and pay through one link, and the follow-up chases itself.',
      detail:
        'Branded quotes build from deal data with e-signature and a payment link. If it goes quiet, the follow-up sequence runs. Documents from your other systems link right on the deal, so everything about this customer is one click away.',
      tools: ['Quotes (CPQ)', 'E-sign + payments', 'Quote follow-up'],
    },

    // ---------------- DELIVER ----------------
    {
      id: 'handoff',
      phase: 'DELIVER',
      title: 'Deal closes, operations picks it up automatically',
      summary: 'The delivery team is notified with full context, and the customer never repeats themselves.',
      detail:
        'The handoff workflow notifies ops, creates the onboarding checklist, and sends the customer a kickoff email, the same way every time no matter who closed it. Everything sales learned travels with the record.',
      tools: ['Handoff workflows', 'Onboarding tasks', 'Internal notifications'],
    },
    {
      id: 'fulfill',
      phase: 'DELIVER',
      title: 'Fulfillment and invoicing run off the same record',
      summary: `Projects sync to your work tools and invoices sync to ${accounting}, with nothing re-typed.`,
      detail:
        'The deal becomes a project in your project tool and an invoice in your accounting software, automatically. Payment status shows back on the deal record, so anyone can answer "did they pay?" without calling bookkeeping.',
      tools: ['Project sync', `${accounting} sync`, 'Payment visibility'],
    },

    // ---------------- RETAIN ----------------
    {
      id: 'support',
      phase: 'RETAIN',
      title: 'When something breaks, service sees it right away',
      summary: 'Tickets carry owners and SLAs, with the full sales history right there.',
      detail:
        'Support requests become tickets with priorities and escalation rules. Because service sees the whole relationship, the deals, the notes, the promises made, the customer never has to explain who they are.',
      tools: ['Help desk', 'SLA escalation', 'Knowledge base'],
    },
    {
      id: 'feedback',
      phase: 'RETAIN',
      title: 'A quick text and email ask how it went',
      summary: 'Happy customers get pointed to a review. Unhappy ones alert you before they churn.',
      detail:
        'NPS and CSAT surveys go out by text and email after delivery. High scores trigger a review request while the goodwill is fresh; low scores alert the account owner immediately. You hear it from HubSpot, not from a lost renewal.',
      tools: ['NPS / CSAT surveys', 'SMS', 'Review requests', 'Low-score alerts'],
    },
    {
      id: 'retain',
      phase: 'RETAIN',
      title: 'Repeat business and win-backs run on their own',
      summary: 'Renewals trigger early and lapsed customers get win-back sequences, so lifetime value climbs.',
      detail:
        'Renewal dates create deals and alerts 60 days out. Quiet customers drop into re-engagement sequences, and past clients stay on lists that actually get emailed. Delighted customers refer the next ones.',
      tools: ['Renewal alerts', 'Win-back sequences', 'Segments', 'LTV reporting'],
    },
  ]

  // Only the milestones this business actually uses (config step + discovery defaults).
  const visibleSteps = STEPS.filter((s) => journeyEnabled(session, s.id))

  const results = searchIntegrations(query)
  // Picking a tool HIGHLIGHTS the steps it plugs into; it does not open a card.
  const pickIntegration = (integ) => {
    setHighlight(integ.journeySteps)
    setQuery(integ.name)
    setOpen(null)
  }

  const phases = PHASE_ORDER.map((phase) => ({
    phase,
    color: PHASE_COLORS[phase],
    steps: visibleSteps.filter((s) => s.phase === phase),
  })).filter((p) => p.steps.length > 0)

  const openStep = visibleSteps.find((s) => s.id === open?.id) || null
  const openIntegs = openStep ? integrationsForStep(openStep.id) : []

  return (
    <div className="h-full flex flex-col font-preview relative">
      {/* 1) Header + integration search */}
      <div className="shrink-0 bg-white border-b border-hs-border px-5 py-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-hs-navy text-[16px]">
              Every step a customer takes with you, in one place
            </h2>
            <p className="text-[12px] text-hs-text-light">
              This is the path a customer takes with you, start to finish. Click any step to see how
              HubSpot handles it. The plug icon shows where the tools you already use fit in, and you can
              search for them on the right.
            </p>
          </div>
          <div className="relative">
            <IconSearch
              width={14}
              height={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hs-text-light pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlight([])
              }}
              placeholder="Already use other tools? Search them…"
              className="hs-input w-72 pl-8 pr-3 py-1.5 text-[12px]"
            />
            {results.length > 0 && highlight.length === 0 && (
              <div className="absolute right-0 mt-1 w-72 bg-white border border-hs-border rounded-md shadow-lg z-30 overflow-hidden">
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
              <p className="absolute right-0 mt-1 text-[10px] text-hs-green whitespace-nowrap flex items-center gap-1">
                <IconCheck width={11} height={11} className="shrink-0" />
                Plugs in at {highlight.length} step{highlight.length === 1 ? '' : 's'}, highlighted below
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2) RevOps banner */}
      <div className="shrink-0 bg-white border-b border-hs-border px-5 py-2">
        <p className="text-[11px] text-hs-text-dark leading-snug">
          <span className="text-[10px] font-bold uppercase tracking-wide text-hs-orange">This is RevOps:</span>{' '}
          Your marketing, sales, billing, and service all run as one connected process, and every handoff
          between them happens on its own, with nothing re-typed. It is the kind of system a company would
          usually hire a full-time operations lead to run.
        </p>
      </div>

      {/* 3) THE BOARD — responsive phase grid. Department handoffs sit in the
          header of the phase they feed INTO, so the baton-pass reads on the seam. */}
      <div className="flex-1 min-h-0 overflow-y-auto hs-scroll bg-hs-canvas">
        <div
          className="grid gap-x-3 gap-y-5 px-4 py-4 items-start"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}
        >
          {phases.map((p, pi) => {
            const incoming = pi > 0 ? BOUNDARY_HANDOFFS[phases[pi - 1].phase] || [] : []
            return (
              <div key={p.phase} className="flex flex-col min-w-0">
                {/* Phase header: chip + inline incoming handoff(s), sublabel, rule */}
                <div className="mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-wide text-white rounded-[3px] px-2 py-0.5"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.phase}
                    </span>
                    {incoming.map((h) => (
                      <span
                        key={`${h.from}-${h.to}`}
                        className="inline-flex items-center gap-1 text-[9px] font-semibold font-preview bg-white border border-hs-orange/40 rounded-full px-1.5 py-0.5 text-hs-text-dark whitespace-nowrap shadow-sm"
                        title={`Automatic handoff: ${h.from} to ${h.to}. Nothing re-typed, nothing dropped.`}
                      >
                        {h.from}
                        <IconArrowRight width={9} height={9} className="text-hs-orange shrink-0" />
                        {h.to}
                      </span>
                    ))}
                  </div>
                  <span className="block mt-1 text-[11px] text-hs-text-light leading-tight">
                    {PHASE_SUBLABELS[p.phase]}
                  </span>
                  <span className="block mt-1.5 h-px w-full rounded-full bg-hs-border" />
                </div>

                {/* Stacked copy-only milestone cards */}
                <div className="flex flex-col gap-2">
                  {p.steps.map((step, si) => {
                    const isHighlighted = highlight.includes(step.id)
                    const isOpen = open?.id === step.id
                    const integs = integrationsForStep(step.id)
                    const isStart = pi === 0 && si === 0
                    return (
                      <div key={step.id}>
                        {isStart && (
                          <div className="mb-1">
                            <span
                              className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-white rounded-[3px] px-1.5 py-0.5"
                              style={{ backgroundColor: ACCENT }}
                            >
                              Start here
                              <IconArrowRight width={9} height={9} className="shrink-0" />
                            </span>
                          </div>
                        )}
                        <button
                          ref={(el) => (cardRefs.current[step.id] = el)}
                          onClick={(e) =>
                            isOpen
                              ? setOpen(null)
                              : openStepFrom(step.id, e.currentTarget.getBoundingClientRect())
                          }
                          className={`w-full text-left flex items-start gap-2 rounded-[4px] border px-2.5 py-2.5 transition-all ${
                            isHighlighted
                              ? 'ring-[3px] ring-hs-green ring-offset-1 shadow-md bg-hs-green/10 relative z-10'
                              : 'bg-white shadow-sm hover:shadow-md'
                          }`}
                          style={{
                            borderColor: isOpen ? ACCENT : isHighlighted ? '#00BDA5' : '#CBD6E2',
                          }}
                        >
                          <span className="flex-1 text-[12.5px] font-semibold text-hs-navy leading-snug">
                            {step.title}
                          </span>
                          {integs.length > 0 && (
                            <span
                              className="shrink-0 mt-0.5 inline-flex items-center gap-0.5 text-[9px] text-hs-text-light bg-hs-koala rounded-[3px] px-1.5 py-0.5"
                              title={`${integs.length} integrations plug in here`}
                            >
                              <IconPlug width={10} height={10} />
                              {integs.length}
                            </span>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4) DETAIL SPOTLIGHT — clicked card zooms to center with the full story. */}
      {openStep && (
        <Spotlight
          originRect={open.rect}
          accent={ACCENT}
          onClose={() => setOpen(null)}
        >
          <div className="px-6 py-5">
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wide text-white rounded-[3px] px-2 py-0.5"
              style={{ backgroundColor: PHASE_COLORS[openStep.phase] }}
            >
              {openStep.phase}
            </span>

            <h3 className="text-[18px] font-semibold text-hs-navy leading-snug mt-3">
              {openStep.title}
            </h3>

            {/* The hook, then the full story */}
            <p className="text-[13.5px] text-hs-text-dark mt-2.5 font-medium">{openStep.summary}</p>
            <p className="text-[13px] text-hs-text-dark leading-relaxed mt-2.5">{openStep.detail}</p>

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                HubSpot tools at this step
              </p>
              <div className="flex flex-wrap gap-1.5">
                {openStep.tools.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>

            {openIntegs.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-hs-text-light mb-1.5 flex items-center gap-1">
                  <IconPlug width={11} height={11} className="shrink-0" />
                  Plug in what you already use
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {openIntegs.map((g) => (
                    <Chip key={g.name} accent={highlight.length > 0 && query === g.name}>
                      {g.name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Spotlight>
      )}

      {/* 5) Payoff strip — the owner watching the machine. */}
      <div className="shrink-0 bg-white border-t border-hs-border px-5 py-2.5 text-center">
        <p className="text-[12.5px] font-semibold text-hs-navy">
          And you watch all of it on one live dashboard, updated as it happens.
        </p>
      </div>

      {/* 6) Footer — navy closer band */}
      <div className="shrink-0 bg-hs-navy px-5 py-2.5 text-center">
        <p className="text-[12px] text-white/90 leading-snug max-w-4xl mx-auto">
          These are the same customers and the same team you already have. Once every step is connected,
          the work stops falling through the cracks, and{' '}
          <span className="text-hs-sorbet font-semibold">
            the relationships you have already earned keep bringing you more business.
          </span>
        </p>
      </div>
    </div>
  )
}
