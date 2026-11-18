// Content & rules for Steady. Derived directly from customer-research patterns (Man Matters cohort).

export const TRACKS = {
  hair: {
    id: 'hair',
    label: 'Hair fall',
    emoji: '🌿',
    product: 'Stage 1 Hairfall Kit (shampoo + gummies)',
    blurb: 'Anti-Hairfall Shampoo + Biotin Gummies for early thinning and shedding.',
    total: 90,
    daily: [
      { key: 'gummies', label: 'Took my Biotin gummies', sub: 'Daily with water, ideally at a fixed time' },
    ],
    wash: { key: 'shampoo', label: 'Washed with DHT-blocking shampoo', sub: '2–3 times a week on wash days' },
    weekly: [],
    milestones: [
      { day: 30, name: 'Day 30 Baseline Pulse-Check', body: 'Assess follicle response, capture photo under identical lighting.' },
      { day: 60, name: 'Day 60 Mid-Point Telehealth Review', body: 'Share your clinical progress summary with a Man Matters doctor.' },
      { day: 90, name: 'Day 90 Full Clinical Review', body: 'Compare baseline vs day 90 photos, evaluate density gains.' },
    ],
    indicators: [
      {
        key: 'drain',
        label: 'Hair shed in shower drain',
        lo: 'Rare strands',
        hi: 'Heavy clumps',
        lowerBetter: true,
        levels: [
          'Barely any (<10 strands)',
          'Light shed (10–25 strands)',
          'Moderate shed (25–50 strands)',
          'Noticeable loss (50–100 strands)',
          'Heavy clumps (>100 strands)'
        ]
      },
      {
        key: 'itch',
        label: 'Scalp itch & micro-inflammation',
        lo: 'Calm & clear',
        hi: 'Constant itch',
        lowerBetter: true,
        levels: [
          'Zero irritation / completely calm',
          'Mild occasional tingling',
          'Moderate itchiness',
          'Frequent itch / urges to scratch',
          'Persistent intense irritation'
        ]
      },
      {
        key: 'thick',
        label: 'Felt follicle thickness & body',
        lo: 'Limp & thin',
        hi: 'Dense & full',
        lowerBetter: false,
        levels: [
          'Very thin / fragile to touch',
          'Slightly thin / flat',
          'Baseline normal density',
          'Noticeable body & resistance',
          'Significantly thicker & fuller'
        ]
      },
    ],
    phases: [
      {
        from: 1, to: 2, name: 'Settling In', mood: 'calm',
        title: 'Follicles are adjusting — zero visible change is 100% normal.',
        body: 'Human hair follicles operate on 90–120 day anagen growth cycles. In the first two weeks, active botanical compounds begin nourishing the scalp micro-environment. Your only task is anchoring the daily habit.',
        normal: ['Zero visible density change', 'Palatable gummy flavor adaptation', 'Frequent mirror checking (normal anxiety)'],
        todo: ['Record your initial week 1 baseline', 'Snap crown & hairline photos in natural daylight', 'Configure your daily reminder time']
      },
      {
        from: 3, to: 5, name: 'The Shedding Phase', mood: 'warn',
        title: 'More hair in the drain? This is the follicle reset cycle.',
        body: 'Many men experience a temporary shedding surge around weeks 3–5. This occurs when telogen (dormant) hairs detach to allow new anagen hairs to form beneath. Quitting now halts the upcoming regrowth cycle.',
        normal: ['Higher drain strand count than week 1', 'Loose hairs on pillow or comb', 'Anxious feeling that treatment is "backfiring"'],
        todo: ['Do NOT discontinue your routine — stay consistent', 'Log your drain count weekly to monitor the curve', 'If heavy shedding continues past week 8, consult a doctor']
      },
      {
        from: 6, to: 9, name: 'The Quiet Valley', mood: 'cool',
        title: 'The hardest stretch: effort in, delayed visual gratification.',
        body: 'This is where 70% of premature drop-outs occur. Leading signals (reduced scalp itch, less fragility, lower drain counts) improve weeks before the mirror reflects new density. Trust the leading metrics.',
        normal: ['Mirror looks virtually identical to week 1', 'Shedding stabilizes into a steady baseline', 'Motivation fatigue and temptation to skip doses'],
        todo: ['Protect your daily check-in streak', 'Track your weekly Signal Index rather than daily mirror checks', 'Ask your AI coach about any lingering doubts']
      },
      {
        from: 10, to: 13, name: 'First Early Signs', mood: 'good',
        title: 'Leading indicators translate into tangible follicle response.',
        body: 'In verified customer research, patients reported noticeable shedding reduction starting around week 10, with early vellus baby hairs consolidating along the hairline and crown by month 3.',
        normal: ['Marked decline in shower drain accumulation', 'Fine baby hairs emerging along temples', 'Hair feels sturdier when towel-drying'],
        todo: ['Perform photo comparison against week 1 baseline', 'Generate your Doctor-Ready Summary for mid-point review', 'Verify your refill runway so you never run out']
      },
      {
        from: 14, to: 99, name: 'Compounding Density', mood: 'good',
        title: 'Consistency compounds — maintaining the anagen cycle.',
        body: 'New hairs mature from fine vellus strands into terminal, pigmented hair shafts. Maintaining uninterrupted nutrition and scalp stimulation is essential to prevent regression.',
        normal: ['Steady visual improvement month over month', 'Occasional slight fluctuations during stress'],
        todo: ['Ensure your refill orders are placed before supply drops', 'Update progress photos every 30 days', 'Review your long-term maintenance routine with a doctor']
      },
    ],
  },

  beard: {
    id: 'beard',
    label: 'Beard growth',
    emoji: '🧔',
    product: 'Beard Growth Kit (tonic + gummies + derma roller)',
    blurb: 'Follicle Tonic + Biotin Gummies + 0.5mm Titanium Derma Roller.',
    total: 90,
    daily: [
      { key: 'tonic', label: 'Applied beard activating tonic', sub: 'Evenly on clean, dry cheeks and jaw' },
      { key: 'gummies', label: 'Took my Biotin gummies', sub: 'Daily nutrient support' },
    ],
    wash: null,
    weekly: [{ key: 'roller', label: 'Derma roller micro-needling session', sub: 'Once a week (gentle 4-direction passes)' }],
    milestones: [
      { day: 30, name: 'Day 30 Follicle Awakening', body: 'Log skin comfort and check for fine vellus hairs in bright light.' },
      { day: 60, name: 'Day 60 Mid-Point Review', body: 'Review cheek patch coverage and share telemetry with a doctor.' },
      { day: 90, name: 'Day 90 Density Review', body: 'Compare baseline photos to evaluate terminal beard hair growth.' },
    ],
    indicators: [
      {
        key: 'newhair',
        label: 'New vellus/terminal hairs in patchy areas',
        lo: 'None visible',
        hi: 'Prominent growth',
        lowerBetter: false,
        levels: [
          'No new hairs visible yet',
          'Sparse fine peach-fuzz in bright light',
          'Noticeable light vellus hairs emerging',
          'Multiple darkening hairs filling gaps',
          'Dense stubble emerging across patches'
        ]
      },
      {
        key: 'even',
        label: 'Uniformity across jaw & cheeks',
        lo: 'Heavy patches',
        hi: 'Even coverage',
        lowerBetter: false,
        levels: [
          'Substantial patchy bare zones',
          'Uneven growth with lagging cheek areas',
          'Moderate coverage across main lines',
          'Mostly uniform beard silhouette',
          'Consistently dense, well-connected beard'
        ]
      },
      {
        key: 'comfort',
        label: 'Skin tolerability & post-roller calm',
        lo: 'Irritated / red',
        hi: 'Calm & resilient',
        lowerBetter: false,
        levels: [
          'Significant redness, stinging or irritation',
          'Moderate sensitivity after application',
          'Mild, acceptable tingling for a few minutes',
          'Calm, comfortably moisturized skin',
          'Peak skin barrier comfort & resilience'
        ]
      },
    ],
    phases: [
      {
        from: 1, to: 4, name: 'Follicle Stimulation', mood: 'calm',
        title: 'Micro-circulation is activating — visible growth takes time.',
        body: 'Facial hair follicles require repeated stimulation through micro-needling and active tonic absorption. Establish your weekly roller cadence and gentle technique.',
        normal: ['Zero noticeable stubble change', 'Mild temporary redness for 20 mins post-roller', 'Building the 3-step routine'],
        todo: ['Take close-up photos of cheeks under direct lighting', 'Review the step-by-step derma roller guide in Guides', 'Commit to once-weekly rolling — do not over-roll']
      },
      {
        from: 5, to: 8, name: 'Peach-Fuzz Phase', mood: 'cool',
        title: 'Look for translucent vellus hairs, not dark beard hair.',
        body: 'The first clinical milestone in facial hair activation is the emergence of unpigmented, soft vellus hairs. They are easy to overlook in normal indoor mirrors.',
        normal: ['Fine hairs visible primarily under smartphone flashlight', 'Asymmetrical growth between left and right cheek', 'Impatience with slow pace'],
        todo: ['Track your weekly check-in scores', 'Maintain light roller pressure — pressing harder causes scarring, not growth', 'Ask the coach if unsure about skin tolerance']
      },
      {
        from: 9, to: 12, name: 'Terminal Hair Maturation', mood: 'good',
        title: 'Translucent fuzz transitions into pigmented beard stubble.',
        body: 'Customers in clinical research noticed definite new hairs on patchy cheek zones around month 3. The hairs gradually darken and thicken.',
        normal: ['Darker, coarser hairs popping in bare patches', 'Cheeks catching up with moustache and chin', 'Occasional stubborn spots'],
        todo: ['Compare against your day 1 photo', 'Schedule your day 60/90 doctor follow-up', 'Calculate your refill runway to prevent gaps']
      },
      {
        from: 13, to: 99, name: 'Beard Density Consolidation', mood: 'good',
        title: 'Filling in density and connecting beard lines.',
        body: 'Consistency now ensures newly activated follicles stay nourished. Steady tracking prevents premature routine abandonment.',
        normal: ['Consistent month-over-month thickness', 'Fuller jawline connection'],
        todo: ['Maintain daily tonic discipline', 'Re-photograph monthly under same angle', 'Review refill timeline']
      },
    ],
  },

  dandruff: {
    id: 'dandruff',
    label: 'Dandruff & scalp',
    emoji: '❄️',
    product: 'Daily Use Anti-Dandruff Shampoo (Ketoconazole/Zinc)',
    blurb: 'Targeted formulation to eliminate Malassezia yeast, flakes, and itch.',
    total: 30,
    daily: [],
    wash: { key: 'shampoo', label: 'Washed with Anti-Dandruff Shampoo', sub: 'Leave on scalp for 3–4 mins before rinsing' },
    weekly: [],
    milestones: [
      { day: 14, name: 'Day 14 Flare Triage', body: 'Flakes and itching should be controlled. Fine-tune your wash frequency.' },
      { day: 30, name: 'Day 30 Maintenance Baseline', body: 'Transition from intensive treatment to a sustainable maintenance rhythm.' },
    ],
    indicators: [
      {
        key: 'flakes',
        label: 'Visible scalp flakes on hair / shoulders',
        lo: 'Zero flakes',
        hi: 'Heavy flaking',
        lowerBetter: true,
        levels: [
          'Completely clear, no visible specks',
          'Rare, faint specks near hairline',
          'Light flaking on dark clothing',
          'Noticeable persistent flakes',
          'Heavy flakes with scalp buildup'
        ]
      },
      {
        key: 'itch',
        label: 'Scalp itch & urge to scratch',
        lo: 'Zero itch',
        hi: 'Intense itch',
        lowerBetter: true,
        levels: [
          'No itching whatsoever',
          'Mild occasional itchiness',
          'Moderate itch after sweating',
          'Frequent itch throughout the day',
          'Severe itch disturbing sleep & focus'
        ]
      },
      {
        key: 'dry',
        label: 'Scalp tightness & strip-dryness',
        lo: 'Comfortable',
        hi: 'Extremely taut',
        lowerBetter: true,
        levels: [
          'Perfect moisture balance',
          'Mild tightness right after shower',
          'Noticeably dry or taut feeling',
          'Uncomfortably dry / tight scalp',
          'Severe strip-dryness with peeling'
        ]
      },
    ],
    phases: [
      {
        from: 1, to: 2, name: 'Targeted Yeast Clearance', mood: 'good',
        title: 'Rapid relief — itching commonly halts in 3 to 5 washes.',
        body: 'Active anti-fungal agents rapidly decrease Malassezia yeast proliferation. The primary pitfall is over-washing daily, which strips natural sebum and causes rebound dryness.',
        normal: ['Swift reduction in acute scalp itch', 'Flakes reducing noticeably', 'Scalp feeling tight if washed every single day'],
        todo: ['Use the Frequency Finder in the Guides tab', 'Leave shampoo lather on scalp for a full 3–4 minutes before rinsing', 'Log scalp dryness honestly']
      },
      {
        from: 3, to: 4, name: 'Rhythm Calibration', mood: 'calm',
        title: 'Calibrate the optimal wash frequency for your scalp barrier.',
        body: 'If your scalp feels dry or tight, reduce shampooing to 2–3 times weekly and consider a light nourishing conditioner on hair ends.',
        normal: ['Dry patches if over-washed', 'Flakes resurging if under-washed'],
        todo: ['Consult the Shampoo Frequency Calculator', 'If intense redness or sores develop, see a doctor immediately']
      },
      {
        from: 5, to: 99, name: 'Sustainable Maintenance', mood: 'good',
        title: 'Maintain your barrier defense rhythm.',
        body: 'Once symptoms are fully controlled, most men maintain a healthy, flake-free scalp with 2 preventive washes per week.',
        normal: ['Clear scalp with occasional minor flare-ups during seasonal shifts or stress'],
        todo: ['Keep an unopened backup bottle to avoid sudden lapses']
      },
    ],
  },
};

