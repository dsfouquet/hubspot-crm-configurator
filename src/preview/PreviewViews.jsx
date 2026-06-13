import { useStore } from '../store/useStore'
import { activeViews } from '../utils/recommendations'
import { IconUser, IconBuilding, IconDollar, IconTicket, IconStar } from './uiIcons'

const RECORD_TYPES = ['Contacts', 'Companies', 'Deals', 'Tickets']
const ICON = { Contacts: IconUser, Companies: IconBuilding, Deals: IconDollar, Tickets: IconTicket }

// Mock HubSpot left sidebar: each record type with its views nested beneath.
export default function PreviewViews() {
  const session = useStore((s) => s.session)
  const views = activeViews(session)

  return (
    <div className="p-5">
      <div className="max-w-xs mx-auto bg-white rounded-lg border border-hs-border overflow-hidden shadow-sm">
        <div className="bg-hs-navy px-4 py-2.5">
          <p className="font-preview font-semibold text-white text-[14px]">CRM</p>
        </div>
        <div className="p-2">
          {RECORD_TYPES.map((type) => {
            const typeViews = views.filter((v) => v.recordType === type)
            const TypeIcon = ICON[type]
            return (
              <div key={type} className="mb-2">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-hs-canvas">
                  <span className="text-hs-navydeep flex items-center">
                    <TypeIcon width={13} height={13} />
                  </span>
                  <span className="font-preview font-medium text-hs-text-dark text-[13px]">
                    {type}
                  </span>
                </div>
                <ul className="ml-7 border-l border-hs-border">
                  {/* default "All" view always present */}
                  <li className="pl-3 py-1 text-[12px] font-preview text-hs-text-light">
                    All {type}
                  </li>
                  {typeViews.map((v) => (
                    <li
                      key={v.id}
                      className="pl-3 py-1 text-[12px] font-preview text-hs-navy flex items-center gap-1.5"
                    >
                      <span className="text-hs-marigold flex items-center">
                        <IconStar width={10} height={10} />
                      </span>
                      {v.name}
                      {v.source === 'custom' && (
                        <span className="text-[9px] text-hs-blue border border-hs-blue/40 rounded px-1">
                          custom
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
      <p className="text-center text-[12px] font-preview text-hs-text-light mt-4">
        {views.length} custom view{views.length === 1 ? '' : 's'} configured across your records.
      </p>
    </div>
  )
}
