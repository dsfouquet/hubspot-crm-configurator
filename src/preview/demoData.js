// Shared realistic demo data for the HubSpot-light preview. Louisiana-flavored,
// internally consistent (same companies/reps/amounts reappear across hubs so the
// demo feels like one real portal, not random lorem ipsum).

export const REPS = ['Marcus Hebert', 'Aimee Landry', 'Catherine Roy', 'You']

export const COMPANIES = [
  { name: 'Gulf Coast Chemical', city: 'Baton Rouge, LA', industry: 'Chemical Mfg', tier: 'Tier 1', lifecycle: 'Customer' },
  { name: 'Bayou Fabrication', city: 'Houma, LA', industry: 'Metal Fabrication', tier: 'Tier 2', lifecycle: 'Customer' },
  { name: 'Pelican Industrial Services', city: 'Gonzales, LA', industry: 'Industrial Services', tier: 'Tier 1', lifecycle: 'Target' },
  { name: 'Acadiana Builders Group', city: 'Lafayette, LA', industry: 'Construction', tier: 'Tier 2', lifecycle: 'Target' },
  { name: 'Crescent City Logistics', city: 'New Orleans, LA', industry: 'Transportation', tier: 'Tier 3', lifecycle: 'Past client' },
  { name: 'Red Stick Mechanical', city: 'Baton Rouge, LA', industry: 'HVAC / Mechanical', tier: 'Tier 2', lifecycle: 'Customer' },
  { name: 'Atchafalaya Marine', city: 'Morgan City, LA', industry: 'Marine Services', tier: 'Tier 3', lifecycle: 'Past client' },
  { name: 'Pontchartrain Packaging', city: 'Slidell, LA', industry: 'Packaging', tier: 'Tier 1', lifecycle: 'Customer' },
  { name: 'Magnolia Healthcare Group', city: 'Baton Rouge, LA', industry: 'Healthcare', tier: 'Tier 2', lifecycle: 'Target' },
  { name: 'Arceneaux Bros. Construction', city: 'Lafayette, LA', industry: 'Construction', tier: 'Tier 3', lifecycle: 'Past client' },
]

// lifecycle: Lead | MQL | Customer | Evangelist | Past client
// decisionMaker + engaged drive the saved-view filters in the CRM demo.
export const CONTACTS = [
  { name: 'Maria Chen', title: 'VP of Operations', company: 'Gulf Coast Chemical', email: 'mchen@gulfcoastchem.com', phone: '(225) 555-0142', owner: 'You', lastActivity: '2 days ago', lifecycle: 'Customer', decisionMaker: true, engaged: true },
  { name: 'James Boudreaux', title: 'Maintenance Manager', company: 'Gulf Coast Chemical', email: 'jboudreaux@gulfcoastchem.com', phone: '(225) 555-0177', owner: 'You', lastActivity: '5 days ago', lifecycle: 'Customer', decisionMaker: false, engaged: true },
  { name: 'Priya Nair', title: 'Procurement Lead', company: 'Pelican Industrial Services', email: 'pnair@pelicanind.com', phone: '(225) 555-0263', owner: 'Marcus Hebert', lastActivity: '1 day ago', lifecycle: 'Lead', decisionMaker: true, engaged: true },
  { name: 'Tommy Guidry', title: 'Owner', company: 'Bayou Fabrication', email: 'tguidry@bayoufab.com', phone: '(985) 555-0314', owner: 'Aimee Landry', lastActivity: '3 hours ago', lifecycle: 'Evangelist', decisionMaker: true, engaged: true },
  { name: 'Sarah Thibodeaux', title: 'Office Manager', company: 'Acadiana Builders Group', email: 'sarah@acadianabuilders.com', phone: '(337) 555-0458', owner: 'Aimee Landry', lastActivity: '1 week ago', lifecycle: 'MQL', decisionMaker: false, engaged: true },
  { name: 'David Okafor', title: 'Plant Manager', company: 'Crescent City Logistics', email: 'dokafor@cclogistics.com', phone: '(504) 555-0529', owner: 'Catherine Roy', lastActivity: '2 weeks ago', lifecycle: 'Past client', decisionMaker: true, engaged: false },
  { name: 'Lauren Fontenot', title: 'Controller', company: 'Red Stick Mechanical', email: 'lfontenot@redstickmech.com', phone: '(225) 555-0671', owner: 'Marcus Hebert', lastActivity: '4 days ago', lifecycle: 'Lead', decisionMaker: true, engaged: false },
  { name: 'Ray Broussard', title: 'Purchasing Manager', company: 'Atchafalaya Marine', email: 'rbroussard@atchmarine.com', phone: '(337) 555-0712', owner: 'You', lastActivity: '4 months ago', lifecycle: 'Past client', decisionMaker: true, engaged: false },
  { name: 'Nicole Tran', title: 'CEO', company: 'Pontchartrain Packaging', email: 'ntran@pontpack.com', phone: '(504) 555-0788', owner: 'Aimee Landry', lastActivity: '6 days ago', lifecycle: 'Customer', decisionMaker: true, engaged: true },
  { name: 'Hank Melancon', title: 'Shop Foreman', company: 'Bayou Fabrication', email: 'hmelancon@bayoufab.com', phone: '(985) 555-0821', owner: 'Aimee Landry', lastActivity: '2 days ago', lifecycle: 'Customer', decisionMaker: false, engaged: true },
  { name: 'Gloria Washington', title: 'Facilities Director', company: 'Magnolia Healthcare Group', email: 'gwashington@magnoliahc.com', phone: '(225) 555-0903', owner: 'Catherine Roy', lastActivity: '3 weeks ago', lifecycle: 'MQL', decisionMaker: true, engaged: true },
  { name: 'Pete Arceneaux', title: 'Owner', company: 'Arceneaux Bros. Construction', email: 'pete@arceneauxbros.com', phone: '(337) 555-0954', owner: 'Marcus Hebert', lastActivity: '5 months ago', lifecycle: 'Past client', decisionMaker: true, engaged: false },
  { name: 'Dana Lirette', title: 'Operations Coordinator', company: 'Pelican Industrial Services', email: 'dlirette@pelicanind.com', phone: '(225) 555-1037', owner: 'Marcus Hebert', lastActivity: '8 days ago', lifecycle: 'Lead', decisionMaker: false, engaged: true },
  { name: 'Marcus Dupre', title: 'VP of Sales', company: 'Pontchartrain Packaging', email: 'mdupre@pontpack.com', phone: '(504) 555-1102', owner: 'You', lastActivity: '1 day ago', lifecycle: 'Evangelist', decisionMaker: true, engaged: true },
  { name: 'Cheryl Naquin', title: 'Office Administrator', company: 'Atchafalaya Marine', email: 'cnaquin@atchmarine.com', phone: '(337) 555-1156', owner: 'Catherine Roy', lastActivity: '7 months ago', lifecycle: 'Past client', decisionMaker: false, engaged: false },
]

