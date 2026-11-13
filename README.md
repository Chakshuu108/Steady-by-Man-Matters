# Steady &mdash; 90-Day Clinical Companion for Man Matters

A consumer-facing digital health companion built for Man Matters (Mosaic Wellness) customers, solving the psychological and operational drop-off during the 90-day clinical wait for results.

```
steady/
├── server.js            Express backend + Groq AI proxy (/api/coach, /api/insight, /api/health)
├── package.json         Minimal Node.js dependencies (dotenv, express)
├── .env                 ← Paste your GROQ_API_KEY here
├── .env.example
├── render.yaml          1-click deployment configuration for Render
├── public/              Modern, zero-build client app (HTML5, CSS3, Vanilla ES Modules)
│   ├── index.html       Accessible app shell
│   ├── css/styles.css   Modern design system (dark clinical aesthetic, fluid typography, glassmorphism)
│   └── js/
│       ├── app.js       View coordinator, routing, modals, and interaction handlers
│       ├── core.js      Habit math, streak engine, leading-signal index, telemetry export
│       ├── data.js      Clinical phases, stage scoring algorithms, trichological guides, offline QA
│       └── charts.js    Bespoke interactive SVG visualizers (The Valley Curve & Signal Index)
├── USER_GUIDE.md        Comprehensive evaluator & user walkthrough of all tabs
├── docs/                Part 1 customer research report (.docx & .pdf) + Part 2 solution brief
└── research/            Original customer review spreadsheet (ManMatters_Reviews.xlsx)
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Paste your Groq API key into `.env`:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   PORT=3000
   ```
   *(Get a free API key at [console.groq.com/keys](https://console.groq.com/keys)).*
3. Launch the server:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your web browser.

> **Dual-Mode AI Resilience:** Even without an API key or when offline, Steady remains 100% operational. The AI coach seamlessly defaults to a comprehensive local trichological knowledge base (`FALLBACK_QA`), indicated by the "Offline Clinical Guide" pill.

## Instant Testing
Click **"▶ View Live Week-6 Demo"** on the home page to load an authentic Week-6 simulation based on verified customer interview patterns.

## Deploying to Production
* **Render:** Push repository to GitHub &rarr; New Web Service (reads `render.yaml`). Add `GROQ_API_KEY` to Environment variables.
* **Railway / Heroku:** Works out-of-the-box with `npm start`.

---
*Built with Claude & Groq (`llama-3.3-70b-versatile`). Concept companion based on real Mosaic customer research.*
