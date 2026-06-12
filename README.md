# HubSpot CRM Configurator — Crescent Connect LA

A sales tool that shows prospects the exact HubSpot CRM Crescent Connect will
build for them. Two modes:

- **Customer mode (default):** an 8-question intake (with BANT qualification)
  → an auto-generated build plan → a live HubSpot-style portal preview →
  a routed CTA. Qualified prospects book a Free CRM Setup call; everyone else
  is routed to the DIY CRM Build Guide. The qualification verdict is never
  shown to the prospect.
- **Presenter mode** (quiet "Presenter session" link on the gate): the full
  13-step deep configurator for Daniel's live discovery calls — record types,
  properties, pipelines, workflows, views, dashboards, cadence, journey.

See `docs/CHANGELOG.md` for what changed in each build.

## Stack

- React + Vite
- Tailwind CSS (HubSpot Canvas tokens + component classes in `src/index.css`)
- Zustand (state)
- ReactFlow (workflow diagrams, lazy-loaded)
- html2pdf.js (PDF export)
- localStorage session persistence (no backend)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Configuration

All env vars are optional — working defaults are baked in, so the app deploys
with zero configuration. To override, copy `.env.example` to `.env.local`
(local) or set them in Vercel project settings (they're build-time):

| Var | Purpose |
|-----|---------|
| `VITE_BOOKING_URL` | Free Setup booking link (qualified prospects) |
| `VITE_DIY_GUIDE_URL` | DIY guide link (unqualified prospects) |

## How the customer funnel works

1. **Gate** (`src/modals/EmailGateModal.jsx`) captures name + email.
2. **Intake** (`src/steps/CustomerIntake.jsx`, questions in
   `src/constants/customerQuestions.js`) asks 8 questions: avatar industry,
   revenue, tenure, team size, current tracking, pains, top leak, top goal.
3. **Auto-build** (`src/utils/autoBuild.js` + `src/constants/avatars.js`)
   seeds pipeline stages, custom object, and workflows from the prospect's
   market avatar, then runs the solution engine (`src/utils/solutionEngine.js`).
4. **Qualification** (`src/utils/qualification.js`): revenue ≥$250K AND
   ≥1 year in business AND team ≥2 → `session.qualification` (internal only).
5. **Build plan → preview → CTA** (`src/steps/StepCTA.jsx`): value-stacked
   Free Setup pitch with routed primary button.

## Editing HubSpot tier data

`src/data/hubspotTiers.json` is designed to be edited by non-developers.

## Deploy

Push to `main` on GitHub — the connected Vercel project auto-deploys
(`vercel.json` handles the SPA rewrite).

## Not built yet / deliberate omissions

- Cross-device session restore (localStorage is per-browser)
- Gate lead capture is browser-only — no HubSpot form submission yet
- AI workflow generation (removed: browser-exposed API key; revive via a
  serverless proxy — prompt/schema in git history of
  `src/utils/workflowGenerator.js`)
- DIY Guide page — `VITE_DIY_GUIDE_URL` falls back to /free-crm until built
