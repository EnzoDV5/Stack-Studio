/**
 * PLACEHOLDER testimonials. Replace the quotes with real, approved words from each client
 * before launch, and add the name of the person quoted. Never publish invented quotes
 * attributed to real people.
 */
import type { Testimonial } from '@/types'
import { media } from './media'

export const testimonials: Testimonial[] = [
  {
    id: 'gc-solar',
    quote:
      'Stack took everything that was scattered across emails and WhatsApps and turned it into one site we’re proud to send people to.', // COPY: PLACEHOLDER QUOTE
    // COPY: add the name of the person quoted (shown above the role once set)
    role: 'Director', // COPY:
    company: 'GC Solar',
    logo: media.clients.gcSolar,
    projectSlug: 'gc-solar',
  },
  {
    id: 'mpg-foundation',
    quote:
      'They understood what we do and why it matters, and built something that explains it better than we could.', // COPY: PLACEHOLDER QUOTE
    // COPY: add the name of the person quoted (shown above the role once set)
    role: 'Founder', // COPY:
    company: 'MPG Foundation',
    logo: media.clients.mpgFoundation,
    projectSlug: 'mpg-foundation',
  },
]

export function getTestimonial(id: string | undefined): Testimonial | undefined {
  return testimonials.find((t) => t.id === id)
}
