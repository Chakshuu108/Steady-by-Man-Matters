<div align="center">

<img src="public/icons/og.png" alt="Steady: your 90-day companion" width="720">

# 🌱 Steady

### A 90-day companion for Man Matters customers
**See what's working on day 9, not day 90.**

[![Live App](https://img.shields.io/badge/🚀_Live_App-steady--by--man--matters-8fd14f?style=for-the-badge&labelColor=0a100f)](https://steady-by-man-matters.onrender.com/)
[![Demo Video](https://img.shields.io/badge/▶_Demo_Video-YouTube-ff0000?style=for-the-badge&labelColor=0a100f)](https://www.youtube.com/watch?v=VRbHrraC5Fs&t=3s)

![Node](https://img.shields.io/badge/Node.js-18+-1f6f43?logo=node.js&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq_Llama_3.3-f55036)
![PWA](https://img.shields.io/badge/PWA-installable-4f86c6)
![Privacy](https://img.shields.io/badge/Data-stays_on_device-8fd14f)

</div>

---

## 🔍 The Problem

We spoke to **8 Man Matters customers** across the Hair Fall, Beard Growth and Anti-Dandruff routines. They liked the products. Their frustration was the **silent wait for results**.

> **7 of 8** conversations described the same gap: during the long wait, customers can't tell *what is normal*, *what to do next*, or *whether it's working*.

Results take ~10 weeks, but doubt peaks at weeks 3 to 5. A scary week-3 shed, a missed dose or a late refill reads as "this isn't working", and customers quit before the benefit arrives.

> 💬 *"Saw nothing for the first 5 weeks and nearly quit."*
> 💬 *"Temporary shedding in week 3 caused panic."*
> 💬 *"Refill took 12 days to arrive."*

**Problem statement:** Customers begin a 90-day routine with no way to tell whether it is working and no guidance on what is normal along the way, so they panic, lapse or quit before results arrive.

---

## ✨ The Solution

Steady turns the first 90 days from a silent wait into a guided journey.

| 🗣️ What customers said | 🛠️ What Steady does |
|---|---|
| "Saw nothing for 5 weeks and nearly quit" | 📈 **Early-signal tracker** and a week-by-week timeline, so progress shows before the mirror does |
| "Week-3 shedding caused panic" | 🧭 **"Is this normal this week?"** guidance, with the shed window marked on the chart |
| "Unsure Stage 1 or Stage 2" | 🔎 **Transparent stage check** showing every answer's points and reason |
| "Forgot gummies on busy days" | ✅ **One-tap check-in**, streaks, calendar / WhatsApp / browser reminders |
| "Roller uncomfortable", "dry if daily" | 📘 **Usage guides** and a shampoo frequency finder |
| "Support replies became generic" | 🤖 **AI coach** grounded in your week, plus a **doctor-ready summary** for day 60 and 90 |
| "Refill took 12 days" | 📦 **Refill planner** that back-solves a reorder-by date |

---

## 🧩 Inside the App

| Tab | What it gives you |
|---|---|
| 🏠 **Today** | Routine check-in, streak, journey chart, what's normal this week, milestones, reminders |
| 📊 **Progress** | Weekly signal check-in, photo comparison, trend vs. baseline, doctor-ready summary |
| 💬 **Ask coach** | AI answers using your week and data, with doctor hand-off for anything worrying |
| 📦 **Refill planner** | Days of product left and a "reorder by" date with a delivery buffer |
| 📚 **Guides** | Derma roller steps, shedding explainer, frequency finder, safety, data backup |

Covers three routines: **Hair Fall**, **Beard Growth** and **Anti-Dandruff**.

---

## 🛡️ Built Responsibly

- 🔒 **Private by design:** no accounts, names or phone numbers. Data stays in the browser, with export and import for backup.
- 🩺 **Safe guidance:** the coach never diagnoses or promises results, and routes red flags to a doctor.
- 🔑 **Secure AI:** the Groq key lives only on the server and is never exposed to the browser.
- 📱 **Everywhere:** responsive on phone and desktop, installable as a home-screen app.

---

## 🏗️ Tech Stack

| Layer | Choice |
|---|---|
| 🎨 Front end | Vanilla HTML, CSS, JavaScript (no build step), custom SVG charts |
| ⚙️ Back end | Node.js and Express, serving the app and proxying AI requests |
| 🧠 AI | Groq API, `llama-3.3-70b-versatile`, with an offline fallback coach |
| 📲 PWA | Web manifest and service worker |
| ☁️ Hosting | Render |

---

## 📁 Structure

```
steady/
├── server.js          Express server and Groq proxy
├── public/            Web app (HTML, CSS, JS, icons, PWA files)
│   ├── js/            app · core · data · charts
│   └── css/           styles
├── docs/              Part 1 research report · Part 2 solution summary
└── render.yaml        Deployment config
```

---

## 🧰 Built With

Built with **Claude** as the coding agent and **Groq** powering the in-app coach, for the Mosaic Wellness customer-insight challenge.

---

<div align="center">

⚠️ *Steady is a concept companion, not medical advice. Talk to a doctor about any health concern.*

</div>
