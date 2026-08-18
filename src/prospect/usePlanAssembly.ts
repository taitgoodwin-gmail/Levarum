import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../motion'

export interface PlanAssembly {
  /** How many plan rows are on screen. */
  rows: number
  /** The working line, or null when nothing is being worked on. */
  working: string | null
  /** True once the plan is whole and the rest of the page may render. */
  done: boolean
  /** Start assembling. `persisted` resolves when the submission has landed. */
  begin: (persisted: Promise<void>) => void
}

/**
 * The Game Plan assembling itself, line by line.
 *
 * This is the part of the site most able to lie, so the rule it is written to
 * is narrow: a working state is only ever shown while work is actually
 * happening, and it names the work being done rather than a more impressive
 * one.
 *
 * Two real things happen at the gate. The submission is POSTed to /api/submit,
 * which is genuinely in flight for as long as it takes; and the plan's rows
 * are derived from the answers, which is real work that happens to be fast.
 * So:
 *
 *   "Reading your answers"      — held for exactly as long as the POST is in
 *                                 flight. Not a timer. A fast network makes it
 *                                 brief, which is correct.
 *   "Sizing the biggest leaks"  — rows appearing one at a time. The pacing is
 *                                 the reader's, not the machine's, and it is
 *                                 the one place a dwell is used: a plan that
 *                                 appears whole is a plan nobody reads.
 *   "Putting them in order"     — the last row, and the fix-first pick.
 *
 * What it deliberately does not say is anything about consulting a model. The
 * drafting call runs for the operator's console, not for this screen, and
 * narrating it here would be claiming the prospect's plan came from somewhere
 * it did not.
 *
 * Under reduced motion there is no assembly at all: every row and the whole
 * plan render on the first frame, and no working state is ever shown. The
 * network still runs, it is just not performed.
 */

/** Long enough to read one row, short enough not to feel withheld. */
const ROW_DWELL_MS = 420
/** The POST cannot hold the plan hostage; past this, assemble anyway. */
const PERSIST_CEILING_MS = 2200

export function usePlanAssembly(rowCount: number): PlanAssembly {
  const reduced = prefersReducedMotion()
  const total = Math.max(1, rowCount)

  const [rows, setRows] = useState(reduced ? total : 0)
  const [working, setWorking] = useState<string | null>(null)
  const [done, setDone] = useState(reduced)
  const timers = useRef<number[]>([])

  const clear = () => {
    for (const t of timers.current) clearTimeout(t)
    timers.current = []
  }

  useEffect(() => clear, [])

  // Someone turning reduced motion on mid-assembly gets the finished plan.
  useEffect(() => {
    if (!reduced) return
    clear()
    setRows(total)
    setWorking(null)
    setDone(true)
  }, [reduced, total])

  const begin = useCallback(
    (persisted: Promise<void>) => {
      if (prefersReducedMotion()) {
        setRows(total)
        setWorking(null)
        setDone(true)
        return
      }

      clear()
      setRows(0)
      setDone(false)
      setWorking('Reading your answers')

      const assemble = () => {
        setWorking('Sizing the biggest leaks')
        for (let i = 1; i <= total; i += 1) {
          timers.current.push(
            window.setTimeout(() => {
              setRows(i)
              if (i === total) setWorking('Putting them in order')
            }, i * ROW_DWELL_MS),
          )
        }
        timers.current.push(
          window.setTimeout(
            () => {
              setWorking(null)
              setDone(true)
            },
            (total + 1) * ROW_DWELL_MS,
          ),
        )
      }

      // Whichever comes first: the submission landing, or the ceiling. The
      // ceiling exists so a stalled network cannot leave someone staring at a
      // working state with no plan behind it.
      let started = false
      const startOnce = () => {
        if (started) return
        started = true
        assemble()
      }

      void persisted.then(startOnce).catch(startOnce)
      timers.current.push(window.setTimeout(startOnce, PERSIST_CEILING_MS))
    },
    [total],
  )

  return { rows, working, done, begin }
}
