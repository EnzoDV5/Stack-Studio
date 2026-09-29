import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { CtaContent } from '@/types'

export interface CtaBannerProps {
  content: CtaContent
  location: string
  tone?: Tone
}

/** Compact mid-page CTA (the giant one is the closing band). */
export function CtaBanner({ content, location, tone = 'dark' }: CtaBannerProps) {
  return (
    <Section tone={tone} spacing="sm" grid="radial">
      <div className="container-site flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          {content.eyebrow && <Eyebrow label={content.eyebrow} className="mb-5" />}
          <Heading size="heading-xl" className="max-w-[20ch]" compile>
            {content.title}
          </Heading>
          {content.body && <p className="mt-3 max-w-[48ch] text-muted">{content.body}</p>}
        </div>
        <Button
          to={content.to}
          size="lg"
          withArrow
          className="shrink-0"
          analytics={{ event: 'Start project click', props: { location } }}
        >
          {content.label}
        </Button>
      </div>
    </Section>
  )
}
