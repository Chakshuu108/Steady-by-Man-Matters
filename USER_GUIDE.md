# Steady &mdash; User &amp; Evaluator Guide

A structured walkthrough of the Steady companion web application built for Man Matters (Mosaic Wellness).

---

## What is Steady?
Hair fall, beard growth, and anti-dandruff regimens require 90 to 120 days to yield visual cosmetic density. During the initial 60 days, customers encounter the **"Biological Silent Valley"**:
1. Zero visible change in the mirror during weeks 1–2.
2. An acute surge in shedding during the telogen reset around weeks 3–5.
3. Motivation fatigue and habit lapses around weeks 6–9.
4. Logistics delays (like a 12-day courier lag) breaking product continuity.

Steady solves these friction points by providing:
* **"Is This Normal?" Roadmap:** A week-by-week clinical timeline mapping out what is happening beneath the scalp.
* **Leading Follicular Signal Index:** Weekly 3-axis subjective sensor tracking (drain strand count, scalp comfort, hair resilience) that proves biological response before the mirror reflects change.
* **Transparent Stage Diagnostic:** Eliminates Stage 1 vs. Stage 2 ambiguity with itemized scoring explanations.
* **Adherence Engine:** Interactive daily routine checklists, streak counters, and automated calendar (.ics) / WhatsApp reminders.
* **Predictive Refill Runway:** Reverse-calculates reorder deadlines using a 12-day transit buffer to eliminate treatment gaps.
* **Groq AI Clinical Coach:** Grounded in the user's exact treatment week and telemetry logs, with seamless hand-offs to Man Matters telehealth doctors.

---

## 60-Second Fast Track for Evaluators
1. Open the app in your browser: `http://localhost:3000`.
2. On the home page, click **"▶ View Live Week-6 Demo"**.
3. This instantly loads an authentic Week-6 simulation based on our research customer conversations:
   * Inspect the **Today** tab to see Week 6 in "The Quiet Valley" phase, active streaks, and routine checklists.
   * Open the **Progress** tab to examine the Signal Index chart (with shaded Week 3–5 shedding dip) and photo comparisons.
   * Click **"Doctor-Ready Progress Summary"** to view the auto-synthesized clinical brief.
   * Open **Ask AI Coach** to ask questions like *"Why is my shedding worse in week 3?"*.
   * Check **Refill Runway** to see the 12-day courier buffer calculation.
4. When done testing, click **"Start Over"** in the top navigation to begin a fresh personalized journey.

---

## The Five Core Tabs

### 1. Today &bull; Daily Habit Command Center
* **Biological Trajectory Chart:** An interactive SVG showing your position along the real psychological curve (The Shed, The Quiet Valley, First Signs).
* **Daily Routine Checklist:** Real-time completion progress bar (e.g. *2 of 2 items completed — Streak Protected!*).
* **Streak &amp; 14-Day Consistency:** Track daily compliance and view the 7-day visual history.
* **Automated Reminders:** 1-click Google/Apple Calendar download (`.ics`), native browser push notifications, or direct WhatsApp self-reminders.
* **Week-Specific Clinical Normalcy:** Bulleted breakdown of what is physiologically expected this week and key actions.
* **Milestone Radar:** Countdown indicators toward Day 30 pulse-check, Day 60 doctor review, and Day 90 results review.

### 2. Progress &bull; Leading Indicator Telemetry
* **Weekly Check-In Sliders:** Move sliders for hair shed in drain, scalp itch/calm, and hair thickness. Notice that each slider dynamically displays a clear descriptive clinical level (e.g., *Level 1: Barely any (<10 strands)* vs *Level 5: Heavy clumps (>100 strands)*).
* **Live Score Preview:** Displays your calculated composite score (0–100) in real-time as you adjust sliders before saving.
* **Signal Index Chart:** Visualizes your trajectory against your Week 1 baseline, highlighting the expected Week 3–5 shedding dip.
* **Standardized Photo Comparison:** Side-by-side comparison of baseline photos vs. current week photos under identical lighting.
* **Doctor-Ready Summary:** Generates a structured clinical brief ready to paste into a chat with a Man Matters physician. Polished by Groq AI when the API key is active.
* **Export Journey Data:** 1-click download of your complete journey telemetry (`.json`) for personal health records.

### 3. Ask AI Coach &bull; Context-Aware Assistant
* Dynamic chat interface grounded in your exact treatment track, week number, phase name, adherence rate, and latest signal scores.
* Powered by Groq's flagship `llama-3.3-70b-versatile` model for lightning-fast, high-intelligence clinical education.
* Built-in medical guardrails: refuses to diagnose, identifies red-flag symptoms (like sudden patchy loss or rash), and directs users to Man Matters certified doctors.
* **Offline Clinical Fallback:** If the Groq key is omitted or the device is offline, Steady automatically switches to an internal rule-based trichology guide (`FALLBACK_QA`).

### 4. Refill Runway &bull; Supply Protection
* Enter your last kit delivery date, supply duration (30/45/60/90 days), and transit safety buffer (default: 12 days).
* Steady calculates your exact **Reorder Deadline Date** and remaining supply days.
* Status badges indicate whether your supply is **Protected** (Green), **Reorder Approaching** (Amber), or **Critical** (Red).
* 1-click **Set Reorder Calendar Alert** (`.ics`) downloads an alert straight to your phone's calendar.

### 5. Clinical Guides &bull; Trichological Knowledge Base
* **Derma Roller Clinical Protocol:** Step-by-step sterilization, 4-way multi-directional rolling technique, pressure control, and sanitization.
* **The Telogen Reset Explained:** Visual and biological explanation of why hair sheds before thicker hairs emerge.
* **Interactive Shampoo Frequency Calculator:** Fine-tune washes per week based on scalp dryness, visible flaking, and sebum oiliness.
* **Clinical Red Flag Matrix:** Clear criteria for when to stop topicals and consult a dermatologist.

---

## Technical Specifications
* **Frontend:** Vanilla HTML5, CSS3, Modern ES Modules (zero npm build step, zero client dependencies).
* **Backend:** Node.js Express server (`server.js`) serving static assets and proxying Groq API completions so secret keys never touch client browsers.
* **Security &amp; Privacy:** Zero customer PII collected. All check-ins and images are compressed and stored locally in browser `localStorage`.
* **Deployment:** Pre-configured with `render.yaml` for 1-click deployment on Render, Railway, or Heroku.
