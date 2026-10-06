import type { CtaLink, NavItem } from '@/types'

export const primaryNav: NavItem[] = [
  { label: 'Work', to: '/work', description: 'Case studies and proof' }, // COPY:
  { label: 'Services', to: '/services', description: 'What we build, and how' }, // COPY:
  { label: 'Plans', to: '/pricing', description: 'Website care, managed software and Partner' }, // COPY:
  { label: 'Studio', to: '/studio', description: 'The founders and how we work' }, // COPY:
]

export const primaryCta: CtaLink = { label: 'Start a project', to: '/start' } // COPY:

export const footerNav: NavItem[] = [
  { label: 'Home', to: '/' }, // COPY:
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
