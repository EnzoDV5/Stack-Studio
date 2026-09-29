/**
 * Public hourly rates for development and hands-on care. These are client-facing prices,
 * not internal costs.
 */
import type { Rate } from '@/types'

export const BUILD_RATE_PER_HOUR = 400
export const CARE_RATE_PER_HOUR = 200

export const rates: Rate[] = [
  {
    id: 'feature',
    name: 'Changes, additions & redesigns', // COPY:
    pricePerHour: BUILD_RATE_PER_HOUR,
    description:
      'For an existing website or app. We estimate the working hours and give you a quote before work starts.', // COPY:
    examples: [
      'Website updates', // COPY:
      'New pages and sections', // COPY:
      'New features', // COPY:
      'Booking and payments', // COPY:
      'Integrations', // COPY:
      'UX/UI improvements', // COPY:
      'Partial or full redesigns', // COPY:
      'App and software improvements', // COPY:
    ],
  },
  {
    id: 'care',
    name: 'Care & support', // COPY:
    pricePerHour: CARE_RATE_PER_HOUR,
    description: 'Maintenance, fixes and support during working hours.', // COPY:
  },
]

export function getRate(id: Rate['id']): Rate {
  const rate = rates.find((r) => r.id === id)
  if (!rate) throw new Error(`Unknown rate: ${id}`)
  return rate
}
