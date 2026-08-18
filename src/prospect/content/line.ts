/**
 * "How the pieces string together" — one missed call, end to end.
 *
 * The second of the two files allowed to name tools (see automations.ts for
 * why, and scripts/check-boundary.mjs for the enforcement). What each station
 * does is stated; how it is wired is not, and the page says so out loud rather
 * than leaving the omission to be noticed.
 */
export interface Station {
  n: number
  title: string
  /** The familiar tool, where there is one. Some stations are just the world. */
  tool?: string
  detail: string
}

export const LINE: Station[] = [
  {
    n: 1,
    title: 'The call comes in',
    tool: 'your phone number',
    detail: 'Your existing number, the one on the truck. Nothing changes for the caller.',
  },
  {
    n: 2,
    title: 'Missed',
    detail: 'Four rings, no answer, because you are under a sink. Today this is where the job dies.',
  },
  {
    n: 3,
    title: 'Text back',
    tool: 'text messaging',
    detail: 'Within seconds she gets a text in your voice with your next two open slots and a link.',
  },
  {
    n: 4,
    title: 'Booked',
    tool: 'your calendar',
    detail: 'She taps a slot. It blocks your calendar and the drive time around it.',
  },
  {
    n: 5,
    title: 'Reminded',
    tool: 'text messaging',
    detail:
      'A confirmation the day before asking for a yes or a no. A no puts the slot back on the market before you have lost the morning.',
  },
  {
    n: 6,
    title: 'Invoiced',
    tool: 'QuickBooks',
    detail:
      'You mark the job done. The invoice goes out on the spot, with the right line items and the right address.',
  },
  {
    n: 7,
    title: 'Chased, then paid',
    tool: 'QuickBooks',
    detail:
      'Unpaid at one week, two and three gets a polite nudge. Paid ends the line and nothing else needs doing.',
  },
]

export const LINE_SHAPE = {
  title: 'The shape is the same',
  body:
    'A dental desk starts the same line at a booking form and ends it at a recall. A salon starts it at a walk-in. The stations move; the idea does not.',
}

export const LINE_WITHHELD = {
  title: 'What is not on this page',
  body:
    'How each station is actually wired. That is the work you are paying for, and it stays our side. What you see here is where your week comes back.',
}
