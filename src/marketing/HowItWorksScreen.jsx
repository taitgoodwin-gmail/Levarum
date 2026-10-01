import { LEAD, H2, CARD_TITLE } from './HomeScreen';
import React from 'react';
import { SectionBand, Card, Button, Eyebrow, Chip, Meter, HoursFigure, LinkArrow, BeforeAfter, TimelineStep, StepNumber } from '../ui';

const STEPS = [
  {
    n: 1, when: 'About 90 seconds', title: 'Tell me the shape of your week',
    body: 'What kind of business you run, roughly how many hours go to back-office work, and which jobs eat the most of them. Three questions, no account, no card.',
    asideLabel: 'WHAT I ASK',
    aside: ['What kind of business is this?', 'How many hours a week go to back-office work?', 'Which of these sound like you?'],
    rung: 'surface',
  },
  {
    n: 2, when: 'Straight away, on screen', title: 'Read your Game Plan',
    body: 'Named jobs worth handing off, questions to check before estimating time saved, and a way to choose a small starting point. Written for you, not for a developer.',
    asideLabel: 'WHAT YOU GET',
    aside: ['The handful of jobs worth handing off first', 'The details to check for each job', 'A starting point to discuss on a call'],
    rung: 'tint',
  },
  {
    n: 3, when: 'Fifteen minutes, if you want it', title: 'A short call, no pitch',
    body: 'We walk the plan together and decide whether it is worth building at all. If it is not, I will say so, and you keep the plan either way.',
    asideLabel: 'THEN, IF YOU GO AHEAD',
    aside: ['Scope and price agreed before work starts', 'Built to an agreed scope, in your own accounts', 'Handover and support agreed before work starts'],
    rung: 'surface',
  },
];

const LINE = [
  ['The call comes in', 'your phone number', 'Your existing number, the one on the truck. Nothing changes for the caller.'],
  ['Missed', null, 'Four rings, no answer, because you are under a sink. Today this is where the job dies.'],
  ['Text back', 'text messaging', 'Within seconds she gets a text in your voice with your next two open slots and a link.'],
  ['Booked', 'your calendar', 'She taps a slot. It blocks your calendar and the drive time around it.'],
];

const LINE_2 = [
  ['Reminder', 'text messaging', 'The day before, a text asking for a yes or a no. A no frees the slot immediately.'],
  ['Job done', 'your phone', 'You tap it done on the way to the van. Nothing to type up later.'],
  ['Invoice out and chased', 'your accounting tool', 'Out that minute, then politely chased at 7, 14 and 21 days without you.'],
];

function HowItWorksScreen() {
  return (
    <>
      <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7) var(--lv-g-3)' }}>
        <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)', animation: 'lvRise .6s var(--lv-ease) both' }}>HOW IT WORKS</Eyebrow>
        <h1 style={{ margin: '0 0 var(--lv-s-6)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-1)', lineHeight: '.98', letterSpacing: 'var(--lv-track-hero)', maxWidth: '780px', textWrap: 'balance', animation: 'lvRise .7s var(--lv-ease) .07s both' }}>Three questions, a plan, one short call.</h1>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '620px', animation: 'lvRise .7s var(--lv-ease) .14s both' }}>No discovery workshop, no proposal document, no six-week engagement before anything useful exists.</div>
      </div>

      <SectionBand rung={2} innerStyle={{ padding: 'var(--lv-g-3) var(--lv-s-7) var(--lv-g-5)', display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-5)' }}>
        {STEPS.map((s, i) => (
          <Card key={s.n} style={{ background: s.rung === 'tint' ? 'var(--lv-rung-4)' : 'var(--lv-surface)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'var(--lv-g-3)', animation: `lvRise .7s var(--lv-ease) ${0.2 + i * 0.08}s both` }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lv-s-4)', marginBottom: 'var(--lv-s-5)' }}>
                <StepNumber n={s.n} />
                <span style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)' }}>{s.when}</span>
              </div>
              <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-d-4)', letterSpacing: 'var(--lv-track-head)', lineHeight: 1.12, marginBottom: 'var(--lv-s-4)' }}>{s.title}</div>
              <div style={{ fontSize: 'var(--lv-t-body)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', textWrap: 'pretty' }}>{s.body}</div>
            </div>
            <div style={{ borderLeft: 'var(--lv-bw) solid var(--lv-sec)', paddingLeft: 'var(--lv-g-2)', display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)', justifyContent: 'center' }}>
              <Eyebrow>{s.asideLabel}</Eyebrow>
              {s.aside.map((a) => <div key={a} style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.5 }}>{a}</div>)}
            </div>
          </Card>
        ))}
      </SectionBand>

      <SectionBand rung={3}>
        <Eyebrow style={{ marginBottom: 'var(--lv-s-5)' }}>HOW THE PIECES STRING TOGETHER</Eyebrow>
        <h2 style={{ ...H2, maxWidth: '780px', marginBottom: 'var(--lv-s-5)' }}>One missed call, end to end.</h2>
        <div style={{ ...LEAD, maxWidth: '660px', marginBottom: 'var(--lv-g-2)' }}>Seven stations on one line, using tools you already pay for. Nothing here needs you at a keyboard.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(420px,100%),1fr))', gap: 'var(--lv-g-2)' }}>
          {[LINE, LINE_2].map((set, si) => (
            <Card key={si} shadow="sm">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {set.map(([title, tool, body], i) => (
                  <TimelineStep key={title} n={si === 0 ? i + 1 : i + 5} title={title} tool={tool} last={i === set.length - 1}>{body}</TimelineStep>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </SectionBand>

      <SectionBand rung={1} edges="none">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'var(--lv-s-6)', alignItems: 'start' }}>
          <div>
            <Eyebrow style={{ marginBottom: 'var(--lv-s-5)' }}>WHAT CHANGES ON THE FLOOR</Eyebrow>
            <h2 style={{ ...H2, fontSize: 'var(--lv-d-4)', marginBottom: 'var(--lv-s-5)' }}>The same Tuesday, twice.</h2>
            <BeforeAfter
              beforeLabel="TODAY"
              before="You are the integration. Details get copied between four tools by hand, and the evening is when the paperwork happens."
              afterLabel="ONCE IT IS SET UP"
              after="The tools hand things to each other. You approve the things that need judgement with a single tap, in a text." />
          </div>
          <Card variant="outlined" padding="lg">
            <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-4)' }}>WHAT YOU KEEP</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-4)' }}>
              {['Your own accounts, your own logins — access you grant and can revoke.', 'Tools you can audit or cancel without calling me.', 'An agreed support period after handover, and flows built to report failures clearly.'].map((t) => (
                <div key={t} style={{ display: 'flex', gap: 'var(--lv-s-4)', fontSize: 'var(--lv-t-md)', lineHeight: 1.55 }}>
                  <span style={{ color: 'var(--lv-sec)', fontWeight: 700 }}>→</span><span>{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{ marginTop: 'var(--lv-s-8)', display: 'flex', gap: 'var(--lv-s-5)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button href="/start">Build my Game Plan</Button>
          <LinkArrow href="/what-we-automate" size="lg">See the five jobs</LinkArrow>
        </div>
      </SectionBand>
    </>
  );
}



export { HowItWorksScreen };
