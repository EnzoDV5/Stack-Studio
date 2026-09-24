import type { Service } from '@/types'

export const services: Service[] = [
  {
    id: 'websites',
    name: 'Brand-led websites', // COPY:
    summary: 'Design and development of sites that look the part and bring in work.', // COPY:
    description: [
      'Your website is often the first proof a client sees. We design it around the questions your customers actually ask, then build it to be fast, accessible and easy to update.', // COPY:
      'Every site is custom-designed around your brand. No templates, no page builders.', // COPY:
    ],
    deliverables: [
      'Sitemap, user flow and content plan', // COPY:
      'Custom design for desktop and mobile', // COPY:
      'Responsive development and CMS', // COPY:
      'Enquiry flows and analytics', // COPY:
    ],
    timeline: '2–10 weeks', // COPY:
    pricePackageId: 'launch',
    briefType: 'business',
  },
  {
    id: 'motion',
    name: 'Motion and interaction', // COPY:
    summary: 'Cinematic scroll, transitions and micro-interactions that signal craft.', // COPY:
    description: [
      'Motion is how a site feels. We use it with restraint to guide attention, show quality and make interactions feel considered, never decorative for its own sake.', // COPY:
    ],
    deliverables: [
      'Motion direction and principles', // COPY:
      'Scroll-driven storytelling', // COPY:
      'Page transitions and hover states', // COPY:
      'Reduced-motion accessible fallbacks', // COPY:
    ],
    timeline: 'Part of Signature builds', // COPY:
    pricePackageId: 'signature',
    briefType: 'signature',
  },
  {
    id: 'products',
    name: 'Digital products', // COPY:
    summary: 'Portals, dashboards and web apps built around your workflow.', // COPY:
    description: [
      'When a website isn’t enough, we design and build the tools behind it: booking systems, client portals, internal dashboards and more.', // COPY:
    ],
    deliverables: [
      'UX research and flows', // COPY:
      'Interactive prototypes', // COPY:
      'Front-end and back-end build', // COPY:
      'Staged releases and support', // COPY:
    ],
    timeline: '8–14 weeks', // COPY:
    pricePackageId: 'product',
    briefType: 'product',
  },
  {
    id: 'care',
    name: 'Hosting, care and growth', // COPY:
    summary: 'We host it, keep it healthy and keep improving it every month.', // COPY:
    description: [
      'A website is never finished. Our monthly plans cover fast hosting, security, updates and small changes, with growth retainers for ongoing SEO, analytics and conversion work.', // COPY:
    ],
    deliverables: [
      'Managed hosting and backups', // COPY:
      'Updates and monitoring', // COPY:
      'Monthly content edits', // COPY:
      'SEO and analytics reporting', // COPY:
    ],
    timeline: 'Monthly', // COPY:
    briefType: 'business',
  },
]
