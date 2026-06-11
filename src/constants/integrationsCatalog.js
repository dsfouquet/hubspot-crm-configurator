// HubSpot App Marketplace integrations catalog, researched June 2026 from
// ecosystem.hubspot.com/marketplace + HubSpot product pages. Used by the
// Journey tab's integration nodes and the searchable picker.
// journeySteps: which journey step ids each integration plugs into.

export const INTEGRATIONS = [
  // Accounting & invoicing
  { name: 'QuickBooks Online', category: 'Accounting & invoicing', blurb: 'Two-way sync of invoices, payments, and contacts', hubspotBuilt: true, journeySteps: ['fulfill', 'quote'] },
  { name: 'Xero', category: 'Accounting & invoicing', blurb: 'Sync invoices and payment status to deals', hubspotBuilt: false, journeySteps: ['fulfill', 'quote'] },
  { name: 'FreshBooks', category: 'Accounting & invoicing', blurb: 'Sync clients and invoices with CRM records', hubspotBuilt: false, journeySteps: ['fulfill'] },
  { name: 'Sage Intacct', category: 'Accounting & invoicing', blurb: 'Sync financial and customer data with HubSpot', hubspotBuilt: false, journeySteps: ['fulfill'] },

  // E-signature & documents
  { name: 'DocuSign', category: 'E-signature & documents', blurb: 'Send and track e-signatures from deal records', hubspotBuilt: false, journeySteps: ['quote'] },
  { name: 'PandaDoc', category: 'E-signature & documents', blurb: 'Create, send, and e-sign docs using CRM data', hubspotBuilt: false, journeySteps: ['quote'] },
  { name: 'Dropbox Sign', category: 'E-signature & documents', blurb: 'Request and track e-signatures inside HubSpot', hubspotBuilt: false, journeySteps: ['quote'] },
  { name: 'Adobe Acrobat Sign', category: 'E-signature & documents', blurb: 'Send agreements for signature from records', hubspotBuilt: false, journeySteps: ['quote'] },

  // Payments
  { name: 'Stripe', category: 'Payments', blurb: 'Card/ACH payments via Commerce Hub or connected account', hubspotBuilt: true, journeySteps: ['quote'] },
  { name: 'HubSpot Payments', category: 'Payments', blurb: 'Native card and ACH collection on quotes/invoices', hubspotBuilt: true, journeySteps: ['quote'] },
  { name: 'GoCardless', category: 'Payments', blurb: 'Recurring bank-debit payments from contacts', hubspotBuilt: false, journeySteps: ['quote', 'retain'] },
  { name: 'Chargebee', category: 'Payments', blurb: 'Subscription billing synced to CRM deals', hubspotBuilt: false, journeySteps: ['retain'] },

  // Calling & SMS
  { name: 'Aircall', category: 'Calling & SMS', blurb: 'Cloud calling with logging and recording in CRM', hubspotBuilt: false, journeySteps: ['direct', 'route'] },
  { name: 'JustCall', category: 'Calling & SMS', blurb: 'Calls and SMS logged automatically to contacts', hubspotBuilt: false, journeySteps: ['direct', 'feedback'] },
  { name: 'CallRail', category: 'Calling & SMS', blurb: 'Call tracking and attribution synced to records', hubspotBuilt: false, journeySteps: ['direct', 'ads'] },
  { name: 'Twilio', category: 'Calling & SMS', blurb: 'Programmable SMS/voice triggered from workflows', hubspotBuilt: false, journeySteps: ['feedback'] },
  { name: 'Sakari', category: 'Calling & SMS', blurb: 'Two-way business SMS inside HubSpot workflows', hubspotBuilt: false, journeySteps: ['feedback', 'retain'] },
  { name: 'Salesmsg', category: 'Calling & SMS', blurb: 'Two-way texting and calling on contact records', hubspotBuilt: false, journeySteps: ['feedback'] },
  { name: 'Kixie', category: 'Calling & SMS', blurb: 'Power dialer with auto call/SMS logging', hubspotBuilt: false, journeySteps: ['route'] },

  // Meetings & scheduling
  { name: 'Google Calendar', category: 'Meetings & scheduling', blurb: 'Two-way calendar sync for the meetings tool', hubspotBuilt: true, journeySteps: ['meeting'] },
  { name: 'Outlook Calendar', category: 'Meetings & scheduling', blurb: 'Microsoft 365 calendar sync with meetings tool', hubspotBuilt: true, journeySteps: ['meeting'] },
  { name: 'Calendly', category: 'Meetings & scheduling', blurb: 'Push booked meetings and contacts into CRM', hubspotBuilt: false, journeySteps: ['meeting'] },
  { name: 'Zoom', category: 'Meetings & scheduling', blurb: 'Meeting links + call recordings for intelligence', hubspotBuilt: false, journeySteps: ['meeting', 'ai_prep'] },
  { name: 'Microsoft Teams', category: 'Meetings & scheduling', blurb: 'Teams meetings, notifications, and record sharing', hubspotBuilt: false, journeySteps: ['meeting', 'handoff'] },
  { name: 'Google Meet', category: 'Meetings & scheduling', blurb: 'Attach Meet links to scheduled meetings', hubspotBuilt: true, journeySteps: ['meeting'] },

  // Email & communication
  { name: 'Gmail', category: 'Email & communication', blurb: 'Send, track, and log emails from inbox to CRM', hubspotBuilt: true, journeySteps: ['direct', 'intel'] },
  { name: 'Outlook', category: 'Email & communication', blurb: 'Email sync, tracking, and logging to records', hubspotBuilt: true, journeySteps: ['direct', 'intel'] },
  { name: 'Slack', category: 'Email & communication', blurb: 'CRM notifications and deal alerts in channels', hubspotBuilt: true, journeySteps: ['stages', 'handoff'] },
  { name: 'Front', category: 'Email & communication', blurb: 'CRM context inside a shared team inbox', hubspotBuilt: false, journeySteps: ['direct'] },

  // Marketing & ads
  { name: 'Google Ads', category: 'Marketing & ads', blurb: 'Manage campaigns and sync ad leads to CRM', hubspotBuilt: true, journeySteps: ['ads'] },
  { name: 'Facebook / Meta Ads', category: 'Marketing & ads', blurb: 'Lead ads with lead sync into HubSpot', hubspotBuilt: true, journeySteps: ['ads'] },
  { name: 'LinkedIn Ads', category: 'Marketing & ads', blurb: 'Lead-gen ads with leads synced to CRM', hubspotBuilt: true, journeySteps: ['ads', 'social'] },
  { name: 'Mailchimp', category: 'Marketing & ads', blurb: 'Sync subscribers and engagement to contacts', hubspotBuilt: false, journeySteps: ['nurture'] },
  { name: 'Typeform', category: 'Marketing & ads', blurb: 'Push form responses into HubSpot as contacts', hubspotBuilt: false, journeySteps: ['form'] },
  { name: 'SurveyMonkey', category: 'Marketing & ads', blurb: 'Survey responses synced to contact records', hubspotBuilt: false, journeySteps: ['feedback'] },
  { name: 'Unbounce', category: 'Marketing & ads', blurb: 'Landing-page leads into the CRM', hubspotBuilt: false, journeySteps: ['form', 'ads'] },
  { name: 'WordPress', category: 'Marketing & ads', blurb: 'Forms and visitor tracking via HubSpot plugin', hubspotBuilt: true, journeySteps: ['search', 'form'] },

  // Social & video
  { name: 'LinkedIn Sales Navigator', category: 'Social & video', blurb: 'Sales Navigator insights on CRM records', hubspotBuilt: false, journeySteps: ['social', 'intel'] },
  { name: 'Vidyard', category: 'Social & video', blurb: 'Embed and track sales videos in emails', hubspotBuilt: false, journeySteps: ['nurture', 'social'] },
  { name: 'Loom', category: 'Social & video', blurb: 'Record and share videos logged to CRM', hubspotBuilt: false, journeySteps: ['nurture'] },

  // Project management & ops
  { name: 'Asana', category: 'Project management & ops', blurb: 'Create and sync tasks/projects from deals', hubspotBuilt: false, journeySteps: ['fulfill', 'handoff'] },
  { name: 'Monday.com', category: 'Project management & ops', blurb: 'Sync deals and contacts to work boards', hubspotBuilt: false, journeySteps: ['fulfill', 'handoff'] },
  { name: 'ClickUp', category: 'Project management & ops', blurb: 'Turn deals into tasks and sync status', hubspotBuilt: false, journeySteps: ['fulfill', 'handoff'] },
  { name: 'Trello', category: 'Project management & ops', blurb: 'Create cards from CRM records and workflows', hubspotBuilt: false, journeySteps: ['fulfill'] },
  { name: 'Jira', category: 'Project management & ops', blurb: 'Link dev/support issues to tickets and contacts', hubspotBuilt: false, journeySteps: ['support'] },
  { name: 'Teamwork', category: 'Project management & ops', blurb: 'Sync clients and projects with CRM deals', hubspotBuilt: false, journeySteps: ['fulfill'] },

  // Data sync & automation
  { name: 'Zapier', category: 'Data sync & automation', blurb: 'Connect HubSpot to thousands of apps, no code', hubspotBuilt: false, journeySteps: ['handoff', 'fulfill'] },
  { name: 'Make', category: 'Data sync & automation', blurb: 'Advanced multi-step automations across apps', hubspotBuilt: false, journeySteps: ['handoff'] },
  { name: 'Operations Hub Data Sync', category: 'Data sync & automation', blurb: 'Native two-way sync with dozens of apps', hubspotBuilt: true, journeySteps: ['handoff', 'fulfill'] },
  { name: 'Supermetrics', category: 'Data sync & automation', blurb: 'HubSpot marketing data into BI/reporting', hubspotBuilt: false, journeySteps: ['ads'] },

  // E-commerce
  { name: 'Shopify', category: 'E-commerce', blurb: 'Sync orders, products, and customers into CRM', hubspotBuilt: true, journeySteps: ['fulfill', 'retain'] },
  { name: 'WooCommerce', category: 'E-commerce', blurb: 'Store orders and customers to HubSpot', hubspotBuilt: false, journeySteps: ['fulfill'] },
  { name: 'BigCommerce', category: 'E-commerce', blurb: 'E-commerce orders and contacts to CRM', hubspotBuilt: false, journeySteps: ['fulfill'] },

  // Customer support
  { name: 'Zendesk', category: 'Customer support', blurb: 'Sync support tickets to contact profiles', hubspotBuilt: false, journeySteps: ['support'] },
  { name: 'Intercom', category: 'Customer support', blurb: 'Chat conversations and contacts to CRM', hubspotBuilt: false, journeySteps: ['support', 'form'] },
  { name: 'Help Scout', category: 'Customer support', blurb: 'Support conversations on the contact timeline', hubspotBuilt: false, journeySteps: ['support'] },
  { name: 'Jira Service Management', category: 'Customer support', blurb: 'Service tickets linked to HubSpot records', hubspotBuilt: false, journeySteps: ['support'] },

  // ERP / industry
  { name: 'NetSuite', category: 'ERP / industry', blurb: 'Customers, orders, and financials synced to CRM', hubspotBuilt: false, journeySteps: ['fulfill', 'quote'] },
  { name: 'SAP', category: 'ERP / industry', blurb: 'ERP customer and order data connected to HubSpot', hubspotBuilt: false, journeySteps: ['fulfill'] },
  { name: 'Microsoft Dynamics 365', category: 'ERP / industry', blurb: 'Contacts and deals synced between systems', hubspotBuilt: false, journeySteps: ['fulfill'] },
  { name: 'Salesforce', category: 'ERP / industry', blurb: 'Native bi-directional contact/deal/activity sync', hubspotBuilt: true, journeySteps: ['handoff'] },
  { name: 'ServiceTitan', category: 'ERP / industry', blurb: 'Field-service jobs and customers synced to CRM', hubspotBuilt: false, journeySteps: ['fulfill', 'support'] },

  // Proposals & CPQ
  { name: 'Proposify', category: 'Proposals & CPQ', blurb: 'Branded proposals populated from deals', hubspotBuilt: false, journeySteps: ['quote'] },
  { name: 'QuoteWerks', category: 'Proposals & CPQ', blurb: 'Quotes/CPQ tied to HubSpot deals', hubspotBuilt: false, journeySteps: ['quote'] },
  { name: 'DealHub', category: 'Proposals & CPQ', blurb: 'CPQ and deal rooms synced with CRM', hubspotBuilt: false, journeySteps: ['quote'] },
]

// Integrations that plug into a given journey step id.
export function integrationsForStep(stepId) {
  return INTEGRATIONS.filter((i) => i.journeySteps.includes(stepId))
}

export function searchIntegrations(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return INTEGRATIONS.filter(
    (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  ).slice(0, 8)
}
