import type { Faq, FaqCategory } from '@/types'

export const faqs: Faq[] = [
  {
    id: 'who',
    category: 'general',
    question: 'Who will I actually be working with?', // COPY:
    answer:
      'Us: Enzo and Armand. There are no account managers or handoffs. The people you speak to are the people designing and building your site.', // COPY:
  },
  {
    id: 'where',
    category: 'general',
    question: 'Do you only work with clients in Gauteng?', // COPY:
    answer:
      'We’re based in Centurion and love meeting in person, but we work with clients across South Africa remotely.', // COPY:
  },
  {
    id: 'templates',
    category: 'services',
    question: 'Do you use templates or page builders?', // COPY:
    answer:
      'No. Every site is designed from scratch around your brand and built with modern, fast code. You still get an easy way to edit the content that changes.', // COPY:
  },
  {
    id: 'content',
    category: 'services',
    question: 'Can you help with copy, photos and branding?', // COPY:
    answer:
      'Yes. Copywriting, photo and video direction and brand refreshes are available as add-ons. Tell us what you have and we’ll fill the gaps.', // COPY:
  },
  {
    id: 'seo',
    category: 'services',
    question: 'Will my site show up on Google?', // COPY:
    answer:
      'Every build includes on-page SEO basics, fast load times and analytics. For ongoing rankings, our Growth plan adds monthly SEO work and reporting.', // COPY:
  },
  {
    id: 'cost',
    category: 'pricing',
    question: 'Why show prices at all?', // COPY:
    answer:
      'Because you shouldn’t have to ask. Our “from” prices are honest starting points. Your fixed quote follows a short discovery call and won’t change unless the scope does.', // COPY:
  },
  {
    id: 'payment',
    category: 'pricing',
    question: 'How does payment work?', // COPY:
    answer:
      'Typically 50% to start and 50% at launch. Larger projects can be split into milestones. Monthly plans are billed monthly.', // COPY:
  },
  {
    id: 'monthly',
    category: 'pricing',
    question: 'Do I have to take a monthly plan?', // COPY:
    answer:
      'No. You own your site. Most clients choose a plan so hosting, security and small changes are handled, but it’s optional.', // COPY:
  },
  {
    id: 'timeline',
    category: 'process',
    question: 'How long does a website take?', // COPY:
    answer:
      'A focused one-pager can launch in 2–3 weeks; a full business site usually takes 4–6 weeks. The biggest factor is how quickly content and feedback come together.', // COPY:
  },
  {
    id: 'feedback',
    category: 'process',
    question: 'How many rounds of changes do I get?', // COPY:
    answer:
      'Two structured feedback rounds on design, plus live review on a staging link during the build. We’d rather get it right than count revisions.', // COPY:
  },
  {
    id: 'after',
    category: 'process',
    question: 'What happens after launch?', // COPY:
    answer:
      'You get a handover session and 14 days of launch support. After that, a monthly plan keeps things updated, or you can call on us when you need us.', // COPY:
  },
]

export function faqsFor(...categories: FaqCategory[]): Faq[] {
  return faqs.filter((f) => categories.includes(f.category))
}
