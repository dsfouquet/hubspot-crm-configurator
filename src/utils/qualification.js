// BANT qualification for the customer funnel (Crescent Connect Free CRM Setup
// qualifier: $250K+ revenue, 1+ year in business, 2+ on the team).
// The verdict routes the final CTA — book a Free Setup call vs. the DIY guide.
// It is never displayed to the prospect and never rendered into the PDF.

export const QUALIFYING_REVENUE = ['$250K – $1M', '$1M – $5M', '$5M+']

export function qualify(wizard = {}) {
  const revenueOk = QUALIFYING_REVENUE.includes(wizard.annualRevenue)
  const tenureOk = Boolean(
    wizard.yearsInBusiness && wizard.yearsInBusiness !== 'Less than a year'
  )
  const teamOk = Boolean(wizard.teamSize && wizard.teamSize !== 'Just me (1)')
  return {
    qualified: revenueOk && tenureOk && teamOk,
    checks: { revenueOk, tenureOk, teamOk },
    evaluatedAt: new Date().toISOString(),
  }
}
