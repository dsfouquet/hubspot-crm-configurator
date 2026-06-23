import { useCallback, useRef, useState } from 'react'
import {
  INTRO_STEPS,
  HUB_TOURS,
  RECORD_TOURS,
  recordTrackId,
  TAB_TOURS,
  tabTrackId,
} from './tourSteps'

// Per-browser flags:
//   DONE_KEY — global kill switch ("Don't show me any more"); nothing auto-shows.
//   SEEN_KEY — JSON array of track ids already played ('intro' + hub keys), so
//              the intro prompt and each per-hub tour only fire once.
const DONE_KEY = 'cc_crm_tour_v1_done'
const SEEN_KEY = 'cc_crm_tour_v1_seen'

export function tourDone() {
  try {
    return localStorage.getItem(DONE_KEY) === '1'
  } catch {
    return false
  }
}
function markDone() {
  try {
    localStorage.setItem(DONE_KEY, '1')
  } catch {
    /* storage disabled — just won't be remembered */
  }
}
function readSeen() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'))
  } catch {
    return new Set()
  }
}
function persistSeen(set) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...set]))
  } catch {
    /* storage disabled */
  }
}

// Track-based tour controller. One "track" plays at a time: the intro, or a
// single hub's mini-tour. `setHub` lets the controller switch the preview to the
// right screen when a track starts.
export function useTour(setHub) {
  const [trackId, setTrackId] = useState(null) // 'intro' | hub key | null
  const [steps, setSteps] = useState([])
  const [index, setIndex] = useState(0)
  const seenRef = useRef(readSeen())

  const active = trackId !== null

  const markSeen = useCallback((id) => {
    seenRef.current.add(id)
    persistSeen(seenRef.current)
  }, [])

  const close = useCallback(() => {
    setTrackId(null)
    setSteps([])
    setIndex(0)
  }, [])

  const startIntro = useCallback(() => {
    if (setHub) setHub('journey')
    setTrackId('intro')
    setSteps(INTRO_STEPS)
    setIndex(0)
  }, [setHub])

  // Returns false when the hub has no mini-tour (e.g. Sales Process / journey).
  const startHub = useCallback(
    (key) => {
      const list = HUB_TOURS[key]
      if (!list || !list.length) return false
      if (setHub) setHub(key)
      setTrackId(key)
      setSteps(list)
      setIndex(0)
      return true
    },
    [setHub]
  )

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, steps.length - 1))
  }, [steps.length])

  // Last-step button / track complete: remember this track, then close.
  const finish = useCallback(() => {
    if (trackId) markSeen(trackId)
    close()
  }, [trackId, markSeen, close])

  // "Don't show me any more": global kill switch.
  const dismiss = useCallback(() => {
    markDone()
    close()
  }, [close])

  // Initial prompt = run the intro. Help button = wipe flags and run it fresh.
  const start = startIntro
  const restart = useCallback(() => {
    try {
      localStorage.removeItem(DONE_KEY)
      localStorage.removeItem(SEEN_KEY)
    } catch {
      /* storage disabled */
    }
    seenRef.current = new Set()
    startIntro()
  }, [startIntro])

  // "No thanks" on the prompt: skip the intro but leave per-hub tours armed.
  const skipIntro = useCallback(() => {
    markSeen('intro')
    close()
  }, [markSeen, close])

  // Called when a rail item is clicked. Drives the per-hub tours.
  const onHubSelected = useCallback(
    (key) => {
      if (tourDone()) return
      if (trackId === 'intro') {
        const cur = INTRO_STEPS[index]
        if (!cur || !cur.isExplore) return // mid-intro: ignore stray rail clicks
        markSeen('intro') // on the explore step: hand off into the hub's tour
      } else if (trackId && trackId !== key) {
        markSeen(trackId) // leaving one hub's tour for another
      }
      if (seenRef.current.has(key)) {
        if (trackId) close()
        return
      }
      if (!startHub(key) && trackId) close() // hub has no tour (e.g. journey)
    },
    [trackId, index, markSeen, startHub, close]
  )

  // Called when a record popup opens. Plays that record type's tour once. The
  // popup is already on screen, so this doesn't touch the active hub.
  const startRecord = useCallback(
    (slice) => {
      if (tourDone()) return
      if (trackId) return // don't interrupt an in-progress track
      const id = recordTrackId(slice)
      if (seenRef.current.has(id)) return
      const list = RECORD_TOURS[slice]
      if (!list || !list.length) return
      setTrackId(id)
      setSteps(list)
      setIndex(0)
    },
    [trackId]
  )

  // Called when a top sub-tab is clicked in a hub. Plays that tab's tour once.
  const startTab = useCallback(
    (hub, tab) => {
      if (tourDone()) return
      if (trackId) return // don't interrupt an in-progress track
      const id = tabTrackId(hub, tab)
      if (seenRef.current.has(id)) return
      const list = TAB_TOURS[hub]?.[tab]
      if (!list || !list.length) return
      setTrackId(id)
      setSteps(list)
      setIndex(0)
    },
    [trackId]
  )

  // Whether the first-access prompt should auto-open (intro not yet seen).
  const autoPrompt = useCallback(() => !tourDone() && !seenRef.current.has('intro'), [])

  return {
    active,
    index,
    total: steps.length,
    step: steps[index],
    start,
    restart,
    skipIntro,
    next,
    finish,
    dismiss,
    onHubSelected,
    startRecord,
    startTab,
    autoPrompt,
  }
}
