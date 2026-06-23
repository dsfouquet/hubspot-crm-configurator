// Tiny dispatch helpers so hub components can trigger tours without importing the
// tour hook. Step11_Preview listens for these and drives the tour controller.

// A top sub-tab was clicked in a hub view (CRM, Marketing, Sales, …).
export function fireTabTour(hub, tab) {
  window.dispatchEvent(new CustomEvent('cc-tour-tab', { detail: { hub, tab } }))
}
