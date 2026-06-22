// Shared helpers for the preview-share serverless functions.
// Underscore prefix keeps Vercel from turning this into a route.
//
// The Blob store is PRIVATE: blobs require the read-write token to read, so
// nothing here is reachable by URL. All reads go through get()/the token
// server-side; clients only ever see JSON returned by our /api functions.
import { put, get } from '@vercel/blob'

export const SESSION_PREFIX = 'sessions/'
export const INDEX_PATH = 'sessions/index.json'
export const BLOB_ACCESS = 'private'

// 6-char uppercase alphanumeric code (~2.2B space) — unguessable enough for a
// share link, short enough to text.
export function genCode() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
}

export function normCode(raw) {
  return String(raw || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

export function sessionPath(code) {
  return `${SESSION_PREFIX}${code}.json`
}

// Strip internal-only fields the prospect must never see. The gate (their own
// name/email) is intentionally kept: it personalizes the TopBar on the very
// preview built for them. The genuinely private fields are advisorNotes and the
// BANT qualification verdict.
export function sanitizeSession(session) {
  if (!session || typeof session !== 'object') return null
  const { advisorNotes, qualification, ...safe } = session
  return safe
}

// Read a private blob's JSON by pathname (get() resolves the store from the
// token). useCache:false so an overwritten index is always read fresh.
export async function readJsonAtPath(path, fallback) {
  try {
    const result = await get(path, { access: BLOB_ACCESS, useCache: false })
    if (!result || !result.stream) return fallback
    return await new Response(result.stream).json()
  } catch {
    return fallback
  }
}

export async function writeJsonAtPath(path, data) {
  await put(path, JSON.stringify(data), {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

export async function readIndex() {
  const data = await readJsonAtPath(INDEX_PATH, [])
  return Array.isArray(data) ? data : []
}

export function checkAdminKey(req) {
  const provided = req.query?.key || req.headers['x-admin-key']
  const expected = process.env.ADMIN_KEY
  return Boolean(expected) && provided === expected
}

// Vercel auto-parses JSON bodies, but be defensive for raw/string bodies.
export function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'object') return req.body
  try {
    return JSON.parse(req.body)
  } catch {
    return {}
  }
}
