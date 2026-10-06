import { useId, useRef, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { ServiceMedia } from '@/components/media/ServiceMedia'
import { Accordion } from '@/components/ui/Accordion'
import { TextLink } from '@/components/ui/TextLink'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, packageShowcase } from '@/lib/motion-tokens'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink, ImageAsset } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

/** What the device shows for a package: a site we built, a video, or the phone. */
export type PackageScreen =
  | { kind: 'site'; image: ImageAsset }
  | { kind: 'video'; item: ServiceMediaItem }
  | { kind: 'phone' }

export interface ShowcasePackage {
  id: string
  name: string
  /** Who it's for, in one line. */
  for: string
  /** Calculated from the same starting quote as the Pricing page. */
  range: string
  monthly?: string
  includes: string[]
  screen: PackageScreen
  /** One line under the device on what it shows. */
  caption: string
  /** The case study behind the example, when it's a client's site. */
  link?: CtaLink
}

export interface PackageShowcaseProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  packages: ShowcasePackage[]
  /** The phone, facing the viewer, for packages that show it. */
  phone: ImageAsset
  labels: { price: string; includes: string; example: string }
  /** "Go deeper" link under the showcase. */
  more: CtaLink
  tone?: Tone
}

/**
 * The website packages, each shown on a laptop as something we've built that fits it: a new
 * business site, a content-rich site, a store (real client sites, scrolling inside the screen),
 * a brand build (a studio clip on the screen), or bookings on a phone that steps in front of the
 * laptop. Opening a package reveals what it includes and swaps the example on the device.
 * Each row shows the indicative range calculated from its starting quote.
 * Signature motion (enter, once): the laptop's lid opens as it comes on screen. Then the chosen
 * site scrolls slowly inside the screen while it's on screen (ambient).
 * Reduced motion: the laptop open, each site at its top, no video.
 */
