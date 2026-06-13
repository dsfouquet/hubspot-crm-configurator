import { useStore } from '../store/useStore'
import PreviewRecord from './PreviewRecord'
import { DEALS } from './demoData'

const fmtK = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`)

// Deal preview = the featured record up top + a mini pipeline board populated
// with example deals distributed across the user's custom stages.
export default function PreviewDealRecord() {
  const stages = useStore((s) => s.session.deals.pipelineStages)

  // Bucket demo deals into the user's stages (clamped); the featured deal
  // (Gulf Coast Vacuum Pump, index 0) gets highlighted in its column.
  const cols = stages.map((st) => ({ ...st, deals: [] }))
  if (cols.length > 0) {
    DEALS.forEach((d, i) => {
      const idx = Math.min(Math.max(d.stage, 0), cols.length - 1)
      cols[idx].deals.push({ ...d, featured: i === 0 })
    })
  }

  return (
    <div>
      <PreviewRecord slice="deals" />

      <div className="px-5 pb-6">
        <h3 className="text-[12px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
          Pipeline Board
        </h3>
        <div className="flex gap-2 overflow-x-auto hs-scroll pb-2">
          {cols.map((st) => {
            const hasFeatured = st.deals.some((d) => d.featured)
            return (
              <div key={st.key} className="shrink-0 w-40">
                <div
                  className={`rounded-t-md px-2.5 py-1.5 text-[12px] font-preview font-medium text-white ${
                    hasFeatured ? '' : 'opacity-70'
                  }`}
                  style={{ backgroundColor: hasFeatured ? '#FF7A59' : '#7C98B6' }}
                >
                  {st.label}
                  {st.probability != null && (
                    <span className="float-right opacity-90">{st.probability}%</span>
                  )}
                </div>
                <div className="bg-white border border-t-0 border-hs-border rounded-b-md min-h-[60px] p-2 space-y-1.5">
                  {st.deals.length === 0 ? (
                    <p className="text-[10px] font-preview text-hs-text-light text-center py-3">
                      No deals
                    </p>
                  ) : (
                    st.deals.map((d) => (
                      <div
                        key={d.name}
                        className={`rounded border px-2 py-1.5 ${
                          d.featured
                            ? 'border-hs-orange bg-hs-orange/5'
                            : 'border-hs-border bg-hs-canvas'
                        }`}
                      >
                        <p className="hs-link text-[11px] font-preview font-medium leading-tight truncate">
                          {d.name.split(' — ')[1] || d.name}
                        </p>
                        <p className="text-[10px] font-preview text-hs-text-light truncate">
                          {d.company}
                        </p>
                        <p className="text-[11px] font-preview text-hs-green font-medium">
                          {fmtK(d.amount)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
