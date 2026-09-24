import type { Faq, FaqCategory } from '@/types'

export const faqs: Faq[] = [
  {
    id: 'who',
    category: 'general',
    question: 'Who will I actually be working with?', // COPY:
    answer:
      'Us: Enzo and Armand. There are no account managers or handoffs. The people you speak to are the people designing, building and looking after your systems.', // COPY:
  },
  {
    id: 'where',
    category: 'general',
    question: 'Do you only work with clients in Gauteng?', // COPY:
    answer:
      'We’re based in Centurion and love meeting in person, but we work with clients across South Africa remotely.', // COPY:
  },
  {
    id: 'takeover',
    category: 'services',
    question: 'Can you take over a site or app someone else built?', // COPY:
    answer:
      'Yes. We start with a technical audit, fix anything critical, move it somewhere safe and then look after it on a Care or Managed plan. A website audit fee is credited against a takeover signed within 30 days.', // COPY:
  },
  {
    id: 'templates',
    category: 'services',
    question: 'Do you use templates or page builders?', // COPY:
    answer:
      'No. Every website is designed from scratch around your brand and built with modern, fast code. You still get an easy way to edit the content that changes.', // COPY:
  },
  {
    id: 'ai',
    category: 'services',
    question: 'Are you an AI agency?', // COPY:
    answer:
      'No. We add useful AI features to the systems we build or the ones you already use: search, assistants, document analysis, automations. AI/API usage is billed separately at actual cost.', // COPY:
  },
  {
    id: 'payment',
    category: 'pricing',
    question: 'How do payments work?', // COPY:
    answer:
      'Projects under R50,000: 50% to start, 30% at the design/development milestone and 20% before launch. Larger projects: 30% to start, 30% at core system, 30% at feature complete and 10% at deployment.', // COPY:
  },
  {
    id: 'minimum',
    category: 'pricing',
    question: 'Is there a minimum term on monthly plans?', // COPY:
    answer:
      'Yes: three months, billed monthly in advance. After that you can stay month to month. Paying annually gets you 12 months for the price of 11.', // COPY:
  },
  {
    id: 'rollover',
    category: 'pricing',
    question: 'What happens to unused hours?', // COPY:
    answer:
      'Unused plan or retainer hours roll over one month, then expire. Support runs during business hours (SAST).', // COPY:
  },
  {
    id: 'third-party',
    category: 'pricing',
    question: 'What about hosting, cloud and AI costs?', // COPY:
    answer:
      'Cloud (AWS, Azure, Firebase, Supabase, Cloudflare), AI/API usage, email, SMS and storage are billed at actual cost, with no markup. You pay the Stack plan plus actual usage. Domains are registered and renewed at cost.', // COPY:
  },
  {
    id: 'vat',
    category: 'pricing',
    question: 'Do your prices include VAT?', // COPY:
    answer: 'Prices exclude VAT where applicable.', // COPY: confirm VAT status
  },
  {
    id: 'ownership',
    category: 'pricing',
    question: 'Who owns the website or software?', // COPY:
    answer:
      'You do. Intellectual property transfers to you on final payment, and you can move it anywhere you like.', // COPY:
  },
  {
    id: 'warranty',
    category: 'pricing',
    question: 'What if something breaks after launch?', // COPY:
    answer:
      'Every new build includes a 30-day launch warranty: we fix bugs in what we built, free. New features aren’t included; those are quoted separately or covered by retainer hours.', // COPY:
  },
  {
    id: 'timeline',
    category: 'process',
    question: 'How long does a website take?', // COPY:
    answer:
      'A focused business website usually takes 4–6 weeks; immersive and e-commerce builds take longer. The biggest factor is how quickly content and feedback come together.', // COPY:
  },
  {
    id: 'discovery',
    category: 'process',
    question: 'Why do larger builds start with Discovery?', // COPY:
    answer:
      'Software is only as good as its plan. Discovery & Scoping (from R7,500) maps users, features, data and integrations into a buildable plan and a real estimate. It’s required before any build of R120,000+.', // COPY:
  },
  {
    id: 'after',
    category: 'process',
    question: 'What happens after launch?', // COPY:
    answer:
      'You get a handover session and the 30-day launch warranty. After that, a Care or Managed plan keeps things updated and monitored, or you can call on us when you need us.', // COPY:
  },
]

export function faqsFor(...categories: FaqCategory[]): Faq[] {
  return faqs.filter((f) => categories.includes(f.category))
}
