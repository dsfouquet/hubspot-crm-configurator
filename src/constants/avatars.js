// Crescent Connect's 10 market avatars (crescent-connect/CLAUDE.md, May 2026).
// Each avatar pre-loads the customer-mode build: pipeline stages in the
// prospect's language, the custom object their business actually tracks, the
// pains that hit that market hardest, and the workflow templates we install by
// default. This is how a 8-question intake still produces a rich, personalized
// HubSpot preview — the avatar fills in everything the prospect didn't type.

export const AVATARS = {
  'Insurance Agency': {
    code: 'avatar-insurance',
    pipelineStages: ['New Lead', 'Quote Sent', 'Underwriting', 'Bound / Won', 'Lost'],
    salesCycle: 'A few weeks',
    leadSources: ['Referrals', 'Inbound / website'],
    topPains: ['no_reengagement', 'quotes_no_followup', 'tasks_slip'],
    workflows: ['renewal_alert', 'quote_follow_up', 'new_lead_assignment'],
    object: {
      singular: 'Policy',
      plural: 'Policies',
      description: 'Every policy with type, status, and renewal date',
      properties: [
        { label: 'Policy Number', type: 'Text' },
        { label: 'Policy Type', type: 'Dropdown' },
        { label: 'Carrier', type: 'Text' },
        { label: 'Renewal Date', type: 'Date' },
      ],
    },
  },
  'Industrial / B2B': {
    code: 'avatar-industrial',
    pipelineStages: ['Lead', 'Qualified', 'Quote Sent', 'Negotiation', 'Won', 'Lost'],
    salesCycle: '1–3 months',
    leadSources: ['Repeat clients', 'Referrals', 'Cold outreach'],
    topPains: ['quotes_no_followup', 'pipeline_in_head', 'leads_fall_through'],
    workflows: ['quote_follow_up', 'deal_stale_alert', 'closed_lost_reengage'],
    object: {
      singular: 'Equipment',
      plural: 'Equipment',
      description: 'Installed equipment with model, serial, and service history',
      properties: [
        { label: 'Model Number', type: 'Text' },
        { label: 'Serial Number', type: 'Text' },
        { label: 'Location / Unit', type: 'Text' },
        { label: 'Next Service Due', type: 'Date' },
      ],
    },
  },
  'Law Firm': {
    code: 'avatar-legal',
    pipelineStages: ['Inquiry', 'Consultation', 'Engagement Letter Sent', 'Retained', 'Closed'],
    salesCycle: 'A few weeks',
    leadSources: ['Referrals', 'Inbound / website'],
    topPains: ['leads_fall_through', 'tasks_slip', 'inconsistent_onboarding'],
    workflows: ['new_lead_assignment', 'quote_follow_up', 'closed_won_handoff'],
    object: {
      singular: 'Matter',
      plural: 'Matters',
      description: 'Every matter with practice area, status, and key dates',
      properties: [
        { label: 'Practice Area', type: 'Dropdown' },
        { label: 'Matter Status', type: 'Dropdown' },
        { label: 'Responsible Attorney', type: 'Text' },
        { label: 'Statute / Key Deadline', type: 'Date' },
      ],
    },
  },
  'Commercial Contractor': {
    code: 'avatar-commercial',
    pipelineStages: ['Lead', 'Site Visit', 'Bid Submitted', 'Negotiation', 'Awarded', 'Lost'],
    salesCycle: '1–3 months',
    leadSources: ['Referrals', 'Brokers / partners'],
    topPains: ['quotes_no_followup', 'pipeline_in_head', 'reporting_excel_pain'],
    workflows: ['quote_follow_up', 'deal_stale_alert', 'pipeline_stage_mover'],
    object: {
      singular: 'Job',
      plural: 'Jobs',
      description: 'Every job site with status, crew, and linked deals',
      properties: [
        { label: 'Site Address', type: 'Text' },
        { label: 'Job Status', type: 'Dropdown' },
        { label: 'Crew Lead', type: 'Text' },
        { label: 'Target Completion', type: 'Date' },
      ],
    },
  },
  'Hospitality / Events': {
    code: 'avatar-hospitality',
    pipelineStages: ['Inquiry', 'Tour / Tasting', 'Proposal Sent', 'Deposit Received', 'Booked'],
    salesCycle: 'A few weeks',
    leadSources: ['Inbound / website', 'Referrals'],
    topPains: ['no_reengagement', 'leads_fall_through', 'quotes_invoices_split'],
    workflows: ['new_lead_assignment', 'quote_follow_up', 'reengagement_campaign'],
    object: {
      singular: 'Event',
      plural: 'Events',
      description: 'Every booking with date, venue, headcount, and deposits',
      properties: [
        { label: 'Event Date', type: 'Date' },
        { label: 'Venue / Room', type: 'Text' },
        { label: 'Headcount', type: 'Number' },
        { label: 'Deposit Status', type: 'Dropdown' },
      ],
    },
  },
  'Accounting Firm': {
    code: 'avatar-accountants',
    pipelineStages: ['Inquiry', 'Discovery Call', 'Proposal Sent', 'Engagement Signed'],
    salesCycle: 'A few weeks',
    leadSources: ['Referrals', 'Repeat clients'],
    topPains: ['no_reengagement', 'tasks_slip', 'admin_overload'],
    workflows: ['new_contact_welcome', 'qbr_reminder', 'renewal_alert'],
    object: {
      singular: 'Engagement',
      plural: 'Engagements',
      description: 'Client engagements with service type, period, and renewal',
      properties: [
        { label: 'Service Type', type: 'Dropdown' },
        { label: 'Period / Year', type: 'Text' },
        { label: 'Renewal Date', type: 'Date' },
      ],
    },
  },
  'Nonprofit': {
    code: 'avatar-nonprofit',
    pipelineStages: ['New Donor Lead', 'Cultivation', 'Ask Made', 'Committed', 'Renewed'],
    salesCycle: '1–3 months',
    leadSources: ['Events / trade shows', 'Referrals'],
    topPains: ['no_reengagement', 'marketing_email_gap', 'reporting_excel_pain'],
    workflows: ['new_contact_welcome', 'reengagement_campaign', 'renewal_alert'],
    object: {
      singular: 'Grant',
      plural: 'Grants',
      description: 'Grants and major gifts with funder, amount, and deadlines',
      properties: [
        { label: 'Funder', type: 'Text' },
        { label: 'Amount', type: 'Number' },
        { label: 'Application Deadline', type: 'Date' },
        { label: 'Status', type: 'Dropdown' },
      ],
    },
  },
  'Home Services / Trades': {
    code: 'avatar-trades',
    pipelineStages: ['New Call', 'Estimate Scheduled', 'Estimate Sent', 'Approved', 'Job Complete'],
    salesCycle: 'Days',
    leadSources: ['Inbound / website', 'Referrals', 'Paid ads'],
    topPains: ['leads_fall_through', 'quotes_no_followup', 'no_reengagement'],
    workflows: ['new_lead_assignment', 'quote_follow_up', 'reengagement_campaign'],
    object: {
      singular: 'Job',
      plural: 'Jobs',
      description: 'Every job with address, status, and scheduled dates',
      properties: [
        { label: 'Job Address', type: 'Text' },
        { label: 'Job Status', type: 'Dropdown' },
        { label: 'Scheduled Date', type: 'Date' },
      ],
    },
  },
  'Real Estate': {
    code: 'avatar-realestate',
    pipelineStages: ['New Lead', 'Showing', 'Offer', 'Under Contract', 'Closed'],
    salesCycle: '1–3 months',
    leadSources: ['Referrals', 'Inbound / website', 'Paid ads'],
    topPains: ['leads_fall_through', 'no_reengagement', 'tasks_slip'],
    workflows: ['new_lead_assignment', 'deal_stale_alert', 'reengagement_campaign'],
    object: {
      singular: 'Property',
      plural: 'Properties',
      description: 'Listings and properties tied to contacts and deals',
      properties: [
        { label: 'Address', type: 'Text' },
        { label: 'Listing Status', type: 'Dropdown' },
        { label: 'List Price', type: 'Number' },
      ],
    },
  },
  'Med Spa / Aesthetics': {
    code: 'avatar-medspa',
    pipelineStages: ['New Inquiry', 'Consultation Booked', 'Consultation Done', 'Treatment Booked', 'Repeat Client'],
    salesCycle: 'Days',
    leadSources: ['Paid ads', 'Inbound / website', 'Referrals'],
    topPains: ['leads_fall_through', 'no_reengagement', 'surveys_nps_blind'],
    workflows: ['new_lead_assignment', 'new_contact_welcome', 'reengagement_campaign'],
    object: {
      singular: 'Treatment Plan',
      plural: 'Treatment Plans',
      description: 'Treatment plans with service, sessions, and next visit',
      properties: [
        { label: 'Service / Treatment', type: 'Dropdown' },
        { label: 'Sessions Remaining', type: 'Number' },
        { label: 'Next Visit', type: 'Date' },
      ],
    },
  },
}

export const AVATAR_NAMES = Object.keys(AVATARS)

// Same shape as solutionEngine's INDUSTRY_OBJECTS — lets the existing
// industryObjectFor()/buildGlobalScope() paths work for avatar industries too.
export const AVATAR_OBJECTS = Object.fromEntries(
  Object.entries(AVATARS).map(([name, a]) => [name, a.object])
)
