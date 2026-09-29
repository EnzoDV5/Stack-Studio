/**
 * Stack's five stages and every offering (see docs/pricing-model.md, the source of truth).
 * Client-facing prices only. Never add internal rates, costs or margins here.
 * visibility: 'pricing' = Pricing + Services pages · 'services' = Services page only
 * ("Quoted per project") · 'hidden' = kept in data, never rendered.
 */
import type { Offering, ServiceStage, StageId } from '@/types'

export const serviceStages: ServiceStage[] = [
  {
    id: 'build',
    index: 1,
    name: 'Build', // COPY:
    line: 'We create it.', // COPY:
    summary:
      'Websites, web apps, custom software and AI features, designed and developed in-house from first sketch to deployment.', // COPY:
    cta: { label: 'Start a build', to: '/start?path=build' }, // COPY:
    briefPath: 'build',
  },
  {
    id: 'takeover',
    index: 2,
    name: 'Take over', // COPY:
    line: 'Already built? We’ll take it from here.', // COPY:
    summary:
      'Developer gone, site slow or nobody has the passwords? We audit what you have, move it somewhere safe and take responsibility for it.', // COPY:
    cta: { label: 'Hand it over', to: '/start?path=existing' }, // COPY:
    briefPath: 'existing',
  },
  {
    id: 'run',
    index: 3,
    name: 'Run', // COPY:
    line: 'We keep it working.', // COPY:
    summary:
      'Monthly Care for websites and Managed plans for applications: hosting, monitoring, backups, updates and fixes, handled.', // COPY:
    cta: { label: 'Find my plan', to: '/start?path=run' }, // COPY:
    briefPath: 'run',
  },
  {
    id: 'grow',
    index: 4,
    name: 'Grow', // COPY:
    line: 'We keep improving it.', // COPY:
    summary:
      'New features, integrations and improvements as your business changes, priced as a project or billed by the hour.', // COPY:
    cta: { label: 'Plan an improvement', to: '/start?path=develop' }, // COPY:
    briefPath: 'develop',
  },
  {
    id: 'partner',
    index: 5,
    name: 'Partner', // COPY:
    line: 'We become part of your development capability.', // COPY:
    summary:
      'Reserved monthly hours with a team that knows your systems: design, development, integrations and planning.', // COPY:
    cta: { label: 'Talk about partnering', to: '/start?path=develop' }, // COPY:
    briefPath: 'develop',
  },
]

