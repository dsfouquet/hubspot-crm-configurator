import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { industryCopy } from '../industryCopy'
import {
  integrationsForStep,
  searchIntegrations,
} from '../../constants/integrationsCatalog'
import { journeyEnabled } from '../../constants/journeyMilestones'

// The Customer Journey tab, rebuilt as a HORIZONTAL PHASE BOARD: one column per
// phase (Attract → Convert → Close → Deliver → Retain), each holding compact
// title-only milestone cards. Click any card for a right-side detail drawer.
// Touchpoint descriptions informed by HubSpot-published product docs
// (flywheel, lifecycle stages, Breeze AI, Commerce Hub — June 2026).

const PHASE_ORDER = ['ATTRACT', 'CONVERT', 'CLOSE', 'DELIVER', 'RETAIN']

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

export default function HubJourney() {
  const session = useStore((s) => s.session)
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState([])

  const copy = industryCopy(session.wizard?.industry)
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
      id: 'cold_outreach',
      phase: 'ATTRACT',
      icon: '🧊',
      title: "Cold outreach runs while you're selling",
      summary: 'Targeted sequences of emails, calls, and LinkedIn touches — researched and personalized by AI.',
      detail:
        'Build a target list and enroll it in a sequence: emails send on schedule, call tasks queue up, LinkedIn touches get prompted. Breeze Prospecting Agent researches each company so the first line isn\'t generic. Opens, clicks, and replies all log — a reply pauses the sequence and pings the rep instantly.',
      tools: ['Sales sequences', 'Breeze Prospecting Agent', 'Call queues', 'Reply tracking'],
    },
    {
      id: 'warm_outreach',
      phase: 'ATTRACT',
      icon: '🔥',
      title: 'Warm outreach mines the relationships you already have',
      summary: 'Past clients, referrals, and dormant contacts — segmented lists that actually get worked.',
      detail:
        'Your back book is your cheapest lead source. Segments surface past clients you haven\'t touched in 6 months, referral partners due for a check-in, and dormant leads worth one more try. Personalized sequences and task queues turn "we should call our old customers" into something that actually happens every week.',
      tools: ['Segments & lists', 'Personalized sequences', 'Referral tracking', 'Task queues'],
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

  // Only the milestones this business actually uses (config step + discovery defaults).
  const visibleSteps = STEPS.filter((s) => journeyEnabled(session, s.id))

  const results = searchIntegrations(query)
  const pickIntegration = (integ) => {
    setHighlight(integ.journeySteps)
    setQuery(integ.name)
    const first = visibleSteps.find((s) => integ.journeySteps.includes(s.id))
    if (first) setOpen(first.id)
  }

  // Group visible steps into phase columns, preserving phase order.
  const phases = PHASE_ORDER.map((phase) => ({
    phase,
    color: PHASE_COLORS[phase],
    steps: visibleSteps.filter((s) => s.phase === phase),
  })).filter((p) => p.steps.length > 0)

  const openStep = visibleSteps.find((s) => s.id === open) || null
  const openIntegs = openStep ? integrationsForStep(openStep.id) : []

  return (
    <div className="h-full flex flex-col font-preview relative">
      {/* 1) Header + integration search */}
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
              <p className="absolute right-0 mt-1 text-[10px] text-hs-green whitespace-nowrap">
                ✓ Plugs in at {highlight.length} step{highlight.length === 1 ? '' : 's'} — highlighted below
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2) RevOps banner — single compact strip */}
      <div className="shrink-0 bg-white border-b border-hs-border px-5 py-2">
        <p className="text-[11px] text-hs-text-dark leading-snug">
          <span className="font-bold uppercase tracking-wide text-hs-orange">This is RevOps:</span>{' '}
          Marketing, sales, billing, and service as one continuous process — every handoff automatic,
          nothing re-typed. Companies pay a $250K/yr VP to run this; HubSpot runs it itself.
        </p>
      </div>

      {/* 3) THE BOARD — horizontal phase columns */}
      <div className="flex-1 min-h-0 overflow-x-auto hs-scroll bg-hs-canvas">
        <div className="h-full flex items-stretch gap-0 px-4 py-4">
          {phases.map((p, pi) => (
            <div key={p.phase} className="flex items-stretch">
              <div className="min-w-[200px] flex-1 flex flex-col">
                {/* Phase header chip + underline */}
                <div className="mb-2.5">
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-white rounded px-2 py-0.5"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.phase}
                  </span>
                  <span className="block mt-1.5 h-px w-full" style={{ backgroundColor: `${p.color}55` }} />
                </div>

                {/* Stacked compact milestone cards */}
                <div className="flex flex-col gap-2">
                  {p.steps.map((step) => {
                    const isHighlighted = highlight.includes(step.id)
                    const isOpen = open === step.id
                    const integs = integrationsForStep(step.id)
                    return (
                      <div key={step.id}>
                        {step.handoff && (
                          <div className="mb-1">
                            <span className="inline-block text-[9px] font-preview bg-white border border-hs-border rounded-full px-2 py-0.5 text-hs-text-dark">
                              {step.handoff.from} <span className="text-hs-orange">→</span> {step.handoff.to}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => setOpen(isOpen ? null : step.id)}
                          className={`w-full text-left flex items-center gap-2 bg-white rounded-md border px-2.5 py-2 transition-all hover:shadow-md ${
                            isHighlighted ? 'ring-2 ring-hs-green' : ''
                          }`}
                          style={{ borderColor: isOpen ? p.color : '#CBD6E2' }}
                        >
                          <span className="text-[15px] leading-none shrink-0">{step.icon}</span>
                          <span className="flex-1 text-[12px] font-semibold text-hs-navy leading-snug">
                            {step.title}
                          </span>
                          {integs.length > 0 && (
                            <span
                              className="shrink-0 text-[9px] text-hs-text-light bg-hs-canvas border border-hs-border rounded-full px-1.5 py-0.5"
                              title={`${integs.length} integrations plug in here`}
                            >
                              🔌 {integs.length}
                            </span>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Flow connector between phases */}
              {pi < phases.length - 1 && (
                <div className="flex items-center px-1.5 self-stretch">
                  <span className="text-hs-text-light text-[18px]">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4) DETAIL DRAWER — right-side overlay inside the journey area */}
      {openStep && (
        <>
          {/* Dimmed backdrop closes the drawer */}
          <button
            aria-label="Close detail"
            onClick={() => setOpen(null)}
            className="absolute inset-0 bg-hs-navy/20 z-30"
          />
          <div className="absolute right-0 top-0 bottom-0 w-[26rem] max-w-[85%] bg-white border-l border-hs-border shadow-xl z-40 flex flex-col">
            <div className="flex-1 overflow-y-auto hs-scroll px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-white rounded px-2 py-0.5"
                  style={{ backgroundColor: PHASE_COLORS[openStep.phase] }}
                >
                  {openStep.phase}
                </span>
                <button
                  onClick={() => setOpen(null)}
                  className="text-hs-text-light hover:text-hs-text-dark text-[20px] leading-none -mt-1"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center gap-2.5 mt-3">
                <span className="text-[22px] leading-none">{openStep.icon}</span>
                <h3 className="text-[15px] font-semibold text-hs-navy leading-snug">{openStep.title}</h3>
              </div>

              <p className="text-[12px] text-hs-text-dark mt-2 font-medium">{openStep.summary}</p>
              <p className="text-[12px] text-hs-text-dark leading-relaxed mt-2.5">{openStep.detail}</p>

              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                  HubSpot tools
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {openStep.tools.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>

              {openIntegs.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                    🔌 Plug in what you already use
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
          </div>
        </>
      )}

      {/* 5) Footer — navy LTV closer band */}
      <div className="shrink-0 bg-hs-navy px-5 py-2.5 text-center">
        <p className="text-[12px] text-white font-medium">
          Same customers. Same team. Every step connected —
          <span className="text-hs-orange"> and lifetime value climbing on its own.</span>
        </p>
      </div>
    </div>
  )
}
