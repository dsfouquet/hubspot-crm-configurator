# Changelog

## Build 19 — Customer funnel mode (June 12, 2026)

The big one: the configurator went from a "design your own CRM" toy to a sales
tool wired into the Crescent Connect funnel.

### Why

The app wasn't integrated into the sales funnel, the discovery questions didn't
map to the actual offers (no BANT qualification, no revenue/tenure questions,
industry options didn't match the 10 market avatars), and the final CTA was a
placeholder Calendly link. A 13-step, 27-question wizard is also too heavy for
a cold prospect arriving from an ad.

### What changed

**Dual-mode flows**
- Customer mode (default): 4 steps — intake → build plan → HubSpot preview →
  routed next-steps CTA. No step sidebar, clean chrome, no internal tools.
- Presenter mode (`mode: 'live'`, entered via the quiet "Presenter session"
  link on the gate): the full 13-step configurator, unchanged, for Daniel's
  live discovery calls.
- `src/constants/steps.js` now exports `CUSTOMER_STEPS` + `stepsForMode(mode)`;
  the store and all step consumers are mode-aware.

**New customer intake (8 questions, one per screen)**
- `src/constants/customerQuestions.js` + `src/steps/CustomerIntake.jsx`.
- BANT qualifiers added: `annualRevenue` and `yearsInBusiness` (new wizard
  keys) + the existing `teamSize`.
- Industry options are the 10 Crescent Connect market avatars.
- Pain checklist is avatar-weighted (their market's top pains first).
- Single-selects auto-advance; progress bar; mobile-friendly tap targets.

**Qualification + routed CTA**
- `src/utils/qualification.js`: qualified = revenue ≥$250K AND ≥1 year in
  business AND team ≥2. Stored on `session.qualification`, never shown to the
  prospect, never rendered in the PDF.
- `src/steps/StepCTA.jsx`: Hormozi-sequenced final screen — build recap, top-3
  leaks plugged, Free CRM Setup value stack ($5,000 anchor, real 4/month cap),
  then the routed CTA. Qualified → book a Free Setup call
  (`VITE_BOOKING_URL`, default meetings-na2.hubspot.com/crescent/crm-demo-call).
  Unqualified → DIY CRM Build Guide (`VITE_DIY_GUIDE_URL`, falls back to
  /free-crm until the page exists), with a quiet "book time with Daniel"
  escape hatch.

**Avatar auto-population**
- `src/constants/avatars.js`: per-avatar pipeline stages (in the prospect's
  own language), custom object (Policies, Matters, Jobs, Events, Grants,
  Treatment Plans...), top pains, default workflows, sales-cycle defaults.
- `src/utils/autoBuild.js`: seeds everything the prospect didn't answer from
  their avatar, runs the existing solution engine, and tops up workflows to a
  3–5 range so the preview is always rich.

**AI workflow generator removed**
- The old Step 7 generator called the Claude API directly from the browser
  with an exposed key — not safe for a public deploy. Removed. The textarea
  now adds an editable draft workflow instead. To revive later: proxy through
  a Vercel serverless function; the prompt/schema are in git history.

**HubSpot design fidelity**
- Verified Canvas tokens (Lorax #FF7A59, Calypso #00A4BD, Obsidian #2D3E50 —
  already in use) and added the missing ones (Koala, Great White, Sorbet,
  navydeep #33475B).
- Component classes in `index.css`: `.hs-btn-primary/secondary/tertiary`
  (3px radius, Sorbet hover), `.hs-input` (Gypsum fill, Calypso focus glow),
  `.hs-table`, `.hs-link`, `.hs-empty-state`.
- The final preview got real product chrome: dark-navy global top bar with
  sprocket mark, search pill personalized to the prospect's company, fake
  settings/notifications/help icons, and an account chip with their initials.
  Rail emoji replaced with inline SVG icons (`src/preview/hubIcons.jsx`).

**Bug/QA fixes**
- FinalGate no longer re-asks for name/email when already captured at the gate.
- Restored sessions resume at the first incomplete step instead of question 1.
- Pipeline stage inputs: empty/whitespace rejected, 40-char cap, duplicate
  labels skipped, probability clamped 0–100.
- ReactFlow lazy-loaded (`LazyWorkflowDiagram`) — main bundle dropped from
  188KB to 141KB gzipped.
- Mobile: intake/CTA single-column, build plan stacks config above preview,
  hub rail collapses to icons. No horizontal scroll at 375px.
- Advisor panel: Escape closes, dialog role, aria-labels. Emoji buttons got
  aria-labels.
- Deleted dead code: `SessionCodeModal.jsx`, `emailSender.js`, EmailJS dep,
  and the EmailJS/Anthropic/Calendly env vars.
- PDF back cover now prints the real booking URL.

### Env vars (build-time, optional — defaults baked in)

| Var | Purpose | Default |
|-----|---------|---------|
| `VITE_BOOKING_URL` | Free Setup call booking | meetings-na2.hubspot.com/crescent/crm-demo-call |
| `VITE_DIY_GUIDE_URL` | DIY guide CTA (unqualified) | crescentconnectla.com/free-crm |

### Still open

- DIY Guide page doesn't exist yet — swap `VITE_DIY_GUIDE_URL` when built.
- AI workflow generation: revive behind a Vercel serverless proxy if wanted.
- Lead capture is localStorage-only — no HubSpot form submission from the
  gate yet (prospect name/email never leaves the browser).
