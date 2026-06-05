import { useStore } from '../store/useStore'
import PreviewRecord from './PreviewRecord'
import { SAMPLE } from './sampleData'

// Deal preview = standard record + a mini pipeline board with the custom stages.
export default function PreviewDealRecord() {
  const stages = useStore((s) => s.session.deals.pipelineStages)
  const currentStage = SAMPLE.deals.values.deal_stage

  return (
    <div>
      <PreviewRecord slice="deals" />

      <div className="px-5 pb-6">
        <h3 className="text-[12px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
          Pipeline Board
        </h3>
        <div className="flex gap-2 overflow-x-auto hs-scroll pb-2">
          {stages.map((st) => {
            const isCurrent = st.label === currentStage
            return (
              <div key={st.key} className="shrink-0 w-36">
                <div
                  className={`rounded-t-md px-2.5 py-1.5 text-[12px] font-preview font-medium text-white ${
                    isCurrent ? '' : 'opacity-70'
                  }`}
                  style={{ backgroundColor: isCurrent ? '#FF7A59' : '#7C98B6' }}
                >
                  {st.label}
                  {st.probability != null && (
                    <span className="float-right opacity-90">{st.probability}%</span>
                  )}
                </div>
                <div className="bg-white border border-t-0 border-hs-border rounded-b-md min-h-[60px] p-2">
                  {isCurrent && (
                    <div className="rounded border border-hs-border bg-hs-canvas px-2 py-1.5">
                      <p className="text-[11px] font-preview font-medium text-hs-navy leading-tight">
                        Gulf Coast — SIHI Vacuum
                      </p>
                      <p className="text-[11px] font-preview text-hs-green">$84,500</p>
                    </div>
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
