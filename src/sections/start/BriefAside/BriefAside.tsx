import { TextLink } from '@/components/ui/TextLink'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { trackEvent } from '@/lib/analytics'

export interface BriefAsideProps {
  title: string
  body: string
  whatsapp?: { href: string; label: string }
  email: string
}

/** WhatsApp and email as equal alternatives to the form. */
export function BriefAside({ title, body, whatsapp, email }: BriefAsideProps) {
  return (
    <div className="rounded-lg border border-tone p-6 md:p-7">
      <p className="text-heading-md">{title}</p>
      <p className="mt-2 text-small text-muted">{body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
        {whatsapp && (
          <WhatsAppButton href={whatsapp.href} label={whatsapp.label} location="start" size="sm" />
        )}
        <TextLink
          href={`mailto:${email}`}
          className="text-small"
          onClick={() => trackEvent('Email click', { location: 'start' })}
        >
          {email}
        </TextLink>
      </div>
    </div>
  )
}
