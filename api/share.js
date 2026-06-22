// POST /api/share — store a sanitized session, return a short share link.
import { put } from '@vercel/blob'
import {
  genCode,
  sessionPath,
  sanitizeSession,
  readIndex,
  writeJsonAtPath,
  INDEX_PATH,
  BLOB_ACCESS,
  parseBody,
} from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = parseBody(req)
    const session = sanitizeSession(body.session)
    if (!session) return res.status(400).json({ error: 'Missing session' })

    const code = genCode()
    await put(sessionPath(code), JSON.stringify(session), {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    })

    const proto = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const url = `${proto}://${host}/p/${code}`

    // Append to the (passcode-gated) library index. Best-effort: a failed index
    // write must not fail the share itself.
    try {
      const meta = body.meta || {}
      const index = await readIndex()
      index.unshift({
        code,
        company: String(meta.company || '').slice(0, 120),
        prospectName: String(meta.prospectName || '').slice(0, 120),
        url,
        createdAt: new Date().toISOString(),
      })
      await writeJsonAtPath(INDEX_PATH, index)
    } catch (e) {
      console.warn('Index update failed:', e)
    }

    return res.status(200).json({ code, url })
  } catch (e) {
    console.error('share failed:', e)
    return res.status(500).json({ error: 'Share failed' })
  }
}
