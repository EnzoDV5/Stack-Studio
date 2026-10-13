/**
 * A submitted brief as a compact, self-contained record: what the team email, the client
 * auto-reply, the PDF and the /brief page all render from.
 *
 * The record travels inside the "Download PDF" link in the emails, in the URL fragment
 * (`/brief#z…`). Fragments never reach the server, so the brief is not stored anywhere
 * new: the link only re-renders what is already in the email. Pure, no React.
 */
import * as z from 'zod/mini'
import type { BriefPathId } from '@/types'
import type { BriefPayload } from './submit-brief'

export interface BriefRecord {
  v: 1
  /** Reference quoted in emails and the PDF, e.g. "SS-261013-7K4Q". */
  ref: string
  path: BriefPathId
  submittedAt: string
  contact: { name: string; email: string; phone: string; company: string; message: string }
  /** Answers in step order: [label, human-readable value]. */
  answers: [string, string][]
  estimate: { kind: string; recommendation: string }
  /** The page the brief was sent from. */
  page: string
}

const recordSchema = z.object({
  v: z.literal(1),
  ref: z.string(),
  path: z.enum(['build', 'existing', 'run', 'develop', 'unsure']),
  submittedAt: z.string(),
  contact: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    company: z.string(),
    message: z.string(),
  }),
  answers: z.array(z.tuple([z.string(), z.string()])),
  estimate: z.object({ kind: z.string(), recommendation: z.string() }),
  page: z.string(),
})

// No 0/O or 1/I/L: the reference gets read aloud and typed.
const REF_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

/** "SS-261013-7K4Q": date (SAST) plus four random characters. */
export function createBriefRef(
  date: Date,
  random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n)),
): string {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('-', '')
  const suffix = Array.from(random(4), (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('')
  return `SS-${day}-${suffix}`
}

export function createBriefRecord(payload: BriefPayload): BriefRecord {
  const { contact } = payload.brief
  return {
    v: 1,
    ref: payload.meta.ref,
    path: payload.path,
    submittedAt: payload.meta.submittedAt,
    contact: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      message: contact.message.trim(),
    },
    answers: Object.entries(payload.summary),
    estimate: payload.result,
    page: payload.meta.page,
  }
}

/** "13 Oct 2026, 18:12" in South African time. */
export function formatSubmitted(iso: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Johannesburg',
  }).format(new Date(iso))
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array {
  const binary = atob(value.replaceAll('-', '+').replaceAll('_', '/'))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

async function pipe(bytes: Uint8Array, stream: GenericTransformStream): Promise<Uint8Array> {
  const piped = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(piped).arrayBuffer())
}

/**
 * Record → URL-safe string. "z" + deflated JSON where the browser can compress (all current
 * ones), "j" + plain JSON otherwise.
 */
export async function encodeBriefRecord(record: BriefRecord): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(record))
  if (typeof CompressionStream === 'undefined') return `j${toBase64Url(json)}`
  return `z${toBase64Url(await pipe(json, new CompressionStream('deflate-raw')))}`
}

/** The reverse of encodeBriefRecord. null for anything that isn't a valid record. */
export async function decodeBriefRecord(encoded: string): Promise<BriefRecord | null> {
  try {
    const flag = encoded[0]
    let bytes = fromBase64Url(encoded.slice(1))
    if (flag === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'))
    else if (flag !== 'j') return null
    const parsed = recordSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

/** Absolute link to the record page. `download` makes it save the PDF straight away. */
export async function briefRecordUrl(
  origin: string,
  record: BriefRecord,
  { download = false } = {},
): Promise<string> {
  const url = new URL('/brief', origin)
  if (download) url.search = 'download'
  url.hash = await encodeBriefRecord(record)
  return url.toString()
}
