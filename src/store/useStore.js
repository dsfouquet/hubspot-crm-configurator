import { create } from 'zustand'
import {
  newSessionId,
  codeFromUuid,
  saveSession,
  loadSessionByUuid,
  loadSessionByCode,
  readUrlSession,
  syncUrlSession,
} from '../utils/sessionId'
import { stepsForMode } from '../constants/steps'
import {
  defaultContacts,
  defaultCompanies,
  defaultDeals,
  defaultTickets,
} from '../constants/defaultProperties'
import { defaultWidgets } from '../constants/defaultWidgets'
import { defaultCadence } from '../constants/defaultCadence'

const nowIso = () => new Date().toISOString()

// Build a fresh session payload (spec Section 6 data structure).
function buildInitialSession(mode = 'async') {
  const sessionId = newSessionId()
  return {
    sessionId,
    sessionCode: codeFromUuid(sessionId),
    mode,
    createdAt: nowIso(),
    lastUpdated: nowIso(),
    gate: { name: '', email: '' },
    wizard: {},
    contacts: defaultContacts(),
    companies: defaultCompanies(),
    deals: defaultDeals(),
    tickets: defaultTickets(),
    customObjects: [],
    workflows: [],
    fixPlan: null,
    journey: { overrides: {} },
    views: { off: [], custom: [] },
    dashboards: { name: 'Sales Command Center', widgets: defaultWidgets() },
    cadence: defaultCadence(),
    advisorNotes: '',
    completedSteps: [],
    previewUnlocked: false,
    // BANT qualification result ({ qualified, checks, evaluatedAt }) — set once
    // when the customer intake finishes. Internal routing only: never shown to
    // the prospect and never rendered into the PDF.
    qualification: null,
  }
}

// Resolve which session to load on first paint: URL ?session / ?code, else fresh.
function resolveInitialSession() {
  const { sessionParam, codeParam } = readUrlSession()
  if (sessionParam) {
    const existing = loadSessionByUuid(sessionParam)
    if (existing) return { session: existing, restored: true }
  }
  if (codeParam) {
    const byCode = loadSessionByCode(codeParam)
    if (byCode) return { session: byCode, restored: true }
  }
  return { session: buildInitialSession('async'), restored: false }
}

const { session: initialSession, restored } = resolveInitialSession()

// Debounced persistence (spec Section 6: auto-save on every change, debounced 500ms).
let saveTimer = null
function scheduleSave(session) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveSession(session), 500)
}

