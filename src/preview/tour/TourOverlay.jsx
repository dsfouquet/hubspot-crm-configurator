import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Coach-mark overlay for the CRM preview tour. Portals to document.body (like
// Spotlight.jsx) so the presenter zoom + ZoomFrame CSS transform never clip or
// scale it. It reads the target's getBoundingClientRect() (already in screen
// coords post-transform), dims everything else with the box-shadow spotlight
// trick, rings the target in HubSpot orange, and floats a callout card beside
// it. It sits OUTSIDE #preview-export-root, so it never appears in the PDF.

const CARD_W = 304
const PAD = 4 // ring padding around the target
const GAP = 14 // space between target and card
const MARGIN = 10 // viewport edge margin

function clampXY(top, left, ch) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return {
    top: Math.max(MARGIN, Math.min(top, vh - ch - MARGIN)),
    left: Math.max(MARGIN, Math.min(left, vw - CARD_W - MARGIN)),
  }
}

// Pick the first placement that keeps the card fully on screen, else clamp.
function placeCard(r, ch, pref) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const order =
    pref === 'auto'
      ? ['right', 'bottom', 'left', 'top']
      : [pref, 'bottom', 'right', 'top', 'left']
  for (const p of order) {
    let top
    let left
    if (p === 'right') {
      left = r.right + GAP
      top = r.top
    } else if (p === 'left') {
      left = r.left - CARD_W - GAP
      top = r.top
    } else if (p === 'bottom') {
      top = r.bottom + GAP
      left = r.left
    } else {
      top = r.top - ch - GAP
      left = r.left
    }
    if (left >= MARGIN && left + CARD_W <= vw - MARGIN && top >= MARGIN && top + ch <= vh - MARGIN) {
      return { top, left }
    }
  }
  return clampXY(r.top, Math.min(r.right + GAP, vw - CARD_W - MARGIN), ch)
}

export default function TourOverlay({ step, index, total, onNext, onDismiss, onFinish }) {
  const cardRef = useRef(null)
  // { ring: {top,left,width,height}|null, card: {top,left} }
  const [pos, setPos] = useState(null)

  const measure = useCallback(() => {
    const ch = cardRef.current?.offsetHeight || 170
    if (!step?.target) {
      // Centered card, no spotlight (finish step).
      const left = (window.innerWidth - CARD_W) / 2
      const top = (window.innerHeight - ch) / 2
      setPos({ ring: null, card: { top, left } })
      return
    }
    const el = document.querySelector(step.target)
    if (!el) {
      const left = (window.innerWidth - CARD_W) / 2
      const top = (window.innerHeight - ch) / 2
      setPos({ ring: null, card: { top, left } })
      return
    }
    const r = el.getBoundingClientRect()
    const ring = { top: r.top, left: r.left, width: r.width, height: r.height }
    setPos({ ring, card: placeCard(r, ch, step.placement || 'auto') })
  }, [step])

  // On step change: scroll the target into view (once), then measure after two
  // frames so post-navigation hub layout has settled.
  useLayoutEffect(() => {
    if (step?.target) {
      const el = document.querySelector(step.target)
      try {
        el?.scrollIntoView({ block: 'center', inline: 'nearest' })
      } catch {
        /* element may be missing */
      }
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure))
    return () => cancelAnimationFrame(raf)
  }, [index, step, measure])

  // Re-measure on viewport changes (resize, presenter zoom, internal scroll).
  useEffect(() => {
    const onChange = () => measure()
    window.addEventListener('resize', onChange, true)
    window.addEventListener('scroll', onChange, true)
    return () => {
      window.removeEventListener('resize', onChange, true)
      window.removeEventListener('scroll', onChange, true)
    }
  }, [measure])

  // Escape ends the tour (treated as dismiss).
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onDismiss()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss])

  const isLast = index >= total - 1
  const advance = isLast ? onFinish : onNext
  const primaryLabel = isLast ? step?.finishLabel || 'Done' : 'Next'
  const ring = pos?.ring
  const card = pos?.card || { top: -9999, left: -9999 }

  return createPortal(
    <div className="fixed inset-0 z-[60] font-preview">
      {/* Full-screen click catcher: blocks interaction with the page behind the
          tour. Transparent — the dimming comes from the ring's box-shadow (or a
          solid wash when there's no target). */}
      <div
        className="absolute inset-0"
        style={{
          // The explore hand-off step lets the viewer click the rail straight
          // through to launch a hub tour, so it doesn't capture clicks.
          pointerEvents: step?.interactiveRail ? 'none' : 'auto',
          background: ring ? 'transparent' : 'rgba(45,62,80,0.55)',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Spotlight: a hole the size of the target, dimming the rest via a huge
          box-shadow spread, ringed in HubSpot orange. Visual only. */}
      {ring && (
        <div
          style={{
            position: 'fixed',
            top: ring.top - PAD,
            left: ring.left - PAD,
            width: ring.width + PAD * 2,
            height: ring.height + PAD * 2,
            borderRadius: 8,
            boxShadow: '0 0 0 9999px rgba(45,62,80,0.55)',
            outline: '2px solid var(--hs-orange)',
            outlineOffset: 0,
            pointerEvents: 'none',
            transition: 'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease',
          }}
        />
      )}

      {/* When the step invites a click on the target, a transparent hit area over
          it advances the tour (so "click Sales Process" works literally). */}
      {ring && step?.advanceOnTargetClick && (
        <button
          aria-label="Continue"
          onClick={advance}
          style={{
            position: 'fixed',
            top: ring.top - PAD,
            left: ring.left - PAD,
            width: ring.width + PAD * 2,
            height: ring.height + PAD * 2,
            pointerEvents: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        />
      )}

      {/* Callout card */}
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow-2xl"
        style={{
          position: 'fixed',
          width: CARD_W,
          top: card.top,
          left: card.left,
          borderTop: '3px solid var(--hs-orange)',
          pointerEvents: 'auto',
          transition: 'top 180ms ease, left 180ms ease',
        }}
      >
        <div className="px-5 pt-3.5 pb-4">
          {total > 1 && (
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-hs-text-light mb-1">
              {index + 1} of {total}
            </div>
          )}
          <h3 className="text-[15px] font-semibold text-hs-navy leading-snug">{step?.title}</h3>
          <p className="text-[12.5px] text-hs-text-dark leading-snug mt-1.5">{step?.body}</p>
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={onDismiss}
              className="text-[11px] text-hs-text-light hover:text-hs-navy hover:underline"
            >
              Don’t show me any more
            </button>
            <button
              type="button"
              onClick={advance}
              className="hs-btn-primary shrink-0"
              style={{ padding: '7px 18px', fontSize: 13 }}
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
