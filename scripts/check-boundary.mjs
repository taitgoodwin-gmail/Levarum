#!/usr/bin/env node
/**
 * The never-reveal boundary, enforced.
 *
 * The design's hardest constraint is that the prospect surface and the
 * operator console share no layout, no component, and no rendering path, and
 * that no tool name ever crosses to the prospect side. Copy review will not
 * catch a regression here six months from now. This will.
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
    else if (/\.(ts|tsx|js|jsx|css)$/.test(full)) out.push(full)
  }
  return out
}

const files = walk(SRC)

// ---------------------------------------------------------------------------
// 1. Neither surface may import the other.
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
// 2. No named tool may appear anywhere on the prospect surface.
//    The prospect sees outcomes. Never methods, never wiring.
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

for (const file of files) {
  const rel = relative(root, file)
  if (!rel.startsWith('src/prospect')) continue
  const source = readFileSync(file, 'utf8')
  for (const tool of TOOL_NAMES) {
    // Word-boundary match so "Make" does not fire on "makes" or "Maker".
    const re = new RegExp(`\\b${tool.replace('.', '\\.')}\\b`)
    if (re.test(source)) {
      failures.push(`${rel} names a tool on the prospect surface: ${tool}`)
    }
  }
}

// ---------------------------------------------------------------------------
// 3. The prospect surface must not read the operator's catalog.
// ---------------------------------------------------------------------------
for (const file of files) {
  const rel = relative(root, file)
  if (!rel.startsWith('src/prospect')) continue
  const source = readFileSync(file, 'utf8')
  if (/from\s+['"][^'"]*domain\/catalog['"]/.test(source)) {
    failures.push(`${rel} imports the operator-only solution catalog`)
  }
}

if (failures.length) {
  console.error('Boundary check failed:\n')
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error(`\n${failures.length} violation(s).`)
  process.exit(1)
}

console.log(`Boundary check passed. ${files.length} files scanned.`)
