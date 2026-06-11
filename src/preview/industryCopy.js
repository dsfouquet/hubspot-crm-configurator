// Industry-specific demo copy. The industry chosen in discovery swaps the
// examples across the HubSpot-light preview (newsletter, quote, journey, KB)
// so the demo reads like THEIR business, not a generic one.
// Keyed by the discovery industry options; DEFAULT covers "Other"/unanswered.

const LIBRARY = {
  DEFAULT: {
    searchExample: '"equipment repair near me"',
    adExample: 'your Google ad for emergency service',
    newsletter: {
      title: 'Monthly Field Notes',
      headline: 'Spring is here — is your equipment ready for the season?',
      intro: 'Three quick reads from the field this month, plus an easy way to get ahead of summer downtime.',
      articles: [
        { title: '5 signs your pump seal is about to fail', desc: 'Catch the warning signs early and avoid an unplanned shutdown.' },
        { title: 'How one plant cut downtime 30%', desc: 'A preventive maintenance schedule that actually gets followed.' },
      ],
      cta: 'Schedule spring maintenance',
    },
    quote: {
      number: 'Q-2047',
      billTo: { company: 'Gulf Coast Chemical', contact: 'Maria Chen' },
      lines: [
        { item: 'SIHI LPH 45 Vacuum Pump', price: 61200 },
        { item: 'Installation & commissioning', price: 14800 },
        { item: 'Annual service plan (yr 1)', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['How to request a service call', 'Warranty coverage explained'],
  },

  'Construction / Contracting': {
    searchExample: '"commercial contractor near me"',
    adExample: 'your Google ad for design-build services',
    newsletter: {
      title: 'The Job Site Brief',
      headline: 'Bid season is coming — is your pipeline ready?',
      intro: 'What we\'re seeing on job sites this month, plus a smarter way to stay ahead of schedule slips.',
      articles: [
        { title: '5 change-order mistakes that eat your margin', desc: 'Catch them in the contract phase, not the punch list.' },
        { title: 'How one GC cut bid turnaround in half', desc: 'A pre-construction checklist that actually gets used.' },
      ],
      cta: 'Book a project consult',
    },
    quote: {
      number: 'Q-2047',
      billTo: { company: 'Acadiana Builders Group', contact: 'Sarah Thibodeaux' },
      lines: [
        { item: 'Site prep & foundation package', price: 61200 },
        { item: 'Framing labor & materials', price: 14800 },
        { item: 'Project management (phase 1)', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['How change orders work', 'Project timeline FAQs'],
  },

  'Industrial / Manufacturing': {
    searchExample: '"industrial pump repair Louisiana"',
    adExample: 'your Google ad for emergency equipment service',
    newsletter: {
      title: 'Monthly Field Notes',
      headline: 'Turnaround season is here — is your equipment ready?',
      intro: 'Three quick reads from the field this month, plus an easy way to get ahead of summer downtime.',
      articles: [
        { title: '5 signs your pump seal is about to fail', desc: 'Catch the warning signs early and avoid an unplanned shutdown.' },
        { title: 'How one plant cut downtime 30%', desc: 'A preventive maintenance schedule that actually gets followed.' },
      ],
      cta: 'Schedule a maintenance review',
    },
    quote: {
      number: 'Q-2047',
      billTo: { company: 'Gulf Coast Chemical', contact: 'Maria Chen' },
      lines: [
        { item: 'SIHI LPH 45 Vacuum Pump', price: 61200 },
        { item: 'Installation & commissioning', price: 14800 },
        { item: 'Annual service plan (yr 1)', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['How to request a service call', 'Preventive maintenance schedule'],
  },

  'Professional Services': {
    searchExample: '"business consultant Baton Rouge"',
    adExample: 'your LinkedIn ad for a free assessment',
    newsletter: {
      title: 'The Advisory Letter',
      headline: 'Q3 planning starts now — three moves to make this month',
      intro: 'What our clients are getting right this quarter, plus a free working session to pressure-test your plan.',
      articles: [
        { title: 'The 5 metrics every owner should review monthly', desc: 'Stop drowning in reports — these are the ones that matter.' },
        { title: 'How one client freed up 12 hours a week', desc: 'A delegation framework that survived contact with reality.' },
      ],
      cta: 'Book a strategy session',
    },
    quote: {
      number: 'P-2047',
      billTo: { company: 'Crescent City Logistics', contact: 'David Okafor' },
      lines: [
        { item: 'Operations assessment & roadmap', price: 18500 },
        { item: 'Implementation sprint (6 weeks)', price: 42000 },
        { item: 'Quarterly advisory retainer (yr 1)', price: 24000 },
      ],
      total: 84500,
    },
    kbExamples: ['What to expect in your first engagement', 'How billing works'],
  },

  'Real Estate': {
    searchExample: '"commercial property for lease Lafayette"',
    adExample: 'your Facebook ad for a new listing',
    newsletter: {
      title: 'The Property Report',
      headline: 'Rates moved again — what it means for your next deal',
      intro: 'This month\'s market snapshot, three listings worth a look, and what buyers are asking for right now.',
      articles: [
        { title: 'Just listed: 12,000 sq ft flex space in Gonzales', desc: 'Dock-high doors, fresh TI allowance, motivated owner.' },
        { title: 'Why Q3 is the quiet window for buyers', desc: 'The seasonal pattern most investors miss.' },
      ],
      cta: 'Schedule a property tour',
    },
    quote: {
      number: 'LOI-2047',
      billTo: { company: 'Pelican Industrial Services', contact: 'Priya Nair' },
      lines: [
        { item: 'Lease — 12,000 sq ft (yr 1)', price: 61200 },
        { item: 'Tenant improvements allowance', price: 14800 },
        { item: 'CAM & insurance (yr 1)', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['The leasing process step by step', 'What CAM charges cover'],
  },

  Healthcare: {
    searchExample: '"occupational health clinic near me"',
    adExample: 'your Google ad for same-week appointments',
    newsletter: {
      title: 'The Practice Pulse',
      headline: 'Flu season prep — what employers need to know',
      intro: 'This month: keeping crews healthy, compliance dates to watch, and an easier way to book on-site clinics.',
      articles: [
        { title: 'On-site clinics: what 200 employers learned', desc: 'Participation doubles when you remove the drive.' },
        { title: 'The OSHA dates on your Q3 calendar', desc: 'Three deadlines that sneak up on safety managers.' },
      ],
      cta: 'Book an on-site clinic',
    },
    quote: {
      number: 'Q-2047',
      billTo: { company: 'Crescent City Logistics', contact: 'David Okafor' },
      lines: [
        { item: 'On-site clinic program (annual)', price: 61200 },
        { item: 'DOT physicals & screenings', price: 14800 },
        { item: 'Wellness program setup', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['How to schedule an on-site clinic', 'What screenings include'],
  },

  'Technology / Software': {
    searchExample: '"inventory management software for distributors"',
    adExample: 'your Google ad for a free trial',
    newsletter: {
      title: 'The Product Brief',
      headline: 'New release: the integrations you asked for are live',
      intro: 'What shipped this month, what\'s coming next, and a customer story worth two minutes of your time.',
      articles: [
        { title: 'Feature spotlight: automated reorder points', desc: 'Stop stockouts before they happen — now in every plan.' },
        { title: 'How Bayou Fabrication cut order errors 40%', desc: 'From spreadsheet chaos to one source of truth.' },
      ],
      cta: 'Start your free trial',
    },
    quote: {
      number: 'Q-2047',
      billTo: { company: 'Bayou Fabrication', contact: 'Tommy Guidry' },
      lines: [
        { item: 'Platform license — 25 seats (annual)', price: 61200 },
        { item: 'Implementation & data migration', price: 14800 },
        { item: 'Premium support (yr 1)', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['Getting started guide', 'How to connect your integrations'],
  },

  'Financial / Insurance': {
    searchExample: '"commercial insurance broker Louisiana"',
    adExample: 'your Google ad for a free coverage review',
    newsletter: {
      title: 'The Coverage Brief',
      headline: 'Renewal season: three things to check before you sign',
      intro: 'This month: what\'s moving premiums, a claims story with a happy ending, and a free policy review.',
      articles: [
        { title: 'The exclusion hiding in most GL policies', desc: 'Five minutes of reading that can save a six-figure claim.' },
        { title: 'How one contractor cut premiums 18%', desc: 'A safety program insurers actually reward.' },
      ],
      cta: 'Book a coverage review',
    },
    quote: {
      number: 'PROP-2047',
      billTo: { company: 'Acadiana Builders Group', contact: 'Sarah Thibodeaux' },
      lines: [
        { item: 'General liability — $2M (annual)', price: 61200 },
        { item: 'Commercial auto fleet coverage', price: 14800 },
        { item: 'Umbrella policy — $5M', price: 8500 },
      ],
      total: 84500,
    },
    kbExamples: ['How to file a claim', 'What your policy covers'],
  },
}

// Resolve the copy pack for a session's chosen industry (falls back cleanly).
export function industryCopy(industry) {
  return LIBRARY[industry] || LIBRARY.DEFAULT
}
