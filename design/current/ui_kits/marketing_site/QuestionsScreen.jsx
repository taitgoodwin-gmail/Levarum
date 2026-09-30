const { SectionBand, Card, Button, Eyebrow, Accordion, Alert, TextField, ChoiceChip, LinkArrow } = window.LevarumDesignSystem_13e0fb;

const FAQS = [
  { q: 'What does it cost?', a: 'Priced per build, not per hour of meetings, and never open-ended. Your plan is free and shows the work in hours and days; the price for that scope is agreed on the call, in writing, before anything starts. Most first builds are a few days of work rather than a project.' },
  { q: 'Do you need to come to us?', a: 'No. The call, the build and the handover are all remote, wherever you are in the country. I work inside your own accounts with access you grant and can revoke, and the walkthrough happens on a screen share. There is no site visit to schedule and nothing for you to host.' },
  { q: 'We are a practice, not a trade. Does this still apply?', a: 'Yes, and the numbers are usually starker. Published industry figures put no-shows and late cancellations near 30% in dental, 27% in medical practices including physical therapy and chiropractic, 20% in salons and about 12% in veterinary, with a missed appointment worth roughly $200. Automated reminders with a two-way confirmation recover between a third and a half of those. Those are industry averages, not our results; your plan uses your own numbers.' },
  { q: 'How long does it take?', a: 'The plan takes about ninety seconds. A first build is usually one to three days of work, scheduled within a couple of weeks, and you are running on it the week it is finished.' },
  { q: 'What if I am not technical?', a: 'That is the normal case. I build it, then walk you through it in plain language and write it down. If a step needs your judgement, it asks you in a text or an email with a single tap to approve.' },
  { q: 'What if it breaks?', a: 'Two weeks of fixes after handover are included, and every flow is built to fail loudly rather than silently: if something does not go through, you get told, and nothing is quietly dropped. After that you can call me or run it yourself.' },
  { q: 'Will this replace my staff?', a: 'No, and I will say so if that is what you are hoping for. This takes the copying, chasing and re-typing off the people you already have so they can do the work you actually hired them for.' },
  { q: 'Why not just buy software?', a: 'Often you should, and I will tell you when off-the-shelf is the answer. The problem is rarely a missing tool: it is that the four tools you already pay for do not talk to each other, and you are the one carrying data between them.' },
  { q: 'Is my data safe?', a: 'Everything lives in your own accounts under your own logins, on well-known tools you can audit or cancel. I use the minimum access needed and hand it all back at the end. Your intake answers stay on your device until you unlock your plan.' },
];

function QuestionsScreen() {
  return (
    <>
      <div style={{ maxWidth: 'var(--lv-w-read)', margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7) var(--lv-g-3)' }}>
        <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)', animation: 'lvRise .6s var(--lv-ease) both' }}>QUESTIONS</Eyebrow>
        <h1 style={{ margin: '0 0 var(--lv-s-5)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-1)', lineHeight: '.98', letterSpacing: 'var(--lv-track-hero)', textWrap: 'balance', animation: 'lvRise .7s var(--lv-ease) .07s both' }}>The things owners ask me first.</h1>
        <div style={{ ...window.LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, animation: 'lvRise .7s var(--lv-ease) .14s both' }}>Seven honest answers. If yours is not here, ask it on the call.</div>
      </div>

      <SectionBand rung={3} width="read" innerStyle={{ padding: 'var(--lv-g-3) var(--lv-s-7) var(--lv-g-5)', maxWidth: 'var(--lv-w-read)' }}>
        <Accordion items={FAQS} defaultOpen={0} style={{ animation: 'lvRise .7s var(--lv-ease) .2s both' }} />
      </SectionBand>

      <SectionBand rung={2} edges="none" width="read" innerStyle={{ textAlign: 'center', maxWidth: 'var(--lv-w-read)' }}>
        <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-2)', lineHeight: 1.03, letterSpacing: '-0.035em', marginBottom: 'var(--lv-s-5)', textWrap: 'balance' }}>Still not sure? Get the plan and decide after.</div>
        <div style={{ ...window.LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '540px', margin: '0 auto var(--lv-s-8)' }}>Three questions, about ninety seconds. It is yours whether or not we ever speak.</div>
        <Button href="../intake/index.html" size="lg">Build my Game Plan</Button>
      </SectionBand>
    </>
  );
}

const PLUGS = ['Building the automations', 'Front-desk and ops setup', 'Finding the businesses', 'Not sure yet'];