export const DEALS = [
  { name: 'Gulf Coast — Vacuum Pump Package', company: 'Gulf Coast Chemical', amount: 84500, stage: 2, closeDate: 'Jun 30, 2026', owner: 'You', age: 12 },
  { name: 'Bayou Fab — Plasma Table Install', company: 'Bayou Fabrication', amount: 47200, stage: 3, closeDate: 'Jun 21, 2026', owner: 'Aimee Landry', age: 8 },
  { name: 'Pelican — Annual Service Contract', company: 'Pelican Industrial Services', amount: 36000, stage: 1, closeDate: 'Jul 15, 2026', owner: 'Marcus Hebert', age: 4 },
  { name: 'Acadiana — Site Equipment Phase 2', company: 'Acadiana Builders Group', amount: 128000, stage: 2, closeDate: 'Aug 1, 2026', owner: 'Aimee Landry', age: 19 },
  { name: 'Red Stick — Chiller Replacement', company: 'Red Stick Mechanical', amount: 62400, stage: 0, closeDate: 'Jul 30, 2026', owner: 'Marcus Hebert', age: 2 },
  { name: 'Crescent City — Fleet Sensors', company: 'Crescent City Logistics', amount: 23800, stage: 1, closeDate: 'Jul 8, 2026', owner: 'Catherine Roy', age: 6 },
  { name: 'Pontchartrain — Line 3 Conveyor Retrofit', company: 'Pontchartrain Packaging', amount: 91500, stage: 3, closeDate: 'Jun 26, 2026', owner: 'You', age: 15 },
  { name: 'Magnolia — Facility Maintenance Contract', company: 'Magnolia Healthcare Group', amount: 54000, stage: 1, closeDate: 'Jul 22, 2026', owner: 'Catherine Roy', age: 9 },
  { name: 'Bayou Fab — Compressor Upgrade', company: 'Bayou Fabrication', amount: 18700, stage: 0, closeDate: 'Jun 18, 2026', owner: 'Aimee Landry', age: 3 },
  { name: 'Atchafalaya — Dock Crane Service', company: 'Atchafalaya Marine', amount: 33200, stage: 2, closeDate: 'Jul 12, 2026', owner: 'Marcus Hebert', age: 22 },
  { name: 'Gulf Coast — Spare Parts Blanket PO', company: 'Gulf Coast Chemical', amount: 42000, stage: 4, closeDate: 'Jun 12, 2026', owner: 'You', age: 5 },
]

