// Declarative step list for the CRM preview guided tour. This is the single
// source of all tour copy — tune wording here. Each step:
//   id        — stable key
//   hub        — which hub must be active for this step (the controller calls
//                setHub(hub) on enter; null = hub-agnostic, e.g. menu intro / finish)
//   target     — CSS selector for the element to spotlight ([data-tour="…"]);
//                null = no spotlight (centered card, used for the finish step)
//   title/body — callout copy
//   placement  — preferred callout side: right | left | top | bottom | auto | center
//   advanceOnTargetClick — clicking the highlighted target advances the tour
//   isFinish   — last step; the primary button reads "Finish" and ends the tour
//
// Flow: menu intro → invite a click on Sales Process → walk each hub in rail
// order (highlight its rail button with the page already switched behind it,
// then spotlight 1-2 key regions on that page) → closing card.

export const TOUR_STEPS = [
  {
    id: 'menu',
    hub: null,
    target: '[data-tour="nav-rail"]',
    placement: 'right',
    title: 'This is your main menu',
    body: 'Every part of your CRM lives here. Click any item to jump straight to it. Let’s take a quick walk through each one.',
  },
  {
    id: 'nav-journey',
    hub: 'journey',
    target: '[data-tour="nav-journey"]',
    placement: 'right',
    advanceOnTargetClick: true,
    title: 'Start with your Sales Process',
    body: 'Sales Process shows how a deal moves through your business, from first touch to repeat customer. Click it, or hit Next.',
  },
  {
    id: 'journey-board',
    hub: 'journey',
    target: '[data-tour="journey-board"]',
    placement: 'left',
    title: 'Your whole process on one board',
    body: 'Generate, Qualify, Win, Deliver, Keep. Every step a deal goes through, and exactly which ones already run on their own.',
  },
  {
    id: 'journey-search',
    hub: 'journey',
    target: '[data-tour="journey-search"]',
    placement: 'bottom',
    title: 'Plug in the tools you already use',
    body: 'Search a tool you already run to see where it fits. Nothing gets ripped out. It all connects to the same CRM.',
  },
  {
    id: 'nav-crm',
    hub: 'crm',
    target: '[data-tour="nav-crm"]',
    placement: 'right',
    title: 'CRM: your single source of truth',
    body: 'Every contact, company, deal, and ticket in one place. Nothing stuck in a spreadsheet or someone’s inbox.',
  },
  {
    id: 'crm-tabs',
    hub: 'crm',
    target: '[data-tour="crm-tabs"]',
    placement: 'bottom',
    title: 'Contacts, Companies, Deals, Tickets',
    body: 'Switch between record types up here. Same relationship, every angle, always linked together.',
  },
  {
    id: 'crm-content',
    hub: 'crm',
    target: '[data-tour="crm-content"]',
    placement: 'top',
    title: 'Saved views built for how you sell',
    body: 'Live tables filtered the way your team works. Click any record to see its full history: every call, email, and quote attached.',
  },
  {
    id: 'nav-marketing',
    hub: 'marketing',
    target: '[data-tour="nav-marketing"]',
    placement: 'right',
    title: 'Marketing that pays for itself',
    body: 'Email, forms, landing pages, and campaigns run from here, and every dollar of spend ties back to revenue won.',
  },
  {
    id: 'marketing-content',
    hub: 'marketing',
    target: '[data-tour="marketing-content"]',
    placement: 'top',
    title: 'Branded email and forms, on autopilot',
    body: 'Newsletters and nurture sequences that send themselves, plus forms that turn website visitors into tracked contacts automatically.',
  },
  {
    id: 'nav-sales',
    hub: 'sales',
    target: '[data-tour="nav-sales"]',
    placement: 'right',
    title: 'Sales: your rep’s daily cockpit',
    body: 'Today’s tasks, meetings, and deals in one view, with the next action always queued up.',
  },
  {
    id: 'sales-content',
    hub: 'sales',
    target: '[data-tour="sales-content"]',
    placement: 'top',
    title: 'Your day, organized for you',
    body: 'Tasks, meetings, and pipeline at a glance, plus sequences that keep working leads while you’re out in the field.',
  },
  {
    id: 'nav-commerce',
    hub: 'commerce',
    target: '[data-tour="nav-commerce"]',
    placement: 'right',
    title: 'Commerce: quote to cash',
    body: 'Quotes, e-signatures, invoices, and payments, all built straight off the deal you just closed.',
  },
  {
    id: 'commerce-content',
    hub: 'commerce',
    target: '[data-tour="commerce-content"]',
    placement: 'top',
    title: 'Sign and pay through one link',
    body: 'Send a branded quote, collect the signature and deposit in the same motion, and watch payment status land on the record.',
  },
  {
    id: 'nav-service',
    hub: 'service',
    target: '[data-tour="nav-service"]',
    placement: 'right',
    title: 'Service: nothing slips after the sale',
    body: 'Problems become tracked tickets with owners and SLAs, so the customer you fought to win never feels dropped.',
  },
  {
    id: 'service-content',
    hub: 'service',
    target: '[data-tour="service-content"]',
    placement: 'top',
    title: 'Tickets, knowledge base, and surveys',
    body: 'All tied to the same customer record your sales team built, so service already knows the whole story.',
  },
  {
    id: 'nav-automations',
    hub: 'automations',
    target: '[data-tour="nav-automations"]',
    placement: 'right',
    title: 'Automations: the engine room',
    body: 'This is the work that runs without you: handoffs, follow-ups, alerts, and reminders firing on their own.',
  },
  {
    id: 'automations-canvas',
    hub: 'automations',
    target: '[data-tour="automations-canvas"]',
    placement: 'left',
    title: 'A real workflow, mapped out',
    body: 'Each trigger fires the next step automatically, so deals keep moving even on the days you’re slammed.',
  },
  {
    id: 'nav-reporting',
    hub: 'reporting',
    target: '[data-tour="nav-reporting"]',
    placement: 'right',
    title: 'Reporting: your command center',
    body: 'Pipeline, revenue, rep activity, and marketing ROI, updated live as the work happens.',
  },
  {
    id: 'reporting-content',
    hub: 'reporting',
    target: '[data-tour="reporting-content"]',
    placement: 'top',
    title: 'Answers without the five-tab chase',
    body: 'Dashboards that tell you where the business stands. One look, every morning, before 9am.',
  },
  {
    id: 'nav-cadence',
    hub: 'cadence',
    target: '[data-tour="nav-cadence"]',
    placement: 'right',
    title: 'Accountability keeps it running',
    body: 'The meeting rhythm and adoption rules that make sure the CRM actually gets used, not just installed.',
  },
  {
    id: 'cadence-root',
    hub: 'cadence',
    target: '[data-tour="cadence-content"]',
    placement: 'top',
    title: 'Your operating rhythm, built in',
    body: 'The CRM only pays off when it’s worked. This is what keeps the whole team on it, week after week.',
  },
  {
    id: 'finish',
    hub: null,
    target: null,
    placement: 'center',
    isFinish: true,
    title: 'That’s your CRM, end to end',
    body: 'Every step connected, the busywork automated, and the relationships you’ve already earned finally working for you. Download the blueprint or book a call whenever you’re ready.',
  },
]
