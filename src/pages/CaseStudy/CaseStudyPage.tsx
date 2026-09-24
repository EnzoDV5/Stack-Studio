import { useParams } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { caseStudyContent } from '@/data/pages'
import { getNextProject, getProject } from '@/data/projects'
import { getTestimonial } from '@/data/testimonials'
import { NotFoundPage } from '@/pages/NotFound'
import { CaseGallery } from '@/sections/case-study/CaseGallery'
import { CaseHero } from '@/sections/case-study/CaseHero'
import { CaseMeta } from '@/sections/case-study/CaseMeta'
import { CaseMetrics } from '@/sections/case-study/CaseMetrics'
import { CaseNarrative } from '@/sections/case-study/CaseNarrative'
import { CaseOutro } from '@/sections/case-study/CaseOutro'
import { Testimonial } from '@/sections/shared/Testimonial'

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

      <CaseHero
        eyebrow={`${caseStudyContent.eyebrow} · ${project.year}`}
        title={project.name}
        summary={project.summary}
        media={project.hero}
        sampleNotice={project.isSample ? caseStudyContent.sampleNotice : undefined}
      />

      <CaseMeta
        labels={caseStudyContent.meta}
        client={project.client}
        year={project.year}
        services={project.services}
        liveUrl={project.liveUrl}
      />

      <CaseNarrative
        chapters={[
          { id: 'problem', label: labels.problem, block: narrative.problem },
          { id: 'approach', label: labels.approach, block: narrative.approach },
          { id: 'build', label: labels.build, block: narrative.build },
          { id: 'result', label: labels.result, block: narrative.result },
        ]}
      />

      <CaseGallery label={caseStudyContent.galleryLabel} items={project.gallery} />

      {project.metrics.length > 0 && (
        <CaseMetrics
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
