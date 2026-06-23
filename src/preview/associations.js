// Resolves the records associated with a featured preview record, pulled from the
// shared demo data so the right-rail association cards link to real example records
// (e.g. Maria Chen @ Gulf Coast Chemical → that company's deals, contacts, tickets).
import { COMPANIES, CONTACTS, DEALS, TICKETS, TASKS } from './demoData'
import { SAMPLE } from './sampleData'
import { initials } from './uiIcons'
import { money, DEAL_STAGES_FALLBACK } from './recordHelpers'

const DEFAULT_COMPANY = 'Gulf Coast Chemical'

export function associatedCompany(companyName = DEFAULT_COMPANY) {
  return COMPANIES.find((c) => c.name === companyName) || COMPANIES[0]
}

export function associatedContacts(companyName = DEFAULT_COMPANY, excludeName) {
  const list = CONTACTS.filter((c) => c.company === companyName && c.name !== excludeName)
  return list.length ? list : CONTACTS.filter((c) => c.name !== excludeName).slice(0, 3)
}

export function associatedDeals(companyName = DEFAULT_COMPANY) {
  const list = DEALS.filter((d) => d.company === companyName)
  return list.length ? list : DEALS.slice(0, 2)
}

export function associatedTickets(companyName = DEFAULT_COMPANY) {
  const list = TICKETS.filter((t) => t.company === companyName)
  return list.length ? list : TICKETS.slice(0, 2)
}

export function associatedTasks(companyName = DEFAULT_COMPANY) {
  const list = TASKS.filter((t) => t.company === companyName)
  return list.length ? list : TASKS.slice(0, 2)
}

// Map a clicked demo row → the SAMPLE-shaped featured object PreviewRecord expects
// ({ title, subtitle, initials, company, values }). Unknown property keys fall back
// to the slice's SAMPLE values so the "About" list stays realistic.
export function toFeatured(slice, r, stages) {
  if (!r) return undefined
  const base = SAMPLE[slice]?.values || {}

  if (slice === 'deals') {
    const st = stages?.length ? stages : DEAL_STAGES_FALLBACK
    const idx = Math.min(Math.max(r.stage ?? 0, 0), st.length - 1)
    const stageLabel = st[idx]?.label || base.deal_stage
    return {
      title: r.name,
      subtitle: [money(r.amount), r.closeDate ? `Close ${r.closeDate}` : null].filter(Boolean).join(' · '),
      initials: '$',
      company: r.company,
      values: {
        ...base,
        deal_name: r.name,
        amount: money(r.amount),
        close_date: r.closeDate || base.close_date,
        deal_stage: stageLabel,
      },
    }
  }

  if (slice === 'contacts') {
    const [first, ...rest] = (r.name || '').split(' ')
    return {
      title: r.name,
      subtitle: [r.title, r.company].filter(Boolean).join(' · '),
      initials: initials(r.name),
      company: r.company,
      values: {
        ...base,
        first_name: first || base.first_name,
        last_name: rest.join(' ') || base.last_name,
        email: r.email || base.email,
        phone: r.phone || base.phone,
        job_title: r.title || base.job_title,
        contact_owner: r.owner || base.contact_owner,
        last_activity_date: r.lastActivity || base.last_activity_date,
        lifecycle_stage: r.lifecycle || base.lifecycle_stage,
      },
    }
  }

  if (slice === 'companies') {
    return {
      title: r.name,
      subtitle: [r.city, r.industry].filter(Boolean).join(' · '),
      initials: initials(r.name),
      company: r.name,
      values: {
        ...base,
        company_name: r.name,
        city_state: r.city || base.city_state,
        customer_tier: r.tier || base.customer_tier,
        lifecycle_stage: r.lifecycle || base.lifecycle_stage,
        company_owner: r.owner || base.company_owner,
      },
    }
  }

  if (slice === 'tickets') {
    return {
      title: r.name,
      subtitle: [`${r.priority} priority`, r.status].filter(Boolean).join(' · '),
      initials: initials(r.name),
      company: r.company,
      values: {
        ...base,
        ticket_name: r.name,
        status: r.status || base.status,
        priority: r.priority || base.priority,
      },
    }
  }

  if (slice === 'tasks') {
    return {
      title: r.name,
      subtitle: [r.type, r.dueDate ? `Due ${r.dueDate}` : null, r.priority ? `${r.priority} priority` : null]
        .filter(Boolean)
        .join(' · '),
      initials: '✓',
      company: r.company,
      values: {
        ...base,
        title: r.name,
        task_type: r.type || base.task_type,
        status: r.status || base.status,
        due_date: r.dueDate || base.due_date,
        priority: r.priority || base.priority,
        assigned_to: r.assignee || base.assigned_to,
      },
    }
  }

  return undefined
}
