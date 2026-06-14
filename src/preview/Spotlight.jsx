import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Reusable "zoom to center" overlay. The panel grows out of the clicked
// element's on-screen position (originRect) to a centered, enlarged card, and
// on close shrinks back to that exact spot — so you can see which thing you
// were inspecting. Shared by the journey board and the workflow diagram.
export default function Spotlight({ originRect, accent = '#FF7A59', onClose, children }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const closingRef = useRef(false)

  // Transform that places the centered panel back at the origin (translate its
  // center to the origin's center, shrink it small). Animating to identity = grow.
  const fromTransform = () => {
    const vpCx = window.innerWidth / 2
    const vpCy = window.innerHeight / 2
    const oCx = originRect.left + originRect.width / 2
    const oCy = originRect.top + originRect.height / 2
    return `translate(${oCx - vpCx}px, ${oCy - vpCy}px) scale(0.16)`
  }

  // Mount at the origin transform, then flip to centered on the next frame.
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const close = () => {
    if (closingRef.current) return
    closingRef.current = true
    setOpen(false)
    const el = panelRef.current
    if (!el) return onClose()
    const done = () => {
      el.removeEventListener('transitionend', done)
      onClose()
    }
    el.addEventListener('transitionend', done)
    // Fallback if transitionend doesn't fire.
    setTimeout(() => onClose(), 320)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Portal to body so an ancestor's CSS `zoom` (presenter zoom) doesn't scale or
  // clip the overlay — it must cover the true viewport.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-hs-navy/40 transition-opacity duration-200"
        style={{ opacity: open ? 1 : 0 }}
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto hs-scroll bg-white rounded-xl shadow-2xl font-preview"
        style={{
          transform: open ? 'none' : fromTransform(),
          opacity: open ? 1 : 0,
          transformOrigin: 'center center',
          transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
          borderTop: `3px solid ${accent}`,
        }}
      >
        <button
          onClick={close}
          aria-label="Close detail"
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-hs-text-light hover:text-hs-navy hover:bg-hs-canvas"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}
