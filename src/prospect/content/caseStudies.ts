/**
 * Case studies, in the sectionai.com card format the owner asked for:
 * scannable cards, each leading with a transformation headline and one
 * concrete metric.
 *
 * The format is built. The content is not invented.
 *
 * There are no customer results yet, and REQUIREMENTS.md is explicit that
 * inventing a testimonial is the fastest way to lose someone who quotes work
 * for a living. So every card below is about *this site*, which runs on the
 * automations it sells — the honest interim proof from §5 — and every metric
 * is something a visitor can check on the page they are standing on. Nothing
 * here is a claim about a business we have not worked with.
 *
 * When a real result lands, it goes in RESULTS above these, with a named
 * business, the hours before and after, and what it cost. Until then the
 * reserved slots stay visibly empty, because an empty slot is more honest than
 * a filled one and more persuasive than pretending the question was not asked.
 */

export interface CaseStudy {
  id: string
  /** The transformation, as a headline. */
  headline: string
  /** One concrete metric, and what it measures. */
  metric: string
  metricLabel: string
  /** What changed, in the reader's terms. */
  body: string
  /** Where on this site the reader can check the claim for themselves. */
  check: string
}

/**
 * Real customer results. Empty on purpose — this is the array that fills up,
 * and the page reads differently the day it has one entry in it.
 */
export const RESULTS: CaseStudy[] = []

/** What can be shown honestly today: the site demonstrating its own product. */
export const INTERIM: CaseStudy[] = [
  {
    id: 'own-intake',
    headline: 'The plan you can get in ninety seconds is the product, not a brochure',
    metric: '3 questions',
    metricLabel: 'from cold visitor to a costed plan on screen',
    body: 'Three structured questions produce named jobs, hours back per job, and the one thing to fix first — assembled while you watch, from your answers rather than from a template. It is the same shape of automation sold on this site: a short structured intake doing work a person would otherwise do by hand.',
    check: 'Run it yourself at /start. No account, no card.',
  },
  {
    id: 'own-inbox',
    headline: 'Every request lands in one place and is worked to a conclusion',
    metric: 'One inbox',
    metricLabel: 'for customer requests and partner sign-ups alike',
    body: 'Nothing arrives in a spreadsheet or a personal inbox to be forgotten. Each request is persisted server-side the moment it is made, appears immediately in the console, and moves through new, contacted and done. That workflow is the lead follow-up automation on the list, running on the business selling it.',
    check: 'It is why a reply comes from a person rather than a sequence.',
  },
  {
    id: 'own-honesty',
    headline: 'Nothing on this site claims a result we have not produced',
    metric: 'Cited, not ours',
    metricLabel: 'every industry figure on the site, labelled as such',
    body: 'The no-show rates on the home page are published industry averages and are marked as published industry averages, every time they appear. There are no testimonials, no logo wall, and no case study written from a hypothetical. If any of that changes, it will be because a customer said something real.',
    check: 'Check any figure on /questions against its stated source.',
  },
]

export const RESERVED_NOTE =
  'Named business, the hours before and after, and what it cost. Left empty on purpose until there is one — a reserved slot is more honest than a filled one, and more persuasive than pretending nobody asked.'
