import { ROUTES } from '../../router'

/** The primary nav, in visit order. The console is not in it and never will be. */
export const NAV = [
  { to: ROUTES.howItWorks, label: 'How it works' },
  { to: ROUTES.whatWeAutomate, label: 'What we automate' },
  { to: ROUTES.questions, label: 'Questions' },
]

export const CONTACT_EMAIL = 'hello@levarum.co'

/**
 * No phone number anywhere, on purpose.
 *
 * REQUIREMENTS.md §3 has this as an open owner decision, and flags that for a
 * trades audience its absence is disqualifying. It needs a real number, which
 * is the owner's to provide — inventing one here would be worse than the gap,
 * because it would look answered.
 */
export const PHONE = null

export const TAGLINE = 'Back-office automation for owner-run businesses.'

export const REMOTE_NOTE = 'Remote delivery, nationwide.'

/**
 * The honest interim proof, standing in for social proof until there is any.
 * The reserved slot stays visibly empty rather than being filled with a
 * plausible-sounding first customer.
 */
export const PROOF = {
  eyebrow: 'Proof, honestly',
  headline: 'No customer stories yet. Here is what you can check instead.',
  lead: 'Early days, and inventing a testimonial would be the fastest way to lose someone who quotes work for a living.',
  cards: [
    {
      title: 'This site runs on the product',
      body: 'The booking line you are about to use is the same automation sold on this page. So is the plan that comes back, and the reminder before the call. If any of it fails you, you have learned something true about us before you have paid anything.',
    },
    {
      title: 'The numbers above are cited, not ours',
      body: 'Industry no-show rates are published figures and labelled as such. Nothing on this site claims a result we have not produced.',
    },
  ],
  reserved: {
    eyebrow: 'Reserved',
    title: 'First client results go here',
    body: 'Named business, the hours before and after, and what it cost. Left empty on purpose until there is one.',
  },
}
