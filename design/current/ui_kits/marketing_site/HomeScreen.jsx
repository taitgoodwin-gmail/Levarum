const { SectionBand, Card, Button, Eyebrow, Pill, Chip, Meter, HoursFigure, LinkArrow, SelectField, BeforeAfter, FixFirstCard, OpportunityRow } = window.LevarumDesignSystem_13e0fb;

const BUSINESS_TYPES = ['Trades & home services', 'Medical, dental or vet practice', 'Salon, barber or studio', 'Agency or consultancy', 'Online shop', 'Restaurant, cafe or bar', 'Property management', 'Something else'];

const WEEKS = [
  {
    who: 'ROOFER · TWO VANS', title: 'The call you cannot take',
    beforeLabel: 'TODAY',
    before: 'You are on a ridge with both hands full. The phone rings in your pocket, goes to voicemail, and by the time your boots are on the ground he has rung the next roofer on the list.',
    after: 'The missed call texts him back on its own — sorry, up a ladder, here are my next free mornings, pick one. He picks Thursday at nine. It is on your calendar before you are down.',
    meterLabel: 'BOOKING AND REMINDERS', figure: '3', percent: 75,
  },
  {
    who: 'BATHROOM FITTER · ON HIS OWN', title: 'Finished Friday, paid in June',
    beforeLabel: 'TODAY',
    before: 'The job finishes Friday. The invoice gets typed Sunday night at the kitchen table, if it gets typed at all. Nobody chases it, so it sits there for six weeks and you feel rude asking.',
    after: 'You tap the job done on your phone on the way to the van. The invoice goes out that minute, and the polite reminders at one week, two and three go out whether or not you remember. Sunday is Sunday again.',
    meterLabel: 'INVOICES OUT AND CHASED', figure: '4', percent: 100,
  },
  {
    who: 'PLUMBING AND HEATING · FOUR VANS', title: 'The nine o’clock enquiry',
    beforeLabel: 'TODAY',
    before: 'A woman with no hot water fills in your form at nine at night. You see it Tuesday, parked outside a job, and she has had someone in since Monday morning.',
    after: 'She gets a proper answer two minutes later, in your words and your prices, with your first free slot in it. No hot water is urgent, so your phone buzzes too — the small stuff waits until morning.',
    meterLabel: 'ENQUIRIES ANSWERED', figure: '3', percent: 75,
  },
  {
    who: 'DENTAL FRONT DESK · TWO CHAIRS', title: 'The gap nobody filled',
    beforeLabel: 'TODAY',
    before: 'About 3 in 10 appointments no-show or cancel too late to fill. The desk finds out at five past nine and starts calling down the list while a chair sits empty.',
    after: 'A text goes out two days ahead and again the day before, asking for a yes or a no. A no frees the slot immediately and the waitlist is offered it before anyone picks up a phone.',
    meterLabel: 'FRONT DESK TIME BACK', figure: '3', percent: 75,
  },
  {
    who: 'SALON OR BARBER · THREE CHAIRS', title: 'An empty chair at four o’clock',
    beforeLabel: 'TODAY',
    before: 'About 1 in 5 booked appointments does not show. An empty chair is an hour you cannot sell twice, and the rebook only happens when someone remembers to ask at the counter.',
    after: 'A confirmation text the day before, the open slot offered to whoever asked to be told, and a rebook nudge at the interval that suits the service.',
    meterLabel: 'CHAIR TIME RECOVERED', figure: '2', percent: 50,
  },
];

const FIGURES = [
  ['30%', 'of dental appointments no-show or cancel late where reminders are not automated'],
  ['27%', 'in medical practices — physical therapy and chiropractic among them'],
  ['20%', 'in salons and barbershops; about 12% in veterinary practices'],
  ['$200', 'the rough value of one missed appointment'],
];

const PROBLEMS = [
  ['The evening shift', 'The real work happens after hours, because the day went to quotes, chasing and copying details between tools.'],
  ['Everything in your head', 'Nothing can be handed to anyone else, so growth means more of your hours and nothing else.'],
  ['Twelve tabs, no joins', 'You bought the tools. They do not talk to each other, so you are the integration.'],
];

const H2 = { margin: 0, fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-3)', lineHeight: 'var(--lv-lead-head)', letterSpacing: '-0.03em', textWrap: 'balance' };
const LEAD = { fontSize: 'var(--lv-d-7)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)', textWrap: 'pretty' };
const CARD_TITLE = { fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-d-5)', letterSpacing: 'var(--lv-track-head)', lineHeight: 1.15 };

