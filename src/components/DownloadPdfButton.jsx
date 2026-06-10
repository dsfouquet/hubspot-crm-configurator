import { useState } from 'react'
import { useStore } from '../store/useStore'
import { exportBlueprintPdf } from '../utils/pdfExport'

// Reusable "Download PDF" trigger. `variant` controls styling for header vs. action bar.
export default function DownloadPdfButton({ variant = 'header', label = 'Download PDF' }) {
  const session = useStore((s) => s.session)
  const [busy, setBusy] = useState(false)

  const download = async () => {
    setBusy(true)
    await exportBlueprintPdf(session)
    setBusy(false)
  }

  const styles = {
    header:
      'flex items-center gap-1.5 text-sm font-ui font-medium text-hs-text-dark hover:text-hs-navy px-3 py-1.5 rounded-md border border-hs-border hover:border-hs-text-light disabled:opacity-50',
    primary:
      'text-[13px] font-ui font-semibold text-white bg-hs-orange px-4 py-2 rounded-md disabled:opacity-50',
    secondary:
      'text-[13px] font-ui font-medium text-hs-text-dark border border-hs-border px-4 py-2 rounded-md hover:border-hs-text-light disabled:opacity-50',
  }

  return (
    <button onClick={download} disabled={busy} className={styles[variant]} title="Download PDF blueprint">
      {variant === 'header' && <span>⬇</span>}
      {busy ? 'Building PDF…' : label}
    </button>
  )
}
