/**
 * The Tuesday stories.
 *
 * Five weeks out of real service businesses, each told as what happens today
 * against what happens once it is set up, ending on the hours it hands back.
 * Copy is the design project's, unchanged: it is the page's whole argument and
 * every line of it was written to be recognised rather than admired.
 *
 * The figures are hours a week given back, on the shared bar scale.
 */
export interface UseCase {
  id: string
  /** Who this is, in their own terms. */
  who: string
  headline: string
  today: string
  automated: string
  /** What the hours are hours of. */
  metric: string
  hours: number
}

export const USE_CASES: UseCase[] = [
  {
    id: 'missed-call',
    who: 'Roofer · two vans',
    headline: 'The call you cannot take',
    today:
      'You are on a ridge with both hands full. The phone rings in your pocket, goes to voicemail, and by the time your boots are on the ground he has rung the next roofer on the list.',
    automated:
      'The missed call texts him back on its own — sorry, up a ladder, here are my next free mornings, pick one. He picks Thursday at nine. It is on your calendar before you are down.',
    metric: 'Booking and reminders',
    hours: 3,
  },
  {
    id: 'invoice',
    who: 'Bathroom fitter · on his own',
    headline: 'Finished Friday, paid in June',
    today:
      'The job finishes Friday. The invoice gets typed Sunday night at the kitchen table, if it gets typed at all. Nobody chases it, so it sits there for six weeks and you feel rude asking.',
    automated:
      'You tap the job done on your phone on the way to the van. The invoice goes out that minute, and the polite reminders at one week, two and three go out whether or not you remember. Sunday is Sunday again.',
    metric: 'Invoices out and chased',
    hours: 4,
  },
  {
    id: 'enquiry',
    who: 'Plumbing and heating · four vans',
    headline: 'The nine o’clock enquiry',
    today:
      'A woman with no hot water fills in your form at nine at night. You see it Tuesday, parked outside a job, and she has had someone in since Monday morning.',
    automated:
      'She gets a proper answer two minutes later, in your words and your prices, with your first free slot in it. No hot water is urgent, so your phone buzzes too — the small stuff waits until morning.',
    metric: 'Enquiries answered',
    hours: 3,
  },
  {
    id: 'no-show',
    who: 'Dental front desk · two chairs',
    headline: 'The gap nobody filled',
    today:
      'About 3 in 10 appointments no-show or cancel too late to fill. The desk finds out at five past nine and starts calling down the list while a chair sits empty. Physical therapy and chiropractic run the same pattern, a little under 3 in 10.',
    automated:
      'A text goes out two days ahead and again the day before, asking for a yes or a no. A no frees the slot immediately and the waitlist is offered it before anyone picks up a phone.',
    metric: 'Front desk time back',
    hours: 3,
  },
  {
    id: 'empty-chair',
    who: 'Salon or barber · three chairs',
    headline: 'An empty chair at four o’clock',
    today:
      'About 1 in 5 booked appointments does not show. An empty chair is an hour you cannot sell twice, and the rebook only happens when someone remembers to ask at the counter.',
    automated:
      'A confirmation text the day before, the open slot offered to whoever asked to be told, and a rebook nudge at the interval that suits the service.',
    metric: 'Chair time recovered',
    hours: 2,
  },
]

/**
 * Published industry figures. Cited, never presented as our results — the
 * labelling is part of the content, not decoration on it.
 */
export interface CitedFigure {
  figure: string
  note: string
}

export const NO_SHOW_FIGURES: CitedFigure[] = [
  {
    figure: '30%',
    note: 'of dental appointments no-show or cancel late where reminders are not automated',
  },
  { figure: '27%', note: 'in medical practices — physical therapy and chiropractic among them' },
  { figure: '20%', note: 'in salons and barbershops; about 12% in veterinary practices' },
  { figure: '$200', note: 'the rough value of one missed appointment' },
]

export const NO_SHOW_CAVEAT =
  'Automated text reminders with a two-way confirmation recover somewhere between a third and a half of those. These are published industry averages, not our results — your own numbers will be different, and your plan uses yours.'
