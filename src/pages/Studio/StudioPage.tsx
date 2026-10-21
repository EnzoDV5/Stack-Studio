import { PageMeta } from '@/components/seo/PageMeta'
import { media } from '@/data/media'
import { pageMeta, studioContent } from '@/data/pages'
import { founders, principles, studioFacts, teamEditor, values } from '@/data/studio'
import { stackBuilds, stackContent, technologies, technologyLayers } from '@/data/technologies'
import { testimonialLabels, testimonials } from '@/data/testimonials'
import { Testimonial } from '@/sections/shared/Testimonial'
import { FounderProfiles } from '@/sections/studio/FounderProfiles'
import { StackDiagram } from '@/sections/studio/StackDiagram'
import { StudioHero } from '@/sections/studio/StudioHero'
import { StudioIntro } from '@/sections/studio/StudioIntro'
import { ValuesGrid } from '@/sections/studio/ValuesGrid'

export function StudioPage() {
  return (
    <>
      <PageMeta {...pageMeta.studio} />
      <StudioHero
        content={studioContent.hero}
        facts={studioFacts}
        illustration={media.studio.oneTeam}
      />
      <StudioIntro
        eyebrow={studioContent.intro.eyebrow}
        title={studioContent.intro.title}
        paragraphs={studioContent.intro.paragraphs}
        editor={teamEditor}
      />
      <FounderProfiles
        intro={studioContent.founders}
        founders={founders}
        linkedinLabel={studioContent.linkedinLabel}
      />
      <ValuesGrid
        intro={{ ...studioContent.howWeWork, eyebrow: undefined }}
        items={principles}
        image={media.studio.detail}
        tone="dark"
      />
      <StackDiagram
        intro={stackContent}
        labels={stackContent}
        technologies={technologies}
        layers={technologyLayers}
        builds={stackBuilds}
        tone="dark"
      />
      <ValuesGrid
        intro={{ ...studioContent.values, eyebrow: undefined }}
        items={values}
        headerVariant="minimal"
        titleSize="display-lg"
        tone="dark"
      />
      <Testimonial testimonials={testimonials} labels={testimonialLabels} />
    </>
  )
}
