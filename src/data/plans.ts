/**
 * Monthly plans: Run (Care for websites, Managed for applications) and Partner retainers.
 * See docs/pricing-model.md. All plans: 3-month minimum, billed monthly in advance.
 */
import type { Plan, PlanFamily, PlanFamilyInfo } from '@/types'
import { BUILD_RATE_PER_HOUR, CARE_RATE_PER_HOUR } from './rates'

const MIN_TERM = 3

export const planFamilies: PlanFamilyInfo[] = [
  {
    id: 'care',
    name: 'Website Care', // COPY:
    description: 'For websites. Included working time is calculated at R200 per hour.', // COPY:
    hoursLabel: 'Included changes', // COPY:
  },
  {
    id: 'managed',
    name: 'Managed Software', // COPY:
    description: 'For applications. Included management and support time is R200 per hour.', // COPY:
    hoursLabel: 'Included support', // COPY:
  },
  {
    id: 'partner',
    name: 'Partner', // COPY:
    description:
      'Reserved software-development hours at R400 per hour with a team that knows your systems.', // COPY:
    note: 'Limited to 3 partner clients at a time.', // COPY:
    hoursLabel: 'Reserved hours', // COPY:
  },
]

export const plans: Plan[] = [
  /* ---------- Care (websites only) ---------- */
  {
    id: 'care-essential',
    family: 'care',
    name: 'Care Essential', // COPY:
    tagline: 'The essentials, looked after.', // COPY:
    pricePerMonth: 0.5 * CARE_RATE_PER_HOUR,
    includedHours: 0.5,
    hoursLabel: '30 min', // COPY:
    includes: [
      'Managed hosting and SSL', // COPY:
      'Domain/DNS management', // COPY:
      'Backups and uptime monitoring', // COPY:
      'Dependency updates and basic security', // COPY:
      'Small fixes and basic support', // COPY:
      'Up to 30 min of content changes', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },
  {
    id: 'care-business',
    family: 'care',
    name: 'Care Business', // COPY:
    tagline: 'For sites that bring in the work.', // COPY:
    pricePerMonth: 2 * CARE_RATE_PER_HOUR,
    includedHours: 2,
    hoursLabel: '2 hours', // COPY:
    includes: [
      'Everything in Essential', // COPY:
      'Better monitoring', // COPY:
      'Performance and analytics checks', // COPY:
      'Staging where required', // COPY:
      'Priority support', // COPY:
      'Monthly health check', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    highlighted: true,
    visibility: 'pricing',
  },
  {
    id: 'care-pro',
    family: 'care',
    name: 'Care Pro', // COPY:
    tagline: 'For busy, business-critical sites.', // COPY:
    pricePerMonth: 3 * CARE_RATE_PER_HOUR,
    includedHours: 3,
    hoursLabel: '3 hours', // COPY:
    includes: [
      'Everything in Business', // COPY:
      'Advanced monitoring', // COPY:
      'More frequent backups', // COPY:
      'Performance optimisation', // COPY:
      'Backend and database checks', // COPY:
      'Priority fixes and monthly reporting', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },

  /* ---------- Managed (applications only) ---------- */
  {
    id: 'managed-app',
    family: 'managed',
    name: 'Managed App', // COPY:
    tagline: 'Your app, kept healthy.', // COPY:
    pricePerMonth: 4 * CARE_RATE_PER_HOUR,
    priceIsFrom: true,
    includedHours: 4,
    hoursLabel: '4 hours', // COPY:
    includes: [
      'App, backend and database monitoring', // COPY:
      'Deployment management', // COPY:
      'Backups and dependency updates', // COPY:
      'Security', // COPY:
      'Bug fixes and support', // COPY:
      'Infrastructure management', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },
  {
    id: 'managed-system',
    family: 'managed',
    name: 'Managed Business System', // COPY:
    tagline: 'For systems the business can’t run without.', // COPY:
    pricePerMonth: 8 * CARE_RATE_PER_HOUR,
    priceIsFrom: true,
    includedHours: 8,
    hoursLabel: '8 hours', // COPY:
    includes: [
      'Everything in Managed App', // COPY:
      'Higher-priority support', // COPY:
      'More monitoring and database health', // COPY:
      'Server and infrastructure management', // COPY:
      'Performance checks', // COPY:
      'Monthly technical review', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    highlighted: true,
    visibility: 'pricing',
  },
  {
    id: 'mission-critical',
    family: 'managed',
    name: 'Mission-Critical Management', // COPY:
    tagline:
      'Quoted on users, traffic, infrastructure, risk, response time, database size and integrations.', // COPY:
    pricePerMonth: 20_000,
    priceIsFrom: true,
    includes: [],
    minimumTermMonths: MIN_TERM,
    visibility: 'hidden',
  },

  /* ---------- Hosting only (rendered only as "available on request") ---------- */
  {
    id: 'hosting-website',
    family: 'hosting',
    name: 'Website Hosting', // COPY:
    tagline: 'Hosting only.', // COPY:
    pricePerMonth: 450,
    priceIsFrom: true,
    includes: [],
    minimumTermMonths: MIN_TERM,
    visibility: 'hidden',
  },
  {
    id: 'hosting-app',
    family: 'hosting',
    name: 'App Hosting', // COPY:
    tagline: 'Hosting only.', // COPY:
    pricePerMonth: 1_500,
    priceIsFrom: true,
    priceSuffix: '+ infrastructure', // COPY:
    includes: [],
    minimumTermMonths: MIN_TERM,
    visibility: 'hidden',
  },

  /* ---------- Partner ---------- */
  {
    id: 'partner-10',
    family: 'partner',
    name: 'Partner 10', // COPY:
    tagline: 'A steady development partner.', // COPY:
    pricePerMonth: 10 * BUILD_RATE_PER_HOUR,
    includedHours: 10,
    hoursLabel: '10 hours', // COPY:
    includes: [
      'UX/UI, frontend and backend', // COPY:
      'Small integrations and improvements', // COPY:
      'Technical support', // COPY:
      'Monthly planning', // COPY:
      'Priority over non-retainer work', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },
  {
    id: 'partner-20',
    family: 'partner',
    name: 'Partner 20', // COPY:
    tagline: 'Your part-time product team.', // COPY:
    pricePerMonth: 20 * BUILD_RATE_PER_HOUR,
    includedHours: 20,
    hoursLabel: '20 hours', // COPY:
    includes: [
      'Everything in Partner 10', // COPY:
      'Database work and API integrations', // COPY:
      'New features and automation', // COPY:
      'Technical planning', // COPY:
      'Priority support', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    highlighted: true,
    visibility: 'pricing',
  },
  {
    id: 'partner-40',
    family: 'partner',
    name: 'Partner 40', // COPY:
    tagline: 'A development capability, on tap.', // COPY:
    pricePerMonth: 40 * BUILD_RATE_PER_HOUR,
    includedHours: 40,
    hoursLabel: '40 hours', // COPY:
    includes: [
      'Everything in Partner 20', // COPY:
      'Product development', // COPY:
      'Infrastructure', // COPY:
      'Monthly roadmap planning', // COPY:
      'Priority development', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },
  {
    id: 'dedicated',
    family: 'partner',
    name: 'Dedicated Capacity', // COPY:
    tagline: 'Scoped individually.', // COPY:
    pricePerMonth: 50_000,
    priceIsFrom: true,
    includes: [],
    minimumTermMonths: MIN_TERM,
    visibility: 'hidden',
  },
]

export function plansFor(family: PlanFamily, includeHidden = false): Plan[] {
  return plans.filter((p) => p.family === family && (includeHidden || p.visibility !== 'hidden'))
}

export function getPlan(id: string | null | undefined): Plan | undefined {
  return plans.find((p) => p.id === id)
}
