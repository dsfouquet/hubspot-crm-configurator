// Tour copy lives here. Two parts:
//
//   INTRO_STEPS — the opening walk: the left menu, then the Sales Process
//   screen, ending on an "explore on your own" step that hands control back to
//   the viewer and invites them to click any menu item.
//
//   HUB_TOURS — a self-contained mini-tour per menu item. When the viewer clicks
//   a rail item (CRM, Marketing, …) for the first time, that hub's track plays,
//   spotlighting the key regions on THAT screen, then ends. Sales Process has no
//   entry here because the intro already covers it.
//
// Each step: { id, target, title, body, placement, advanceOnTargetClick?,
//              isExplore?, interactiveRail?, finishLabel? }
//   target          — CSS selector to spotlight ([data-tour="…"]); null = centered card
//   placement       — right | left | top | bottom | auto | center (flips to fit)
//   advanceOnTargetClick — clicking the highlighted target advances the tour
//   isExplore       — the hand-off step; clicking a rail item starts that hub's tour
//   interactiveRail — don't block the rail; let the viewer click straight through
//   finishLabel     — label for the last step's primary button (default "Done")

export const INTRO_STEPS = [
  {
    id: 'menu',
    target: '[data-tour="nav-rail"]',
    placement: 'right',
    title: 'This is your main menu',
    body: 'Every part of your CRM lives here. Click any item to jump straight to it. Let’s start with your Sales Process.',
  },
  {
    id: 'nav-journey',
    target: '[data-tour="nav-journey"]',
    placement: 'right',
    advanceOnTargetClick: true,
    title: 'Start with your Sales Process',
    body: 'It shows how a deal moves through your business, from first touch to repeat customer. Click it, or hit Next.',
  },
  {
    id: 'journey-board',
    target: '[data-tour="journey-board"]',
    placement: 'left',
    title: 'Your whole process on one board',
    body: 'Generate, Qualify, Win, Deliver, Keep. Every step a deal goes through, and exactly which ones already run on their own.',
  },
  {
    id: 'journey-search',
    target: '[data-tour="journey-search"]',
    placement: 'bottom',
    title: 'Plug in the tools you already use',
    body: 'Search a tool you already run to see where it fits. Nothing gets ripped out. It all connects to the same CRM.',
  },
  {
    id: 'explore',
    target: '[data-tour="nav-rail"]',
    placement: 'right',
    isExplore: true,
    interactiveRail: true,
    finishLabel: 'Got it',
    title: 'Now explore on your own',
    body: 'Take your time on the Sales Process. When you’re ready, click any section on the left, CRM, Marketing, Sales, and I’ll show you around that screen too.',
  },
]

export const HUB_TOURS = {
  crm: [
    {
      id: 'crm-tabs',
      target: '[data-tour="crm-tabs"]',
      placement: 'bottom',
      title: 'Five record types, one system',
      body: 'Contacts, Companies, Deals, Tasks, and Tickets. Switch between them up here. Every record stays linked to the others.',
    },
    {
      id: 'crm-content',
      target: '[data-tour="crm-content"]',
      placement: 'top',
      title: 'Live views built for how you sell',
      body: 'Saved views filter your records the way your team works. Click any row to see its full history: every call, email, and quote attached.',
    },
  ],
  marketing: [
    {
      id: 'marketing-tabs',
      target: '[data-tour="marketing-tabs"]',
      placement: 'bottom',
      title: 'Email, forms, CTAs, campaigns',
      body: 'Your whole marketing engine in one place. Switch between sections up here.',
    },
    {
      id: 'marketing-content',
      target: '[data-tour="marketing-content"]',
      placement: 'top',
      title: 'Sends and captures on autopilot',
      body: 'Branded email and nurture that run themselves, plus forms that turn website visitors into tracked contacts.',
    },
  ],
  sales: [
    {
      id: 'sales-tabs',
      target: '[data-tour="sales-tabs"]',
      placement: 'bottom',
      title: 'Your rep’s daily cockpit',
      body: 'Workspace, sequences, documents, meetings, and analytics. The whole sales day lives here.',
    },
    {
      id: 'sales-content',
      target: '[data-tour="sales-content"]',
      placement: 'top',
      title: 'Your day, organized for you',
      body: 'Today’s tasks, meetings, and pipeline at a glance, with the next action always queued up.',
    },
  ],
  commerce: [
    {
      id: 'commerce-tabs',
      target: '[data-tour="commerce-tabs"]',
      placement: 'bottom',
      title: 'Quote to cash',
      body: 'Quotes, invoices, and payments, all built straight off the deal. Switch sections up here.',
    },
    {
      id: 'commerce-content',
      target: '[data-tour="commerce-content"]',
      placement: 'top',
      title: 'Sign and pay in one link',
      body: 'Send a branded quote, collect the signature and deposit together, and watch payment status land on the record.',
    },
  ],
  service: [
    {
      id: 'service-tabs',
      target: '[data-tour="service-tabs"]',
      placement: 'bottom',
      title: 'Support that doesn’t drop',
      body: 'Help desk, knowledge base, and post-job surveys, all in one place.',
    },
    {
      id: 'service-content',
      target: '[data-tour="service-content"]',
      placement: 'top',
      title: 'Tied to the customer record',
      body: 'Tickets carry owners and SLAs, and service sees the whole sales history, so nothing slips after the sale.',
    },
  ],
  automations: [
    {
      id: 'automations-chips',
      target: '[data-tour="automations-chips"]',
      placement: 'bottom',
      title: 'The work that runs without you',
      body: 'Each one is a workflow: handoffs, follow-ups, alerts, and reminders firing on their own.',
    },
    {
      id: 'automations-canvas',
      target: '[data-tour="automations-canvas"]',
      placement: 'left',
      title: 'A real workflow, mapped out',
      body: 'Every trigger fires the next step automatically, so deals keep moving even on your busiest days.',
    },
  ],
  reporting: [
    {
      id: 'reporting-tabs',
      target: '[data-tour="reporting-tabs"]',
      placement: 'bottom',
      title: 'Every dashboard you need',
      body: 'Business health, sales, rep activity, marketing, and service. Switch views up here.',
    },
    {
      id: 'reporting-content',
      target: '[data-tour="reporting-content"]',
      placement: 'top',
      title: 'Answers without the five-tab chase',
      body: 'Live dashboards that tell you where the business stands. One look, every morning, before 9am.',
    },
  ],
  cadence: [
    {
      id: 'cadence-content',
      target: '[data-tour="cadence-content"]',
      placement: 'top',
      title: 'Your operating rhythm, built in',
      body: 'The meeting cadence and adoption rules that keep the whole team on the CRM, week after week. Software doesn’t create ROI, usage does.',
    },
  ],
}

