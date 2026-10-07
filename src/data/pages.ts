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
      'Websites, apps and software, fixing or improving what you already have, and hosting and care once it’s live: Website Care, Managed Software and Partner, with what each costs.', // COPY:
    path: '/services',
  },
  process: {
    title: 'Process', // COPY:
    description:
      'How a Stack Studio project runs: what happens once you get in touch, the build week by week, how payments work and how we look after your site once it’s live.', // COPY:
    path: '/process',
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
 * Home is a short summary of the whole site: what we do (Services), the work and what clients
 * say (Work), how we work (Process) and who we are (Studio). No prices and no detail: every
 * section ends with a "go deeper" link to the page that does the talking.
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
    title: 'What do you need?', // COPY:
    intro: 'Pick the one that sounds like you.', // COPY:
    /** The self-select line for each stage, in the visitor's words (also the Services headings). */
    prompts: {
      build: 'I need something new.', // COPY:
      takeover: 'My site or app needs fixing or a new home.', // COPY:
      run: 'I need a new home and someone to keep it working.', // COPY:
      grow: 'I want to fix or improve what I have.', // COPY:
      partner: 'I need a team for my software.', // COPY:
    },
    /** Home's examples for "Fix or improve it" (fixing is quoted by the hour like any change). */
    fixExamples: [
      { name: 'Fixes and repairs' }, // COPY:
      { name: 'New features and integrations' }, // COPY:
      { name: 'Redesigns and UX improvements' }, // COPY:
    ],
    /** "Hosting and care" opens the monthly plans instead of the brief (Home and Services). */
    plans: { label: 'See the plans', to: '/services#plans' }, // COPY:
    partnerExamples: [
      { name: 'New features' }, // COPY:
      { name: 'Integrations' }, // COPY:
      { name: 'Planning what comes next' }, // COPY:
    ],
    itemsLabel: 'For example', // COPY:
    details: 'See details', // COPY:
    estimate: 'Start here', // COPY:
    more: { label: 'All services', to: '/services' }, // COPY:
  },
  clients: {
    eyebrow: 'Clients', // COPY:
    title: 'What clients say.', // COPY:
    logosLabel: 'Websites built for', // COPY:
    /** Link under each quote to that client's case study. */
    caseLink: (company: string) => `See the ${company} project`, // COPY:
    more: { label: 'See all the work', to: '/work' }, // COPY:
  },
  /** How we work in four short steps; /process has the detail. */
  process: {
    eyebrow: 'Process', // COPY:
    title: 'From first message to looked after.', // COPY:
    steps: [
      {
        title: 'Tell us what you need', // COPY:
        body: 'A short brief with a rough estimate before you send it.', // COPY:
        when: 'About two minutes', // COPY:
      },
      {
        title: 'Meet and agree a fixed quote', // COPY:
        body: 'We talk it through, then put the scope, timeline and payments in writing.', // COPY:
        when: 'After we meet', // COPY:
      },
      {
        title: 'We design and build it', // COPY:
        body: 'You follow along on a staging link from week one, then we launch.', // COPY:
        when: 'Around six weeks', // COPY:
      },
      {
        title: 'We keep it running', // COPY:
        body: 'Hosting, updates and fixes on a monthly plan, if you want one.', // COPY:
        when: 'Every month', // COPY:
      },
    ],
    more: { label: 'See how we work', to: '/process' }, // COPY:
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
    title: 'What do you need?', // COPY:
    intro: 'Something new, something to fix, or a team to keep it going? Start here.', // COPY:
  } satisfies PageHeroContent,
  navigation: {
    label: 'Services sections', // COPY:
    items: [
      { id: 'stage-build', label: 'New website' }, // COPY:
      { id: 'apps', label: 'Apps and software' }, // COPY:
      { id: 'desktop', label: 'Desktop software' }, // COPY:
      { id: 'stage-grow', label: 'Fix or improve it' }, // COPY:
      { id: 'plans', label: 'Hosting and care' }, // COPY:
      { id: 'services-faq', label: 'Questions' }, // COPY:
    ],
  },
  /** The Build stage's website offerings, shown as their own group. */
  websites: {
    name: 'I need a new website.', // COPY:
    line: 'A website built around your business.', // COPY:
    cta: { label: 'Start a website', to: '/start?path=build' }, // COPY:
  },
  /** The Build stage's apps and software, with the phone turn (dark, between the groups). */
  apps: {
    eyebrow: 'Apps and software', // COPY:
    title: 'I need an app or software.', // COPY:
    intro:
      'Booking systems, client portals, dashboards and mobile apps: the software your business runs on.', // COPY:
    cta: { label: 'Tell us about your app', to: '/start?path=build' }, // COPY:
  },
  /** Desktop software and the systems behind it, with the laptop (dark, after the apps). */
  desktop: {
    eyebrow: 'Desktop software', // COPY:
    title: 'I need software for my team.', // COPY:
    intro:
      'Windows and macOS tools for the work your team does every day, online or offline, and the systems that keep them in sync.', // COPY:
    /** Build offerings shown here instead of under apps (ids in data/services). */
    offerings: ['desktop-app', 'backend-api'],
    cta: { label: 'Tell us about your software', to: '/start?path=build' }, // COPY:
  },
  improve: {
    note: 'We estimate the hours and send a quote before any work starts. Once the changes are live, you can add ongoing Care.', // COPY:
  },
  /**
   * 05 Hosting and care: the monthly plans with their prices (the plan cards come from
   * pricingContent.plans; the title is Home's "Hosting and care" prompt).
   */
  plans: {
    eyebrow: 'Hosting and care', // COPY:
    more: { label: 'How care works', to: '/process#care' }, // COPY:
  },
  labels: {
    includes: 'Includes', // COPY:
    /** Inside each build service: opens the brief with that service picked. */
    start: 'Start with this', // COPY:
  },
  faq: {
    eyebrow: 'FAQ', // COPY:
    title: 'Questions, answered.', // COPY:
  } satisfies SectionIntro,
}

