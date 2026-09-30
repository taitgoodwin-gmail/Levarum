const { NavBar, Footer, SkipLink, Card, Button, Eyebrow, Chip, Pill, StatCard, Alert, TextField, LinkArrow } = window.LevarumDesignSystem_13e0fb;

const FLOW = ['New', 'Contacted', 'Booked', 'Done'];
const TONE = { New: 'new', Contacted: 'contacted', Booked: 'booked', Done: 'done' };

const PAIN_LABELS = {
  invoices: 'Invoicing and chasing',
  booking: 'Booking and reminders',
  leads: 'Lead follow-up',
  questions: 'Repeat questions',
  copying: 'Copying between tools',
};

/* Seeded rows stand in for the on-device store the real inbox reads.
   Three customer requests and one partner lead, which is the shape the
   source page handles. */
const SEED = [
  { id: 'LV-M8QK2P', status: 'New', when: '12 minutes ago', business: 'Trades & home services', hours: '5 to 9 hours', backOffice: '5 to 15', slot: 'Thursday, 12:00pm', email: 'dave@sharpeplumbing.com', pains: ['invoices', 'booking'] },
  { id: 'LV-M8Q4RB', status: 'New', when: '3 hours ago', business: 'Medical, dental or vet practice', hours: '7 to 12 hours', backOffice: '15 to 30', slot: null, email: 'frontdesk@parkwaydental.com', pains: ['booking', 'questions', 'copying'] },
  { id: 'LVP-M8PZ1A', status: 'Contacted', when: '1 day ago', kind: 'partner', name: 'Rosa Herrera', craft: 'Integrations and front-desk ops', plugIn: 'Building the automations', email: 'rosa@herrera.works' },
  { id: 'LV-M8N7TC', status: 'Booked', when: '2 days ago', business: 'Salon, barber or studio', hours: '4 to 7 hours', backOffice: 'Under 5', slot: 'Tomorrow, 8:30am', email: 'kel@thechairnw.com', pains: ['booking', 'leads'] },
  { id: 'LV-M8JQ9F', status: 'Done', when: '6 Aug', business: 'Agency or consultancy', hours: '6 to 10 hours', backOffice: '5 to 15', slot: 'Friday, 5:30pm', email: 'ops@northlight.agency', pains: ['copying', 'questions'] },
];

function SignIn({ user, setUser, pass, setPass, error, onSubmit }) {
  return (
    <div style={{ maxWidth: 'var(--lv-w-narrow)', margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7)' }}>
      <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)' }}>SUBMISSIONS INBOX</Eyebrow>
      <h1 style={{ margin: '0 0 var(--lv-s-5)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-2)', lineHeight: 1.02, letterSpacing: '-0.035em' }}>Sign in.</h1>
      <div style={{ fontSize: 'var(--lv-d-7)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-g-2)', textWrap: 'pretty' }}>This is where Game Plan requests land, and where you move each one through to a booked call.</div>
      <Card shadow="sm" padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-5)' }}>
        <TextField id="lv-user" label="User" value={user} onChange={(e) => setUser(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }} />
        <TextField id="lv-pass" label="Password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }} />
        {error ? <Alert tone="accent">That is not the demo user or password.</Alert> : null}
        <Button block onClick={onSubmit}>Sign in</Button>
      </Card>
      <Card variant="tinted" padding="sm" style={{ marginTop: 'var(--lv-s-6)' }}>
        <Eyebrow style={{ marginBottom: 'var(--lv-s-3)' }}>PROTOTYPE AUTH — NOT SECURE</Eyebrow>
        <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-3)' }}>These credentials are checked in the browser, in front-end code anyone can read. It gates the demo, nothing more. A live deployment needs server-side auth: a session or token issued by a backend, submissions fetched from that backend rather than from this device, and this page refusing to render without a valid session.</div>
        <div style={{ fontFamily: 'var(--lv-t-mono)', fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink)' }}>owner / levarum</div>
      </Card>
    </div>
  );
}

function Row({ r, onStatus }) {
  const partner = r.kind === 'partner';
  const chips = partner
    ? ['Implementation partner', r.plugIn].filter(Boolean)
    : (r.pains || []).map((id) => PAIN_LABELS[id] || id);
  return (
    <Card shadow={r.status === 'New' ? 'sm' : undefined} style={{ borderColor: r.status === 'New' ? 'var(--lv-accent)' : 'var(--lv-line)' }} padding="sm">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--lv-s-5)', alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lv-s-4)', flexWrap: 'wrap', marginBottom: 'var(--lv-s-3)' }}>
            <Pill tone={TONE[r.status]}>{r.status.toUpperCase()}</Pill>
            <span style={{ fontFamily: 'var(--lv-t-mono)', fontSize: 'var(--lv-t-cap)', color: 'var(--lv-ink-quiet)' }}>{r.id}</span>
            <span style={{ fontSize: 'var(--lv-t-cap)', color: 'var(--lv-ink-quiet)' }}>{r.when}</span>
          </div>
          <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-d-5)', letterSpacing: 'var(--lv-track-head)', marginBottom: 'var(--lv-s-3)' }}>
            {partner ? 'PARTNER · ' + r.name : r.business}
          </div>
          <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)' }}>
            {partner
              ? r.craft + ' · plugs in at ' + r.plugIn
              : r.hours + ' a week back · ' + r.backOffice + ' hours a week on back office' + (r.slot ? ' · asked for ' + r.slot : ' · no slot picked')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lv-s-2)', marginTop: 'var(--lv-s-4)' }}>
            {chips.map((c) => <Chip key={c}>{c}</Chip>)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)', minWidth: '210px' }}>
          <Eyebrow tone="quiet">MOVE TO</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lv-s-2)' }}>
            {FLOW.map((f) => (
              <Button key={f} variant="status" size="sm" active={f === r.status} disabled={f === r.status} onClick={() => onStatus(r.id, f)}>{f}</Button>
            ))}
          </div>
          <div style={{ fontSize: 'var(--lv-t-cap)', color: 'var(--lv-ink-quiet)' }}>{r.email}</div>
        </div>
      </div>
    </Card>
  );
}

