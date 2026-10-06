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
      'Create and manage projects with one team; scope and monthly hours are agreed together.', // COPY:
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
]

export function plansFor(family: PlanFamily, includeHidden = false): Plan[] {
  return plans.filter((p) => p.family === family && (includeHidden || p.visibility !== 'hidden'))
}

export function getPlan(id: string | null | undefined): Plan | undefined {
  return plans.find((p) => p.id === id)
}
