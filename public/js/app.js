import * as S from './core.js';
import {
  TRACKS,
  STAGE_QUESTIONS,
  TRIGGERS,
  scoreStage,
  stageFrom,
  FALLBACK_QA,
  FALLBACK_DEFAULT,
  CHIPS,
  GUIDES,
  frequencyAdvice,
  PHASE_COLORS
} from './data.js';
import { valleySVG, animateValley, signalSVG, ringSVG } from './charts.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = $('#app');
let stopAnim = () => {};

let ui = {
  tab: 'today',
  ob: { step: 1, track: null, ans: {}, trig: [], start: S.today() },
  chat: [],
  busy: false,
  ai: null,
  modelName: 'llama-3.3-70b-versatile'
};

// ---------- UI Utilities ----------
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('on'), 2500);
}

function modal(inner) {
  const m = $('#modal');
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${inner}</div>`;
  m.hidden = false;
  m.onclick = e => { if (e.target === m) closeModal(); };
}

function closeModal() {
  $('#modal').hidden = true;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function reveal() {
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

const logo = `<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#b6f26b"/><path d="M8 30 C20 30 22 46 32 46 S44 20 56 14" fill="none" stroke="#0c1808" stroke-width="6" stroke-linecap="round"/></svg>`;

// ---------- Global Header ----------
function header() {
  const st = S.get();
  const has = st.track;
  $('#top').innerHTML = `
    <a class="brand" href="#/" aria-label="Steady home">
      ${logo}
      <div class="brand-meta">
        <span class="brand-name">Steady</span>
        <span class="brand-sub">Man Matters &bull; Mosaic Wellness</span>
      </div>
    </a>
    <nav>
      ${has
        ? `<a class="btn ghost sm hide-s" href="#/app">My Journey</a>
           <button class="btn ghost sm" data-a="doctor-modal">Free Doctor Consult</button>
           <button class="btn ghost sm" data-a="reset">Start Over</button>`
        : `<a class="btn ghost sm hide-s" href="#/how">How It Works</a>
           <button class="btn ghost sm" data-a="demo">See Week-6 Demo</button>
           <a class="btn primary sm" href="#/start">Begin Journey</a>`
      }
    </nav>`;
}

// ---------- Router ----------
function route() {
  stopAnim();
  closeModal();
  const h = location.hash.replace(/^#/, '') || '/';
  header();
  const enter = () => document.querySelector('main > .wrap')?.classList.add('enter');

  if (h.startsWith('/start')) return viewStart();
  if (h.startsWith('/app')) {
    if (!S.get().track) return (location.hash = '#/start');
    viewApp();
    return enter();
  }
  viewHome(h === '/how');
  enter();
  window.scrollTo({ top: 0 });
  if (h === '/how') setTimeout(() => $('#how')?.scrollIntoView({ behavior: 'smooth' }), 80);
}

window.addEventListener('hashchange', () => {
  if (document.startViewTransition) document.startViewTransition(route);
  else route();
});

// ---------- HOME VIEW ----------
function viewHome() {
  const voices = [
    ['"Saw nothing for the first 5 weeks and nearly quit."', 'Verified Customer &bull; Stage 1 Hairfall Kit', 'Slow Results'],
    ['"Temporary shedding in week 3 caused panic."', 'Verified Customer &bull; Stage 1 Hairfall Kit', 'Shedding Anxiety'],
    ['"Unsure whether I was Stage 1 or Stage 2."', 'Verified Customer &bull; Stage 1 Hairfall Kit', 'Staging Confusion'],
    ['"Refill took 12 days to arrive; broke my streak."', 'Verified Customer &bull; Stage 1 Hairfall Kit', 'Delivery Gaps'],
    ['"Forgot gummies on busy workdays."', 'Verified Customer &bull; Stage 1 Hairfall Kit', 'Adherence Slips'],
    ['"Derma roller was confusing and felt uneven."', 'Verified Customer &bull; Beard Growth Kit', 'Protocol Guidance'],
  ];

  app.innerHTML = `
  <div class="wrap">
    <section class="hero">
      <div>
        <span class="eyebrow">90-Day Clinical Companion for Man Matters</span>
        <h1>Day 90 is far away. <em>See what's working</em> on day 9.</h1>
        <p class="lead">Hair and beard follicles respond on 90–120 day cycles. In the silent initial weeks, men panic at expected shedding, forget the daily routine, or quietly abandon treatment. Steady reveals what is normal <em>this week</em>, tracks leading indicators before the mirror does, and guarantees your refills never lapse.</p>
        <div class="hero-cta">
          <a class="btn primary big" href="#/start">Begin My Journey &rarr;</a>
          <button class="btn ghost big" data-a="demo">&#9654; View Live Week-6 Demo</button>
        </div>
      </div>
      <div class="hero-chart">
        <header>
          <div class="legend">
            <span><b></b>Felt Experience (The Biological Valley)</span>
            <span><b class="d"></b>Naive Expectation</span>
          </div>
          <span class="wk-chip" id="wkchip">Day 0</span>
        </header>
        ${valleySVG({ phases: TRACKS.hair.phases, id: 'hv' })}
      </div>
    </section>

    <div class="stats reveal">
      <div class="stat">
        <b data-count="7">0</b>
        <span>of 8 customer conversations revealed the exact same root problem: <em>flying blind with no proof</em> during the long wait for results.</span>
      </div>
      <div class="stat">
        <b>~10 wk</b>
        <span>is when verified customers first notice hair fall reduction &mdash; yet doubt and drop-off peak at <em>week 3&ndash;5</em>.</span>
      </div>
      <div class="stat">
        <b>12 days</b>
        <span>one customer's refill was delayed in transit. A single break in routine restarts the psychological doubt cycle.</span>
      </div>
    </div>
  </div>

  <section class="block">
    <div class="wrap reveal">
      <span class="eyebrow">Direct Customer Voice</span>
      <h2>Effective formulations. A <em>silent, anxious</em> wait.</h2>
      <p class="sub">We interviewed real Man Matters customers across hair-fall, beard growth, and dandruff care. They praised the products, but struggled with the clinical silence during the first 60 days.</p>
      <div class="voices">
        ${voices.map(v => `
          <div class="voice">
            <span class="tag">${v[2]}</span>
            <q>${v[0].slice(1, -1)}</q>
            <small>${v[1]}</small>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="block" id="how">
    <div class="wrap reveal">
      <span class="eyebrow">Engineered For Consistency</span>
      <h2>A clinical companion for the <em>entire 90-day cycle.</em></h2>
      <div class="how">
        <div>
          <h3>Transparent Stage Diagnostic</h3>
          <p>Assess whether you need Stage 1 or Stage 2, with itemized score explanations for every answer &mdash; zero opaque black boxes.</p>
        </div>
        <div>
          <h3>"Is This Normal?" Roadmap</h3>
          <p>A week-by-week clinical map covering the initial reset shed, the Quiet Valley plateau, and early follicle milestones.</p>
        </div>
        <div>
          <h3>Leading Follicular Signals</h3>
          <p>Track shower drain accumulation, scalp calm, and felt texture. Changes appear here weeks before the mirror reflects density.</p>
        </div>
        <div>
          <h3>Ironclad Habit Nudges</h3>
          <p>One-tap daily check-ins, visual streak tracking, and 1-click Calendar (.ics) &amp; WhatsApp reminders for gummies you forget.</p>
        </div>
        <div>
          <h3>Groq AI Clinical Coach</h3>
          <p>Powered by Groq LLaMA-3.3-70B, grounded in your exact treatment week and logged telemetry &mdash; with seamless doctor hand-offs.</p>
        </div>
        <div>
          <h3>Predictive Refill Runway</h3>
          <p>Back-calculates reorder deadlines using a 12-day courier buffer plus a 2-day margin so you never run out of supply.</p>
        </div>
      </div>
    </div>
  </section>

  <div class="wrap">
    <div class="cta-band reveal">
      <h2>Stay the course. <em>We will prove it is working.</em></h2>
      <div class="hero-cta" style="margin:0">
        <a class="btn primary big" href="#/start">Start Your Journey</a>
        <button class="btn ghost big" data-a="demo">Explore Demo Dashboard</button>
      </div>
    </div>
  </div>

  <footer class="foot">
    <div class="wrap">
      <span>Steady is an evidence-based concept companion for Man Matters (Mosaic Wellness). Not medical advice &mdash; consult a physician for clinical diagnoses.</span>
      <span>100% Privacy Protected: Zero tracking, all data stored client-side on your device.</span>
    </div>
  </footer>`;

  reveal();
  const chip = $('#wkchip');
  stopAnim = animateValley(app, 'hv', w => {
    chip.textContent = w === 0 ? 'Day 0' : `Week ${w}`;
  });

  const c = $('[data-count]');
  if (c) {
    let n = 0;
    const iv = setInterval(() => {
      c.textContent = ++n;
      if (n >= 7) clearInterval(iv);
    }, 110);
  }
}

// ---------- ONBOARDING FLOW ----------
function viewStart(anim = true) {
  const o = ui.ob;
  const t = o.track && TRACKS[o.track];
  const steps = t && t.id === 'hair' ? 3 : 2;
  const stepper = n => `
    <div class="stepper">
      ${Array.from({ length: steps }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}
    </div>`;

  let body = '';
  if (o.step === 1) {
    body = `
      ${stepper(1)}
      <span class="eyebrow">Step 1 of ${steps} &bull; Clinical Focus</span>
      <h1>What are you <em>treating?</em></h1>
      <p class="muted">Select your active Man Matters regimen. Steady personalizes your biological roadmap, indicator metrics, and reminder schedules.</p>
      <div class="track-grid">
        ${Object.values(TRACKS).map(x => `
          <button class="track" data-a="pick" data-v="${x.id}" aria-pressed="${o.track === x.id}">
            <h3>${x.emoji} ${x.label}</h3>
            <p>${x.blurb}</p>
            <small>${x.total}-Day Companion Journey &rarr;</small>
          </button>
        `).join('')}
      </div>
      <div class="row" style="margin-top:2.2rem">
        <button class="btn primary big" data-a="next" ${o.track ? '' : 'disabled'}>Continue to Step 2 &rarr;</button>
      </div>`;
  } else if (o.step === 2 && t.id === 'hair') {
    const done = STAGE_QUESTIONS.every(q => o.ans[q.key] != null);
    let res = '';
    if (done) {
      const sc = scoreStage(o.ans, o.trig);
      const st = stageFrom(sc.score);
      const max = STAGE_QUESTIONS.reduce((a, q) => a + Math.max(...q.opts.map(x => x[1])), 0);
      res = `
        <div class="result">
          <span class="eyebrow">Diagnostic Assessment &bull; Itemized Reasoning</span>
          <h2>${st.name}</h2>
          <p style="color:var(--text-secondary);line-height:1.6">${st.body}</p>
          <div class="meter"><i style="width:${Math.round(sc.score / max * 100)}%"></i></div>
          <small class="muted">Diagnostic Score: ${sc.score} / ${max} &bull; Stage 1: 0&ndash;5 pts | Stage 2: 6&ndash;9 pts | Stage 3+: 10+ pts</small>
          <div class="why">
            ${sc.lines.map(l => `
              <div>
                <span style="color:var(--text);font-size:.92rem">${esc(l.q)} <i style="color:var(--muted)">&mdash; ${esc(l.a)}</i></span>
                <b>+${l.pts} pts</b>
                <span>${esc(l.why)}</span>
              </div>
            `).join('')}
          </div>
          ${o.trig.length ? `
            <p class="muted" style="margin-top:1.2rem;font-size:.9rem">
              <b>Trigger factors flagged:</b> ${o.trig.map(i => TRIGGERS[i][0].toLowerCase()).join(', ')}. These can cause temporary telogen effluvium on top of genetic thinning.
            </p>
          ` : ''}
          <div class="notice ${st.doctor ? 'warn' : ''}" style="margin-top:1.2rem">
            <b>Recommended Protocol:</b> ${st.kit}. ${st.doctor ? 'A complimentary doctor review is recommended to confirm dosage.' : ''}
          </div>
        </div>`;
    }
    body = `
      ${stepper(2)}
      <span class="eyebrow">Step 2 of ${steps} &bull; Hair Diagnostic</span>
      <h1>Which stage are you <em>experiencing?</em></h1>
      <p class="muted">Customers reported confusion about Stage 1 vs Stage 2. Answer five clinical questions to see exactly how your regimen is derived.</p>
      ${STAGE_QUESTIONS.map(q => `
        <div class="q">
          <h3>${q.q}</h3>
          <div class="opts">
            ${q.opts.map((x, i) => `
              <button class="opt" data-a="ans" data-k="${q.key}" data-v="${i}" aria-pressed="${o.ans[q.key] === i}">${x[0]}</button>
            `).join('')}
          </div>
        </div>
      `).join('')}
      <div class="q">
        <h3>Any acute lifestyle contributors recently? <span class="muted" style="font-weight:500">(Optional)</span></h3>
        <div class="opts">
          ${TRIGGERS.map((x, i) => `
            <button class="opt" data-a="trig" data-v="${i}" aria-pressed="${o.trig.includes(i)}">${x[0]}</button>
          `).join('')}
        </div>
      </div>
      ${res}
      <div class="row" style="margin-top:1.5rem">
        <button class="btn ghost" data-a="back">&larr; Back</button>
        <button class="btn primary big" data-a="next" ${done ? '' : 'disabled'}>Continue to Timeline &rarr;</button>
        <button class="btn ghost" data-a="skip">Skip Diagnostic</button>
      </div>`;
  } else {
    body = `
      ${stepper(steps)}
      <span class="eyebrow">Step ${steps} of ${steps} &bull; Timeline Setup</span>
      <h1>When did you <em>start your kit?</em></h1>
      <p class="muted">Your biological roadmap aligns to this date. Started a few weeks ago? Select your original delivery or start date.</p>
      <div class="field">
        <label for="st">Kit Start Date</label>
        <input id="st" type="date" value="${o.start}" max="${S.today()}">
      </div>
      <div class="field">
        <label for="ra">Preferred Daily Reminder Time</label>
        <input id="ra" type="time" value="09:00">
      </div>
      <div class="notice">
        <b>Zero-Knowledge Privacy:</b> Steady stores 100% of your data client-side in your local browser storage. No names, phone numbers, or health credentials are ever broadcast.
      </div>
      <div class="row" style="margin-top:2rem">
        <button class="btn ghost" data-a="back">&larr; Back</button>
        <button class="btn primary big" data-a="begin">Launch My Companion &rarr;</button>
      </div>`;
  }

  app.innerHTML = `<div class="wrap"><div class="onb ${anim ? 'enter' : ''}">${body}</div></div>`;
  if (anim) window.scrollTo({ top: 0 });
}

// ---------- APP DASHBOARD ----------
function ctx() {
  const t = S.track();
  const wk = S.weekNo();
  const ph = S.phaseFor(wk);
  return {
    track: t.label,
    product: t.product,
    day: S.dayNo(),
    week: wk,
    phase: ph.name,
    adherence: S.adherence(),
    streak: S.streak(),
    signals: S.signalsText()
  };
}

function viewApp() {
  const st = S.get();
  const t = S.track();
  const day = S.dayNo();
  const wk = S.weekNo();
  const ph = S.phaseFor(wk);
  const pct = Math.min(100, Math.round(day / t.total * 100));

  const tabs = [
    ['today', 'Today'],
    ['progress', 'Progress & Signals'],
    ['coach', 'Ask AI Coach'],
    ['refill', 'Refill Runway'],
    ['guides', 'Clinical Guides']
  ];

  app.innerHTML = `
    <div class="wrap app">
      <div class="app-head">
        <div>
          <span class="eyebrow">${esc(t.label)} &bull; ${esc(t.product)}</span>
          <h1>Week ${wk}: <em>${ph.name}</em></h1>
          <div class="meta">
            <span class="pill">Day ${day} of ${t.total}${day > t.total ? '+' : ''}</span>
            <span class="pill">${S.streak()}-Day Streak</span>
            ${st.demo ? '<span class="pill demo" data-a="demo-info">Demo Mode (Week 6)</span>' : ''}
            <span class="pill ai" id="aipill" data-a="ai-modal" style="cursor:pointer">Checking AI...</span>
          </div>
        </div>
        ${ringSVG(Math.min(100, pct), `${Math.min(day, t.total)}`, 'of ' + t.total + ' days')}
      </div>
      <div class="tabs" role="tablist">
        ${tabs.map(([k, l]) => `
          <button class="tab" role="tab" data-a="tab" data-v="${k}" aria-selected="${ui.tab === k}">${l}</button>
        `).join('')}
      </div>
      <div id="pane">${pane()}</div>
    </div>`;

  requestAnimationFrame(() => {
    const rf = $('.ring-fg');
    if (rf) {
      const f = rf.getAttribute('stroke-dashoffset');
      rf.style.strokeDashoffset = rf.getAttribute('stroke-dasharray');
      requestAnimationFrame(() => rf.style.strokeDashoffset = f);
    }
  });

  if (ui.ai == null) {
    fetch('/api/health')
      .then(r => r.json())
      .then(j => {
        ui.ai = !!j.ai;
        if (j.model) ui.modelName = j.model;
        setPill();
      })
      .catch(() => {
        ui.ai = false;
        setPill();
      });
  } else {
    setPill();
  }
  afterPane();
}

function setPill() {
  const p = $('#aipill');
  if (p) {
    p.textContent = ui.ai ? `Groq AI (${ui.modelName})` : 'Offline Clinical Guide';
  }
}

function switchTab(k, anim = true) {
  const y = scrollY;
  ui.tab = k;
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.v === k));
  const p = $('#pane');
  p.innerHTML = pane();
  p.classList.toggle('enter', anim);
  if (anim) {
    p.style.animation = 'none';
    void p.offsetWidth;
    p.style.animation = '';
  } else {
    scrollTo(0, y);
  }
  afterPane();
}

function pane() {
  return {
    today: paneToday,
    progress: paneProgress,
    coach: paneCoach,
    refill: paneRefill,
    guides: paneGuides
  }[ui.tab]();
}

function afterPane() {
  if (ui.tab === 'coach') {
    const m = $('.msgs');
    if (m) m.scrollTop = m.scrollHeight;
  }
  if (ui.tab === 'progress') bindProgress();
  if (ui.tab === 'refill') bindRefill();
  if (ui.tab === 'guides') bindGuides();
}

// ---------- TAB 1: TODAY ----------
function paneToday() {
  const t = S.track();
  const wk = S.weekNo();
  const ph = S.phaseFor(wk);
  const d = S.today();
  const ck = S.get().checkins[d] || {};
  const prog = S.todayProgress();

  const items = [
    ...t.daily.map(i => ({ ...i, kind: 'd' })),
    ...(t.wash ? [{ ...t.wash, kind: 'd' }] : []),
    ...t.weekly.map(i => ({ ...i, kind: 'w' }))
  ];

  const dots = Array.from({ length: 7 }, (_, i) => {
    const dd = S.addDays(d, i - 6);
    const on = S.get().checkins[dd] && Object.values(S.get().checkins[dd]).some(Boolean);
    return `<i class="${on ? 'on' : ''} ${i === 6 ? 'today' : ''}">${S.fmt(dd, { weekday: 'narrow' })}</i>`;
  }).join('');

  const day = S.dayNo();
  const sg = S.signal();
  const msNext = t.milestones.map(m => ({ ...m, left: m.day - day }));

  return `
  <div class="grid g2">
    <div class="card hi span">
      <h3>Biological Trajectory &bull; Current Position</h3>
      <div class="chart-card">${valleySVG({ phases: t.phases, week: wk, id: 'dv' })}</div>
      <h2 style="margin-top:1rem">${ph.title}</h2>
      <p class="muted" style="max-width:76ch;line-height:1.6">${ph.body}</p>
    </div>

    <div class="card">
      <h3>Today's Routine &bull; ${S.fmt(d, { month: 'long', day: 'numeric' })}</h3>
      <div class="daily-progress-bar">
        <div class="daily-progress-fill" style="width:${prog.pct}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:.84rem;margin-bottom:.9rem;color:var(--text-secondary)">
        <span>${prog.doneCount} of ${prog.totalCount} items completed</span>
        <b style="color:${prog.isComplete ? 'var(--accent)' : 'var(--muted)'}">${prog.isComplete ? 'Streak Protected!' : 'Incomplete'}</b>
      </div>
      ${items.map(i => {
        const on = i.kind === 'w' ? S.weeklyDone(i.key) : !!ck[i.key];
        return `
          <button class="chk" data-a="check" data-k="${i.key}" aria-pressed="${on}">
            <span class="box">&#10003;</span>
            <span>
              <b>${i.label}</b>
              <span>${i.sub}</span>
            </span>
          </button>`;
      }).join('')}
      <div class="streak">
        <div>
          <b>${S.streak()}</b>
          <span>Day Streak</span>
        </div>
        <div>
          <b>${S.adherence()}%</b>
          <span>14-Day Consistency</span>
        </div>
      </div>
      <div class="week-dots">${dots}</div>
    </div>

    <div class="card">
      <h3>Adherence Automation &bull; Never Miss a Dose</h3>
      <p class="muted" style="font-size:.92rem;line-height:1.5;margin-bottom:1rem">
        Customer research showed missing daily doses breaks routine momentum. Configure a friction-free automated nudge.
      </p>
      <div class="field">
        <label for="rt">Daily Reminder Time</label>
        <input id="rt" type="time" value="${S.get().remindAt}">
      </div>
      <div class="row">
        <button class="btn primary sm" data-a="ics">Add to Calendar (.ics)</button>
        <button class="btn ghost sm" data-a="notify">Browser Notification</button>
        <a class="btn ghost sm" data-a="wa" href="#">WhatsApp Self-Nudge</a>
      </div>
    </div>

    <div class="card">
      <h3>Week ${wk} Clinical Normalcy</h3>
      <ul class="list normal">
        ${ph.normal.map(x => `<li>${x}</li>`).join('')}
      </ul>
      <h3 style="margin-top:1.6rem">Key Actions This Week</h3>
      <ul class="list">
        ${ph.todo.map(x => `<li>${x}</li>`).join('')}
      </ul>
    </div>

    <div class="card">
      <h3>Follicular Signal Status</h3>
      <span class="badge ${sg.tone}">${sg.title}</span>
      <p style="margin:.9rem 0 1.2rem;color:var(--text-secondary);line-height:1.55">${sg.body}</p>
      <button class="btn ghost sm" data-a="tab" data-v="progress">Log Weekly Signal Assessment &rarr;</button>
      <h3 style="margin-top:1.8rem">Treatment Milestones</h3>
      <div class="ms">
        ${msNext.map(m => `
          <div class="${m.left < 0 ? 'past' : ''}">
            <span class="d">${m.day}</span>
            <span>
              <b>${m.name}</b>
              <span>${m.left < 0 ? 'Completed' : m.left === 0 ? 'Today' : 'In ' + m.left + ' days'} &bull; ${m.body}</span>
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

// ---------- TAB 2: PROGRESS & SIGNALS ----------
let draft = {};
function paneProgress() {
  const t = S.track();
  const L = S.get().logs;
  const sg = S.signal();
  const wk = S.weekNo();

  draft = Object.fromEntries(t.indicators.map(i => [i.key, 3]));
  draft.photo = null;

  const shed = t.id === 'hair' ? [3, 5] : null;
  const photos = L.filter(l => l.photo);
  const first = photos[0];
  const last = photos[photos.length - 1];
  const liveScore = S.calculateScore(draft, t);

  return `
  <div class="grid g2">
    <div class="card hi">
      <h3>Week ${wk} Telemetry Check-In</h3>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span class="muted" style="font-size:.88rem">Score your subjective micro-indicators:</span>
        <span class="pill" id="live-score-pill" style="color:var(--accent);border-color:var(--accent)">Live Score: ${liveScore}/100</span>
      </div>

      ${t.indicators.map(i => {
        const val = 3;
        const desc = i.levels ? i.levels[val - 1] : '';
        return `
          <div class="sl">
            <div class="top-l">
              <label for="s_${i.key}">${i.label}</label>
              <em id="v_${i.key}">Level ${val}/5</em>
            </div>
            <div class="sub-label" id="lvl_${i.key}">${desc}</div>
            <input id="s_${i.key}" type="range" min="1" max="5" value="${val}" data-k="${i.key}">
            <div class="ends">
              <span>${i.lo}</span>
              <span>${i.hi}</span>
            </div>
          </div>`;
      }).join('')}

      <div class="field">
        <label for="nt">Weekly Clinical Note (Optional)</label>
        <input id="nt" type="text" maxlength="140" placeholder="e.g. Scalp felt much calmer after gym; noticed fewer hairs on towel">
      </div>

      <div class="field">
        <label>Standardized Scalp/Beard Photo (Optional)</label>
        <button type="button" class="drop" data-a="pickphoto" id="drop">
          <span class="drop-ic">&#128247;</span>
          <span id="phn">
            <b>Tap to upload progress photo</b><br>
            <small>Same lighting, front/crown angle each week for true comparability</small>
          </span>
          <img id="phprev" alt="" hidden>
        </button>
        <input id="ph" type="file" accept="image/*" hidden>
      </div>

      <div class="row" style="margin-top:1.4rem">
        <button class="btn primary big" data-a="savelog">Save Weekly Check-In</button>
      </div>
    </div>

    <div class="card">
      <h3>Leading Follicular Signal Index</h3>
      ${L.length
        ? signalSVG(L, l => S.goodness(l), { shed })
        : `<p class="muted">Your baseline check-in creates your reference point. Subsequent weekly entries reveal biological movement long before the mirror shows it.</p>`
      }
      <div style="margin-top:1.2rem">
        <span class="badge ${sg.tone}">${sg.title}</span>
        <p style="margin-top:.7rem;color:var(--text-secondary);font-size:.95rem;line-height:1.55">${sg.body}</p>
      </div>
    </div>

    <div class="card">
      <h3>Standardized Photo Comparison</h3>
      ${first ? `
        <div class="photos">
          <div class="photo">
            <img src="${first.photo}" alt="Baseline photo">
            <em>Week ${first.week} &bull; Baseline</em>
          </div>
          ${last !== first ? `
            <div class="photo">
              <img src="${last.photo}" alt="Latest photo">
              <em>Week ${last.week} &bull; Latest</em>
            </div>
          ` : `
            <div class="photo">Capture your next photo in ~4 weeks for comparison</div>
          `}
        </div>
      ` : `
        <div class="photos">
          <div class="photo">Add photo at Week 1 baseline</div>
          <div class="photo">Second photo at Day 30</div>
        </div>
      `}
      <div class="row" style="margin-top:1.2rem">
        <button class="btn primary sm" data-a="pickphoto">&#128247; ${first ? 'Add Updated Photo' : 'Upload Baseline Photo'}</button>
      </div>
      <p class="muted" style="font-size:.82rem;margin-top:.8rem">All photos are compressed and stored strictly inside your browser storage.</p>
    </div>

    <div class="card">
      <h3>Historical Check-In Log</h3>
      ${L.length ? `
        <div class="hist">
          ${[...L].reverse().map(l => `
            <div>
              <b>${S.goodness(l)}</b>
              <span>
                Week ${l.week} &bull; ${S.fmt(l.date)}<br>
                <small>${esc(l.note) || t.indicators.map(i => `${i.label.slice(0, 10)}: ${l.vals[i.key]}/5`).join(' | ')}</small>
              </span>
              <button class="btn ghost sm" data-a="dellog" data-d="${l.date}" aria-label="Delete entry">&#10005;</button>
            </div>
          `).join('')}
        </div>
      ` : '<p class="muted">No weekly logs recorded yet.</p>'}
      <div class="row" style="margin-top:1.4rem">
        <button class="btn primary sm" data-a="summary">Generate Doctor-Ready Summary</button>
        <button class="btn ghost sm" data-a="export-data">Export Telemetry Data</button>
      </div>
    </div>
  </div>`;
}

function bindProgress() {
  const t = S.track();
  document.querySelectorAll('input[type=range][data-k]').forEach(r => {
    r.addEventListener('input', () => {
      const k = r.dataset.k;
      const v = +r.value;
      draft[k] = v;
      $('#v_' + k).textContent = `Level ${v}/5`;

      const ind = t.indicators.find(i => i.key === k);
      if (ind?.levels && ind.levels[v - 1]) {
        $('#lvl_' + k).textContent = ind.levels[v - 1];
      }

      const currentScore = S.calculateScore(draft, t);
      const pill = $('#live-score-pill');
      if (pill) pill.textContent = `Live Score: ${currentScore}/100`;
    });
  });

  const f = $('#ph');
  f?.addEventListener('change', async () => {
    const file = f.files[0];
    if (!file) return;
    draft.photo = await shrink(file);
    const pv = $('#phprev');
    pv.src = draft.photo;
    pv.hidden = false;
    $('#phn').innerHTML = '<b>&#10003; Progress photo staged</b><br><small>Click "Save Weekly Check-In" to persist</small>';
  });
}

function shrink(file) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const w = 540;
      const k = Math.min(1, w / img.width);
      const c = document.createElement('canvas');
      c.width = img.width * k;
      c.height = img.height * k;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.74));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

// ---------- TAB 3: AI COACH ----------
function paneCoach() {
  const t = S.track();
  if (!ui.chat.length) {
    ui.chat.push({
      role: 'assistant',
      content: `Hello &mdash; I am your Steady Clinical Companion. You are currently in Week ${S.weekNo()} (${S.phaseFor(S.weekNo()).name}). Feel free to ask about temporary shedding, product application protocols, expected timelines, or any ingredient questions.`,
      src: 'welcome'
    });
  }

  return `
  <div class="card coach" style="margin-top:1.4rem">
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
        <h3>Ask Steady AI Coach</h3>
        <span class="pill ai" style="font-size:.72rem">${ui.ai ? `Groq Cloud &bull; ${ui.modelName}` : 'Offline Clinical Mode'}</span>
      </div>
      <div class="chips">
        ${CHIPS[t.id].map(c => `<button class="chip" data-a="chip">${c}</button>`).join('')}
      </div>
    </div>
    <div class="msgs" id="msgs">
      ${ui.chat.map(msgHTML).join('')}
      ${ui.busy ? typingHTML() : ''}
    </div>
    <form class="composer" data-a="send">
      <input id="ci" type="text" maxlength="400" placeholder="Ask about shedding, timelines, derma roller, wash frequency..." autocomplete="off" aria-label="Message">
      <button class="btn primary" type="submit">Send</button>
    </form>
    <p class="muted" style="font-size:.78rem;margin-top:.9rem">
      Clinical Guardrail: Steady provides patient education and is not a substitute for formal diagnosis. For acute medical symptoms, book a free Man Matters physician consult.
    </p>
  </div>`;
}

const msgHTML = m => `
  <div class="m ${m.role === 'user' ? 'u' : 'a'}">
    ${esc(m.content)}
    ${m.src && m.src !== 'welcome'
      ? `<small>${m.src === 'groq' ? `&#9889; Groq AI (${ui.modelName})` : '&#128218; Offline Clinical Guide'}</small>`
      : ''}
  </div>`;

const typingHTML = () => `<div class="m a typing"><i></i><i></i><i></i></div>`;

function fallbackReply(q) {
  const s = q.toLowerCase();
  const hit = FALLBACK_QA.find(x => x.k.some(k => s.includes(k)));
  return hit ? hit.a : FALLBACK_DEFAULT;
}

async function ask(q) {
  if (!q.trim() || ui.busy) return;
  ui.chat.push({ role: 'user', content: q });
  ui.busy = true;
  refreshChat();

  let reply;
  let src = 'offline';

  try {
    const r = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: ui.chat.filter(m => m.src !== 'welcome').map(m => ({ role: m.role, content: m.content })),
        context: ctx()
      })
    });
    if (!r.ok) throw new Error('API offline');
    const j = await r.json();
    reply = j.reply;
    src = 'groq';
  } catch {
    reply = fallbackReply(q);
    await new Promise(r => setTimeout(r, 650));
  }

  ui.chat.push({ role: 'assistant', content: reply, src });
  ui.busy = false;
  refreshChat();
}

function refreshChat() {
  if (ui.tab !== 'coach') return;
  const m = $('#msgs');
  if (m) {
    m.innerHTML = ui.chat.map(msgHTML).join('') + (ui.busy ? typingHTML() : '');
    m.scrollTop = m.scrollHeight;
  }
}

// ---------- TAB 4: REFILL RUNWAY ----------
function paneRefill() {
  const r = S.get().refill;
  const f = S.refill();
  const states = {
    ok: ['good', 'Supply Protected &mdash; You have ample runway'],
    soon: ['warn', 'Reorder Window Approaching &mdash; Order now to prevent treatment break'],
    late: ['alert', 'Critical Action Required &mdash; Inside courier delivery buffer']
  };

  return `
  <div class="grid g2">
    <div class="card hi">
      <h3>Predictive Supply Runway</h3>
      <p class="muted" style="font-size:.92rem;line-height:1.55;margin-bottom:1rem">
        In customer research, a <b>12-day courier delay</b> broke one user's routine and stalled progress. Steady builds in a 12-day shipping buffer so replacement kits arrive before your current bottle empties.
      </p>
      <div class="field">
        <label for="rd">Last Kit Delivered On</label>
        <input id="rd" type="date" value="${r.delivered || ''}" max="${S.today()}">
      </div>
      <div class="row" style="align-items:flex-start">
        <div class="field" style="flex:1;min-width:140px">
          <label for="rs">Kit Supply Duration</label>
          <select id="rs">
            ${[30, 45, 60, 90].map(n => `<option value="${n}" ${+r.supply === n ? 'selected' : ''}>${n} Days Supply</option>`).join('')}
          </select>
        </div>
        <div class="field" style="flex:1;min-width:140px">
          <label for="rb">Transit Safety Buffer (Days)</label>
          <input id="rb" type="number" min="2" max="21" value="${r.buffer}">
        </div>
      </div>
      <button class="btn primary" data-a="saverefill">Calculate Supply Timeline</button>
    </div>

    <div class="card">
      ${f ? `
        <h3>Your Refill Timeline</h3>
        <span class="badge ${states[f.status][0]}">${states[f.status][1]}</span>
        <div class="bar ${f.status}"><i style="width:${f.pct}%"></i></div>
        <div class="row" style="justify-content:space-between;margin:1rem 0">
          <div>
            <div class="big-n">${Math.max(0, f.left)}</div>
            <span class="muted">Days of Product Remaining</span>
          </div>
          <div style="text-align:right">
            <div class="big-n" style="font-size:2.4rem;color:var(--accent)">${S.fmt(f.reorderBy)}</div>
            <span class="muted">Target Reorder Date</span>
          </div>
        </div>
        <div class="timeline">
          <div class="k">
            <b>${S.fmt(S.get().refill.delivered)} &bull; Kit Delivered</b>
            <span>Supply initiated</span>
          </div>
          <div class="w">
            <b>${S.fmt(f.reorderBy)} &bull; Reorder Deadline</b>
            <span>Guarantees ${r.buffer} transit days + 2 days handling buffer</span>
          </div>
          <div>
            <b>${S.fmt(f.runOut)} &bull; Final Dose</b>
            <span>Product exhausts</span>
          </div>
        </div>
        <div class="row" style="margin-top:1.4rem">
          <button class="btn primary sm" data-a="icsrefill">Set Reorder Calendar Alert</button>
          <a class="btn ghost sm" href="https://manmatters.com" target="_blank" rel="noopener">Reorder on Man Matters &rarr;</a>
        </div>
      ` : `
        <h3>Your Refill Timeline</h3>
        <p class="muted">Enter your last kit delivery date on the left to calculate your exact reorder deadline.</p>
      `}
    </div>
  </div>`;
}

function bindRefill() {}

// ---------- TAB 5: GUIDES ----------
function paneGuides() {
  const t = S.track();
  const g = [];
  if (t.id === 'beard') g.push(['roller', GUIDES.roller]);
  if (t.id === 'hair') g.push(['shed', GUIDES.shed]);

  const guide = ([k, x]) => `
    <details ${g[0]?.[0] === k ? 'open' : ''}>
      <summary>${x.title}</summary>
      <div class="body">
        <p class="muted" style="margin-bottom:1.1rem;font-size:.92rem">${x.subtitle}</p>
        <ol class="steps">
          ${x.steps.map(s => `
            <li>
              <span>
                <b>${s[0]}</b>
                <span>${s[1]}</span>
              </span>
            </li>
          `).join('')}
        </ol>
      </div>
    </details>`;

  return `
  <div style="margin-top:1.4rem">
    ${g.map(guide).join('')}

    ${t.id !== 'beard' ? `
      <details ${t.id === 'dandruff' ? 'open' : ''}>
        <summary>Interactive Shampoo Frequency Calculator</summary>
        <div class="body">
          <p class="muted" style="margin-bottom:1.1rem;font-size:.92rem">
            Customers experienced dryness when using daily. Adjust your scalp characteristics to calculate your recommended cadence:
          </p>
          ${[
            ['dry', 'Scalp Dryness / Tightness Post-Shower'],
            ['flk', 'Severity of Visible Flaking'],
            ['oil', 'Scalp Sebum / Oiliness Accumulation']
          ].map(([k, l]) => `
            <div class="sl">
              <div class="top-l">
                <label>${l}</label>
                <em id="ff_${k}">Level 3/5</em>
              </div>
              <input type="range" min="1" max="5" value="3" data-ff="${k}">
              <div class="ends"><span>Minimal</span><span>Extreme</span></div>
            </div>
          `).join('')}
          <div class="result" style="margin:1.2rem 0 0" id="ffres"></div>
        </div>
      </details>
    ` : ''}

    <details>
      <summary>Clinical Red Flags: When to Consult a Dermatologist</summary>
      <div class="body">
        <ul class="list">
          <li>Sudden patchy, round coin-sized bald spots (indicative of Alopecia Areata)</li>
          <li>Scalp pain, open pustules, swelling, bleeding, or burning</li>
          <li>Persistent heavy shedding extending past Week 8 without stabilization</li>
          <li>Allergic contact dermatitis: intense swelling of face, eyes, or neck</li>
          <li>Ambiguity about whether Stage 1 or prescription Minoxidil/Finasteride is required</li>
        </ul>
        <div class="notice" style="margin-top:1.2rem">
          Steady cannot formulate medical diagnoses. Use our Doctor-Ready Summary to streamline your free Man Matters physician appointment.
        </div>
      </div>
    </details>

    <details>
      <summary>The Biological Reality: Why Follicles Require 90 Days</summary>
      <div class="body">
        <p class="muted" style="line-height:1.65;font-size:.94rem">
          Hair and beard follicles undergo distinct biological life cycles lasting months. Topicals and nutra-actives first suppress DHT binding and re-oxygenate miniaturized roots. Only after the follicle cellular matrix resets can new anagen shafts push through the epidermis. That is why Steady tracks <b style="color:var(--text)">leading indicators</b> &mdash; drain counts, scalp comfort, hair resilience &mdash; which manifest weeks before visible cosmetic density.
        </p>
      </div>
    </details>
  </div>`;
}

function bindGuides() {
  const upd = () => {
    const v = k => +document.querySelector(`[data-ff=${k}]`).value;
    const r = frequencyAdvice({ dryness: v('dry'), flakes: v('flk'), oil: v('oil') });
    ['dry', 'flk', 'oil'].forEach(k => {
      const el = $('#ff_' + k);
      if (el) el.textContent = `Level ${v(k)}/5`;
    });
    const resEl = $('#ffres');
    if (resEl) {
      resEl.innerHTML = `
        <span class="eyebrow">Calculated Protocol</span>
        <h2 style="font-size:2.2rem;margin:.3rem 0">${r.n}&times; Per Week</h2>
        <p style="line-height:1.6">${r.txt}</p>
        <p class="muted" style="font-size:.82rem;margin-top:.7rem">Always defer to official pack inserts. If severe scaling or erythema develops, seek clinical evaluation.</p>`;
    }
  };
  document.querySelectorAll('[data-ff]').forEach(r => r.addEventListener('input', upd));
  if ($('#ffres')) upd();
}

// ---------- CALENDAR & REMINDERS ----------
function download(name, text, type = 'text/calendar') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}

function icsDt(d, hm) {
  return d.replace(/-/g, '') + 'T' + hm.replace(':', '') + '00';
}

function ics(title, desc, date, hm, count) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Steady//Man Matters Companion//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@steady.manmatters`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${icsDt(date, hm)}`,
    `DTEND:${icsDt(date, hm)}`,
    count > 1 ? `RRULE:FREQ=DAILY;COUNT=${count}` : '',
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    'BEGIN:VALARM',
    'TRIGGER:PT0M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
}

let notifTimer;
function scheduleNotif(hm) {
  clearTimeout(notifTimer);
  const [h, m] = hm.split(':').map(Number);
  const now = new Date();
  const at = new Date();
  at.setHours(h, m, 0, 0);
  if (at < now) at.setDate(at.getDate() + 1);

  notifTimer = setTimeout(() => {
    try {
      new Notification('Steady &bull; Man Matters', {
        body: `Day ${S.dayNo()}: Time for your daily routine. Protect your streak!`,
        icon: '/icon.png'
      });
    } catch {}
    scheduleNotif(hm);
  }, at - now);
}

// ---------- EVENT HANDLERS ----------
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  const a = el.dataset.a;
  const v = el.dataset.v;
  const o = ui.ob;

  if (a === 'send') return;

  if (a === 'demo') {
    e.preventDefault();
    S.loadDemo();
    ui.tab = 'today';
    ui.chat = [];
    location.hash = '#/app';
    route();
    toast('Loaded Week-6 Journey Demo');
  }
  else if (a === 'reset') {
    if (confirm('Reset your companion journey on this device?')) {
      S.reset();
      ui = {
        ...ui,
        tab: 'today',
        chat: [],
        ob: { step: 1, track: null, ans: {}, trig: [], start: S.today() }
      };
      location.hash = '#/';
      route();
      toast('Journey reset');
    }
  }
  else if (a === 'pick') {
    o.track = v;
    viewStart(false);
  }
  else if (a === 'ans') {
    o.ans[el.dataset.k] = +el.dataset.v;
    const y = scrollY;
    viewStart(false);
    scrollTo(0, y);
  }
  else if (a === 'trig') {
    const i = +v;
    o.trig = o.trig.includes(i) ? o.trig.filter(x => x !== i) : [...o.trig, i];
    const y = scrollY;
    viewStart(false);
    scrollTo(0, y);
  }
  else if (a === 'next') {
    o.step++;
    viewStart();
  }
  else if (a === 'back') {
    o.step = Math.max(1, o.step - 1);
    viewStart();
  }
  else if (a === 'skip') {
    o.step = 3;
    viewStart();
  }
  else if (a === 'begin') {
    const start = $('#st').value || S.today();
    const remind = $('#ra').value || '09:00';
    const stage = o.track === 'hair' && STAGE_QUESTIONS.every(q => o.ans[q.key] != null)
      ? stageFrom(scoreStage(o.ans, o.trig).score).n
      : null;

    S.set({
      track: o.track,
      start,
      stage,
      remindAt: remind,
      demo: false,
      checkins: {},
      logs: []
    });
    ui.tab = 'today';
    ui.chat = [];
    location.hash = '#/app';
    route();
    toast('Welcome to Steady!');
  }
  else if (a === 'tab') {
    switchTab(v);
  }
  else if (a === 'check') {
    const d = S.today();
    const st = S.get();
    const c = { ...(st.checkins[d] || {}) };
    const key = el.dataset.k;
    c[key] = !c[key];
    S.set({ checkins: { ...st.checkins, [d]: c } });
    switchTab('today', false);
    viewAppHeaderRefresh();
    if (c[key]) {
      toast(S.isDayComplete(d) ? `All items checked! Streak: ${S.streak()} days` : 'Routine item logged');
    }
  }
  else if (a === 'pickphoto') {
    $('#ph')?.click();
    $('#ph')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  else if (a === 'savelog') {
    const t = S.track();
    const st = S.get();
    const date = S.today();
    const entry = {
      date,
      week: S.weekNo(),
      vals: Object.fromEntries(t.indicators.map(i => [i.key, draft[i.key]])),
      note: $('#nt').value.trim(),
      photo: draft.photo
    };
    const logs = [...st.logs.filter(l => l.date !== date), entry].sort((x, y) => x.date.localeCompare(y.date));
    S.set({ logs });
    switchTab('progress', false);
    toast('Weekly telemetry check-in saved');
  }
  else if (a === 'dellog') {
    if (confirm('Remove this check-in entry?')) {
      S.set({ logs: S.get().logs.filter(l => l.date !== el.dataset.d) });
      switchTab('progress', false);
      toast('Entry removed');
    }
  }
  else if (a === 'summary') {
    summary();
  }
  else if (a === 'chip') {
    ask(el.textContent);
  }
  else if (a === 'saverefill') {
    const supply = parseInt($('#rs').value, 10);
    if (!Number.isFinite(supply) || supply <= 0) {
      toast('Please choose a valid supply duration');
      return;
    }
    S.set({
      refill: {
        delivered: $('#rd').value || null,
        supply,
        buffer: Math.max(2, +$('#rb').value || 12)
      }
    });
    switchTab('refill', false);
    toast('Refill runway recalculated');
  }
  else if (a === 'icsrefill') {
    const f = S.refill();
    download(
      'steady-manmatters-reorder.ics',
      ics('Reorder Man Matters Kit', 'Reorder now so your package arrives before your current kit empties.', f.reorderBy < S.today() ? S.today() : f.reorderBy, '10:00', 1)
    );
    toast('Reorder reminder downloaded (.ics)');
  }
  else if (a === 'ics') {
    const hm = $('#rt').value || '09:00';
    S.set({ remindAt: hm });
    const t = S.track();
    download(
      'steady-daily-routine.ics',
      ics(`Steady: ${t.label} Routine`, 'Daily habit check-in for your Man Matters routine. Consistency drives results.', S.today(), hm, t.total)
    );
    toast('Daily calendar reminder downloaded (.ics)');
  }
  else if (a === 'notify') {
    const hm = $('#rt').value || '09:00';
    S.set({ remindAt: hm });
    if (!('Notification' in window)) return toast('Browser notifications not supported');
    const p = await Notification.requestPermission();
    if (p === 'granted') {
      scheduleNotif(hm);
      toast(`Notification set for ${hm} daily`);
    } else {
      toast('Notifications blocked &mdash; use Calendar (.ics) instead');
    }
  }
  else if (a === 'wa') {
    e.preventDefault();
    const t = S.track();
    window.open(
      'https://wa.me/?text=' + encodeURIComponent(`Steady Reminder: Day ${S.dayNo()} of my ${t.label.toLowerCase()} regimen. Gummies & topicals checked off today? Streak: ${S.streak()} days.`),
      '_blank',
      'noopener'
    );
  }
  else if (a === 'copy') {
    navigator.clipboard?.writeText($('#sumtxt').textContent).then(() => toast('Summary copied to clipboard'));
  }
  else if (a === 'export-data') {
    download('steady-telemetry.json', S.exportJourney(), 'application/json');
    toast('Exported journey telemetry');
  }
  else if (a === 'doctor-modal') {
    doctorModal();
  }
  else if (a === 'ai-modal') {
    aiInfoModal();
  }
  else if (a === 'close') {
    closeModal();
  }
});

document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.dataset.a === 'send') {
    const i = $('#ci');
    const q = i.value;
    i.value = '';
    ask(q);
  }
});

function viewAppHeaderRefresh() {
  const m = document.querySelector('.meta .pill:nth-child(2)');
  if (m) m.textContent = `${S.streak()}-Day Streak`;
}

// ---------- DOCTOR-READY SUMMARY MODAL ----------
async function summary() {
  const t = S.track();
  const L = S.get().logs;
  const lines = L.map(l => ({
    week: l.week,
    text: t.indicators.map(i => `${i.label}: ${l.vals[i.key]}/5`).join(', ') + (l.note ? ` ("${l.note}")` : '')
  }));

  const base = `MAN MATTERS TELEHEALTH PROGRESS BRIEF
Regimen: ${t.label} &bull; ${t.product}
Patient Telemetry: Day ${S.dayNo()} (Week ${S.weekNo()}) &bull; Current Streak: ${S.streak()} Days
14-Day Routine Compliance: ${S.adherence()}%
Leading Signal Trend: ${S.signal().title}

WEEKLY TELEMETRY LOGS:
${L.length ? lines.slice(-4).map(l => `• Week ${l.week}: ${l.text}`).join('\n') : '• Baseline logged. Subsequent entries in progress.'}

PHYSICIAN INQUIRIES:
1. Is my current protocol optimal for my observed stage?
2. Are my shedding indicators aligned with expected telogen reset?
3. Should any adjunctive active ingredients be incorporated at this milestone?`;

  modal(`
    <span class="eyebrow">Clinical Telemetry &bull; Doctor Brief</span>
    <h2 style="font:400 2rem var(--serif);margin:.5rem 0 .8rem">Doctor-Ready Progress Summary</h2>
    <p class="muted" style="font-size:.9rem;line-height:1.5">
      Paste this synthesized summary into your Man Matters doctor chat or share with your dermatologist to bypass generic intake questions.
    </p>
    <pre id="sumtxt">${esc(base)}</pre>
    <div class="row">
      <button class="btn primary" data-a="copy">Copy Brief to Clipboard</button>
      <a class="btn ghost" href="https://manmatters.com" target="_blank" rel="noopener">Open Doctor Chat &rarr;</a>
      <button class="btn ghost" data-a="close">Close</button>
      <span class="muted" id="sumsrc" style="font-size:.82rem;margin-left:auto">${ui.ai ? `Polishing with Groq AI (${ui.modelName})...` : ''}</span>
    </div>`);

  if (!ui.ai) return;

  try {
    const r = await fetch('/api/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: ctx(), logs: lines })
    });
    if (!r.ok) throw new Error('Insight endpoint unreachable');
    const j = await r.json();
    if ($('#sumtxt') && j.reply) {
      $('#sumtxt').textContent = j.reply;
      $('#sumsrc').textContent = `Synthesized by Groq AI (${ui.modelName})`;
    }
  } catch {
    const s = $('#sumsrc');
    if (s) s.textContent = '';
  }
}

// ---------- DOCTOR MODAL ----------
function doctorModal() {
  modal(`
    <span class="eyebrow">Mosaic Wellness Clinical Network</span>
    <h2 style="font:400 2.1rem var(--serif);margin:.5rem 0 .8rem">Free Man Matters Doctor Consultation</h2>
    <p class="muted" style="font-size:.95rem;line-height:1.6;margin-bottom:1.2rem">
      Every Man Matters customer is entitled to free, confidential 1-on-1 consultations with registered dermatologists and medical trichologists.
    </p>
    <div class="notice" style="margin-bottom:1.4rem">
      <b>Pro-Tip:</b> Use the <b>Doctor-Ready Summary</b> feature in the Progress tab. It synthesizes your week-by-week adherence and signal metrics into a concise clinical brief.
    </div>
    <div class="row">
      <a class="btn primary" href="https://manmatters.com" target="_blank" rel="noopener">Connect to Telehealth Portal &rarr;</a>
      <button class="btn ghost" data-a="close">Done</button>
    </div>`);
}

// ---------- AI INFO MODAL ----------
function aiInfoModal() {
  modal(`
    <span class="eyebrow">Architecture &bull; Dual AI Engine</span>
    <h2 style="font:400 2.1rem var(--serif);margin:.5rem 0 .8rem">How Steady AI Works</h2>
    <p class="muted" style="font-size:.94rem;line-height:1.6;margin-bottom:1.2rem">
      Steady operates on a resilient dual-mode architecture designed to ensure zero downtime and strict medical safety.
    </p>
    <div class="why" style="margin-bottom:1.2rem">
      <div>
        <b>1. Cloud Groq Inference (${ui.modelName})</b>
        <span>Ultra-low latency LPU inference powering contextual coaching grounded in your treatment week, streak, and logged signals.</span>
      </div>
      <div>
        <b>2. Offline Clinical Rulebook</b>
        <span>If offline or without an API key, Steady seamlessly falls back to a deterministic trichological QA knowledge base.</span>
      </div>
    </div>
    <div class="notice" style="margin-bottom:1.4rem">
      ${ui.ai
        ? `<b>Status:</b> Groq Cloud AI is currently <b>ACTIVE</b> using model <code>${ui.modelName}</code>.`
        : `<b>Status:</b> Operating in <b>Offline Clinical Mode</b>. Paste your Groq API key into <code>steady/.env</code> to activate Groq AI.`}
    </div>
    <div class="row">
      <button class="btn ghost" data-a="close">Close</button>
    </div>`);
}

// ---------- INITIALIZATION ----------
if ('Notification' in window && Notification.permission === 'granted' && S.get().track) {
  scheduleNotif(S.get().remindAt);
}
if (!location.hash && S.get().track) {
  location.hash = '#/app';
}
route();