function AdminApp() {
  const [authed, setAuthed] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [error, setError] = React.useState(false);
  const [list, setList] = React.useState(SEED);

  const signIn = () => {
    if (user.trim().toLowerCase() === 'owner' && pass === 'levarum') { setAuthed(true); setError(false); setPass(''); }
    else setError(true);
  };
  const setStatus = (id, status) => setList((l) => l.map((r) => r.id === id ? { ...r, status } : r));

  const newCount = list.filter((r) => r.status === 'New').length;
  const partnerCount = list.filter((r) => r.kind === 'partner').length;

  return (
    <div style={{ fontFamily: 'var(--lv-f-body)', color: 'var(--lv-ink)', background: 'var(--lv-page)', minHeight: '100vh' }}>
      <SkipLink href="#lv-main" />
      <NavBar
        links={[{ label: 'Back to site', href: '#' }, { label: 'Intake form', href: '#' }]}
        badge={<Pill>ADMIN</Pill>}
        right={authed ? <Button variant="status" size="sm" onClick={() => { setAuthed(false); setUser(''); }}>Sign out</Button> : null} />

      <main id="lv-main">
        {!authed ? (
          <SignIn user={user} setUser={setUser} pass={pass} setPass={setPass} error={error} onSubmit={signIn} />
        ) : (
          <>
            <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-3) var(--lv-s-7) var(--lv-s-8)' }}>
              <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)' }}>SUBMISSIONS INBOX</Eyebrow>
              <h1 style={{ margin: '0 0 var(--lv-s-5)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-2)', lineHeight: 1.02, letterSpacing: '-0.035em' }}>
                {newCount === 0 ? 'Everything here has been picked up.' : newCount === 1 ? 'One request waiting on you.' : newCount + ' requests waiting on you.'}
              </h1>
              <div style={{ fontSize: 'var(--lv-d-7)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', maxWidth: '60ch', textWrap: 'pretty' }}>Each row is one unlocked Game Plan. Move it through New, Contacted, Booked and Done — the status is written straight back to the store, so it survives a refresh.</div>
            </div>

            <div style={{ background: 'var(--lv-rung-2)', borderTop: 'var(--lv-bw) solid var(--lv-line)', borderBottom: 'var(--lv-bw) solid var(--lv-line)' }}>
              <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-2) var(--lv-s-7)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'var(--lv-s-5)' }}>
                  {FLOW.map((f) => (
                    <StatCard key={f} value={String(list.filter((r) => r.status === f).length)} label={f} tone={TONE[f]} />
                  ))}
                  <StatCard value={String(partnerCount)} label="Partner leads" tone="sec" />
                </div>
              </div>
            </div>

            <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-2) var(--lv-s-7) var(--lv-g-3)', display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-5)' }}>
              {list.map((r) => <Row key={r.id} r={r} onStatus={setStatus} />)}
            </div>

            <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: '0 var(--lv-s-7) var(--lv-g-3)' }}>
              <Card variant="tinted" padding="sm">
                <Eyebrow style={{ marginBottom: 'var(--lv-s-4)' }}>WHERE THESE COME FROM</Eyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--lv-g-1)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-body)', letterSpacing: 'var(--lv-track-tight)', marginBottom: 'var(--lv-s-3)' }}>Prototype mode — where you are now</div>
                    <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)' }}>The intake writes each unlocked plan to <span style={{ fontFamily: 'var(--lv-t-mono)', fontSize: 'var(--lv-t-sm)' }}>levarum.submissions.v1</span> on this device. This page reads that same store, so a submission shows up here immediately. Status changes are written back to it. Nothing leaves the browser, and another device sees none of it.</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-body)', letterSpacing: 'var(--lv-track-tight)', marginBottom: 'var(--lv-s-3)' }}>Live mode — once an endpoint exists</div>
                    <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)' }}>Setting the intake's <span style={{ fontFamily: 'var(--lv-t-mono)', fontSize: 'var(--lv-t-sm)' }}>formEndpoint</span> makes it POST the same JSON shape to your server, which stores it and returns the list to an authenticated request from this page. The row layout and the status workflow do not change — only where the list is read from, and the fact that auth becomes real.</div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </main>

      <Footer tagline="Internal — not linked from the public navigation." links={[{ label: 'Home', href: '#' }, { label: 'Intake form', href: '#' }]} />
    </div>
  );
}

Object.assign(window, { AdminApp });
