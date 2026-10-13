import { collection, doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import type { BriefPayload } from './submit-brief'
import { firebaseServices } from './firebase'

export const firebaseCollections = {
  contacts: 'client_contacts',
  enquiries: 'project_enquiries',
} as const

type FirebaseCollectionName = (typeof firebaseCollections)[keyof typeof firebaseCollections]

export interface SubmissionWriteResult {
  contactId: string
  enquiryId: string
  collections: Record<'contacts' | 'enquiries', FirebaseCollectionName>
}

export type EmailAutomationStatus = 'sent' | 'failed'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function enquiryReason(payload: BriefPayload): string {
  switch (payload.path) {
    case 'build':
      return 'new_build'
    case 'existing':
      return 'existing_website_help'
    case 'run':
      return 'hosting_and_care'
    case 'develop':
      return 'development_partner'
    case 'unsure':
      return 'not_sure_yet'
  }
}

export async function saveBriefToFirebase(payload: BriefPayload): Promise<SubmissionWriteResult> {
  const { db, userId } = await firebaseServices()
  const email = normalizeEmail(payload.brief.contact.email)
  const contactId = await sha256(email)
  const contactRef = doc(db, firebaseCollections.contacts, contactId)
  const enquiryRef = doc(collection(db, firebaseCollections.enquiries))
  const timestamp = serverTimestamp()

  const batch = writeBatch(db)

  batch.set(
    contactRef,
    {
      displayName: payload.brief.contact.name,
      email,
      phone: payload.brief.contact.phone || null,
      company: payload.brief.contact.company || null,
      latestMessage: payload.brief.contact.message || null,
      latestReason: enquiryReason(payload),
      latestEnquiryId: enquiryRef.id,
      latestSubmittedAt: payload.meta.submittedAt,
      updatedAt: timestamp,
    },
    { merge: true },
  )

  batch.set(enquiryRef, {
    status: 'new',
    reason: enquiryReason(payload),
    contactId,
    contact: {
      name: payload.brief.contact.name,
      email,
      phone: payload.brief.contact.phone || null,
      company: payload.brief.contact.company || null,
      message: payload.brief.contact.message || null,
    },
    project: {
      path: payload.path,
      brief: payload.brief,
      summary: payload.summary,
    },
    estimate: payload.result,
    emailAutomation: {
      provider: 'emailjs',
      autoReplyStatus: 'pending',
      teamNotificationStatus: 'pending',
    },
    source: {
      submittedAt: payload.meta.submittedAt,
      page: payload.meta.page,
      userAgent: payload.meta.userAgent,
      authUid: userId,
    },
    consent: payload.brief.consent,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  await batch.commit()

  return {
    contactId,
    enquiryId: enquiryRef.id,
    collections: firebaseCollections,
  }
}

export async function updateBriefEmailAutomation(
  enquiryId: string,
  status: EmailAutomationStatus,
  error?: unknown,
): Promise<void> {
  const { db } = await firebaseServices()
  const enquiryRef = doc(db, firebaseCollections.enquiries, enquiryId)
  const message = error instanceof Error ? error.message : error ? String(error) : null

  await updateDoc(enquiryRef, {
    emailAutomation: {
      provider: 'emailjs',
      autoReplyStatus: status === 'sent' ? 'linked_template' : 'failed',
      teamNotificationStatus: status,
      errorMessage: message,
      updatedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  })
}
