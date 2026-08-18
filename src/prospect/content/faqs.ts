/**
 * The nine questions owners ask first, from the design project verbatim.
 *
 * The cost answer states a shape — priced per build, agreed in writing before
 * work starts — and no number. Pricing policy is an open owner decision
 * (REQUIREMENTS.md §3); inventing a range here would settle it by accident.
 */
export interface Faq {
  q: string
  a: string
}

export const FAQS: Faq[] = [
  {
    q: 'What does it cost?',
    a: 'Priced per build, not per hour of meetings, and never open-ended. Your plan is free and shows the work in hours and days; the price for that scope is agreed on the call, in writing, before anything starts. Most first builds are a few days of work rather than a project.',
  },
  {
    q: 'Do you need to come to us?',
    a: 'No. The call, the build and the handover are all remote, wherever you are in the country. I work inside your own accounts with access you grant and can revoke, and the walkthrough happens on a screen share. There is no site visit to schedule and nothing for you to host.',
  },
  {
    q: 'We are a practice, not a trade. Does this still apply?',
    a: 'Yes, and the numbers are usually starker. Published industry figures put no-shows and late cancellations near 30% in dental, 27% in medical practices including physical therapy and chiropractic, 20% in salons and about 12% in veterinary, with a missed appointment worth roughly $200. Automated reminders with a two-way confirmation recover between a third and a half of those. Those are industry averages, not our results; your plan uses your own numbers.',
  },
  {
    q: 'How long does it take?',
    a: 'The plan takes about ninety seconds. A first build is usually one to three days of work, scheduled within a couple of weeks, and you are running on it the week it is finished.',
  },
  {
    q: 'What if I am not technical?',
    a: 'That is the normal case. I build it, then walk you through it in plain language and write it down. If a step needs your judgement, it asks you in a text or an email with a single tap to approve.',
  },
  {
    q: 'What if it breaks?',
    a: 'Two weeks of fixes after handover are included, and every flow is built to fail loudly rather than silently: if something does not go through, you get told, and nothing is quietly dropped. After that you can call me or run it yourself.',
  },
  {
    q: 'Will this replace my staff?',
    a: 'No, and I will say so if that is what you are hoping for. This takes the copying, chasing and re-typing off the people you already have so they can do the work you actually hired them for.',
  },
  {
    q: 'Why not just buy software?',
    a: 'Often you should, and I will tell you when off-the-shelf is the answer. The problem is rarely a missing tool: it is that the four tools you already pay for do not talk to each other, and you are the one carrying data between them.',
  },
  {
    q: 'Is my data safe?',
    a: 'Everything lives in your own accounts under your own logins, on well-known tools you can audit or cancel. I use the minimum access needed and hand it all back at the end. Your intake answers stay on your device until you unlock your plan.',
  },
]
