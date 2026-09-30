import {DCLogic,mount} from './runtime.js';
// Preview storage is memory only and cannot access live submissions.
const memory=new Map(); const localStorage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};

class Component extends DCLogic {
  STORE_KEY = 'mindlever.submissions.v1';
  DAY_RATE = 1200;

  state = {
    route: 'door',
    businessType: 'Home services (plumbing, HVAC, electrical)',
    btOpen: false,
    hours: '5 to 15',
    pains: ['questions', 'invoices', 'booking'],
    email: 'casey@example.com',
    emailError: false,
    rate: 60,
    bookedSlot: '',
    // backend
    submissions: [],
    currentId: null,
    consoleView: 'inbox',
    _tick: 0,
  };

  BUSINESS_TYPES = [
    'Home services (plumbing, HVAC, electrical)',
    'Trades and contracting',
    'Health and wellness clinic',
    'Professional services (legal, accounting)',
    'Retail or online shop',
    'Hospitality or food',
    'Something else',
  ];

  HOURS_OPTS = ['Under 5', '5 to 15', '15 to 30', '30 plus'];

  PAINS = [
    { id: 'questions', label: 'Answering the same questions over and over', short: 'Repeat questions', opp: 'Stop re-answering the same customer questions', block: 'Shared answer library', measure: 'Hours a week spent on repeat questions', discovery: 'Which questions actually repeat, and who answers them today?', watchout: 'Answer library goes stale without a named owner', lo: 3, hi: 4 },
    { id: 'invoices', label: 'Chasing invoices and payments', short: 'Invoice chasing', opp: 'Get invoices out and followed up without you', block: 'Invoice automation', measure: 'Days from invoice sent to invoice paid', discovery: 'Where do invoices live, and what triggers a chase today?', watchout: 'Invoice tooling may be locked to their accountant', lo: 2, hi: 3 },
    { id: 'copying', label: 'Copying details between tools by hand', short: 'Manual copying', opp: 'Stop copying the same details between tools', block: 'Field sync between tools', measure: 'Manual re-entries a week across tools', discovery: 'Which two tools get double-entered the most?', watchout: 'A legacy tool may have no API to sync against', lo: 1, hi: 2 },
    { id: 'booking', label: 'Booking people in and sending reminders', short: 'Booking & reminders', opp: 'Hand off booking and reminders', block: 'Booking and reminders', measure: 'No-shows a week, before and after reminders', discovery: 'Who owns the calendar, and what cannot be automated?', watchout: 'Reminders annoy customers if over-sent', lo: 4, hi: 6 },
    { id: 'leads', label: 'Following up with new leads', short: 'Lead follow-up', opp: 'Follow up with new leads automatically', block: 'Lead follow-up flow', measure: 'Time from new lead to first reply', discovery: 'Where do new leads land today, and who sees them?', watchout: 'Automated follow-up must not read as robotic', lo: 2, hi: 3 },
  ];

  SLOTS = ['Tomorrow, 9:30 AM', 'Tomorrow, 2:00 PM', 'Thursday, 11:00 AM', 'Friday, 4:30 PM'];