// Transparent Hair Stage Diagnostic Questionnaire
export const STAGE_QUESTIONS = [
  {
    key: 'hairline',
    q: 'How does your frontal hairline look compared to 2 years ago?',
    opts: [
      ['Virtually unchanged — natural juvenile hairline', 0, 'No frontal hairline recession observed'],
      ['Slightly higher at the temples (early maturing hairline)', 1, 'Early temple recession is the most common initial sign of male pattern thinning'],
      ['Defined "M" shape receding back at temples', 2, 'Distinct temporal recession indicative of progressive miniaturization'],
      ['Deeply receded, approaching the mid-scalp', 3, 'Significant frontal recession requiring comprehensive medical protocol']
    ]
  },
  {
    key: 'crown',
    q: 'How does your crown / vertex (top-back of the scalp) look in bright light?',
    opts: [
      ['Looks fully dense — no scalp visible', 0, 'No vertex or crown thinning detected'],
      ['A little diffuse or slightly visible under harsh direct lighting', 1, 'Early crown thinning; follicles are starting to miniaturize'],
      ['Scalp is clearly visible through hair under normal light', 2, 'Moderate vertex thinning requiring active follicle stimulation'],
      ['A defined bare patch at the vertex', 3, 'Established crown loss best assessed with a prescription-strength protocol']
    ]
  },
  {
    key: 'shed',
    q: 'What is your estimated daily hair loss count (comb, shower, pillow)?',
    opts: [
      ['Under ~50 strands (healthy physiological baseline)', 0, 'Within normal human telogen shedding boundaries'],
      ['About 50–100 strands per day', 1, 'Upper threshold of normal shedding; merits close baseline tracking'],
      ['100+ strands daily with frequent loose hairs', 2, 'Above typical baseline; active telogen shedding in progress'],
      ['Unsure — I see loose hairs but cannot quantify', 1, 'Assigned mild baseline with instructions to monitor shower drain']
    ]
  },
  {
    key: 'when',
    q: 'How long have you observed this thinning or excess shedding pattern?',
    opts: [
      ['Recent onset (under 6 months)', 0, 'Early intervention window provides the highest response probability'],
      ['6 to 12 months', 1, 'Active thinning pattern consolidating over the past year'],
      ['1 to 3 years', 2, 'Prolonged progression; follicles require structured long-term stimulation'],
      ['Over 3 years', 3, 'Long-standing pattern; doctor review strongly advised alongside topical care']
    ]
  },
  {
    key: 'family',
    q: 'Is there a family history of male pattern hair loss (androgenetic alopecia)?',
    opts: [
      ['None known on either maternal or paternal side', 0, 'Minimal genetic predisposition indicated'],
      ['One side of family (father, maternal grandfather, or brother)', 1, 'Moderate hereditary predisposition to DHT sensitivity'],
      ['Both maternal and paternal sides have noticeable hair thinning', 2, 'Strong hereditary predisposition; proactive daily prevention is critical']
    ]
  },
];

