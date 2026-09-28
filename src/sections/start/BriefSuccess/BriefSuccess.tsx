import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { pad2 } from '@/lib/format'
import type { CtaLink } from '@/types'

export interface BriefSuccessProps {
  eyebrow: string
  title: string
  body: string
  steps: string[]
  urgent: string
  whatsapp: { href: string; label: string }
  primary: CtaLink
  secondary: CtaLink
}

/** Proper success state: confirmation, what happens next, and a WhatsApp fallback for urgent things. */
export function BriefSuccess({
  eyebrow,
  title,
  body,
  steps,
  urgent,
  whatsapp,
  primary,
  secondary,
}: BriefSuccessProps) {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div role="status" aria-live="polite">
      <div ref={headingRef} tabIndex={-1} className="outline-none">
        <Eyebrow label={eyebrow} className="mb-6" />
        <h2 className="max-w-[14ch] font-display text-display-lg">{title}</h2>
      </div>
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
      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-tone pt-8">
        <p className="text-muted">{urgent}</p>
        <WhatsAppButton
          href={whatsapp.href}
          label={whatsapp.label}
          location="start-success"
          size="sm"
        />
      </div>
    </div>
  )
}
