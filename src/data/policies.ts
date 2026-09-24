/**
 * Commercial policies, rendered on the Pricing page and /terms (see docs/pricing-model.md).
 */
import type { Policies } from '@/types'

export const policies: Policies = {
  paymentSchedules: [
    {
      id: 'standard',
      label: 'Projects under R50,000', // COPY:
      appliesTo: 'Projects under R50,000', // COPY:
      maxProjectValue: 50_000,
      milestones: [
        { label: 'To start', percent: 50 }, // COPY:
        { label: 'Design/development milestone', percent: 30 }, // COPY:
        { label: 'Before launch', percent: 20 }, // COPY:
      ],
    },
    {
      id: 'large',
      label: 'Larger projects', // COPY:
      appliesTo: 'Projects of R50,000 and more', // COPY:
      maxProjectValue: null,
      milestones: [
        { label: 'To start', percent: 30 }, // COPY:
        { label: 'Core system', percent: 30 }, // COPY:
        { label: 'Feature complete', percent: 30 }, // COPY:
        { label: 'Deployment', percent: 10 }, // COPY:
      ],
    },
  ],
  items: [
    {
      id: 'retainers',
      title: 'Retainers', // COPY:
      body: [
        'Billed monthly in advance with a 3-month minimum.', // COPY:
        'Unused hours roll over one month, then expire.', // COPY:
        'Support during business hours (SAST).', // COPY:
      ],
    },
    {
      id: 'annual',
      title: 'Annual prepay', // COPY:
      body: ['Optional: 12 months for the price of 11.'], // COPY:
    },
    {
      id: 'third-party',
      title: 'Third-party costs', // COPY:
      body: [
        'Cloud (AWS, Azure, Firebase, Supabase, Cloudflare), AI/API usage, email, SMS and storage are billed at actual cost.', // COPY:
        'You pay the Stack plan plus actual usage.', // COPY:
      ],
    },
    {
      id: 'domains',
      title: 'Domains', // COPY:
      body: ['Registration and renewal at cost. Management is included in relevant plans.'], // COPY:
    },
    {
      id: 'warranty',
      title: '30-day launch warranty', // COPY:
      body: [
        'Every new build includes bug fixes on what Stack built for 30 days after launch. No new features.',
      ], // COPY:
    },
    {
      id: 'ip',
      title: 'Ownership', // COPY:
      body: ['Intellectual property transfers to you on final payment.'], // COPY:
    },
  ],
  maintenance: {
    title: 'Maintenance is not unlimited features.', // COPY:
    intro:
      'Plans keep what you have healthy. New work is scoped separately or taken from retainer hours.', // COPY:
    included: [
      'Bug fixes', // COPY:
      'Updates', // COPY:
      'Monitoring', // COPY:
      'The plan’s included hours', // COPY:
    ],
    excluded: [
      'New functionality', // COPY:
      'Redesigns', // COPY:
      'Major integrations', // COPY:
      'New applications', // COPY:
      'Large content changes', // COPY:
    ],
    outro: 'Anything not included is quoted separately or taken from retainer hours.', // COPY:
  },
  vatNote: 'Prices exclude VAT where applicable.', // COPY: confirm VAT status
  hostingOnRequest: 'Hosting-only available on request.', // COPY:
  minimumTermMonths: 3,
}
