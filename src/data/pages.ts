/**
 * Page-level copy: meta tags, heroes, section headings and CTAs for every route.
 * Sections receive these as props; nothing is hardcoded in components.
 */
import type { CtaContent, PageHeroContent, PageMetaContent, SectionIntro } from '@/types'

export const pageMeta = {
  home: {
    title: 'Stack Studio — Websites, apps and software that help businesses grow', // COPY:
    description:
      'Stack Studio helps businesses stand out and grow with custom websites, apps and software, plus hosting and ongoing care. Based in Centurion, South Africa.', // COPY:
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
      'Websites that help your business stand out, apps and software that bring ideas to life, and hosting, maintenance and improvements that support growth.', // COPY:
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
      'Meet Stack Studio, the Centurion team building websites, apps and software to help businesses stand out, work better and grow.', // COPY:
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
  title: 'Let’s build what moves your business forward.', // COPY:
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
 * Home follows the visitor's need with the offer and process, then the work and what clients
 * say, and finally the people behind it. No prices or full detail: every chapter links to
 * the page that does the talking.
 */
export const homeContent = {
  hero: {
    eyebrow: 'Digital studio · Centurion, ZA', // COPY:
    title: 'Build it. Run it. Grow it.', // COPY: sets as three lines (see HomeHero)
    intro:
      'We build websites that help businesses stand out. We turn ideas into apps and software, then host, maintain and improve your site or app as you grow.', // COPY:
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
    eyebrow: 'Find your fit', // COPY:
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
  chapterFlow: {
    eyebrow: 'What we do / Process', // COPY:
    title: 'From the first idea to what comes next.', // COPY:
    items: [
      {
        title: 'A website that stands out', // COPY:
        body: 'Show what makes your business different and give the right people a reason to get in touch.', // COPY:
        detail: 'Business websites · immersive experiences', // COPY:
        link: { label: 'Explore websites', to: '/services#stage-build' }, // COPY:
      },
      {
        title: 'Apps and custom software', // COPY:
        body: 'Bring your idea to life with a useful tool for your customers or team, built to grow with your business.', // COPY:
        detail: 'Web apps · desktop tools · integrations', // COPY:
        link: { label: 'Explore software', to: '/services#apps' }, // COPY:
      },
      {
        title: 'Improve what you have', // COPY:
        body: 'Add the features you need, fix what gets in the way and make the experience better as your business grows.', // COPY:
        detail: 'Fixes · new features · redesigns', // COPY:
        link: { label: 'Explore improvements', to: '/services#stage-grow' }, // COPY:
      },
      {
        title: 'Tell us what you need', // COPY:
        body: 'Start with a short brief and rough estimate. We meet, then agree the scope and fixed quote.', // COPY:
        detail: 'Brief · conversation · quote', // COPY:
      },
      {
        title: 'We design and build it', // COPY:
        body: 'You follow along on a staging link from week one, then we launch.', // COPY:
        detail: 'Around six weeks', // COPY:
      },
      {
        title: 'We keep it running', // COPY:
        body: 'We host, monitor and maintain your site or app, with updates and support when something needs attention.', // COPY:
        detail: 'Hosting · maintenance · support', // COPY:
        link: { label: 'See hosting and care', to: '/services#plans' }, // COPY:
      },
    ],
    more: [
      { label: 'See all services', to: '/services' }, // COPY:
      { label: 'See how we work', to: '/process' }, // COPY:
    ],
  },
  clients: {
    eyebrow: 'Clients', // COPY:
    title: 'What clients say.', // COPY:
    logosLabel: 'Websites built for', // COPY:
    /** Link under each quote to that client's case study. */
    caseLink: (company: string) => `See the ${company} project`, // COPY:
    more: { label: 'See all the work', to: '/work' }, // COPY:
  },
  studio: {
    eyebrow: 'Studio', // COPY:
    title: 'You talk to the people who build it.', // COPY:
    intro:
      'We build websites and software with our clients, and stay involved from the first call through launch and beyond.', // COPY:
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
  },
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
    line: 'Show what makes your business different and give people a reason to choose you.', // COPY:
    cta: { label: 'Start a website', to: '/start?kind=website' }, // COPY:
  },
  /** The Build stage's apps and software, with the phone turn (dark, between the groups). */
  apps: {
    eyebrow: 'Apps and software', // COPY:
    title: 'I need an app or software.', // COPY:
    intro:
      'Booking systems, client portals, dashboards and apps that bring your idea to life and help your business work better.', // COPY:
    cta: { label: 'Tell us about your app', to: '/start?kind=app' }, // COPY:
  },
  /** Desktop software and the systems behind it, with the laptop (dark, after the apps). */
  desktop: {
    eyebrow: 'Desktop software', // COPY:
    title: 'I need software for my team.', // COPY:
    intro:
      'Windows and macOS tools for the work your team does every day, online or offline, and the systems that keep them in sync.', // COPY:
    cta: { label: 'Tell us about your software', to: '/start?kind=software' }, // COPY:
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
      'We host, monitor and maintain your website or app, with backups, updates and help when something needs attention.', // COPY:
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
      cta: { label: 'Ask about partnering', to: '/start?path=develop' }, // COPY:
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
      'Stack Studio was founded in Centurion to help businesses stand out and grow through carefully built websites, apps and software.', // COPY:
  } satisfies PageHeroContent,
  intro: {
    eyebrow: 'Who we are', // COPY:
    title: 'Design, motion and development in one team.', // COPY:
    paragraphs: [
      'A strong digital product needs good design and solid development working together. At Stack, strategy, UX, visual design, motion, front-end and back-end sit in one team. We each have our focus, but we work across both ends of every build.', // COPY:
      'We build websites that show why a business is different, and apps and software shaped around what its customers and team need. After launch, we can host and maintain your site or app, and keep improving it as your business grows.', // COPY:
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
        'When you complete the Start a project brief, we collect your name, email address and optional phone number and company name, plus the project details you choose to share (project type, scope, features, timeline and what you already have).', // COPY:
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