export const TRIGGERS = [
  ['Work or emotional stress', 'Elevated cortisol can trigger acute telogen effluvium shedding on top of genetic thinning.'],
  ['Irregular sleep schedule', 'Sub-optimal sleep compromises follicle cellular regeneration cycles.'],
  ['Dietary shift or low protein/iron', 'Follicles require consistent keratin amino acids and ferritin to sustain anagen growth.'],
  ['Recent illness or fever episode', 'Systemic immune events frequently cause temporary shedding 2–3 months later.'],
];

export function scoreStage(ans, triggers = []) {
  let score = 0;
  const lines = [];
  STAGE_QUESTIONS.forEach(q => {
    const i = ans[q.key];
    if (i == null) return;
    const [label, pts, why] = q.opts[i];
    score += pts;
    lines.push({ q: q.q, a: label, pts, why });
  });
  const trig = Math.min(triggers.length, 2);
  return { score, lines, trig };
}

export function stageFrom(score) {
  if (score <= 5) {
    return {
      n: 1,
      name: 'Stage 1 — Early Preventative Thinning',
      badge: 'Early Stage',
      kit: 'Stage 1 Hairfall Kit (Anti-Hairfall Shampoo + Biotin Gummies)',
      body: 'Your follicles are in the early intervention window with substantial regenerative capacity. A gentle, drug-free routine provides essential follicle nutrition and DHT management without pharmaceutical side effects.',
      doctor: false
    };
  }
  if (score <= 9) {
    return {
      n: 2,
      name: 'Stage 2 — Mild to Moderate Visible Thinning',
      badge: 'Moderate Stage',
      kit: 'Stage 1 Kit as Foundation + Free Man Matters Telehealth Review',
      body: 'Miniaturization is visibly underway at the temples or crown. While the Stage 1 nutritional and cleansing routine forms an excellent base, a free 1-on-1 consultation with a Man Matters doctor is recommended to determine if topical Minoxidil or Redensyl should be layered in.',
      doctor: true
    };
  }
  return {
    n: 3,
    name: 'Stage 3+ — Advanced Pattern Hair Loss',
    badge: 'Advanced Stage',
    kit: 'Direct Physician Telehealth Consultation Recommended',
    body: 'Hair thinning has advanced to established miniaturization. At this stage, over-the-counter kits alone are insufficient; an individualized prescription treatment plan evaluated by a dermatologist is the most clinical path forward.',
    doctor: true
  };
}

