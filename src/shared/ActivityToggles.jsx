import { useStore } from '../store/useStore'

// Activity-timeline item checkboxes for a record slice.
export default function ActivityToggles({ slice }) {
  const activities = useStore((s) => s.session[slice].activities)
  const toggleActivity = useStore((s) => s.toggleActivity)

  return (
    <div className="flex flex-wrap gap-1.5">
      {activities.map((a) => (
        <button
          key={a.key}
          onClick={() => toggleActivity(slice, a.key)}
          className={`text-[13px] font-ui px-2.5 py-1 rounded-full border ${
            a.enabled
              ? 'border-hs-green/40 bg-hs-green/10 text-hs-text-dark'
              : 'border-hs-border bg-white text-hs-text-light hover:border-hs-text-light'
          }`}
        >
          {a.enabled ? '✓ ' : '+ '}
          {a.label}
        </button>
      ))}
    </div>
  )
}