function HomeHero() {
  const [business, setBusiness] = React.useState(BUSINESS_TYPES[0]);
  return (
    <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(380px,100%),1fr))', gap: 'var(--lv-g-4)', alignItems: 'start' }}>
      <div>
        <Pill dot style={{ marginBottom: 'var(--lv-s-7)', animation: 'lvRise .6s var(--lv-ease) both' }}>OWNER-RUN BUSINESSES · ANYWHERE IN THE US</Pill>
        <h1 style={{ margin: '0 0 var(--lv-s-6)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-hero)', lineHeight: 'var(--lv-lead-hero)', letterSpacing: 'var(--lv-track-hero)', textWrap: 'balance', animation: 'lvRise .7s var(--lv-ease) .07s both' }}>Get your week back.</h1>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '540px', marginBottom: 'var(--lv-s-8)', animation: 'lvRise .7s var(--lv-ease) .14s both' }}>Answer three questions about your business and I will show you which jobs are worth handing off first, and roughly how many hours a week that gives you back. Plain language, no jargon. Everything is remote — the call, the build and the handover — wherever you are in the country.</div>
        <Card shadow="sm" padding="lg" style={{ maxWidth: 'var(--lv-w-narrow)', animation: 'lvRise .7s var(--lv-ease) .21s both' }}>
          <SelectField id="lv-home-biz" label="What kind of business is this?" value={business} onChange={(e) => setBusiness(e.target.value)} options={BUSINESS_TYPES} style={{ marginBottom: 'var(--lv-s-4)' }} />
          <Button block href="../intake/index.html">Build my Game Plan</Button>
          <div style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)', textAlign: 'center', marginTop: 'var(--lv-s-3)' }}>About 90 seconds. No account, no card.</div>
        </Card>
      </div>
      <Card shadow="lg" padding="lg" style={{ animation: 'lvRise .8s var(--lv-ease) .3s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lv-s-4)', marginBottom: 'var(--lv-s-5)' }}>
          <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-sm)', letterSpacing: 'var(--lv-track-tight)' }}>A plan looks like this</span>
          <Eyebrow>EXAMPLE</Eyebrow>
        </div>
        <div style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-2)' }}>Hand off first</div>
        <HoursFigure value="9" unit={<>hours a week,<br />across three jobs</>} size="lg" block style={{ marginBottom: 'var(--lv-s-6)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)', marginBottom: 'var(--lv-s-5)' }}>
          <OpportunityRow title="Get invoices out and followed up without you" figure="4" percent={100} style={{ borderRadius: 'var(--lv-r-control)' }} />
          <OpportunityRow title="Hand off booking and reminders" figure="3" percent={75} style={{ borderRadius: 'var(--lv-r-control)' }} />
          <OpportunityRow title="Stop re-answering the same questions" figure="2" percent={50} quiet style={{ borderRadius: 'var(--lv-r-control)' }} />
        </div>
        <FixFirstCard tone="tinted" title="Invoice automation" why="It pays for itself first and nothing else depends on it." style={{ borderRadius: 'var(--lv-r-control)', padding: 'var(--lv-s-5)' }} />
      </Card>
    </div>
  );
}

