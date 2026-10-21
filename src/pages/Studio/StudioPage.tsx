import { PageMeta } from '@/components/seo/PageMeta'
import { media } from '@/data/media'
import { pageMeta, studioContent } from '@/data/pages'
import { founders, principles, values } from '@/data/studio'
import { stackBuilds, stackContent, technologies, technologyLayers } from '@/data/technologies'
import { testimonialLabels, testimonials } from '@/data/testimonials'
import { PageTitle } from '@/sections/shared/PageTitle'
import { Testimonial } from '@/sections/shared/Testimonial'
import { FounderProfiles } from '@/sections/studio/FounderProfiles'
import { StackDiagram } from '@/sections/studio/StackDiagram'
import { StudioIntro } from '@/sections/studio/StudioIntro'
import { ValuesGrid } from '@/sections/studio/ValuesGrid'

export function StudioPage() {
  return (
    <>
      <PageMeta {...pageMeta.studio} />
      <PageTitle content={studioContent.hero} />
      <StudioIntro
        eyebrow={studioContent.intro.eyebrow}
        title={studioContent.intro.title}
        paragraphs={studioContent.intro.paragraphs}
        illustration={media.studio.oneTeam}
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
