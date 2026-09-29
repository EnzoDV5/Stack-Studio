import { Section, type Tone } from '@/components/layout/Section'
import { Heading } from '@/components/ui/Heading'
import { pad2 } from '@/lib/format'
import type { NarrativeBlock } from '@/types'

export interface CaseNarrativeProps {
  /** Ordered chapters, e.g. Problem → Approach → Build → Result. */
  chapters: { id: string; label: string; block: NarrativeBlock }[]
  tone?: Tone
}

/** Editorial chapters: the number and label above each statement, then the body. Static text. */
export function CaseNarrative({ chapters, tone = 'paper' }: CaseNarrativeProps) {
  return (
    <Section tone={tone}>
      <div className="container-site space-y-24 md:space-y-36">
        {chapters.map((chapter, i) => (
          <article
            key={chapter.id}
            aria-labelledby={`chapter-${chapter.id}`}
            className="grid gap-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-8 lg:col-start-5">
              <p className="mb-5 flex gap-3 eyebrow text-muted">
                <span className="text-accent">{pad2(i + 1)}</span>
                <span aria-hidden="true">·</span>
                {chapter.label}
              </p>
              <Heading
                id={`chapter-${chapter.id}`}
                size="display-lg"
                className="max-w-[20ch]"
                compile
              >
                {chapter.block.heading}
              </Heading>
              <div className="mt-8 max-w-[60ch] space-y-5 text-body-lg text-muted">
                {chapter.block.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
