/**
 * Page-level copy: meta tags, heroes, section headings and CTAs for every route.
 * Sections receive these as props; nothing is hardcoded in components.
 */
import type { CtaContent, PageHeroContent, PageMetaContent, SectionIntro } from '@/types'

export const pageMeta = {
  home: {
    title: 'Stack Studio — Brand-led websites, built to convert', // COPY:
    description:
      'A two-person web studio in Centurion, South Africa. We design and build brand-led, cinematic websites and digital products for small businesses and NPOs.', // COPY:
    path: '/',
  },
  work: {
    title: 'Work', // COPY:
    description:
      'Selected case studies from Stack Studio: real problems, how we approached them, what we built and the results.', // COPY:
    path: '/work',
  },
  services: {
    title: 'Services', // COPY:
    description:
      'Brand-led websites, motion and interaction, digital products, and hosting and care. What we build and how a project runs.', // COPY:
    path: '/services',
  },
  pricing: {
    title: 'Pricing', // COPY:
    description:
      'Transparent starting prices for once-off website builds and monthly hosting, care and growth plans. No hidden pricing.', // COPY:
    path: '/pricing',
  },
  studio: {
    title: 'Studio', // COPY:
    description:
      'Meet Stack Studio: Enzo De Vittorio and Armand Naudé, a two-person studio in Centurion building websites that work as hard as the businesses behind them.', // COPY:
    path: '/studio',
  },
  start: {
    title: 'Start a project', // COPY:
    description:
      'Tell us about your project in two minutes with a guided brief and get a rough estimate before you send it.', // COPY:
    path: '/start',
  },
  privacy: {
    title: 'Privacy notice', // COPY:
    description:
      'How Stack Studio collects, uses and protects your personal information under POPIA.', // COPY:
    path: '/privacy',
  },
  notFound: {
    title: 'Page not found', // COPY:
    description: 'This page doesn’t exist, but your project still can.', // COPY:
    path: '/404',
    noindex: true,
  },
} satisfies Record<string, PageMetaContent>

/** Shared closing CTA (orange band) used at the end of most pages. */
export const closingCta: CtaContent = {
  eyebrow: 'Start a project', // COPY:
  title: 'Let’s build the thing that brings in the work.', // COPY:
  body: 'Two minutes, a few questions and a rough estimate before you hit send.', // COPY:
  label: 'Start a project', // COPY:
  to: '/start',
}

/* ---------- Home ---------- */
export const homeContent = {
  hero: {
    eyebrow: 'Web studio · Centurion, ZA', // COPY:
    title: 'Brand-led websites that do the work.', // COPY:
    intro:
      'We’re a two-person studio designing and building cinematic, conversion-focused websites for small businesses and NPOs.', // COPY:
    cta: { label: 'Start a project', to: '/start' }, // COPY:
    secondaryCta: { label: 'See the work', to: '/work' }, // COPY:
    meta: [
      { label: 'Based in', value: 'Centurion, Gauteng' }, // COPY:
      { label: 'Focus', value: 'SMEs & NPOs' }, // COPY:
      { label: 'Est.', value: '2026' }, // COPY:
    ],
    scrollLabel: 'Scroll', // COPY:
  },
  clients: {
    label: 'Trusted by teams who needed more than a template', // COPY:
  },
  work: {
    eyebrow: 'Selected work', // COPY:
    title: 'Proof, not promises.', // COPY:
    intro: 'Two real projects, start to finish: the problem, the thinking and the result.', // COPY:
    cta: { label: 'All work', to: '/work' }, // COPY:
    cardCta: 'View case study', // COPY:
    cursorLabel: 'View', // COPY:
  },
  services: {
    eyebrow: 'Services', // COPY:
    title: 'What we build.', // COPY:
    intro:
      'Design and development under one roof, from first sketch to the site that keeps improving.', // COPY:
    fromLabel: 'From', // COPY:
    startLabel: 'Start with this', // COPY:
    detailsLabel: 'Service details', // COPY:
    deliverablesLabel: 'You get', // COPY:
    timelineLabel: 'Typical timeline', // COPY:
  },
  process: {
    eyebrow: 'Process', // COPY:
    title: 'How a project runs.', // COPY:
    intro: 'Six clear steps, a staging link from week one and no surprises.', // COPY:
    stepLabel: 'Step', // COPY:
  },
  pricing: {
    eyebrow: 'Pricing', // COPY:
    title: 'Starting points, not hidden prices.', // COPY:
    intro:
      'Every project is quoted properly, but you should know roughly where you stand before we talk.', // COPY:
    fromLabel: 'From', // COPY:
    monthly: {
      eyebrow: 'After launch', // COPY:
      title: 'Monthly plans keep it fast, secure and improving.', // COPY:
      body: 'Hosting, care and growth retainers, so your site never goes stale.', // COPY:
      fromLabel: 'From', // COPY:
      perMonth: '/month', // COPY:
    },
    cta: { label: 'See full pricing', to: '/pricing' }, // COPY:
    estimateCta: { label: 'Get an estimate', to: '/start' }, // COPY:
  },
  studio: {
    eyebrow: 'Studio', // COPY:
    title: 'Two founders. No middlemen.', // COPY:
    body: 'Stack Studio is Enzo De Vittorio and Armand Naudé. We keep the studio small on purpose, so the people you meet are the people who design, build and look after your site.', // COPY:
    cta: { label: 'Meet the studio', to: '/studio' }, // COPY:
  },
}

