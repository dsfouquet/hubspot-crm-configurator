import { useStore } from '../store/useStore'
import { StepHeader, StepBody } from '../shared/StepLayout'
import { scopeOffers, OFFERS } from '../utils/offerScoper'

// One offer card in the scope-of-work ladder.
function OfferCard({ offer, items, recommended, footnote }) {
  if (items.length === 0) return null
  return (
    <div
      className={`rounded-lg border-2 overflow-hidden ${
        recommended ? 'border-hs-orange' : 'border-hs-border'
      }`}
    >
      <div className="px-3.5 py-2.5" style={{ backgroundColor: `${offer.color}12` }}>
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-ui font-bold text-[14px]" style={{ color: offer.color }}>
            {offer.name}
          </h4>
          {recommended && (
            <span className="text-[10px] font-ui font-bold uppercase tracking-wide text-white bg-hs-orange rounded px-1.5 py-0.5">
              Your starting point
            </span>
          )}
        </div>
        <p className="text-[12px] font-ui text-hs-text-dark mt-0.5">{offer.tagline}</p>
      </div>
      <div className="px-3.5 py-2.5 bg-white">
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-[12px] font-ui text-hs-text-dark flex gap-1.5">
              <span style={{ color: offer.color }} className="shrink-0">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        {footnote && (
          <p className="text-[11px] font-ui text-hs-text-light mt-2 italic">{footnote}</p>
        )}
      </div>
    </div>
  )
}

