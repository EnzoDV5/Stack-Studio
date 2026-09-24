/**
 * Clients for the logo marquee. With no `logo`, a text tile is rendered. To use a real logo,
 * add an SVG to /public/logos/ and set `logo: '/logos/name.svg'` (single colour works best:
 * it's tinted to fit the section).
 * The entries marked FICTIONAL are placeholders to fill the marquee. Remove them before launch.
 */
import type { Client } from '@/types'

export const clients: Client[] = [
  { id: 'gc-solar', name: 'GC Solar', sector: 'Energy' },
  { id: 'mpg-foundation', name: 'MPG Foundation', sector: 'NPO' },
  { id: 'placeholder-1', name: 'Northwind Studio', sector: 'Architecture' }, // COPY: FICTIONAL placeholder
  { id: 'placeholder-2', name: 'Veld Coffee', sector: 'Hospitality' }, // COPY: FICTIONAL placeholder
  { id: 'placeholder-3', name: 'Acacia Legal', sector: 'Legal' }, // COPY: FICTIONAL placeholder
  { id: 'placeholder-4', name: 'Kestrel & Oak', sector: 'Retail' }, // COPY: FICTIONAL placeholder
]