// Record-detail tours: play once per record type the first time a record popup
// opens (clicking a name in CRM, or a company/deal/ticket). The contact,
// company, and ticket records share PreviewRecord's three-column layout; deals
// add a pipeline board, so they get one extra step.
const recordActions = {
  id: 'record-actions',
  target: '[data-tour="record-actions"]',
  placement: 'auto',
  title: 'Act without leaving the record',
  body: 'Log a note, send an email, make a call, set a task, or book a meeting right here. Every action logs itself to the timeline.',
}

export const RECORD_TOURS = {
  contacts: [
    {
      id: 'record-identity',
      target: '[data-tour="record-identity"]',
      placement: 'auto',
      title: 'Everything about this contact',
      body: 'Name, role, company, and every field you configured, pinned to one panel so nobody hunts for it.',
    },
    recordActions,
    {
      id: 'record-center',
      target: '[data-tour="record-center"]',
      placement: 'auto',
      title: 'Every interaction, logged for you',
      body: 'Overview, Activities, and Intelligence. Every call, email, and meeting lands on this timeline on its own, so the history is never lost.',
    },
    {
      id: 'record-associations',
      target: '[data-tour="record-associations"]',
      placement: 'auto',
      title: 'Linked to the whole relationship',
      body: 'Their company, open deals, and tasks all connect here. Click any one to jump straight to it.',
    },
  ],
  companies: [
    {
      id: 'record-identity',
      target: '[data-tour="record-identity"]',
      placement: 'auto',
      title: 'Everything about this account',
      body: 'The company profile and every field you configured, in one panel.',
    },
    recordActions,
    {
      id: 'record-center',
      target: '[data-tour="record-center"]',
      placement: 'auto',
      title: 'The full account history',
      body: 'Every touch across the relationship, logged automatically, so anyone on your team can pick it up cold.',
    },
    {
      id: 'record-associations',
      target: '[data-tour="record-associations"]',
      placement: 'auto',
      title: 'Every contact, deal, and ticket',
      body: 'The people, deals, and tickets tied to this account all live here. Click to jump to any of them.',
    },
  ],
  tickets: [
    {
      id: 'record-identity',
      target: '[data-tour="record-identity"]',
      placement: 'auto',
      title: 'Everything about this ticket',
      body: 'Status, priority, owner, and every field you configured, in one panel.',
    },
    recordActions,
    {
      id: 'record-center',
      target: '[data-tour="record-center"]',
      placement: 'auto',
      title: 'The full support history',
      body: 'Every reply, call, and note on this ticket, logged automatically so the customer never has to repeat themselves.',
    },
    {
      id: 'record-associations',
      target: '[data-tour="record-associations"]',
      placement: 'auto',
      title: 'Tied to the customer',
      body: 'The contact, company, and related deals behind this ticket, one click away.',
    },
  ],
  deals: [
    {
      id: 'record-identity',
      target: '[data-tour="record-identity"]',
      placement: 'auto',
      title: 'Everything about this deal',
      body: 'Amount, stage, close date, and every field you configured, pinned in one place.',
    },
    recordActions,
    {
      id: 'record-center',
      target: '[data-tour="record-center"]',
      placement: 'auto',
      title: 'Every touch on the deal',
      body: 'Calls, emails, and meetings auto-logged, so the deal’s whole story sits on one timeline.',
    },
    {
      id: 'record-associations',
      target: '[data-tour="record-associations"]',
      placement: 'auto',
      title: 'The people and company behind it',
      body: 'Contacts, the company, line items, and tasks all linked here. Click to follow any thread.',
    },
  ],
  tasks: [
    {
      id: 'record-identity',
      target: '[data-tour="record-identity"]',
      placement: 'auto',
      title: 'Everything about this task',
      body: 'Type, due date, priority, owner, and every field you configured, pinned to one panel.',
    },
    recordActions,
    {
      id: 'record-center',
      target: '[data-tour="record-center"]',
      placement: 'auto',
      title: 'The full task history',
      body: 'Notes, emails, and calls tied to this task land on one timeline, so the context is never lost.',
    },
    {
      id: 'record-associations',
      target: '[data-tour="record-associations"]',
      placement: 'auto',
      title: 'Linked to the contact and deal',
      body: 'The contact, company, and deal behind this task, one click away.',
    },
  ],
}

