import { useStore } from '../store/useStore'

// Preview for Step 6: a HubSpot-style nav showing custom objects as record types.
export default function PreviewCustomObjects() {
  const customObjects = useStore((s) => s.session.customObjects)

  if (customObjects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="mx-auto w-12 h-12 rounded-lg bg-white border border-hs-border flex items-center justify-center text-xl shadow-sm">
            🧩
          </div>
          <h3 className="mt-4 font-preview font-semibold text-hs-navy">No custom objects yet</h3>
          <p className="mt-2 text-sm text-hs-text-light font-preview">
            Add one on the left to see how it appears in your HubSpot navigation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-4">
      {/* Mock HubSpot top nav with custom objects added */}
      <div className="bg-white rounded-lg border border-hs-border p-3">
        <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-2">
          CRM Navigation
        </p>
        <div className="flex flex-wrap gap-2">
          {['Contacts', 'Companies', 'Deals', 'Tickets'].map((n) => (
            <span
              key={n}
              className="text-[13px] font-preview text-hs-text-light border border-hs-border rounded px-2.5 py-1"
            >
              {n}
            </span>
          ))}
          {customObjects.map((o) => (
            <span
              key={o.id}
              className="text-[13px] font-preview text-hs-navy font-medium border border-hs-orange bg-hs-orange/10 rounded px-2.5 py-1"
            >
              🧩 {o.plural || o.singular || 'Untitled'}
            </span>
          ))}
        </div>
      </div>

      {/* Each object as a record-type card */}
      {customObjects.map((o) => (
        <div key={o.id} className="bg-white rounded-lg border border-hs-border overflow-hidden">
          <div className="bg-hs-canvas px-4 py-2.5 border-b border-hs-border">
            <h3 className="font-preview font-semibold text-hs-navy">
              {o.plural || o.singular || 'Untitled object'}
            </h3>
            {o.description && (
              <p className="text-[12px] font-preview text-hs-text-light">{o.description}</p>
            )}
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                Properties
              </p>
              {o.properties.length === 0 ? (
                <p className="text-[12px] font-preview text-hs-border italic">None yet</p>
              ) : (
                <ul className="space-y-1">
                  {o.properties.map((p) => (
                    <li key={p.key} className="text-[13px] font-preview text-hs-text-dark">
                      {p.label}{' '}
                      <span className="text-[11px] text-hs-text-light">· {p.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light mb-1.5">
                Associated with
              </p>
              {o.associations.length === 0 ? (
                <p className="text-[12px] font-preview text-hs-border italic">None yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {o.associations.map((a) => (
                    <span
                      key={a}
                      className="text-[12px] font-preview bg-hs-blue/10 text-hs-blue rounded px-2 py-0.5"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