// Fallback Clinical Knowledge Base (When Groq key is absent or offline)
export const FALLBACK_QA = [
  {
    k: ['shed', 'more hair', 'drain', 'pillow', 'falling', 'panic', 'worse', 'dropping'],
    a: 'Temporary shedding around weeks 3–5 is an established clinical response called the follicle reset cycle. As dormant telogen hairs shed, new anagen growth initiates beneath. Discontinuing treatment during this phase is the single most common cause of failed therapy. Maintain your routine, log your drain counts weekly, and watch for stabilization by week 6–8. If heavy shedding persists after week 8, book a free Man Matters doctor consult.'
  },
  {
    k: ['working', 'result', 'nothing', 'no change', 'when will', 'how long', 'see', 'mirror', 'slow'],
    a: 'Human hair grows approximately 1 to 1.25 cm per month, so visual mirror density takes 10 to 12 weeks to manifest. In our verified customer research, patients reported initial shedding reduction around week 10 and visible density gains near month 3. In the meantime, evaluate your leading indicators—such as reduced scalp itch and fewer shower drain hairs—which improve well before the mirror reflects change.'
  },
  {
    k: ['roller', 'derma', 'needle', 'how to roll', 'pressure'],
    a: 'Derma Roller Clinical Protocol: 1) Disinfect the roller head with 70% isopropyl alcohol and let dry. 2) Roll gently across clean, dry skin in 4 directions: vertical, horizontal, and both diagonals (4–5 passes per area). 3) Apply light, even pressure—it should produce slight tingling, NEVER pain or bleeding. 4) Use once per week. Discontinue immediately if skin is broken, sunburnt, or irritated.'
  },
  {
    k: ['dry', 'daily', 'often', 'frequency', 'wash', 'tight', 'clean'],
    a: 'Daily washing with active anti-dandruff shampoo can strip natural lipid barriers, causing tightness and rebound flaking. Most trichologists recommend 2 to 3 washes weekly, leaving lather on the scalp for 3–4 minutes before a thorough lukewarm rinse. Use our interactive Shampoo Frequency Finder in the Guides tab to pinpoint your personal cadence.'
  },
  {
    k: ['forgot', 'miss', 'skip', 'remind', 'streak', 'yesterday'],
    a: 'Missing a single dose does not erase your progress. Simply resume your normal dose today—never double up on gummies or topicals. To build ironclad adherence, anchor your gummies to an existing daily ritual (like your morning coffee or evening brushing), or download our 1-click calendar reminder (.ics) from the Today tab.'
  },
  {
    k: ['deliver', 'refill', 'shipping', 'late', 'arrive', 'run out', 'delay', 'order'],
    a: 'In customer interviews, shipping delays (up to 12 days) caused routine disruptions that broke follicle momentum. Our Refill Runway calculator reverse-engineers a safe reorder deadline that builds in a 12-day shipping buffer plus a 2-day safety margin, ensuring replacement kits arrive before your current bottle empties.'
  },
  {
    k: ['stage', 'which kit', 'which one', 'diagnose', 'quiz'],
    a: 'Our Transparent Stage Check assesses hair thinning across 5 anatomical and genetic vectors, displaying the exact points and reasoning behind the recommendation. If your score sits on the boundary between Stage 1 and Stage 2, take advantage of Man Matters\' free telehealth consultation for expert physician confirmation.'
  },
  {
    k: ['side effect', 'rash', 'burn', 'itch', 'allerg', 'swell', 'bleed', 'patch', 'pain', 'red flag'],
    a: '⚠️ Clinical Red Flag: If you experience sudden patchy round bald spots, burning scalp pain, open sores, swelling, spreading rash, or severe allergic symptoms, immediately stop using all products and consult a physician. Man Matters provides free certified doctor consultations, or you can present our Doctor-Ready Summary to your local dermatologist.'
  },
];

