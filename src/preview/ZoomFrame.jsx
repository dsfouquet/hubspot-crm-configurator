import { useStore } from '../store/useStore'

// Wraps a preview surface and applies the presenter zoom. The frame owns the
// scroll, so zoomed-up content stays reachable. A small floating control sits
// bottom-right (low-key so it doesn't dominate a screen-share).
export default function ZoomFrame({ children }) {
  const zoom = useStore((s) => s.previewZoom)
  const zoomIn = useStore((s) => s.zoomIn)
  const zoomOut = useStore((s) => s.zoomOut)
  const resetZoom = useStore((s) => s.resetZoom)

  return (
    <div className="relative h-full w-full overflow-auto hs-scroll">
      {/* `zoom` scales layout + text and reflows scrollbars (Chromium/modern). */}
      <div style={{ zoom }}>{children}</div>

      <div className="sticky bottom-3 float-right mr-3 z-20 inline-flex items-center gap-0.5 rounded-full bg-white/95 border border-hs-border shadow-sm px-1 py-0.5 font-ui backdrop-blur-sm">
        <button
          onClick={zoomOut}
          disabled={zoom <= 0.75}
          aria-label="Zoom out"
          className="w-7 h-7 flex items-center justify-center rounded-full text-hs-text-dark hover:bg-hs-canvas disabled:opacity-30"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={resetZoom}
          aria-label="Reset zoom to 100%"
          title="Reset zoom"
          className="min-w-[44px] px-1 text-[12px] font-semibold text-hs-text-dark hover:text-hs-navy tabular-nums"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={zoomIn}
          disabled={zoom >= 2.5}
          aria-label="Zoom in"
          className="w-7 h-7 flex items-center justify-center rounded-full text-hs-text-dark hover:bg-hs-canvas disabled:opacity-30"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