  // ---------- real-world solution catalog (operator only) ----------
  // Each pain maps to concrete workflow recipes built from named tools.
  CATALOG = {
    questions: {
      capability: 'Shared answer library',
      options: [
        { id: 'q-ai', name: 'AI answer assistant', trigger: 'A customer sends a question',
          steps: [
            { tool: 'Claude', action: 'drafts a reply from your saved FAQ and past answers' },
            { tool: 'Zapier', action: 'routes it to email or SMS for a one-tap human OK' },
          ],
          tools: ['Claude', 'Zapier', 'Gmail'], effort: '2 to 3 days', cost: '$40–90/mo', dLo: 2, dHi: 3, cLo: 40, cHi: 90 },
        { id: 'q-help', name: 'Self-serve help center', trigger: 'A customer lands on your site',
          steps: [
            { tool: 'Notion', action: 'holds a searchable, always-current FAQ' },
            { tool: 'Intercom', action: 'suggests the right article before they contact you' },
          ],
          tools: ['Intercom', 'Notion'], effort: '2 days', cost: '$59+/mo', dLo: 2, dHi: 2, cLo: 59, cHi: 99 },
      ],
    },
    invoices: {
      capability: 'Invoice automation',
      options: [
        { id: 'inv-qb', name: 'Auto-invoice and chase', trigger: 'A job is marked complete',
          steps: [
            { tool: 'QuickBooks', action: 'issues the invoice automatically' },
            { tool: 'Stripe', action: 'attaches a pay-now link' },
            { tool: 'Zapier', action: 'sends polite reminders at 7, 14 and 21 days' },
          ],
          tools: ['QuickBooks', 'Stripe', 'Zapier'], effort: '2 to 3 days', cost: '$50–80/mo', dLo: 2, dHi: 3, cLo: 50, cHi: 80 },
        { id: 'inv-sms', name: 'Pay-link and text nudge', trigger: 'An invoice is created',
          steps: [
            { tool: 'Stripe', action: 'creates a payment link' },
            { tool: 'RingCentral', action: 'texts the link and gentle reminders until paid' },
          ],
          tools: ['Stripe', 'RingCentral', 'Zapier'], effort: '2 days', cost: '$45–70/mo', dLo: 2, dHi: 2, cLo: 45, cHi: 70 },
      ],
    },
    copying: {
      capability: 'Field sync between tools',
      options: [
        { id: 'cp-zap', name: 'No-code field sync', trigger: 'A record is created in the first tool',
          steps: [
            { tool: 'Zapier', action: 'maps the fields and creates the matching record in the second tool' },
          ],
          tools: ['Zapier'], effort: '1 to 2 days', cost: '$30–50/mo', dLo: 1, dHi: 2, cLo: 30, cHi: 50 },
        { id: 'cp-make', name: 'Two-way sync with error handling', trigger: 'A record changes in either tool',
          steps: [
            { tool: 'Make', action: 'runs a branching scenario that syncs both ways and retries on failure' },
          ],
          tools: ['Make'], effort: '2 days', cost: '$29–60/mo', dLo: 2, dHi: 2, cLo: 29, cHi: 60 },
      ],
    },
    booking: {
      capability: 'Booking and reminders',
      options: [
        { id: 'bk-cal', name: 'Self-scheduling with SMS reminders', trigger: 'A customer books a slot',
          steps: [
            { tool: 'Cal.com', action: 'takes the booking and holds the slot' },
            { tool: 'RingCentral', action: 'texts reminders 24h and 1h before' },
            { tool: 'Zapier', action: 'follows up automatically on any no-show' },
          ],
          tools: ['Cal.com', 'RingCentral', 'Zapier'], effort: '2 to 3 days', cost: '$45–75/mo', dLo: 2, dHi: 3, cLo: 45, cHi: 75 },
        { id: 'bk-cly', name: 'Calendly with text reminders', trigger: 'A customer picks a time',
          steps: [
            { tool: 'Calendly', action: 'handles scheduling and calendar sync' },
            { tool: 'Twilio', action: 'sends reminder texts on your number' },
            { tool: 'Google Calendar', action: 'keeps the whole team in sync' },
          ],
          tools: ['Calendly', 'Twilio', 'Google Calendar'], effort: '2 days', cost: '$40–65/mo', dLo: 2, dHi: 2, cLo: 40, cHi: 65 },
      ],
    },
    leads: {
      capability: 'Lead follow-up flow',
      options: [
        { id: 'ld-rc', name: 'Instant lead response', trigger: 'A new call or web form comes in',
          steps: [
            { tool: 'RingCentral', action: 'captures the call or text and logs it' },
            { tool: 'Claude', action: 'qualifies the lead and drafts a first reply' },
            { tool: 'HubSpot', action: 'logs the lead and starts a nurture sequence' },
          ],
          tools: ['RingCentral', 'Claude', 'HubSpot', 'Zapier'], effort: '3 days', cost: '$70–120/mo', dLo: 3, dHi: 3, cLo: 70, cHi: 120 },
        { id: 'ld-email', name: 'Email nurture with alerts', trigger: 'A new lead is added',
          steps: [
            { tool: 'HubSpot', action: 'runs a timed email sequence' },
            { tool: 'Slack', action: 'pings the owner the moment a hot lead replies' },
          ],
          tools: ['HubSpot', 'Slack'], effort: '2 days', cost: '$50–90/mo', dLo: 2, dHi: 2, cLo: 50, cHi: 90 },
      ],
    },
  };

