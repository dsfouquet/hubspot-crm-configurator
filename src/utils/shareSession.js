// Client helpers for creating and loading shareable read-only preview links.
// This is the app's only network code — keep it small and defensive.

// Strip internal-only fields before a session leaves the browser. Mirrors the
// server-side sanitize in api/_lib.js (defense in depth). The gate (the
// prospect's own name/email) is kept so their preview stays personalized.
export function sanitizeForShare(session) {
  if (!session || typeof session !== 'object') return session
  const { advisorNotes, qualification, ...safe } = session
  return safe
}

// Library label for a session: company (from email domain, falling back to a
// wizard company field if present) + the prospect's name.
export function deriveMeta(session) {
  const name = session?.gate?.name || ''
  const domain = session?.gate?.email?.split('@')[1]?.split('.')[0] || ''
  const fromDomain = domain ? domain[0].toUpperCase() + domain.slice(1) : ''
  const company = session?.wizard?.companyName || fromDomain || ''
  return { company, prospectName: name }
}

// POST the current session, get back { code, url }.
export async function createShareLink(session) {
  const res = await fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session: sanitizeForShare(session),
      meta: deriveMeta(session),
    }),
  })
  if (!res.ok) throw new Error(`Share failed (${res.status})`)
  return res.json()
}

// GET a shared session by code. Returns the session object, or null if missing.
export async function fetchSharedSession(code) {
  if (!code) return null
  try {
    const res = await fetch(`/api/session?id=${encodeURIComponent(code)}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
