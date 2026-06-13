import { useStore } from '../store/useStore'
import { scopeOffers } from '../utils/offerScoper'
import DownloadPdfButton from '../components/DownloadPdfButton'
import Logo from '../components/Logo'

const BOOKING_URL =
  import.meta.env.VITE_BOOKING_URL ||
  'https://meetings-na2.hubspot.com/crescent/crm-demo-call'
const DIY_GUIDE_URL =
  import.meta.env.VITE_DIY_GUIDE_URL || 'https://www.crescentconnectla.com/free-crm'

// Customer-mode final step. Hormozi sequence: recap (what we'll build) →
// value stack with retail anchor → real scarcity → routed CTA. The BANT verdict
// (session.qualification) routes the primary button — book a Free Setup call
// for qualified prospects, the DIY guide for everyone else. The verdict itself
// is never shown.
export default function StepCTA() {
  const session = useStore((s) => s.session)
  const goToStep = useStore((s) => s.goToStep)

  const offers = scopeOffers(session)
  const qualified = session.qualification?.qualified !== false // default to booking if unset
  const name = session.gate?.name?.split(' ')[0]

  const stages = session.deals?.pipelineStages || []
  const workflowCount = (session.workflows || []).length
  const widgetCount = (session.dashboards?.widgets || []).length
  const customObj = (session.customObjects || [])[0]

  const recap = [
    `${stages.length}-stage sales pipeline in your language`,
    `${workflowCount} automations working while you sleep`,
    `1 owner dashboard (${widgetCount} reports)`,
    ...(customObj ? [`Custom "${customObj.plural || customObj.singular}" tracker`] : []),
  ]

  return (
    <div className="h-full overflow-y-auto hs-scroll bg-hs-canvas">
      <div className="max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <span className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
            Step 4 of 4 · Next steps
          </span>
        </div>

        <h1 className="mt-6 font-ui font-bold text-hs-navy text-2xl sm:text-3xl leading-tight">
          {name ? `${name}, your` : 'Your'} CRM build plan is ready.
        </h1>
        <p className="mt-2 text-[15px] font-ui text-hs-text-dark">
          Everything you just previewed is real — and we build it for you. You don't
          touch a setting.
        </p>

        {/* Build recap */}
        <div className="mt-6 flex flex-wrap gap-2">
          {recap.map((r) => (
            <span
              key={r}
              className="text-[12.5px] font-ui font-medium text-hs-navy bg-white border border-hs-border rounded-full px-3 py-1.5"
            >
              {r}
            </span>
          ))}
        </div>

        {/* Value stack */}
        <div className="mt-8 bg-white border border-hs-border rounded-lg overflow-hidden">
          <div className="bg-hs-navydeep px-5 py-4">
            <h2 className="font-ui font-bold text-white text-lg">
              {qualified
                ? 'The Free CRM Setup — done for you in 7 days'
                : 'Your complete CRM build — everything in your plan'}
            </h2>
            <p className="text-[13px] font-ui text-white/70 mt-0.5">
              {qualified
                ? 'One call, one spreadsheet. We do the rest.'
                : 'Every piece below is mapped out and ready to build.'}
            </p>
          </div>
          <ul className="px-5 py-4 space-y-2">
            {offers.free.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] font-ui text-hs-text-dark">
                <span className="text-hs-green mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-hs-greatwhite flex items-baseline justify-between flex-wrap gap-2">
            {qualified ? (
              <>
                <span className="font-ui text-[14px] text-hs-text-dark">
                  Retail value:{' '}
                  <span className="line-through text-hs-text-light">$5,000</span>{' '}
                  <span className="font-bold text-hs-navy">Free for qualified businesses</span>
                </span>
                <span className="text-[12.5px] font-ui font-semibold text-hs-red">
                  4 setups per month — that's the cap
                </span>
              </>
            ) : (
              <span className="font-ui text-[14px] text-hs-text-dark">
                Done-for-you value:{' '}
                <span className="font-bold text-hs-navy">$5,000</span> — the DIY Guide
                walks you through the same build yourself.
              </span>
            )}
          </div>
        </div>

        {/* Routed CTA */}
        <div className="mt-8 bg-white border border-hs-border rounded-lg px-5 py-6 text-center">
          {qualified ? (
            <>
              <h2 className="font-ui font-bold text-hs-navy text-xl">
                Claim one of this month's setups
              </h2>
              <p className="mt-1.5 text-[14px] font-ui text-hs-text-dark">
                15-minute call. We confirm scope, you hand us a spreadsheet, and your
                CRM is live in 7 days.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="hs-btn-primary mt-4 !px-8 !py-3 !text-[15px]"
              >
                Book Your Free CRM Setup Call →
              </a>
              <div className="mt-3">
                <DownloadPdfButton variant="secondary" label="Download your build plan (PDF)" />
              </div>
            </>
          ) : (
            <>
              <h2 className="font-ui font-bold text-hs-navy text-xl">
                Your build plan is ready — here's the fastest way to get it done
              </h2>
              <p className="mt-1.5 text-[14px] font-ui text-hs-text-dark">
                The DIY CRM Build Guide walks you through this exact setup step by
                step — videos, templates, and the same workflows you just previewed.
              </p>
              <a
                href={DIY_GUIDE_URL}
                target="_blank"
                rel="noreferrer"
                className="hs-btn-primary mt-4 !px-8 !py-3 !text-[15px]"
              >
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
          Crescent Connect LA — HubSpot implementation for Louisiana businesses.
        </p>
      </div>
    </div>
  )
}
