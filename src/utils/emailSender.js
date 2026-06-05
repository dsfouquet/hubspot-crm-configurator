// Email delivery via EmailJS (spec Section 7). Fully wired in build phase 7.
// Until keys are configured, calls no-op gracefully and report a status so the UI
// can still complete the flow (preview unlock doesn't depend on email succeeding).

import { activeViews } from './recommendations'

const env = import.meta.env

function emailjsConfigured() {
  return Boolean(
    env.VITE_EMAILJS_PUBLIC_KEY &&
      env.VITE_EMAILJS_SERVICE_ID &&
      env.VITE_EMAILJS_TEMPLATE_PROSPECT
  )
}

// Build a compact, human-readable config summary for email/PDF payloads.
export function buildConfigSummary(session) {
  const w = session.wizard || {}
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  return {
    name: session.gate?.name || '',
    email: session.gate?.email || '',
    teamType: arr(w.teamType),
    teamSize: w.teamSize || '',
    challenges: arr(w.challenges),
    activities: arr(w.activities),
    contactsProps: session.contacts.properties.filter((p) => p.enabled).length,
    companiesProps: session.companies.properties.filter((p) => p.enabled).length,
    dealStages: session.deals.pipelineStages.map((s) => s.label),
    customObjects: session.customObjects.map((o) => o.plural || o.singular).filter(Boolean),
    workflows: session.workflows.map((wf) => ({ name: wf.name, tier: wf.tier })),
    views: activeViews(session).map((v) => v.name),
    widgets: session.dashboards.widgets,
    dashboardName: session.dashboards.name,
  }
}

// Send both emails (prospect summary + Daniel lead notification).
export async function sendCompletionEmails(session) {
  const summary = buildConfigSummary(session)
  if (!emailjsConfigured()) {
    console.info('[emailSender] EmailJS not configured — skipping send.', summary)
    return { sent: false, reason: 'not_configured' }
  }
  try {
    const emailjs = (await import('@emailjs/browser')).default
    const shared = {
      name: summary.name,
      email: summary.email,
      session_link: `${window.location.origin}${window.location.pathname}?session=${session.sessionId}`,
      summary_json: JSON.stringify(summary, null, 2),
    }
    // Prospect
    await emailjs.send(env.VITE_EMAILJS_SERVICE_ID, env.VITE_EMAILJS_TEMPLATE_PROSPECT, shared, {
      publicKey: env.VITE_EMAILJS_PUBLIC_KEY,
    })
    // Daniel (lead notification) — optional separate template
    if (env.VITE_EMAILJS_TEMPLATE_DANIEL) {
      await emailjs.send(
        env.VITE_EMAILJS_SERVICE_ID,
        env.VITE_EMAILJS_TEMPLATE_DANIEL,
        { ...shared, to_email: env.VITE_DANIEL_EMAIL || '' },
        { publicKey: env.VITE_EMAILJS_PUBLIC_KEY }
      )
    }
    return { sent: true }
  } catch (err) {
    console.warn('[emailSender] send failed:', err)
    return { sent: false, reason: 'error', error: String(err) }
  }
}
