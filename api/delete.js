// POST /api/delete?key=<passcode> { code } — revoke a preview link.
// Removes both the session blob and its library index entry. Passcode-gated.
import { del } from '@vercel/blob'
import {
  checkAdminKey,
  parseBody,
  normCode,
  sessionPath,
  readIndex,
  writeJsonAtPath,
  INDEX_PATH,
} from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!checkAdminKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const code = normCode(parseBody(req).code)
  if (!code) return res.status(400).json({ error: 'Missing code' })

  try {
    // del accepts a pathname; deleting a missing blob is a no-op.
    await del(sessionPath(code))

    const index = await readIndex()
    await writeJsonAtPath(INDEX_PATH, index.filter((e) => e.code !== code))

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('delete failed:', e)
    return res.status(500).json({ error: 'Delete failed' })
  }
}
