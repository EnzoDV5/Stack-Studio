import { Section, type Tone } from '@/components/layout/Section'
import { IllustrationScene } from '@/components/media/IllustrationScene'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { IllustrationSceneAsset } from '@/types'

export interface StudioIntroProps {
  eyebrow: string
  title: string
  paragraphs: string[]
  illustration: IllustrationSceneAsset
  tone?: Tone
}

/**
 * Who we are: statement and story beside the team illustration, which assembles once it
 * reaches the middle of the screen.
 */
export function StudioIntro({
  eyebrow,
  title,
  paragraphs,
  illustration,
  tone = 'paper',
}: StudioIntroProps) {
  return (
    <Section tone={tone} className="pt-8">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center">
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
        <IllustrationScene
          scene={illustration}
          sizes="(min-width: 1700px) 640px, (min-width: 1024px) 40vw, 90vw"
          className="mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none"
        />
      </div>
    </Section>
  )
}
