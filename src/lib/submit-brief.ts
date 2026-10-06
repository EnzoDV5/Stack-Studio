/**
 * Sends the brief. With VITE_FORM_ENDPOINT set, it POSTs JSON to that endpoint (Formspree
 * accepts this as-is). Without it, a local stub logs the payload and resolves, so the flow
 * and success state work in development.
 *
 * TODO(forms): pick the production provider and set VITE_FORM_ENDPOINT:
 *   - Formspree: https://formspree.io/f/<id> (JSON POST works with the code below).
 *   - EmailJS: replace the fetch with emailjs.send(serviceId, templateId, payload, publicKey)
 *     (add @emailjs/browser, and read the ids through src/lib/config.ts).
 *   Either way: turn on spam protection (honeypot or reCAPTCHA) and email notifications
 *   in the provider dashboard.
 */
import type { BriefPathId } from '@/types'
import type { ValidBrief } from './brief-schema'
import { config } from './config'
import type { EstimateKind } from './estimate'

export interface BriefPayload {
  path: BriefPathId
  brief: ValidBrief
  /** Human-readable answers, keyed by step label, so the email reads well on its own. */
  summary: Record<string, string>
  result: {
    kind: EstimateKind
    /** Plain-language recommendation, e.g. "R 23 000 – R 31 000" or "Website Care Essential". */
    recommendation: string
  }
  meta: { submittedAt: string; page: string; userAgent: string }
}

export async function submitBrief(payload: BriefPayload): Promise<void> {
  if (!config.formEndpoint) {
    // Local stub: no endpoint configured.
    console.info('[brief] VITE_FORM_ENDPOINT not set: stub submit', payload)
    await new Promise((resolve) => setTimeout(resolve, 900))
    return
  }

  const response = await fetch(config.formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...payload.summary,
      Path: payload.path,
      Result: payload.result.kind,
      Recommendation: payload.result.recommendation,
      _subject: `New brief (${payload.path}): ${payload.brief.contact.name}`,
      _replyto: payload.brief.contact.email,
      payload,
    }),
  })

  if (!response.ok) throw new Error(`Brief submission failed (${response.status})`)
}
