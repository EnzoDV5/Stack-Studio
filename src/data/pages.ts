/**
 * Page-level copy: meta tags, heroes and section headings for every route.
 * Sections receive these as props; nothing is hardcoded in components.
 */
import type { PageMetaContent } from '@/types'

export const pageMeta = {
  home: {
    title: 'Stack Studio — Brand-led websites, built to convert', // COPY:
    description:
      'A two-person web studio in Centurion, South Africa. We design and build brand-led, cinematic websites and digital products for small businesses and NPOs.', // COPY:
    path: '/',
  },
  work: {
    title: 'Work', // COPY:
    description:
      'Selected case studies from Stack Studio: real problems, how we approached them, what we built and the results.', // COPY:
    path: '/work',
  },
  services: {
    title: 'Services', // COPY:
    description:
      'Web design and development, hosting and care, SEO and analytics, and brand-led digital products. What we build and how a project runs.', // COPY:
    path: '/services',
  },
  pricing: {
    title: 'Pricing', // COPY:
    description:
      'Transparent starting prices for once-off website builds and monthly hosting, care and growth plans. No hidden pricing.', // COPY:
    path: '/pricing',
  },
  studio: {
    title: 'Studio', // COPY:
    description:
      'Meet Stack Studio: Enzo De Vittorio and Armand Naudé, a two-person studio in Centurion building websites that work as hard as the businesses behind them.', // COPY:
    path: '/studio',
  },
  start: {
    title: 'Start a project', // COPY:
    description:
      'Tell us about your project in two minutes with a guided brief and get a rough estimate before you send it.', // COPY:
    path: '/start',
  },
  privacy: {
    title: 'Privacy notice', // COPY:
    description: 'How Stack Studio collects, uses and protects your personal information under POPIA.', // COPY:
    path: '/privacy',
  },
  notFound: {
    title: 'Page not found', // COPY:
    description: 'This page doesn’t exist, but your project still can.', // COPY:
    path: '/404',
    noindex: true,
  },
} satisfies Record<string, PageMetaContent>