/* ---------- Process ---------- */
/**
 * How working with us runs, in order: getting in touch, the build week by week, how you pay,
 * then how care runs once it's live. What we offer (and the plan prices) is on /services.
 */
export const processContent = {
  hero: {
    eyebrow: 'Process', // COPY:
    title: 'How we work, start to finish.', // COPY:
    intro:
      'What happens once you get in touch, how a project runs week by week, how you pay, and how we look after it once it’s live.', // COPY:
  } satisfies PageHeroContent,
  navigation: {
    label: 'Process sections', // COPY:
    items: [
      { id: 'next-steps', label: 'Getting started' }, // COPY:
      { id: 'timeline', label: 'Week by week' }, // COPY:
      { id: 'terms', label: 'Payment terms' }, // COPY:
      { id: 'care', label: 'After launch' }, // COPY:
      { id: 'process-faq', label: 'Questions' }, // COPY:
    ],
  },
  /** How a project runs, week by week (ProcessLine), after the next steps. */
  process: {
    eyebrow: 'Week by week', // COPY:
    title: 'How a project runs.', // COPY:
    stepLabel: 'Step', // COPY:
    nowLabel: 'Where we are', // COPY:
    /** Shown beside the plan until the visitor points at a week. */
    overview: {
      label: 'Typical timeline', // COPY:
      title: 'Around six weeks to launch', // COPY:
      text: 'This is a typical website project, not a fixed deadline. Scope, content and feedback can make it shorter or longer, and we confirm the schedule in your quote.', // COPY:
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
    more: { label: 'See what we build', to: '/services' }, // COPY:
  },
  /**
   * What happens after someone gets in touch, from the brief to a start date: the last doubt
   * before contact, so it opens the page.
   */
  nextSteps: {
    eyebrow: 'Getting started', // COPY:
    title: 'From first message to kick-off.', // COPY:
    intro: 'No long sales process. This is exactly what happens once you get in touch.', // COPY:
    /**
     * The real flow, each step shown as a small interface of what the visitor sees: the brief
     * (it arrives in our inbox), our email reply, the meeting (in person or online) and the fixed
     * quote that follows it. Illustrative: no real names. Prices come from the pricing data (the
     * "Launch website" starting quote) and the address from data/site, on the Process page.
     */
    brief: {
      title: 'Send us your brief', // COPY:
      when: 'About two minutes', // COPY:
      body: 'Answer a few questions and see a rough estimate. It lands in our inbox straight away.', // COPY:
      heading: 'Start a project', // COPY:
      question: 'What are we building?', // COPY:
      options: ['A website', 'An app', 'Help with what I have'], // COPY:
      estimateLabel: 'Rough estimate', // COPY:
      send: 'Send brief', // COPY:
    },
    reply: {
      title: 'We reply by email', // COPY:
      when: 'Within one business day', // COPY:
      body: 'A real reply, not an automated one, with any questions we have and a few times to meet.', // COPY:
      from: 'Stack Studio', // COPY:
      subject: 'Re: Your project brief', // COPY:
      time: '09:12', // COPY:
      message:
        'Thanks for the brief! A couple of quick questions, and a few times that suit us to meet:', // COPY:
      slots: ['Tue 10:00', 'Thu 14:00'], // COPY:
    },
    meeting: {
      title: 'We meet, in person or online', // COPY:
      when: 'About 30 minutes', // COPY: confirm
      body: 'We talk through the business, not just the website, and agree what matters most.', // COPY:
      day: 'Tue', // COPY:
      date: '07', // COPY:
      event: 'Project meeting', // COPY:
      details: '10:00 – 10:30', // COPY:
      modes: ['In person', 'Online'], // COPY:
      note: 'The video link or where we’ll meet comes with the invite.', // COPY:
      accepted: 'Accepted', // COPY:
    },
    quote: {
      title: 'Your fixed quote', // COPY:
      when: 'After we meet', // COPY:
      body: 'Scope, timeline and payment milestones in writing. Say yes and we book your start date.', // COPY:
      document: 'Fixed quote', // COPY:
      lines: [
        { label: 'Scope', value: '5 custom pages' }, // COPY:
        { label: 'Timeline', value: '6 weeks' }, // COPY:
        { label: 'Payments', value: '3 milestones' }, // COPY:
      ],
      totalLabel: 'Total', // COPY:
      accept: 'Accept quote', // COPY:
      /** What every project comes with (each backed by a policy or FAQ). */
      includes: ['30-day launch warranty', 'Staging link from week one', 'Yours on final payment'], // COPY:
    },
    cta: { label: 'Start the brief', to: '/start' }, // COPY:
  },
  /** After launch (CareSteps): how care runs month to month, then over to the plans. */
  care: {
    eyebrow: 'After launch', // COPY:
    title: 'Care that runs in the background.', // COPY:
    intro:
      'Once you’re on a plan, we look after the technical side of your website or software month after month, so you can get on with running your business.', // COPY:
    mediaCaption: 'Looked after, every month.', // COPY:
    mediaLabel: 'Hosting / Care', // COPY:
    steps: [
      {
        title: 'We take it over', // COPY:
        body: 'We move your hosting, domain and access across, check what is live and set up backups and uptime checks.', // COPY:
      },
      {
        title: 'We keep it healthy', // COPY:
        body: 'Every month we run security updates, watch uptime and use your included care hours on fixes, without you having to ask.', // COPY:
      },
      {
        title: 'You ask, we handle it', // COPY:
        body: 'Send a request when something needs attention. What your plan covers, we handle; anything beyond it is quoted before we start.', // COPY:
      },
    ],
    cta: { label: 'Compare the plans', to: '/services#plans' }, // COPY:
  },
  /** How a project is paid for and what it comes with. The plans' own terms sit with the plans. */
  terms: {
    eyebrow: 'How we bill', // COPY:
    title: 'How you pay, and what you get.', // COPY:
    scheduleLabel: 'Payment schedule', // COPY:
    /** Policies shown here (ids in data/policies). */
    policies: ['warranty', 'ip'],
  },
  faq: {
    eyebrow: 'Common questions', // COPY:
    title: 'The practical details.', // COPY:
  } satisfies SectionIntro,
}

/* ---------- Pricing ---------- */
/** The monthly plans (shown in Services, Hosting and care) and the price labels used site-wide. */
export const pricingContent = {
  plans: {
    choose: 'Choose', // COPY:
    partner: {
      name: 'Partner', // COPY:
      tagline: 'A team to create and manage the projects you need.', // COPY:
      price: 'Tailored quote', // COPY:
      includes: [
        'Agree the projects and monthly hours together', // COPY:
        'Create and manage an AI tool, website or software product', // COPY:
        'Planning, design, development and ongoing improvements', // COPY:
        'One team across new and existing projects', // COPY:
      ],
      excludes: [
        'Hosting, domains and third-party usage unless agreed', // COPY:
        'Work outside the agreed scope and hours', // COPY:
      ],
      cta: { label: 'Discuss Partner', to: '/start?partner=discuss' }, // COPY:
    },
    boundary:
      'Managed tickets are for small changes of up to one hour each. Larger work is quoted separately or scoped through Partner.', // COPY:
    minTerm: (n: number) => `${n}-month minimum, billed monthly in advance`, // COPY:
  },
  scope: {
    eyebrow: 'What plans cover', // COPY:
    includedTitle: 'Included', // COPY:
    excludedTitle: 'Not included', // COPY:
  },
  priceLabels: {
    from: 'From', // COPY:
    perMonth: '/month', // COPY:
    perHour: '/hour', // COPY:
    quoted: 'Quoted per project', // COPY:
    hours: (label: string) => `${label} included each month`, // COPY:
  },
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
