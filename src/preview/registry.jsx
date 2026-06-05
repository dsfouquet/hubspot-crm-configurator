import { STEPS } from '../constants/steps'

// Placeholder preview shown until each step's real preview is built.
function PreviewPlaceholder({ index }) {
  const step = STEPS[index]
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-12 h-12 rounded-lg bg-white border border-hs-border flex items-center justify-center text-xl shadow-sm">
          🪄
        </div>
        <h3 className="mt-4 font-preview font-semibold text-hs-navy">
          Live Preview — {step.label}
        </h3>
        <p className="mt-2 text-sm text-hs-text-light font-preview">
          As you configure this step, a live HubSpot-style preview will render here.
        </p>
      </div>
    </div>
  )
}

// Maps step key → preview component. Replace placeholders as previews are built.
export const PREVIEW_COMPONENTS = {
  wizard: (i) => <PreviewPlaceholder index={i} />,
  contacts: (i) => <PreviewPlaceholder index={i} />,
  companies: (i) => <PreviewPlaceholder index={i} />,
  deals: (i) => <PreviewPlaceholder index={i} />,
  tickets: (i) => <PreviewPlaceholder index={i} />,
  customObjects: (i) => <PreviewPlaceholder index={i} />,
  workflows: (i) => <PreviewPlaceholder index={i} />,
  views: (i) => <PreviewPlaceholder index={i} />,
  dashboards: (i) => <PreviewPlaceholder index={i} />,
  cadence: (i) => <PreviewPlaceholder index={i} />,
  preview: (i) => <PreviewPlaceholder index={i} />,
}
