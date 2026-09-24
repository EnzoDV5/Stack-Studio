import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { TextLink } from '@/components/ui/TextLink'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { trackEvent } from '@/lib/analytics'
import { scrollToTop } from '@/lib/lenis'
import type { CtaContent, NavItem, SocialLink } from '@/types'
import styles from './Footer.module.css'

export interface FooterProps {
  /** Big CTA block. Pass null to hide it (e.g. on /start). */
  cta: CtaContent | null
  headings: { contact: string; social: string; nav: string }
  email: string
  whatsapp: { href: string; label: string }
  responsePromise: string
  socials: SocialLink[]
  nav: NavItem[]
  legalNav: NavItem[]
  copyright: string
  location: string
  backToTopLabel: string
  wordmark: string
}

export function Footer({
  cta,
  headings,
  email,
  whatsapp,
  responsePromise,
  socials,
  nav,
  legalNav,
  copyright,
  location,
  backToTopLabel,
  wordmark,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <Section as="div" tone="dark" spacing="none" className="overflow-hidden border-t border-tone">
      <footer className="container-site pt-section-sm">
        {cta && (
          <div className="grid gap-10 border-b border-tone pb-section-sm lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              {cta.eyebrow && <Eyebrow label={cta.eyebrow} className="mb-6" />}
              <h2 className="max-w-[16ch] text-display-lg">{cta.title}</h2>
              {cta.body && <p className="mt-6 max-w-[46ch] text-body-lg text-muted">{cta.body}</p>}
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <MagneticButton
                to={cta.to}
                size="lg"
                withArrow
                analytics={{ event: 'Start project click', props: { location: 'footer' } }}
              >
                {cta.label}
              </MagneticButton>
            </div>
          </div>
        )}

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5 text-muted">{headings.contact}</p>
            <a
              href={`mailto:${email}`}
              className="text-heading-lg transition-colors hover:text-orange"
              onClick={() => trackEvent('Email click', { location: 'footer' })}
            >
              {email}
            </a>
            <div className="mt-6">
              <WhatsAppButton href={whatsapp.href} label={whatsapp.label} location="footer" size="sm" />
            </div>
            <p className="mt-5 text-small text-muted">{responsePromise}</p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="eyebrow mb-5 text-muted">{headings.social}</p>
            <ul className="space-y-3">
              {socials.map((social) => (
                <li key={social.id}>
                  <TextLink href={social.href} variant="quiet">
                    {social.label}
                    <span className="text-muted">{social.handle}</span>
                  </TextLink>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={headings.nav} className="lg:col-span-3 lg:col-start-10">
            <p className="eyebrow mb-5 text-muted">{headings.nav}</p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <TextLink to={item.to} variant="quiet">
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-tone py-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {copyright} <span className="mx-2" aria-hidden="true">·</span> {location}
          </p>
          <div className="flex items-center gap-6">
            {legalNav.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-paper">
                {item.label}
              </Link>
            ))}
            <button type="button" className="hover:text-paper" onClick={() => scrollToTop(false)}>
              {backToTopLabel} ↑
            </button>
          </div>
        </div>
      </footer>

      <div aria-hidden="true" className="container-site -mt-4">
        <p className={styles.wordmark}>
          {wordmark}
          <span>.</span>
        </p>
      </div>
    </Section>
  )
}