export const TICKETS = [
  { name: 'Pump seal leak — Unit 4', company: 'Gulf Coast Chemical', priority: 'High', status: 'In Progress', owner: 'Catherine Roy', age: '1 day' },
  { name: 'Invoice discrepancy — May order', company: 'Red Stick Mechanical', priority: 'Medium', status: 'Waiting on Customer', owner: 'You', age: '3 days' },
  { name: 'Replacement part ETA request', company: 'Bayou Fabrication', priority: 'Low', status: 'New', owner: 'Marcus Hebert', age: '2 hours' },
  { name: 'Training session scheduling', company: 'Acadiana Builders Group', priority: 'Low', status: 'In Progress', owner: 'Aimee Landry', age: '2 days' },
  { name: 'Warranty claim — compressor', company: 'Pelican Industrial Services', priority: 'High', status: 'New', owner: 'Catherine Roy', age: '4 hours' },
  { name: 'Conveyor belt alignment — Line 3', company: 'Pontchartrain Packaging', priority: 'Medium', status: 'In Progress', owner: 'Catherine Roy', age: '1 day' },
  { name: 'Quarterly PM visit scheduling', company: 'Magnolia Healthcare Group', priority: 'Low', status: 'Resolved', owner: 'Aimee Landry', age: '5 days' },
  { name: 'Noise complaint — rooftop unit', company: 'Red Stick Mechanical', priority: 'Medium', status: 'Resolved', owner: 'You', age: '6 days' },
]

