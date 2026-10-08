import { useEffect, useId, useRef, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Video } from '@/components/media/Video'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { TextLink } from '@/components/ui/TextLink'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { pad2 } from '@/lib/format'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'
import type { CtaLink, VideoAsset } from '@/types'
import styles from './ChapterFlow.module.css'

export interface ChapterFlowItem {
  title: string
  body: string
  detail: string
  link?: CtaLink
  media: VideoAsset
}

export interface ChapterFlowProps {
  index?: number
  eyebrow: string
  title: string
  items: ChapterFlowItem[]
  more: CtaLink[]
  tone: Tone
}

const chapterCode = ['const idea = await stack.build();', 'return launch && improve;']
const chapterTransitionMs = 720

interface ChapterState {
  current: number
  currentKey: number
  previous: number | null
  previousKey: number | null
}

function ChapterVisual({ item }: { item: ChapterFlowItem }) {
  return (
    <div className={styles.visual}>
      <Video
        video={{
          ...item.media,
          src: item.media.renditions?.[0]?.src ?? item.media.src,
        }}
        sizes="(min-width: 1024px) 34vw, 100vw"
        className={styles.video}
      />
    </div>
  )
}

function ChapterCopy({ item, trigger }: { item: ChapterFlowItem; trigger: 'intro' | 'scroll' }) {
  return (
    <div className={styles.copy}>
      <MaskedHeading
        as="h3"
        text={item.title}
        codeLines={chapterCode}
        trigger={trigger}
        className={styles.chapterTitle}
      />
      <MaskedHeading
        as="p"
        text={item.body}
        codeLines={chapterCode}
        trigger={trigger}
        className={styles.chapterBody}
      />
      <p className={styles.chapterDetail}>{item.detail}</p>
      {item.link && (
        <TextLink to={item.link.to} arrow className={styles.chapterLink}>
          {item.link.label}
        </TextLink>
      )}
    </div>
  )
}

/** Alternating media passes a fixed center chapter; mobile keeps every chapter in reading order. */
export function ChapterFlow({ index, eyebrow, title, items, more, tone }: ChapterFlowProps) {
  const headingId = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState<ChapterState>({
    current: 0,
    currentKey: 0,
    previous: null,
    previousKey: null,
  })
  const desktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    if (chapter.previousKey === null) return
    const currentKey = chapter.currentKey
    const timeout = window.setTimeout(() => {
      setChapter((state) =>
        state.currentKey === currentKey ? { ...state, previous: null, previousKey: null } : state,
      )
    }, chapterTransitionMs)
    return () => window.clearTimeout(timeout)
  }, [chapter.currentKey, chapter.previousKey])

  useGSAP(
    () => {
      const stage = stageRef.current
      if (!stage || !desktop || items.length === 0) return
      const rows = Array.from(stage.querySelectorAll<HTMLElement>('[data-chapter-row]'))
      const update = () => {
        const middle = window.innerHeight * 0.5
        const next = rows.findIndex((row) => row.getBoundingClientRect().bottom > middle)
        const index = next < 0 ? items.length - 1 : next
        setChapter((state) =>
          state.current === index
            ? state
            : {
                current: index,
                currentKey: state.currentKey + 1,
                previous: state.current,
                previousKey: state.currentKey,
              },
        )
      }
      const scroll = ScrollTrigger.create({
        trigger: stage,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: update,
        onEnter: update,
        onEnterBack: update,
        onRefresh: update,
      })
      update()
      return () => scroll.kill()
    },
    { scope: stageRef, dependencies: [desktop, items.length], revertOnUpdate: true },
  )

  if (items.length === 0) return null
  const current = items[chapter.current] ?? items[0]
  const previous = chapter.previous === null ? null : items[chapter.previous]
  if (!current) return null

  return (
    <Section tone={tone} spacing="sm" aria-labelledby={headingId} className={styles.section}>
      <div className="container-site">
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            {index !== undefined && <span>{pad2(index)} /</span>}
            <span>{eyebrow}</span>
          </div>
          <h2 id={headingId} className={styles.heading}>
            {title}
          </h2>
        </header>

        <div ref={stageRef} className={styles.stage}>
          <div className={styles.leftRail}>
            {items.map((item, chapter) => (
              <div key={item.title} data-chapter-row className={styles.slot}>
                {chapter % 2 === 1 && <ChapterVisual item={item} />}
              </div>
            ))}
          </div>

          <div className={styles.centerRail}>
            <div className={styles.stickyCopy}>
              <div className={styles.copyStack}>
                <div
                  key={chapter.currentKey}
                  className={`${styles.copyPane} ${chapter.currentKey > 0 ? styles.copyEntering : ''}`}
                >
                  <ChapterCopy item={current} trigger="intro" />
                </div>
                {previous && chapter.previousKey !== null && (
                  <div
                    key={chapter.previousKey}
                    className={`${styles.copyPane} ${styles.copyLeaving}`}
                    aria-hidden="true"
                    inert
                  >
                    <ChapterCopy item={previous} trigger="intro" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rightRail}>
            {items.map((item, chapter) => (
              <div key={item.title} className={styles.slot}>
                {chapter % 2 === 0 && <ChapterVisual item={item} />}
              </div>
            ))}
          </div>

          <ol className={styles.mobileChapters}>
            {items.map((item) => (
              <li key={item.title} className={styles.mobileChapter}>
                <ChapterVisual item={item} />
                <ChapterCopy item={item} trigger="scroll" />
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.footer}>
          {more.map((link) => (
            <TextLink key={link.to} to={link.to} arrow>
              {link.label}
            </TextLink>
          ))}
        </div>
      </div>
    </Section>
  )
}
