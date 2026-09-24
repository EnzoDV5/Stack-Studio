/**
 * PRICING, all PLACEHOLDER. The offer isn't final.
 * Prices use repeated digits (R 11 111, R 222/month…) so nobody mistakes them for real ones.
 * Restructure freely: add, remove or rename packages/plans/add-ons; the UI and the
 * estimator (src/lib/estimate.ts) adapt automatically. All amounts in ZAR, excl. VAT.
 */
import type {
  AddOn,
  BudgetRange,
  MonthlyPlan,
  PricingSettings,
  ProjectPackage,
  ScopeOption,
  TimelineOption,
} from '@/types'

export const pricingSettings: PricingSettings = {
  currency: 'ZAR',
  estimateSpread: 0.12,
  vatNote: 'All prices in ZAR, excluding VAT.', // COPY:
  disclaimer:
    'Estimates are indicative and based on typical projects. We confirm a fixed quote after a short discovery call.', // COPY:
  isPlaceholder: true, // COPY: set to false once real prices are in
  placeholderNotice: 'Placeholder pricing: final figures coming soon.', // COPY:
}

/* ---------- Once-off project builds ---------- */
export const projectPackages: ProjectPackage[] = [
  {
    id: 'launch',
    name: 'Launch', // COPY:
    tagline: 'A sharp one-pager to get you live, fast.', // COPY:
    bestFor: 'New businesses, campaigns and events', // COPY:
    fromPrice: 11_111, // COPY: PLACEHOLDER PRICE
    includedPages: 1,
    extraPagePrice: 1_111, // COPY: PLACEHOLDER PRICE
    timelineWeeks: [2, 3],
    includes: [
      'Single scrolling landing page', // COPY:
      'Brand-led design, desktop and mobile', // COPY:
      'Contact or enquiry form', // COPY:
      'Basic SEO and analytics setup', // COPY:
    ],
  },
  {
    id: 'business',
    name: 'Business', // COPY:
    tagline: 'The full front door for a growing business.', // COPY:
    bestFor: 'SMEs and NPOs that need proof, services and leads', // COPY:
    fromPrice: 22_222, // COPY: PLACEHOLDER PRICE
    includedPages: 5,
    extraPagePrice: 2_222, // COPY: PLACEHOLDER PRICE
    timelineWeeks: [4, 6],
    includes: [
      'Up to 5 custom-designed pages', // COPY:
      'Editable content (CMS) for the pages that change', // COPY:
      'Guided enquiry or quote form', // COPY:
      'On-page SEO, analytics and speed optimisation', // COPY:
      'Launch support and a handover session', // COPY:
    ],
    highlighted: true,
  },
  {
    id: 'signature',
    name: 'Signature', // COPY:
    tagline: 'Cinematic, motion-led and built to impress.', // COPY:
    bestFor: 'Brands that need to stand out, not just exist', // COPY:
    fromPrice: 44_444, // COPY: PLACEHOLDER PRICE
    includedPages: 8,
    extraPagePrice: 2_222, // COPY: PLACEHOLDER PRICE
    timelineWeeks: [6, 10],
    includes: [
      'Up to 8 pages with a bespoke design system', // COPY:
      'Scroll-driven motion and interaction design', // COPY:
      'Case study or portfolio templates', // COPY:
      'Advanced SEO, analytics and conversion tracking', // COPY:
      'Priority support for the first 30 days', // COPY:
    ],
  },
  {
    id: 'product',
    name: 'Digital product', // COPY:
    tagline: 'Portals, dashboards and web apps.', // COPY:
    bestFor: 'Custom tools, client portals and booking systems', // COPY:
    fromPrice: 88_888, // COPY: PLACEHOLDER PRICE
    includedPages: 10,
    extraPagePrice: 3_333, // COPY: PLACEHOLDER PRICE
    timelineWeeks: [8, 14],
    includes: [
      'UX research, flows and prototyping', // COPY:
      'Custom front-end and back-end', // COPY:
      'User accounts, roles and integrations', // COPY:
      'Staged releases with testing', // COPY:
    ],
  },
]