export const FALLBACK_DEFAULT = 'I am your Steady Clinical Companion. Tell me which week you are in and what changes or symptoms you are observing, and I will provide evidence-based guidance. For any concerning symptoms or prescription inquiries, I can help you prepare a Doctor-Ready Summary for a Man Matters telehealth physician.';

export const CHIPS = {
  hair: [
    'Why is my hair shedding more in week 3?',
    'When will I see visible density?',
    'I forgot my gummies yesterday — what now?',
    'How do I time my refill before it runs out?'
  ],
  beard: [
    'How do I use the derma roller safely?',
    'Cheek growth is patchy and uneven — is that normal?',
    'When will fine peach fuzz turn into real stubble?',
    'My skin feels slightly red after rolling'
  ],
  dandruff: [
    'How many times a week should I wash?',
    'My scalp feels dry and tight after washing',
    'How long until the flakes disappear completely?',
    'Will my dandruff return if I stop using it?'
  ],
};

export const GUIDES = {
  roller: {
    title: 'Derma Roller Clinical Protocol: Step-by-Step',
    subtitle: 'Maximize transdermal absorption and collagen synthesis without skin trauma.',
    steps: [
      ['Sterilization Protocol', 'Submerge the roller head in 70% isopropyl alcohol for 5–10 minutes prior to each session. Allow it to air dry fully on a clean paper towel. Never use an unsterilized roller.'],
      ['Skin Preparation', 'Wash your face and beard area with a mild cleanser and lukewarm water. Pat completely dry with a clean towel. Skin must be clean and free of oil or debris.'],
      ['4-Way Multi-Directional Rolling', 'Divide the beard area into sections (left cheek, right cheek, chin). Roll 4 to 5 times in four directions: vertical, horizontal, diagonal left-to-right, and diagonal right-to-left. Maintain light, gentle pressure—it should create light prickling, NEVER pain or bleeding.'],
      ['Post-Roll Recovery & Tonic Timing', 'Do not apply active acids or harsh products immediately if your skin is sensitive. Wait 15–20 minutes before applying your Beard Growth Tonic to maximize absorption without stinging.'],
      ['Sanitize & Store Safely', 'Rinse the roller under warm running water, disinfect with alcohol spray, and store in its protective casing. Replace your roller every 2 to 3 months once micro-needles dull. Never share your roller with anyone.']
    ]
  },
  shed: {
    title: 'The Telogen Reset: Why Shedding Precedes Growth',
    subtitle: 'Understand the biological cycle so you do not panic during weeks 3–5.',
    steps: [
      ['The Follicle Lifecycle', 'Every hair follicle transitions through three phases: Anagen (active growth, 2–6 years), Catagen (transition, 2 weeks), and Telogen (resting/shedding, 2–4 months). At any moment, ~10% of hairs are naturally in telogen.'],
      ['Treatment-Induced Synchronized Shedding', 'When DHT-blockers and follicle stimulants are introduced, sluggish telogen follicles are stimulated to reset into the Anagen phase. To grow a new, thicker hair shaft, the old, miniaturized telogen hair must detach first.'],
      ['Typical Timeline & Normalcy', 'Shedding commonly intensifies between weeks 3 and 5. It feels counter-intuitive and alarming, but it is actually clinical proof that follicles are responding to stimulation.'],
      ['Crucial Behavioral Decision', 'Over 70% of men who quit therapy do so during this shed. Abandoning treatment halts the anagen transition, meaning the shed hairs are lost without the thicker replacements coming in. Staying consistent is imperative.'],
      ['Red Flag Distinction', 'Normal reset shedding is diffuse and painless. If shedding occurs in localized circular patches (Alopecia Areata), or is accompanied by burning, crusting, or continues past week 8, book an evaluation with a dermatologist immediately.']
    ]
  },
};

