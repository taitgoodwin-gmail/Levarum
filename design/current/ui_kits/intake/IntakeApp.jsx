const { NavBar, Footer, SkipLink, SectionBand, Card, Button, Eyebrow, Chip, Pill, Meter, HoursFigure, LinkArrow, SelectField, ChoiceChip, CheckRow, TextField, ProgressSteps, StatCard, Alert, FixFirstCard, OpportunityRow, StepNumber } = window.LevarumDesignSystem_13e0fb;

const PAINS = [
  { id: 'questions', label: 'Answering the same questions over and over', short: 'Repeat questions', opp: 'Stop re-answering the same customer questions', block: 'Shared answer library', lo: 2, hi: 3, why: 'It is the quickest thing to lift off you, and it makes every other flow easier to write.' },
  { id: 'invoices', label: 'Chasing invoices and payments', short: 'Invoice chasing', opp: 'Get invoices out and followed up without you', block: 'Invoice automation', lo: 3, hi: 5, why: 'It pays for itself first and nothing else depends on it, so it is the safest place to start.' },
  { id: 'copying', label: 'Copying details between tools by hand', short: 'Manual copying', opp: 'Stop copying the same details between tools', block: 'Field sync between tools', lo: 2, hi: 4, why: 'Every other automation gets more reliable once the same detail stops being typed twice.' },
  { id: 'booking', label: 'Booking people in and sending reminders', short: 'Booking and reminders', opp: 'Hand off booking and reminders', block: 'Booking and reminders', lo: 2, hi: 4, why: 'It removes the back-and-forth and the no-shows in one go, and customers notice immediately.' },
  { id: 'leads', label: 'Following up with new leads', short: 'Lead follow-up', opp: 'Follow up with new leads automatically', block: 'Lead follow-up flow', lo: 2, hi: 4, why: 'A first reply in minutes rather than days changes how many enquiries turn into work.' },
];

const HOURS = ['Under 5', '5 to 15', '15 to 30', '30 plus'];
const CAPS = { 'Under 5': 4, '5 to 15': 11, '15 to 30': 20, '30 plus': 30 };
const BUSINESS_TYPES = ['Trades & home services', 'Medical, dental or vet practice', 'Salon, barber or studio', 'Agency or consultancy', 'Online shop', 'Restaurant, cafe or bar', 'Property management', 'Something else'];
const SLOTS = ['Tomorrow, 8:30am', 'Thursday, 12:00pm', 'Friday, 5:30pm'];

const H1 = { margin: '0 0 var(--lv-s-5)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-2)', lineHeight: 1.02, letterSpacing: '-0.035em', textWrap: 'balance' };
const LEAD = { fontSize: 'var(--lv-d-7)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-g-2)', maxWidth: '560px', textWrap: 'pretty' };

