import type { Founder, ValueItem } from '@/types'
import { media } from './media'

export const founders: Founder[] = [
  {
    id: 'enzo',
    name: 'Enzo De Vittorio',
    role: 'Co-founder · Design and front-end', // COPY: confirm title
    bio: 'Enzo leads UX, visual design and motion, and builds the front-end that brings it to life. He cares about sites that are visually strong and actually work.', // COPY:
    focus: ['UX / UI', 'Motion', 'Front-end'], // COPY:
    portrait: media.founders.enzo,
    linkedin: 'https://www.linkedin.com/', // COPY: personal LinkedIn URL
  },
  {
    id: 'armand',
    name: 'Armand Naudé',
    role: 'Co-founder · Development and delivery', // COPY: confirm title
    bio: 'Armand leads development, hosting and client delivery, making sure every project ships on time and keeps running smoothly long after launch.', // COPY:
    focus: ['Development', 'Hosting', 'Client delivery'], // COPY:
    portrait: media.founders.armand,
    linkedin: 'https://www.linkedin.com/', // COPY: personal LinkedIn URL
  },
]

export const values: ValueItem[] = [
  {
    id: 'proof',
    title: 'Proof over promises', // COPY:
    body: 'We show real work, real process and real prices. You shouldn’t have to take our word for it.', // COPY:
  },
  {
    id: 'craft',
    title: 'Craft, not decoration', // COPY:
    body: 'Every animation, every word, every pixel has a job. If it doesn’t help someone decide, it goes.', // COPY:
  },
  {
    id: 'clarity',
    title: 'Clarity at every step', // COPY:
    body: 'Plain language, fixed quotes and a staging link from day one. No black boxes.', // COPY:
  },
  {
    id: 'partnership',
    title: 'In it for the long run', // COPY:
    body: 'We host, care for and improve what we build. Launch day is the start, not the end.', // COPY:
  },
]

export const principles: ValueItem[] = [
  {
    id: 'direct',
    title: 'You talk to the makers', // COPY:
    body: 'Two founders, no middlemen. The people on the call are the people doing the work.', // COPY:
  },
  {
    id: 'small',
    title: 'Small on purpose', // COPY:
    body: 'We take on a few projects at a time so each gets our full attention.', // COPY:
  },
  {
    id: 'real',
    title: 'Real, deployed products', // COPY:
    body: 'Design and development under one roof, so what you approve is what gets built.', // COPY:
  },
]
