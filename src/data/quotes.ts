/**
 * Ready-made starting quotes for the Pricing page. Each is a set of quote-builder answers:
 * the page shows the range lib/estimate computes for it (so prices stay in one place), and
 * "Start from this quote" opens /start?quote=<id> with the builder pre-filled.
 * Answers must be valid for the builder (tests/quotes.test.ts checks every preset).
 */
import type { QuotePreset } from '@/types'

export const quotePresets: QuotePreset[] = [
  {
    id: 'launch',
    name: 'Launch website', // COPY:
    for: 'A new business that needs a proper website, not a template.', // COPY:
    includes: [
      '5 custom-designed pages', // COPY:
      'Contact forms, basic SEO and analytics', // COPY:
      'Hosting and care from launch day', // COPY:
    ],
    answers: {
      path: 'build',
      buildType: 'business-website',
      pages: 5,
      addOns: [],
      carePlan: 'care-essential',
    },
  },
  {
    id: 'bookings',
    name: 'Bookings website', // COPY:
    for: 'Salons, studios and services that take bookings or quote requests online.', // COPY:
    includes: [
      '6 custom-designed pages', // COPY:
      'Online booking or quote requests', // COPY:
      'Hosting, updates and small changes each month', // COPY:
    ],
    answers: {
      path: 'build',
      buildType: 'business-website',
      pages: 6,
      addOns: ['booking'],
      carePlan: 'care-business',
    },
  },
  {
    id: 'growth',
    name: 'Content and leads website', // COPY:
    for: 'An established business ready to be found and win enquiries.', // COPY:
    includes: [
      '8 custom-designed pages', // COPY:
      'Copywriting and a blog or news section', // COPY:
      'Hosting, updates and small changes each month', // COPY:
    ],
    answers: {
      path: 'build',
      buildType: 'business-website',
      pages: 8,
      addOns: ['copywriting', 'blog'],
      carePlan: 'care-business',
    },
  },
  {
    id: 'store',
    name: 'Online store', // COPY:
    for: 'Selling products online with a store you can run yourself.', // COPY:
    includes: [
      'Custom storefront, cart and payments', // COPY:
      'Product copy for your key pages', // COPY:
      'Hosting, updates and small changes each month', // COPY:
    ],
    answers: {
      path: 'build',
      buildType: 'ecommerce',
      pages: 5,
      addOns: ['copywriting'],
      carePlan: 'care-business',
    },
  },
  {
    id: 'brand',
    name: 'Brand experience', // COPY:
    for: 'A launch or brand that needs to stand out, with motion and interaction.', // COPY:
    includes: [
      '8 pages with scroll animation and interactive sections', // COPY:
      'Custom CMS and integrations', // COPY:
      'Priority care and support', // COPY:
    ],
    answers: {
      path: 'build',
      buildType: 'immersive-website',
      pages: 8,
      addOns: [],
      carePlan: 'care-pro',
    },
  },
]

export function getQuotePreset(id: string | null | undefined): QuotePreset | undefined {
  return quotePresets.find((q) => q.id === id)
}
