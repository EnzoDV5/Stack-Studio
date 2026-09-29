/**
 * Case studies. Each entry drives a card on /work and a full page at /work/:slug.
 * Media comes from data/media.ts. METRICS ARE PLACEHOLDERS: replace them with real,
 * client-approved figures before launch.
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
      'A proof-first website that turns rooftop installs into quote requests for a Gauteng solar installer.', // COPY:
    sector: 'Renewable energy', // COPY:
    services: ['UX strategy', 'Web design', 'Development', 'SEO & analytics'], // COPY:
    stages: ['build', 'run'], // COPY: confirm
    liveUrl: 'https://example.com/gc-solar', // COPY: replace with the live GC Solar URL
    featured: true,
    thumbnail: media.projects.gcSolar.thumbnail,
    screen: media.projects.gcSolar.screen,
    preview: media.projects.gcSolar.preview,
    hero: { image: media.projects.gcSolar.hero, video: media.projects.gcSolar.heroVideo },
    narrative: {
      problem: {
        heading: 'Great installs, no way to show them.', // COPY:
        paragraphs: [
          'GC Solar’s work was strong, but prospective customers only ever saw a phone number and a few photos on social media. Every lead started with the same questions: what do you install, what does it cost, and can I trust you?', // COPY:
          'Quotes were handled over scattered email threads, which made follow-up slow and hard to track.', // COPY:
        ],
      },
      approach: {
        heading: 'Lead with proof, then make quoting effortless.', // COPY:
        paragraphs: [
          'We mapped the questions homeowners and businesses ask before they commit, and structured the site around answering them in order: what we do, the proof, the process, then a clear path to a quote.', // COPY:
          'The visual direction keeps GC Solar’s green identity but gives it an editorial, confident feel, with real install photography and plain-language explanations.', // COPY:
        ],
      },
      build: {
        heading: 'Fast, responsive and easy to update.', // COPY:
        paragraphs: [
          'A responsive build with a guided quote request that captures system size, property type and timing up front, so the first call is useful.', // COPY:
          'Pages are optimised for speed on mobile networks, with on-page SEO for local solar searches and analytics that track quote requests end to end.', // COPY:
        ],
      },
      result: {
        heading: 'A site that sells before the first call.', // COPY:
        paragraphs: [
          'GC Solar now sends one link instead of a stack of attachments. Enquiries arrive with the details the team needs to quote quickly.', // COPY:
        ],
      },
    },
    gallery: [
      { ...media.projects.gcSolar.gallery[0], span: 'full', caption: 'Solutions' }, // COPY:
      { ...media.projects.gcSolar.gallery[1], span: 'half', caption: 'Guided quote request' }, // COPY:
      { ...media.projects.gcSolar.gallery[2], span: 'half', caption: 'Completed projects' }, // COPY:
      { ...media.projects.gcSolar.gallery[3], span: 'full', caption: 'Company and quote pages' }, // COPY:
    ],
    metrics: [
      { value: '6 wks', label: 'Brief to launch' }, // COPY: PLACEHOLDER METRIC
      { value: '98', label: 'Lighthouse performance' }, // COPY: PLACEHOLDER METRIC
      { value: '2×', label: 'Quote requests vs. before' }, // COPY: PLACEHOLDER METRIC
    ],
    testimonialId: 'gc-solar',
    briefType: 'business-website',
  },
  {
    slug: 'mpg-foundation',
    name: 'MPG Foundation', // COPY:
    client: 'MPG Foundation', // COPY:
    year: 2026, // COPY: confirm
    summary:
      'A warm, trustworthy home for a community foundation, built to explain its impact and make giving simple.', // COPY:
    sector: 'Non-profit', // COPY:
    services: ['Content strategy', 'Web design', 'Development', 'Hosting & care'], // COPY:
    stages: ['build', 'run'], // COPY: confirm
    liveUrl: 'https://example.com/mpg-foundation', // COPY: replace with the live MPG Foundation URL
    featured: true,
    thumbnail: media.projects.mpgFoundation.thumbnail,
    screen: media.projects.mpgFoundation.screen,
    preview: media.projects.mpgFoundation.preview,
    hero: {
      image: media.projects.mpgFoundation.hero,
      video: media.projects.mpgFoundation.heroVideo,
    },
    narrative: {
      problem: {
        heading: 'Real impact, hard to see from outside.', // COPY:
        paragraphs: [
          'MPG Foundation runs meaningful programmes, but donors, partners and volunteers had no single place to understand what the foundation does or how to get involved.', // COPY:
          'Without clear proof of impact, every partnership conversation started from zero.', // COPY:
        ],
      },
      approach: {
        heading: 'Tell the story through people and outcomes.', // COPY:
        paragraphs: [
          'We built the information architecture around three audiences (donors, partners and volunteers), each with a clear next step.', // COPY:
          'The design pairs MPG’s green and orange identity with generous whitespace and honest photography, so the work speaks for itself.', // COPY:
        ],
      },
      build: {
        heading: 'Simple to run for a small team.', // COPY:
        paragraphs: [
          'An accessible, responsive build with editable programme pages and impact stories, plus simple donate and volunteer flows.', // COPY:
          'Hosted and cared for by Stack, so the team can focus on the programmes rather than the website.', // COPY:
        ],
      },
      result: {
        heading: 'One link that earns trust.', // COPY:
        paragraphs: [
          'The foundation now shares a single, credible link in funding applications and partner conversations.', // COPY:
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
    metrics: [
      { value: '3', label: 'Audiences, one clear path each' }, // COPY: PLACEHOLDER METRIC
      { value: '100', label: 'Lighthouse accessibility' }, // COPY: PLACEHOLDER METRIC
      { value: '< 2s', label: 'Load time on mobile' }, // COPY: PLACEHOLDER METRIC
    ],
    testimonialId: 'mpg-foundation',
    briefType: 'business-website',
  },
  {
    slug: 'salon-friend',
    name: 'Salon Friend', // COPY:
    client: 'Salon Friend', // COPY: confirm the client's full name
    year: 2026, // COPY: confirm
    summary: 'A website for Salon Friend, designed and built by Stack.', // COPY: PLACEHOLDER. One line on what we built and why.
    sector: 'Salons & beauty', // COPY: confirm
    services: ['Web design', 'Development'], // COPY: confirm
    stages: ['build'], // COPY: confirm
    thumbnail: media.projects.salonFriend.thumbnail,
    screen: media.projects.salonFriend.screen,
    preview: media.projects.salonFriend.preview,
    hero: { image: media.projects.salonFriend.hero },
    narrative: {
      problem: {
        heading: 'Case study coming soon.', // COPY: PLACEHOLDER
        paragraphs: [
          'We’re writing up the Salon Friend story: what they needed, how we approached it, what we built and how it’s going.', // COPY: PLACEHOLDER
        ],
      },
      approach: {
        heading: 'How we approached it.', // COPY: PLACEHOLDER
        paragraphs: ['PLACEHOLDER: the key decisions and why.'], // COPY:
      },
      build: {
        heading: 'What we built.', // COPY: PLACEHOLDER
        paragraphs: ['PLACEHOLDER: the pages, features and stack.'], // COPY:
      },
      result: {
        heading: 'The result.', // COPY: PLACEHOLDER
        paragraphs: ['PLACEHOLDER: the outcome, ideally in the client’s words.'], // COPY:
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
    briefType: 'business-website', // COPY: confirm
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
