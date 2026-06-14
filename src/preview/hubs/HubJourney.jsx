import { useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import Spotlight from '../Spotlight'
import {
  integrationsForStep,
  searchIntegrations,
} from '../../constants/integrationsCatalog'
import { journeyEnabled } from '../../constants/journeyMilestones'
import { IconSearch, IconPlug, IconCheck, IconArrowRight } from '../hubIcons'

// The Sales Process tab: a horizontal board from the SELLER'S point of view
// (Generate → Qualify → Win → Deliver → Keep), each stage holding a few
// copy-only cards of what you and the CRM do. Click any card for the full story
// + the HubSpot tools + where your tools plug in. Team handoffs render on the
// seam entering each stage. Reframed from the buyer journey on expert review.

const PHASE_ORDER = ['GENERATE', 'QUALIFY', 'WIN', 'DELIVER', 'KEEP']

// One calm palette: navy stage labels + a single orange accent for active states.
const ACCENT = '#FF7A59'
const PHASE_COLORS = {
  GENERATE: '#2D3E50',
  QUALIFY: '#2D3E50',
  WIN: '#2D3E50',
  DELIVER: '#2D3E50',
  KEEP: '#2D3E50',
}

const PHASE_SUBLABELS = {
  GENERATE: 'Get found and reach out',
  QUALIFY: 'Capture, score, and route',
  WIN: 'Book, quote, and close',
  DELIVER: 'Sold work hands off clean',
  KEEP: 'Service, reviews, and repeat',
}

// Department handoffs render at the boundary ENTERING each stage (keyed by the
// stage the handoff FOLLOWS). The baton passes automatically, nothing re-typed.
const BOUNDARY_HANDOFFS = {
  GENERATE: [{ from: 'Marketing', to: 'Sales' }], // shows entering QUALIFY
  WIN: [{ from: 'Sales', to: 'Operations' }], // shows entering DELIVER
  DELIVER: [{ from: 'Operations', to: 'Service' }], // shows entering KEEP
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
    // ---------------- GENERATE ----------------
    {
      id: 'gen_find',
      phase: 'GENERATE',
      title: 'People find you through search, ads, and content',
      summary: 'Search, paid ads, and your posts all run from one place and feed the same CRM.',
      detail:
        'SEO pages, Google and Meta ads, and social posts publish from one calendar and track every visitor from the first click. Ad reporting goes past clicks to real cost-per-lead and closed revenue per campaign, so you finally know which spend works.',
      tools: ['Website tracking', 'Ads management', 'Social publishing', 'Source attribution'],
    },
    {
      id: 'gen_outreach',
      phase: 'GENERATE',
      title: 'Outreach runs in the background while you sell',
      summary: 'Sequences work new targets and your back book of past clients without you remembering to.',
      detail:
        'Build a list and the sequence sends emails, queues call tasks, and prompts LinkedIn touches on schedule. The same engine works past clients you have not touched in months and referral partners due for a check-in. A reply pauses the sequence and pings the rep.',
      tools: ['Sales sequences', 'Segments & lists', 'Breeze prospecting', 'Reply tracking'],
    },
    {
      id: 'gen_phone',
      phase: 'GENERATE',
      title: 'You call and text from one place, every touch logs itself',
      summary: 'Calls and texts go out from the CRM, on your office line or your cell, and write themselves to the record.',
      detail:
        'Click to call from the contact record, on your desk line or your phone, and the call logs and records on its own. Two-way texting threads on the same timeline. HubSpot calling is built in; texting is native where available, and we plug in Twilio or Kixie where it is not. No more guessing who you talked to and when.',
      tools: ['Phone / calling', 'Text / SMS', 'Auto call logging', 'Call recording'],
    },

    // ---------------- QUALIFY ----------------
    {
      id: 'capture',
      phase: 'QUALIFY',
      title: 'However they reach you, it all lands on one record',
      summary: 'A call, a text, an email, or a form: every channel threads onto one contact record.',
      detail:
        'Inbound calls, texts, emails, web chat, and form fills all create or update one contact with their full history attached. Nothing lives only in someone inbox or on a sticky note, and the prospect gets an instant acknowledgment so they know you saw them.',
      tools: ['Forms', 'Shared inbox', 'Call & text logging', 'Contact record'],
    },
    {
      id: 'route_score',
      phase: 'QUALIFY',
      title: 'Hot leads get scored and routed to a rep in seconds',
      summary: 'The system scores each lead and assigns the right rep automatically, so you call the hot ones first.',
      detail:
        'Fit and engagement add up to a score, and routing rules assign by territory or round-robin with the full lead details in the notification. The rep gets a hot lead with a call task ready, not a cold list. Speed-to-lead wins deals: the business that calls back first usually gets the job.',
      tools: ['Lead scoring', 'Lead routing', 'Mobile notifications', 'Tasks'],
    },
    {
      id: 'warm',
      phase: 'QUALIFY',
      title: 'Not ready yet? They stay warm, and you get pinged when they heat up',
      summary: 'A not-ready lead drops into nurture, and the rep gets the hand-raise the moment their interest crosses the line.',
      detail:
        'Useful emails and the occasional text keep a "just looking" contact engaged instead of forgotten. Every open, click, and pricing-page revisit raises their score. When they cross your threshold, the lifecycle stage advances and the owner is notified with the full history. Marketing and sales stop arguing about lead quality, the data decides.',
      tools: ['Email nurture', 'Lead scoring', 'Lifecycle stages', 'Auto-notifications'],
    },

    // ---------------- WIN ----------------
    {
      id: 'meeting',
      phase: 'WIN',
      title: 'Appointments book themselves, and a text cuts the no-shows',
      summary: 'A calendar link kills the back-and-forth, and an automatic text reminder keeps the slot.',
      detail:
        'After the call an automatic follow-up includes the rep booking link. The prospect picks a slot, it lands on the calendar, and the meeting logs to the record. A reminder text the day before cuts no-shows, and reschedules handle themselves.',
      tools: ['Meeting scheduler', 'Reminder SMS', 'Auto follow-up', 'Calendar sync'],
    },
    {
      id: 'ai_prep',
      phase: 'WIN',
      title: 'AI sums up the history before you pick up the phone',
      summary: 'Breeze enriches the contact and writes a summary of every touch, so the call sounds like the fifth, not the first.',
      detail:
        'Company size, industry, and role fill in automatically, and AI summarizes the whole timeline of calls, texts, and emails. The rep opens a playbook with the questions to ask for this kind of deal. Six months later anyone can pick it up where it left off, even if the original rep is gone.',
      tools: ['Breeze Intelligence', 'AI deal summaries', 'Playbooks'],
    },
    {
      id: 'stages',
      phase: 'WIN',
      title: 'Deals move across one board, with a nudge when they stall',
      summary: stageStr,
      detail:
        'Every open deal sits on one board you can read in a glance. Each stage transition fires its own automation: tasks for the rep, pings to the office so the proposal keeps moving, and alerts when a deal sits too long. Re-engagement sequences pick up the ones that stall.',
      tools: ['Deal pipeline', 'Stage automation', 'Stale-deal alerts', 'Internal pings'],
    },
    {
      id: 'quote',
      phase: 'WIN',
      title: 'Quote, sign, and deposit in one link',
      summary: 'The quote builds from the deal. They sign and pay the deposit through the same link, and the follow-up chases itself.',
      detail:
        'Branded quotes build from deal line items with e-signature and a payment link. They sign and pay the deposit in one motion, and if it goes quiet the follow-up sequence runs. Quoting lives right in the deal with the rep who owns it, no separate desk.',
      tools: ['Quotes (CPQ)', 'E-sign on quotes', 'Payments / deposit', 'Quote follow-up'],
    },

    // ---------------- DELIVER ----------------
    {
      id: 'handoff',
      phase: 'DELIVER',
      title: 'Closed won kicks off the work, nothing re-typed',
      summary: 'The moment a deal is won, operations gets the order off the same record, with the signed quote attached.',
      detail:
        'Closed Won fires a workflow that creates the project or onboarding record, notifies the team, and sends the customer a kickoff email, the same way every time no matter who closed it. The signed quote, line items, deposit status, and deal notes all carry over. Ops starts with the order, not a blank form.',
      tools: ['Handoff workflows', 'Onboarding tasks', 'Internal notifications'],
    },
    {
      id: 'team_record',
      phase: 'DELIVER',
      title: 'The team works off the same record you sold from',
      summary: 'Whoever delivers the work sees exactly what was sold and promised, so the customer never repeats themselves.',
      detail:
        'Projects sync to your work tools and the whole history travels with the record: what they bought, what was promised, who to call. HubSpot is not a full project or field-service system, so we connect it to the tool your team already uses and keep the data flowing both ways.',
      tools: ['Project sync', 'Two-way data sync', 'Shared record'],
    },
    {
      id: 'invoicing',
      phase: 'DELIVER',
      title: 'Invoicing and your books stay in sync',
      summary: `Invoices fire from the deal and sync to ${accounting}, so payment status shows on the record.`,
      detail: `The deal becomes an invoice and syncs to ${accounting}, with payment status back on the record so anyone can answer "did they pay?" without calling bookkeeping. HubSpot connects to your books, it does not replace them.`,
      tools: ['HubSpot Invoices', `${accounting} sync`, 'Payment visibility'],
    },

    // ---------------- KEEP ----------------
    {
      id: 'support',
      phase: 'KEEP',
      title: 'Support tickets land on the same customer record',
      summary: 'A problem becomes a ticket with an owner and an SLA, and service sees the whole sales history.',
      detail:
        'Support requests become tickets with priorities and escalation rules. Because service sees the whole relationship, the deals, the notes, the promises made, the customer never has to explain who they are.',
      tools: ['Help desk', 'SLA escalation', 'Knowledge base'],
    },
    {
      id: 'feedback',
      phase: 'KEEP',
      title: 'A text and email ask how it went, and happy clients get pointed to a review',
      summary: 'Surveys go out after the job; high scores ask for a Google review, low scores alert the owner before they churn.',
      detail:
        'NPS and CSAT surveys go out by text and email after delivery. High scores trigger a review request while the goodwill is fresh; low scores alert the account owner immediately. You hear it from HubSpot, not from a lost renewal or a one-star review.',
      tools: ['NPS / CSAT surveys', 'Review requests', 'Text / SMS', 'Low-score alerts'],
    },
    {
      id: 'retain',
      phase: 'KEEP',
      title: 'Win-backs and renewals fire on their own',
      summary: 'Renewal dates and quiet accounts trigger their own sequences, so lifetime value climbs without you tracking it.',
      detail:
        'Renewal dates create deals and alerts 60 days out. Quiet customers drop into re-engagement sequences, and past clients stay on lists that actually get emailed and texted. Delighted customers refer the next ones.',
      tools: ['Renewal alerts', 'Win-back sequences', 'Segments', 'LTV reporting'],
    },
  ]

  // Only the steps this business actually uses (config step + discovery defaults).
  const visibleSteps = STEPS.filter((s) => journeyEnabled(session, s.id))

  const results = searchIntegrations(query)
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
              Your sales process, end to end
            </h2>
            <p className="text-[12px] text-hs-text-light">
              This is how a deal moves through your business, from first touch to repeat customer.
              Click any step to see how HubSpot runs it. The plug icon shows where the tools you already
              use fit in, and you can search for them on the right.
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

      {/* 3) THE BOARD — responsive stage grid. Department handoffs sit in the
          header of the stage they feed INTO, so the baton-pass reads on the seam. */}
      <div className="flex-1 min-h-0 overflow-y-auto hs-scroll bg-hs-canvas">
        <div
          className="grid gap-x-3 gap-y-5 px-4 py-4 items-start"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}
        >
          {phases.map((p, pi) => {
            const incoming = pi > 0 ? BOUNDARY_HANDOFFS[phases[pi - 1].phase] || [] : []
            return (
              <div key={p.phase} className="flex flex-col min-w-0">
                {/* Stage header: chip + inline incoming handoff(s), sublabel, rule */}
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

                {/* Stacked copy-only step cards */}
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
        <Spotlight originRect={open.rect} accent={ACCENT} onClose={() => setOpen(null)}>
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

      {/* 5) Payoff strip — the owner watching the whole process run. */}
      <div className="shrink-0 bg-white border-t border-hs-border px-5 py-2.5 text-center">
        <p className="text-[12.5px] font-semibold text-hs-navy">
          And you watch the whole thing on one live dashboard, updated as it happens.
        </p>
      </div>

      {/* 6) Footer — navy closer band */}
      <div className="shrink-0 bg-hs-navy px-5 py-2.5 text-center">
        <p className="text-[12px] text-white/90 leading-snug max-w-4xl mx-auto">
          This is the same team and the same customers you already have. Once every step is connected,
          the work stops falling through the cracks, and{' '}
          <span className="text-hs-sorbet font-semibold">
            the relationships you have already earned keep bringing you more business.
          </span>
        </p>
      </div>
    </div>
  )
}
