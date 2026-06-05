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

## Build status

- [x] 1. App shell (layout, nav, presenter mode, advisor drawer)
- [ ] 2. Steps 1–6 (record config)
- [ ] 3. Step 7 (automation workflows)
- [ ] 4. Steps 8–10
- [ ] 5. Step 11 (preview)
- [ ] 6. Tier calculator
- [ ] 7. Session persistence + email
- [ ] 8. PDF export
