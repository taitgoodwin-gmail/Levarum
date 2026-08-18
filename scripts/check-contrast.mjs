#!/usr/bin/env node
/**
 * WCAG AA, in both themes, enforced.
 *
 * The design project scored every contrast pair by hand once. That score is
 * worth nothing six months from now, when someone nudges --lv-rung-3 to get a
 * section to sit better and silently drops the quiet ink on it below 4.5:1.
 * This resolves the token graph the same way the browser does — var() lookups
 * and color-mix(in srgb, A p%, B) — for :root and for [data-theme="dark"], and
 * fails the build if any declared pair misses its target.
 *
 * Run: npm run check:contrast
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8')

// --- token parsing -------------------------------------------------------

/** Pull the declarations out of one top-level block, comments stripped. */
function block(selector) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`, 'g')
  const out = {}
  for (const match of clean.matchAll(re)) {
    for (const line of match[1].split(';')) {
      const at = line.indexOf(':')
      if (at === -1) continue
      const name = line.slice(0, at).trim()
      if (!name.startsWith('--')) continue
      out[name] = line.slice(at + 1).trim()
    }
  }
  return out
}

const LIGHT = block(':root')
const DARK = { ...LIGHT, ...block('\\[data-theme=.dark.\\]') }

// --- colour maths --------------------------------------------------------

function parseHex(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

/**
 * Resolve a token value to an [r,g,b] triple. Handles the two forms the token
 * file actually uses: a var() reference, and an srgb color-mix of two colours
 * with one stated percentage.
 */
function resolve(value, tokens, seen = new Set()) {
  const v = String(value).trim()

  if (v.startsWith('#')) return parseHex(v)

  const varMatch = /^var\(\s*(--[\w-]+)\s*\)$/.exec(v)
  if (varMatch) {
    const name = varMatch[1]
    if (seen.has(name)) throw new Error(`token cycle at ${name}`)
    if (!(name in tokens)) throw new Error(`undefined token ${name}`)
    return resolve(tokens[name], tokens, new Set([...seen, name]))
  }

  const mix = /^color-mix\(\s*in srgb\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s*\)$/.exec(v)
  if (mix) {
    const a = resolve(mix[1], tokens, seen)
    const p = Number(mix[2]) / 100
    const b = resolve(mix[3], tokens, seen)
    // color-mix(in srgb, ...) interpolates in gamma-encoded sRGB, which is a
    // straight per-channel lerp of the 0-255 values.
    return [0, 1, 2].map((i) => a[i] * p + b[i] * (1 - p))
  }

  throw new Error(`cannot resolve colour: ${v}`)
}

function luminance([r, g, b]) {
  const lin = [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contrast(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

// --- the pairs that have to hold -----------------------------------------

/**
 * `min` is the target for that pair: 4.5 for body copy, 3 for large display
 * text (>=24px, or >=19px bold — which is what every button and figure on this
 * site is) and for non-text boundaries like the focus ring and meter fill.
 */
const PAIRS = [
  // Body copy on every rung of the tint ladder.
  ['--lv-ink', '--lv-page', 4.5, 'body ink on page'],
  ['--lv-ink', '--lv-rung-2', 4.5, 'body ink on rung 2'],
  ['--lv-ink', '--lv-rung-3', 4.5, 'body ink on rung 3'],
  ['--lv-ink', '--lv-rung-4', 4.5, 'body ink on rung 4'],
  ['--lv-ink', '--lv-surface', 4.5, 'body ink on card'],
  ['--lv-ink', '--lv-band', 4.5, 'body ink on band'],
  ['--lv-ink-quiet', '--lv-page', 4.5, 'quiet ink on page'],
  ['--lv-ink-quiet', '--lv-rung-2', 4.5, 'quiet ink on rung 2'],
  ['--lv-ink-quiet', '--lv-rung-3', 4.5, 'quiet ink on rung 3'],
  ['--lv-ink-quiet', '--lv-rung-4', 4.5, 'quiet ink on rung 4'],
  ['--lv-ink-quiet', '--lv-surface', 4.5, 'quiet ink on card'],
  ['--lv-ink-placeholder', '--lv-surface', 4.5, 'placeholder on field'],

  // Petrol carries links, eyebrows and markers, at body size.
  ['--lv-sec', '--lv-page', 4.5, 'petrol link on page'],
  ['--lv-sec', '--lv-rung-2', 4.5, 'petrol link on rung 2'],
  ['--lv-sec', '--lv-rung-3', 4.5, 'petrol link on rung 3'],
  ['--lv-sec', '--lv-rung-4', 4.5, 'petrol link on rung 4'],
  ['--lv-sec', '--lv-surface', 4.5, 'petrol link on card'],
  ['--lv-sec', '--lv-sec-tint', 3, 'petrol on its own chip tint'],

  // Rust: button label, and the ring / active-nav rule as non-text.
  ['--lv-surface', '--lv-accent', 4.5, 'button label on rust'],
  ['--lv-accent', '--lv-page', 3, 'focus ring on page'],
  ['--lv-accent', '--lv-surface', 3, 'focus ring on card'],
  ['--lv-accent', '--lv-rung-3', 3, 'focus ring on rung 3'],

  // The petrol-ink dark bands, which exist in both themes.
  ['--lv-dark-ink', '--lv-dark-petrol', 4.5, 'band ink on dark band'],
  ['--lv-dark-quiet', '--lv-dark-petrol', 4.5, 'band quiet ink on dark band'],
  ['--lv-dark-ink', '--lv-dark-petrol-surface', 4.5, 'band ink on dark band card'],
  ['--lv-sec-on-dark', '--lv-dark-petrol', 4.5, 'petrol link on dark band'],
  ['--lv-ok-on-dark', '--lv-dark-petrol-surface', 4.5, 'booked state on dark band'],

  // Hours bars, as non-text marks that carry meaning.
  ['--lv-meter-fill', '--lv-meter-track', 3, 'hours bar fill on its track'],
  ['--lv-meter-fill-quiet', '--lv-meter-track', 3, 'quiet hours bar fill on its track'],

  // Console status.
  ['--lv-ok', '--lv-ok-tint', 4.5, 'go status on its tint'],
  ['--lv-wait', '--lv-wait-tint', 4.5, 'wait status on its tint'],

  // The send-failure band, which is one fixed surface in both themes.
  ['--lv-alert-ink', '--lv-alert-surface', 4.5, 'alert ink on alert surface'],
  ['--lv-alert-quiet', '--lv-alert-surface', 4.5, 'alert quiet ink on alert surface'],
]

const failures = []
let checked = 0

for (const [themeName, tokens] of [
  ['light', LIGHT],
  ['dark', DARK],
]) {
  for (const [fg, bg, min, label] of PAIRS) {
    let ratio
    try {
      ratio = contrast(resolve(`var(${fg})`, tokens), resolve(`var(${bg})`, tokens))
    } catch (err) {
      failures.push(`${themeName}: ${label} — ${err.message}`)
      continue
    }
    checked += 1
    if (ratio < min) {
      failures.push(
        `${themeName}: ${label} (${fg} on ${bg}) is ${ratio.toFixed(2)}:1, needs ${min}:1`,
      )
    }
  }
}

if (failures.length) {
  console.error('Contrast check failed:\n')
  for (const f of failures) console.error(`  - ${f}`)
  console.error(`\n${failures.length} pair(s) below target.`)
  process.exit(1)
}

console.log(`Contrast check passed. ${checked} pairs at AA across both themes.`)
