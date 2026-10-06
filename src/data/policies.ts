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
        'Managed change requests reset each month. Unused Partner hours roll over one month, then expire.', // COPY:
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
        'The hosting listed in Website Care and Managed Software is included in the plan price.', // COPY:
        'Extra cloud capacity, AI/API usage, email, SMS and storage are agreed first and billed at cost.', // COPY:
      ],
    },
    {
      id: 'domains',
      title: 'Domains', // COPY:
      body: [
        'Website Care includes one standard domain registration or renewal up to R600 a year. Extra or premium domains are billed at cost.', // COPY:
      ],
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
    title: 'What the monthly plans cover.', // COPY:
    intro:
      'Care keeps one website running. Managed keeps one app running and includes three small change requests a month.', // COPY:
    included: [
      'Hosting and routine updates', // COPY:
      'Backups and monitoring', // COPY:
      'Routine fixes to covered systems', // COPY:
      'Three small changes in Managed Software', // COPY:
    ],
    excluded: [
      'Content or design changes in Website Care', // COPY:
      'Changes beyond Managed Software’s three requests', // COPY:
      'New functionality', // COPY:
      'Redesigns', // COPY:
      'Major integrations', // COPY:
      'New applications', // COPY:
      'Large content changes', // COPY:
    ],
    outro: 'Extra requests are quoted first. Partner is for regular features and larger changes.', // COPY:
  },
  vatNote: 'Prices exclude VAT where applicable.', // COPY: confirm VAT status
  hostingOnRequest: 'Hosting-only available on request.', // COPY:
  minimumTermMonths: 3,
}
