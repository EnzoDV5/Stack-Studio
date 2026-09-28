/**
 * Real client references for Work / Case Studies. The home capability strip uses
 * data/technologies instead. Optional logos can be stored under /public/logos/.
 */
import type { Client } from '@/types'

export const clients: Client[] = [
  {
    id: 'gc-solar',
    name: 'GC Solar',
    sector: 'Renewable energy',
    logo: '/logos/clients/gc-solar.webp',
  },
  {
    id: 'mpg-foundation',
    name: 'MPG Foundation',
    sector: 'Non-profit',
    logo: '/logos/clients/mpg-foundation.webp',
  },
  {
    id: 'salon-friend',
    name: 'Salon Friend',
    sector: 'Salons & beauty',
    logo: '/logos/clients/salon-friend.webp',
  }, // COPY: confirm
]
