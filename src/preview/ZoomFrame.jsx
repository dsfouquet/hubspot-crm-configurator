import { useStore } from '../store/useStore'

// In-panel zoom for a demo surface — the outer panel always fills the screen;
// only the demo CONTENT magnifies (transform: scale), and you scroll to see the
// rest. Mirrors the Automations (ReactFlow) zoom: layout stays put, the view
// magnifies. The control sits bottom-left, ReactFlow-style, over the demo.
export default function ZoomFrame({ children }) {
  const zoom = useStore((s) => s.previewZoom)
  const zoomIn = useStore((s) => s.zoomIn)
  const zoomOut = useStore((s) => s.zoomOut)
  const resetZoom = useStore((s) => s.resetZoom)

  return (
    <div className="relative h-full w-full">
      {/* Scroll viewport — always full size. */}
      <div className="absolute inset-0 overflow-auto hs-scroll">
        {/* Content magnifies via scale; the narrower layout width + top-left
            origin keep it filling the panel width and scrolling vertically.
            Height is DEFINITE (not min-height) so children using h-full resolve
            to a real height — ReactFlow diagrams need this or they collapse to 0.
            Taller flow content still overflows and the parent scrolls it. */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
          }}
        >
          {children}
        </div>
      </div>

      {/* Zoom control — fixed over the demo, like ReactFlow's Controls. */}
      <div className="absolute bottom-3 left-3 z-20 inline-flex items-center rounded-md bg-white/95 border border-hs-border shadow-sm overflow-hidden font-ui backdrop-blur-sm">
        <button
          onClick={zoomOut}
          disabled={zoom <= 1}
          aria-label="Zoom out"
          className="w-8 h-8 flex items-center justify-center text-hs-text-dark hover:bg-hs-canvas disabled:opacity-30 border-r border-hs-border"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={resetZoom}
          aria-label="Reset zoom to 100%"
          title="Reset zoom"
          className="min-w-[46px] h-8 px-1 text-[12px] font-semibold text-hs-text-dark hover:text-hs-navy tabular-nums border-r border-hs-border"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={zoomIn}
          disabled={zoom >= 2.5}
          aria-label="Zoom in"
          className="w-8 h-8 flex items-center justify-center text-hs-text-dark hover:bg-hs-canvas disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
