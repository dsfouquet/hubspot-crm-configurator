import { useState } from 'react'

// Hidden, passcode-gated library of every preview link built. Served at /admin.
// The passcode is held only in component state (never persisted) so a shared
// screen doesn't leak it. All data comes from the gated /api/list endpoint.
export default function PreviewLibrary() {
  const [key, setKey] = useState('')
  const [status, setStatus] = useState('locked') // locked | loading | ready | denied | error
  const [rows, setRows] = useState([])
  const [copied, setCopied] = useState('')

  const load = async () => {
    if (!key.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`/api/list?key=${encodeURIComponent(key)}`)
      if (res.status === 401) return setStatus('denied')
      if (!res.ok) return setStatus('error')
      const data = await res.json()
      setRows(Array.isArray(data.previews) ? data.previews : [])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy link:', url)
    }
    setCopied(url)
    setTimeout(() => setCopied(''), 2000)
  }

  const remove = async (code) => {
    if (!window.confirm(`Delete preview ${code}? The link will stop working.`)) return
    try {
      const res = await fetch(`/api/delete?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) setRows((r) => r.filter((x) => x.code !== code))
    } catch {
      /* leave the row; surface nothing destructive */
    }
  }

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return iso || ''
    }
  }

  if (status !== 'ready') {
    const msg =
      status === 'denied'
        ? 'Wrong passcode.'
        : status === 'error'
          ? 'Something went wrong. Try again.'
          : ''
    return (
      <div className="h-screen flex items-center justify-center bg-hs-canvas p-8">
        <div className="w-full max-w-sm bg-white rounded-xl border border-hs-border shadow-sm overflow-hidden">
          <div className="bg-hs-navy px-6 py-5">
            <h1 className="font-preview font-semibold text-white text-lg">Preview Library</h1>
            <p className="text-[12.5px] font-ui text-white/70 mt-1">
              Enter the passcode to view your shared previews.
            </p>
          </div>
          <div className="p-6 space-y-3">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="Passcode"
              autoFocus
              className="hs-input w-full px-3 py-2 text-sm font-ui"
            />
            {msg && <p className="text-[12.5px] font-ui text-red-600">{msg}</p>}
            <button
              onClick={load}
              disabled={status === 'loading'}
              className="w-full bg-hs-orange hover:bg-hs-orange/90 text-white font-ui font-semibold py-2.5 rounded-md disabled:opacity-60"
            >
              {status === 'loading' ? 'Checking…' : 'Open Library'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-hs-canvas">
      <div className="shrink-0 bg-hs-navy px-6 py-4 flex items-center justify-between">
        <h1 className="font-preview font-semibold text-white text-lg">
          Preview Library <span className="text-white/50 text-sm">({rows.length})</span>
        </h1>
        <button
          onClick={load}
          className="text-[12.5px] font-ui font-medium text-white/80 hover:text-white"
        >
          Refresh
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {rows.length === 0 ? (
          <p className="text-[13px] font-ui text-hs-text-light">
            No previews yet. Build one in presenter mode and click “Copy Preview Link.”
          </p>
        ) : (
          <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-hs-border">
            <thead>
              <tr className="bg-hs-canvas text-[11px] font-ui font-semibold uppercase tracking-wide text-hs-text-light">
                <th className="px-4 py-2.5">Company</th>
                <th className="px-4 py-2.5">Prospect</th>
                <th className="px-4 py-2.5">Created</th>
                <th className="px-4 py-2.5">Code</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-ui text-hs-navy">
              {rows.map((r) => (
                <tr key={r.code} className="border-t border-hs-border">
                  <td className="px-4 py-2.5 font-medium">{r.company || '—'}</td>
                  <td className="px-4 py-2.5">{r.prospectName || '—'}</td>
                  <td className="px-4 py-2.5 text-hs-text-light">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{r.code}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-hs-blue hover:underline"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => copy(r.url)}
                        className="text-hs-navy hover:underline"
                      >
                        {copied === r.url ? 'Copied ✓' : 'Copy link'}
                      </button>
                      <button
                        onClick={() => remove(r.code)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
