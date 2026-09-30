import {DCLogic,mount} from './runtime.js';
// Preview storage is memory only and cannot access live submissions.
const memory=new Map(); const localStorage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};

class Component extends DCLogic {
  state = {
    route: 'door',
    businessType: 'Home services (plumbing, HVAC, electrical)',
    btOpen: false,
    hours: '5 to 15',
    pains: ['questions', 'invoices', 'booking'],
    email: 'casey@example.com',
    emailError: false,
    unlocked: false,
    rate: 60,
    bookedSlot: '',
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
    { id: 'questions', label: 'Answering the same questions over and over', short: 'Repeat questions', opp: 'Stop re-answering the same customer questions', block: 'Shared answer library', lo: 3, hi: 4 },
    { id: 'invoices', label: 'Chasing invoices and payments', short: 'Invoice chasing', opp: 'Get invoices out and followed up without you', block: 'Invoice automation', lo: 2, hi: 3 },
    { id: 'copying', label: 'Copying details between tools by hand', short: 'Manual copying', opp: 'Stop copying the same details between tools', block: 'Field sync between tools', lo: 1, hi: 2 },
    { id: 'booking', label: 'Booking people in and sending reminders', short: 'Booking & reminders', opp: 'Hand off booking and reminders', block: 'Booking and reminders', lo: 4, hi: 6 },
    { id: 'leads', label: 'Following up with new leads', short: 'Lead follow-up', opp: 'Follow up with new leads automatically', block: 'Lead follow-up flow', lo: 2, hi: 3 },
  ];

  SLOTS = ['Tomorrow, 9:30 AM', 'Tomorrow, 2:00 PM', 'Thursday, 11:00 AM', 'Friday, 4:30 PM'];

  rootRef = ({current:null});

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

  componentDidMount() { this.applyVars(); }
  componentDidUpdate() { this.applyVars(); }

  money(n, step) {
    const r = Math.round(n / step) * step;
    return '$' + r.toLocaleString('en-US');
  }

  selectedPains() {
    return this.PAINS.filter(p => this.state.pains.includes(p.id));
  }

  go(route) { this.setState({ route, btOpen: false }); window.scrollTo(0, 0); }

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
          s1: "Two quick facts to start.",
          s2: "What's eating your week?",
          s3: "Here's what you're about to get.",
          buildCta: "Show me the number",
          gateH: cap(word) + " leaks found. Here's how big.",
          unlockCta: "Unlock the number",
          revealLabel: "Here's the money on the table",
          bookCta: "Grab a 15-min call",
          confH: "Done. You're on the calendar.",
          confSub: "Fifteen minutes, no pitch. Your invite is on the way.",
        }
      : {
          doorH: "Put your back office to work.",
          doorSub: "Answer three quick questions. I will map where your week is going, what it is worth, and the one thing to fix first.",
          doorCta: "Start my Game Plan",
          s1: "First, the basics.",
          s2: "Where does the week actually go?",
          s3: "Here is what I will put together for you.",
          buildCta: "Build my Game Plan",
          gateH: "I found " + word + " places your week is leaking time.",
          unlockCta: "Unlock my Game Plan",
          revealLabel: "Your time, given back, is worth about",
          bookCta: "Book a 15-min call",
          confH: "You are booked.",
          confSub: "A 15-minute call, no pitch. Look out for a calendar invite.",
        };

    // fix-first = biggest single block of hours among selected
    let fix = sel[0];
    sel.forEach(p => { if (p.hi > (fix ? fix.hi : 0)) fix = p; });

    const nP = sel.length || 1;
    const daysLo = nP * 2, daysHi = nP * 3;
    const dayRate = 1200;

    const chipStyle = (seld) => ({
      minHeight: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '7px', fontSize: '16px', cursor: 'pointer',
      border: seld ? '1.5px solid #1A1A1A' : '1px solid #E9E6E1',
      color: seld ? '#1A1A1A' : '#5C5A56', fontWeight: seld ? 500 : 400,
      background: seld ? '#fff' : '#FBF6F2',
    });

    return {
      rootRef: this.rootRef,
      cDoorH: c.doorH, cDoorSub: c.doorSub, cDoorCta: c.doorCta,
      cS1: c.s1, cS2: c.s2, cS3: c.s3, cBuildCta: c.buildCta,
      cGateH: c.gateH, cUnlockCta: c.unlockCta,
      cRevealLabel: c.revealLabel, cBookCta: c.bookCta,
      cConfH: c.confH, cConfSub: c.confSub,
      // routes
      isDoor: s.route === 'door',
      isStep1: s.route === 'step1',
      isStep2: s.route === 'step2',
      isStep3: s.route === 'step3',
      isGate: s.route === 'gate',
      isReveal: s.route === 'reveal',
      isBooking: s.route === 'booking',
      isConfirmed: s.route === 'confirmed',
      isOpLogin: s.route === 'oplogin',
      isConsole: s.route === 'console',

      // nav
      start: () => this.go('step1'),
      goDoor: () => this.go('door'),
      goStep1: () => this.go('step1'),
      goStep2: () => this.go('step2'),
      goStep3: () => this.go('step3'),
      goGate: () => this.go('gate'),
      goReveal: () => this.go('reveal'),
      goBooking: () => this.go('booking'),
      goOpLogin: () => this.go('oplogin'),
      opLogin: () => this.go('console'),
      opSignOut: () => this.go('door'),
      restart: () => this.setState({ route: 'door', unlocked: false, emailError: false }),

      // intake values
      businessType: s.businessType,
      hoursBand: s.hours,
      toggleBt: () => this.setState(st => ({ btOpen: !st.btOpen })),
      btOpen: s.btOpen,
      businessOptions: this.BUSINESS_TYPES.map((b, i) => ({
        label: b,
        onClick: () => this.setState({ businessType: b, btOpen: false }),
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
      nPainsWord: words[sel.length] || sel.length,

      // gate + reveal math
      hoursLabel: lo + ' to ' + hi + ' hours',
      monthlyRange: this.money(lo * rate * 4.3, 50) + ' to ' + this.money(hi * rate * 4.3, 50),
      annualRange: this.money(lo * rate * 52, 100) + ' to ' + this.money(hi * rate * 52, 100),
      rate, rateLabel: '$' + rate,
      setRate: (e) => this.setState({ rate: Number(e.target.value) }),
      email: s.email,
      setEmail: (e) => this.setState({ email: e.target.value, emailError: false }),
      emailError: s.emailError,
      tryUnlock: () => {
        if (/\S+@\S+\.\S+/.test(s.email)) this.setState({ unlocked: true, route: 'reveal', emailError: false });
        else this.setState({ emailError: true });
      },
      opportunities: sel.map(p => ({ title: p.opp, hoursText: 'about ' + p.lo + ' to ' + p.hi + ' hours a week' })),
      fixFirstTitle: fix ? fix.opp : '',
      fixFirstWhy: 'It is the biggest block of hours and among the easiest to lift off your plate, so you feel it in the first week.',

      // booking
      slots: this.SLOTS.map(sl => ({ label: sl, onClick: () => this.setState({ route: 'confirmed', bookedSlot: sl }) })),
      bookedSlot: s.bookedSlot || this.SLOTS[0],

      // operator
      painsSummary: sel.map(p => p.short).join(', '),
      opBlocks: sel.map(p => ({ label: p.block })),
      estDays: daysLo + ' to ' + daysHi + ' days',
      estRange: this.money(daysLo * dayRate, 500) + ' to ' + this.money(daysHi * dayRate, 500),
    };
  }
}

mount(Component,"prototype");
