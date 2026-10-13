/**
 * Sends the brief. Firebase is the primary production store when VITE_FIREBASE_* is set.
 * VITE_FORM_ENDPOINT can still be used as a secondary notification endpoint while EmailJS
 * templates are being added.
 */
import type { BriefPathId } from '@/types'
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
  meta: { submittedAt: string; page: string; userAgent: string }
}

export async function submitBrief(payload: BriefPayload): Promise<void> {
  let sentAnywhere = false
  let submission: SubmissionWriteResult | null = null

  if (config.firebase) {
    const { saveBriefToFirebase } = await import('./firebase-submissions')
    submission = await saveBriefToFirebase(payload)
    sentAnywhere = true
  }

  if (config.emailjs) {
    try {
      const { sendBriefEmails } = await import('./emailjs-brief')
      await sendBriefEmails(payload, submission)
      if (submission) {
        const { updateBriefEmailAutomation } = await import('./firebase-submissions')
        await updateBriefEmailAutomation(submission.enquiryId, 'sent')
      }
      sentAnywhere = true
    } catch (error) {
      if (submission) {
        const { updateBriefEmailAutomation } = await import('./firebase-submissions')
        await updateBriefEmailAutomation(submission.enquiryId, 'failed', error)
        console.error('[brief] EmailJS failed after Firebase save', error)
      } else {
        throw error
      }
    }
  }

  const formEndpoint = config.formEndpoint
  if (formEndpoint) {
    await postToFormEndpoint(formEndpoint, payload)
    sentAnywhere = true
  }

  if (!sentAnywhere) {
    console.info('[brief] Firebase, EmailJS and VITE_FORM_ENDPOINT not set: stub submit', payload)
    await new Promise((resolve) => setTimeout(resolve, 900))
  }
}

async function postToFormEndpoint(endpoint: string, payload: BriefPayload): Promise<void> {
  const response = await fetch(endpoint, {
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