/* ---------- Monthly plans (recurring) ---------- */
export const monthlyPlans: MonthlyPlan[] = [
  {
    id: 'host',
    name: 'Host', // COPY:
    category: 'hosting',
    tagline: 'Fast, secure hosting, looked after.', // COPY:
    pricePerMonth: 111, // COPY: PLACEHOLDER PRICE
    includes: [
      'Managed hosting and SSL', // COPY:
      'Daily backups', // COPY:
      'Uptime monitoring', // COPY:
    ],
  },
  {
    id: 'care',
    name: 'Care', // COPY:
    category: 'care',
    tagline: 'Hosting plus a team on call for changes.', // COPY:
    pricePerMonth: 444, // COPY: PLACEHOLDER PRICE
    includes: [
      'Everything in Host', // COPY:
      'Security and plugin updates', // COPY:
      '1 hour of content edits a month', // COPY:
      'Monthly health report', // COPY:
    ],
    minimumTermMonths: 6,
    highlighted: true,
  },
  {
    id: 'growth',
    name: 'Growth', // COPY:
    category: 'growth',
    tagline: 'A retainer that keeps improving results.', // COPY:
    pricePerMonth: 1_111, // COPY: PLACEHOLDER PRICE
    includes: [
      'Everything in Care', // COPY:
      '4 hours of design and development a month', // COPY:
      'SEO and analytics reporting with recommendations', // COPY:
      'Quarterly conversion review', // COPY:
    ],
    minimumTermMonths: 6,
  },
]

/* ---------- Add-ons ---------- */
export const addOns: AddOn[] = [
  {
    id: 'copywriting',
    name: 'Copywriting', // COPY:
    description: 'We write the words, not just the layout.', // COPY:
    price: 3_333, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'cms-blog',
    name: 'Blog or news section', // COPY:
    description: 'Publish articles and updates yourself.', // COPY:
    price: 3_333, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'ecommerce',
    name: 'Online shop', // COPY:
    description: 'Products, cart and local payment gateways.', // COPY:
    price: 11_111, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'booking',
    name: 'Bookings or quotes', // COPY:
    description: 'Online bookings, quote calculators or appointment flows.', // COPY:
    price: 4_444, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'multilingual',
    name: 'Extra language', // COPY:
    description: 'Afrikaans, isiZulu or another language version.', // COPY:
    price: 5_555, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'brand',
    name: 'Brand refresh', // COPY:
    description: 'Logo tidy-up, colour and type system.', // COPY:
    price: 6_666, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'media',
    name: 'Photo and video direction', // COPY:
    description: 'Planning and directing a shoot for your site.', // COPY:
    price: 7_777, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'seo-content',
    name: 'SEO content plan', // COPY:
    description: 'Keyword research and a 3-month content plan.', // COPY:
    price: 2_222, // COPY: PLACEHOLDER PRICE
    billing: 'once',
    inBrief: true,
  },
  {
    id: 'priority-support',
    name: 'Priority support', // COPY:
    description: 'Same-day response on business days.', // COPY:
    price: 555, // COPY: PLACEHOLDER PRICE
    billing: 'monthly',
    inBrief: false,
  },
]

/* ---------- Brief options that feed the estimator ---------- */
export const scopeOptions: ScopeOption[] = [
  { id: 'single', label: 'One page', description: 'Everything on a single scrolling page', pages: 1 }, // COPY:
  { id: 'small', label: 'Up to 5 pages', description: 'Home, about, services, work, contact', pages: 5 }, // COPY:
  { id: 'medium', label: '6–10 pages', description: 'More services, case studies or locations', pages: 10 }, // COPY:
  { id: 'large', label: '10+ pages', description: 'Large content, many sections or products', pages: 15 }, // COPY:
  { id: 'unsure', label: 'Not sure yet', description: 'We’ll work it out together', pages: 0 }, // COPY:
]

export const timelineOptions: TimelineOption[] = [
  { id: 'flexible', label: 'Flexible', description: 'No rush, 3+ months is fine', multiplier: 0.95 }, // COPY:
  { id: 'standard', label: 'In the next 2–3 months', description: 'A normal project pace', multiplier: 1 }, // COPY:
  { id: 'soon', label: 'Within 6 weeks', description: 'We’ll prioritise your project', multiplier: 1.15 }, // COPY:
  { id: 'urgent', label: 'ASAP', description: 'Rush delivery with a dedicated schedule', multiplier: 1.3 }, // COPY:
]

export const budgetRanges: BudgetRange[] = [
  { id: 'under-15', label: 'Under R 15 000', min: 0, max: 15_000 }, // COPY:
  { id: '15-30', label: 'R 15 000 – R 30 000', min: 15_000, max: 30_000 }, // COPY:
  { id: '30-60', label: 'R 30 000 – R 60 000', min: 30_000, max: 60_000 }, // COPY:
  { id: '60-120', label: 'R 60 000 – R 120 000', min: 60_000, max: 120_000 }, // COPY:
  { id: '120-plus', label: 'R 120 000+', min: 120_000, max: null }, // COPY:
]

export const pricingData = {
  settings: pricingSettings,
  packages: projectPackages,
  monthlyPlans,
  addOns,
  scopeOptions,
  timelineOptions,
  budgetRanges,
}

export type PricingData = typeof pricingData
