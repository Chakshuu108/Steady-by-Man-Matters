import { TRACKS } from './data.js';

const KEY = 'steady.v1';
export const DAY = 86400000;

// ---------- dates (all local, YYYY-MM-DD) ----------
export const pad = n => String(n).padStart(2, '0');
export const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const today = () => ymd(new Date());
export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
export const diffDays = (a, b) => Math.round((parse(a) - parse(b)) / DAY);
export const fmt = (s, o = { day: 'numeric', month: 'short' }) => parse(s).toLocaleDateString('en-IN', o);

// ---------- store (privacy-first: localStorage only, no personal data) ----------
const blank = () => ({
  track: null,
  start: null,
  stage: null,
  checkins: {},
  logs: [],
  refill: { delivered: null, supply: 30, buffer: 12 },
  remindAt: '09:00',
  demo: false
});

let state = blank();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = { ...blank(), ...JSON.parse(raw) };
} catch {}

export const get = () => state;
export function set(patch) {
  Object.assign(state, patch);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
export function reset() {
  state = blank();
  try { localStorage.removeItem(KEY); } catch {}
}

// ---------- journey maths ----------
export const track = () => TRACKS[state.track];
export const dayNo = () => Math.max(1, diffDays(today(), state.start) + 1);
export const weekNo = (d = dayNo()) => Math.floor((d - 1) / 7) + 1;
export function phaseFor(week, t = track()) {
  return t.phases.find(p => week >= p.from && week <= p.to) || t.phases[t.phases.length - 1];
}

export function dailyKeys(t = track()) {
  return [...t.daily.map(i => i.key), ...(t.wash ? [] : [])];
}

const done = (date, key) => !!state.checkins[date]?.[key];

export function isDayComplete(date, t = track()) {
  const keys = t.daily.map(i => i.key);
  if (!keys.length) return !!(t.wash && done(date, t.wash.key));
  return keys.every(k => done(date, k));
}

export function todayProgress(t = track()) {
  const d = today();
  const daily = t.daily.map(i => ({ ...i, done: done(d, i.key) }));
  const wash = t.wash ? { ...t.wash, done: done(d, t.wash.key) } : null;
  const items = [...daily, ...(wash ? [wash] : [])];
  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  return { items, doneCount, totalCount, pct, isComplete: isDayComplete(d, t) };
}

export function streak(t = track()) {
  let s = 0, d = today();
  if (!isDayComplete(d, t)) d = addDays(d, -1); // today not finished yet doesn't break active streak
  while (diffDays(d, state.start) >= 0 && isDayComplete(d, t)) {
    s++;
    d = addDays(d, -1);
  }
  return s;
}

export function adherence(days = 14, t = track()) {
  const keys = t.daily.length ? t.daily.map(i => i.key) : (t.wash ? [t.wash.key] : []);
  if (!keys.length) return 0;
  let due = 0, ok = 0;
  const span = Math.min(days, dayNo());
  for (let i = 0; i < span; i++) {
    const d = addDays(today(), -i);
    if (t.daily.length === 0) continue;
    keys.forEach(k => {
      due++;
      if (done(d, k)) ok++;
    });
  }
  if (!t.daily.length) {
    let washes = 0;
    for (let i = 0; i < span; i++) if (done(addDays(today(), -i), keys[0])) washes++;
    return Math.min(100, Math.round((washes / Math.max(1, (span / 7) * 3)) * 100));
  }
  return due ? Math.round((ok / due) * 100) : 0;
}

export const weeklyDone = (key) => {
  for (let i = 0; i < 7; i++) {
    if (done(addDays(today(), -i), key)) return true;
  }
  return false;
};

// ---------- signals & scoring ----------
const norm = (ind, v) => (ind.lowerBetter ? (5 - v) : (v - 1)) / 4; // 0..1 scale where 1 = optimal clinical response

export const calculateScore = (vals, t = track()) => {
  if (!vals || !t?.indicators?.length) return 50;
  return Math.round(100 * t.indicators.reduce((acc, ind) => acc + norm(ind, vals[ind.key] ?? 3), 0) / t.indicators.length);
};

export const goodness = (log, t = track()) => calculateScore(log.vals, t);

export function signal(t = track()) {
  const L = state.logs;
  const wk = weekNo();
  if (L.length < 2) {
    return {
      tone: 'neutral',
      title: 'Baseline established',
      body: L.length
        ? 'Log your week 2 check-in to track directional shift across your follicular indicators.'
        : 'Record your week 1 baseline to activate leading-signal telemetry.',
      delta: null
    };
  }

  const base = goodness(L[0], t);
  const latest = goodness(L[L.length - 1], t);
  const delta = latest - base;
  const phase = phaseFor(wk, t);

  if (delta >= 8) {
    return {
      tone: 'good',
      title: 'Positive Follicular Signal (+ ' + delta + ' pts)',
      body: `Your leading signals are up ${delta} points from baseline. Early biological changes precede mirror density. Keep your routine steady.`,
      delta
    };
  }
  if (delta <= -8) {
    if (phase.name === 'The Shedding Phase' || wk <= 5) {
      return {
        tone: 'warn',
        title: 'Expected Follicle Reset Dip (' + delta + ' pts)',
        body: 'A temporary signal dip in weeks 3–5 is standard during the telogen reset. Do not stop — quitting now interrupts the anagen growth cycle.',
        delta
      };
    }
    if (wk >= 9) {
      return {
        tone: 'alert',
        title: 'Mid-Point Clinical Review Recommended',
        body: 'Leading signals remain below baseline past week 9. A free Man Matters telehealth consultation is advised to evaluate your regimen.',
        delta
      };
    }
    return {
      tone: 'warn',
      title: 'Slight Signal Fluctuation',
      body: 'Minor interim variance is common. Continue logging weekly; if flat past week 8, our AI coach can prepare a doctor review.',
      delta
    };
  }

  return {
    tone: 'steady',
    title: 'Holding Stable Baseline',
    body: wk < 10
      ? 'A flat plateau during the Quiet Valley (weeks 6–9) is typical. Tangible follicular response is clinically observed from week 10 onwards.'
      : 'Holding steady. Review your daily gummy & wash consistency, or request a doctor review.',
    delta: 0
  };
}

export const signalsText = (t = track()) => {
  const l = state.logs[state.logs.length - 1];
  if (!l) return '';
  return t.indicators.map(i => `${i.label}: ${l.vals[i.key]}/5`).join('; ');
};

// ---------- refill runway ----------
export function refill() {
  const r = state.refill;
  if (!r.delivered) return null;
  const runOut = addDays(r.delivered, Number(r.supply));
  const bufferDays = Number(r.buffer) || 12;
  const reorderBy = addDays(runOut, -bufferDays - 2); // 12-day courier buffer + 2-day handling margin
  const left = diffDays(runOut, today());
  const toReorder = diffDays(reorderBy, today());
  const pct = Math.max(0, Math.min(100, Math.round((1 - (diffDays(today(), r.delivered) / Number(r.supply))) * 100)));

  return {
    runOut,
    reorderBy,
    left,
    toReorder,
    pct,
    status: toReorder < 0 ? 'late' : toReorder <= 5 ? 'soon' : 'ok',
    bufferDays
  };
}

// ---------- export telemetry ----------
export function exportJourney() {
  const t = track();
  const st = get();
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    companion: 'Steady by Man Matters',
    track: st.track,
    product: t?.product,
    startDate: st.start,
    currentDay: dayNo(),
    currentWeek: weekNo(),
    streak: streak(),
    adherence14Day: adherence(),
    signalStatus: signal(),
    logs: st.logs,
    refill: st.refill
  }, null, 2);
}

