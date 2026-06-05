import { useStore } from '../store/useStore'
import { SAMPLE, SAMPLE_ACTIVITY } from './sampleData'

const ACCENT = {
  contacts: '#0091AE',
  companies: '#6A78D1',
  deals: '#00BDA5',
  tickets: '#F2545B',
}

// Generic HubSpot-style record preview driven by the slice's enabled props/sections/activities.
export default function PreviewRecord({ slice }) {
  const record = useStore((s) => s.session[slice])
  const sample = SAMPLE[slice]
  const accent = ACCENT[slice] || '#0091AE'

  const enabledProps = record.properties.filter((p) => p.enabled)
  const enabledSections = record.sections.filter((s) => s.enabled)
  const enabledActivities = record.activities.filter((a) => a.enabled)

  return (
    <div className="p-5">
      {/* Record header */}
      <div className="bg-white rounded-t-lg border border-hs-border px-5 py-4 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-preview font-semibold"
          style={{ backgroundColor: accent }}
        >
          {sample.initials}
        </div>
        <div className="min-w-0">
          <h2 className="font-preview font-semibold text-hs-navy text-lg leading-tight truncate">
            {sample.title}
          </h2>
          <p className="text-[13px] text-hs-text-light font-preview truncate">{sample.subtitle}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="bg-white border-x border-hs-border px-5 py-2 flex gap-2">
        {['Note', 'Email', 'Call', 'Task', 'Meeting'].map((a) => (
          <span
            key={a}
            className="text-[12px] font-preview text-hs-blue border border-hs-border rounded px-2.5 py-1"
          >
            {a}
          </span>
        ))}
      </div>

      {/* Body: left = About (properties), right = sections + activity */}
      <div className="grid grid-cols-5 gap-0 border-x border-b border-hs-border rounded-b-lg overflow-hidden">
        {/* Left: About card */}
        <div className="col-span-2 bg-white border-r border-hs-border p-4">
          <h3 className="text-[12px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-3">
            About this {slice.replace(/s$/, '')}
          </h3>
          <dl className="space-y-2.5">
            {enabledProps.map((p) => (
              <div key={p.key}>
                <dt className="text-[11px] font-preview text-hs-text-light">{p.label}</dt>
                <dd className="text-[13px] font-preview text-hs-text-dark">
                  {sample.values[p.key] ?? <span className="text-hs-text-light">—</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: activity timeline + section chips */}
        <div className="col-span-3 bg-hs-canvas p-4">
          {/* Section tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {enabledSections.map((sec, i) => (
              <span
                key={sec.key}
                className={`text-[12px] font-preview px-2.5 py-1 rounded ${
                  i === 0
                    ? 'bg-white text-hs-navy border-b-2 border-hs-orange font-medium'
                    : 'text-hs-text-light'
                }`}
              >
                {sec.label}
              </span>
            ))}
          </div>

          {/* Activity feed */}
          <div className="space-y-2">
            {enabledActivities.length === 0 && (
              <p className="text-[13px] font-preview text-hs-text-light">
                No activity types selected.
              </p>
            )}
            {enabledActivities.map((a) => {
              const entry = SAMPLE_ACTIVITY[a.key]
              if (!entry) return null
              return (
                <div
                  key={a.key}
                  className="bg-white rounded-md border border-hs-border px-3 py-2 flex items-start gap-2.5"
                >
                  <span className="text-[14px] leading-none mt-0.5">{entry.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-preview text-hs-text-dark leading-snug">
                      {entry.text}
                    </p>
                    <p className="text-[11px] font-preview text-hs-text-light">{entry.when}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
