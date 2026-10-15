import type { CtaLink, NavItem } from '@/types'
import { processContent, servicesContent } from './pages'
import { policies } from './policies'
import { processSteps } from './process'

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

export type SectionPreview = { description: string } & (
  | { image: string; video?: string; device?: never; visual?: never; steps?: never }
  | { device: 'phone' | 'laptop'; image?: never; video?: never; visual?: never; steps?: never }
  | {
      visual: 'timeline' | 'payment'
      steps: { label: string; value: string }[]
      image?: never
      video?: never
      device?: never
    }
)

/** Short, visual previews for the desktop navigation. Keys match section links above. */
export const sectionPreviews: Record<string, SectionPreview> = {
  '/services#stage-build': {
    description: 'A site that shows your work clearly and gives people a reason to choose you.',
    image: '/media/services/build-poster-480.webp',
    video: '/media/services/build-720.mp4',
  },
  '/services#apps': {
    description: 'Useful web and mobile products built around the way your business works.',
    device: 'phone',
  },
  '/services#ai-systems': {
    description: 'Complete AI products with their own interface, data workflows and human review.',
    image: '/media/services/automation-small.webp',
  },
  '/services#desktop': {
    description: 'Desktop tools and connected systems for the work your team does every day.',
    device: 'laptop',
  },
  '/services#stage-grow': {
    description: 'Make an existing site or app faster, clearer and more useful.',
    image: '/media/services/grow-poster-480.webp',
    video: '/media/services/grow-720.mp4',
  },
  '/services#plans': {
    description: 'Hosting, maintenance and hands-on support after launch.',
    image: '/media/services/run-poster-480.webp',
    video: '/media/services/run-720.mp4',
  },
  '/services#services-faq': {
    description: 'Quick answers about scope, pricing and working together.',
    image: '/media/services/collaboration-small.webp',
  },
  '/process#next-steps': {
    description: 'From your first brief to a clear plan and quote.',
    image: '/media/services/partner-poster-480.webp',
    video: '/media/services/partner-720.mp4',
  },
  '/process#timeline': {
    description: 'See how planning, design, development and launch fit together.',
    visual: 'timeline',
    steps: processSteps.slice(0, 5).map((step) => ({ label: step.title, value: step.duration })),
  },
  '/process#terms': {
    description: 'Know when payments happen and what each stage covers.',
    visual: 'payment',
    steps: (policies.paymentSchedules[0]?.milestones ?? []).map((step) => ({
      label: step.label,
      value: `${step.percent}%`,
    })),
  },
  '/process#care': {
    description: 'Updates, monitoring and support once your project is live.',
    image: '/media/services/run-poster-480.webp',
    video: '/media/services/run-720.mp4',
  },
  '/process#process-faq': {
    description: 'Straight answers before we start working together.',
    image: '/media/services/network-small.webp',
  },
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
