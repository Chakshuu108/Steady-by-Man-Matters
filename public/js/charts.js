import { PHASE_COLORS } from './data.js';

// ===================================================================
// Chart Dimensions & Coordinate Geometry
// ===================================================================
const W = 1000, H = 400;
const PL = 55, PR = 45, PT = 48, PB = 55;
const WEEKS = 16;

const X = w => PL + (Math.max(0, Math.min(WEEKS, w)) / WEEKS) * (W - PL - PR);
// Maps progress index [-0.25 .. 1.05] smoothly into the canvas height
const Y = v => PT + (1 - (v + 0.28) / 1.33) * (H - PT - PB);

// Realistic psychological progress points across 16 weeks
// Dips during week 3-5 shedding, levels in quiet valley, accelerates week 10+
const FELT = [
  [0, 0],
  [1, 0.02],
  [2, 0.0],
  [3, -0.1],
  [4, -0.18],
  [5, -0.12],
  [6, -0.02],
  [7, 0.03],
  [8, 0.1],
  [10, 0.32],
  [12, 0.58],
  [14, 0.78],
  [16, 0.94]
];

const EXPECT = [
  [0, 0],
  [16, 0.92]
];

// ===================================================================
// Mathematical Spline Interpolator (Continuous C1 Catmull-Rom -> Bezier)
// Passes through every point with zero sharp kinks or awkward corners
// ===================================================================
function getCurvedPath(pts) {
  if (pts.length < 2) return '';
  const p = pts.map(([w, v]) => [X(w), Y(v)]);
  let d = `M ${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;

  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(i - 1, 0)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(i + 2, p.length - 1)];

    // Catmull-Rom spline control points calculation
    const cp1x = p1[0] + (p2[0] - p0[0]) / 5.5;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 5.5;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 5.5;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 5.5;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

// Cubic Hermite interpolation to get the exact Y position for any fractional week
export const feltAt = w => {
  for (let i = 0; i < FELT.length - 1; i++) {
    const [a, va] = FELT[i];
    const [b, vb] = FELT[i + 1];
    if (w >= a && w <= b) {
      const t = (w - a) / (b - a);
      // Smooth Hermite blend
      const s = t * t * (3 - 2 * t);
      return va + (vb - va) * s;
    }
  }
  return FELT[FELT.length - 1][1];
};

// ===================================================================
// 1. The Valley Chart (Hero & Today Dashboard)
// ===================================================================
export function valleySVG({ phases, week = null, id = 'v' } = {}) {
  // Top phase header pills - clean, non-overlapping, perfectly bounded
  const phasePills = phases.map(p => {
    const a = Math.max(0, p.from - 1);
    const b = Math.min(WEEKS, p.to);
    if (a >= WEEKS) return '';
    const x1 = X(a);
    const x2 = X(b);
    const width = Math.max(20, x2 - x1);
    const c = PHASE_COLORS[p.mood] || '#b6f26b';
    const isCurrent = week != null && week >= p.from && week <= p.to;

    return `
      <!-- Phase Column ${p.name} -->
      <rect x="${x1.toFixed(1)}" y="${PT}" width="${width.toFixed(1)}" height="${(H - PT - PB).toFixed(1)}" fill="${c}" fill-opacity="${isCurrent ? '0.08' : '0.035'}"/>
      <line x1="${x1.toFixed(1)}" x2="${x1.toFixed(1)}" y1="${PT}" y2="${H - PB}" stroke="${c}" stroke-opacity="0.2" stroke-dasharray="3 4"/>
      <!-- Top Phase Badge -->
      <g transform="translate(${((x1 + x2) / 2).toFixed(1)}, 24)">
        <rect x="-${Math.min(width / 2 - 2, 54).toFixed(1)}" y="-12" width="${Math.min(width - 4, 108).toFixed(1)}" height="24" rx="12" fill="${c}" fill-opacity="${isCurrent ? '0.25' : '0.1'}" stroke="${c}" stroke-opacity="${isCurrent ? '0.8' : '0.2'}"/>
        <text text-anchor="middle" y="4" font-family="'Manrope', sans-serif" font-size="10.5" font-weight="800" fill="${c}" letter-spacing="0.04em">
          ${p.name.length > 13 && width < 120 ? p.name.split(' ')[0] : p.name}
        </text>
      </g>`;
  }).join('');

  // Bottom Week Ticks
  const ticks = [0, 2, 4, 6, 8, 10, 12, 14, 16].map(w => {
    const label = w === 0 ? 'Day 0' : `Wk ${w}`;
    return `<text x="${X(w).toFixed(1)}" y="${H - 18}" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="11.5" font-weight="600" fill="var(--muted)">${label}</text>`;
  }).join('');

  // Horizontal Grid Lines & Baseline
  const zeroY = Y(0).toFixed(1);
  const baseline = `
    <line x1="${PL}" x2="${W - PR}" y1="${zeroY}" y2="${zeroY}" stroke="var(--line-strong)" stroke-dasharray="4 4"/>
    <g transform="translate(${PL + 8}, ${zeroY - 7})">
      <rect x="0" y="-11" width="86" height="18" rx="9" fill="var(--bg)" fill-opacity="0.8"/>
      <text x="4" y="2" font-family="'Manrope', sans-serif" font-size="10" font-weight="700" fill="var(--muted)" letter-spacing="0.05em">BASELINE LEVEL</text>
    </g>`;

  // Smoothed paths
  const feltD = getCurvedPath(FELT);
  const expectD = `M ${X(EXPECT[0][0])},${Y(EXPECT[0][1])} L ${X(EXPECT[1][0])},${Y(EXPECT[1][1])}`;

  // Interactive Marker for Dashboard
  let marker = '';
  const currentWeek = week != null ? Math.min(WEEKS, Math.max(1, week)) : null;
  const clipX = currentWeek != null ? X(currentWeek).toFixed(1) : 0;

  if (currentWeek != null) {
    const mx = X(currentWeek);
    const my = Y(feltAt(currentWeek));
    marker = `
      <g class="vl-you">
        <line x1="${mx.toFixed(1)}" x2="${mx.toFixed(1)}" y1="${my.toFixed(1)}" y2="${H - PB}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 4" opacity="0.75"/>
        <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="18" fill="var(--accent)" opacity="0.18" class="pulse"/>
        <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="7.5" fill="var(--accent)" stroke="var(--bg)" stroke-width="3.5"/>
        <!-- Pill Tooltip -->
        <g transform="translate(${Math.min(mx, W - 110).toFixed(1)}, ${(my - 32).toFixed(1)})">
          <rect x="-48" y="-14" width="96" height="26" rx="13" fill="var(--accent)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))"/>
          <text text-anchor="middle" y="3.5" font-family="'Manrope', sans-serif" font-size="11" font-weight="800" fill="var(--accent-ink)">YOU ARE HERE</text>
        </g>
      </g>`;
  }

  // Strategic Non-Overlapping Callout Badges (Cleanly placed away from curves)
  const annotations = week == null ? `
    <!-- Annotations with protective backing pill -->
    <g transform="translate(${X(4).toFixed(1)}, ${(Y(-0.18) + 38).toFixed(1)})">
      <rect x="-42" y="-12" width="84" height="22" rx="11" fill="var(--card-elevated)" stroke="var(--warn)" stroke-width="1.2" opacity="0.95"/>
      <text text-anchor="middle" y="3" font-family="'Fraunces', serif" font-style="italic" font-size="12" fill="var(--warn)">The Shed Surge</text>
    </g>
    <g transform="translate(${X(7.5).toFixed(1)}, ${(Y(0.06) + 36).toFixed(1)})">
      <rect x="-56" y="-12" width="112" height="22" rx="11" fill="var(--card-elevated)" stroke="var(--cool)" stroke-width="1.2" opacity="0.95"/>
      <text text-anchor="middle" y="3" font-family="'Fraunces', serif" font-style="italic" font-size="12" fill="var(--cool)">Where Most Quit</text>
    </g>
    <g transform="translate(${X(13).toFixed(1)}, ${(Y(0.68) + 36).toFixed(1)})">
      <rect x="-50" y="-12" width="100" height="22" rx="11" fill="var(--card-elevated)" stroke="var(--accent)" stroke-width="1.2" opacity="0.95"/>
      <text text-anchor="middle" y="3" font-family="'Fraunces', serif" font-style="italic" font-size="12" fill="var(--accent)">First Visible Signs</text>
    </g>
    <g transform="translate(${X(11.5).toFixed(1)}, ${(Y(0.66) - 16).toFixed(1)})">
      <rect x="-48" y="-11" width="96" height="20" rx="10" fill="var(--bg)" stroke="var(--line-strong)" opacity="0.9"/>
      <text text-anchor="middle" y="3" font-family="'Manrope', sans-serif" font-size="10" font-weight="700" fill="var(--muted)">NAIVE EXPECTATION</text>
    </g>
  ` : '';

  return `
  <svg viewBox="0 0 ${W} ${H}" class="valley" role="img" aria-label="Visual representation of treatment progress vs naive expectation">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="35%" stop-color="#f59e0b"/>
        <stop offset="60%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#b6f26b"/>
      </linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b6f26b" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#b6f26b" stop-opacity="0"/>
      </linearGradient>
      ${week != null ? `<clipPath id="${id}c"><rect x="0" y="0" width="${clipX}" height="${H}"/></clipPath>` : ''}
    </defs>

    <!-- Phase Background Columns -->
    ${phasePills}

    <!-- Baseline -->
    ${baseline}

    <!-- Expectation Curve (Dashed line) -->
    <path d="${expectD}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>

    <!-- Felt Progress Curve (Smooth Organic Spline) -->
    ${week != null ? `
      <!-- Inactive background curve -->
      <path d="${feltD}" fill="none" stroke="var(--line-strong)" stroke-width="3" stroke-linecap="round"/>
      <!-- Active filled area up to current week -->
      <path d="${feltD} L ${clipX},${H - PB} L ${PL},${H - PB} Z" fill="url(#${id}f)" clip-path="url(#${id}c)"/>
      <!-- Active colored stroke up to current week -->
      <path d="${feltD}" fill="none" stroke="url(#${id}g)" stroke-width="4.5" stroke-linecap="round" clip-path="url(#${id}c)"/>
    ` : `
      <!-- Animated landing page curve -->
      <path id="${id}p" class="draw" d="${feltD}" fill="none" stroke="url(#${id}g)" stroke-width="4.5" stroke-linecap="round" pathLength="1"/>
      <g id="${id}dot" style="opacity:0">
        <circle r="18" fill="var(--accent)" opacity="0.2" class="pulse"/>
        <circle r="7.5" fill="var(--accent)" stroke="var(--bg)" stroke-width="3"/>
      </g>
    `}

    <!-- Annotations & Interactive Markers -->
    ${annotations}
    ${marker}

    <!-- Bottom Ticks -->
    ${ticks}
  </svg>`;
}

// Animate dot along the landing page curve - High-Performance Pre-Sampled Engine
export function animateValley(root, id = 'v', onPhase) {
  const path = root.querySelector(`#${id}p`);
  const dot = root.querySelector(`#${id}dot`);
  if (!path || !dot) return () => {};

  const len = path.getTotalLength();
  // Pre-sample 240 coordinates so getPointAtLength is NEVER called in the RAF loop
  const SAMPLES = 240;
  const samples = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const pt = path.getPointAtLength((len * i) / SAMPLES);
    samples.push({ x: pt.x.toFixed(1), y: pt.y.toFixed(1) });
  }

  path.style.strokeDasharray = len.toFixed(1);
  path.style.strokeDashoffset = len.toFixed(1);
  const dur = 7500;
  let raf, t0;
  let stop = false;
  let lastW = -1;

  const frame = ts => {
    if (stop) return;
    if (!t0) t0 = ts;
    const k = Math.min(1, (ts - t0) / dur);
    const e = 1 - Math.pow(1 - k, 2.2);

    path.style.strokeDashoffset = (len * (1 - e)).toFixed(1);
    const idx = Math.min(SAMPLES, Math.round(e * SAMPLES));
    const pt = samples[idx];
    dot.style.opacity = '1';
    dot.setAttribute('transform', `translate(${pt.x},${pt.y})`);

    const currentW = Math.round(e * WEEKS);
    if (currentW !== lastW) {
      lastW = currentW;
      if (onPhase) onPhase(currentW);
    }

    if (k < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      t0 = null;
      setTimeout(() => {
        if (!stop) raf = requestAnimationFrame(frame);
      }, 2500);
    }
  };

  raf = requestAnimationFrame(frame);
  return () => {
    stop = true;
    cancelAnimationFrame(raf);
  };
}

