import { Section, type Tone } from '@/components/layout/Section'
import { Marquee } from '@/components/ui/Marquee'
import type { Client } from '@/types'

export interface LogoMarqueeProps {
  label: string
  clients: Client[]
  tone?: Tone
}

/**
 * Client names/logos on an endless strip. Text tiles by default; set `logo` in
 * data/clients to use an SVG (tinted to the section via a CSS mask).
 */
export function LogoMarquee({ label, clients, tone = 'dark' }: LogoMarqueeProps) {
  return (
    <Section tone={tone} spacing="none" className="border-y border-tone py-10" aria-label={label}>
      <p className="eyebrow container-site mb-8 text-center text-muted">{label}</p>
      <Marquee gap="3.5rem">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center gap-14">
            {client.logo ? (
              <span
                role="img"
                aria-label={client.name}
                className="block h-9 w-36 bg-current opacity-70"
                style={{
                  maskImage: `url(${client.logo})`,
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  maskSize: 'contain',
                }}
              />
            ) : (
              <span className="flex items-baseline gap-3 whitespace-nowrap">
                <span className="text-heading-lg font-bold tracking-tight uppercase opacity-80">
                  {client.name}
                </span>
                <span className="eyebrow text-muted">{client.sector}</span>
              </span>
            )}
            <span aria-hidden="true" className="size-1.5 bg-orange" />
          </div>
        ))}
      </Marquee>
    </Section>
  )
}
