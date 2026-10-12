import { useCallback, useId, useRef, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ImageSequence } from '@/components/media/ImageSequence'
import { Video } from '@/components/media/Video'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { TextLink } from '@/components/ui/TextLink'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { pad2 } from '@/lib/format'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import type { CtaLink, ImageAsset, ImageSequenceAsset, VideoAsset } from '@/types'
import styles from './ChapterFlow.module.css'

export interface ChapterFlowItem {
  title: string
  body: string
  detail: string
  link?: CtaLink
  media:
    | { kind: 'website'; screen: ImageAsset; solutions: ImageAsset; projects: ImageAsset }
    | { kind: 'software'; laptop: ImageSequenceAsset; phone: ImageSequenceAsset }
    | { kind: 'video'; video: VideoAsset }
}

export interface ChapterFlowProps {
  index?: number
  /** Optional small label above the title. */
  eyebrow?: string
  title: string
  items: ChapterFlowItem[]
  more: CtaLink[]
  tone: Tone
}

const chapterCode = ['const idea = await stack.build();', 'return launch && improve;']

interface ChapterState {
  displayed: number
  revision: number
  recoding: boolean
}

const deviceScroll = { start: 'top 90%', end: 'center 45%', scrub: 0.7, ease: 'sine.inOut' }

function WebsiteMockup({
  screen,
  solutions,
  projects,
  visible,
}: {
  screen: ImageAsset
  solutions: ImageAsset
  projects: ImageAsset
  visible: boolean
}) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLImageElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const scene = sceneRef.current
      const laptop = laptopRef.current
      const image = screenRef.current
      const viewport = viewportRef.current
      const solutionsPanel = solutionsRef.current
      const projectsPanel = projectsRef.current
      if (
        !visible ||
        reducedMotion ||
        !scene ||
        !laptop ||
        !image ||
        !viewport ||
        !solutionsPanel ||
        !projectsPanel
      )
        return

      // Three depths: the browser drifts least, the laptop a little more and the phone in
      // front most, while the real site scrolls on the laptop screen.
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scene,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
      timeline.fromTo(laptop, { yPercent: 5, scale: 0.97 }, { yPercent: -4, scale: 1 }, 0)
      timeline.fromTo(
        image,
        { y: 0 },
        {
          y: () =>
            -Math.max(
              0,
              Math.min(image.clientHeight - viewport.clientHeight, viewport.clientHeight * 1.5),
            ),
        },
        0,
      )
      timeline.fromTo(
        solutionsPanel,
        { xPercent: -3, yPercent: 6 },
        { xPercent: 2, yPercent: -6 },
        0,
      )
      timeline.fromTo(projectsPanel, { yPercent: 16 }, { yPercent: -10 }, 0)
      return () => timeline.kill()
    },
    { scope: sceneRef, dependencies: [visible, reducedMotion], revertOnUpdate: true },
  )

  return (
    <div ref={sceneRef} className={styles.websiteScene}>
      <div className={styles.composition}>
        <div ref={solutionsRef} className={styles.websiteBrowser}>
          <img
            src={solutions.src}
            srcSet={solutions.srcSet}
            sizes="(min-width: 1920px) 640px, (min-width: 1024px) 33vw, (min-width: 640px) 53vw, 105vw"
            width={solutions.width}
            height={solutions.height}
            alt={solutions.alt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className={styles.websiteLaptop}>
          <div ref={laptopRef} className={styles.laptopShot}>
            <div className={styles.laptopLid}>
              <div className={styles.laptopScreen}>
                <div className={styles.browserBar} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div ref={viewportRef} className={styles.browserViewport}>
                  <img
                    ref={screenRef}
                    src={screen.src}
                    srcSet={screen.srcSet}
                    sizes="(min-width: 1920px) 420px, (min-width: 1024px) 22vw, (min-width: 640px) 34vw, 68vw"
                    width={screen.width}
                    height={screen.height}
                    alt={screen.alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
              </div>
            </div>
            <div className={styles.laptopBase} aria-hidden="true" />
          </div>
        </div>
        <div ref={projectsRef} className={styles.websitePhone}>
          <img
            src={projects.src}
            srcSet={projects.srcSet}
            sizes="(min-width: 1920px) 345px, (min-width: 1024px) 18vw, (min-width: 640px) 28vw, 57vw"
            width={projects.width}
            height={projects.height}
            alt={projects.alt}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}

function SoftwareMockup({
  laptop,
  phone,
  visible,
}: {
  laptop: ImageSequenceAsset
  phone: ImageSequenceAsset
  visible: boolean
}) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // The devices open and turn with the scroll (ImageSequence); the phone in front also drifts
  // past the laptop for depth.
  useGSAP(
    () => {
      const scene = sceneRef.current
      const laptopShot = laptopRef.current
      const phoneShot = phoneRef.current
      if (!visible || reducedMotion || !scene || !laptopShot || !phoneShot) return
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: scene, start: 'top 90%', end: 'bottom 10%', scrub: 0.7 },
      })
      timeline.fromTo(laptopShot, { yPercent: 4 }, { yPercent: -4 }, 0)
      timeline.fromTo(phoneShot, { yPercent: 12 }, { yPercent: -8 }, 0)
      return () => timeline.kill()
    },
    { scope: sceneRef, dependencies: [visible, reducedMotion], revertOnUpdate: true },
  )

  return (
    <div ref={sceneRef} className={styles.softwareScene}>
      <div className={styles.composition}>
        <div className={styles.softwareHalo} aria-hidden="true" />
        <div ref={laptopRef} className={styles.softwareLaptop}>
          <ImageSequence
            sequence={laptop}
            scroll={deviceScroll}
            sizes="(min-width: 1920px) 640px, (min-width: 1024px) 33vw, (min-width: 640px) 53vw, 105vw"
            className={styles.softwareSequence}
          />
        </div>
        <div ref={phoneRef} className={styles.softwarePhone}>
          <ImageSequence
            sequence={phone}
            scroll={deviceScroll}
            sizes="(min-width: 1920px) 275px, (min-width: 1024px) 14vw, (min-width: 640px) 22vw, 45vw"
            className={styles.softwareSequence}
          />
        </div>
      </div>
    </div>
  )
}

