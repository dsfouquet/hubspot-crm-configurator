// GET /api/session?id=<code> — return a shared session for the read-only preview.
// Public (no passcode): these are the prospect-facing preview links.
import { readJsonAtPath, sessionPath, normCode } from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const code = normCode(req.query?.id)
  if (!code) return res.status(400).json({ error: 'Missing id' })

  try {
    const session = await readJsonAtPath(sessionPath(code), null)
    if (!session) return res.status(404).json({ error: 'Not found' })
    res.setHeader('Cache-Control', 'public, max-age=60')
    return res.status(200).json(session)
  } catch (e) {
    console.error('session load failed:', e)
    return res.status(500).json({ error: 'Load failed' })
  }
}
