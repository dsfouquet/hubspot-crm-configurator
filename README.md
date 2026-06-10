# HubSpot CRM Design Configurator

A standalone web app that lets Crescent Connect LA prospects visually design what their
HubSpot CRM will look like — record types, properties, views, dashboards, automation
workflows, and accountability cadences — with a live HubSpot-mirrored preview.

Built from the Crescent Connect LA build spec v2.0.

## Stack

- React + Vite
- Tailwind CSS
- Zustand (state)
- ReactFlow (workflow diagrams)
- html2pdf.js (PDF export)
- EmailJS (email delivery)
- localStorage session persistence (no backend in v1)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Configuration

Copy `.env.example` to `.env.local` and fill in keys (EmailJS, Claude API). The app runs
without keys — email/AI features no-op gracefully until configured.

## Editing HubSpot tier data

`src/data/hubspotTiers.json` is designed to be edited by non-developers. See spec Section 13.

## Build status — v1 complete

- [x] 1. App shell (layout, nav, presenter mode, advisor drawer)
- [x] 2. Steps 1–6 (record config)
- [x] 3. Step 7 (automation workflows + ReactFlow + plain-English generator)
- [x] 4. Steps 8–10 (views recommendations, dashboards, cadence)
- [x] 5. Step 11 (full-width tabbed preview)
- [x] 6. Tier calculator + Advisor Panel
- [x] 7. Session persistence (localStorage + code restore)
- [x] 8. PDF export (branded multi-page blueprint)

### Notable additions beyond the original spec
- Draggable resizable split between config and preview (persists)
- Wizard Q1 (team type) is multi-select; recommendations union across motions
- Interactive record section tabs
- Email delivery dropped per request — flow is async + PDF download (anytime, via header or final screen)

### Not in v1 (would need a backend)
- Cross-device session restore (localStorage is per-browser)
- Automated email delivery (EmailJS scaffolding remains in `utils/emailSender.js` if revived)
- Live AI workflow generation needs `VITE_ANTHROPIC_API_KEY` (falls back to an editable draft)
