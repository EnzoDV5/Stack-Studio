/**
 * Stack's five stages and every offering (see docs/pricing-model.md, the source of truth).
 * Client-facing prices only. Never add internal rates, costs or margins here.
 * visibility: 'pricing' = Pricing + Services pages · 'services' = Services page only
 * (Build items still show their calculated estimate) · 'hidden' = kept in data, never rendered.
 */
import type { Offering, ServiceStage, StageId } from '@/types'
import { BUILD_RATE_PER_HOUR, CARE_RATE_PER_HOUR } from './rates'

const estimateAt = (estimatedHours: number, pricePerHour: number) => ({
  estimatedHours,
  fromPrice: estimatedHours * pricePerHour,
})
const buildEstimate = (estimatedHours: number) => estimateAt(estimatedHours, BUILD_RATE_PER_HOUR)
const careEstimate = (estimatedHours: number) => estimateAt(estimatedHours, CARE_RATE_PER_HOUR)
const buildPrice = (estimatedHours: number) => buildEstimate(estimatedHours).fromPrice

export const serviceStages: ServiceStage[] = [
  {
    id: 'build',
    index: 1,
    name: 'Something new', // COPY:
    line: 'A website, app or tool, built for you.', // COPY:
    summary:
      'Websites, web apps, custom software and AI features, designed and developed in-house from first sketch to deployment.', // COPY:
    cta: { label: 'Tell us what you need', to: '/start?path=build' }, // COPY:
    briefPath: 'build',
  },
  {
    id: 'takeover',
    index: 2,
    name: 'Help with what I have', // COPY:
    line: 'We can fix your site or app and take care of it.', // COPY:
    summary:
      'Developer gone, site slow or nobody has the passwords? We audit what you have, move it somewhere safe and take responsibility for it.', // COPY:
    cta: { label: 'Tell us what needs help', to: '/start?path=existing' }, // COPY:
    briefPath: 'existing',
  },
  {
    id: 'run',
    index: 3,
    name: 'Keep it working', // COPY:
    line: 'Hosting, updates and support each month.', // COPY:
    summary:
      'For the websites and apps we build or take over: Care for websites and Managed plans for apps, covering hosting, monitoring, backups, updates and fixes.', // COPY:
    cta: { label: 'Find my plan', to: '/start?path=run' }, // COPY:
    briefPath: 'run',
  },
  {
    id: 'grow',
    index: 4,
    name: 'Make it better', // COPY:
    line: 'New features, a redesign or smaller fixes.', // COPY:
    summary:
      'We estimate the hours for changes to an existing website or app and quote them before work starts, then offer ongoing Care after launch.', // COPY:
    cta: { label: 'Tell us what to improve', to: '/start?path=existing' }, // COPY:
    briefPath: 'existing',
  },
  {
    id: 'partner',
    index: 5,
    name: 'A software team', // COPY:
    line: 'A team and monthly hours for your software.', // COPY:
    summary:
      'Reserved monthly hours for companies with large or business-critical systems: managing, developing, integrating and planning, with a team that knows your software.', // COPY:
    cta: { label: 'Talk about your software', to: '/start?path=develop' }, // COPY:
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
    ...buildEstimate(45),
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
    ...buildEstimate(87.5),
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
    ...buildEstimate(112.5),
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
    ...buildEstimate(187.5),
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
    ...buildEstimate(300),
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
    ...buildEstimate(37.5),
    tiers: [
      { label: 'Automation', fromPrice: buildPrice(37.5) }, // COPY:
      { label: 'AI features', fromPrice: buildPrice(50) }, // COPY:
      { label: 'Larger AI platforms', fromPrice: buildPrice(187.5) }, // COPY:
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
    ...buildEstimate(75),
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
    ...buildEstimate(200),
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
    ...buildEstimate(18.75),
    includes: [
      'Requirements, users and roles', // COPY:
      'Features and database design', // COPY:
      'Integrations and architecture', // COPY:
      'Wireframes', // COPY:
      'Technical approach and timeline', // COPY:
      'Full development estimate', // COPY:
    ],
    tiers: [{ label: 'Large systems', fromPrice: buildPrice(37.5) }], // COPY: large systems R15,000–R40,000+
    notes: ['Required before larger builds.', 'Large systems are scoped in more depth.'], // COPY: the thresholds and prices are on /pricing and in the estimate
    visibility: 'pricing',
  },
  {
    id: 'large-platform',
    stage: 'build',
    name: 'Large-Scale Software Platform', // COPY:
    summary: 'Scoped individually.', // COPY:
    ...buildEstimate(625),
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
    ...careEstimate(12.5),
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
    ...careEstimate(25),
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
    ...careEstimate(17.5),
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
    ...careEstimate(50),
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
