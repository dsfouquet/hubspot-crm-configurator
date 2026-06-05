import { v4 as uuidv4 } from 'uuid'

const STORAGE_PREFIX = 'crescent_session_'

// Spec Section 6: session code = first 6 chars of UUID, uppercased.
export function codeFromUuid(uuid) {
  return uuid.replace(/-/g, '').slice(0, 6).toUpperCase()
}

export function newSessionId() {
  return uuidv4()
}

function storageKey(uuid) {
  return `${STORAGE_PREFIX}${uuid}`
}

export function saveSession(session) {
  try {
    localStorage.setItem(storageKey(session.sessionId), JSON.stringify(session))
  } catch (e) {
    // localStorage can throw in private mode / when full — fail soft.
    console.warn('Session save failed:', e)
  }
}

export function loadSessionByUuid(uuid) {
  try {
    const raw = localStorage.getItem(storageKey(uuid))
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('Session load failed:', e)
    return null
  }
}

// Restore via 6-char code (?code=XXXXXX) — scan stored sessions for a match.
export function loadSessionByCode(code) {
  const target = (code || '').toUpperCase()
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue
      const session = JSON.parse(localStorage.getItem(key))
      if (session?.sessionCode === target) return session
    }
  } catch (e) {
    console.warn('Session code lookup failed:', e)
  }
  return null
}

// Read ?session= / ?code= from the URL on load.
export function readUrlSession() {
  const params = new URLSearchParams(window.location.search)
  return {
    sessionParam: params.get('session'),
    codeParam: params.get('code'),
  }
}

// Append ?session=<uuid> to the URL without a reload.
export function syncUrlSession(uuid) {
  const url = new URL(window.location.href)
  url.searchParams.set('session', uuid)
  window.history.replaceState({}, '', url)
}

export function shareableUrl(uuid) {
  const url = new URL(window.location.href)
  url.searchParams.set('session', uuid)
  return url.toString()
}
