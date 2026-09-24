/**
 * Public hourly rates for work outside a retainer (04 Grow). These are client-facing
 * prices, not internal costs.
 */
import type { Rate } from '@/types'

export const rates: Rate[] = [
  {
    id: 'feature',
    name: 'Feature development', // COPY:
    pricePerHour: 1_200,
    description: 'Without a retainer, billed hourly or quoted as a fixed project.', // COPY:
    examples: [
      'New dashboards', // COPY:
      'Payment methods', // COPY:
      'Booking features', // COPY:
      'AI features', // COPY:
      'Reports', // COPY:
      'User roles', // COPY:
      'Integrations', // COPY:
      'New pages', // COPY:
      'UX improvements', // COPY:
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency work', // COPY:
    pricePerHour: 1_600,
    description: 'Same-day, without a support agreement. Retainer clients get priority.', // COPY:
  },
]

export function getRate(id: Rate['id']): Rate {
  const rate = rates.find((r) => r.id === id)
  if (!rate) throw new Error(`Unknown rate: ${id}`)
  return rate
}
