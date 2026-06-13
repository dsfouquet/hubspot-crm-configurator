import tiers from '../data/hubspotTiers.json'

// Color-coded tier badge (Free/Starter/Professional/Enterprise).
export default function TierBadge({ tier, size = 'sm' }) {
  const t = tiers.tiers[tier]
  if (!t) return null
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[12px]'
  return (
    <span
      className={`inline-block rounded-[3px] font-ui font-semibold whitespace-nowrap ${pad}`}
      style={{ backgroundColor: `${t.color}1F`, color: t.color }}
    >
      {t.label}
    </span>
  )
}
