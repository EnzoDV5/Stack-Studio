/**
 * Add-ons for website builds only (Business, Immersive, E-commerce). Extra pages and
 * languages are priced per unit through the quote builder's count steps.
 */
import type { AddOn } from '@/types'

export const addOns: AddOn[] = [
  {
    id: 'extra-page',
    name: 'Extra page', // COPY:
    description: 'Beyond the pages included in your build.', // COPY:
    price: 1_500,
    perUnit: true,
    briefMode: 'count',
  },
  {
    id: 'copywriting',
    name: 'Copywriting', // COPY:
    description: 'We write the words, not just the layout.', // COPY:
    price: 5_000,
    perUnit: false,
    briefMode: 'toggle',
  },
  {
    id: 'blog',
    name: 'Blog or news section', // COPY:
    description: 'Publish articles and updates yourself.', // COPY:
    price: 4_000,
    perUnit: false,
    briefMode: 'toggle',
  },
  {
    id: 'extra-language',
    name: 'Extra language', // COPY:
    description: 'Afrikaans, isiZulu or another language version.', // COPY:
    price: 3_500,
    perUnit: true,
    briefMode: 'count',
  },
  {
    id: 'booking',
    name: 'Booking or quote system', // COPY:
    description: 'Online bookings, quote calculators or appointment flows.', // COPY:
    price: 8_000,
    perUnit: false,
    briefMode: 'toggle',
  },
  {
    id: 'payments',
    name: 'Online payments', // COPY:
    description: 'Take payments without a full online shop.', // COPY:
    price: 7_500,
    perUnit: false,
    briefMode: 'toggle',
  },
  {
    id: 'integration',
    name: 'Integration', // COPY:
    description: 'Connect a CRM, WhatsApp, accounting or another system.', // COPY:
    price: 5_000,
    perUnit: true,
    briefMode: 'toggle',
  },
  {
    id: 'ai-feature',
    name: 'AI feature', // COPY:
    description: 'AI search, an assistant or document analysis on your site.', // COPY:
    price: 20_000,
    perUnit: false,
    briefMode: 'toggle',
  },
]

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id)
}
