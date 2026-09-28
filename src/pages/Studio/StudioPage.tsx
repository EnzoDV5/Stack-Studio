import { PageMeta } from '@/components/seo/PageMeta'
import { media } from '@/data/media'
import { pageMeta, studioContent } from '@/data/pages'
import { founders, principles, values } from '@/data/studio'
import { testimonials } from '@/data/testimonials'
import { PageTitle } from '@/sections/shared/PageTitle'
import { Testimonial } from '@/sections/shared/Testimonial'
import { FounderProfiles } from '@/sections/studio/FounderProfiles'
import { StudioIntro } from '@/sections/studio/StudioIntro'
import { ValuesGrid } from '@/sections/studio/ValuesGrid'

export function StudioPage() {
  const testimonial = testimonials[1] ?? testimonials[0]
  return (
    <>
      <PageMeta {...pageMeta.studio} />
      <PageTitle content={studioContent.hero} />
      <StudioIntro
        eyebrow={studioContent.intro.eyebrow}
        title={studioContent.intro.title}
        paragraphs={studioContent.intro.paragraphs}
        image={media.studio.workspace}
      />
      <FounderProfiles
        intro={studioContent.founders}
        founders={founders}
        linkedinLabel={studioContent.linkedinLabel}
      />
      <ValuesGrid
        intro={studioContent.howWeWork}
        items={principles}
        index={1}
        image={media.studio.detail}
      />
      <ValuesGrid
        intro={studioContent.values}
        items={values}
        index={2}
        headerVariant="inline"
        tone="dark"
      />
      {testimonial && <Testimonial testimonial={testimonial} />}
    </>
  )
}