export function PackageShowcase({
  index,
  eyebrow,
  title,
  intro,
  packages,
  phone,
  labels,
  more,
  tone = 'paper',
}: PackageShowcaseProps) {
  const headingId = useId()
  const [active, setActive] = useState(0)
  // Screens mount once they've been chosen, so only the sites someone looks at are loaded.
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([0]))
  const stageRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const onScreen = useInView(stageRef, { threshold: 0.25 })
  const current = packages[active]
  const showPhone = current?.screen.kind === 'phone'

  const choose = (i: number) => {
    setActive(i)
    setVisited((seen) => (seen.has(i) ? seen : new Set(seen).add(i)))
  }

  // The lid opens once as the laptop comes on screen (an enter, not a scrub: the work reel after
  // this section is scrubbed and pinned).
  useGSAP(
    () => {
      const lid = lidRef.current
      if (!lid || reducedMotion) return
      gsap.fromTo(
        lid,
        { rotateX: packageShowcase.lidFrom },
        {
          rotateX: 0,
          duration: duration.slow,
          ease: ease.out,
          scrollTrigger: { trigger: stageRef.current, start: packageShowcase.start, once: true },
          onStart: () => {
            gsap.set(lid, { willChange: 'transform' })
          },
          onComplete: () => {
            gsap.set(lid, { willChange: 'auto' })
          },
        },
      )
    },
    { scope: stageRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  // The chosen site scrolls inside the screen, there and back, while it's on screen. A new
  // choice (or scrolling away) reverts it to the top.
  useGSAP(
    () => {
      const stage = stageRef.current
      if (!stage || reducedMotion || !onScreen || current?.screen.kind !== 'site') return
      const page = stage.querySelector<HTMLElement>(`[data-page="${active}"]`)
      const frame = page?.parentElement
      if (!page || !frame) return
      const distance = page.offsetHeight - frame.clientHeight
      if (distance <= 0) return
      const seconds = (distance / frame.clientHeight) * packageShowcase.secondsPerScreen
      gsap.set(page, { willChange: 'transform' })
      gsap.to(page, {
        y: -distance,
        duration: seconds,
        ease: 'sine.inOut',
        delay: packageShowcase.hold,
        repeat: -1,
        yoyo: true,
        repeatDelay: packageShowcase.hold,
      })
    },
    {
      scope: stageRef,
      dependencies: [active, onScreen, reducedMotion, current?.screen.kind],
      revertOnUpdate: true,
    },
  )

  return (
    <Section tone={tone} aria-labelledby={headingId} className="overflow-hidden">
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="minimal"
          size="display-lg"
          index={index}
          eyebrow={eyebrow}
          title={title}
          aside={<p className="max-w-[40ch] text-body-lg text-muted">{intro}</p>}
        />

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-16">
          {/* Package details open in the same disclosure rows used by the Services page. */}
          <div className="min-w-0 lg:col-span-5 lg:row-start-1">
            <Accordion
              headingLevel="h3"
              titleClassName="text-heading-md"
              defaultOpen={packages[0] ? [packages[0].id] : []}
              items={packages.map((pkg, i) => ({
                id: pkg.id,
                title: (
                  <span className="block">
                    <span className="block">{pkg.name}</span>
                    <span className="mt-1 block numeric text-small font-normal text-accent">
                      {labels.price}: {pkg.range}
                    </span>
                  </span>
                ),
                onOpen: () => choose(i),
                content: (
                  <div>
                    <p className="max-w-[40ch]">{pkg.for}</p>
                    {pkg.monthly && <p className="mt-3 text-small text-muted">{pkg.monthly}</p>}
                    <p className="mt-6 mb-3 eyebrow text-muted">{labels.includes}</p>
                    <ul className="space-y-2 text-small">
                      {pkg.includes.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {pkg.link && (
                      <TextLink to={pkg.link.to} arrow className="mt-6 inline-flex">
                        {pkg.link.label}
                      </TextLink>
                    )}
                  </div>
                ),
              }))}
            />
          </div>

          {/* The device: the laptop, and the phone that steps in front of it for bookings. */}
          <div
            ref={stageRef}
            className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-center"
          >
            <div className="relative mx-auto max-w-176 pb-4 sm:px-6">
              <div
                className={cn(
                  'transition-[opacity,scale] duration-(--duration-fast) ease-(--ease-out-expo) motion-reduce:transition-none',
                  showPhone && 'scale-[0.88] opacity-40',
                )}
                aria-hidden={showPhone}
                style={{ perspective: '110em', perspectiveOrigin: '50% 100%' }}
              >
                {/* Lid: bezel and screen, hinged at its bottom edge. */}
                <div
                  ref={lidRef}
                  className="relative aspect-16/10 rounded-t-[1.1rem] rounded-b-md bg-ink p-[1.6%] shadow-[0_0_0_1px_var(--color-ink-600),0_40px_80px_-40px_rgb(0_0_0/0.55)]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.6%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-ink-600"
                  />
                  <div className="relative size-full overflow-hidden rounded-[0.45rem] bg-ink-700">
                    {packages.map((pkg, i) => {
                      if (!visited.has(i) || pkg.screen.kind === 'phone') return null
                      return (
                        <div
                          key={pkg.id}
                          className={cn(
                            'absolute inset-0 overflow-hidden transition-opacity duration-(--duration-fast) ease-(--ease-out-expo) motion-reduce:transition-none',
                            i === active ? 'opacity-100' : 'opacity-0',
                          )}
                          aria-hidden={i !== active}
                        >
                          {pkg.screen.kind === 'site' ? (
                            <div data-page={i}>
                              <Image
                                image={pkg.screen.image}
                                fit="intrinsic"
                                sizes="(min-width: 1024px) 44rem, 94vw"
                              />
                            </div>
                          ) : (
                            <ServiceMedia
                              item={pkg.screen.item}
                              active={i === active}
                              paused={false}
                              sizes="(min-width: 1024px) 44rem, 94vw"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* The base: the laptop's front edge, a little wider than the lid. */}
                <div
                  aria-hidden="true"
                  className="relative -mx-[5%] h-3 rounded-t-xs rounded-b-[1rem] bg-linear-to-b from-grey-700 to-ink-600 sm:h-4"
                >
                  <span className="absolute top-0 left-1/2 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-ink-700" />
                </div>
              </div>

              {/* The phone steps in front for bookings. */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-y-0 left-1/2 flex w-[50%] -translate-x-1/2 items-center transition-[opacity,translate,scale] duration-(--duration-fast) ease-(--ease-out-expo) motion-reduce:transition-none',
                  showPhone
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'translate-y-8 scale-95 opacity-0',
                )}
                aria-hidden={!showPhone}
              >
                <Image image={phone} fit="intrinsic" sizes="(min-width: 1024px) 18rem, 40vw" />
              </div>
            </div>

            {current && (
              <p className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center text-small text-muted">
                <span className="eyebrow text-accent">{labels.example}</span>
                <span>{current.caption}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-14">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
