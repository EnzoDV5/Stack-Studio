import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useFeedback } from '@/app/providers/FeedbackProvider'
import { Section } from '@/components/layout/Section'
import { PageMeta } from '@/components/seo/PageMeta'
import { AnimatedAlert } from '@/components/ui/AnimatedAlert'
import { briefCopy } from '@/data/brief'
import { contactContent, pageMeta } from '@/data/pages'
import { site } from '@/data/site'
import { config } from '@/lib/config'
import type { ContactEnquiry } from '@/lib/contact-email'
import { emailFailureMessage } from '@/lib/email-delivery'
import { BriefField } from '@/sections/start/BriefField'
import { ConsentField } from '@/sections/start/ConsentField'
import { PageTitle } from '@/sections/shared/PageTitle'

type Field = keyof ContactEnquiry | 'consent'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const emptyEnquiry: ContactEnquiry = { name: '', email: '', subject: '', message: '' }

function validate(enquiry: ContactEnquiry, consent: boolean): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (enquiry.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (enquiry.subject.trim().length < 3) errors.subject = 'Please add a short subject.'
  if (enquiry.message.trim().length < 10) errors.message = 'Please tell us a little more.'
  if (!consent) errors.consent = briefCopy.errors.consent
  return errors
}

export function ContactPage() {
  const { showError, clearError } = useFeedback()
  const [enquiry, setEnquiry] = useState<ContactEnquiry>(emptyEnquiry)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failureMessage, setFailureMessage] = useState<string>(contactContent.failed)
  const savedEnquiryId = useRef<string | null>(null)

  const change = (field: keyof ContactEnquiry, value: string) => {
    savedEnquiryId.current = null
    setEnquiry((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'error') {
      setStatus('idle')
      clearError()
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    const nextErrors = validate(enquiry, consent)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus('sending')
    clearError()
    try {
      if (config.firebase && !savedEnquiryId.current) {
        const { saveContactToFirebase } = await import('@/lib/firebase-submissions')
        savedEnquiryId.current = await saveContactToFirebase(enquiry)
      }
      const { sendContactEmail } = await import('@/lib/emailjs-contact')
      await sendContactEmail(enquiry)
      if (savedEnquiryId.current) {
        const { updateContactEmailAutomation } = await import('@/lib/firebase-submissions')
        await updateContactEmailAutomation(savedEnquiryId.current, 'sent').catch((error: unknown) =>
          console.error('[contact] Firebase status update failed', error),
        )
      }
      savedEnquiryId.current = null
      setStatus('sent')
      setEnquiry(emptyEnquiry)
      setConsent(false)
    } catch (error) {
      if (savedEnquiryId.current) {
        const { updateContactEmailAutomation } = await import('@/lib/firebase-submissions')
        await updateContactEmailAutomation(savedEnquiryId.current, 'failed', error).catch(
          (statusError: unknown) =>
            console.error('[contact] Firebase status update failed', statusError),
        )
      }
      console.error('[contact] Submission failed', error)
      const message = emailFailureMessage(error, contactContent.failed)
      setFailureMessage(message)
      setStatus('error')
      showError({
        title: contactContent.failedTitle,
        body: message,
        onDismiss: () => setStatus('idle'),
      })
    }
  }

  return (
    <>
      <PageMeta {...pageMeta.contact} />
      <PageTitle content={contactContent.intro} tone="dark">
        <Link to="/start" className="text-small text-orange underline underline-offset-4">
          {contactContent.projectLink}
        </Link>
      </PageTitle>
      <Section tone="dark" spacing="sm" className="pt-8">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div>
            <h2 className="max-w-[18ch] font-display text-heading-lg">
              {contactContent.formTitle}
            </h2>
            <p className="mt-5 max-w-[36ch] text-body text-muted">{contactContent.responseNote}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-block text-body break-all text-orange underline underline-offset-4"
            >
              {site.email}
            </a>
          </div>

          <div>
            {!config.emailjs ? (
              <p className="rounded-md border border-tone p-6 text-body" role="status">
                {contactContent.unavailable}
              </p>
            ) : status === 'sent' ? (
              <div className="rounded-md border border-orange/50 bg-ink-800 p-8" role="status">
                <h2 className="font-display text-heading-md">{contactContent.successTitle}</h2>
                <p className="mt-3 text-body text-muted">{contactContent.successBody}</p>
                <button
                  type="button"
                  className="mt-7 text-small text-orange underline underline-offset-4"
                  onClick={() => setStatus('idle')}
                >
                  {contactContent.again}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <BriefField
                    id="contact-name"
                    label="Name"
                    value={enquiry.name}
                    onChange={(value) => change('name', value)}
                    autoComplete="name"
                    maxLength={120}
                    required
                    error={errors.name}
                  />
                  <BriefField
                    id="contact-email"
                    label="Email"
                    value={enquiry.email}
                    onChange={(value) => change('email', value)}
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    error={errors.email}
                  />
                </div>
                <BriefField
                  id="contact-subject"
                  label="Subject"
                  value={enquiry.subject}
                  onChange={(value) => change('subject', value)}
                  maxLength={100}
                  required
                  error={errors.subject}
                />
                <BriefField
                  id="contact-message"
                  label="Message"
                  value={enquiry.message}
                  onChange={(value) => change('message', value)}
                  maxLength={5000}
                  multiline
                  required
                  error={errors.message}
                />
                <ConsentField
                  id="contact-consent"
                  checked={consent}
                  onChange={(value) => {
                    setConsent(value)
                    setErrors((current) => ({ ...current, consent: undefined }))
                    if (status === 'error') {
                      setStatus('idle')
                      clearError()
                    }
                  }}
                  label={briefCopy.consent.label}
                  linkLabel={briefCopy.consent.linkLabel}
                  privacyHref="/privacy"
                  note={briefCopy.consent.note}
                  error={errors.consent}
                />
                {status === 'error' && (
                  <AnimatedAlert
                    announce={false}
                    className="text-small text-error"
                    dismissLabel={contactContent.dismissError}
                    onDismiss={() => {
                      setStatus('idle')
                      clearError()
                    }}
                  >
                    {failureMessage}
                  </AnimatedAlert>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-orange px-7 py-3 font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
                >
                  {status === 'sending' ? contactContent.sending : contactContent.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
