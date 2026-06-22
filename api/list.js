// GET /api/list?key=<passcode> — return the preview library index.
// Passcode-gated: this aggregates every prospect, so it must never be public.
import { readIndex, checkAdminKey } from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!checkAdminKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const previews = await readIndex()
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ previews })
  } catch (e) {
    console.error('list failed:', e)
    return res.status(500).json({ error: 'List failed' })
  }
}
