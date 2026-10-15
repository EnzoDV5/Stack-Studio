import type { SiteConfig } from '@/types'
import { media } from './media'

export const site: SiteConfig = {
  name: 'Stack Studio',
  shortName: 'Stack',
  tagline: 'Websites that stand out. Software that moves you forward.', // COPY:
  description:
    'Stack Studio helps businesses stand out and grow with custom websites, apps and software, plus hosting and ongoing care. Based in Centurion, South Africa.', // COPY:
  url: 'https://stack-studio.web.app', // Use the live Hosting URL until the custom domain serves the site.
  locale: 'en-ZA',
  email: 'enzo.devittorio03@gmail.com',
  whatsapp: {
    number: '27000000000', // COPY: placeholder, digits only (27 + number without leading 0)
    display: '+27 00 000 0000', // COPY: placeholder
    message: "Hi Stack Studio, I'd like to chat about a website project.", // COPY:
  },
  location: { city: 'Centurion', region: 'Gauteng', country: 'South Africa' },
  foundedYear: 2026,
  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@stackstudio.za',
      href: 'https://www.instagram.com/stackstudio.za/',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'Stack Studio',
      href: 'https://www.linkedin.com/company/stack-studio-za/', // COPY: confirm LinkedIn URL
    },
  ],
  ogImage: media.brand.ogImage,
  legal: {
    copyright: 'Stack Studio. All rights reserved.', // COPY:
    privacyLabel: 'Privacy (POPIA)', // COPY:
  },
  responsePromise: 'We reply within one business day.', // COPY:
}

export function whatsappHref(message = site.whatsapp.message): string | undefined {
  // Hide WhatsApp controls until a real South African number replaces the placeholder.
  if (!/^27[1-9]\d{8}$/.test(site.whatsapp.number)) return undefined
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
