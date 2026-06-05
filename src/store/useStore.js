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
import { STEPS } from '../constants/steps'
import {
  defaultContacts,
  defaultCompanies,
  defaultDeals,
  defaultTickets,
} from '../constants/defaultProperties'

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
    views: [],
    dashboards: { name: 'Sales Command Center', widgets: [] },
    cadence: { meetings: [], rules: [], notifications: [] },
    advisorNotes: '',
    completedSteps: [],
    previewUnlocked: false,
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
  goToStep(index) {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, index))
    set({ currentStep: clamped })
  },
  nextStep() {
    const { currentStep, markStepComplete } = get()
    markStepComplete(currentStep)
    set({ currentStep: Math.min(STEPS.length - 1, currentStep + 1) })
  },
  prevStep() {
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) }))
  },
  markStepComplete(index) {
    const key = STEPS[index]?.key
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

  // ---- Wizard (Step 1) ----
  setWizardAnswer(questionKey, value) {
    get().patchSlice('wizard', { [questionKey]: value })
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
}))
