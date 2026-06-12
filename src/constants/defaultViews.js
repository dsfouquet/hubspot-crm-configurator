// View template library for Step 9 (Views & Tabs). Grouped by who uses them;
// chosen templates surface under "Your views" alongside recommended + custom.

export const VIEW_TEMPLATE_GROUPS = [
  {
    group: 'Sales views',
    templates: [
      { id: 'tpl_my_open_deals', name: 'My Open Deals', recordType: 'Deals', description: 'Everything you own, by stage.' },
      { id: 'tpl_closing_this_month', name: 'Deals Closing This Month', recordType: 'Deals', description: 'Close dates inside 30 days.' },
      { id: 'tpl_new_leads_week', name: 'New Leads This Week', recordType: 'Contacts', description: 'Fresh leads needing a first touch.' },
      { id: 'tpl_unworked_leads', name: 'Unworked Leads', recordType: 'Contacts', description: 'Assigned but never contacted.' },
      { id: 'tpl_todays_tasks', name: "Today's Tasks", recordType: 'Contacts', description: 'Calls and follow-ups due today.' },
      { id: 'tpl_hot_deals', name: 'Hot Deals (80%+)', recordType: 'Deals', description: 'High-probability deals to push over the line.' },
    ],
  },
  {
    group: 'Marketing views',
    templates: [
      { id: 'tpl_recent_form_fills', name: 'Recent Form Submissions', recordType: 'Contacts', description: 'Who raised a hand this week.' },
      { id: 'tpl_email_engaged', name: 'Engaged with Email (30d)', recordType: 'Contacts', description: 'Opens and clicks worth a call.' },
      { id: 'tpl_never_emailed', name: 'Never Been Emailed', recordType: 'Contacts', description: 'Contacts your marketing has missed.' },
    ],
  },
  {
    group: 'Service views',
    templates: [
      { id: 'tpl_my_open_tickets', name: 'My Open Tickets', recordType: 'Tickets', description: 'Your queue, oldest first.' },
      { id: 'tpl_sla_risk', name: 'SLA At Risk', recordType: 'Tickets', description: 'Tickets approaching their deadline.' },
      { id: 'tpl_waiting_on_customer', name: 'Waiting on Customer', recordType: 'Tickets', description: 'Blocked on a reply — nudge them.' },
    ],
  },
  {
    group: 'Management views',
    templates: [
      { id: 'tpl_top_customers', name: 'Top Customers by Revenue', recordType: 'Companies', description: 'Your most valuable accounts.' },
      { id: 'tpl_at_risk_accounts', name: 'At-Risk Accounts', recordType: 'Companies', description: 'No activity in 60+ days.' },
      { id: 'tpl_deals_no_next_step', name: 'Deals Missing a Next Step', recordType: 'Deals', description: 'Open deals with nothing scheduled.' },
      { id: 'tpl_this_quarter_won', name: 'Won This Quarter', recordType: 'Deals', description: 'Closed-won, for the scoreboard.' },
    ],
  },
]

export const ALL_VIEW_TEMPLATES = VIEW_TEMPLATE_GROUPS.flatMap((g) => g.templates)
