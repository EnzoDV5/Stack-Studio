import { useId, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Marquee } from '@/components/ui/Marquee'
import { cn } from '@/lib/cn'
import { marquee } from '@/lib/motion-tokens'
import type { Technology } from '@/types/technology'
import styles from './TechnologyMarquee.module.css'

export interface TechnologyMarqueeProps {
  heading: string
  pauseLabel: string
  resumeLabel: string
  rows: readonly (readonly Technology[])[]
  /** 'large': bigger logos and names, for a strip that stands on its own (Home). */
  size?: 'default' | 'large'
  tone?: Tone
}

export function TechnologyMarquee({
  heading,
  pauseLabel,
  resumeLabel,
  rows,
  size = 'default',
  tone = 'dark',
}: TechnologyMarqueeProps) {
  const headingId = useId()
  const rowsId = useId()
  const [paused, setPaused] = useState(false)

  return (
    <Section
      tone={tone}
      spacing="none"
      className={cn('border-y border-tone', size === 'large' ? 'py-12 md:py-14' : 'py-10')}
      aria-labelledby={headingId}
    >
      <div className="container-site mb-6 flex items-center justify-between gap-3">
        <h2 id={headingId} className="eyebrow text-muted">
          {heading}
        </h2>
        <button
          type="button"
          className="-my-3 -mr-3 flex size-11 shrink-0 items-center justify-center text-muted transition-colors hover:text-accent motion-reduce:hidden"
          aria-controls={rowsId}
          aria-label={paused ? resumeLabel : pauseLabel}
          title={paused ? resumeLabel : pauseLabel}
          onClick={() => setPaused((value) => !value)}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="currentColor">
            {paused ? <path d="M4 2.5 13 8l-9 5.5Z" /> : <path d="M3 2h3v12H3zm7 0h3v12h-3z" />}
          </svg>
        </button>
      </div>
      <div id={rowsId} className={cn(styles.rows, size === 'large' && styles.large)}>
        {rows
          .filter((row) => row.length > 0)
          .map((row, index) => (
            <Marquee
              key={index}
              reverse={index % 2 === 1}
              duration={Math.max(marquee.loopSeconds, row.length * marquee.technologyItemSeconds)}
              gap={size === 'large' ? 'clamp(2.5rem, 5vw, 5rem)' : 'clamp(2rem, 4vw, 4rem)'}
              paused={paused}
              pauseOnHover={false}
            >
              {row.map((technology) => (
                <span
                  key={technology.id}
                  className={cn(
                    'flex shrink-0 items-center font-medium whitespace-nowrap transition-colors hover:text-accent',
                    size === 'large' ? 'h-12 gap-4 text-heading-md' : 'h-8 gap-3 text-body',
                  )}
                  title={`${technology.name}: ${technology.description}`}
                >
                  {technology.logo && (
                    <span
                      aria-hidden="true"
                      className={styles.logo}
                      style={{ maskImage: `url("${technology.logo}")` }}
                    />
                  )}
                  <span>{technology.name}</span>
                  <span className="sr-only">{`: ${technology.description}`}</span>
                </span>
              ))}
            </Marquee>
          ))}
      </div>
    </Section>
  )
}
