// Default property / section / activity definitions for the record steps.
// Each property: { key, label, type, locked?, enabled }
// type ∈ Text | Number | Date | Dropdown | Checkbox | Multi-select | Email | Phone

const prop = (label, type = 'Text', extra = {}) => ({
  key: label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
  label,
  type,
  locked: false,
  enabled: false,
  custom: false,
  ...extra,
})

const section = (label, enabled = true) => ({
  key: label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
  label,
  enabled,
})

// ---------- CONTACTS (spec Step 2) ----------
export function defaultContacts() {
  return {
    properties: [
      prop('First Name', 'Text', { locked: true, enabled: true }),
      prop('Last Name', 'Text', { locked: true, enabled: true }),
      prop('Email', 'Email', { locked: true, enabled: true }),
      prop('Phone', 'Phone', { locked: true, enabled: true }),
      prop('Job Title'),
      prop('Department'),
      prop('LinkedIn URL', 'Text'),
      prop('Lead Status', 'Dropdown'),
      prop('Lifecycle Stage', 'Dropdown'),
      prop('Contact Owner', 'Dropdown'),
      prop('Last Activity Date', 'Date'),
      prop('Next Follow-up Date', 'Date'),
      prop('Lead Source', 'Dropdown'),
    ],
    sections: [
      section('About'),
      section('Activity Feed'),
      section('Associated Deals'),
      section('Associated Company'),
      section('Communication History'),
      section('Tasks & Reminders'),
    ],
    activities: [
      { key: 'calls', label: 'Calls', enabled: true },
      { key: 'emails', label: 'Emails', enabled: true },
      { key: 'meetings', label: 'Meetings', enabled: true },
      { key: 'notes', label: 'Notes', enabled: true },
      { key: 'tasks', label: 'Tasks', enabled: true },
      { key: 'form_submissions', label: 'Form Submissions', enabled: false },
      { key: 'deals_created', label: 'Deals Created', enabled: false },
      { key: 'ticket_updates', label: 'Ticket Updates', enabled: false },
    ],
  }
}

// ---------- COMPANIES (spec Step 3) ----------
export function defaultCompanies() {
  return {
    properties: [
      prop('Company Name', 'Text', { locked: true, enabled: true }),
      prop('Domain', 'Text', { locked: true, enabled: true }),
      prop('Annual Revenue', 'Number'),
      prop('Employees', 'Number'),
      prop('City/State', 'Text'),
      prop('Company Owner', 'Dropdown'),
      prop('Lifecycle Stage', 'Dropdown'),
      prop('Lead Status', 'Dropdown'),
      prop('Last Activity Date', 'Date'),
      prop('Next Visit Date', 'Date'),
      prop('Customer Tier', 'Dropdown'),
    ],
    sections: [
      section('About'),
      section('Associated Contacts'),
      section('Open Deals'),
      section('Activity Feed'),
      section('Notes'),
    ],
    activities: [
      { key: 'calls', label: 'Calls', enabled: true },
      { key: 'emails', label: 'Emails', enabled: true },
      { key: 'meetings', label: 'Meetings', enabled: true },
      { key: 'notes', label: 'Notes', enabled: true },
      { key: 'tasks', label: 'Tasks', enabled: false },
    ],
  }
}

// ---------- DEALS (spec Step 4) ----------
export function defaultDeals() {
  return {
    properties: [
      prop('Deal Name', 'Text', { locked: true, enabled: true }),
      prop('Amount', 'Number', { locked: true, enabled: true }),
      prop('Close Date', 'Date', { locked: true, enabled: true }),
      prop('Deal Stage', 'Dropdown', { locked: true, enabled: true }),
      prop('Deal Source', 'Dropdown'),
      prop('Product/Service Line', 'Dropdown'),
      prop('Probability', 'Number'),
      prop('Forecast Category', 'Dropdown'),
      prop('Quote Sent Date', 'Date'),
    ],
    sections: [
      section('About'),
      section('Associated Contacts'),
      section('Associated Company'),
      section('Activity Feed'),
      section('Line Items'),
    ],
    activities: [
      { key: 'calls', label: 'Calls', enabled: true },
      { key: 'emails', label: 'Emails', enabled: true },
      { key: 'meetings', label: 'Meetings', enabled: true },
      { key: 'notes', label: 'Notes', enabled: true },
      { key: 'tasks', label: 'Tasks', enabled: true },
    ],
    pipelineStages: [
      { key: 'prospecting', label: 'Prospecting', probability: 10 },
      { key: 'qualified', label: 'Qualified', probability: 25 },
      { key: 'proposal_sent', label: 'Proposal Sent', probability: 50 },
      { key: 'negotiation', label: 'Negotiation', probability: 75 },
      { key: 'closed_won', label: 'Closed Won', probability: 100 },
      { key: 'closed_lost', label: 'Closed Lost', probability: 0 },
    ],
  }
}

// ---------- TICKETS (spec Step 5) ----------
export function defaultTickets() {
  return {
    properties: [
      prop('Ticket Name', 'Text', { locked: true, enabled: true }),
      prop('Pipeline', 'Dropdown', { locked: true, enabled: true }),
      prop('Status', 'Dropdown', { locked: true, enabled: true }),
      prop('Priority', 'Dropdown'),
      prop('Category', 'Dropdown'),
      prop('Source', 'Dropdown'),
      prop('SLA Due Date', 'Date'),
      prop('Resolution Notes', 'Text'),
    ],
    sections: [
      section('About'),
      section('Associated Contact'),
      section('Associated Company'),
      section('Activity Feed'),
      section('Notes'),
    ],
    activities: [
      { key: 'calls', label: 'Calls', enabled: true },
      { key: 'emails', label: 'Emails', enabled: true },
      { key: 'notes', label: 'Notes', enabled: true },
      { key: 'tasks', label: 'Tasks', enabled: true },
    ],
    pipelineStages: [
      { key: 'new', label: 'New', probability: null },
      { key: 'in_progress', label: 'In Progress', probability: null },
      { key: 'waiting_on_customer', label: 'Waiting on Customer', probability: null },
      { key: 'resolved', label: 'Resolved', probability: null },
      { key: 'closed', label: 'Closed', probability: null },
    ],
  }
}

// Factory for a blank custom property (used by PropertyBuilder "+ Add").
export function blankProperty(label = '', type = 'Text') {
  return { ...prop(label, type), enabled: true, custom: true, key: `custom_${Date.now()}` }
}