// ===================================================================
// 2. The Signal Index Chart (Progress Tab)
// Smooth cubic Hermite spline + clear, non-overlapping labels
// ===================================================================
export function signalSVG(logs, goodnessFn, { shed = null } = {}) {
  const w = 780, h = 280;
  const pl = 52, pr = 32, pt = 35, pb = 48;
  const maxW = Math.max(12, ...logs.map(l => l.week));

  const x = wk => pl + ((wk - 1) / (maxW - 1)) * (w - pl - pr);
  const y = v => pt + (1 - v / 100) * (h - pt - pb);

  const pts = logs.map(l => [x(l.week), y(goodnessFn(l)), l, goodnessFn(l)]);
  const baseScore = goodnessFn(logs[0]);
  const baseY = y(baseScore);

  // Horizontal Grid Lines & Ticks (0, 25, 50, 75, 100)
  const grid = [0, 25, 50, 75, 100].map(v => {
    const gy = y(v);
    return `
      <line x1="${pl}" x2="${w - pr}" y1="${gy.toFixed(1)}" y2="${gy.toFixed(1)}" stroke="var(--line)" stroke-dasharray="3 4"/>
      <text x="${pl - 10}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-family="'Manrope', sans-serif" font-size="11" font-weight="600" fill="var(--muted)">${v}</text>`;
  }).join('');

  // Bottom Week Labels
  const xt = Array.from({ length: maxW }, (_, i) => i + 1)
    .filter(i => i === 1 || i % 2 === 0 || i === maxW)
    .map(i => `<text x="${x(i).toFixed(1)}" y="${h - 14}" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="11.5" font-weight="600" fill="var(--muted)">W${i}</text>`)
    .join('');

  // Shaded Expected Shed Window with Header Pill
  let band = '';
  if (shed) {
    const sx1 = x(shed[0]);
    const sx2 = x(shed[1]);
    const sw = sx2 - sx1;
    band = `
      <rect x="${sx1.toFixed(1)}" y="${pt}" width="${sw.toFixed(1)}" height="${h - pt - pb}" fill="#f59e0b" fill-opacity="0.08"/>
      <line x1="${sx1.toFixed(1)}" x2="${sx1.toFixed(1)}" y1="${pt}" y2="${h - pb}" stroke="#f59e0b" stroke-opacity="0.3" stroke-dasharray="3 3"/>
      <line x1="${sx2.toFixed(1)}" x2="${sx2.toFixed(1)}" y1="${pt}" y2="${h - pb}" stroke="#f59e0b" stroke-opacity="0.3" stroke-dasharray="3 3"/>
      <g transform="translate(${((sx1 + sx2) / 2).toFixed(1)}, 18)">
        <rect x="-65" y="-10" width="130" height="20" rx="10" fill="var(--card-elevated)" stroke="#f59e0b" stroke-width="1.2" opacity="0.95"/>
        <text text-anchor="middle" y="4" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="800" fill="#f59e0b" letter-spacing="0.05em">EXPECTED SHED WINDOW</text>
      </g>`;
  }

  // Baseline Reference Line (Cleanly offset, no text collision)
  const baseLine = `
    <line x1="${pl}" x2="${w - pr}" y1="${baseY.toFixed(1)}" y2="${baseY.toFixed(1)}" stroke="var(--muted)" stroke-dasharray="5 5" opacity="0.6"/>
    <g transform="translate(${w - pr - 80}, ${(baseY - 8).toFixed(1)})">
      <rect x="0" y="-10" width="80" height="16" rx="8" fill="var(--bg)" fill-opacity="0.85"/>
      <text x="40" y="2" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="700" fill="var(--muted)" letter-spacing="0.04em">YOUR BASELINE</text>
    </g>`;

  // Build Smooth Bezier Path for Signal Data Points
  let smoothLine = '';
  let smoothArea = '';
  if (pts.length > 1) {
    let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      const cp1x = p1[0] + (p2[0] - p0[0]) / 5;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 5;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 5;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 5;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    smoothLine = `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="draw2"/>`;
    smoothArea = `<path d="${d} L ${pts[pts.length - 1][0].toFixed(1)},${h - pb} L ${pts[0][0].toFixed(1)},${h - pb} Z" fill="url(#sigG)"/>`;
  }

  // Data Point Markers with Mini-Score Callouts
  const pointCircles = pts.map(p => `
    <g class="sig-pt">
      <circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="6" fill="var(--bg)" stroke="var(--accent)" stroke-width="3">
        <title>Week ${p[2].week}: Score ${p[3]}/100</title>
      </circle>
      <circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.5" fill="var(--accent)"/>
    </g>
  `).join('');

  return `
  <svg viewBox="0 0 ${w} ${h}" class="sigchart" role="img" aria-label="Signal index per weekly check-in">
    <defs>
      <linearGradient id="sigG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b6f26b" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#b6f26b" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Grid -->
    ${grid}

    <!-- Shaded Shed Window -->
    ${band}

    <!-- Baseline -->
    ${baseLine}

    <!-- Smooth Spline & Area -->
    ${smoothArea}
    ${smoothLine}

    <!-- Data Circles -->
    ${pointCircles}

    <!-- Bottom Ticks -->
    ${xt}
  </svg>`;
}

// ===================================================================
// 3. Circular Progress Ring
// ===================================================================
export function ringSVG(pct, label, sub) {
  const r = 50;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, pct)) / 100);

  return `
  <svg viewBox="0 0 130 130" class="ring" role="img" aria-label="Journey progress: ${pct}%">
    <defs>
      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#b6f26b"/>
      </linearGradient>
    </defs>
    <circle cx="65" cy="65" r="${r}" fill="none" stroke="var(--line-strong)" stroke-width="8"/>
    <circle cx="65" cy="65" r="${r}" fill="none" stroke="url(#rg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" transform="rotate(-90 65 65)" class="ring-fg"/>
    <text x="65" y="66" text-anchor="middle" font-family="'Fraunces', serif" font-size="28" font-weight="600" fill="var(--text)">${label}</text>
    <text x="65" y="85" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="800" fill="var(--muted)" letter-spacing="0.08em">${sub}</text>
  </svg>`;
}
