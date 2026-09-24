/**
 * Case studies. Each entry drives a card on /work and a full page at /work/:slug.
 * Media comes from data/media.ts. METRICS ARE PLACEHOLDERS: replace them with real,
 * client-approved figures before launch.
 */
import type { Project, ProjectCategory } from '@/types'
import { media } from './media'

export const projectCategories: ProjectCategory[] = [
  { id: 'website', label: 'Websites' }, // COPY:
  { id: 'npo', label: 'NPO' }, // COPY:
  { id: 'energy', label: 'Energy' }, // COPY:
  { id: 'brand', label: 'Brand' }, // COPY:
  { id: 'web-app', label: 'Web apps' }, // COPY:
]

export const projects: Project[] = [
  {
    slug: 'gc-solar',
    name: 'GC Solar', // COPY:
    client: 'GC Solar — Smart Energy Solutions', // COPY:
    year: 2026, // COPY: confirm
    summary:
      'A proof-first website that turns rooftop installs into quote requests for a Gauteng solar installer.', // COPY:
    categories: ['website', 'energy'],
    services: ['UX strategy', 'Web design', 'Development', 'SEO & analytics'], // COPY:
    stages: ['build', 'run'], // COPY: confirm
    liveUrl: 'https://example.com/gc-solar', // COPY: replace with the live GC Solar URL
    featured: true,
    thumbnail: media.projects.gcSolar.thumbnail,
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
      { ...media.projects.gcSolar.gallery[0], span: 'full', caption: 'Services overview' }, // COPY:
      { ...media.projects.gcSolar.gallery[1], span: 'half', caption: 'Guided quote request' }, // COPY:
      { ...media.projects.gcSolar.gallery[2], span: 'half', caption: 'Install gallery' }, // COPY:
      { ...media.projects.gcSolar.gallery[3], span: 'full' },
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
    categories: ['website', 'npo'],
    services: ['Content strategy', 'Web design', 'Development', 'Hosting & care'], // COPY:
    stages: ['build', 'run'], // COPY: confirm
    liveUrl: 'https://example.com/mpg-foundation', // COPY: replace with the live MPG Foundation URL
    featured: true,
    thumbnail: media.projects.mpgFoundation.thumbnail,
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
      { ...media.projects.mpgFoundation.gallery[0], span: 'full', caption: 'Programmes overview' }, // COPY:
      { ...media.projects.mpgFoundation.gallery[1], span: 'half', caption: 'Donate flow' }, // COPY:
      { ...media.projects.mpgFoundation.gallery[2], span: 'half', caption: 'Impact stories' }, // COPY:
      { ...media.projects.mpgFoundation.gallery[3], span: 'full' },
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
    slug: 'sample-project',
    name: 'Kestrel & Oak (sample)', // COPY: FAKE SAMPLE PROJECT. Replace or remove before launch.
    client: 'Sample client — not a real project', // COPY:
    year: 2026,
    summary:
      'A placeholder case study that shows how the template handles a brand and web-app project.', // COPY:
    categories: ['brand', 'web-app'],
    services: ['Brand refresh', 'Product design', 'Web app'], // COPY:
    stages: ['build'],
    isSample: true,
    thumbnail: media.projects.sample.thumbnail,
    preview: media.projects.sample.preview,
    hero: { image: media.projects.sample.hero },
    narrative: {
      problem: {
        heading: 'This is sample content.', // COPY:
        paragraphs: [
          'Use this entry as a reference for how a third case study will look. Every field here is placeholder copy.', // COPY:
        ],
      },
      approach: {
        heading: 'Replace with a real approach.', // COPY:
        paragraphs: ['Describe how you framed the problem and made the key decisions.'], // COPY:
      },
      build: {
        heading: 'Replace with the real build.', // COPY:
        paragraphs: ['Explain what was built, the stack and anything clever under the hood.'], // COPY:
      },
      result: {
        heading: 'Replace with real results.', // COPY:
        paragraphs: ['Share the outcome in the client’s words or with measurable results.'], // COPY:
      },
    },
    gallery: [
      { ...media.projects.sample.gallery[0], span: 'full' },
      { ...media.projects.sample.gallery[1], span: 'half' },
      { ...media.projects.sample.gallery[2], span: 'half' },
    ],
    metrics: [
      { value: '00', label: 'Sample metric' }, // COPY:
      { value: '00%', label: 'Sample metric' }, // COPY:
    ],
    briefType: 'web-app',
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
