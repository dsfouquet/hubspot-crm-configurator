// Plain-English → workflow node JSON via the Claude API (spec 7.7).
// Falls back to a generic 3-node diagram if the key is missing or the call fails.

const SYSTEM_PROMPT = `You are a HubSpot workflow architect.
Convert plain English automation descriptions into structured workflow node JSON.
Return ONLY valid JSON. No preamble, no markdown fences.
Schema:
{
  "name": "string",
  "trigger": { "type": "string", "label": "string" },
  "nodes": [
    { "id": "string", "type": "trigger|condition|action|delay|end",
      "label": "string", "detail": "string",
      "next": "nodeId or null",
      "nextElse": "nodeId or null (conditions only)" }
  ],
  "tier": "free|starter|pro|enterprise"
}
Every workflow must start with exactly one trigger node and end in at least one end node.
Keep labels short (under 6 words). Use emoji prefixes on action labels where natural.`

// Generic fallback diagram when AI is unavailable (spec 7.7).
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

export async function generateWorkflowFromText(description) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  const model = import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-sonnet-4-6'

  // No key configured → graceful fallback, flagged so the UI can explain.
  if (!apiKey) {
    return { ...fallbackWorkflow(description), _reason: 'no_api_key' }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Required for direct browser calls.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: description }],
      }),
    })

    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json()
    const text = data.content?.find((b) => b.type === 'text')?.text || ''
    const parsed = JSON.parse(text)

    // Minimal shape validation.
    if (!parsed.nodes?.length || !parsed.nodes.some((n) => n.type === 'trigger')) {
      throw new Error('Invalid workflow shape')
    }
    return {
      ...parsed,
      category: 'Custom',
      description,
      triggerSummary: parsed.trigger?.label || 'Custom trigger',
    }
  } catch (err) {
    console.warn('Workflow generation failed, using fallback:', err)
    return { ...fallbackWorkflow(description), _reason: 'error', _error: String(err) }
  }
}
