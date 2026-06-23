import { useCallback, useState } from 'react'
import { TOUR_STEPS } from './tourSteps'

// Per-browser "done" flag — set on dismiss or finish so the auto-prompt doesn't
// nag on return visits. The TopBar Help button can still relaunch the tour.
const DONE_KEY = 'cc_crm_tour_v1_done'

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
    /* private mode / storage disabled — tour just won't be remembered */
  }
}

// Tour controller. `setHub` lets start()/next() drive the preview's active hub
// so the right page is showing behind each step's spotlight.
export function useTour(setHub) {
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)
  const total = TOUR_STEPS.length

  const applyHub = useCallback(
    (i) => {
      const h = TOUR_STEPS[i]?.hub
      if (h && setHub) setHub(h)
    },
    [setHub]
  )

  const start = useCallback(() => {
    setIndex(0)
    applyHub(0)
    setActive(true)
  }, [applyHub])

  const next = useCallback(() => {
    setIndex((i) => {
      const n = i + 1
      if (n >= total) {
        markDone()
        setActive(false)
        return i
      }
      applyHub(n)
      return n
    })
  }, [applyHub, total])

  // Both the faint "Don't show me any more" link and the final "Finish" button
  // end the tour and remember it as done.
  const dismiss = useCallback(() => {
    markDone()
    setActive(false)
  }, [])

  return {
    active,
    index,
    total,
    step: TOUR_STEPS[index],
    start,
    next,
    dismiss,
    finish: dismiss,
  }
}
