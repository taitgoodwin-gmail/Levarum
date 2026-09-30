import { LEAD, H2, CARD_TITLE } from './HomeScreen';
import React from 'react';
import { SectionBand, Card, Button, Eyebrow, Accordion, Alert, TextField, ChoiceChip, LinkArrow } from '../ui';

const FAQS = [
  { q: 'What does it cost?', a: 'Priced per build, not per hour of meetings, and never open-ended. Your plan is free and names opportunities worth exploring; the price for that scope is agreed on the call, in writing, before anything starts. Timing and support depend on the agreed scope.' },
  { q: 'Do you need to come to us?', a: 'No. The call, the build and the handover are all remote, wherever you are in the country. I work inside your own accounts with access you grant and can revoke, and the walkthrough happens on a screen share. There is no site visit to schedule and nothing for you to host.' },
  { q: 'We are a practice, not a trade. Does this still apply?', a: 'Yes. Start with the repetitive administrative work. Before a build, we review access, sensitive information and the systems you already use. The examples on this site are illustrative, not published benchmarks or measured customer results.' },
  { q: 'How long does it take?', a: 'The plan takes about ninety seconds. Timing depends on the systems and scope. We agree a schedule before work starts.' },
  { q: 'What if I am not technical?', a: 'That is the normal case. I build it, then walk you through it in plain language and write it down. If a step needs your judgement, it asks you in a text or an email with a single tap to approve.' },
  { q: 'What if it breaks?', a: 'Before work starts, we agree how failures are surfaced, who reviews them, and what support is included after handover. Those details belong in the scope, not in an assumed guarantee.' },
  { q: 'Will this replace my staff?', a: 'No, and I will say so if that is what you are hoping for. This takes the copying, chasing and re-typing off the people you already have so they can do the work you actually hired them for.' },
  { q: 'Why not just buy software?', a: 'Often you should, and I will tell you when off-the-shelf is the answer. The problem is rarely a missing tool: it is that the four tools you already pay for do not talk to each other, and you are the one carrying data between them.' },
  { q: 'Is my data safe?', a: 'Everything lives in your own accounts under your own logins, on well-known tools you can audit or cancel. I use the minimum access needed and hand it all back at the end. Your intake answers remain in this page until you submit with consent. Submitted requests are stored privately so I can follow up; see the privacy notice for details.' },
];

function QuestionsScreen() {
  return (
    <>
      <div style={{ maxWidth: 'var(--lv-w-read)', margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7) var(--lv-g-3)' }}>
        <Eyebrow wide style={{ marginBottom: 'var(--lv-s-5)', animation: 'lvRise .6s var(--lv-ease) both' }}>QUESTIONS</Eyebrow>
        <h1 style={{ margin: '0 0 var(--lv-s-5)', fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-1)', lineHeight: '.98', letterSpacing: 'var(--lv-track-hero)', textWrap: 'balance', animation: 'lvRise .7s var(--lv-ease) .07s both' }}>The things owners ask me first.</h1>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, animation: 'lvRise .7s var(--lv-ease) .14s both' }}>{FAQS.length} honest answers. If yours is not here, ask it on the call.</div>
      </div>

      <SectionBand rung={3} width="read" innerStyle={{ padding: 'var(--lv-g-3) var(--lv-s-7) var(--lv-g-5)', maxWidth: 'var(--lv-w-read)' }}>
        <Accordion items={FAQS} defaultOpen={0} style={{ animation: 'lvRise .7s var(--lv-ease) .2s both' }} />
      </SectionBand>

      <SectionBand rung={2} edges="none" width="read" innerStyle={{ textAlign: 'center', maxWidth: 'var(--lv-w-read)' }}>
        <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-2)', lineHeight: 1.03, letterSpacing: '-0.035em', marginBottom: 'var(--lv-s-5)', textWrap: 'balance' }}>Still not sure? Get the plan and decide after.</div>
        <div style={{ ...LEAD, fontSize: 'var(--lv-d-6)', lineHeight: 1.55, maxWidth: '540px', margin: '0 auto var(--lv-s-8)' }}>Three questions, about ninety seconds. It is yours whether or not we ever speak.</div>
        <Button href="/start" size="lg">Build my Game Plan</Button>
      </SectionBand>
    </>
  );
}


export { QuestionsScreen };
