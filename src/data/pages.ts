/**
 * Page-level copy: meta tags, heroes, section headings and CTAs for every route.
 * Sections receive these as props; nothing is hardcoded in components.
 */
import type { CtaContent, PageHeroContent, PageMetaContent, SectionIntro } from '@/types'

export const pageMeta = {
  home: {
    title: 'Stack Studio — Brand-led websites, built to convert', // COPY:
    description:
      'A founder-led web studio in Centurion, South Africa. We design and build brand-led, cinematic websites and digital products for businesses of every kind.', // COPY:
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
      'Starting prices for once-off website builds and monthly hosting, care and growth plans, so you know roughly where you stand before we talk.', // COPY:
    path: '/pricing',
  },
  studio: {
    title: 'Studio', // COPY:
    description:
      'Meet Stack Studio, the founder-led web studio in Centurion started by Enzo De Vittorio and Armand Naudé, building websites that work as hard as the businesses behind them.', // COPY:
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

/** Decorative source characters used by code-to-title heading reveals. */
export const closingCtaCode = [
  'const idea = await discover();', // COPY:
  'strategy.align({ brand, goals });', // COPY:
  'design.systems.stack();', // COPY:
  'build({ fast: true, accessible: true });', // COPY:
  'launch(); measure(); improve();', // COPY:
  'return work.thatBringsInWork();', // COPY:
]

/* ---------- Home ---------- */
/**
 * Home is a fast summary of everything, work first. Every section ends with a "go deeper"
 * link to its full page, so visitors choose what to explore.
 */
export const homeContent = {
  hero: {
    eyebrow: 'Digital studio · Centurion, ZA', // COPY:
    title: 'Build it. Run it. Grow it.', // COPY: sets as three lines (see HomeHero)
    intro:
      'Websites, web apps and custom software: we design and build them, take over what you already have, and keep it all running and improving.', // COPY:
    cta: { label: 'Start a project', to: '/start' }, // COPY:
    secondaryCta: { label: 'See the work', to: '/work' }, // COPY:
  },
  work: {
    eyebrow: 'Selected work', // COPY:
    title: 'Proof, not promises.', // COPY:
    cardCta: 'View case study', // COPY:
    cursorLabel: 'View', // COPY:
    sectorLabel: 'Sector', // COPY:
    stagesLabel: 'Stages', // COPY:
    more: { label: 'All work', to: '/work' }, // COPY:
    outro: {
      title: 'Every project, start to finish.', // COPY:
      allWork: { label: 'All work', to: '/work' }, // COPY:
      start: { label: 'Start a project like this', to: '/start' }, // COPY:
    },
  },
  paths: {
    eyebrow: 'Services', // COPY:
    title: 'Where are you at?', // COPY:
    intro:
      'New build, rescue job or a team on call: choose the one that sounds like you and see where it starts.', // COPY:
    /** The self-select line for each stage, in the visitor's words. */
    prompts: {
      build: 'I need something new.', // COPY:
      takeover: 'I have something that needs fixing or a new home.', // COPY:
      run: 'Keep my site or app running.', // COPY:
      grow: 'Improve what I have.', // COPY:
      partner: 'I need a development team every month.', // COPY:
    },
    itemsLabel: 'Starting points', // COPY:
    details: 'See details', // COPY:
    estimate: 'Get an estimate', // COPY:
    more: { label: 'All services', to: '/services' }, // COPY:
  },
  process: {
    eyebrow: 'Process', // COPY:
    title: 'How a project runs.', // COPY:
    stepLabel: 'Step', // COPY:
    nowLabel: 'Where we are', // COPY:
    /** Shown beside the plan until the visitor points at a week. */
    overview: {
      label: 'At a glance', // COPY:
      title: 'Six weeks to launch', // COPY:
      text: 'Six steps that overlap, so nothing waits on a handover, and care that carries on after launch.', // COPY:
      hint: {
        pointer: 'Hover a week to see what happens in it.', // COPY:
        touch: 'Tap a week to see what happens in it.', // COPY:
      },
    },
    /** Timeline columns. Step spans in data/process.ts index into this list. */
    columns: [
      { label: 'Week 1', short: 'W1' }, // COPY:
      { label: 'Week 2', short: 'W2' }, // COPY:
      { label: 'Week 3', short: 'W3' }, // COPY:
      { label: 'Week 4', short: 'W4' }, // COPY:
      { label: 'Week 5', short: 'W5' }, // COPY:
      { label: 'Week 6', short: 'W6' }, // COPY:
      { label: 'After launch', short: '+' }, // COPY:
    ],
    more: { label: 'The full process', to: '/services#process' }, // COPY:
  },
  clients: {
    eyebrow: 'Clients', // COPY:
    title: 'What clients say.', // COPY:
    logosLabel: 'Websites built for', // COPY:
    /** Link under each quote to that client's case study. */
    caseLink: (company: string) => `See the ${company} project`, // COPY:
    more: { label: 'See all the work', to: '/work' }, // COPY:
  },
  pricing: {
    eyebrow: 'Pricing', // COPY:
    title: 'Know where you stand before we talk.', // COPY:
    intro:
      'Every project is different, so treat these as starting points rather than a price list.', // COPY:
    /** Snapshot figures: label + where the number comes from (resolved on the Home page). */
    items: [
      { label: 'Websites', source: { offering: 'business-website' }, note: 'Once-off build' }, // COPY:
      {
        label: 'Care',
        source: { planFamily: 'care' as const },
        note: 'Hosting, security and changes',
      }, // COPY:
      {
        label: 'Partner',
        source: { planFamily: 'partner' as const },
        note: 'Reserved monthly hours',
      }, // COPY:
    ],
    more: { label: 'See all pricing', to: '/pricing' }, // COPY:
    estimateCta: { label: 'Build my estimate', to: '/start' }, // COPY:
  },
  studio: {
    eyebrow: 'Studio', // COPY:
    title: 'Founder-led and hands-on.', // COPY:
    intro:
      'We started Stack to do websites properly, and we stay involved in every project, from the first call to long after launch.', // COPY:
    more: { label: 'Meet the studio', to: '/studio' }, // COPY:
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
  device: {
    eyebrow: 'The website', // COPY:
    title: (name: string) => `${name}, live.`, // COPY:
  },
  meta: {
    client: 'Client', // COPY:
    year: 'Year', // COPY:
    services: 'Services', // COPY:
    live: 'Live site', // COPY:
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
    title: 'Build, take over, run, grow, partner.', // COPY:
    intro:
      'Starting something new or need someone to take over what you already have? Stack handles both, and stays on to keep it working and improving.', // COPY:
  } satisfies PageHeroContent,
  navLabel: 'Service stages', // COPY:
  process: {
    eyebrow: 'Process', // COPY:
    title: 'How a project runs.', // COPY:
    intro: 'Six clear steps, with a staging link from week one so you see progress as it happens.', // COPY:
    stepLabel: 'Step', // COPY:
  },
  labels: {
    includes: 'Includes', // COPY:
    examples: 'Examples', // COPY:
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
    title: 'Priced around your project.', // COPY:
    intro:
      'There’s no one-size price list, because no two projects are alike. Build an estimate in two minutes, or start from one of the examples below and adjust it. All prices in ZAR.', // COPY:
  } satisfies PageHeroContent,
  approach: {
    eyebrow: 'How pricing works', // COPY:
    title: 'From rough idea to a final price.', // COPY:
    steps: [
      {
        title: 'Build an estimate', // COPY:
        body: 'Answer a few questions about what you need and see an indicative range straight away.', // COPY:
      },
      {
        title: 'Talk it through', // COPY:
        body: 'A short call to understand the business, not just the website, and what matters most.', // COPY:
      },
      {
        title: 'Get a fixed quote', // COPY:
        body: 'Scope, timeline and payment milestones in writing, agreed before any work starts.', // COPY:
      },
    ],
    cta: { label: 'Build my estimate', to: '/start' }, // COPY:
  },
  quotes: {
    eyebrow: 'Starting points', // COPY:
    title: 'Start from a project like yours.', // COPY:
    intro:
      'Pick the closest one and adjust it in the estimate builder. Ranges are a guide; your fixed quote follows a short call.', // COPY:
    rangeLabel: 'Typically', // COPY:
    monthly: (price: string) => `plus ${price} for hosting and care`, // COPY:
    start: 'Start from this one', // COPY:
    custom: {
      title: 'Something else?', // COPY:
      body: 'Web apps, taking over an existing site or ongoing development: answer a few questions and get an estimate in two minutes.', // COPY:
      label: 'Build your own estimate', // COPY:
      to: '/start',
    } satisfies CtaContent,
  },
  plans: {
    eyebrow: 'Monthly plans', // COPY:
    title: 'Keep it running. Keep it improving.', // COPY:
    tabsLabel: 'Plan types', // COPY:
    popular: 'Most popular', // COPY:
    choose: 'Choose', // COPY:
    minTerm: (n: number) => `${n}-month minimum, billed monthly in advance`, // COPY:
  },
  scope: {
    eyebrow: 'What plans cover', // COPY:
    includedTitle: 'Included', // COPY:
    excludedTitle: 'Not included', // COPY:
  },
  policies: {
    eyebrow: 'How we bill', // COPY:
    title: 'Payment terms and policies.', // COPY:
    scheduleLabel: 'Payment schedule', // COPY:
    termsLink: { label: 'Read the full terms', to: '/terms' }, // COPY:
  },
  priceLabels: {
    from: 'From', // COPY:
    perMonth: '/month', // COPY:
    perHour: '/hour', // COPY:
    quoted: 'Quoted per project', // COPY:
    hours: (label: string) => `${label} included each month`, // COPY:
  },
  faq: {
    eyebrow: 'Pricing FAQ', // COPY:
    title: 'The money questions.', // COPY:
  } satisfies SectionIntro,
}

/* ---------- Studio ---------- */
export const studioContent = {
  hero: {
    eyebrow: 'Studio', // COPY:
    title: 'A growing studio with big standards.', // COPY:
    intro:
      'Stack Studio was founded in Centurion to give businesses of every kind a digital presence as serious as the work they do.', // COPY:
  } satisfies PageHeroContent,
  intro: {
    eyebrow: 'Who we are', // COPY:
    title: 'Design, motion and development in one team.', // COPY:
    paragraphs: [
      'Most businesses end up choosing between a designer who can’t build and a developer who can’t design. We started Stack to close that gap: one team that handles strategy, UX, visual design, motion, front-end and back-end, and then deploys it for real. We each have our focus, but we work across both ends of every build.', // COPY:
      'The result is websites that look the part and actually work: fast, accessible, easy to update and designed to turn visitors into enquiries.', // COPY:
    ],
  },
  founders: {
    eyebrow: 'Founders', // COPY:
    title: 'The people behind Stack.', // COPY:
  } satisfies SectionIntro,
  linkedinLabel: 'LinkedIn', // COPY:
  howWeWork: {
    eyebrow: 'How we work', // COPY:
    title: 'Built to grow.', // COPY:
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
