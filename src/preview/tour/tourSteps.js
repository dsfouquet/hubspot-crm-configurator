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
      title: 'Four record types, one system',
      body: 'Contacts, Companies, Deals, and Tickets. Switch between them up here. Every record stays linked to the others.',
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
