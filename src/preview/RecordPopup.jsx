// Shared record popup used both by the HubCRM demo (clicking a row/association) and
// by PreviewRecord itself (clicking an association in the per-step preview pane).
// Renders the matching record detail and lets clicks inside swap to the next record.
import PreviewRecord from './PreviewRecord'
import PreviewDealRecord from './PreviewDealRecord'
import { DEAL_STAGES_FALLBACK } from './recordHelpers'
import { toFeatured } from './associations'

export default function RecordPopup({ slice, record, session, onClose, onOpenRecord }) {
  if (!slice) return null

  const stages =
    session?.deals?.pipelineStages?.length > 0
      ? session.deals.pipelineStages
      : DEAL_STAGES_FALLBACK
  const isDealDetail = slice === 'deals' && record

  return (
    <div
      className="fixed inset-0 z-50 bg-hs-navy/50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-hs-canvas rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between bg-white border-b border-hs-border px-4 py-2.5">
          <span className="text-[12px] font-medium text-hs-text-light">
            {isDealDetail ? 'Deal record' : 'Record preview · exactly as you configured it'}
          </span>
          <button
            onClick={onClose}
            className="text-hs-text-light hover:text-hs-navy text-[18px] leading-none px-1"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {isDealDetail ? (
            <PreviewRecord
              slice="deals"
              featured={toFeatured('deals', record, stages)}
              onOpenRecord={onOpenRecord}
            />
          ) : slice === 'deals' ? (
            <PreviewDealRecord onOpenRecord={onOpenRecord} />
          ) : (
            <PreviewRecord
              slice={slice}
              featured={toFeatured(slice, record)}
              onOpenRecord={onOpenRecord}
            />
          )}
        </div>
      </div>
    </div>
  )
}