// ---------- demo journey (Week 6 simulation based on real user research) ----------
export function loadDemo() {
  const start = addDays(today(), -41); // Exactly week 6
  const checkins = {};
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  for (let i = 41; i >= 1; i--) {
    const d = addDays(today(), -i);
    if (rnd() > 0.12) {
      checkins[d] = { gummies: true, shampoo: rnd() > 0.45 };
    }
  }
  checkins[addDays(today(), -1)] = { gummies: true };
  checkins[addDays(today(), -2)] = { gummies: true };
  checkins[addDays(today(), -3)] = { gummies: true };

  const mk = (off, drain, itch, thick, note = '', photo = null) => ({
    date: addDays(start, off),
    week: weekNo(off + 1),
    vals: { drain, itch, thick },
    note,
    photo
  });

  const logs = [
    mk(0, 3, 3, 2, 'Initial week 1 baseline recorded.', 'img/demo-week1.png'),
    mk(14, 4, 3, 2, 'Mild scalp adjustment.'),
    mk(21, 5, 4, 2, 'Week 3 shedding surge in shower drain. Checked Steady guide, continued routine.'),
    mk(28, 4, 2, 2, 'Shedding starting to stabilize. Scalp itch completely calmed.'),
    mk(35, 3, 2, 3, 'Noticed noticeably fewer strands on pillow. Hair feels slightly more resilient.', 'img/demo-week6.png')
  ];

  set({
    track: 'hair',
    start,
    stage: 1,
    checkins,
    logs,
    refill: { delivered: addDays(today(), -20), supply: 30, buffer: 12 },
    demo: true
  });
}
