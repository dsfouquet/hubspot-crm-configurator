// PDF export via html2pdf.js (spec Section 8). Fully wired in build phase 8.
// Stub for now: lazy-loads html2pdf and renders a given element, or no-ops if absent.

export async function exportPreviewPdf(elementId, fileName = 'HubSpot-Blueprint.pdf') {
  const el = document.getElementById(elementId)
  if (!el) {
    console.warn('[pdfExport] target element not found:', elementId)
    return { ok: false, reason: 'no_element' }
  }
  try {
    const html2pdf = (await import('html2pdf.js')).default
    await html2pdf()
      .set({
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(el)
      .save()
    return { ok: true }
  } catch (err) {
    console.warn('[pdfExport] failed:', err)
    return { ok: false, reason: 'error', error: String(err) }
  }
}