function ChapterVisual({ item, visible }: { item: ChapterFlowItem; visible: boolean }) {
  return (
    <div className={styles.visual}>
      {item.media.kind === 'website' && (
        <WebsiteMockup
          screen={item.media.screen}
          solutions={item.media.solutions}
          projects={item.media.projects}
          visible={visible}
        />
      )}
      {item.media.kind === 'software' && (
        <SoftwareMockup laptop={item.media.laptop} phone={item.media.phone} visible={visible} />
      )}
      {item.media.kind === 'video' && (
        <Video
          video={{
            ...item.media.video,
            src: item.media.video.renditions?.[0]?.src ?? item.media.video.src,
          }}
          sizes="(min-width: 1920px) 570px, (min-width: 1024px) 30vw, (min-width: 640px) 47vw, 94vw"
          className={styles.video}
        />
      )}
    </div>
  )
}

function ChapterCopy({
  item,
  trigger,
  recode = false,
  onRecodeComplete,
}: {
  item: ChapterFlowItem
  trigger: 'intro' | 'scroll'
  recode?: boolean
  onRecodeComplete?: () => void
}) {
  return (
    <div className={styles.copy}>
      <MaskedHeading
        as="h3"
        text={item.title}
        codeLines={chapterCode}
        trigger={trigger}
        recode={recode}
        onRecodeComplete={onRecodeComplete}
        className={styles.chapterTitle}
      />
      <MaskedHeading
        as="p"
        text={item.body}
        codeLines={chapterCode}
        trigger={trigger}
        recode={recode}
        className={styles.chapterBody}
      />
      <MaskedHeading
        as="p"
        text={item.detail}
        codeLines={chapterCode}
        trigger={trigger}
        recode={recode}
        className={styles.chapterDetail}
      />
      {item.link && (
        <TextLink
          to={item.link.to}
          arrow
          aria-label={item.link.label}
          className={styles.chapterLink}
        >
          <MaskedHeading
            as="span"
            text={item.link.label}
            codeLines={chapterCode}
            trigger={trigger}
            recode={recode}
          />
        </TextLink>
      )}
    </div>
  )
}

/** Alternating media passes a fixed center chapter; mobile keeps every chapter in reading order. */
export function ChapterFlow({ index, eyebrow, title, items, more, tone }: ChapterFlowProps) {
  const headingId = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const [chapter, setChapter] = useState<ChapterState>({
    displayed: 0,
    revision: 0,
    recoding: false,
  })
  const desktop = useMediaQuery('(min-width: 1024px)')
  const reducedMotion = useReducedMotion()

  const finishRecode = useCallback(() => {
    setChapter((state) =>
      state.recoding
        ? { displayed: targetRef.current, revision: state.revision + 1, recoding: false }
        : state,
    )
  }, [])

  useGSAP(
    () => {
      const stage = stageRef.current
      if (!stage || !desktop || items.length === 0) return
      const rows = Array.from(stage.querySelectorAll<HTMLElement>('[data-chapter-row]'))
      const update = () => {
        const middle = window.innerHeight * 0.5
        const next = rows.findIndex((row) => row.getBoundingClientRect().bottom > middle)
        const index = next < 0 ? items.length - 1 : next
        targetRef.current = index
        setChapter((state) =>
          reducedMotion
            ? state.displayed === index && !state.recoding
              ? state
              : { displayed: index, revision: state.revision + 1, recoding: false }
            : state.displayed === index || state.recoding
              ? state
              : { ...state, recoding: true },
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
    { scope: stageRef, dependencies: [desktop, items.length, reducedMotion], revertOnUpdate: true },
  )

  if (items.length === 0) return null
  const current = items[chapter.displayed] ?? items[0]
  if (!current) return null

  return (
    <Section tone={tone} spacing="sm" aria-labelledby={headingId} className={styles.section}>
      <div className="container-site">
        <header className={styles.header}>
          {eyebrow && (
            <div className={styles.headerMeta}>
              {index !== undefined && <span>{pad2(index)} /</span>}
              <span>{eyebrow}</span>
            </div>
          )}
          <h2 id={headingId} className={styles.heading}>
            {title}
          </h2>
        </header>

        <div ref={stageRef} className={styles.stage}>
          <div className={styles.leftRail}>
            {items.map((item, chapter) => (
              <div key={item.title} data-chapter-row className={styles.slot}>
                {chapter % 2 === 1 && <ChapterVisual item={item} visible={desktop} />}
              </div>
            ))}
          </div>

          <div className={styles.centerRail}>
            <div className={styles.stickyCopy}>
              <ChapterCopy
                key={chapter.revision}
                item={current}
                trigger="intro"
                recode={chapter.recoding}
                onRecodeComplete={finishRecode}
              />
            </div>
          </div>

          <div className={styles.rightRail}>
            {items.map((item, chapter) => (
              <div key={item.title} className={styles.slot}>
                {chapter % 2 === 0 && <ChapterVisual item={item} visible={desktop} />}
              </div>
            ))}
          </div>

          <ol className={styles.mobileChapters}>
            {items.map((item) => (
              <li key={item.title} className={styles.mobileChapter}>
                <ChapterVisual item={item} visible={!desktop} />
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
