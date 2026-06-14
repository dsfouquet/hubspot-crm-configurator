import { useStore } from '../store/useStore'
import { scopeOffers, OFFERS } from '../utils/offerScoper'
import DownloadPdfButton from '../components/DownloadPdfButton'
import Logo from '../components/Logo'

const BOOKING_URL =
  import.meta.env.VITE_BOOKING_URL ||
  'https://meetings-na2.hubspot.com/crescent/crm-demo-call'
const DIY_GUIDE_URL =
  import.meta.env.VITE_DIY_GUIDE_URL || 'https://www.crescentconnectla.com/free-crm'

function Check({ color = '#00BDA5' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// One offer card. `fit` = this is the prospect's best-fit offer (highlighted).
function OfferCard({ offer, items, fit, badge, reasonsTitle, reasons, footer }) {
  const shown = items.slice(0, 6)
  const extra = items.length - shown.length
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden border ${
        fit ? 'shadow-sm' : 'border-hs-border'
      }`}
      style={fit ? { borderColor: offer.color, borderWidth: 2 } : undefined}
    >
      <div className="px-5 py-3.5 flex items-start justify-between gap-3" style={{ background: `${offer.color}0F` }}>
        <div className="min-w-0">
          <h3 className="font-ui font-bold text-[15px]" style={{ color: offer.color }}>
            {offer.name}
          </h3>
          <p className="text-[12px] font-ui text-hs-text-dark mt-0.5">{offer.tagline}</p>
        </div>
        {badge && (
          <span
            className="shrink-0 text-[9px] font-ui font-bold uppercase tracking-wide text-white rounded px-2 py-1"
            style={{ background: offer.color }}
          >
            {badge}
          </span>
        )}
      </div>

      {reasons?.length > 0 && (
        <div className="px-5 pt-3.5">
          <p className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
            {reasonsTitle}
          </p>
          <ul className="space-y-1">
            {reasons.map((r) => (
              <li key={r} className="text-[12.5px] font-ui text-hs-text-dark flex gap-2">
                <span className="text-hs-orange shrink-0">›</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {shown.length > 0 && (
        <ul className="px-5 py-3.5 space-y-1.5">
          {shown.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] font-ui text-hs-text-dark">
              <Check color={offer.color} />
              <span>{item}</span>
            </li>
          ))}
          {extra > 0 && (
            <li className="text-[12px] font-ui text-hs-text-light pl-6">+ {extra} more in your plan</li>
          )}
        </ul>
      )}

      {footer && <div className="px-5 py-3 border-t border-hs-greatwhite">{footer}</div>}
    </div>
  )
}

// Customer-mode final step. Overview of what they picked, then ALL THREE offers
// with the best fit highlighted and the reasons spelled out — including why the
// Free Setup can't cover everything when the scope is bigger. Primary CTA still
// routes by qualification.
export default function StepCTA() {
  const session = useStore((s) => s.session)
  const goToStep = useStore((s) => s.goToStep)

  const offers = scopeOffers(session)
  const qualified = session.qualification?.qualified !== false
  const name = session.gate?.name?.split(' ')[0]
  const isMachine = offers.recommended === 'machine'

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
          Everything you previewed is real. Here's which Crescent Connect build fits the
          plan you just designed.
        </p>

        {/* Selection overview */}
        <div className="mt-5 rounded-lg bg-hs-navydeep px-4 py-3">
          <div className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-orange">
            What you designed
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

        {/* Three offers, best fit highlighted */}
        <div className="mt-7 space-y-3">
          <OfferCard
            offer={OFFERS.free}
            items={offers.free}
            fit={!isMachine}
            badge={!isMachine ? 'Your best fit' : undefined}
            reasonsTitle={isMachine ? 'Why the free setup won’t cover everything you need' : 'Why this fits you'}
            reasons={
              isMachine
                ? offers.freeBlockers
                : ['One workspace, one pipeline, and one dashboard, done for you in 7 days']
            }
            footer={
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <span className="text-[13px] font-ui text-hs-text-dark">
                  <span className="line-through text-hs-text-light">$5,000</span>{' '}
                  <span className="font-bold text-hs-navy">Free for qualified businesses</span>
                </span>
                <span className="text-[12px] font-ui font-semibold text-hs-red">4 per month, and that's the cap</span>
              </div>
            }
          />

          <OfferCard
            offer={OFFERS.machine}
            items={offers.machine.length ? offers.machine : ['Everything in the Free Setup, plus the full automation, reporting, and integration depth your plan calls for']}
            fit={isMachine}
            badge={isMachine ? 'Your best fit' : undefined}
            reasonsTitle="Why your plan needs this"
            reasons={isMachine ? offers.freeBlockers : undefined}
            footer={
              <span className="text-[12.5px] font-ui text-hs-text-dark">
                The full 30-day done-for-you build. We scope and price it together on the call.
              </span>
            }
          />

          <OfferCard
            offer={OFFERS.retainer}
            items={offers.retainer}
            footer={
              <span className="text-[12.5px] font-ui text-hs-text-dark">
                Optional after launch. We keep the pipeline moving so the system pays for itself.
              </span>
            }
          />
        </div>

        {/* Routed primary CTA */}
        <div className="mt-8 bg-white border border-hs-border rounded-lg px-5 py-6 text-center">
          {qualified ? (
            <>
              <h2 className="font-ui font-bold text-hs-navy text-xl">
                {isMachine ? 'Book your build call' : "Claim one of this month's free setups"}
              </h2>
              <p className="mt-1.5 text-[14px] font-ui text-hs-text-dark">
                15 minutes. We confirm scope, show you the plan, and map the fastest path to live.
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="hs-btn-primary mt-4 !px-8 !py-3 !text-[15px]">
                Book Your Free CRM Setup Call →
              </a>
              <div className="mt-3">
                <DownloadPdfButton variant="secondary" label="Download your build plan (PDF)" />
              </div>
            </>
          ) : (
            <>
              <h2 className="font-ui font-bold text-hs-navy text-xl">
                Your build plan is ready. Here's the fastest way to get it done.
              </h2>
              <p className="mt-1.5 text-[14px] font-ui text-hs-text-dark">
                The DIY CRM Build Guide walks you through this exact setup: videos, templates,
                and the same workflows you just previewed.
              </p>
              <a href={DIY_GUIDE_URL} target="_blank" rel="noreferrer" className="hs-btn-primary mt-4 !px-8 !py-3 !text-[15px]">
                Get the DIY CRM Build Guide →
              </a>
              <div className="mt-3">
                <DownloadPdfButton variant="secondary" label="Download your build plan (PDF)" />
              </div>
              <p className="mt-4 text-[12px] font-ui text-hs-text-light">
                Prefer it done for you?{' '}
                <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="hs-link">
                  Book time with Daniel
                </a>
              </p>
            </>
          )}
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