function IntakeApp() {
  const [route, setRoute] = React.useState('step1');
  const [business, setBusiness] = React.useState(BUSINESS_TYPES[0]);
  const [band, setBand] = React.useState('5 to 15');
  const [pains, setPains] = React.useState(['invoices', 'booking']);
  const [painError, setPainError] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [slot, setSlot] = React.useState(null);

  const picked = PAINS.filter((p) => pains.includes(p.id));
  const cap = CAPS[band] || 11;
  const lo = Math.min(picked.reduce((a, p) => a + p.lo, 0), cap);
  const hi = Math.min(picked.reduce((a, p) => a + p.hi, 0), cap + 4);
  const hoursLabel = lo === hi ? lo + ' hours' : lo + ' to ' + hi + ' hours';
  const hoursYear = Math.round(((lo + hi) / 2) * 46).toLocaleString('en-US');
  const hoursWeeks = Math.round(((lo + hi) / 2) * 46 / 38);
  const fix = picked.slice().sort((a, b) => (b.lo + b.hi) - (a.lo + a.hi))[0] || PAINS[1];
  const stepNo = route === 'step1' ? 1 : route === 'step2' ? 2 : 3;

  const toggle = (id) => { setPainError(false); setPains((p) => p.includes(id) ? p.filter((x) => x !== id) : p.concat(id)); };
  const toStep3 = () => { if (!pains.length) { setPainError(true); return; } setRoute('step3'); };
  const unlock = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setEmailError('That does not look like an email yet. Mind checking it?'); return; }
    setEmailError(''); setRoute('plan');
  };

  return (
    <div style={{ fontFamily: 'var(--lv-f-body)', color: 'var(--lv-ink)', background: 'var(--lv-page)', minHeight: '100vh' }}>
      <SkipLink href="#lv-main" />
      <NavBar
        links={[{ label: 'How it works', href: '#' }, { label: 'What we automate', href: '#' }, { label: 'Questions', href: '#' }]}
        cta={{ label: 'Start', href: '#' }} />
      <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: '0 var(--lv-s-7) var(--lv-s-4)', fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)' }}>Prototype — answers stay on this device and nothing is sent anywhere.</div>

      <main id="lv-main">
        <div style={{ maxWidth: 'var(--lv-w-form)', margin: '0 auto', padding: 'var(--lv-g-4) var(--lv-s-7) var(--lv-g-5)' }}>
          {(route === 'step1' || route === 'step2' || route === 'step3') ? (
            <ProgressSteps step={stepNo} total={3} note="About 90 seconds in total" style={{ marginBottom: 'var(--lv-g-2)', animation: 'lvFade .4s ease-out both' }} />
          ) : null}

          {route === 'step1' ? (
            <div style={{ animation: 'lvRise .5s var(--lv-ease) both' }}>
              <h1 style={H1}>First, the basics.</h1>
              <div style={LEAD}>Two quick facts and we can already tell where most of the week is going.</div>
              <Card>
                <SelectField id="lv-biz" label="What kind of business is this?" value={business} onChange={(e) => setBusiness(e.target.value)} options={BUSINESS_TYPES} style={{ marginBottom: 'var(--lv-s-7)' }} />
                <div style={{ fontSize: 'var(--lv-t-md)', fontWeight: 500, marginBottom: 'var(--lv-s-3)' }}>About how many hours a week go to back-office work?</div>
                <div role="radiogroup" aria-label="Hours a week on back-office work" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'var(--lv-s-3)' }}>
                  {HOURS.map((h) => <ChoiceChip key={h} label={h + ' hrs'} selected={h === band} onSelect={() => setBand(h)} />)}
                </div>
              </Card>
              <Button block onClick={() => setRoute('step2')} style={{ marginTop: 'var(--lv-s-6)' }}>Next</Button>
              <div style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)', textAlign: 'center', marginTop: 'var(--lv-s-4)' }}>No account, no card. Your answers stay on this device.</div>
            </div>
          ) : null}

          {route === 'step2' ? (
            <div style={{ animation: 'lvRise .5s var(--lv-ease) both' }}>
              <h1 style={H1}>Where does the week actually go?</h1>
              <div style={LEAD}>Pick the ones that sound like you. More than one is normal.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)' }}>
                {PAINS.map((p) => <CheckRow key={p.id} label={p.label} checked={pains.includes(p.id)} onToggle={() => toggle(p.id)} />)}
              </div>
              <div style={{ display: 'flex', gap: 'var(--lv-s-4)', marginTop: 'var(--lv-s-6)', flexWrap: 'wrap' }}>
                <Button variant="ghost" onClick={() => setRoute('step1')}>Back</Button>
                <Button onClick={toStep3} style={{ flex: 1, minWidth: '200px' }}>Next</Button>
              </div>
              {painError ? <Alert style={{ marginTop: 'var(--lv-s-4)' }}>Pick at least one, even if none of them is perfect.</Alert> : null}
            </div>
          ) : null}

          {route === 'step3' ? (
            <div style={{ animation: 'lvRise .5s var(--lv-ease) both' }}>
              <h1 style={H1}>Here is what we will put together.</h1>
              <div style={LEAD}>A short plan, built from your answers, written in plain language.</div>
              <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-5)' }}>
                {[
                  'The handful of jobs worth handing off first',
                  'Roughly how many hours that gives you back each week',
                  'The one thing I would fix before anything else',
                ].map((t, i) => (
                  <div key={t} style={{ display: 'flex', gap: 'var(--lv-s-5)', alignItems: 'center' }}>
                    <StepNumber n={i + 1} size={28} tone="ink" />
                    <span style={{ fontSize: 'var(--lv-t-body)', lineHeight: 1.45 }}>{t}</span>
                  </div>
                ))}
              </Card>
              <div style={{ display: 'flex', gap: 'var(--lv-s-4)', marginTop: 'var(--lv-s-6)', flexWrap: 'wrap' }}>
                <Button variant="ghost" onClick={() => setRoute('step2')}>Back</Button>
                <Button onClick={() => setRoute('gate')} style={{ flex: 1, minWidth: '200px' }}>Build my Game Plan</Button>
              </div>
            </div>
          ) : null}

          {route === 'gate' ? (
            <div style={{ animation: 'lvRise .5s var(--lv-ease) both' }}>
              <Eyebrow wide style={{ marginBottom: 'var(--lv-s-4)' }}>YOUR GAME PLAN IS READY</Eyebrow>
              <h1 style={{ ...H1, fontSize: 'var(--lv-d-3)', lineHeight: 1.04, marginBottom: 'var(--lv-s-7)' }}>I found {picked.length === 1 ? 'one place' : picked.length + ' places'} your week is leaking time.</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'var(--lv-s-5)', marginBottom: 'var(--lv-s-5)' }}>
                <Card padding="lg"><div style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-2)' }}>Hours back, every week</div><div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-3)', letterSpacing: '-0.03em', lineHeight: 1 }}>{hoursLabel}</div></Card>
                <Card padding="lg"><div style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-2)' }}>Jobs worth handing off</div><div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-3)', letterSpacing: '-0.03em', lineHeight: 1 }}>{picked.length} {picked.length === 1 ? 'job' : 'jobs'}</div></Card>
              </div>
              <Card variant="sunken" padding="lg" style={{ marginBottom: 'var(--lv-s-7)' }}>
                <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-3)' }}>WHAT YOU TOLD ME</Eyebrow>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--lv-s-5)', marginBottom: 'var(--lv-s-3)' }}><span style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)' }}>Business</span><span style={{ fontSize: 'var(--lv-t-sm)', fontWeight: 500, textAlign: 'right' }}>{business}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--lv-s-5)', marginBottom: 'var(--lv-s-4)' }}><span style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)' }}>Back-office</span><span style={{ fontSize: 'var(--lv-t-sm)', fontWeight: 500 }}>{band} hrs / week</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lv-s-2)' }}>{picked.map((p) => <Chip key={p.id} tone="quiet">{p.short}</Chip>)}</div>
              </Card>
              <div style={{ borderTop: 'var(--lv-bw) solid var(--lv-line)', paddingTop: 'var(--lv-s-7)' }}>
                <h2 style={{ margin: '0 0 var(--lv-s-2)', fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-xl)', letterSpacing: 'var(--lv-track-head)' }}>Where should we send the full plan?</h2>
                <div style={{ fontSize: 'var(--lv-t-md)', color: 'var(--lv-ink-quiet)', lineHeight: 1.5, marginBottom: 'var(--lv-s-5)', maxWidth: '520px' }}>You will see it on screen straight away — the email is so you can keep it.</div>
                <div style={{ display: 'flex', gap: 'var(--lv-s-4)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <TextField id="lv-email" type="email" placeholder="you@yourbusiness.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} error={emailError} style={{ minWidth: '240px' }} />
                  <Button onClick={unlock}>Unlock my plan</Button>
                </div>
                <div onClick={() => setRoute('step3')} role="button" tabIndex={0} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 'var(--lv-tap-min)', marginTop: 'var(--lv-s-3)', fontSize: 'var(--lv-t-md)', color: 'var(--lv-ink-quiet)', cursor: 'pointer' }}>← Back a step</div>
              </div>
            </div>
          ) : null}

          {route === 'plan' ? (
            <div style={{ animation: 'lvRise .5s var(--lv-ease) both' }}>
              <Eyebrow wide style={{ marginBottom: 'var(--lv-s-4)' }}>YOUR GAME PLAN</Eyebrow>
              <h1 style={{ ...H1, lineHeight: 1, letterSpacing: '-0.038em' }}>{hoursLabel} a week, back in your hands.</h1>
              <div style={LEAD}>That is about {hoursYear} hours a year — roughly {hoursWeeks} working weeks handed back. An estimate from your answers, not a promise.</div>

              <div style={{ fontSize: 'var(--lv-t-xs)', fontWeight: 600, letterSpacing: 'var(--lv-track-caps)', color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-4)' }}>WHERE IT COMES FROM</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)', marginBottom: 'var(--lv-s-7)' }}>
                {picked.slice().sort((a, b) => (b.lo + b.hi) - (a.lo + a.hi)).map((p) => (
                  <OpportunityRow key={p.id} title={p.opp} hoursText={p.lo + ' to ' + p.hi + ' hours a week'} figure={p.hi} percent={Math.min(100, Math.round(((p.lo + p.hi) / 2) / 4 * 100))} quiet={p.hi <= 3} />
                ))}
              </div>

              <FixFirstCard title={fix.block} why={fix.why} style={{ marginBottom: 'var(--lv-s-8)' }} />

              <div style={{ background: 'var(--lv-dark-petrol)', color: 'var(--lv-dark-ink)', borderRadius: 'var(--lv-r-card)', padding: 'var(--lv-g-2)' }}>
                <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-d-4)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 'var(--lv-s-3)' }}>Want to walk through it together?</div>
                <div style={{ fontSize: 'var(--lv-t-body)', lineHeight: 1.55, color: 'var(--lv-dark-quiet)', marginBottom: 'var(--lv-s-6)', maxWidth: '52ch' }}>Fifteen minutes, no pitch. I will have your plan open in front of me and we decide whether it is worth building at all.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)' }}>
                  {SLOTS.map((s) => {
                    const on = slot === s;
                    return (
                      <div key={s} role="button" tabIndex={0} onClick={() => setSlot(s)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSlot(s); } }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lv-s-5)', minHeight: 'var(--lv-tap)', padding: '0 var(--lv-s-6)', borderRadius: 'var(--lv-r-control)', cursor: 'pointer', background: on ? 'var(--lv-dark-petrol-surface)' : 'transparent', border: 'var(--lv-bw-strong) solid ' + (on ? 'var(--lv-sec-on-dark)' : 'var(--lv-dark-petrol-line)') }}>
                        <span style={{ fontSize: 'var(--lv-t-body)', fontWeight: 500 }}>{s}</span>
                        <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 600, fontSize: 'var(--lv-t-sm)', color: on ? 'var(--lv-dark-ink)' : 'var(--lv-sec-on-dark)' }}>{on ? 'Booked' : 'Pick this'}</span>
                      </div>
                    );
                  })}
                </div>
                {slot ? (
                  <div style={{ marginTop: 'var(--lv-s-5)', borderTop: 'var(--lv-bw) solid var(--lv-dark-petrol-line)', paddingTop: 'var(--lv-s-5)' }}>
                    <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-lg)', letterSpacing: 'var(--lv-track-tight)', marginBottom: 'var(--lv-s-4)' }}>You are booked for {slot}.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)' }}>
                      {['We read your answers before the call — you will not be repeating yourself.', 'Fifteen minutes on a screen share, plan open in front of both of us.', 'If it is not worth building, I will say so and you keep the plan.'].map((t, i) => (
                        <div key={t} style={{ display: 'flex', gap: 'var(--lv-s-4)', alignItems: 'baseline' }}>
                          <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-sm)', color: 'var(--lv-sec-on-dark)' }}>{i + 1}</span>
                          <span style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.5, color: 'var(--lv-dark-quiet)' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div style={{ display: 'flex', gap: 'var(--lv-s-5)', alignItems: 'center', flexWrap: 'wrap', marginTop: 'var(--lv-s-7)' }}>
                <LinkArrow href="#" size="lg">See how each one is built</LinkArrow>
                <LinkArrow href="#" size="lg">Still have questions</LinkArrow>
                <span onClick={() => { setRoute('step1'); setSlot(null); setEmail(''); }} role="button" tabIndex={0} style={{ fontSize: 'var(--lv-t-md)', color: 'var(--lv-ink-quiet)', cursor: 'pointer' }}>Start again</span>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <Footer tagline="Back-office automation for owner-run businesses." links={[{ label: 'How it works', href: '#' }, { label: 'Questions', href: '#' }, { label: 'hello@levarum.co', href: 'mailto:hello@levarum.co' }]} />
    </div>
  );
}

Object.assign(window, { IntakeApp });
