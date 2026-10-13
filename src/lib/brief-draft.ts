/**
 * Keeps an unfinished brief in sessionStorage (this tab only, cleared on close or after a
 * successful submit), so an accidental navigation doesn't lose answers. Consent is never
 * persisted: it must be given fresh.
 */
import type { BriefAnswers } from '@/types'
import { emptyAnswers } from './brief-reducer'

// v3: build kind, care-plan setup and partner idea (no budget). Older drafts are ignored.
const KEY = 'stack:brief-draft:v3'

export function loadDraft(): BriefAnswers | null {
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<BriefAnswers>
    if (typeof parsed !== 'object' || !('path' in parsed) || !parsed.contact) return null
    return {
      ...emptyAnswers,
      ...parsed,
      contact: { ...emptyAnswers.contact, ...parsed.contact },
      consent: false,
    }
  } catch {
    return null
  }
}

export function saveDraft(answers: BriefAnswers): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ ...answers, consent: false }))
  } catch {
    // Storage unavailable: drafts are a convenience only.
  }
}

export function clearDraft(): void {
  try {
    window.sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
