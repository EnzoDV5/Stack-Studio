import { useRef, type ReactNode } from 'react'
import { Image } from '@/components/media/Image'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, macbook } from '@/lib/motion-tokens'
import type { ImageAsset } from '@/types'

export interface MacbookScrollProps {
  /**
   * What's on the screen: a full-page desktop capture of the site. Once the screen faces
   * the viewer it scrolls from top to bottom, so taller pages scroll for longer.
   */
  image: ImageAsset
  /** Heading above the laptop; it fades as the screen comes forward. */
  title?: ReactNode
  /** The screen image is the page's LCP. */
  priority?: boolean
  className?: string
}

/** The screen's inner frame, width ÷ height (32em × 20em less the 0.5em bezel). */
const FRAME_RATIO = 31 / 19

/** Decorative keyboard: rows of [label, width in key units]. */
const ROWS: [string, number][][] = [
  [
    ['esc', 1.6],
    ...Array.from({ length: 12 }, (_, i): [string, number] => [`F${i + 1}`, 1]),
    ['', 1],
  ],
  [...'`1234567890-='.split('').map((k): [string, number] => [k, 1]), ['delete', 1.6]],
  [['tab', 1.6], ...'QWERTYUIOP[]\\'.split('').map((k): [string, number] => [k, 1])],
  [['caps', 1.9], ..."ASDFGHJKL;'".split('').map((k): [string, number] => [k, 1]), ['return', 1.9]],
  [['shift', 2.4], ...'ZXCVBNM,./'.split('').map((k): [string, number] => [k, 1]), ['shift', 2.4]],
  [
    ['fn', 1],
    ['ctrl', 1],
    ['opt', 1],
    ['cmd', 1.3],
    ['', 5.4],
    ['cmd', 1.3],
    ['opt', 1],
    ['◀', 1],
    ['▼', 1],
    ['▶', 1],
  ],
]

/**
 * A laptop showing a site. The lid and the keyboard deck are two planes of the same width,
 * each rotating about the same hinge line under one shared perspective. A plane's hinge edge
 * doesn't move when it rotates, so the two stay joined at every angle (and there's no
 * preserve-3d scene for the browser to depth-sort). It starts open, seen from above.
 * Signature motion (pinned, scrubbed): the deck folds out of view and the lid comes upright
 * to face the viewer while the laptop grows until the screen fills the view and the title
 * fades; then the site scrolls inside the screen from top to bottom. Only
 * transform and opacity animate. Sized in em (large on desktop, capped to the viewport on
 * phones). With reduced motion it's a still, open laptop showing the top of the site.
 */
