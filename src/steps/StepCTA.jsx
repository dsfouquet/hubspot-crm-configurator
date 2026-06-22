import { useStore } from '../store/useStore'
import { scopeOffers, OFFERS } from '../utils/offerScoper'
import DownloadPdfButton from '../components/DownloadPdfButton'
import Logo from '../components/Logo'

const BOOKING_URL =
  import.meta.env.VITE_BOOKING_URL ||
  'https://meetings-na2.hubspot.com/crescent/crm-demo-call'
const DIY_GUIDE_URL =
  import.meta.env.VITE_DIY_GUIDE_URL || 'https://www.crescentconnectla.com/free-crm'

// Bucket the flat scope items into a few scannable categories (Option A:
// outcome-first, grouped scope) so the best-fit card reads in seconds instead
// of as one long list. Order matters; first match wins, leftovers go last.
const SCOPE_GROUPS = [
  { label: 'Foundation', match: /pipeline|propert|import|de-?dup|object|connected|form|workspace|chatbot/i },
  { label: 'Automation & follow-up', match: /automation|workflow|branch|sequence|follow-?up|routing|scoring|handoff|nurture|cadence|playbook/i },
  { label: 'Reporting', match: /dashboard|report|attribution|widget|survey|nps|csat/i },
  { label: 'Integrations', match: /integration|sync|slack|teams|zapier|accounting|\bad\b|proposal|e-sign|calling|sms|database|payment|bridge/i },
  { label: 'Enablement', match: /template|snippet|scheduler|training|\bai\b|knowledge base|newsletter|outreach email|cold outreach/i },
]
function categorize(items) {
  const groups = SCOPE_GROUPS.map((g) => ({ label: g.label, items: [] }))
  const other = []
  items.forEach((it) => {
    const idx = SCOPE_GROUPS.findIndex((g) => g.match.test(it))
    if (idx >= 0) groups[idx].items.push(it)
    else other.push(it)
  })
  if (other.length) groups.push({ label: 'Also included', items: other })
  return groups.filter((g) => g.items.length)
}

function Check({ color = '#00BDA5' }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function Shield() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

// The highlighted best-fit offer: outcome + grouped scope + guarantee.
function BestFitCard({ offer, groups, guarantee, blockers }) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden border shadow-sm"
      style={{ borderColor: offer.color, borderWidth: 2 }}
    >
      <div className="px-5 py-4 flex items-start justify-between gap-3" style={{ background: `${offer.color}0F` }}>
        <div className="min-w-0">
          <h3 className="font-ui font-bold text-[16px]" style={{ color: offer.color }}>
            {offer.name}
          </h3>
          <p className="text-[12.5px] font-ui text-hs-text-dark mt-0.5">{offer.tagline}</p>
        </div>
        <span
          className="shrink-0 text-[10px] font-ui font-bold uppercase tracking-wide text-white rounded px-2 py-1"
          style={{ background: offer.color }}
        >
          Your best fit
        </span>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                {g.label}
              </p>
              <ul className="space-y-1">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] font-ui text-hs-text-dark">
                    <Check color={offer.color} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {blockers?.length > 0 && (
          <div className="mt-4 rounded-md bg-hs-canvas border border-hs-border px-3 py-2.5">
            <p className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-1">
              Why the Free Setup can't cover all of this
            </p>
            <ul className="space-y-0.5">
              {blockers.map((b) => (
                <li key={b} className="text-[12px] font-ui text-hs-text-light flex gap-1.5">
                  <span className="text-hs-orange shrink-0">›</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-hs-greatwhite flex items-center gap-2 text-hs-green">
        <Shield />
        <span className="text-[12.5px] font-ui text-hs-text-dark">{guarantee}</span>
      </div>
    </div>
  )
}

// Compact secondary offer (the rest of the ladder).
function MiniOffer({ offer, summary }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: offer.color }} />
        <h4 className="font-ui font-semibold text-[13.5px] text-hs-navy">{offer.name}</h4>
      </div>
      <p className="text-[12px] font-ui text-hs-text-light mt-1 leading-snug">{summary}</p>
    </div>
  )
}

