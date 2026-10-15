/**
 * Sends the brief to every channel that is configured (src/lib/config.ts):
 *   - EmailJS: the team notification, plus a client reply when linked in the dashboard.
 *   - Firebase: stores the brief in Firestore (docs/firebase-setup.md).
 *   - VITE_FORM_ENDPOINT: a JSON POST (Formspree or similar), kept as a fallback.
 * When Firebase is configured, the brief must be saved before any delivery channel runs.
 * With EmailJS configured, the brief also needs a successful email request.
 */
import type { BriefPathId } from '@/types'
import { createBriefRecord, type BriefRecord } from './brief-record'
import type { ValidBrief } from './brief-schema'
import { config } from './config'
import type { EstimateKind } from './estimate'
import type { SubmissionWriteResult } from './firebase-submissions'

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
  meta: {
    /** Reference quoted to the client, e.g. "SS-261013-7K4Q" (createBriefRef). */
    ref: string
    submittedAt: string
    page: string
    userAgent: string
  }
}

export interface BriefSubmission {
  /** What was sent (the success screen offers it as a PDF). */
  record: BriefRecord
  /** Whether EmailJS accepted the team email request. */
  emailed: boolean
}

export interface BriefSubmissionOptions {
  /** Reuse an enquiry already stored during a previous email attempt. */
  savedSubmission?: SubmissionWriteResult | null
  onSaved?: (submission: SubmissionWriteResult) => void
}

export async function submitBrief(
  payload: BriefPayload,
  options: BriefSubmissionOptions = {},
): Promise<BriefSubmission> {
  const record = createBriefRecord(payload)
  const errors: unknown[] = []
  let delivered = false
  let emailed = false
  let submission: SubmissionWriteResult | null = options.savedSubmission ?? null

  if (config.firebase && !submission) {
    try {
      const { saveBriefToFirebase } = await import('./firebase-submissions')
      submission = await saveBriefToFirebase(payload)
      options.onSaved?.(submission)
      delivered = true
    } catch (error) {
      console.error('[brief] Firebase save failed', error)
      throw new Error('Brief could not be saved to Firebase.', { cause: error })
    }
  }

  if (submission) delivered = true

  if (config.emailjs) {
    let emailError: unknown = null
    try {
      const { sendBriefEmails } = await import('./emailjs-brief')
      await sendBriefEmails(record, submission)
      emailed = true
      delivered = true
    } catch (error) {
      emailError = error
      errors.push(error)
      console.error('[brief] EmailJS send failed', error)
    }
    if (submission) {
      // Best effort: the brief is already stored either way.
      const { updateBriefEmailAutomation } = await import('./firebase-submissions')
      await updateBriefEmailAutomation(
        submission.enquiryId,
        emailError ? 'failed' : 'sent',
        emailError,
      ).catch((error: unknown) => console.error('[brief] Firebase status update failed', error))
    }
  }

  if (config.formEndpoint) {
    try {
      await postToFormEndpoint(config.formEndpoint, payload)
      delivered = true
    } catch (error) {
      errors.push(error)
      console.error('[brief] Form endpoint failed', error)
    }
  }

  if ((config.emailjs && !emailed) || (errors.length && !delivered)) {
    throw new Error('Brief delivery failed', { cause: errors })
  }

  if (!delivered) {
    if (!config.isDev) throw new Error('No brief delivery channel is configured.')
    console.info('[brief] No EmailJS, Firebase or VITE_FORM_ENDPOINT set: stub submit', payload)
    await new Promise((resolve) => setTimeout(resolve, 900))
  }

  return { record, emailed }
}

async function postToFormEndpoint(endpoint: string, payload: BriefPayload): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...payload.summary,
      Reference: payload.meta.ref,
      Path: payload.path,
      Result: payload.result.kind,
      Recommendation: payload.result.recommendation,
      _subject: `New brief ${payload.meta.ref} (${payload.path}): ${payload.brief.contact.name}`,
      _replyto: payload.brief.contact.email,
      payload,
    }),
  })

  if (!response.ok) throw new Error(`Brief submission failed (${response.status})`)
}