export const offerings: Offering[] = [
  /* ---------- 01 Build ---------- */
  {
    id: 'business-website',
    stage: 'build',
    name: 'Business Website', // COPY:
    summary: 'Not a template. A properly designed and developed business website.', // COPY:
    fromPrice: 18_000,
    includedPages: 5,
    includes: [
      'Custom UX/UI', // COPY:
      'Responsive desktop and mobile', // COPY:
      'Front-end development', // COPY:
      'Contact forms', // COPY:
      'Basic animations', // COPY:
      'Basic SEO and Google Analytics', // COPY:
      'Deployment', // COPY:
      'Basic CMS if required', // COPY:
      '30-day launch support', // COPY:
    ],
    notes: ['5 pages included.'], // COPY:
    briefCategory: 'website',
    visibility: 'pricing',
  },
  {
    id: 'immersive-website',
    stage: 'build',
    name: 'Custom / Immersive Website', // COPY:
    summary: 'Cinematic, motion-led sites with custom functionality behind them.', // COPY:
    fromPrice: 35_000,
    includedPages: 8,
    includes: [
      'Custom UX/UI', // COPY:
      'Advanced responsive layouts', // COPY:
      'GSAP interactions and scroll animation', // COPY:
      'Interactive sections', // COPY:
      'Custom CMS', // COPY:
      'API integrations', // COPY:
      'Advanced forms', // COPY:
      'Custom backend functionality', // COPY:
    ],
    notes: ['8 pages included.'], // COPY:
    briefCategory: 'website',
    visibility: 'pricing',
  },
  {
    id: 'ecommerce',
    stage: 'build',
    name: 'E-commerce Website', // COPY:
    summary: 'A custom storefront that sells, with the admin to run it.', // COPY:
    fromPrice: 45_000,
    includedPages: 5,
    includes: [
      'Custom storefront', // COPY:
      'Products and categories', // COPY:
      'Cart, checkout and payment gateway', // COPY:
      'Customer accounts', // COPY:
      'Order management', // COPY:
      'CMS and email notifications', // COPY:
      'Analytics', // COPY:
      'Hosting and deployment', // COPY:
    ],
    notes: ['5 content pages plus the store.', 'Complex stores quoted separately.'], // COPY:
    briefCategory: 'website',
    visibility: 'pricing',
  },
  {
    id: 'web-app',
    stage: 'build',
    name: 'Web Apps & MVPs', // COPY:
    summary: 'Portals, booking systems, dashboards and SaaS products, built properly.', // COPY:
    fromPrice: 75_000,
    examples: [
      'Client portals', // COPY:
      'Booking systems', // COPY:
      'Dashboards', // COPY:
      'SaaS products', // COPY:
      'Membership platforms', // COPY:
      'Management platforms', // COPY:
      'Customer portals', // COPY:
    ],
    includes: [
      'User accounts and authentication', // COPY:
      'Roles', // COPY:
      'Dashboards', // COPY:
      'Database and backend', // COPY:
      'APIs', // COPY:
      'Payments', // COPY:
      'Notifications', // COPY:
      'Admin system and reporting', // COPY:
    ],
    requiresDiscovery: true,
    briefCategory: 'software',
    visibility: 'pricing',
  },
  {
    id: 'custom-software',
    stage: 'build',
    name: 'Custom Software & Mobile Apps', // COPY:
    summary: 'The internal systems and mobile apps your business actually runs on.', // COPY:
    fromPrice: 120_000,
    examples: [
      'Custom CRM', // COPY:
      'Inventory', // COPY:
      'Staff management', // COPY:
      'Job tracking', // COPY:
      'Quoting systems', // COPY:
      'Workflow systems', // COPY:
      'Business dashboards', // COPY:
      'Internal platforms', // COPY:
      'iOS and Android apps', // COPY:
    ],
    includes: [
      'Frontend, backend and database', // COPY:
      'Auth and roles', // COPY:
      'APIs and integrations', // COPY:
      'Docker, deployment and hosting', // COPY:
      'Push notifications', // COPY:
      'Payments, maps and uploads', // COPY:
      'Admin dashboard', // COPY:
    ],
    requiresDiscovery: true,
    briefCategory: 'software',
    visibility: 'pricing',
  },
  {
    id: 'ai-automation',
    stage: 'build',
    name: 'AI & Automation', // COPY:
    summary: 'We add useful AI features to the systems we build or the ones you already use.', // COPY:
    fromPrice: 15_000,
    tiers: [
      { label: 'Automation', fromPrice: 15_000 }, // COPY:
      { label: 'AI features', fromPrice: 20_000 }, // COPY:
      { label: 'Larger AI platforms', fromPrice: 75_000 }, // COPY:
    ],
    examples: [
      'Website → CRM', // COPY:
      'Form → database', // COPY:
      'System → WhatsApp', // COPY:
      'CRM → email', // COPY:
      'Accounting → dashboard', // COPY:
      'Payment gateway → customer account', // COPY:
    ],
    includes: [
      'AI search', // COPY:
      'Document analysis', // COPY:
      'Internal and customer-support assistants', // COPY:
      'AI on your business data (RAG)', // COPY:
      'Summarisation, extraction and classification', // COPY:
      'Automated workflows', // COPY:
    ],
    notes: ['AI/API usage is billed separately at actual cost.'], // COPY:
    briefCategory: 'software',
    visibility: 'pricing',
  },
  {
    id: 'backend-api',
    stage: 'build',
    name: 'Backend & API Development', // COPY:
    summary: 'Backend systems built around your requirements.', // COPY:
    fromPrice: 30_000,
    includes: [
      'REST APIs', // COPY:
      'Auth, business logic and roles', // COPY:
      'SQL and NoSQL databases', // COPY:
      'File storage', // COPY:
      'Admin systems and server functions', // COPY:
      'Third-party integrations', // COPY:
      'Docker and deployment', // COPY:
    ],
    briefCategory: 'software',
    visibility: 'services',
  },
  {
    id: 'desktop-app',
    stage: 'build',
    name: 'Desktop Applications', // COPY:
    summary: 'Windows and macOS business tools, online, offline or both.', // COPY:
    fromPrice: 80_000,
    examples: [
      'Inventory', // COPY:
      'Internal tools', // COPY:
      'Data management', // COPY:
      'Booking', // COPY:
      'Admin systems', // COPY:
      'Offline/online hybrid', // COPY:
    ],
    includes: [],
    briefCategory: 'software',
    visibility: 'services',
  },
  {
    id: 'discovery',
    stage: 'build',
    name: 'Software Discovery & Scoping', // COPY:
    summary: 'A paid scoping phase that turns an idea into a buildable plan and a real estimate.', // COPY:
    fromPrice: 7_500,
    includes: [
      'Requirements, users and roles', // COPY:
      'Features and database design', // COPY:
      'Integrations and architecture', // COPY:
      'Wireframes', // COPY:
      'Technical approach and timeline', // COPY:
      'Full development estimate', // COPY:
    ],
    tiers: [{ label: 'Large systems', fromPrice: 15_000 }], // COPY: large systems R15,000–R40,000+
    notes: ['Required before any build of R120,000+.', 'Large systems: R15,000–R40,000+.'], // COPY:
    visibility: 'pricing',
  },
  {
    id: 'large-platform',
    stage: 'build',
    name: 'Large-Scale Software Platform', // COPY:
    summary: 'Scoped individually.', // COPY:
    fromPrice: 250_000,
    includes: [],
    requiresDiscovery: true,
    visibility: 'hidden',
  },

  /* ---------- 02 Take over ---------- */
  {
    id: 'website-audit',
    stage: 'takeover',
    name: 'Website Technical Audit', // COPY:
    summary:
      'A Technical Health Report with clear recommendations: Good, Needs attention or Critical.', // COPY:
    fromPrice: 2_500,
    includes: [
      'Source code and framework', // COPY:
      'Hosting, domain/DNS and SSL', // COPY:
      'Performance and security', // COPY:
      'Dependencies and database', // COPY:
      'Backups and analytics', // COPY:
      'Repository access and deployment', // COPY:
    ],
    notes: ['Fee credited against a takeover signed within 30 days.'], // COPY:
    visibility: 'pricing',
  },
  {
    id: 'app-audit',
    stage: 'takeover',
    name: 'App / Software Audit', // COPY:
    summary: 'A full technical review before anyone touches a line of code.', // COPY:
    fromPrice: 5_000,
    includes: [
      'Frontend, backend and database', // COPY:
      'Code quality and security', // COPY:
      'Hosting and architecture', // COPY:
      'Dependencies and deployment', // COPY:
      'Documentation and backups', // COPY:
      'Third-party services', // COPY:
    ],
    notes: ['Large systems: custom quote.'], // COPY:
    visibility: 'services',
  },
  {
    id: 'website-takeover',
    stage: 'takeover',
    name: 'Website Takeover', // COPY:
    summary: 'We move your site somewhere safe and take responsibility for it.', // COPY:
    fromPrice: 3_500,
    includes: [
      'Repository move and Stack access', // COPY:
      'Hosting and domain/DNS', // COPY:
      'Backups and deployment', // COPY:
      'Analytics and monitoring', // COPY:
      'Documentation and environment config', // COPY:
    ],
    notes: ['Then moves onto a Care plan.'], // COPY:
    visibility: 'services',
  },
  {
    id: 'software-takeover',
    stage: 'takeover',
    name: 'Software / App Takeover', // COPY:
    summary: 'Your application, migrated, documented and stable under our care.', // COPY:
    fromPrice: 10_000,
    includes: [
      'Repository migration', // COPY:
      'Environment setup and database access', // COPY:
      'Infrastructure review', // COPY:
      'Deployment pipeline', // COPY:
      'Monitoring and backups', // COPY:
      'Documentation and critical fixes', // COPY:
    ],
    notes: ['Then moves onto a Managed or Partner plan.'], // COPY:
    visibility: 'services',
  },
]

export function offeringsFor(stage: StageId, includeServicesOnly = true): Offering[] {
  return offerings.filter(
    (o) =>
      o.stage === stage &&
      (o.visibility === 'pricing' || (includeServicesOnly && o.visibility === 'services')),
  )
}

export function getOffering(id: string | null | undefined): Offering | undefined {
  return offerings.find((o) => o.id === id)
}
