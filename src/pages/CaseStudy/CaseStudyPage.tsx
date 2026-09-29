import { useParams } from 'react-router'
import { ClientLogo } from '@/components/media/ClientLogo'
import { PageMeta } from '@/components/seo/PageMeta'
import { Tag } from '@/components/ui/Tag'
import { caseStudyContent } from '@/data/pages'
import { getNextProject, getProject } from '@/data/projects'
import { getTestimonial } from '@/data/testimonials'
import { NotFoundPage } from '@/pages/NotFound'
import { CaseGallery } from '@/sections/case-study/CaseGallery'
import { CaseDevice } from '@/sections/case-study/CaseDevice'
import { CaseMeta } from '@/sections/case-study/CaseMeta'
import { CaseMetrics } from '@/sections/case-study/CaseMetrics'
import { CaseNarrative } from '@/sections/case-study/CaseNarrative'
import { CaseOutro } from '@/sections/case-study/CaseOutro'
import { Testimonial } from '@/sections/shared/Testimonial'
import { PageTitle } from '@/sections/shared/PageTitle'

/** One reusable template for every /work/:slug, driven entirely by data/projects.ts. */
export function CaseStudyPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFoundPage />

  const next = getNextProject(project.slug)
  const testimonial = getTestimonial(project.testimonialId)
  const labels = caseStudyContent.narrativeLabels
  const { narrative } = project

  return (
    <>
      <PageMeta
        title={`${project.name} — ${caseStudyContent.eyebrow}`}
        description={project.summary}
        path={`/work/${project.slug}`}
        ogImage={project.thumbnail}
        noindex={project.isSample}
      />

      <PageTitle
        tone="dark"
        content={{
          eyebrow: `${caseStudyContent.eyebrow} · ${project.year}`,
          title: project.name,
          intro: project.summary,
        }}
        aside={project.logo && <ClientLogo logo={project.logo} />}
      >
        {project.isSample && (
          <Tag variant="accent" className="h-auto! max-w-full py-2 whitespace-normal!">
            {caseStudyContent.sampleNotice}
          </Tag>
        )}
      </PageTitle>

      <CaseMeta
        labels={caseStudyContent.meta}
        client={project.client}
        year={project.year}
        services={project.services}
        liveUrl={project.liveUrl}
      />

      <CaseDevice
        eyebrow={caseStudyContent.device.eyebrow}
        title={caseStudyContent.device.title(project.name)}
        screen={project.screen ?? project.hero.image}
      />

      <CaseNarrative
        chapters={[
          { id: 'problem', label: labels.problem, block: narrative.problem },
          { id: 'approach', label: labels.approach, block: narrative.approach },
          { id: 'build', label: labels.build, block: narrative.build },
          { id: 'result', label: labels.result, block: narrative.result },
        ]}
      />

      <CaseGallery tone="paper" label={caseStudyContent.galleryLabel} items={project.gallery} />

      {project.metrics.length > 0 && (
        <CaseMetrics
          tone="paper"
          label={caseStudyContent.metricsLabel}
          metrics={project.metrics}
          note={caseStudyContent.metricsNote}
        />
      )}

      {testimonial && <Testimonial testimonial={testimonial} />}

      <CaseOutro
        cta={{
          ...caseStudyContent.cta,
          to: project.briefType ? `/start?type=${project.briefType}` : caseStudyContent.cta.to,
        }}
        next={next}
        nextLabel={caseStudyContent.nextLabel}
        cursorLabel={next?.name ?? ''}
      />
    </>
  )
}
