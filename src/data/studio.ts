import type { Founder, ValueItem } from '@/types'
import { media } from './media'

export const founders: Founder[] = [
  {
    id: 'enzo',
    name: 'Enzo De Vittorio',
    role: 'Co-founder · Front-end and design', // COPY: confirm title
    line: 'Designs and builds the front-end you click through, and works on the back-end too.', // COPY:
    bio: 'Enzo leads UX, visual design, motion and front-end development, and works on the back-end as well, so the whole build hangs together. He cares about sites that are visually strong and actually work.', // COPY:
    focus: ['Front-end', 'UX / UI', 'Motion', 'Back-end'], // COPY:
    portrait: media.founders.enzo,
    linkedin: 'https://www.linkedin.com/', // COPY: personal LinkedIn URL
  },
  {
    id: 'armand',
    name: 'Armand Naudé',
    role: 'Co-founder · Back-end and delivery', // COPY: confirm title
    line: 'Builds what runs underneath, helps on the front-end and keeps it all running.', // COPY:
    bio: 'Armand focuses on back-end development, hosting and client delivery, and helps build the front-end too. He makes sure every project ships on time and keeps running smoothly long after launch.', // COPY:
    focus: ['Back-end', 'Hosting', 'Client delivery', 'Front-end'], // COPY:
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
    title: 'Founders on every project', // COPY:
    body: 'We stay involved from the first call to launch, so the thinking behind your project carries all the way through.', // COPY:
  },
  {
    id: 'growing',
    title: 'Growing with our clients', // COPY:
    body: 'We’re building a studio that grows with the businesses we work for: more people and more capability, with the same attention on every project.', // COPY:
  },
  {
    id: 'real',
    title: 'Real, deployed products', // COPY:
    body: 'Design and development under one roof, so what you approve is what gets built.', // COPY:
  },
]
