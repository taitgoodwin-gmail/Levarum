import { LEAD, H2, CARD_TITLE } from './HomeScreen';
import React from 'react';
import { SectionBand, Card, Button, Eyebrow, Chip, Meter, HoursFigure, LinkArrow, BeforeAfter } from '../ui';

const JOBS = [
  {
    rank: '01', flag: 'START HERE', title: 'Invoice automation',
    body: 'Invoices go out when the job is done and get politely chased at 7, 14 and 21 days without you touching it. Review the repeated work and measure the result before extending it.',
    beforeLabel: 'A BATHROOM FITTER TODAY',
    before: 'Job done Friday, invoice typed Sunday at the kitchen table, nobody chases it, paid six weeks later.',
    afterLabel: 'THE SAME WEEK, SET UP',
    after: 'He taps the job done on the way to the van. Invoice out that minute, reminders at one week, two and three. Sunday stays Sunday.',
    tools: ['Your existing tools'], figure: '4', percent: 100, built: 'Scope and timing agreed on the call',
  },
  {
    rank: '02', title: 'Booking and reminders',
    body: 'Customers pick a real slot, get a text before it, and no-shows are followed up automatically.',
    beforeLabel: 'A ROOFER TODAY',
    before: 'Hands full on a ridge. The call goes to voicemail and he rings the next roofer on the list.',
    afterLabel: 'THE SAME CALL, SET UP',
    after: 'The missed call texts back with his next free mornings. Thursday at nine is taken before he is off the ladder.',
    tools: ['Your existing tools'], figure: '3', percent: 75, built: 'Scope and timing agreed on the call',
  },
  {
    rank: '03', title: 'Lead follow-up flow',
    body: 'Every new enquiry gets a first reply in minutes, logged in one place, with the hot ones pushed straight to you.',
    beforeLabel: 'A HEATING FIRM TODAY',
    before: 'No hot water, form filled at nine at night, seen Tuesday. She had someone in on Monday.',
    afterLabel: 'THE SAME ENQUIRY, SET UP',
    after: 'Answered in two minutes with his prices and his first free slot. Urgent ones buzz his phone; the rest wait for morning.',
    tools: ['Your existing tools'], figure: '3', percent: 75, built: 'Scope and timing agreed on the call',
  },
  {
    rank: '04', title: 'Shared answer library',
    body: 'The twenty questions you answer every week get written once, in your words, and answered from there.',
    beforeLabel: 'A PRACTICE TODAY',
    before: 'Three people answer the same parking, pricing and paperwork questions differently, all day.',
    afterLabel: 'THE SAME WEEK, SET UP',
    after: 'One answer, in your voice, wherever the question arrives. New starters stop needing to ask.',
    tools: ['Your existing tools'], figure: '2', percent: 50, built: 'Scope and timing agreed on the call',
  },
  {
    rank: '05', title: 'Field sync between tools',
    body: 'A detail typed once appears everywhere it is needed, so you stop being the integration.',
    beforeLabel: 'MOST BUSINESSES TODAY',
    before: 'The same address gets typed into the calendar, the invoice and the job sheet, and one of them is wrong.',
    afterLabel: 'ONCE IT IS SET UP',
    after: 'Typed once. Every other tool takes it from there, and a mismatch tells you rather than sitting quietly.',
    tools: ['Your existing tools'], figure: '2', percent: 50, built: 'Scope and timing agreed on the call',
  },
];

function LeadJob({ j }) {
  return (
    <Card rank="lead" shadow="lg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'var(--lv-g-2)', alignItems: 'start', animation: 'lvRise .7s var(--lv-ease) .2s both' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lv-s-4)', marginBottom: 'var(--lv-s-4)' }}>
          <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-t-xl)', letterSpacing: 'var(--lv-track-tight)', color: 'var(--lv-sec)' }}>{j.rank}</span>
          <Eyebrow>{j.flag}</Eyebrow>
        </div>
        <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-3)', letterSpacing: 'var(--lv-track-display)', lineHeight: 1.02, marginBottom: 'var(--lv-s-4)' }}>{j.title}</div>
        <div style={{ fontSize: 'var(--lv-t-body)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', maxWidth: '520px' }}>{j.body}</div>
        <div style={{ borderTop: 'var(--lv-bw) solid var(--lv-line)', marginTop: 'var(--lv-s-6)', paddingTop: 'var(--lv-s-5)' }}>
          <BeforeAfter direction="row" beforeLabel={j.beforeLabel} before={j.before} afterLabel={j.afterLabel} after={j.after} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lv-s-2)', marginTop: 'var(--lv-s-6)' }}>
          {j.tools.map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>
      <div style={{ borderLeft: 'var(--lv-bw) solid var(--lv-line)', paddingLeft: 'var(--lv-g-2)' }}>
        <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-4)' }}>TYPICALLY GIVES BACK</Eyebrow>
        <HoursFigure value={j.figure} unit={<>hours<br />a week</>} size="xl" block style={{ marginBottom: 'var(--lv-s-5)' }} />
        <Meter value={j.percent} height="lg" />
        <div style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)', borderTop: 'var(--lv-bw) solid var(--lv-line)', marginTop: 'var(--lv-s-6)', paddingTop: 'var(--lv-s-5)' }}>{j.built}</div>
      </div>
    </Card>
  );
}

