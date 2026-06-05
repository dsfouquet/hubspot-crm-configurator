import { useStore } from '../store/useStore'
import tiers from '../data/hubspotTiers.json'
import { calculateRequiredTier } from '../utils/tierCalculator'

// Live HubSpot tier indicator (spec 3.3). Recomputes on every config change because
// it reads from the Zustand session, which re-renders this component on mutation.
export default function TierIndicator() {
  const session = useStore((s) => s.session)
  const result = calculateRequiredTier(session)
  const { order, requiredTier, requiredLabel, monthlyPerSeat, drivers, included } = result
  const reqRank = order.indexOf(requiredTier)

  return (
    <div className="rounded-lg border border-hs-border p-3 font-ui">
      {/* Tier pills */}
      <div className="flex items-center justify-between gap-1 mb-3">
        {order.map((key, i) => {
          const t = tiers.tiers[key]
          const isRequired = i === reqRank
          const isIncluded = i < reqRank
          let dot, text
          if (isRequired) {
            dot = t.color
            text = 'text-hs-navy font-semibold'
          } else if (isIncluded) {
            dot = '#00BDA5'
            text = 'text-hs-text-light'
          } else {
            dot = '#CBD6E2'
            text = 'text-hs-text-light/70'
          }
          return (
            <div key={key} className="flex flex-col items-center gap-1 flex-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: isRequired ? dot : 'transparent',
                  border: `2px solid ${dot}`,
                }}
              />
              <span className={`text-[10px] leading-none text-center ${text}`}>{t.label}</span>
            </div>
          )
        })}
      </div>

      {/* Required tier callout */}
      <div
        className="rounded-md px-2.5 py-2 mb-3 text-center"
        style={{ backgroundColor: `${result.requiredColor}15` }}
      >
        <p className="text-[11px] text-hs-text-light">This configuration requires</p>
        <p className="text-[15px] font-semibold" style={{ color: result.requiredColor }}>
          HubSpot {requiredLabel}
        </p>
        {monthlyPerSeat > 0 && (
          <p className="text-[11px] text-hs-text-light">~${monthlyPerSeat}/seat/mo</p>
        )}
      </div>

      {/* Drivers — features at the required tier */}
      {drivers.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-hs-text-dark mb-1">
            ⚠ Features requiring {requiredLabel}:
          </p>
          <ul className="space-y-0.5">
            {drivers.map((d) => (
              <li key={d.feature} className="text-[12px] text-hs-text-dark flex items-start gap-1">
                <span className="text-hs-orange">•</span>
                <span>
                  {d.label}
                  {d.detail && <span className="text-hs-text-light"> ({d.detail})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Included — features available at lower tiers */}
      {included.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-hs-text-dark mb-1">
            ✓ Included in {reqRank > 0 ? 'lower tiers' : 'Free'}:
          </p>
          <ul className="space-y-0.5">
            {included.map((d) => (
              <li key={d.feature} className="text-[12px] text-hs-text-light flex items-start gap-1">
                <span className="text-hs-green">•</span>
                {d.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {requiredTier === 'free' && (
        <p className="text-[12px] text-hs-text-light">
          Everything configured so far fits HubSpot's Free tier. Add automations, custom objects,
          or forecasting to see the tier update.
        </p>
      )}
    </div>
  )
}
