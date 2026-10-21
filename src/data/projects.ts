/**
 * Case studies. Each entry drives a card on /work and a full page at /work/:slug.
 * Media comes from data/media.ts. Metrics are real, client-approved figures only: leave the list
 * empty until there are some (the metrics section is skipped when it's empty).
 */
import type { Project } from '@/types'
import { media } from './media'

export const projects: Project[] = [
  {
    slug: 'gc-solar',
    name: 'GC Solar', // COPY:
    client: 'GC Solar — Smart Energy Solutions', // COPY:
    year: 2026, // COPY: confirm
    summary:
      'An immersive redesign of a Gauteng solar installer’s website, and the start of ongoing work together.', // COPY:
    sector: 'Renewable energy', // COPY:
    services: ['Redesign', 'Immersive web design', 'Development', 'Ongoing projects'], // COPY:
    stages: ['build', 'grow'],
    liveUrl: 'https://gcsolar-redesign-demo.netlify.app/',
    featured: true,
    thumbnail: media.projects.gcSolar.card,
    showcase: media.projects.gcSolar.showcase,
    logo: media.projects.gcSolar.logo,
    screen: media.projects.gcSolar.screen,
    preview: media.projects.gcSolar.preview,
    hero: { image: media.projects.gcSolar.showcase, video: media.projects.gcSolar.heroVideo },
    narrative: {
      problem: {
        heading: 'Good work, an ordinary website.', // COPY:
        paragraphs: [
          'GC Solar already had a website, but it didn’t match the quality of their installs. They came to us for a redesign, and asked for something immersive: a site that feels as considered as the systems they put on people’s roofs.', // COPY:
        ],
      },
      approach: {
        heading: 'Keep what works, make it memorable.', // COPY:
        paragraphs: [
          'We kept GC Solar’s identity and the content their customers rely on, then rebuilt the experience around it: a cinematic first impression, motion that guides the eye, and a clear path from “what do you install?” to asking for a quote.', // COPY:
        ],
      },
      build: {
        heading: 'Immersive, but still quick and clear.', // COPY:
        paragraphs: [
          'A fully responsive rebuild with scroll-led motion and real install photography, kept fast on mobile networks, with a guided quote request so enquiries arrive with the details the team needs.', // COPY:
        ],
      },
      result: {
        heading: 'A redesign, then an ongoing partnership.', // COPY:
        paragraphs: [
          'The redesign gave GC Solar a site they’re proud to send customers to, and it didn’t stop at launch: we keep working with them on new projects as the business grows.', // COPY:
        ],
      },
    },
    gallery: [
      { ...media.projects.gcSolar.gallery[0], span: 'full', caption: 'Solutions' }, // COPY:
      { ...media.projects.gcSolar.gallery[1], span: 'half', caption: 'Guided quote request' }, // COPY:
      { ...media.projects.gcSolar.gallery[2], span: 'half', caption: 'Completed projects' }, // COPY:
      { ...media.projects.gcSolar.gallery[3], span: 'full', caption: 'Company and quote pages' }, // COPY:
    ],
    metrics: [], // COPY: add real, client-approved results when there are some
    testimonialId: 'gc-solar',
    briefType: 'immersive-website',
  },
  {
    slug: 'mpg-foundation',
    name: 'MPG Foundation', // COPY:
    client: 'MPG Foundation', // COPY:
    year: 2026, // COPY: confirm
    summary: 'A foundation’s first website, built as charity work and grown with them ever since.', // COPY:
    sector: 'Non-profit', // COPY:
    services: ['Charity project', 'Web design', 'Development', 'Ongoing updates', 'Hosting & care'], // COPY:
    stages: ['build', 'grow', 'run'],
    liveUrl: 'https://mpgf.org.za/',
    featured: true,
    thumbnail: media.projects.mpgFoundation.card,
    showcase: media.projects.mpgFoundation.showcase,
    logo: media.projects.mpgFoundation.logo,
    screen: media.projects.mpgFoundation.screen,
    preview: media.projects.mpgFoundation.preview,
    hero: {
      image: media.projects.mpgFoundation.showcase,
      video: media.projects.mpgFoundation.heroVideo,
    },
    narrative: {
      problem: {
        heading: 'Starting from nothing.', // COPY:
        paragraphs: [
          'MPG Foundation does meaningful work in its community, but had no website at all: nowhere to explain what it does, show its projects or tell people how to give. We took it on as charity work.', // COPY:
        ],
      },
      approach: {
        heading: 'Tell the story, make giving simple.', // COPY:
        paragraphs: [
          'We shaped the foundation’s story with them from scratch, built around its projects and the people behind them, with a clear way to donate or get involved on every page.', // COPY:
        ],
      },
      build: {
        heading: 'Built to grow with them.', // COPY:
        paragraphs: [
          'The first version gave MPG a credible home online. Since then we’ve kept updating and improving it, adding projects, giving options and content as the foundation’s work has grown.', // COPY:
        ],
      },
      result: {
        heading: 'Reaching more people.', // COPY:
        paragraphs: [
          'The website now helps MPG reach more people and get a better response to its projects and appeals. We host it and look after it, so the team can focus on the work itself.', // COPY:
        ],
      },
    },
    gallery: [
      { ...media.projects.mpgFoundation.gallery[0], span: 'full', caption: 'What we do' }, // COPY:
      { ...media.projects.mpgFoundation.gallery[1], span: 'half', caption: 'Giving by EFT' }, // COPY:
      {
        ...media.projects.mpgFoundation.gallery[2],
        span: 'half',
        caption: 'How the work gets done',
      }, // COPY:
      {
        ...media.projects.mpgFoundation.gallery[3],
        span: 'full',
        caption: 'The waterfront project and giving',
      }, // COPY:
    ],
    metrics: [], // COPY: add real, client-approved results when there are some
    testimonialId: 'mpg-foundation',
    briefType: 'business-website',
  },
  {
    slug: 'salon-friend',
    name: 'Salon Friend', // COPY:
    client: 'Salon Friend', // COPY: confirm the client's full name
    year: 2026, // COPY: confirm
    summary:
      'From selling on Facebook and WhatsApp to an online store with its own admin dashboard.', // COPY:
    sector: 'Salons & beauty', // COPY: confirm
    services: ['E-commerce', 'Admin dashboard', 'Web design', 'Development', 'Hosting & care'], // COPY:
    stages: ['build', 'run', 'grow'],
    liveUrl: 'https://salon-friends.web.app/',
    thumbnail: media.projects.salonFriend.card,
    showcase: media.projects.salonFriend.showcase,
    logo: media.projects.salonFriend.logo,
    screen: media.projects.salonFriend.screen,
    preview: media.projects.salonFriend.preview,
    hero: { image: media.projects.salonFriend.showcase },
    narrative: {
      problem: {
        heading: 'Orders in the inbox.', // COPY:
        paragraphs: [
          'Salon Friend sold its products only through Facebook and WhatsApp. Every order meant messages back and forth, and keeping track of stock, payments and deliveries by hand.', // COPY:
        ],
      },
      approach: {
        heading: 'A shop for customers, a dashboard for the team.', // COPY:
        paragraphs: [
          'We planned two sides together: a store where customers can browse the catalogue and order themselves, and an admin dashboard where the team manages orders, products and everything behind them in one place.', // COPY:
        ],
      },
      build: {
        heading: 'An e-commerce site and an admin dashboard.', // COPY:
        paragraphs: [
          'A responsive online store with the full catalogue, product pages and checkout, plus a custom admin dashboard for orders, products and stock.', // COPY:
        ],
      },
      result: {
        heading: 'A real online business, still growing.', // COPY:
        paragraphs: [
          'Salon Friend now takes orders online instead of through chat threads. It’s an ongoing project: we host and look after the store and keep building on it with them.', // COPY:
        ],
      },
    },
    gallery: [
      { ...media.projects.salonFriend.gallery[0], span: 'full', caption: 'The catalogue' }, // COPY:
      { ...media.projects.salonFriend.gallery[1], span: 'half', caption: 'Product page' }, // COPY:
      { ...media.projects.salonFriend.gallery[2], span: 'half', caption: 'Catalogue on mobile' }, // COPY:
      {
        ...media.projects.salonFriend.gallery[3],
        span: 'full',
        caption: 'Brands and product pages',
      }, // COPY:
    ],
    metrics: [], // COPY: add real, client-approved results when there are some
    testimonialId: 'salon-friend',
    briefType: 'ecommerce',
  },
]

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/** The next project in the list (wraps around). */
export function getNextProject(slug: string): Project | undefined {
  const i = projects.findIndex((p) => p.slug === slug)
  return i === -1 ? undefined : projects[(i + 1) % projects.length]
}

export const featuredProjects = projects.filter((p) => p.featured)
