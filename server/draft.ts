import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'

import { CATALOG } from '../src/domain/catalog.ts'
import { HOURS_BANDS, PAINS, isPainId, painsOrDefault } from '../src/domain/pains.ts'
import type { DraftRequest, DraftResponse, HoursBand, PainId } from '../src/domain/types.ts'
import { BRAND } from '../src/brand.ts'

/**
 * The one place that talks to the Claude API. It runs server-side so the API
 * key is never shipped to a browser, and it only ever sees intake answers:
 * business type, hours band, and named pains.
 */

const MODEL = 'claude-opus-5'

const DraftSchema = z.object({
  summary: z.string(),
  phases: z.array(z.object({ title: z.string(), detail: z.string() })),
  picks: z.array(z.object({ pain: z.string(), option: z.string(), why: z.string() })),
})

let client: Anthropic | null = null

/** Whether a credential is available. Checked before a request is attempted. */
export function isDraftConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function getClient(): Anthropic {
  if (!client) client = new Anthropic()
  return client
}

export class DraftUnavailableError extends Error {}

/** Trust nothing off the wire: the request is rebuilt from known values only. */
export function parseDraftRequest(body: unknown): DraftRequest {
  if (!body || typeof body !== 'object') throw new DraftUnavailableError('Body must be an object')
  const raw = body as Record<string, unknown>

  const business = typeof raw.business === 'string' ? raw.business.slice(0, 200) : ''
  if (!business) throw new DraftUnavailableError('business is required')

  const hours = HOURS_BANDS.find((h) => h === raw.hours)
  if (!hours) throw new DraftUnavailableError('hours must be a known band')

  const pains = Array.isArray(raw.pains) ? raw.pains.filter(isPainId) : []
  if (!pains.length) throw new DraftUnavailableError('at least one known pain is required')

  return { business, hours: hours as HoursBand, pains: pains as PainId[] }
}

const SYSTEM = [
  `You are ${BRAND.name}'s internal solution architect.`,
  'A small-business owner filled out a three-question intake. Write a concise INTERNAL',
  'draft approach for the operator (a consultant) who will scope and quote the work,',
  'then choose the best real-world workflow option for each named pain from the catalog',
  'provided. Plain, grounded language. Phase the work so each piece earns the next.',
  'Never invent statistics. Do not use em dashes.',
].join(' ')

function buildUserPrompt(req: DraftRequest): string {
  const selected = painsOrDefault(req.pains)
  const painList = selected.map((p) => `- ${p.label}`).join('\n')
  const catalogLines = selected
    .map((p) => {
      const options = CATALOG[p.id].options
        .map((o) => `${o.id} = "${o.name}" using ${o.tools.join(', ')}`)
        .join('; ')
      return `- pain "${p.id}" (${p.short}): ${options}`
    })
    .join('\n')

  return [
    `Business type: ${req.business}`,
    `Back-office hours per week: ${req.hours}`,
    `Named pains:\n${painList}`,
    '',
    `Workflow catalog (pick exactly one option id per pain):\n${catalogLines}`,
    '',
    'Give three phases ordered by what to do first, and one pick per named pain.',
    'Each "why" is one short sentence on why that option fits this specific business.',
  ].join('\n')
}

/** Keep only picks that name a real pain and a real option for it. */
function sanitizePicks(picks: DraftResponse['picks'], requested: PainId[]): DraftResponse['picks'] {
  return picks.filter((pick) => {
    if (!isPainId(pick.pain) || !requested.includes(pick.pain)) return false
    return CATALOG[pick.pain].options.some((o) => o.id === pick.option)
  })
}

export async function generateDraft(req: DraftRequest): Promise<DraftResponse> {
  if (!isDraftConfigured()) {
    throw new DraftUnavailableError('ANTHROPIC_API_KEY is not set')
  }

  try {
    const message = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      // Picking one of two catalog options and writing three short phases is a
      // small, well-specified job. Raise this if the drafts start reading thin.
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages: [{ role: 'user', content: buildUserPrompt(req) }],
      output_format: betaZodOutputFormat(DraftSchema),
    })

    if (message.stop_reason === 'refusal') {
      throw new DraftUnavailableError('Request was declined')
    }

    const parsed = message.parsed_output
    if (!parsed || !parsed.summary.trim() || !parsed.phases.length) {
      throw new DraftUnavailableError('Draft came back empty')
    }

    return {
      summary: parsed.summary.replace(/\s+/g, ' ').trim(),
      phases: parsed.phases.slice(0, 3).map((phase, i) => ({
        title: (phase.title || `Phase ${i + 1}`).trim(),
        detail: phase.detail.replace(/\s+/g, ' ').trim(),
      })),
      picks: sanitizePicks(parsed.picks, req.pains),
    }
  } catch (error) {
    if (error instanceof DraftUnavailableError) throw error
    if (error instanceof Anthropic.AuthenticationError) {
      throw new DraftUnavailableError('Claude rejected the credentials')
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new DraftUnavailableError('Rate limited by Claude')
    }
    if (error instanceof Anthropic.APIError) {
      throw new DraftUnavailableError(`Claude API error ${error.status}`)
    }
    throw new DraftUnavailableError('Could not reach Claude')
  }
}

/** Exposed for the boundary check and tests: which pains the catalog covers. */
export const COVERED_PAINS = PAINS.map((p) => p.id)