// Customer-mode final step (Option A): one highlighted best-fit offer with its
// scope grouped and a guarantee, the rest of the ladder as compact cards, and a
// single routed CTA (book the call if qualified, DIY guide if not).
export default function StepCTA() {
  const session = useStore((s) => s.session)
  const goToStep = useStore((s) => s.goToStep)

  const offers = scopeOffers(session)
  const name = session.gate?.name?.split(' ')[0]
  const isMachine = offers.recommended === 'machine'
  const isDiy = offers.recommended === 'diy'

  const w = session.wizard || {}
  const stages = session.deals?.pipelineStages || []
  const workflowCount = (session.workflows || []).length
  const widgetCount = (session.dashboards?.widgets || []).length
  const customObj = (session.customObjects || [])[0]
  const topLeak = (session.fixPlan?.problems || []).find((p) => p.isTop) || (session.fixPlan?.problems || [])[0]

  const recap = [
    w.industry,
    `${stages.length}-stage pipeline`,
    `${workflowCount} automations`,
    `${widgetCount}-report dashboard`,
    ...(customObj ? [`"${customObj.plural || customObj.singular}" tracker`] : []),
  ].filter(Boolean)

  // Best-fit card: the Machine shows the WHOLE build (free foundation + extras);
  // the Free shows its 7-day scope; the DIY shows the self-serve kit. Grouped.
  const bestOffer = isDiy ? OFFERS.diy : isMachine ? OFFERS.machine : OFFERS.free
  const bestItems = isDiy ? offers.diy : isMachine ? [...offers.free, ...offers.machine] : offers.free
  const groups = categorize(bestItems)
  const guarantee = isDiy
    ? 'Follow it step by step, and your $497 credits toward a done-for-you build later.'
    : isMachine
      ? 'Every deliverable shipped by day 30, or we work free until it is.'
      : 'Done for you in 7 days, free for qualified Louisiana businesses.'

  // The other two rungs of the ladder, shown compact.
  const secondary = isDiy
    ? [
        { offer: OFFERS.free, summary: 'When you grow into it: a done-for-you 7-day setup, free for qualifying Louisiana businesses.' },
        { offer: OFFERS.machine, summary: 'The full build when you are ready: every hub automated, integrated, and dashboarded in 30 days.' },
      ]
    : isMachine
      ? [
          { offer: OFFERS.free, summary: 'The 7-day starter: one pipeline, one automation, one dashboard. Free for qualified businesses.' },
          { offer: OFFERS.retainer, summary: 'After launch we run the outreach and keep the pipeline moving. Optional, monthly.' },
        ]
      : [
          { offer: OFFERS.machine, summary: 'When you outgrow the starter: every hub automated, integrated, and dashboarded in 30 days.' },
          { offer: OFFERS.retainer, summary: 'After launch we run the outreach and keep the pipeline moving. Optional, monthly.' },
        ]

  return (
    <div className="flex-1 w-full h-full overflow-y-auto hs-scroll bg-hs-canvas">
      <div className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <span className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
            Step 4 of 4 · Next steps
          </span>
        </div>

        <h1 className="mt-6 font-ui font-bold text-hs-navy text-2xl sm:text-3xl leading-tight">
          {name ? `${name}, here's` : "Here's"} how we get this built for you.
        </h1>
        <p className="mt-2 text-[15px] font-ui text-hs-text-dark">
          Everything you previewed is real. Here's the Crescent Connect build we put together
          based on the answers you gave us.
        </p>

        {/* Selection overview */}
        <div className="mt-5 rounded-lg bg-hs-navydeep px-4 py-3">
          <div className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-orange">
            What we built for you
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {recap.map((r) => (
              <span key={r} className="text-[12px] font-ui font-medium text-white bg-white/10 rounded px-2 py-1">
                {r}
              </span>
            ))}
          </div>
          {topLeak && (
            <p className="mt-2 text-[12.5px] font-ui text-white/80">
              Biggest leak to plug first: <span className="font-semibold text-white">{topLeak.title}</span>
            </p>
          )}
        </div>

        {/* Best-fit offer, grouped scope */}
        <div className="mt-6">
          <BestFitCard
            offer={bestOffer}
            groups={groups}
            guarantee={guarantee}
            blockers={isMachine ? offers.freeBlockers : []}
          />
        </div>

        {/* Primary CTA. For qualified prospects it's booking a call; for unqualified
            it's the self-serve DIY Guide, with a call as the small fallback. */}
        <div className="mt-6 bg-white border border-hs-border rounded-lg px-5 py-6 text-center">
          <h2 className="font-ui font-bold text-hs-navy text-xl">
            {isDiy
              ? 'Get your DIY CRM Build Guide'
              : isMachine
                ? 'Book your build call'
                : "Claim one of this month's free setups"}
          </h2>
          <p className="mt-1.5 text-[14px] font-ui text-hs-text-dark">
            {isDiy
              ? 'Everything we would build, in a step-by-step guide you can follow this weekend. Your $497 credits toward a done-for-you build when you are ready.'
              : '15 minutes. We confirm scope, show you the plan, and map the fastest path to live.'}
          </p>
          {isDiy ? (
            <a href={DIY_GUIDE_URL} target="_blank" rel="noreferrer" className="hs-btn-primary mt-4 !px-8 !py-3 !text-[15px]">
              Get the DIY CRM Build Guide →
            </a>
          ) : (
            <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="hs-btn-primary mt-4 !px-8 !py-3 !text-[15px]">
              Book Your Free CRM Setup Call →
            </a>
          )}
          <div className="mt-3">
            <DownloadPdfButton variant="secondary" label="Download your build plan (PDF)" />
          </div>
          <p className="mt-4 text-[12px] font-ui text-hs-text-light">
            {isDiy ? (
              <>
                Questions first?{' '}
                <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="hs-link">
                  Book a 15-minute call
                </a>
              </>
            ) : (
              <>
                Prefer to do it yourself?{' '}
                <a href={DIY_GUIDE_URL} target="_blank" rel="noreferrer" className="hs-link">
                  Get the DIY CRM Build Guide
                </a>
              </>
            )}
          </p>
        </div>

        {/* The rest of the ladder */}
        <div className="mt-7">
          <div className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-2">
            The rest of the ladder
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {secondary.map((s) => (
              <MiniOffer key={s.offer.key} offer={s.offer} summary={s.summary} />
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => goToStep(2)}
            className="text-[13px] font-ui text-hs-text-light hover:text-hs-navy underline"
          >
            ← Back to your HubSpot preview
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] font-ui text-hs-text-light">
          Crescent Connect LA. HubSpot implementation for Louisiana businesses.
        </p>
      </div>
    </div>
  )
}
