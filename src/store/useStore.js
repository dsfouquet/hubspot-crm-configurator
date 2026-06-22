import { create } from 'zustand'
import {
  newSessionId,
  codeFromUuid,
  saveSession,
  loadSessionByUuid,
  loadSessionByCode,
  readUrlSession,
  readUrlRoute,
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
import { defaultCadence, EOS_MEETINGS, OS_EOS } from '../constants/defaultCadence'

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
    gate: { name: '', email: '', company: '' },
    wizard: {},
    contacts: defaultContacts(),
    companies: defaultCompanies(),
    deals: defaultDeals(),
    tickets: defaultTickets(),
    customObjects: [],
    workflows: [],
    fixPlan: null,
    journey: { overrides: {}, customSteps: [] },
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
// Read-only share routes (/p/<code>, /admin) render their own surfaces and never
// write back to storage. App.jsx branches on this before the normal flow.
const initialRoute = readUrlRoute().route

// Resume a restored session at its first incomplete step (last step if all done).
function resumeStepIndex(session) {
  const steps = stepsForMode(session.mode)
  const completed = session.completedSteps || []
  const firstIncomplete = steps.findIndex((st) => !completed.includes(st.key))
  return firstIncomplete === -1 ? steps.length - 1 : firstIncomplete
}

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

  // Render surface: 'app' (normal configurator), 'preview' (read-only shared
  // link), or 'admin' (passcode-gated library). In 'preview' mode persistence is
  // inert so a prospect's view never writes back to storage.
  viewMode: initialRoute,

  // ---- UI state (not persisted) ----
  currentStep: restored ? resumeStepIndex(initialSession) : 0, // index into the mode's step list
  presenterMode: false,
  advisorOpen: false,
  focusedWorkflowId: null, // which workflow diagram the preview pane shows
  focusedProblemId: null, // which fix-plan problem the preview pane shows
  previewZoom: 1, // presenter zoom on the demo previews (not persisted)
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
      // Never persist in read-only share mode — the shared link must stay clean.
      if (state.viewMode !== 'preview') scheduleSave(next)
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

  // Back to the landing screen (the gate) so the user can re-pick customer vs
  // presenter mode without opening a new tab. Starts a fresh async session.
  resetToHome() {
    const session = buildInitialSession('async')
    saveSession(session)
    syncUrlSession(session.sessionId)
    set({
      session,
      gatePassed: false,
      presenterMode: false,
      advisorOpen: false,
      currentStep: 0,
      restored: false,
      focusedWorkflowId: null,
      focusedProblemId: null,
      previewZoom: 1,
    })
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

  // Set the prospect's identity (name / business / email) without flipping the
  // gate. Captured in Discovery so it personalizes the preview + shared link.
  setGateInfo(patch) {
    get().patchSession((s) => ({ gate: { ...s.gate, ...patch } }))
  },

  // Load a restored session (from code/link). Skips the gate when appropriate.
  loadSession(restoredSession) {
    saveSession(restoredSession)
    syncUrlSession(restoredSession.sessionId)
    set({
      session: restoredSession,
      currentStep: resumeStepIndex(restoredSession),
      gatePassed:
        Boolean(restoredSession.gate?.email) || restoredSession.mode === 'live',
    })
  },

  // Force an immediate (non-debounced) save — used on tab close.
  saveNow() {
    saveSession(get().session)
  },

  // Load a fetched shared session into a read-only preview surface. No save, no
  // URL sync — the prospect's view is ephemeral and never mutates storage.
  hydrateSharedPreview(sharedSession) {
    set({
      session: sharedSession,
      viewMode: 'preview',
      gatePassed: true,
      presenterMode: false,
    })
  },

  // Unlock the final preview (after email gate in async, or immediately in live).
  unlockPreview() {
    get().patchSession({ previewUnlocked: true })
  },

  // Persist the BANT qualification verdict (internal — drives the CTA routing).
  setQualification(q) {
    get().patchSession({ qualification: q })
  },

  // ---- Demo zoom (in-panel magnify of the preview; UI state only) ----
  // Floor 0.25 so the whole board can be fit into view; magnify + scroll above 1.
  zoomIn() {
    set((s) => ({ previewZoom: Math.min(2.5, Math.round((s.previewZoom + 0.25) * 100) / 100) }))
  },
  zoomOut() {
    set((s) => ({ previewZoom: Math.max(0.25, Math.round((s.previewZoom - 0.25) * 100) / 100) }))
  },
  resetZoom() {
    set({ previewZoom: 1 })
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
  // Example list-view column order (drag-to-reorder). Stored as an array of
  // property keys; PreviewRecord falls back to enabled-property order when unset.
  reorderColumn(slice, fromKey, toKey) {
    get().patchSlice(slice, (s) => {
      const order = (s.columnOrder && s.columnOrder.length
        ? s.columnOrder
        : s.properties.filter((p) => p.enabled).map((p) => p.key)
      ).slice()
      const from = order.indexOf(fromKey)
      const to = order.indexOf(toKey)
      if (from < 0 || to < 0 || from === to) return {}
      order.splice(to, 0, order.splice(from, 1)[0])
      return { columnOrder: order }
    })
  },

  // ---- Pipeline stage helpers (Deals / Tickets) ----
  addStage(slice, label) {
    const clean = String(label || '').trim().slice(0, 40)
    if (!clean) return
    const key = clean.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    get().patchSlice(slice, (s) => {
      // Skip exact-duplicate stage labels.
      if (s.pipelineStages.some((st) => st.label.toLowerCase() === clean.toLowerCase()))
        return {}
      return {
        pipelineStages: [
          ...s.pipelineStages,
          { key: `${key}_${Date.now()}`, label: clean, probability: null },
        ],
      }
    })
  },
  renameStage(slice, key, label) {
    const clean = String(label || '').slice(0, 40)
    get().patchSlice(slice, (s) => ({
      pipelineStages: s.pipelineStages.map((st) =>
        st.key === key ? { ...st, label: clean } : st
      ),
    }))
  },
  setStageProbability(slice, key, probability) {
    const clamped =
      probability === null || probability === ''
        ? null
        : Math.max(0, Math.min(100, Number(probability) || 0))
    get().patchSlice(slice, (s) => ({
      pipelineStages: s.pipelineStages.map((st) =>
        st.key === key ? { ...st, probability: clamped } : st
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
    get().patchSession((s) => ({
      journey: { ...s.journey, overrides: {} },
    }))
  },
  // Custom sales-process steps the presenter adds to fit a specific business.
  addJourneyCustomStep(phase, title) {
    const clean = String(title || '').trim().slice(0, 80)
    if (!clean) return
    get().patchSession((s) => ({
      journey: {
        ...s.journey,
        customSteps: [
          ...(s.journey?.customSteps || []),
          { id: `custom_${Date.now()}`, phase, title: clean },
        ],
      },
    }))
  },
  removeJourneyCustomStep(id) {
    get().patchSession((s) => ({
      journey: {
        ...s.journey,
        customSteps: (s.journey?.customSteps || []).filter((c) => c.id !== id),
      },
    }))
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
  // Selecting a business operating system pre-loads its meeting rhythm. EOS
  // meetings are tagged eos:true so switching back to Custom removes just those,
  // leaving the user's own meeting toggles intact.
  setOperatingSystem(os) {
    get().patchSlice('cadence', (c) => {
      const base = (c.meetings || []).filter((m) => !m.eos)
      const meetings =
        os === OS_EOS ? [...EOS_MEETINGS.map((m) => ({ ...m })), ...base] : base
      return { operatingSystem: os, meetings }
    })
  },
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