/* ---------- Work ---------- */
export const workContent = {
  hero: {
    eyebrow: 'Work', // COPY:
    title: 'What we’ve built.', // COPY:
    intro:
      'Real projects for real businesses. Each case study shows the problem, the approach, the build and the result.', // COPY:
  } satisfies PageHeroContent,
  filterLabel: 'Filter projects', // COPY:
  allLabel: 'All', // COPY:
  emptyLabel: 'No projects in this category yet.', // COPY:
  sampleLabel: 'Sample', // COPY:
  cardCta: 'View case study', // COPY:
  cursorLabel: 'View', // COPY:
  countLabel: (n: number) => `${n} project${n === 1 ? '' : 's'}`, // COPY:
}

/* ---------- Case study template labels ---------- */
export const caseStudyContent = {
  eyebrow: 'Case study', // COPY:
  meta: {
    client: 'Client', // COPY:
    year: 'Year', // COPY:
    services: 'Services', // COPY:
    live: 'Live site', // COPY:
    visit: 'Visit site', // COPY:
  },
  narrativeLabels: {
    problem: 'Problem', // COPY:
    approach: 'Approach', // COPY:
    build: 'Build', // COPY:
    result: 'Result', // COPY:
  },
  galleryLabel: 'Gallery', // COPY:
  metricsLabel: 'Results', // COPY:
  metricsNote: 'Placeholder figures, to be replaced with real results.', // COPY: remove once metrics are real
  sampleNotice: 'This is a sample project with placeholder content.', // COPY:
  cta: {
    eyebrow: 'Like what you see?', // COPY:
    title: 'Start a project like this.', // COPY:
    body: 'We’ll pre-fill the brief with this project type. Just add your details.', // COPY:
    label: 'Start a project', // COPY:
    to: '/start',
  } satisfies CtaContent,
  nextLabel: 'Next project', // COPY:
}

/* ---------- Services ---------- */
export const servicesContent = {
  hero: {
    eyebrow: 'Services', // COPY:
    title: 'Everything your site needs to earn trust.', // COPY:
    intro: 'Four ways we help, all designed and built in-house, with clear starting prices.', // COPY:
  } satisfies PageHeroContent,
  detailLabels: {
    deliverables: 'What you get', // COPY:
    timeline: 'Typical timeline', // COPY:
    from: 'From', // COPY:
    monthlyFrom: 'Plans from', // COPY:
    perMonth: '/month', // COPY:
    start: 'Start with this', // COPY:
  },
  faq: {
    eyebrow: 'FAQ', // COPY:
    title: 'Questions, answered.', // COPY:
  } satisfies SectionIntro,
}

/* ---------- Pricing ---------- */
export const pricingContent = {
  hero: {
    eyebrow: 'Pricing', // COPY:
    title: 'Transparent pricing. No surprises.', // COPY:
    intro:
      'Two ways to work with us: a once-off build, and a monthly plan that keeps it running and improving.', // COPY:
  } satisfies PageHeroContent,
  models: {
    project: {
      eyebrow: 'Once-off', // COPY:
      title: 'Project builds', // COPY:
      intro: 'Design and development, quoted as a fixed price after a discovery call.', // COPY:
    },
    monthly: {
      eyebrow: 'Monthly', // COPY:
      title: 'Monthly plans', // COPY:
      intro: 'Hosting, care and growth retainers that keep your site healthy and improving.', // COPY:
    },
    fromLabel: 'From', // COPY:
    perMonth: '/month', // COPY:
    pagesLabel: (n: number) => `${n} page${n === 1 ? '' : 's'} included`, // COPY:
    weeksLabel: (a: number, b: number) => `${a}–${b} weeks`, // COPY:
    minTermLabel: (n: number) => `${n}-month minimum`, // COPY:
    popularLabel: 'Most popular', // COPY:
    choose: 'Choose', // COPY:
  },
  addOns: {
    eyebrow: 'Add-ons', // COPY:
    title: 'Extras, when you need them.', // COPY:
    onceLabel: 'once-off', // COPY:
    monthlyLabel: '/month', // COPY:
    nameLabel: 'Add-on', // COPY:
    priceLabel: 'Price', // COPY:
  },
  estimator: {
    eyebrow: 'Not sure which fits?', // COPY:
    title: 'Get a rough estimate in two minutes.', // COPY:
    body: 'Answer a few questions and see a live estimate before you send anything.', // COPY:
    label: 'Start the estimate', // COPY:
    to: '/start',
  } satisfies CtaContent,
  faq: {
    eyebrow: 'Pricing FAQ', // COPY:
    title: 'The money questions.', // COPY:
  } satisfies SectionIntro,
}