  mkStackItem(p) {
    const cat = this.CATALOG[p.id];
    const opt = cat.options[0];
    return {
      painId: p.id, painShort: p.short, capability: cat.capability, optionId: opt.id,
      why: 'Fastest path to lift ' + p.short.toLowerCase() + ', on tools they can keep running themselves.',
    };
  }
  optionFor(item) {
    const cat = this.CATALOG[item.painId];
    if (!cat) return null;
    return cat.options.find(o => o.id === item.optionId) || cat.options[0];
  }
  swapOption(id, painId, optionId) {
    this.updateSub(id, s => ({
      draft: Object.assign({}, s.draft, {
        stack: (s.draft.stack || []).map(it => it.painId === painId ? Object.assign({}, it, { optionId }) : it),
      }),
    }));
  }

  rootRef = ({current:null});

  // ---------- lifecycle ----------
  componentDidMount() { this.applyVars(); this.loadStore(); }
  componentDidUpdate() { this.applyVars(); }

  derive() {
    const p = this.props || {};
    const spark = (Array.isArray(p.spark) && p.spark[0]) || '#D4622A';
    const sparkDeep = (Array.isArray(p.spark) && p.spark[1]) || '#B5511F';
    const mb = (p.density === 'compact') ? '13px' : '22px';
    return { spark, sparkDeep, mb };
  }
  applyVars() {
    const el = this.rootRef && this.rootRef.current;
    if (!el) return;
    const d = this.derive();
    el.style.setProperty('--spark', d.spark);
    el.style.setProperty('--spark-deep', d.sparkDeep);
    el.style.setProperty('--mb', d.mb);
  }

