import type { CtaLink, NavItem } from '@/types'
import { processContent, servicesContent } from './pages'

export const primaryNav: NavItem[] = [
  { label: 'Home', to: '/', description: 'Back to the start' }, // COPY:
  { label: 'Work', to: '/work', description: 'Case studies and proof' }, // COPY:
  { label: 'Services', to: '/services', description: 'What we build and look after' }, // COPY:
  { label: 'Process', to: '/process', description: 'How a project runs, start to finish' }, // COPY:
  { label: 'Studio', to: '/studio', description: 'The founders and how we work' }, // COPY:
  { label: 'Contact', to: '/contact', description: 'Send us a message' },
]

export const primaryCta: CtaLink = { label: 'Start a project', to: '/start' } // COPY:

/** Fast links in the Services and Process navigation dropdowns. */
export const sectionDropdowns: Record<string, NavItem[]> = {
  '/services': servicesContent.navigation.items.flatMap((item) => [
    { label: item.label, to: `/services#${item.id}` },
    ...(item.id === 'apps' ? [{ label: 'AI Systems & Apps', to: '/services#ai-systems' }] : []),
  ]),
  '/process': processContent.navigation.items.map((item) => ({
    label: item.label,
    to: `/process#${item.id}`,
  })),
}

export const footerNav: NavItem[] = [
  ...primaryNav,
  { label: 'Start a project', to: '/start' }, // COPY:
]

export const legalNav: NavItem[] = [{ label: 'Privacy (POPIA)', to: '/privacy' }] // COPY:

/** UI labels used by the global chrome. */
export const chromeCopy = {
  skipLink: 'Skip to content', // COPY:
  menuOpen: 'Menu', // COPY:
  menuClose: 'Close', // COPY:
  menuLabel: 'Site navigation', // COPY:
  homeLabel: 'Stack Studio home', // COPY:
  backToTop: 'Back to top', // COPY:
  footerEyebrow: 'Next step', // COPY:
  footerTitle: 'Got a project? Let’s build it properly.', // COPY:
  footerBody: 'Tell us what you need in two minutes, with a rough estimate before you hit send.', // COPY:
  contactHeading: 'Talk to us', // COPY:
  socialHeading: 'Follow', // COPY:
  navHeading: 'Sitemap', // COPY:
  whatsappLabel: 'Chat on WhatsApp', // COPY:
  preloaderLabel: 'Loading Stack Studio', // COPY:
  transitionLabel: 'Loading page', // COPY:
}
