import type { Tone } from '@/components/layout/Section'
import { ClientLogo } from '@/components/media/ClientLogo'
import { cn } from '@/lib/cn'
import { isLightTone } from '@/lib/tone'
import type { ClientLogoSet } from '@/types'
import styles from './QuoteCredit.module.css'

export interface QuoteCreditProps {
  /** The person quoted. Without one, the company leads and the role sits under it. */
  name?: string
  role: string
  company: string
  logo?: ClientLogoSet
  /** The tone the credit's section declares (the page tone takes over while it flows). */
  tone: Tone
  className?: string
}

/**
 * Who said a quote: the client's logo, a hairline, then the person (or company) and role. The
 * logo is the version drawn for the colour actually on screen.
 */
export function QuoteCredit({ name, role, company, logo, tone, className }: QuoteCreditProps) {
  return (
    <span
      className={cn(styles.credit, 'flex items-center gap-5', className)}
      data-surface={isLightTone(tone) ? 'light' : 'dark'}
    >
      {logo && (
        <>
          {/* Decorative: the company is named right beside it. */}
          <ClientLogo
            logo={{ ...logo.onLight, alt: '' }}
            size="credit"
            className={styles.onLight}
          />
          <ClientLogo logo={{ ...logo.onDark, alt: '' }} size="credit" className={styles.onDark} />
          <span aria-hidden="true" className="h-10 w-px shrink-0 bg-(--tone-border)" />
        </>
      )}
      <span>
        <span className="block font-semibold">{name ?? company}</span>
        <span className="block text-small text-muted">{name ? `${role}, ${company}` : role}</span>
      </span>
    </span>
  )
}
