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
import { config } from './config'
import type { Estimate } from './estimate'
import type { ValidBrief } from './brief-schema'

export interface BriefPayload {
  brief: ValidBrief
  /** Human-readable answers, so the email is useful without a lookup table. */
  summary: Record<string, string>
  estimate: Pick<Estimate, 'onceLow' | 'onceHigh' | 'monthlyTotal' | 'weeks' | 'budgetFit'>
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
      _subject: `New brief: ${payload.brief.contact.name}`,
      _replyto: payload.brief.contact.email,
      payload,
    }),
  })

  if (!response.ok) throw new Error(`Brief submission failed (${response.status})`)
}
