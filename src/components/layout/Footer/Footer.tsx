import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { trackEvent } from '@/lib/analytics'
import { scrollToTop } from '@/lib/lenis'
import type { NavItem, SocialLink } from '@/types'
import styles from './Footer.module.css'

export interface FooterProps {
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

/**
 * Global footer: contact (email + WhatsApp), socials, sitemap, legal and a giant outlined
 * wordmark. The big "Start a project" moment is the orange ClosingCta band the app shell
 * renders directly above this on every page except /start.
 */
export function Footer({
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
      <footer className="container-site">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-5 eyebrow text-muted">{headings.contact}</p>
            <a
              href={`mailto:${email}`}
              className="text-heading-lg transition-colors hover:text-orange"
              onClick={() => trackEvent('Email click', { location: 'footer' })}
            >
              {email}
            </a>
            <div className="mt-6">
              <WhatsAppButton
                href={whatsapp.href}
                label={whatsapp.label}
                location="footer"
                size="sm"
              />
            </div>
            <p className="mt-5 text-small text-muted">{responsePromise}</p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="mb-5 eyebrow text-muted">{headings.social}</p>
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
            <p className="mb-5 eyebrow text-muted">{headings.nav}</p>
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
            © {year} {copyright}{' '}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>{' '}
            {location}
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
