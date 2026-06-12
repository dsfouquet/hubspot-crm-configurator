// Custom workflow drafts (plain-English description → editable starter diagram).
//
// AI generation removed June 2026: the previous version called the Claude API
// directly from the browser, which exposes the API key to anyone who opens
// devtools on the deployed site. To revive AI generation later, proxy the call
// through a serverless function (e.g. a Vercel /api route holding the key
// server-side) — the original system prompt and JSON schema are in git history
// (this file, before Build 19).

// Generic 3-node draft the user can rename and extend in the canvas.
export function fallbackWorkflow(description) {
  return {
    name: description.slice(0, 40) || 'Custom Automation',
    category: 'Custom',
    description,
    triggerSummary: 'Custom trigger',
    trigger: { type: 'custom', label: 'Custom trigger' },
    tier: 'starter',
    isFallback: true,
    nodes: [
      { id: 't', type: 'trigger', label: 'When this happens', detail: description.slice(0, 60), next: 'a1', nextElse: null },
      { id: 'a1', type: 'action', label: '⚙ Do this', detail: 'Edit to customize', next: 'end', nextElse: null },
      { id: 'end', type: 'end', label: '✓ Workflow Complete', detail: '', next: null, nextElse: null },
    ],
  }
}
