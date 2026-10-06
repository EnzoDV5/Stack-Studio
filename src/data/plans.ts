/**
 * Monthly plans: Run (Care for websites, Managed for applications) and Partner retainers.
 * See docs/pricing-model.md. All plans: 3-month minimum, billed monthly in advance.
 */
import type { Plan, PlanFamily, PlanFamilyInfo } from '@/types'
import { BUILD_RATE_PER_HOUR, CARE_RATE_PER_HOUR } from './rates'

const MIN_TERM = 3
const WEBSITE_HOSTING_MONTHLY = 450
const APP_HOSTING_MONTHLY = 1_500
const STANDARD_DOMAIN_ALLOWANCE_YEARLY = 600
const CARE_MANAGEMENT_HOURS = 1
const MANAGED_MANAGEMENT_HOURS = 2
const MANAGED_CHANGE_REQUESTS = 3
const HOURS_PER_CHANGE_REQUEST = 1

export const planFamilies: PlanFamilyInfo[] = [
  {
    id: 'care',
    name: 'Website Care', // COPY:
    description: 'Hosting, one standard domain and routine upkeep for your website.', // COPY:
  },
  {
    id: 'managed',
    name: 'Managed Software', // COPY:
    description:
      'Your website and app hosted and managed, with three small change tickets each month.', // COPY:
  },
  {
    id: 'partner',
    name: 'Partner', // COPY:
    description:
      'Reserve monthly hours for planning, managing and improving projects with one team.', // COPY:
    note: 'Limited to 3 partner clients at a time.', // COPY:
  },
]

export const plans: Plan[] = [
  /* ---------- Care (websites only) ---------- */
  {
    id: 'care-essential',
    family: 'care',
    name: 'Website Care Essential', // COPY:
    tagline: 'One website, hosted and looked after.', // COPY:
    pricePerMonth:
      WEBSITE_HOSTING_MONTHLY +
      CARE_MANAGEMENT_HOURS * CARE_RATE_PER_HOUR +
      STANDARD_DOMAIN_ALLOWANCE_YEARLY / 12,
    includes: [
      'Hosting, SSL and DNS for one website', // COPY:
      'One standard domain, up to R600/year', // COPY:
      'Backups, uptime checks and security updates', // COPY:
      'Up to 1 hour of routine care and fixes each month', // COPY:
    ],
    excludes: [
      'Content edits, design changes and new features', // COPY:
      'Email hosting and extra or premium domains', // COPY:
    ],
    priceBreakdown: 'R450 hosting + R50 domain allowance + 1 care hour at R200.', // COPY:
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },

  /* ---------- Managed (applications only) ---------- */
  {
    id: 'managed-app',
    family: 'managed',
    name: 'Managed Software', // COPY:
    tagline: 'Your website and app, managed together with monthly changes.', // COPY:
    pricePerMonth:
      WEBSITE_HOSTING_MONTHLY +
      APP_HOSTING_MONTHLY +
      STANDARD_DOMAIN_ALLOWANCE_YEARLY / 12 +
      MANAGED_MANAGEMENT_HOURS * CARE_RATE_PER_HOUR +
      MANAGED_CHANGE_REQUESTS * HOURS_PER_CHANGE_REQUEST * BUILD_RATE_PER_HOUR,
    includedHours: MANAGED_CHANGE_REQUESTS * HOURS_PER_CHANGE_REQUEST,
    includes: [
      'Hosting, SSL and DNS for one website and one standard app', // COPY:
      'One standard domain, up to R600/year', // COPY:
      'Monitoring, backups, security updates and deployments', // COPY:
      'Up to 2 hours of routine technical care each month', // COPY:
      `${MANAGED_CHANGE_REQUESTS} small change tickets each month, up to ${HOURS_PER_CHANGE_REQUEST} hour each`, // COPY:
    ],
    excludes: [
      'New features, redesigns and work over 1 hour per ticket', // COPY:
      'Extra cloud capacity, usage fees and additional domains', // COPY:
    ],
    priceBreakdown:
      'R450 website + R1,500 app hosting + R50 domain + 2 care hours at R200 + 3 change hours at R400.', // COPY:
    minimumTermMonths: MIN_TERM,
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
    pricePerMonth: WEBSITE_HOSTING_MONTHLY,
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
    pricePerMonth: APP_HOSTING_MONTHLY,
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
    name: 'Partner', // COPY:
    tagline: 'Your team for planned work across projects.', // COPY:
    pricePerMonth: 10 * BUILD_RATE_PER_HOUR,
    priceIsFrom: true,
    includedHours: 10,
    hoursLabel: '10 hours', // COPY:
    includes: [
      '10 reserved hours each month; choose more as needed', // COPY:
      'Planning, project management, design and development', // COPY:
      'Features, updates, fixes and integrations across projects', // COPY:
      'Priority scheduling and one team that knows your work', // COPY:
    ],
    excludes: [
      'Website or app hosting, domains and third-party fees', // COPY:
      'Work beyond your agreed monthly hours', // COPY:
    ],
    priceBreakdown:
      'From 10 reserved hours at R400/hour. Hosting is quoted separately for each project.', // COPY:
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },
  {
    id: 'partner-20',
    family: 'partner',
    name: 'Partner 20', // COPY:
    tagline: 'Twenty reserved development hours each month.', // COPY:
    pricePerMonth: 20 * BUILD_RATE_PER_HOUR,
    includedHours: 20,
    hoursLabel: '20 hours', // COPY:
    includes: [
      'UX/UI, frontend and backend development', // COPY:
      'Features, fixes and integrations', // COPY:
      'Technical planning and support', // COPY:
      'Priority over non-retainer work', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    highlighted: true,
    visibility: 'hidden',
  },
  {
    id: 'partner-40',
    family: 'partner',
    name: 'Partner 40', // COPY:
    tagline: 'Forty reserved development hours each month.', // COPY:
    pricePerMonth: 40 * BUILD_RATE_PER_HOUR,
    includedHours: 40,
    hoursLabel: '40 hours', // COPY:
    includes: [
      'UX/UI, frontend and backend development', // COPY:
      'Features, fixes and integrations', // COPY:
      'Technical planning and support', // COPY:
      'Priority over non-retainer work', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'hidden',
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
