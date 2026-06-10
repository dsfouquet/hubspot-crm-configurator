// PDF export via html2pdf.js (spec Section 8). Renders the off-screen
// #blueprint-doc into a multi-page A4 PDF that respects per-page breaks.

export async function exportBlueprintPdf(session) {
  const el = document.getElementById('blueprint-doc')
  if (!el) {
    console.warn('[pdfExport] blueprint-doc element not found')
    return { ok: false, reason: 'no_element' }
  }
  const code = session?.sessionCode || 'preview'
  const namePart = (session?.gate?.name || 'HubSpot')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
  const fileName = `${namePart}-HubSpot-Blueprint-${code}.pdf`

  try {
    const html2pdf = (await import('html2pdf.js')).default
    await html2pdf()
      .set({
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(el)
      .save()
    return { ok: true, fileName }
  } catch (err) {
    console.warn('[pdfExport] failed:', err)
    return { ok: false, reason: 'error', error: String(err) }
  }
}