// Track id used to remember a record tour as seen (one per record type).
export const recordTrackId = (slice) => `record:${slice}`

// Per-tab tours: a one-step callout that plays the first time a top sub-tab is
// clicked in a hub view. Each spotlights that hub's content area (which is now
// showing the clicked tab) with copy specific to the tab. Built from a compact
// { hub: { tab: body } } table so the copy stays easy to scan and tune.
const TAB_COPY = {
  crm: {
    Contacts: 'Every person you do business with. Saved views filter them the way you sell, and each record carries its full history.',
    Companies: 'The accounts behind your contacts. Group, tier, and track every company in one place.',
    Deals: 'Your pipeline as a board, table, or calendar. Move a deal forward and the automations fire on their own.',
    Tasks: 'Every to-do, call, and follow-up as a tracked task. View them as a table or a board, with due dates, priorities, and owners so nothing falls through.',
    Tickets: 'Support requests as tracked tickets, with owners, priorities, and SLAs so nothing slips.',
  },
  marketing: {
    Email: 'Branded sends and nurture sequences, with open and click rates tracked on every one.',
    Forms: 'Forms that turn website visitors into tracked contacts, then route and follow up automatically.',
    CTAs: 'Calls-to-action you drop on any page, with click-through tracked so you see what converts.',
    Campaigns: 'Every campaign tied to leads and closed revenue, so you know which spend actually pays.',
  },
  sales: {
    Workspace: 'Your rep’s home base: today’s tasks, meetings, and pipeline, with the next move queued up.',
    Sequences: 'Automated email cadences that work your leads on schedule while you’re in the field.',
    Documents: 'Sales collateral you can send and track, so you see what the prospect actually opened.',
    Meetings: 'A booking link that kills the back-and-forth and drops meetings straight on your calendar.',
    Analytics: 'Activity and outcomes by rep, so you coach on the numbers instead of gut feel.',
  },
  commerce: {
    Quotes: 'Branded quotes built off the deal, with e-signature and a payment link in the same place.',
    Invoices: 'Invoices that fire from the deal and sync to your books, so payment status shows on the record.',
    Payments: 'Collect deposits and payments through the CRM, tracked against the deal automatically.',
  },
  service: {
    'Help Desk': 'Every request as a ticket with an owner and an SLA, tied to the customer’s full history.',
    'Knowledge Base': 'Self-serve articles that deflect the repeat questions before they ever become tickets.',
    Surveys: 'Post-job NPS and CSAT that flag unhappy customers before they churn and turn happy ones into reviews.',
  },
  reporting: {
    'Business Health': 'The top-level view of the whole business: pipeline, revenue, and service in one glance.',
    'Sales Overview': 'Pipeline, forecast, and win rates, updated live as deals move.',
    'Rep Activity': 'Calls, emails, and meetings by rep, so effort and outcomes sit side by side.',
    Marketing: 'Lead sources, campaign ROI, and cost per lead, tying marketing spend to revenue.',
    Service: 'Ticket volume, response times, and receivables, so support and cash both stay visible.',
  },
}

// Expand the copy table into the same { hub: { tab: [steps] } } shape the
// controller consumes. Every tab tour is a single step on the hub's content area.
export const TAB_TOURS = Object.fromEntries(
  Object.entries(TAB_COPY).map(([hub, tabs]) => [
    hub,
    Object.fromEntries(
      Object.entries(tabs).map(([tab, body]) => [
        tab,
        [
          {
            id: `tab-${hub}-${tab}`,
            target: `[data-tour="${hub}-content"]`,
            placement: 'top',
            title: tab,
            body,
          },
        ],
      ])
    ),
  ])
)

// Track id used to remember a tab tour as seen (one per hub+tab).
export const tabTrackId = (hub, tab) => `tab:${hub}:${tab}`
