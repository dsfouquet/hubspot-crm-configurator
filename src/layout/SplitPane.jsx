import { useRef, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'cc_split_ratio'
const MIN_PCT = 20
const MAX_PCT = 75

// Draggable horizontal split: left panel width is a % the user can drag, right
// panel fills the rest. Ratio persists in localStorage. Both sides reflow because
// their contents use responsive (flex/grid/flex-wrap) layouts.
export default function SplitPane({ left, right }) {
  const containerRef = useRef(null)
  const [ratio, setRatio] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY))
    return saved >= MIN_PCT && saved <= MAX_PCT ? saved : 30
  })
  const [dragging, setDragging] = useState(false)

  const onPointerMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    const clamped = Math.max(MIN_PCT, Math.min(MAX_PCT, pct))
    setRatio(clamped)
  }, [])

  const stopDrag = useCallback(() => {
    setDragging(false)
  }, [])

  const startDrag = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  // Attach window listeners only while dragging; lock cursor + selection.
  useEffect(() => {
    if (!dragging) return
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDrag)
    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stopDrag)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [dragging, onPointerMove, stopDrag])

  // Persist whenever the ratio settles.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(Math.round(ratio)))
  }, [ratio])

  // Keyboard accessibility: arrow keys nudge the divider.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') setRatio((r) => Math.max(MIN_PCT, r - 2))
    if (e.key === 'ArrowRight') setRatio((r) => Math.min(MAX_PCT, r + 2))
  }

  return (
    <div ref={containerRef} className="flex-1 flex min-w-0 h-full">
      {/* Left panel */}
      <div
        style={{ width: `${ratio}%` }}
        className="h-full min-w-[260px] flex overflow-hidden"
      >
        {left}
      </div>

      {/* Drag handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(ratio)}
        tabIndex={0}
        onPointerDown={startDrag}
        onKeyDown={onKeyDown}
        onDoubleClick={() => setRatio(30)}
        title="Drag to resize · double-click to reset"
        className={`relative shrink-0 w-1.5 cursor-col-resize group ${
          dragging ? 'bg-hs-blue' : 'bg-hs-border hover:bg-hs-blue/60'
        }`}
      >
        {/* Wider invisible hit area */}
        <span className="absolute inset-y-0 -left-1.5 -right-1.5" />
        {/* Center grip */}
        <span
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-0.5 ${
            dragging ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
          }`}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-0.5 h-0.5 rounded-full bg-white" />
          ))}
        </span>
      </div>

      {/* Right panel */}
      <div className="flex-1 min-w-0 h-full flex">{right}</div>
    </div>
  )
}