function PartnersScreen() {
  const [name, setName] = React.useState('');
  const [craft, setCraft] = React.useState('');
  const [plug, setPlug] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const submit = () => {
    if (!name.trim()) return setError('A name would help.');
    if (!craft.trim()) return setError('Tell me what you do, even roughly.');
    if (!plug) return setError('Pick where you would plug in.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('That does not look like an email yet.');
    setError('');
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 'var(--lv-w-form)', margin: '0 auto', padding: 'var(--lv-g-4) var(--lv-s-7) var(--lv-g-5)' }}>
      <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)', animation: 'lvRise .6s var(--lv-ease) both' }}>IMPLEMENTATION PARTNERS</Eyebrow>
      <h1 style={{ margin: '0 0 var(--lv-s-6)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-1)', lineHeight: '.98', letterSpacing: 'var(--lv-track-hero)', textWrap: 'balance', animation: 'lvRise .7s var(--lv-ease) .07s both' }}>Help build these, and help decide how they work.</h1>
      <div style={{ ...window.LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, marginBottom: 'var(--lv-g-2)', animation: 'lvRise .7s var(--lv-ease) .14s both' }}>There is more work here than one person can deliver, and plenty that is still undecided. If you build automations for small service businesses — or you run a shop that already does — put your name down and let us think it through together. Remote, wherever you are.</div>

      {sent ? (
        <Card variant="tinted">
          <Eyebrow style={{ marginBottom: 'var(--lv-s-3)' }}>ON THE LIST</Eyebrow>
          <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-d-4)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 'var(--lv-s-4)' }}>Thanks, {name.split(' ')[0]}.</div>
          <div style={{ fontSize: 'var(--lv-t-body)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)', maxWidth: '56ch' }}>It has landed in the same inbox the customer requests land in, marked as a partner lead. You will hear from a person, not a sequence, and it will be a conversation rather than a pitch.</div>
          <div style={{ borderTop: 'var(--lv-bw) solid var(--lv-sec)', marginTop: 'var(--lv-s-6)', paddingTop: 'var(--lv-s-5)', display: 'flex', gap: 'var(--lv-s-5)', flexWrap: 'wrap' }}>
            <LinkArrow href="#home">Back to the site</LinkArrow>
            <span onClick={() => { setSent(false); setName(''); setCraft(''); setPlug(null); setEmail(''); }} role="button" tabIndex={0} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 'var(--lv-tap-min)', fontSize: 'var(--lv-t-md)', color: 'var(--lv-ink-quiet)', cursor: 'pointer' }}>Add another</span>
          </div>
        </Card>
      ) : (
        <Card shadow="sm" style={{ animation: 'lvRise .7s var(--lv-ease) .21s both', display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-6)' }}>
          <TextField id="lvp-name" label="Your name" placeholder="First and last" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField id="lvp-craft" label="What do you do?" placeholder="Automation build, integrations, front-desk ops, sales — in your words" value={craft} onChange={(e) => setCraft(e.target.value)} />
          <div>
            <div style={{ fontSize: 'var(--lv-t-md)', fontWeight: 500, marginBottom: 'var(--lv-s-3)' }}>Where would you plug in?</div>
            <div role="radiogroup" aria-label="Where would you plug in?" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 'var(--lv-s-3)' }}>
              {PLUGS.map((p) => <ChoiceChip key={p} label={p} selected={plug === p} onSelect={() => setPlug(p)} />)}
            </div>
          </div>
          <TextField id="lvp-email" label="Email" type="email" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error ? <Alert>{error}</Alert> : null}
          <div>
            <Button block onClick={submit}>Put my name down</Button>
            <div style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)', marginTop: 'var(--lv-s-4)' }}>Four fields, no pitch deck. Nothing is shared with anyone else.</div>
          </div>
        </Card>
      )}

      <div style={{ borderTop: 'var(--lv-bw) solid var(--lv-line)', marginTop: 'var(--lv-g-3)', paddingTop: 'var(--lv-g-2)' }}>
        <Eyebrow tone="quiet" wide style={{ marginBottom: 'var(--lv-s-5)' }}>WHAT THIS IS, PLAINLY</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-5)' }}>
          {[
            'Paid delivery work on builds that are already sold, not unpaid pilots.',
            'A say in how the standard builds work, while there is still time for your opinion to change them.',
            'No exclusivity, no non-compete, no quota. Keep your own clients.',
            'Honest state of play: early, few clients, terms not finalised. If that is a dealbreaker, better to know now.',
          ].map((t) => (
            <div key={t} style={{ display: 'flex', gap: 'var(--lv-s-4)', fontSize: 'var(--lv-t-md)', lineHeight: 1.55 }}>
              <span style={{ color: 'var(--lv-sec)', fontWeight: 700 }}>→</span><span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QuestionsScreen, PartnersScreen, FAQS, PLUGS });
