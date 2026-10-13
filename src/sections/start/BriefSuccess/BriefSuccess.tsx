import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { pad2 } from '@/lib/format'
import type { CtaLink } from '@/types'

export interface BriefSuccessProps {
  eyebrow: string
  title: string
  body: string
  steps: string[]
  urgent: string
  whatsapp?: { href: string; label: string }
  primary: CtaLink
  secondary: CtaLink
  /** The brief's reference, e.g. { label: 'Your reference', value: 'SS-261013-7K4Q' }. */
  reference?: { label: string; value: string }
  /** e.g. "A copy of your brief is on its way to …". */
  note?: string
  /** Saves the sent brief as a PDF. */
  download?: { label: string; onDownload: () => Promise<void> }
}

/**
 * Proper success state: confirmation, the brief's reference and a PDF copy, what happens
 * next, and a WhatsApp fallback for urgent things.
 */
export function BriefSuccess({
  eyebrow,
  title,
  body,
  steps,
  urgent,
  whatsapp,
  primary,
  secondary,
  reference,
  note,
  download,
}: BriefSuccessProps) {
  const [downloading, setDownloading] = useState(false)

  const onDownload = () => {
    if (!download || downloading) return
    setDownloading(true)
    download
      .onDownload()
      .catch((error: unknown) => console.error(error))
      .finally(() => setDownloading(false))
  }
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div role="status" aria-live="polite">
      <div ref={headingRef} tabIndex={-1} className="outline-none">
        <Eyebrow label={eyebrow} className="mb-6" />
        <Heading size="display-lg" className="max-w-[14ch]" compile>
          {title}
        </Heading>
      </div>
      {(reference || download) && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border border-tone px-5 py-4">
          {reference && (
            <p>
              <span className="block eyebrow text-muted">{reference.label}</span>
              <span className="mt-1 block font-mono text-body-lg tracking-wide text-accent">
                {reference.value}
              </span>
            </p>
          )}
          {download && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onDownload}
              aria-busy={downloading}
            >
              {download.label}
            </Button>
          )}
          {note && <p className="w-full text-small text-muted">{note}</p>}
        </div>
      )}
      <p className="mt-8 text-body-lg text-muted">{body}</p>
      <ol className="mt-8 space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-5 border-t border-tone pt-4">
            <span className="pt-1 eyebrow text-accent">{pad2(i + 1)}</span>
            <span className="text-body-lg">{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Button to={primary.to} withArrow>
          {primary.label}
        </Button>
        <Button to={secondary.to} variant="secondary">
          {secondary.label}
        </Button>
      </div>
      {whatsapp && (
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-tone pt-8">
          <p className="text-muted">{urgent}</p>
          <WhatsAppButton
            href={whatsapp.href}
            label={whatsapp.label}
            location="start-success"
            size="sm"
          />
        </div>
      )}
    </div>
  )
}
