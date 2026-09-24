/**
 * PLACEHOLDER testimonials. Replace the quotes and names with real, approved words from
 * each client before launch. Never publish invented quotes attributed to real people.
 */
import type { Testimonial } from '@/types'

export const testimonials: Testimonial[] = [
  {
    id: 'gc-solar',
    quote:
      'Stack took everything that was scattered across emails and WhatsApps and turned it into one site we’re proud to send people to.', // COPY: PLACEHOLDER QUOTE
    name: 'Client Name', // COPY: real name
    role: 'Director', // COPY:
    company: 'GC Solar',
    projectSlug: 'gc-solar',
  },
  {
    id: 'mpg-foundation',
    quote:
      'They understood what we do and why it matters, and built something that explains it better than we could.', // COPY: PLACEHOLDER QUOTE
    name: 'Client Name', // COPY: real name
    role: 'Founder', // COPY:
    company: 'MPG Foundation',
    projectSlug: 'mpg-foundation',
  },
]

export function getTestimonial(id: string | undefined): Testimonial | undefined {
  return testimonials.find((t) => t.id === id)
}