export function MacbookScroll({ image, title, priority = false, className }: MacbookScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const root = rootRef.current
      const device = deviceRef.current
      const lid = lidRef.current
      const deck = deckRef.current
      const frame = frameRef.current
      const page = pageRef.current
      if (reducedMotion || !root || !device || !lid || !deck || !frame || !page) return

      // Scroll (in viewports) for the site to run top to bottom inside the screen. It depends
      // only on the capture's proportions, so it holds at every viewport size.
      const screensTall = (image.height / image.width) * FRAME_RATIO
      const siteScroll = Math.max(0, screensTall - 1) * macbook.perScreen

      // The screen grows as far as the viewport allows, centred vertically. The device's
      // transform origin is the hinge (bottom centre of the lid).
      const scaleTo = () =>
        Math.min(
          macbook.scaleTo,
          (window.innerWidth * 0.94) / device.offsetWidth,
          (root.clientHeight * 0.84) / device.offsetHeight,
        )
      const deviceTop = () => {
        let y = 0
        let node: HTMLElement | null = device
        while (node && node !== root) {
          y += node.offsetTop
          node = node.offsetParent as HTMLElement | null
        }
        return y
      }
      const travel = () =>
        root.clientHeight / 2 -
        (deviceTop() + device.offsetHeight) +
        (device.offsetHeight * scaleTo()) / 2

      const open = macbook.open
      gsap
        .timeline({
          defaults: { ease: ease.none },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => {
              const portrait = window.innerHeight > window.innerWidth
              const length = (open + siteScroll) * (portrait ? macbook.portraitScroll : 1)
              return `+=${length * window.innerHeight}`
            },
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: ({ isActive }) =>
              gsap.set([device, lid, deck, page], {
                willChange: isActive ? 'transform' : 'auto',
              }),
          },
        })
        // Fold the deck out of view and bring the lid upright to face the viewer…
        .fromTo(
          deck,
          { rotateX: macbook.deckFrom },
          { rotateX: 90, duration: open * 0.65, ease: ease.inOut },
          0,
        )
        .fromTo(
          lid,
          { rotateX: macbook.leanFrom },
          { rotateX: 0, duration: open * 0.65, ease: ease.inOut },
          0,
        )
        // …while it grows toward the viewer until the screen fills the view.
        .fromTo(
          device,
          { scale: 1, y: 0 },
          { scale: scaleTo, y: travel, duration: open * 0.75, ease: ease.inOut },
          open * 0.25,
        )
        .to(titleRef.current, { opacity: 0, y: 60, duration: open * 0.4 }, 0)
        // Then the site scrolls inside the screen, top to bottom.
        .fromTo(
          page,
          { y: 0 },
          { y: () => -Math.max(0, page.offsetHeight - frame.clientHeight), duration: siteScroll },
          open,
        )
    },
    { scope: rootRef, dependencies: [reducedMotion, image], revertOnUpdate: true },
  )

  return (
    <div
      ref={rootRef}
      className={cn(
        'flex flex-col items-center overflow-hidden',
        // Still, the deck sits below the lid's layout box: leave it room.
        reducedMotion ? 'justify-center pb-[14em]' : 'h-svh justify-start',
        className,
      )}
      // Everything inside is sized in em: the lid is 32em wide (about 800px on desktop),
      // capped to the viewport width on phones.
      style={{ fontSize: 'min(1.55rem, 2.85vw)' }}
    >
      {title && (
        <div ref={titleRef} className="mb-[1.5em] px-(--spacing-gutter) text-center">
          {title}
        </div>
      )}

      {/* The device's box is the lid. Its perspective origin is the hinge (bottom centre), so
          both planes rotate about it without their hinge edges moving. */}
      <div className="flex w-full justify-center">
        <div
          ref={deviceRef}
          className="relative h-[20em] w-[32em]"
          style={{
            transformOrigin: '50% 100%',
            perspective: '90em',
            perspectiveOrigin: '50% 100%',
          }}
        >
          {/* Keyboard deck: hinged to the lid's bottom edge, folded out toward the viewer. */}
          <div
            ref={deckRef}
            aria-hidden="true"
            className="absolute top-full left-0 h-[21em] w-[32em] overflow-hidden rounded-b-[1.2em] bg-ink-600"
            style={{ transformOrigin: '50% 0%', transform: `rotateX(${macbook.deckFrom}deg)` }}
          >
            <div className="flex pt-[1.4em]">
              <div className="w-[9%] bg-[radial-gradient(circle,var(--color-ink)_0.5px,transparent_0.5px)] bg-size-[3px_3px]" />
              <div className="mx-auto w-[82%] space-y-[0.14em] rounded-[0.35em] bg-ink p-[0.3em]">
                {ROWS.map((row, r) => (
                  <div key={r} className="flex gap-[0.14em]">
                    {row.map(([label, units], k) => (
                      <div
                        key={k}
                        className={cn(
                          'flex items-center justify-center rounded-[0.25em] bg-ink-800 text-grey-400 shadow-[0_0_1px_0_var(--color-grey-700)]',
                          r === 0 ? 'h-[1em]' : 'h-[1.55em]',
                        )}
                        style={{ flex: `${units} 1 0` }}
                      >
                        <span style={{ fontSize: '0.32em' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="w-[9%] bg-[radial-gradient(circle,var(--color-ink)_0.5px,transparent_0.5px)] bg-size-[3px_3px]" />
            </div>
            <div className="mx-auto mt-[0.8em] h-[7.5em] w-[40%] rounded-[0.75em] bg-ink-700/60 shadow-[inset_0_0_1px_1px_var(--color-ink)]" />
          </div>

          {/* Lid: the bezel and the screen, hinged at its bottom edge. */}
          <div
            ref={lidRef}
            className="absolute inset-0 rounded-t-[1.2em] rounded-b-[0.4em] bg-ink p-[0.5em] shadow-[0_0_0_1px_var(--color-ink-600)]"
            style={{
              transformOrigin: '50% 100%',
              transform: `rotateX(${macbook.leanFrom}deg)`,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute top-[0.18em] left-[calc(50%-0.09em)] size-[0.18em] rounded-full bg-ink-600"
            />
            <div
              ref={frameRef}
              className="relative size-full overflow-hidden rounded-[0.5em] bg-ink-700"
            >
              <div ref={pageRef}>
                <Image
                  image={image}
                  fit="intrinsic"
                  priority={priority}
                  sizes="(min-width: 1024px) 80vw, 94vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
