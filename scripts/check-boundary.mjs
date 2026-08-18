#!/usr/bin/env node
/**
 * The never-reveal boundary, enforced.
 *
 * The design's hardest constraint is that the prospect surface and the
 * operator console share no layout, no component, and no rendering path, and
 * that the *method* — which trigger fires which step in which order — never
 * crosses to the prospect side. Copy review will not catch a regression here
 * six months from now. This will.
 *
 * On tool names, which this file used to ban outright: that ban is now scoped
 * rather than absolute, and the change is an owner decision, not a
 * convenience. REQUIREMENTS.md §5 asks for a "how it strings together" section
 * that names familiar tools "without exposing prompts, configurations, or
 * anything that gives away the build", and the current design pages do exactly
 * that — /what-we-automate lists the tools each job runs on, and
 * /how-it-works walks seven stations and then says out loud that the wiring is
 * not on the page. For a skeptical trades audience "built on tools you already
 * pay for and can cancel" is the reassurance that makes the offer real.
 *
 * So the line moved to where it always belonged. A tool name is a receipt; the
 * recipe is the product. Naming is allowed in two reviewed, data-only content
 * modules and nowhere else, and the wiring is still checked for directly.
 *
 * Run: npm run check:boundary
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'src')

const failures = []

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.(ts|tsx|css)$/.test(full)) out.push(full)
  }
  return out
}

/**
 * Comments are not shipped to anyone, so they are not part of the surface.
 * Without this, a note explaining why a tool is *not* named would fail the
 * check that exists to keep it unnamed.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
}

const files = walk(SRC)

// ---------------------------------------------------------------------------
// 1. Neither surface may import the other.
//    Genuinely shared UI lives in src/components, which both may import.
// ---------------------------------------------------------------------------
const IMPORT_RE = /(?:from|import)\s+['"]([^'"]+)['"]/g

for (const file of files) {
  const rel = relative(root, file)
  const inProspect = rel.startsWith('src/prospect')
  const inOperator = rel.startsWith('src/operator')
  if (!inProspect && !inOperator) continue

  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(IMPORT_RE)) {
    const spec = match[1]
    const forbidden = inProspect ? 'operator' : 'prospect'
    if (spec.includes(`/${forbidden}/`) || spec.endsWith(`/${forbidden}`)) {
      failures.push(`${rel} imports across the boundary: ${spec}`)
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Named tools, only in the two reviewed content modules.
//    The prospect sees which tools their week will run on. They never see how
//    those tools are wired together.
// ---------------------------------------------------------------------------
const TOOL_NAMES = [
  'Zapier',
  'RingCentral',
  'Cal.com',
  'Calendly',
  'QuickBooks',
  'Stripe',
  'Twilio',
  'HubSpot',
  'Intercom',
  'Notion',
  'Slack',
  'Make',
  'Google Calendar',
  'Gmail',
]

/**
 * The only prospect-side files allowed to name a tool.
 *
 * Both are data-only content modules, both are listed here rather than matched
 * by a pattern, and adding a third is a decision someone has to make on
 * purpose in this file — which is the point.
 */
const TOOL_NAME_ALLOWED = new Set([
  'src/prospect/content/automations.ts',
  'src/prospect/content/line.ts',
])

for (const file of files) {
  const rel = relative(root, file)
  if (!rel.startsWith('src/prospect')) continue
  if (TOOL_NAME_ALLOWED.has(rel)) continue
  const source = stripComments(readFileSync(file, 'utf8'))
  for (const tool of TOOL_NAMES) {
    // Word-boundary match so "Make" does not fire on "makes" or "Maker".
    const re = new RegExp(`\\b${tool.replace('.', '\\.')}\\b`)
    if (re.test(source)) {
      failures.push(`${rel} names a tool outside the two content modules: ${tool}`)
    }
  }
}

// ---------------------------------------------------------------------------
// 3. The prospect surface must not read the operator's solution catalog.
//    That catalog is the recipes: trigger, ordered steps, per-step tooling.
// ---------------------------------------------------------------------------
for (const file of files) {
  const rel = relative(root, file)
  if (!rel.startsWith('src/prospect')) continue
  const source = readFileSync(file, 'utf8')
  if (/from\s+['"][^'"]*domain\/catalog['"]/.test(source)) {
    failures.push(`${rel} imports the operator-only solution catalog`)
  }
}

// ---------------------------------------------------------------------------
// 4. No wiring, however it got there.
//    Rule 3 catches the import; this catches a recipe pasted in by hand. A
//    { tool, action } pair, or a `trigger:` beside `steps:`, is the shape of
//    the thing being sold and does not belong on the prospect surface.
// ---------------------------------------------------------------------------
for (const file of files) {
  const rel = relative(root, file)
  if (!rel.startsWith('src/prospect')) continue
  const source = stripComments(readFileSync(file, 'utf8'))

  if (/\{\s*tool\s*:[\s\S]{0,120}?\baction\s*:/.test(source)) {
    failures.push(`${rel} carries a { tool, action } step — that is the wiring, not the outcome`)
  }
  if (/\btrigger\s*:/.test(source) && /\bsteps\s*:/.test(source)) {
    failures.push(`${rel} carries a trigger and steps — that is a recipe`)
  }
}

if (failures.length) {
  console.error('Boundary check failed:\n')
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error(`\n${failures.length} violation(s).`)
  process.exit(1)
}

console.log(
  `Boundary check passed. ${files.length} files scanned; ` +
    `${TOOL_NAME_ALLOWED.size} content modules may name tools.`,
)