// Step 2: the Fix Plan. Problem-by-problem cards, each split into the HubSpot
// fix vs. what Crescent Connect builds — the "this is not out-of-the-box" layer.
export default function Step2_FixPlan({ index }) {
  const session = useStore((s) => s.session)
  const fixPlan = useStore((s) => s.session.fixPlan)
  const focusedProblemId = useStore((s) => s.focusedProblemId)
  const setFocusedProblem = useStore((s) => s.setFocusedProblem)
  const goToStep = useStore((s) => s.goToStep)

  if (!fixPlan || fixPlan.problems.length === 0) {
    return (
      <StepBody>
        <StepHeader
          index={index}
          intro="Your personalized fix plan appears here after discovery."
        />
        <div className="rounded-lg border-2 border-dashed border-hs-border p-6 text-center">
          <p className="text-[14px] font-ui text-hs-text-dark mb-3">
            {fixPlan
              ? 'No problems selected in discovery — go back and check the ones that apply.'
              : 'Answer the discovery questions first and we\'ll build your fix plan automatically.'}
          </p>
          <button
            onClick={() => goToStep(index - 1)}
            className="text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md"
          >
            ← Go to Discovery
          </button>
        </div>
      </StepBody>
    )
  }

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro={`We found ${fixPlan.problems.length} revenue leak${
          fixPlan.problems.length === 1 ? '' : 's'
        } and pre-built the fix for each. Click one to see it live on the right.`}
      />

      <div className="space-y-3">
        {fixPlan.problems.map((p) => {
          const isFocused = focusedProblemId === p.id
          return (
            <button
              key={p.id}
              onClick={() => setFocusedProblem(p.id)}
              className={`w-full text-left rounded-lg border p-3.5 transition-colors ${
                isFocused
                  ? 'border-hs-orange bg-hs-orange/5'
                  : 'border-hs-border bg-white hover:border-hs-text-light'
              }`}
            >
              {p.isTop && (
                <span className="inline-block text-[10px] font-ui font-bold uppercase tracking-wide text-white bg-hs-red rounded px-1.5 py-0.5 mb-1.5">
                  Costing you the most
                </span>
              )}
              <div className="text-[11px] font-ui text-hs-text-light mb-0.5">
                You said: “{p.saidLabel}”
              </div>
              <h3 className="font-ui font-semibold text-hs-navy text-[15px]">{p.title}</h3>
              <p className="text-[13px] font-ui text-hs-text-dark mt-1">{p.narrative}</p>

              <div className="mt-2.5 grid grid-cols-1 gap-2">
                <div className="rounded-md bg-hs-canvas px-2.5 py-2">
                  <div className="text-[10px] font-ui font-semibold uppercase tracking-wide text-hs-text-light mb-0.5">
                    HubSpot gives you the toolkit
                  </div>
                  <div className="text-[12px] font-ui text-hs-text-dark">
                    {[
                      p.workflows.length &&
                        `${p.workflows.length} automation${p.workflows.length === 1 ? '' : 's'}`,
                      p.viewIds.length && `${p.viewIds.length} view${p.viewIds.length === 1 ? '' : 's'}`,
                      p.widgets.length && `${p.widgets.length} dashboard widget${p.widgets.length === 1 ? '' : 's'}`,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Reporting foundation'}
                  </div>
                </div>
                <div className="rounded-md bg-hs-navy px-2.5 py-2">
                  <div className="text-[10px] font-ui font-semibold uppercase tracking-wide text-white/60 mb-1">
                    🔧 What Crescent Connect builds for you
                  </div>
                  <ul className="space-y-0.5">
                    {p.ccBuild.map((item, i) => (
                      <li key={i} className="text-[12px] font-ui text-white/90 flex gap-1.5">
                        <span className="text-hs-orange shrink-0">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Global build scope */}
      <div className="mt-5 rounded-lg border border-hs-border bg-white p-4">
        <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-1">
          Plus, across your whole setup
        </h3>
        <p className="text-[12px] font-ui text-hs-text-light mb-2">
          None of this exists out of the box. This is the implementation work Crescent Connect
          does so the system fits your business on day one.
        </p>
        <ul className="space-y-1">
          {fixPlan.globalBuild.map((item, i) => (
            <li key={i} className="text-[13px] font-ui text-hs-text-dark flex gap-2">
              <span className="text-hs-green shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Scope of work mapped to the Crescent Connect offer ladder */}
      {(() => {
        const scope = scopeOffers(session)
        return (
          <div className="mt-5">
            <h3 className="font-ui font-semibold text-hs-navy text-[15px] mb-1">
              How this gets built — your scope of work
            </h3>
            <p className="text-[12px] font-ui text-hs-text-light mb-3">
              Your setup, sorted into how Crescent Connect delivers it. Start free; the rest is
              the full install.
            </p>
            <div className="space-y-3">
              <OfferCard
                offer={OFFERS.free}
                items={scope.free}
                recommended={scope.recommended === 'free'}
                footnote="7-day done-for-you setup. Capped scope, capped at 4 businesses per month."
              />
              <OfferCard
                offer={OFFERS.machine}
                items={scope.machine}
                recommended={scope.recommended === 'machine'}
                footnote="The 30-day full install. Everything above the free scope lives here — built, tested, and trained."
              />
              <OfferCard
                offer={OFFERS.retainer}
                items={scope.retainer}
                footnote="Optional, after your install. We run it so you don't have to."
              />
            </div>
            {scope.diyNote && (
              <p className="text-[12px] font-ui text-hs-text-light mt-2">{scope.diyNote}</p>
            )}
          </div>
        )
      })()}

      {fixPlan.mondayScreen && (
        <div className="mt-3 rounded-lg border border-hs-blue/30 bg-hs-blue/5 p-3">
          <div className="text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-blue mb-0.5">
            Your Monday-morning screen
          </div>
          <p className="text-[13px] font-ui text-hs-text-dark italic">
            “{fixPlan.mondayScreen}”
          </p>
          <p className="text-[12px] font-ui text-hs-text-light mt-1">
            We build this as your default dashboard view.
          </p>
        </div>
      )}

      <p className="mt-4 text-[12px] font-ui text-hs-text-light">
        Everything above is already loaded into the configurator — keep clicking Next to
        fine-tune it, or jump straight to step 12 for the full preview.
      </p>
    </StepBody>
  )
}
