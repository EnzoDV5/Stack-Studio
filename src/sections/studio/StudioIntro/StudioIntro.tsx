import { Section, type Tone } from '@/components/layout/Section'
import { CodeEditor } from '@/components/media/CodeEditor'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { CodeEditorContent } from '@/types'

export interface StudioIntroProps {
  eyebrow: string
  title: string
  paragraphs: string[]
  editor: CodeEditorContent
  tone?: Tone
}

/**
 * Who we are: statement and story beside a code editor where the founders write one build
 * together, typing itself out once it's well on screen.
 */
export function StudioIntro({
  eyebrow,
  title,
  paragraphs,
  editor,
  tone = 'dark',
}: StudioIntroProps) {
  return (
    <Section tone={tone} className="pt-8">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
        <div className="lg:col-span-5">
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
        <CodeEditor content={editor} className="w-full lg:col-span-7" />
      </div>
    </Section>
  )
}
