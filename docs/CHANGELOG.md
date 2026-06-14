# Changelog

## Build 24 — Researched pains + RevOps, zoom redo, journey/cadence polish (June 13, 2026 · pm)

- **Deeper, researched pains + RevOps section (Q6).** The intake's journey-grouped
  pains are now a curated ~17-pain set across 5 stages — Marketing, Sales,
  Service & Retention, Operations, and a new **RevOps "tie it all together"**
  climax (Sync / Handoffs / Close rate). Grounded in Daniel's documented 12-pain
  library, avatar hooks, and the RevOps positioning brief. Added 2 new pains with
  full SOLUTION_MAP entries: **key-person risk** (bus factor) and **handoff-void**
  (leads die between teams). They flow into the fix plan, topLeak, and autoBuild.
- **Researched "I want…" outcomes (Q8).** Expanded the goal quick-picks to 8
  outcome statements mirroring the pains (stop losing deals to slow follow-up,
  close more quotes, pipeline visible without 5 tabs, one system instead of five…).
- **Step 2 Build Plan: animated accordion.** Cards now smoothly expand/collapse —
  clicking one animates the open card closed while the next opens (grid-rows height
  transition), instead of an instant jump.
- **Zoom redone correctly.** The layout now always stays full-screen; the zoom
  magnifies ONLY the demo content (transform-scale, like the Automations ReactFlow
  controls), with a −/%/+ control bottom-left. The hub rail, top bar, and app
  chrome stay fixed. Applies to the hub demo (rail-fixed) and every presenter
  per-step preview; removed from the Build Plan (it's a document).
- **Deals: click an example → single record.** Clicking a deal card now opens just
  that deal's record (header, stage-progress bar, "About this deal" properties,
  activity timeline) — no kanban board inside the modal.
- **Journey: always-visible handoffs + first-timer review.** Department handoffs
  (Marketing→Sales, Sales→Commerce, Sales→Operations, Operations→Service) now render
  at the phase boundaries regardless of which steps are enabled, so Marketing→Sales
  always shows. Added plain-language phase sublabels (Get found / Capture & qualify
  / Win the deal / Do the work / Keep & grow), a "how to read this" helper, a
  "Start here" marker, and tightened copy for someone evaluating a CRM with fresh
  eyes.
- **Accountability: unified, collapsible sections.** All four sections (Why this
  matters, Team Cadence, Accountability Rules, Notifications) now share one navy
  header + icon + chevron pattern and collapse/expand smoothly, each with a summary
  line so a collapsed card still informs.


## Build 23 — Presenter zoom, journey spotlight, hub interactivity, 3-card CTA (June 13, 2026)

A large review round after Daniel presented the demo. Ten items.

- **A — Zoom control.** Every presenting surface (presenter step-previews, the
  HubSpot hub demo, and the customer Build Plan) gets a floating zoom control
  (−/%/+, click % to reset). Uses CSS `zoom`, range 75%–250%, persists across
  steps. `previewZoom` store state + `src/preview/ZoomFrame.jsx` (owns scroll).
- **B — Journey-ordered sectioned pains.** Customer intake Q6 is now grouped
  into a mini customer journey: Marketing → Sales → Service & Retention → Ops,
  with section captions. Leads sit under Marketing; Quotes/Pipeline/Tasks under
  Sales. Pain ids are unchanged, so qualification/topLeak/autoBuild are
  unaffected. `JOURNEY_STAGES` + `PAIN_STAGE` + `customerPainGroups()` in
  customerQuestions.js; grouped rendering in QuestionControl.
