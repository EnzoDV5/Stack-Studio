import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { MediaReveal } from '@/components/media/MediaReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { ImageAsset } from '@/types'

export interface StudioIntroProps {
  eyebrow: string
  title: string
  paragraphs: string[]
  image: ImageAsset
  tone?: Tone
}

/** Who we are: statement and story beside a workspace image that reveals on scroll. */
export function StudioIntro({
  eyebrow,
  title,
  paragraphs,
  image,
  tone = 'paper',
}: StudioIntroProps) {
  return (
    <Section tone={tone} className="pt-8">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow label={eyebrow} className="mb-6" />
          <Heading size="display-lg" className="max-w-[14ch]" compile>
            {title}
          </Heading>
          <div className="mt-10 max-w-[52ch] space-y-5 text-body-lg text-muted">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <MediaReveal className="aspect-4/5 rounded-lg bg-paper-200 lg:col-span-5 lg:col-start-8">
          <Image image={image} sizes="(min-width: 1024px) 40vw, 100vw" />
        </MediaReveal>
      </div>
    </Section>
  )
}
