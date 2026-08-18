import type { Draft, Pain, PainId, StackItem } from './types.ts'
import { painsOrDefault } from './pains.ts'
import { defaultStackItem, optionFor } from './catalog.ts'

/** Weeks in a month, and the day rate the operator's sizing is built from. */
export const WEEKS_PER_MONTH = 4.3
export const WEEKS_PER_YEAR = 52
export const DAY_RATE = 1200

/** Round to a visible step so a slider never produces false precision. */
export function money(n: number, step: number): string {
  const rounded = Math.round(n / step) * step
  return '$' + rounded.toLocaleString('en-US')
}

export interface HoursBack {
  lo: number
  hi: number
}

export function hoursBack(pains: Pain[]): HoursBack {
  return {
    lo: pains.reduce((a, p) => a + p.lo, 0),
    hi: pains.reduce((a, p) => a + p.hi, 0),
  }
}

export function hoursLabel(h: HoursBack): string {
  return `${h.lo} to ${h.hi} hours`
}

/** Hours x rate x 4.3, as a rounded range. An estimate, never a quote. */
export function monthlyRange(h: HoursBack, rate: number): string {
  return (
    money(h.lo * rate * WEEKS_PER_MONTH, 50) + ' to ' + money(h.hi * rate * WEEKS_PER_MONTH, 50)
  )
}

/** Hours x rate x 52, as a rounded range. */
export function annualRange(h: HoursBack, rate: number): string {
  return money(h.lo * rate * WEEKS_PER_YEAR, 100) + ' to ' + money(h.hi * rate * WEEKS_PER_YEAR, 100)
}

/** The biggest block of hours: what to fix first. */
export function fixFirst(pains: Pain[]): Pain | null {
  if (!pains.length) return null
  return pains.reduce((best, p) => (p.hi > best.hi ? p : best), pains[0])
}

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five']

/** "I found three places..." reads better than "I found 3 places...". */
export function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n)
}

export interface StackTotals {
  daysLo: number
  daysHi: number
  costLo: number
  costHi: number
  effortLabel: string
  toolingLabel: string
  buildRange: string
}

/** Roll the chosen workflows up into effort, tooling cost, and a build range. */
export function stackTotals(stack: StackItem[]): StackTotals {
  let daysLo = 0
  let daysHi = 0
  let costLo = 0
  let costHi = 0
  for (const item of stack) {
    const opt = optionFor(item)
    daysLo += opt.dLo
    daysHi += opt.dHi
    costLo += opt.cLo
    costHi += opt.cHi
  }
  return {
    daysLo,
    daysHi,
    costLo,
    costHi,
    effortLabel: daysLo === daysHi ? `${daysLo} days` : `${daysLo} to ${daysHi} days`,
    toolingLabel: `$${costLo} to $${costHi} / mo`,
    buildRange: money(daysLo * DAY_RATE, 500) + ' to ' + money(daysHi * DAY_RATE, 500),
  }
}

function fallbackSummary(pains: Pain[]): string {
  const first = pains[0].block.toLowerCase()
  return (
    `Lead with the ${first} so the most repetitive work stops landing on the owner. ` +
    'Sequence the rest so each piece earns the next, and keep every step reversible.'
  )
}

function fallbackPhases(pains: Pain[]) {
  return pains.slice(0, 3).map((p, i) => ({
    n: i + 1,
    title: p.block,
    detail: p.opp.toLowerCase() + '.',
  }))
}

/**
 * The deterministic skeleton built straight from the intake. Everything here
 * is derived, not generated, so the console is never empty and never waits on
 * a network call to be useful.
 */
export function baseDraft(painIds: PainId[]): Draft {
  const pains = painsOrDefault(painIds)
  const hours = hoursBack(pains)
  const stack = pains.map((p) => defaultStackItem(p.id))
  return {
    hoursLo: hours.lo,
    hoursHi: hours.hi,
    blocks: pains.map((p) => p.block),
    measure: pains.slice(0, 3).map((p) => p.measure),
    discovery: pains.slice(0, 3).map((p) => p.discovery),
    watchouts: pains.slice(0, 2).map((p) => p.watchout),
    summary: fallbackSummary(pains),
    phases: fallbackPhases(pains),
    stack,
    status: 'pending',
    source: null,
  }
}

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} ${m === 1 ? 'min' : 'mins'} ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} ${h === 1 ? 'hr' : 'hrs'} ago`
  const d = Math.floor(h / 24)
  return `${d} ${d === 1 ? 'day' : 'days'} ago`
}

export function looksLikeEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value.trim())
}