export const useStore = create((set, get) => ({
  // ---- Session data ----
  session: initialSession,
  restored,

  // ---- UI state (not persisted) ----
  currentStep: 0, // index into STEPS
  presenterMode: false,
  advisorOpen: false,
  focusedWorkflowId: null, // which workflow diagram the preview pane shows
  focusedProblemId: null, // which fix-plan problem the preview pane shows
  gatePassed: restored
    ? Boolean(initialSession.gate?.email) || initialSession.mode === 'live'
    : false,

  // ---- Core mutation helper ----
  // Patch the session, stamp lastUpdated, and schedule a debounced save.
  patchSession(patch) {
    set((state) => {
      const next =
        typeof patch === 'function'
          ? { ...state.session, ...patch(state.session) }
          : { ...state.session, ...patch }
      next.lastUpdated = nowIso()
      scheduleSave(next)
      return { session: next }
    })
  },

  // Patch a single top-level slice (contacts/companies/deals/etc.).
  patchSlice(slice, patch) {
    get().patchSession((s) => ({
      [slice]: {
        ...s[slice],
        ...(typeof patch === 'function' ? patch(s[slice]) : patch),
      },
    }))
  },

  // ---- Navigation ----
  // The active step list depends on session mode (customer funnel vs presenter).
  steps() {
    return stepsForMode(get().session.mode)
  },
  goToStep(index) {
    const clamped = Math.max(0, Math.min(get().steps().length - 1, index))
    set({ currentStep: clamped })
  },
  nextStep() {
    const { currentStep, markStepComplete } = get()
    markStepComplete(currentStep)
    set({ currentStep: Math.min(get().steps().length - 1, currentStep + 1) })
  },
  prevStep() {
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) }))
  },
  markStepComplete(index) {
    const key = get().steps()[index]?.key
    if (!key) return
    const completed = get().session.completedSteps
    if (!completed.includes(key)) {
      get().patchSession({ completedSteps: [...completed, key] })
    }
  },

  // ---- Mode + UI toggles ----
  togglePresenter() {
    set((state) => ({ presenterMode: !state.presenterMode }))
  },
  toggleAdvisor() {
    set((state) => ({ advisorOpen: !state.advisorOpen }))
  },
  setGatePassed(v) {
    set({ gatePassed: v })
  },

  // Start a live presenter session — skips the email gate (spec 1, live flow).
  startLiveSession() {
    const session = buildInitialSession('live')
    saveSession(session)
    syncUrlSession(session.sessionId)
    set({ session, gatePassed: true, currentStep: 0, restored: false })
  },

  // Begin async session after the name+email gate.
  beginAsyncSession(name, email) {
    const { session } = get()
    syncUrlSession(session.sessionId)
    get().patchSession({ gate: { name, email } })
    set({ gatePassed: true })
  },

  // Advisor private notes (never in prospect-facing output).
  setAdvisorNotes(text) {
    get().patchSession({ advisorNotes: text })
  },

  // Load a restored session (from code/link). Skips the gate when appropriate.
  loadSession(restoredSession) {
    saveSession(restoredSession)
    syncUrlSession(restoredSession.sessionId)
    set({
      session: restoredSession,
      currentStep: 0,
      gatePassed:
        Boolean(restoredSession.gate?.email) || restoredSession.mode === 'live',
    })
  },

  // Force an immediate (non-debounced) save — used on tab close.
  saveNow() {
    saveSession(get().session)
  },

  // Unlock the final preview (after email gate in async, or immediately in live).
  unlockPreview() {
    get().patchSession({ previewUnlocked: true })
  },

  // Persist the BANT qualification verdict (internal — drives the CTA routing).
  setQualification(q) {
    get().patchSession({ qualification: q })
  },

  // ---- Wizard / Discovery (Step 1) ----
  setWizardAnswer(questionKey, value) {
    get().patchSlice('wizard', { [questionKey]: value })
  },

  // ---- Fix Plan (Step 2) ----
  // Apply a generated fix plan + its config patch in one session update.
  applyFixPlan(plan, patch) {
    get().patchSession((s) => ({
      fixPlan: plan,
      workflows: [...s.workflows, ...patch.newWorkflows],
      dashboards: { ...s.dashboards, widgets: patch.widgets },
      cadence: { ...s.cadence, rules: { ...s.cadence.rules, ...patch.rulePatch } },
      deals: patch.stages ? { ...s.deals, pipelineStages: patch.stages } : s.deals,
      customObjects: [...s.customObjects, ...(patch.newCustomObjects || [])],
    }))
  },

  // ---- Record property / section / activity helpers (Steps 2-5) ----
  toggleProperty(slice, key) {
    get().patchSlice(slice, (s) => ({
      properties: s.properties.map((p) =>
        p.key === key && !p.locked ? { ...p, enabled: !p.enabled } : p
      ),
    }))
  },
  addProperty(slice, property) {
    get().patchSlice(slice, (s) => ({ properties: [...s.properties, property] }))
  },
  removeProperty(slice, key) {
    get().patchSlice(slice, (s) => ({
      properties: s.properties.filter((p) => p.key !== key || p.locked),
    }))
  },
  toggleSection(slice, key) {
    get().patchSlice(slice, (s) => ({
      sections: s.sections.map((sec) =>
        sec.key === key ? { ...sec, enabled: !sec.enabled } : sec
      ),
    }))
  },
  addSection(slice, label) {
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    get().patchSlice(slice, (s) => ({
      sections: [...s.sections, { key: `${key}_${Date.now()}`, label, enabled: true }],
    }))
  },
  removeSection(slice, key) {
    get().patchSlice(slice, (s) => ({
      sections: s.sections.filter((sec) => sec.key !== key),
    }))
  },
  moveSection(slice, key, dir) {
    get().patchSlice(slice, (s) => {
      const arr = [...s.sections]
      const i = arr.findIndex((sec) => sec.key === key)
      const j = i + dir
      if (i < 0 || j < 0 || j >= arr.length) return {}
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { sections: arr }
    })
  },
  toggleActivity(slice, key) {
    get().patchSlice(slice, (s) => ({
      activities: s.activities.map((a) =>
        a.key === key ? { ...a, enabled: !a.enabled } : a
      ),
    }))
  },

  // ---- Pipeline stage helpers (Deals / Tickets) ----
  addStage(slice, label) {
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    get().patchSlice(slice, (s) => ({
      pipelineStages: [
        ...s.pipelineStages,
        { key: `${key}_${Date.now()}`, label, probability: null },
      ],
    }))
  },
  renameStage(slice, key, label) {
    get().patchSlice(slice, (s) => ({
      pipelineStages: s.pipelineStages.map((st) =>
        st.key === key ? { ...st, label } : st
      ),
    }))
  },
  setStageProbability(slice, key, probability) {
    get().patchSlice(slice, (s) => ({
      pipelineStages: s.pipelineStages.map((st) =>
        st.key === key ? { ...st, probability } : st
      ),
    }))
  },
  removeStage(slice, key) {
    get().patchSlice(slice, (s) => ({
      pipelineStages: s.pipelineStages.filter((st) => st.key !== key),
    }))
  },
  moveStage(slice, key, dir) {
    get().patchSlice(slice, (s) => {
      const arr = [...s.pipelineStages]
      const i = arr.findIndex((st) => st.key === key)
      const j = i + dir
      if (i < 0 || j < 0 || j >= arr.length) return {}
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { pipelineStages: arr }
    })
  },

  // ---- Automation workflows (Step 7) ----
  addWorkflow(workflow) {
    const id = workflow.id || `wf_${Date.now()}`
    const wf = { ...workflow, id }
    get().patchSession((s) => ({ workflows: [...s.workflows, wf] }))
    set({ focusedWorkflowId: id })
    return id
  },
  removeWorkflow(id) {
    get().patchSession((s) => ({ workflows: s.workflows.filter((w) => w.id !== id) }))
    set((state) => ({
      focusedWorkflowId: state.focusedWorkflowId === id ? null : state.focusedWorkflowId,
    }))
  },
  updateWorkflow(id, patch) {
    get().patchSession((s) => ({
      workflows: s.workflows.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }))
  },
  setFocusedWorkflow(id) {
    set({ focusedWorkflowId: id })
  },
  setFocusedProblem(id) {
    set({ focusedProblemId: id })
  },

  // ---- Customer journey customization ----
  setJourneyOverride(id, enabled) {
    get().patchSession((s) => ({
      journey: {
        ...s.journey,
        overrides: { ...(s.journey?.overrides || {}), [id]: enabled },
      },
    }))
  },
  resetJourneyOverrides() {
    get().patchSession({ journey: { overrides: {} } })
  },
  // True if a template (by templateId) is already added.
  hasTemplate(templateId) {
    return get().session.workflows.some((w) => w.templateId === templateId)
  },

  // ---- Custom objects (Step 6) ----
  addCustomObject() {
    get().patchSession((s) => {
      if (s.customObjects.length >= 5) return {}
      return {
        customObjects: [
          ...s.customObjects,
          {
            id: `obj_${Date.now()}`,
            singular: '',
            plural: '',
            description: '',
            properties: [],
            associations: [],
          },
        ],
      }
    })
  },
  updateCustomObject(id, patch) {
    get().patchSession((s) => ({
      customObjects: s.customObjects.map((o) =>
        o.id === id ? { ...o, ...patch } : o
      ),
    }))
  },
  removeCustomObject(id) {
    get().patchSession((s) => ({
      customObjects: s.customObjects.filter((o) => o.id !== id),
    }))
  },

  // ---- Views & Tabs (Step 8) ----
  // Toggle a recommended view on/off (tracked by its id in views.off).
  toggleRecommendedView(id) {
    get().patchSlice('views', (v) => {
      const off = v.off || []
      return { off: off.includes(id) ? off.filter((x) => x !== id) : [...off, id] }
    })
  },
  // Toggle a library template view on/off (views.templates holds chosen ids).
  toggleTemplateView(id) {
    get().patchSlice('views', (v) => {
      const templates = v.templates || []
      return {
        templates: templates.includes(id)
          ? templates.filter((x) => x !== id)
          : [...templates, id],
      }
    })
  },
  addCustomView(view) {
    get().patchSlice('views', (v) => ({
      custom: [...(v.custom || []), { ...view, id: `view_${Date.now()}` }],
    }))
  },
  removeCustomView(id) {
    get().patchSlice('views', (v) => ({
      custom: (v.custom || []).filter((x) => x.id !== id),
    }))
  },

  // ---- Dashboards (Step 9) ----
  toggleWidget(id) {
    get().patchSlice('dashboards', (d) => {
      const widgets = d.widgets || []
      return {
        widgets: widgets.includes(id)
          ? widgets.filter((w) => w !== id)
          : [...widgets, id],
      }
    })
  },
  setDashboardName(name) {
    get().patchSlice('dashboards', { name })
  },
  addCustomWidget(widget) {
    get().patchSlice('dashboards', (d) => ({
      customWidgets: [...(d.customWidgets || []), { ...widget, id: `widget_${Date.now()}` }],
    }))
  },
  removeCustomWidget(id) {
    get().patchSlice('dashboards', (d) => ({
      customWidgets: (d.customWidgets || []).filter((w) => w.id !== id),
    }))
  },

  // ---- Accountability Cadence (Step 10) ----
  toggleMeeting(key) {
    get().patchSlice('cadence', (c) => ({
      meetings: c.meetings.map((m) =>
        m.key === key ? { ...m, enabled: !m.enabled } : m
      ),
    }))
  },
  setMeetingField(key, field, value) {
    get().patchSlice('cadence', (c) => ({
      meetings: c.meetings.map((m) => (m.key === key ? { ...m, [field]: value } : m)),
    }))
  },
  setRule(field, value) {
    get().patchSlice('cadence', (c) => ({ rules: { ...c.rules, [field]: value } }))
  },
  toggleNotificationChannel(channel) {
    get().patchSlice('cadence', (c) => {
      const channels = c.notifications.channels || []
      return {
        notifications: {
          ...c.notifications,
          channels: channels.includes(channel)
            ? channels.filter((ch) => ch !== channel)
            : [...channels, channel],
        },
      }
    })
  },
  setNotificationFrequency(frequency) {
    get().patchSlice('cadence', (c) => ({
      notifications: { ...c.notifications, frequency },
    }))
  },
}))
