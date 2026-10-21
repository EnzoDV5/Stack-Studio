import { IllustrationScene } from '@/components/media/IllustrationScene'
import { PageTitle } from '@/sections/shared/PageTitle'
import type { IllustrationSceneAsset, SectionIntro, StudioFact } from '@/types'

export interface StudioHeroProps {
  content: SectionIntro
  facts: StudioFact[]
  illustration: IllustrationSceneAsset
}

/**
 * The Studio page title: title and intro over a row of quick facts, with the team
 * illustration beside them (below on phones). The illustration assembles once it's fully in
 * view, after the title has compiled.
 */
export function StudioHero({ content, facts, illustration }: StudioHeroProps) {
  return (
    <PageTitle
      content={content}
      asidePlacement="beside"
      aside={
        <IllustrationScene
          scene={illustration}
          trigger="visible"
          sizes="(min-width: 1280px) 352px, (min-width: 1024px) 304px, 300px"
          className="mx-auto w-full max-w-[18.75rem] lg:w-[19rem] lg:max-w-none xl:w-[22rem]"
        />
      }
    >
      <dl className="grid gap-x-8 gap-y-5 border-t border-tone pt-6 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="eyebrow text-muted">{fact.label}</dt>
            <dd className="mt-2 text-body">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </PageTitle>
  )
}
