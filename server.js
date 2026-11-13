// Steady — tiny Express server: serves the static app and proxies Groq so the API key never reaches the browser.
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const hasKey = () => !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim());

app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// --- naive in-memory rate limit (per IP, 30 req / 10 min) ---
const hits = new Map();
function limiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'x';
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (arr.length >= 30) return res.status(429).json({ error: 'Slow down a little — try again in a few minutes.' });
  arr.push(now); hits.set(ip, arr); next();
}

const SAFETY = `You are "Steady", a calm, warm, plain-spoken companion for men using Man Matters products (hair-fall kits, beard growth kits, anti-dandruff shampoo) during their first 90 days.
Your job: reduce anxiety and confusion during the long wait for results, by explaining what is typical at the customer's current week, what to check, and what to do next.
Rules:
- You are NOT a doctor. Never diagnose, never promise results, never give prescription dosing. Use words like "commonly", "many men report", "usually".
- If the user mentions patchy/sudden hair loss, scalp pain, swelling, spreading rash, bleeding, signs of allergy, shedding that is heavy after week 8, or anything alarming: tell them kindly to talk to a doctor (Man Matters offers free doctor consultations) and stop short of reassurance.
- Be concise: 3-6 short sentences or up to 4 bullets. No headings. Warm, direct, slightly witty is OK; never preachy.
- Anchor on the CONTEXT (track, week, phase, adherence, signals). Reference it naturally.
- Never ask for or repeat names, phone numbers, addresses or other personal data.
- Do not recommend competitor products. Do not invent product specs; defer to the pack insert.`;

async function groq(messages, { temperature = 0.4, max_tokens = 420 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(GROQ_URL, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}` },
      body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens })
    });
    if (!r.ok) throw new Error(`Groq ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim() || '';
  } finally { clearTimeout(t); }
}

const clip = (s, n) => String(s ?? '').slice(0, n);
function ctxString(c = {}) {
  return `CONTEXT — track: ${clip(c.track, 40)}; product: ${clip(c.product, 80)}; day ${Number(c.day) || '?'} (week ${Number(c.week) || '?'}); phase: ${clip(c.phase, 60)}; ` +
    `14-day routine adherence: ${Number.isFinite(+c.adherence) ? Math.round(+c.adherence) + '%' : 'unknown'}; current streak: ${Number(c.streak) || 0} days; ` +
    `latest signals: ${clip(c.signals, 300) || 'none logged yet'}.`;
}

app.get('/api/health', (_, res) => res.json({ ok: true, ai: hasKey(), model: hasKey() ? MODEL : null }));

app.post('/api/coach', limiter, async (req, res) => {
  if (!hasKey()) return res.status(503).json({ error: 'no_key' });
  try {
    const { messages = [], context = {} } = req.body || {};
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: clip(m.content, 600)
    }));
    if (!history.length) return res.status(400).json({ error: 'empty' });
    const reply = await groq([{ role: 'system', content: SAFETY + '\n\n' + ctxString(context) }, ...history]);
    res.json({ reply, source: 'groq', model: MODEL });
  } catch (e) {
    console.error('[coach]', e.message);
    res.status(502).json({ error: 'upstream' });
  }
});

app.post('/api/insight', limiter, async (req, res) => {
  if (!hasKey()) return res.status(503).json({ error: 'no_key' });
  try {
    const { context = {}, logs = [] } = req.body || {};
    const rows = logs.slice(-12).map(l => `week ${Number(l.week)}: ${clip(l.text, 160)}`).join('\n');
    const prompt = `${ctxString(context)}\n\nWEEKLY LOGS:\n${rows || '(none)'}\n\n` +
      `Write a "Doctor-ready progress summary" the customer can paste into a chat with a Man Matters doctor. Format: 1 line of context, then 3 short bullets (what is improving / what is unchanged / what to ask the doctor), then one encouraging closing line. Max 110 words. No diagnosis.`;
    const reply = await groq([{ role: 'system', content: SAFETY }, { role: 'user', content: prompt }], { temperature: 0.3, max_tokens: 320 });
    res.json({ reply, source: 'groq' });
  } catch (e) {
    console.error('[insight]', e.message);
    res.status(502).json({ error: 'upstream' });
  }
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Steady running → http://localhost:${PORT}  (Groq: ${hasKey() ? 'ON' : 'OFF — add GROQ_API_KEY to .env'})`));