/* ---------- Studio ---------- */
export const studioContent = {
  hero: {
    eyebrow: 'Studio', // COPY:
    title: 'A small studio with big standards.', // COPY:
    intro:
      'Stack Studio was founded in Centurion to give growing businesses and NPOs a digital presence as serious as the work they do.', // COPY:
  } satisfies PageHeroContent,
  intro: {
    eyebrow: 'Who we are', // COPY:
    title: 'Design, motion and development in one team.', // COPY:
    paragraphs: [
      'Most small businesses end up choosing between a designer who can’t build and a developer who can’t design. We started Stack to close that gap: one small team that handles strategy, UX, visual design, motion and front-end, and then deploys it for real.', // COPY:
      'The result is websites that look the part and actually work: fast, accessible, easy to update and designed to turn visitors into enquiries.', // COPY:
    ],
  },
  founders: {
    eyebrow: 'Founders', // COPY:
    title: 'The people you’ll work with.', // COPY:
  } satisfies SectionIntro,
  linkedinLabel: 'LinkedIn', // COPY:
  howWeWork: {
    eyebrow: 'How we work', // COPY:
    title: 'Small on purpose.', // COPY:
  } satisfies SectionIntro,
  values: {
    eyebrow: 'Values', // COPY:
    title: 'What we won’t compromise on.', // COPY:
  } satisfies SectionIntro,
}

/* ---------- 404 ---------- */
export const notFoundContent = {
  eyebrow: 'Error 404', // COPY:
  title: 'This page took a wrong turn.', // COPY:
  body: 'The link might be old, or the page may have moved. Let’s get you somewhere useful.', // COPY:
  home: { label: 'Back home', to: '/' }, // COPY:
  start: { label: 'Start a project', to: '/start' }, // COPY:
}

/* ---------- Privacy (POPIA) ---------- */
export const privacyContent = {
  hero: {
    eyebrow: 'Privacy · POPIA', // COPY:
    title: 'Your information, handled properly.', // COPY:
    intro:
      'This notice explains what we collect when you contact us or send a brief, why we collect it and what your rights are under the Protection of Personal Information Act (POPIA).', // COPY:
  } satisfies PageHeroContent,
  updated: 'Last updated: September 2026 · PLACEHOLDER: have this reviewed before launch', // COPY:
  sections: [
    {
      heading: 'Who we are', // COPY:
      body: [
        'Stack Studio (“we”, “us”) is a web studio based in Centurion, Gauteng, South Africa. We are the responsible party for personal information you share with us through this website.', // COPY:
      ],
    },
    {
      heading: 'What we collect', // COPY:
      body: [
        'When you complete the Start a project brief, we collect your name, email address and optional phone number and company name, plus the project details you choose to share (project type, scope, features, timeline and budget range).', // COPY:
        'If analytics are enabled, we use privacy-friendly, cookieless analytics that record anonymous page views and events (such as clicking “Start a project”). No personal information is collected this way.', // COPY:
      ],
    },
    {
      heading: 'Why we collect it', // COPY:
      body: [
        'We use your information only to respond to your enquiry, prepare a quote and communicate with you about your project. We do not sell your information or use it for unrelated marketing.', // COPY:
      ],
    },
    {
      heading: 'Who we share it with', // COPY:
      body: [
        'Your brief is delivered to us through a form-processing service (operator) that stores it securely on our behalf. We don’t share it with anyone else unless the law requires us to.', // COPY: name the operator (e.g. Formspree/EmailJS)
      ],
    },
    {
      heading: 'How long we keep it', // COPY:
      body: [
        'We keep enquiry information for as long as needed to respond and, if we work together, for the duration of the project and any legal record-keeping period afterwards. Unsuccessful enquiries are deleted within 12 months.', // COPY:
      ],
    },
    {
      heading: 'Your rights', // COPY:
      body: [
        'You may ask us what personal information we hold about you, ask us to correct or delete it, or object to how we process it. You also have the right to lodge a complaint with the Information Regulator of South Africa.', // COPY:
      ],
    },
    {
      heading: 'Contact', // COPY:
      body: ['For any privacy question or request, email us at the address below.'], // COPY:
    },
  ],
  contactLabel: 'Privacy contact', // COPY:
  backToBrief: { label: 'Back to the brief', to: '/start' }, // COPY:
}