function HomeScreen() {
  return (
    <>
      <HomeHero />

      <SectionBand rung="dark" edges="none">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'var(--lv-g-4)', alignItems: 'end' }}>
          <h2 style={H2}>You did not start this to do admin.</h2>
          <div style={{ ...LEAD, color: 'var(--lv-dark-quiet)' }}>Most owner-run businesses lose ten to twenty hours a week to work no customer ever sees. It rarely feels like a problem worth solving, because nobody has ever laid it out plainly. That is the whole job here.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--lv-s-6)', marginTop: 'var(--lv-g-4)' }}>
          {PROBLEMS.map(([t, b]) => (
            <Card key={t} variant="dark" padding="lg">
              <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-lg)', letterSpacing: 'var(--lv-track-tight)', marginBottom: 'var(--lv-s-2)' }}>{t}</div>
              <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-dark-quiet)' }}>{b}</div>
            </Card>
          ))}
        </div>
      </SectionBand>

      <SectionBand rung={1} edges="none">
        <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)' }}>WHAT IT LOOKS LIKE ON A TUESDAY</Eyebrow>
        <h2 style={{ ...H2, maxWidth: '760px', marginBottom: 'var(--lv-s-5)' }}>None of it is clever. It just happens without you.</h2>
        <div style={{ ...LEAD, maxWidth: '640px', marginBottom: 'var(--lv-g-2)' }}>Five weeks out of real service businesses. What happens today on the left, what happens once it is set up on the right, and the hours it hands back.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'var(--lv-s-6)' }}>
          {WEEKS.map((w) => (
            <Card key={w.title} shadow="sm" padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-5)' }}>
              <Eyebrow>{w.who}</Eyebrow>
              <div style={CARD_TITLE}>{w.title}</div>
              <BeforeAfter beforeLabel={w.beforeLabel} before={w.before} afterLabel="ONCE IT IS SET UP" after={w.after} />
              <div style={{ marginTop: 'auto', borderTop: 'var(--lv-bw) solid var(--lv-line)', paddingTop: 'var(--lv-s-5)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--lv-s-5)', alignItems: 'center' }}>
                <div>
                  <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-3)' }}>{w.meterLabel}</Eyebrow>
                  <Meter value={w.percent} quiet={w.percent === 50} />
                </div>
                <HoursFigure value={w.figure} unit="h" size="md" />
              </div>
            </Card>
          ))}
        </div>

        <Card variant="outlined" padding="sm" style={{ background: 'var(--lv-rung-4)', marginTop: 'var(--lv-s-6)' }}>
          <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-5)' }}>WHY THE PHONE MATTERS · PUBLISHED INDUSTRY FIGURES, NOT OUR RESULTS</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: 'var(--lv-s-6)' }}>
            {FIGURES.map(([n, t]) => (
              <div key={n}>
                <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-3)', letterSpacing: 'var(--lv-track-display)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 1.5, color: 'var(--lv-ink-quiet)', marginTop: 'var(--lv-s-2)' }}>{t}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: 'var(--lv-bw) solid var(--lv-line)', marginTop: 'var(--lv-s-6)', paddingTop: 'var(--lv-s-5)', fontSize: 'var(--lv-t-sm)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)' }}>Automated text reminders with a two-way confirmation recover somewhere between a third and a half of those. These are published industry averages, not our results — your own numbers will be different, and your plan uses yours.</div>
        </Card>

        <div style={{ marginTop: 'var(--lv-s-8)', display: 'flex', alignItems: 'center', gap: 'var(--lv-s-5)', flexWrap: 'wrap' }}>
          <LinkArrow href="#what" size="lg">All five jobs, with a week from each</LinkArrow>
          <span style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)' }}>Bars are the same scale everywhere on the site. Four hours a week fills one.</span>
        </div>
      </SectionBand>

      <SectionBand rung={3}>
        <Eyebrow style={{ marginBottom: 'var(--lv-s-5)' }}>PROOF, HONESTLY</Eyebrow>
        <h2 style={{ ...H2, maxWidth: '760px', marginBottom: 'var(--lv-s-5)' }}>No customer stories yet. Here is what you can check instead.</h2>
        <div style={{ ...LEAD, maxWidth: '640px', marginBottom: 'var(--lv-g-2)' }}>Early days, and inventing a testimonial would be the fastest way to lose someone who quotes work for a living.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'var(--lv-s-6)' }}>
          <Card rank="yes" padding="sm">
            <div style={{ ...CARD_TITLE, fontSize: 'var(--lv-t-lg)', marginBottom: 'var(--lv-s-3)' }}>This site runs on the product</div>
            <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)' }}>The booking line you are about to use is the same automation sold on this page. So is the plan that comes back, and the reminder before the call. If any of it fails you, you have learned something true about us before you have paid anything.</div>
          </Card>
          <Card rank="yes" padding="sm">
            <div style={{ ...CARD_TITLE, fontSize: 'var(--lv-t-lg)', marginBottom: 'var(--lv-s-3)' }}>The numbers above are cited, not ours</div>
            <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)' }}>Industry no-show rates are published figures and labelled as such. Nothing on this site claims a result we have not produced.</div>
          </Card>
          <Card variant="reserved" padding="sm">
            <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-3)' }}>RESERVED</Eyebrow>
            <div style={{ ...CARD_TITLE, fontSize: 'var(--lv-t-lg)', marginBottom: 'var(--lv-s-3)' }}>First client results go here</div>
            <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)' }}>Named business, the hours before and after, and what it cost. Left empty on purpose until there is one.</div>
          </Card>
        </div>
      </SectionBand>

      <SectionBand rung={2}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 'var(--lv-s-6)' }}>
          {[
            ['HOW IT WORKS', 'Three questions, a plan, one short call', 'What I ask, what you get back, and what happens on the fifteen minutes afterwards.', 'Read the process', '#how'],
            ['WHAT WE AUTOMATE', 'Five jobs that leak the most time', 'Invoicing, booking, lead follow-up, repeat questions and copying between tools.', 'See the five', '#what'],
            ['QUESTIONS', 'Cost, time, safety, staff', 'The seven things owners ask me before they start, answered plainly.', 'Read the answers', '#questions'],
          ].map(([eb, title, body, cta, href]) => (
            <Card key={eb} href={href} padding="lg">
              <Eyebrow wide style={{ marginBottom: 'var(--lv-s-4)' }}>{eb}</Eyebrow>
              <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-xl)', letterSpacing: 'var(--lv-track-head)', marginBottom: 'var(--lv-s-3)' }}>{title}</div>
              <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-5)' }}>{body}</div>
              <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 600, fontSize: 'var(--lv-t-md)', color: 'var(--lv-link)' }}>{cta} →</div>
            </Card>
          ))}
        </div>
      </SectionBand>

      <SectionBand rung={4} edges="none" width="read" innerStyle={{ textAlign: 'center', maxWidth: '820px' }}>
        <h2 style={{ ...H2, fontSize: 'var(--lv-d-2)', lineHeight: 1.02, letterSpacing: '-0.035em', marginBottom: 'var(--lv-s-5)' }}>Find out what you should stop doing yourself.</h2>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '560px', margin: '0 auto var(--lv-s-8)' }}>Three questions, about ninety seconds. The plan is yours whether or not we ever speak.</div>
        <Button href="../intake/index.html" size="lg">Build my Game Plan</Button>
        <div style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)', marginTop: 'var(--lv-s-5)' }}>Your answers stay on your device until you unlock the plan.</div>
      </SectionBand>
    </>
  );
}

Object.assign(window, { HomeScreen, BUSINESS_TYPES, WEEKS, H2, LEAD, CARD_TITLE });