  // ---------- storage (simulated backend) ----------
  loadStore() {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(this.STORE_KEY) || '[]'); } catch (e) {}
    if (!Array.isArray(list)) list = [];
    if (list.length === 0) { list = this.seed(); }
    // migrate older records that predate the workflow stack
    let changed = false;
    list = list.map(sub => {
      if (sub && sub.draft && !Array.isArray(sub.draft.stack)) {
        changed = true;
        const use = this.PAINS.filter(p => (sub.pains || []).includes(p.id));
        const src = use.length ? use : [this.PAINS[0]];
        return Object.assign({}, sub, { draft: Object.assign({}, sub.draft, { stack: src.map(p => this.mkStackItem(p)) }) });
      }
      return sub;
    });
    this.persist(list);
    this.setState({ submissions: list });
  }
  persist(list) {
    try { localStorage.setItem(this.STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  saveList(list) { this.persist(list); this.setState({ submissions: list }); }
  updateSub(id, patch) {
    const list = this.state.submissions.map(s => s.id === id ? Object.assign({}, s, (typeof patch === 'function' ? patch(s) : patch)) : s);
    this.saveList(list);
    return list.find(s => s.id === id);
  }

  money(n, step) {
    const r = Math.round(n / step) * step;
    return '$' + r.toLocaleString('en-US');
  }

  // deterministic draft skeleton from intake — always available
  baseDraft(pains, hours) {
    const sel = this.PAINS.filter(p => pains.includes(p.id));
    const use = sel.length ? sel : [this.PAINS[0]];
    const lo = use.reduce((a, p) => a + p.lo, 0);
    const hi = use.reduce((a, p) => a + p.hi, 0);
    const nP = use.length;
    const daysLo = nP * 2, daysHi = nP * 3;
    return {
      hoursLo: lo, hoursHi: hi,
      blocks: use.map(p => p.block),
      measure: use.slice(0, 3).map(p => p.measure),
      discovery: use.slice(0, 3).map(p => p.discovery),
      watchouts: use.slice(0, 2).map(p => p.watchout),
      estDays: daysLo + ' to ' + daysHi + ' days',
      estRange: this.money(daysLo * this.DAY_RATE, 500) + ' to ' + this.money(daysHi * this.DAY_RATE, 500),
      summary: this.fallbackSummary(use),
      phases: this.fallbackPhases(use),
      stack: use.map(p => this.mkStackItem(p)),
      status: 'pending',
      source: null,
    };
  }
  fallbackSummary(use) {
    const first = use[0].block.toLowerCase();
    return 'Lead with the ' + first + ' so the most repetitive work stops landing on the owner. Sequence the rest so each piece earns the next, and keep every step reversible.';
  }
  fallbackPhases(use) {
    return use.slice(0, 3).map((p, i) => ({ n: i + 1, title: p.block, detail: p.opp.toLowerCase() + '.' }));
  }

  seed() {
    const now = Date.now();
    const mk = (id, mins, biz, hours, pains, email, status, source) => {
      const d = this.baseDraft(pains, hours);
      d.status = 'ready'; d.source = source;
      return { id, createdAt: now - mins * 60000, business: biz, hours, pains, email, rate: 60, status, draft: d };
    };
    return [
      mk('seed-2', 26, 'Health and wellness clinic', '15 to 30', ['booking', 'questions', 'invoices'], 'dana@example.com', 'new', 'fallback'),
      mk('seed-1', 190, 'Professional services (legal, accounting)', '5 to 15', ['invoices', 'copying'], 'marcus@example.com', 'contacted', 'fallback'),
    ];
  }

  // ---------- Claude intelligence layer ----------
  async generateDraft(id) { this.updateSub(id, s => ({draft:{...s.draft,status:'ready',source:'fallback'}})); }
  parseJSON(raw) {
    if (!raw) return null;
    let t = String(raw).trim();
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a !== -1 && b !== -1 && b > a) t = t.slice(a, b + 1);
    try { return JSON.parse(t); } catch (e) { return null; }
  }

  // ---------- nav ----------
  go(route) { this.setState({ route, btOpen: false }); window.scrollTo(0, 0); }

  selectedPains() { return this.PAINS.filter(p => this.state.pains.includes(p.id)); }

  submit() {
    const id = 'sub-' + Date.now();
    const base = this.baseDraft(this.state.pains, this.state.hours);
    const sub = {
      id, createdAt: Date.now(),
      business: this.state.businessType, hours: this.state.hours,
      pains: this.state.pains.slice(), email: this.state.email, rate: this.state.rate,
      status: 'new', draft: base,
    };
    this.saveList([sub, ...this.state.submissions]);
    this.setState({ currentId: id });
    // fire the intelligence layer (async, non-blocking)
    Promise.resolve().then(() => this.generateDraft(id));
    return id;
  }

  timeAgo(ts) {
    const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return m + (m === 1 ? ' min ago' : ' mins ago');
    const h = Math.floor(m / 60); if (h < 24) return h + (h === 1 ? ' hr ago' : ' hrs ago');
    const d = Math.floor(h / 24); return d + (d === 1 ? ' day ago' : ' days ago');
  }

  renderVals() {
    const s = this.state;
    const sel = this.selectedPains();
    const lo = sel.reduce((a, p) => a + p.lo, 0);
    const hi = sel.reduce((a, p) => a + p.hi, 0);
    const rate = s.rate;
    const words = { 0: 'no', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five' };
    const word = words[sel.length] || sel.length;
    const cap = (w) => String(w).charAt(0).toUpperCase() + String(w).slice(1);
    const voice = (this.props && this.props.voice) || 'plain';
    const c = voice === 'punchy'
      ? {
          doorH: "Your busywork is costing you. Let's prove it.",
          doorSub: "Three questions, ninety seconds, and a real number on what your back office is quietly costing you.",
          doorCta: "Show me what's leaking",
          s1: "Two quick facts to start.", s2: "What's eating your week?", s3: "Here's what you're about to get.",
          buildCta: "Show me the number", gateH: cap(word) + " leaks found. Here's how big.",
          unlockCta: "Unlock the number", revealLabel: "Here's the money on the table", bookCta: "Grab a 15-min call",
          confH: "Done. You're on the calendar.", confSub: "Fifteen minutes, no pitch. Your invite is on the way.",
        }
      : {
          doorH: "Put your back office to work.",
          doorSub: "Answer three quick questions. I will map where your week is going, what it is worth, and the one thing to fix first.",
          doorCta: "Start my Game Plan",
          s1: "First, the basics.", s2: "Where does the week actually go?", s3: "Here is what I will put together for you.",
          buildCta: "Build my Game Plan", gateH: "I found " + word + " places your week is leaking time.",
          unlockCta: "Unlock my Game Plan", revealLabel: "Your time, given back, is worth about", bookCta: "Book a 15-min call",
          confH: "You are booked.", confSub: "A 15-minute call, no pitch. Look out for a calendar invite.",
        };

    let fix = sel[0];
    sel.forEach(p => { if (p.hi > (fix ? fix.hi : 0)) fix = p; });

    const chipStyle = (seld) => ({
      minHeight: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '7px', fontSize: '16px', cursor: 'pointer',
      border: seld ? '1.5px solid #1A1A1A' : '1px solid #E9E6E1',
      color: seld ? '#1A1A1A' : '#5C5A56', fontWeight: seld ? 500 : 400,
      background: seld ? '#fff' : '#FBF6F2',
    });

    // ----- console derived -----
    const subs = s.submissions.slice().sort((a, b) => b.createdAt - a.createdAt);
    const statusMeta = {
      new: { label: 'New', bg: '#D4622A', fg: '#fff', border: 'transparent' },
      contacted: { label: 'Contacted', bg: '#fff', fg: '#1A7A4C', border: '#1A7A4C' },
      archived: { label: 'Archived', bg: '#FBF6F2', fg: '#5C5A56', border: '#d8d3cc' },
    };
    const badge = (st) => {
      const m = statusMeta[st] || statusMeta.new;
      return { badgeLabel: m.label, badgeStyle: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', color: m.fg, background: m.bg, border: '1px solid ' + m.border, borderRadius: '20px', padding: '3px 9px', flex: 'none' } };
    };
    const draftState = (d) => {
      if (!d || d.status === 'pending') return { draftLabel: 'Drafting…', draftColor: '#5C5A56', dotStyle: { width: '7px', height: '7px', borderRadius: '50%', background: '#C9A24A', display: 'inline-block', animation: 'mlpulse 1s ease-in-out infinite' } };
      if (d.source === 'fallback') return { draftLabel: 'Offline draft', draftColor: '#5C5A56', dotStyle: { width: '7px', height: '7px', borderRadius: '50%', background: '#5C5A56', display: 'inline-block' } };
      return { draftLabel: 'Draft ready', draftColor: '#1A7A4C', dotStyle: { width: '7px', height: '7px', borderRadius: '50%', background: '#1A7A4C', display: 'inline-block' } };
    };

    const inboxRows = subs.map(sub => {
      const b = badge(sub.status);
      const ds = draftState(sub.draft);
      const painShort = this.PAINS.filter(p => sub.pains.includes(p.id)).map(p => p.short);
      return {
        business: sub.business, email: sub.email,
        meta: this.timeAgo(sub.createdAt) + ' · ' + painShort.length + (painShort.length === 1 ? ' pain' : ' pains'),
        badgeLabel: b.badgeLabel, badgeStyle: b.badgeStyle,
        draftLabel: ds.draftLabel, draftColor: ds.draftColor, dotStyle: ds.dotStyle,
        onClick: () => this.setState({ currentId: sub.id, consoleView: 'detail' }),
        rowStyle: {
          border: '1px solid #E9E6E1', borderRadius: '14px', padding: '14px', cursor: 'pointer',
          background: sub.status === 'new' ? '#fff' : '#FBF6F2',
          boxShadow: sub.status === 'new' ? '0 2px 8px rgba(26,26,26,.05)' : 'none',
        },
      };
    });

    const cur = subs.find(x => x.id === s.currentId) || null;
    const curSel = cur ? this.PAINS.filter(p => cur.pains.includes(p.id)) : [];
    const d = cur ? cur.draft : null;

    // ----- recommended workflow stack (real tools) + totals -----
    const optStyle = (seld) => ({
      fontSize: '12px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', padding: '6px 10px',
      border: seld ? '1.5px solid #1A1A1A' : '1px solid #d8d3cc',
      background: seld ? '#1A1A1A' : '#fff', color: seld ? '#fff' : '#5C5A56',
    });
    let stackDLo = 0, stackDHi = 0, stackCLo = 0, stackCHi = 0;
    const curStack = (d && Array.isArray(d.stack)) ? d.stack.map(item => {
      const cat = this.CATALOG[item.painId];
      const opt = this.optionFor(item);
      stackDLo += opt.dLo; stackDHi += opt.dHi; stackCLo += opt.cLo; stackCHi += opt.cHi;
      return {
        name: opt.name, painShort: item.painShort, capability: cat.capability, why: item.why, trigger: opt.trigger,
        steps: opt.steps.map(st => ({ tool: st.tool, action: st.action })),
        tools: opt.tools.map(t => ({ label: t })),
        effort: opt.effort, cost: opt.cost,
        options: cat.options.map(o => ({
          label: o.name, style: optStyle(o.id === item.optionId),
          onClick: () => { if (cur) this.swapOption(cur.id, item.painId, o.id); },
        })),
      };
    }) : [];
    const stackEffort = d ? (stackDLo === stackDHi ? stackDLo + ' days' : stackDLo + ' to ' + stackDHi + ' days') : '';
    const stackTooling = d ? ('$' + stackCLo + '–' + stackCHi + ' / mo') : '';
    const stackBuildRange = d ? (this.money(stackDLo * this.DAY_RATE, 500) + ' to ' + this.money(stackDHi * this.DAY_RATE, 500)) : '';

    const draftBadge = (() => {
      if (!d || d.status === 'pending') return { draftBadgeLabel: 'Generating', style: { color: '#8a6d1f', bg: '#FBF3DE', border: '#E7D08A' } };
      if (d.source === 'fallback') return { draftBadgeLabel: 'Offline draft', style: { color: '#5C5A56', bg: '#FBF6F2', border: '#d8d3cc' } };
      return { draftBadgeLabel: 'Generated by Claude', style: { color: '#1A7A4C', bg: '#EAF5EF', border: '#B9DEC9' } };
    })();

    const statusButtons = cur ? [
      { key: 'new', label: 'Mark new' },
      { key: 'contacted', label: 'Contacted' },
      { key: 'archived', label: 'Archive' },
    ].map(b => {
      const active = cur.status === b.key;
      return {
        label: b.label,
        onClick: () => { this.updateSub(cur.id, { status: b.key }); },
        style: {
          flex: 1, minHeight: '42px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'center',
          border: active ? '1.5px solid #1A1A1A' : '1px solid #E9E6E1',
          background: active ? '#1A1A1A' : '#fff', color: active ? '#fff' : '#5C5A56',
        },
      };
    }) : [];

    return {
      rootRef: this.rootRef,
      cDoorH: c.doorH, cDoorSub: c.doorSub, cDoorCta: c.doorCta,
      cS1: c.s1, cS2: c.s2, cS3: c.s3, cBuildCta: c.buildCta,
      cGateH: c.gateH, cUnlockCta: c.unlockCta,
      cRevealLabel: c.revealLabel, cBookCta: c.bookCta,
      cConfH: c.confH, cConfSub: c.confSub,

      isDoor: s.route === 'door',
      isStep1: s.route === 'step1',
      isStep2: s.route === 'step2',
      isStep3: s.route === 'step3',
      isGate: s.route === 'gate',
      isReveal: s.route === 'reveal',
      isBooking: s.route === 'booking',
      isConfirmed: s.route === 'confirmed',
      isOpLogin: s.route === 'oplogin',
      isConsoleInbox: s.route === 'console' && s.consoleView === 'inbox',
      isConsoleDetail: s.route === 'console' && s.consoleView === 'detail' && !!cur,

      start: () => this.go('step1'),
      goDoor: () => this.go('door'),
      goStep1: () => this.go('step1'),
      goStep2: () => this.go('step2'),
      goStep3: () => this.go('step3'),
      goGate: () => this.go('gate'),
      goReveal: () => this.go('reveal'),
      goBooking: () => this.go('booking'),
      goOpLogin: () => this.go('oplogin'),
      opLogin: () => this.setState({ route: 'console', consoleView: 'inbox' }),
      opSignOut: () => this.go('door'),
      goInbox: () => this.setState({ consoleView: 'inbox' }),
      restart: () => this.setState({ route: 'door', emailError: false, currentId: null }),

      businessType: s.businessType,
      hoursBand: s.hours,
      toggleBt: () => this.setState(st => ({ btOpen: !st.btOpen })),
      btOpen: s.btOpen,
      businessOptions: this.BUSINESS_TYPES.map((b, i) => ({
        label: b, onClick: () => this.setState({ businessType: b, btOpen: false }),
        style: {
          padding: '13px 16px', fontSize: '15px', cursor: 'pointer',
          color: b === s.businessType ? '#1A1A1A' : '#5C5A56',
          fontWeight: b === s.businessType ? 600 : 400,
          background: b === s.businessType ? '#FBF6F2' : '#fff',
          borderTop: i === 0 ? 'none' : '1px solid #E9E6E1',
        },
      })),
      hoursChips: this.HOURS_OPTS.map(h => ({
        label: h, selected: s.hours === h, style: chipStyle(s.hours === h),
        onClick: () => this.setState({ hours: h }),
      })),
      painRows: this.PAINS.map(p => {
        const seld = s.pains.includes(p.id);
        return {
          label: p.label, selected: seld,
          onClick: () => this.setState(st => ({
            pains: st.pains.includes(p.id) ? st.pains.filter(x => x !== p.id) : [...st.pains, p.id],
          })),
          rowStyle: {
            minHeight: '52px', borderRadius: '13px', display: 'flex', alignItems: 'center',
            gap: '13px', padding: '8px 15px', cursor: 'pointer',
            border: seld ? '1.5px solid #1A1A1A' : '1px solid #E9E6E1',
            background: seld ? '#fff' : '#FBF6F2',
          },
          boxStyle: {
            width: '22px', height: '22px', borderRadius: '6px', flex: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
            background: seld ? '#1A1A1A' : 'transparent', color: '#fff',
            border: seld ? 'none' : '1.5px solid #d8d3cc',
          },
          textStyle: { fontSize: '16px', lineHeight: 1.35, color: seld ? '#1A1A1A' : '#5C5A56' },
        };
      }),
      pickedPainLabels: sel.map(p => ({ label: p.short })),

      hoursLabel: lo + ' to ' + hi + ' hours',
      monthlyRange: this.money(lo * rate * 4.3, 50) + ' to ' + this.money(hi * rate * 4.3, 50),
      annualRange: this.money(lo * rate * 52, 100) + ' to ' + this.money(hi * rate * 52, 100),
      rate, rateLabel: '$' + rate,
      setRate: (e) => this.setState({ rate: Number(e.target.value) }),
      email: s.email,
      setEmail: (e) => this.setState({ email: e.target.value, emailError: false }),
      emailError: s.emailError,
      tryUnlock: () => {
        if (/\S+@\S+\.\S+/.test(s.email)) { this.submit(); this.setState({ route: 'reveal', emailError: false }); window.scrollTo(0, 0); }
        else this.setState({ emailError: true });
      },
      opportunities: sel.map(p => ({ title: p.opp, hoursText: 'about ' + p.lo + ' to ' + p.hi + ' hours a week' })),
      fixFirstTitle: fix ? fix.opp : '',
      fixFirstWhy: 'It is the biggest block of hours and among the easiest to lift off your plate, so you feel it in the first week.',

      slots: this.SLOTS.map(sl => ({
        label: sl,
        onClick: () => {
          if (s.currentId) this.updateSub(s.currentId, { status: 'contacted', bookedSlot: sl });
          this.setState({ route: 'confirmed', bookedSlot: sl }); window.scrollTo(0, 0);
        },
      })),
      bookedSlot: s.bookedSlot || this.SLOTS[0],

      // ----- console -----
      newCount: subs.filter(x => x.status === 'new').length,
      hasSubmissions: subs.length > 0,
      noSubmissions: subs.length === 0,
      inboxRows,

      curBusiness: cur ? cur.business : '',
      curEmail: cur ? cur.email : '',
      curTimeAgo: cur ? this.timeAgo(cur.createdAt) : '',
      curHours: cur ? cur.hours + ' / wk' : '',
      curHoursBack: d ? (d.hoursLo + ' to ' + d.hoursHi + ' hrs / wk') : '',
      curPains: curSel.map(p => ({ label: p.short })),
      draftPending: !!d && d.status === 'pending',
      draftReady: !!d && d.status === 'ready',
      draftSummary: d ? d.summary : '',
      draftPhases: d ? (d.phases || []) : [],
      draftBadgeLabel: draftBadge.draftBadgeLabel,
      draftBadgeStyle: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.03em', color: draftBadge.style.color, background: draftBadge.style.bg, border: '1px solid ' + draftBadge.style.border, borderRadius: '20px', padding: '3px 10px', flex: 'none' },
      curBlocks: d ? d.blocks.map(b => ({ label: b })) : [],
      curMeasure: d ? d.measure.map(m => ({ label: m })) : [],
      curDiscovery: d ? d.discovery.map(x => ({ label: x })) : [],
      curWatchouts: d ? d.watchouts.map(w => ({ label: w })) : [],
      curEstDays: stackEffort,
      curEstRange: stackBuildRange,
      curStack,
      stackEffort,
      stackTooling,
      regenerate: () => { if (cur) this.generateDraft(cur.id); },
      statusButtons,
    };
  }
}

mount(Component,"prototype-v2");