// Shampoo Frequency Algorithm
// Shampoo frequency finder: interrelated rules.
// Inputs are 1-5 levels. The same symptom can mean different things depending on the others:
//   flakes + oily scalp  -> likely true dandruff (yeast)   -> wash MORE
//   flakes + dry scalp   -> dryness flaking, not dandruff  -> wash LESS (washing more makes it worse)
//   dry + oily together  -> stripped scalp over-producing oil (rebound) -> do NOT wash more
export function frequencyAdvice({ dryness, flakes, oil }) {
  const d = Number(dryness) || 3, f = Number(flakes) || 3, o = Number(oil) || 3;

  // 1) Classify the pattern (order matters: most serious first)
  let profile = 'balanced';
  if (d >= 4 && f >= 4) profile = 'severe';              // very dry AND heavy flaking
  else if (d >= 4 && o >= 3) profile = 'rebound';        // clearly dry yet oily: over-washed scalp
  else if (f >= 3 && o <= 2 && d >= 3) profile = 'dryFlakes'; // flakes without oil: dry-scalp flaking
  else if (f >= 4 && ((o >= 3 && d <= 3) || d <= 2)) profile = 'flare'; // heavy flakes on a non-dry scalp: true dandruff flare
  else if (f <= 1 && o <= 2 && d <= 2) profile = 'clear';     // everything calm

  // 2) Cleansing need (1-5): flakes only count fully when they look like dandruff, not dryness
  const flakeEffect = profile === 'dryFlakes' || profile === 'severe' ? 1 + (f - 1) * 0.4 : f;
  const need = 0.6 * flakeEffect + 0.4 * o;

  // 3) Map need to washes/week (need 1 -> 2 washes, need 5 -> 4 washes), then subtract a dryness penalty
  const raw = 2 + (need - 1) / 2;
  const penalty = d >= 3 ? (d - 2) * 0.5 : 0;
  let n = Math.round(raw - penalty);

  if (profile === 'flare' && d <= 2) n = Math.max(n, 4);   // active flare on a non-dry scalp

  // 4) Safety caps driven by dryness (dryness always has the final say)
  if (d >= 5) n = Math.min(n, 2);
  else if (d >= 3) n = Math.min(n, 3);      // 4x is only allowed when scalp is not dry
  if (profile === 'rebound' || profile === 'severe') n = Math.min(n, 2);
  n = Math.max(2, Math.min(4, n));

  // 5) Explain WHY, so the answer is transparent
  const why = {
    severe: 'Your scalp is very dry and heavily flaking at the same time, which usually means irritation rather than simple dandruff, so washing more would make it worse.',
    rebound: 'A dry scalp that is still oily often means it was stripped and is over-producing oil, so washing more would keep the cycle going.',
    dryFlakes: 'Your flakes appear with low oil and a dry scalp, which points to dryness flaking rather than dandruff, so fewer washes plus a light moisturiser works better.',
    flare: 'Heavy flakes with an oily scalp point to an active dandruff flare, which needs more frequent cleansing for a short time.',
    clear: 'Your scalp looks calm, so you only need a light maintenance rhythm.',
    balanced: 'Your signals are mixed, so a moderate rhythm is the safest starting point.'
  }[profile];

  const base = n >= 4
    ? 'Active Flare Protocol: Wash 4 times weekly for the first 14 days to clear Malassezia colonization, then step down to 2\u20133 times weekly once flakes resolve.'
    : n === 3
    ? 'Balanced Cleansing: Wash 3 times per week. Leave the lather resting on your scalp for a full 3 to 4 minutes before rinsing with lukewarm water.'
    : 'Gentle Barrier Protection: Step down to 2 washes per week, apply a light hydrating conditioner strictly to the hair ends, and rinse thoroughly.';

  const doctor = profile === 'severe'
    ? ' If dryness, redness or peeling continues for more than 2 weeks, please see a doctor.'
    : '';

  return { n, profile, need: Math.round(need * 10) / 10, txt: base + ' ' + why + doctor };
}

export const PHASE_COLORS = {
  calm: '#7fb8a4',
  warn: '#f2a65a',
  cool: '#7aa7d9',
  good: '#b6f26b'
};