// Tasks as a first-class CRM object (HubSpot's 2025 Tasks refresh). type ∈ Call |
// Email | To-do; status ∈ Not started | In progress | Waiting | Completed.
export const TASKS = [
  { name: 'Call Maria Chen — confirm pump selection', type: 'Call', company: 'Gulf Coast Chemical', assignee: 'You', dueDate: 'Jun 23, 2026', priority: 'High', status: 'Not started' },
  { name: 'Send updated SIHI pricing', type: 'Email', company: 'Gulf Coast Chemical', assignee: 'You', dueDate: 'Jun 24, 2026', priority: 'High', status: 'In progress' },
  { name: 'Follow up on plasma table quote', type: 'Email', company: 'Bayou Fabrication', assignee: 'Aimee Landry', dueDate: 'Jun 22, 2026', priority: 'Medium', status: 'Waiting' },
  { name: 'Schedule site visit — Pelican', type: 'To-do', company: 'Pelican Industrial Services', assignee: 'Marcus Hebert', dueDate: 'Jun 25, 2026', priority: 'Medium', status: 'Not started' },
  { name: 'Renewal call — annual service contract', type: 'Call', company: 'Pelican Industrial Services', assignee: 'Marcus Hebert', dueDate: 'Jun 26, 2026', priority: 'High', status: 'Not started' },
  { name: 'Email case study to Acadiana', type: 'Email', company: 'Acadiana Builders Group', assignee: 'Aimee Landry', dueDate: 'Jun 20, 2026', priority: 'Low', status: 'In progress' },
  { name: 'Confirm install window — Line 3', type: 'To-do', company: 'Pontchartrain Packaging', assignee: 'You', dueDate: 'Jun 27, 2026', priority: 'Medium', status: 'Waiting' },
  { name: 'Win-back call — Crescent City', type: 'Call', company: 'Crescent City Logistics', assignee: 'Catherine Roy', dueDate: 'Jun 19, 2026', priority: 'Low', status: 'Completed' },
  { name: 'Send PM schedule to Magnolia', type: 'Email', company: 'Magnolia Healthcare Group', assignee: 'Catherine Roy', dueDate: 'Jun 21, 2026', priority: 'Low', status: 'Completed' },
  { name: 'Prep quote — Red Stick chiller', type: 'To-do', company: 'Red Stick Mechanical', assignee: 'Marcus Hebert', dueDate: 'Jun 28, 2026', priority: 'High', status: 'In progress' },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

// Revenue trend (closed-won by month) — trending up, realistic variance.
export const REVENUE_TREND = [182000, 154000, 217000, 198000, 246000, 261000]

// Pipeline by stage (uses index positions; stages come from the session config).
export const PIPELINE_VALUES = [148000, 226400, 212500, 47200, 261000]

export const REP_PERFORMANCE = [
  { label: 'Aimee Landry', value: 175200 },
  { label: 'You', value: 144500 },
  { label: 'Marcus Hebert', value: 98400 },
  { label: 'Catherine Roy', value: 61300 },
]

export const REP_ACTIVITY = [
  { label: 'Aimee Landry', calls: 64, emails: 188, meetings: 14 },
  { label: 'You', calls: 51, emails: 142, meetings: 12 },
  { label: 'Marcus Hebert', calls: 47, emails: 121, meetings: 9 },
  { label: 'Catherine Roy', calls: 33, emails: 97, meetings: 7 },
]

export const LEAD_SOURCES = [
  { label: 'Referrals', value: 34 },
  { label: 'Website', value: 27 },
  { label: 'Cold outreach', value: 19 },
  { label: 'Repeat clients', value: 15 },
  { label: 'Events', value: 8 },
]

export const EMAIL_PERFORMANCE = {
  sent: 1240,
  openRate: '41.2%',
  clickRate: '6.8%',
  replies: 87,
  trend: [28, 34, 31, 42, 39, 47], // opens % by month
}

export const INVOICES = [
  { number: 'INV-1042', company: 'Gulf Coast Chemical', amount: 42250, status: 'Paid', due: 'Jun 1, 2026' },
  { number: 'INV-1043', company: 'Bayou Fabrication', amount: 23600, status: 'Open', due: 'Jun 20, 2026' },
  { number: 'INV-1044', company: 'Acadiana Builders Group', amount: 64000, status: 'Open', due: 'Jun 28, 2026' },
  { number: 'INV-1038', company: 'Crescent City Logistics', amount: 11900, status: 'Overdue', due: 'May 30, 2026' },
  { number: 'INV-1031', company: 'Red Stick Mechanical', amount: 31200, status: 'Overdue', due: 'May 12, 2026' },
]

export const AR_AGING = [
  { label: 'Current', value: 87600 },
  { label: '1-30 days', value: 23600 },
  { label: '31-60 days', value: 11900 },
  { label: '61-90 days', value: 31200 },
  { label: '90+ days', value: 8400 },
]

export const NPS_DATA = {
  score: 62,
  promoters: 58,
  passives: 27,
  detractors: 15,
  responses: [
    { company: 'Gulf Coast Chemical', score: 9, comment: 'Response time on the Unit 4 issue was outstanding.' },
    { company: 'Bayou Fabrication', score: 10, comment: 'Tommy says y\'all are the only vendor that answers the phone.' },
    { company: 'Crescent City Logistics', score: 6, comment: 'Good work but the quote took too long to arrive.' },
  ],
}

export const KB_ARTICLES = [
  { title: 'How to request a service call', views: 412, helpful: '94%' },
  { title: 'Warranty coverage explained', views: 287, helpful: '89%' },
  { title: 'Preventive maintenance schedule', views: 198, helpful: '96%' },
  { title: 'How to read your invoice', views: 154, helpful: '91%' },
]

export const SEQUENCE_DEMO = {
  name: 'Quote Follow-Up',
  enrolled: 14,
  openRate: '52%',
  replyRate: '21%',
  steps: [
    { day: 'Day 0', type: 'Email', label: 'Quote delivered — confirmation + summary' },
    { day: 'Day 2', type: 'Email', label: 'Check-in: any questions on the quote?' },
    { day: 'Day 5', type: 'Task', label: 'Call task created for deal owner' },
    { day: 'Day 9', type: 'Email', label: 'Case study + gentle nudge' },
    { day: 'Day 14', type: 'Email', label: 'Last touch: timeline check' },
  ],
}

export const MEETINGS_DEMO = [
  { time: 'Today 2:00 PM', with: 'Maria Chen', company: 'Gulf Coast Chemical', type: 'Site walkthrough' },
  { time: 'Tomorrow 9:30 AM', with: 'Tommy Guidry', company: 'Bayou Fabrication', type: 'Quote review' },
  { time: 'Thu 1:00 PM', with: 'Priya Nair', company: 'Pelican Industrial Services', type: 'Contract renewal' },
]

export const DOCUMENTS_DEMO = [
  { name: 'Capabilities Overview.pdf', views: 48, lastViewed: 'Maria Chen · 2h ago' },
  { name: 'Service Contract Template.pdf', views: 31, lastViewed: 'Priya Nair · 1d ago' },
  { name: 'Equipment Spec Sheet.pdf', views: 22, lastViewed: 'Tommy Guidry · 3d ago' },
]

export const FORMS_DEMO = [
  { name: 'Request a Quote', submissions: 47, conversion: '31%' },
  { name: 'Service Call Request', submissions: 38, conversion: '44%' },
  { name: 'Newsletter Signup', submissions: 112, conversion: '12%' },
]

export const CAMPAIGNS_DEMO = [
  { name: 'Spring Maintenance Push', channel: 'Email', leads: 34, revenue: 86400 },
  { name: 'Google Ads — Service Keywords', channel: 'Paid Search', leads: 21, revenue: 47200 },
  { name: 'Trade Show Follow-Up', channel: 'Email + Calls', leads: 18, revenue: 128000 },
  { name: 'Facebook Lead Gen', channel: 'Paid Social', leads: 26, revenue: 23800 },
]
