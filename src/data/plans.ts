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
    description: 'Hosting and technical upkeep for your app, plus three small changes each month.', // COPY:
  },
  {
    id: 'partner',
    name: 'Partner', // COPY:
    description:
      'An ongoing team to plan and build new features, integrations and bigger improvements. We agree the monthly hours together.', // COPY:
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
      'Website hosting, SSL and DNS included', // COPY:
      'One standard domain registration or renewal, up to R600/year', // COPY:
      'Backups, uptime checks and security updates', // COPY:
      'Routine fixes to keep the site running', // COPY:
    ],
    minimumTermMonths: MIN_TERM,
    visibility: 'pricing',
  },

  /* ---------- Managed (applications only) ---------- */
  {
    id: 'managed-app',
    family: 'managed',
    name: 'Managed Software', // COPY:
    tagline: 'One app, hosted, managed and improved in small steps.', // COPY:
    pricePerMonth:
      APP_HOSTING_MONTHLY +
      (MANAGED_MANAGEMENT_HOURS + MANAGED_CHANGE_REQUESTS * HOURS_PER_CHANGE_REQUEST) *
        CARE_RATE_PER_HOUR,
    includedHours: MANAGED_CHANGE_REQUESTS * HOURS_PER_CHANGE_REQUEST,
    includes: [
      'Hosting for one standard app included', // COPY:
      'Monitoring, backups, security and deployments', // COPY:
      `${MANAGED_CHANGE_REQUESTS} small change requests each month, up to ${HOURS_PER_CHANGE_REQUEST} hour each`, // COPY:
    ],
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
    name: 'Partner 10', // COPY:
    tagline: 'Ten reserved development hours each month.', // COPY:
    pricePerMonth: 10 * BUILD_RATE_PER_HOUR,
    includedHours: 10,
    hoursLabel: '10 hours', // COPY:
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