function Job({ j, delay }) {
  return (
    <Card rank="yes" shadow="sm" padding="sm" style={{ animation: `lvRise .7s var(--lv-ease) ${delay}s both`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lv-s-4)', marginBottom: 'var(--lv-s-3)' }}>
        <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-t-lg)', letterSpacing: 'var(--lv-track-tight)', color: 'var(--lv-sec)' }}>{j.rank}</span>
        <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-d-5)', letterSpacing: 'var(--lv-track-head)' }}>{j.title}</span>
      </div>
      <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 1.55, color: 'var(--lv-ink-quiet)', marginBottom: 'var(--lv-s-6)' }}>{j.body}</div>
      <div style={{ borderTop: 'var(--lv-bw) solid var(--lv-line)', paddingTop: 'var(--lv-s-5)', marginBottom: 'var(--lv-s-6)' }}>
        <BeforeAfter beforeLabel={j.beforeLabel} before={j.before} afterLabel={j.afterLabel} after={j.after} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--lv-s-5)', alignItems: 'end', marginBottom: 'var(--lv-s-5)', marginTop: 'auto' }}>
        <div>
          <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-3)' }}>GIVES BACK</Eyebrow>
          <Meter value={j.percent} quiet={j.percent === 50} />
        </div>
        <HoursFigure value={j.figure} unit="h" size="md" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lv-s-2)', marginBottom: 'var(--lv-s-5)' }}>
        {j.tools.map((t) => <Chip key={t}>{t}</Chip>)}
      </div>
      <div style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)', borderTop: 'var(--lv-bw) solid var(--lv-line)', paddingTop: 'var(--lv-s-5)' }}>{j.built}</div>
    </Card>
  );
}

function WhatWeAutomateScreen() {
  return (
    <>
      <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7) var(--lv-g-3)' }}>
        <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)', animation: 'lvRise .6s var(--lv-ease) both' }}>WHAT WE AUTOMATE</Eyebrow>
        <h1 style={{ margin: '0 0 var(--lv-s-6)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-1)', lineHeight: '.98', letterSpacing: 'var(--lv-track-hero)', maxWidth: '820px', textWrap: 'balance', animation: 'lvRise .7s var(--lv-ease) .07s both' }}>Five jobs that leak the most time.</h1>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '640px', animation: 'lvRise .7s var(--lv-ease) .14s both' }}>Nothing exotic. Each one runs on tools you can keep going yourself, gets scoped before work starts, and is handed over with the logins.</div>
      </div>

      <SectionBand rung={3} innerStyle={{ padding: 'var(--lv-g-3) var(--lv-s-7) var(--lv-g-5)', display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-6)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--lv-s-5)', flexWrap: 'wrap' }}>
          <Eyebrow>RANKED BY HOURS GIVEN BACK</Eyebrow>
          <div style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)' }}>Every bar is the same scale. Four hours a week fills it.</div>
        </div>
        <LeadJob j={JOBS[0]} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'var(--lv-s-6)' }}>
          <Job j={JOBS[1]} delay={0.26} />
          <Job j={JOBS[2]} delay={0.32} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'var(--lv-s-6)' }}>
          <Job j={JOBS[3]} delay={0.38} />
          <Job j={JOBS[4]} delay={0.44} />
        </div>
      </SectionBand>

      <SectionBand rung={1} edges="none" width="read" innerStyle={{ textAlign: 'center', maxWidth: '820px' }}>
        <h2 style={{ ...H2, fontSize: 'var(--lv-d-2)', lineHeight: 1.02, letterSpacing: '-0.035em', marginBottom: 'var(--lv-s-5)' }}>Which of these is worth doing first for you?</h2>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '560px', margin: '0 auto var(--lv-s-8)' }}>Three questions, about ninety seconds, and the plan says which one and why.</div>
        <Button href="/start" size="lg">Build my Game Plan</Button>
      </SectionBand>
    </>
  );
}



export { WhatWeAutomateScreen };
