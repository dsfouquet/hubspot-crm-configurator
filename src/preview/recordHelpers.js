// Shared deal/record helpers used by HubCRM, RecordPopup, associations, and PreviewRecord.
// Extracted so the record preview/popup can reuse them without importing back into HubCRM
// (which would create a circular dependency through PreviewRecord).

export const fmtK = (n) =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n.toLocaleString()}`

// Full-dollar formatter for association cards ("$84,500", matching real HubSpot).
export const money = (n) =>
  typeof n === 'number' ? `$${n.toLocaleString()}` : n

// Default deal pipeline stages used when the session has none configured yet.
export const DEAL_STAGES_FALLBACK = [
  { key: 'appointment', label: 'Appointment scheduled' },
  { key: 'qualified', label: 'Qualified to buy' },
  { key: 'proposal', label: 'Proposal sent' },
  { key: 'negotiation', label: 'In negotiation' },
  { key: 'won', label: 'Closed won' },
]