- **C — Journey card spotlight.** Clicking a journey card now zooms it from its
  position to a centered, enlarged panel (phase chip, icon, layered detail,
  tools, integrations) and shrinks back to its spot on close — replacing the
  old right-side drawer. New reusable `src/preview/Spotlight.jsx` (FLIP
  animation, portals to body so the zoom layer doesn't clip it).
- **D — CRM views fixed + described.** Recommended views (Cold Call Queue,
  Sequence Enrollment Queue, etc.) were inert `<span>`s — now real clickable
  tabs with working filters (`RECOMMENDED_FILTERS`). Every view (Contacts,
  Companies, Deals, Tickets) shows a plain-English filter description on select.
- **E — Bounced email status** added to the Marketing Email tab (stat + a
  red Bounced segment in a delivery-breakdown bar).
- **F — Interactive sales workspace.** Call/email/to-do tasks, meetings, and
  documents are clickable: call → in-app call window, email → compose window,
  to-do → associated record, meeting → contact card. Documents show a
  view-duration + per-page notification.
- **G — Workflow stage spotlight.** Clicking a workflow node zooms it to center
  (same Spotlight) with a kind badge and a plain-English explanation of what
  that stage does — replacing the old bottom popover.
- **H — Business Health reporting.** New executive dashboard (first tab): total
  + recurring revenue, pipeline coverage, NPS, and a RevOps scorecard with
  green/amber/red KPI status.
- **I — Accountability ROI panel.** PreviewCadence leads with a "why this
  matters" adoption→ROI story (3-step timeline + insight cards): software
  doesn't create ROI, usage does.
- **J — Step 4 of 4 redesign.** Selection overview + all three offer cards
  always shown (Free / Core / Retainer), best fit highlighted, with reasons.
  When scope exceeds the Free Setup, the Free card explains exactly why
  (multi-hub, branching automations, custom objects, integrations, big import)
  while still listing what it would do. `freeBlockers` added to offerScoper.js.

Deferred (answered earlier): wiring the intake to a HubSpot form for real lead
capture — keep the custom UI, POST to HubSpot's no-auth Forms endpoint when
Daniel provides a portal ID + form GUID.


## Build 22 — Discovery UX: vertical options, A/S/N everywhere (June 13, 2026)

Driven by Daniel's review of the presenter discovery flow.

- **All selection answers render vertically.** QuestionControl no longer
  renders any options as horizontal pills — every single/multi choice is a
  full-width stacked row (round check for single, square for multi),
  matching the pain rows. Affects both presenter and customer modes.
- **Fixed the squished prompt header.** In the discovery section cards, a long
  hint (e.g. "One per line or commas — we build your pipeline from this") was
  crushing the question title into a narrow column. The hint now sits on its
  own line beneath the full-width prompt.
- **Fixed the marketing Always/Sometimes/Never buttons.** Root cause: the live
  preview's `PreviewDiscovery.answerFor()` had no `habit-matrix` case, so it
  returned the raw habit object, which React can't render as a text node —
  clicking any A/S/N button threw and made the buttons look dead. Added a
  habit-matrix case that surfaces the flagged pains.
- **Extended Always/Sometimes/Never to every diagnostic section.** The CRM,
  Sales, Service, Commerce, and Ops pain checklists are now positive-statement
  habit matrices (Always = no problem, Never/Sometimes = flag the pain),
  consistent with Marketing. Each statement maps to its SOLUTION_MAP pain id,
  so the fix plan, topLeak picker, and preview keep working unchanged. The
  Ops inference for `tools_dont_talk` / `reporting_excel_pain` now defers to
  the explicit habit answer instead of contradicting it. (`HABITS_BY_SECTION`
  in discoveryQuestions.js is the single source.)


## Build 21 — Daniel's UX review + full design sweep (June 12, 2026)

Driven by Daniel's review of the customer flow and presenter view.

**Customer flow**
- Q7 ("Which one hurts the most?"): the prospect's own selected pains now
  lead the screen; the research-stat "classics" are collapsed behind a
  "Not sure? See where most companies bleed →" link.
- Q8 quick picks reworded as "I want…" phrases (more leads, close more
  deals, faster follow-up, my time back, more repeat business, scale fast).
- Step 2 rebuilt (`src/steps/CustomerBuildPlan.jsx`): full-width guided page
  instead of the cramped split pane — goal quote, build summary chips, one
  expandable card per leak (cost → story → what we build), single CTA
  "See it live in your HubSpot →". The offer matrix and diagrams stay in
  presenter mode only.
- Navigation: "Step 3 of 4" + back button on the preview bar, "Step 4 of 4"
  on the next-steps screen, "↺ Start over" in the header on every screen
  past the questions. Next-steps screen decluttered (duplicate leak cards
  removed — straight to value stack → CTA).

**Design sweep (the "looks like generic HTML" fix)**
- Customer Journey board rebuilt: 25+ new SVG icons replace every emoji,
  milestone cards get tinted icon tiles in phase colors, SVG connectors,
  proper search input, redesigned detail drawer.
- All six hub views + every presenter preview (records, deals, views,
  dashboards, cadence, custom objects, automations) swept: .hs-table
  styling, calypso record links, HubSpot 3px-radius tags instead of pills,
  initials avatars, .hs-empty-state empty states, .hs-btn buttons.
- Workflow diagrams: node-type emojis replaced with per-kind SVG icons;
  emoji prefixes stripped from all template node labels.
- Zero emojis remain anywhere in the rendered UI (internal advisor/presenter
  chrome included); PDF export emojis replaced with text labels.


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
