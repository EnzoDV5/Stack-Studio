/**
 * EVERY media path in the site lives here. Everything is served locally from /public/media
 * (keep width/height accurate when swapping a file):
 *   - Projects: device mockups rendered from the live client sites (scripts/mockups).
 *   - Services: stage videos and posters (scripts/services-media).
 *   - Studio: licensed stock photos; founders: real portraits (scripts/founders), or an
 *     avatar placeholder until one exists.
 *   - Videos not yet made (showreel, project previews) fall back to their poster or an
 *     animated brand-gradient placeholder.
 */
import type { ImageAsset, ImageSequenceAsset, VideoAsset } from '@/types'
import type { StageId } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

/**
 * Full-page desktop capture of a live client site in /public/media/projects, scrolled on the
 * laptop in the case study: the page at 1440 CSS px wide, saved at 1.5× (2160 px) and 0.75×
 * (1080 px). `cssHeight` is the page height the capture script prints. How to recapture:
 * public/media/README.md (npm run mockups:capture -- --full).
 */
function siteCapture(id: string, cssHeight: number, alt: string): ImageAsset {
  return {
    src: `/media/projects/${id}-screen.webp`,
    srcSet: `/media/projects/${id}-screen-small.webp 1080w, /media/projects/${id}-screen.webp 2160w`,
    width: 2160,
    height: Math.round(cssHeight * 1.5),
    alt,
  }
}

/**
 * Device mockup of a live client site in /public/media/projects/mockups, rendered from real
 * captures by scripts/mockups (see public/media/README.md) at each width below, largest
 * first. Keep in sync with `shapes` in scripts/mockups/scenes.mjs.
 */
const mockupShapes = {
  /** Work cards and the next-project card (4:3). */
  card: { aspect: 3 / 4, widths: [2400, 1600, 800] },
  /** Home hero backdrop and work reel, full-bleed on retina screens (16:9). */
  showcase: { aspect: 9 / 16, widths: [3840, 2560, 1280] },
  /** Full-width gallery images (16:9). */
  wide: { aspect: 9 / 16, widths: [3840, 2560, 1280] },
  /** Half-width gallery images (4:5). */
  tall: { aspect: 5 / 4, widths: [2000, 1200, 600] },
} as const
type MockupShape = keyof typeof mockupShapes

function mockup(project: string, name: string, shape: MockupShape, alt: string): ImageAsset {
  const { aspect, widths } = mockupShapes[shape]
  const url = (w: number) => `/media/projects/mockups/${project}-${name}-${w}.webp`
  const [largest, middle] = widths
  return {
    src: url(middle),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest * aspect),
    alt,
  }
}

/**
 * A client's logo for dark backgrounds (transparent WebP in /public/logos/clients). Logos drawn
 * for light backgrounds use their generated -on-dark file (scripts/mockups/logos.mjs).
 */
function clientLogo(file: string, width: number, height: number, alt: string): ImageAsset {
  return { src: `/logos/clients/${file}.webp`, width, height, alt }
}

/**
 * A neutral avatar (head-and-shoulders silhouette with initials) standing in for a founder's
 * portrait: /public/media/founders/{id}-placeholder.svg, 4:5 like the real photos will be.
 */
function founderPlaceholder(id: string, name: string): ImageAsset {
  return {
    src: `/media/founders/${id}-placeholder.svg`,
    width: 900,
    height: 1125,
    alt: `Placeholder portrait for ${name}`,
  }
}

/**
 * A founder's portrait: /public/media/founders/{id}-{w}.webp at each width (largest first),
 * cropped to 4:5 like the portrait frames.
 */
function founderPhoto(id: string, widths: number[], alt: string): ImageAsset {
  const url = (w: number) => `/media/founders/${id}-${w}.webp`
  const largest = widths[0] ?? 1200
  return {
    src: url(widths[1] ?? largest),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round((largest * 5) / 4),
    alt,
  }
}

/** A photo in /public/media/studio at each width (largest first); `aspect` is height ÷ width. */
function studioPhoto(id: string, widths: number[], aspect: number, alt: string): ImageAsset {
  const url = (w: number) => `/media/studio/${id}-${w}.webp`
  const largest = widths[0] ?? 1600
  return {
    src: url(widths[1] ?? largest),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest * aspect),
    alt,
  }
}

function video(
  file: string,
  label: string,
  poster?: ImageAsset,
  width = 1920,
  height = 1080,
): VideoAsset {
  return { src: `/media/${file}`, type: 'video/mp4', label, poster, width, height }
}

/**
 * The Services device sequences, rendered by scripts/devices. Keep frames, widths and aspect in
 * step with each device's `motion` in scripts/devices/shots.mjs (tests/devices.test.ts checks
 * every frame exists).
 */
export const deviceMotion = {
  phone: { frames: 80, widths: [800, 480], aspect: 3 / 4 },
  laptop: { frames: 72, widths: [1800, 1200, 800], aspect: 4 / 3 },
} as const

/**
 * A device sequence: transparent WebP frames of a 3D model with a screen on it, in
 * /public/media/{device}/{id}/frame-{nn}-{width}.webp.
 */
function deviceFrames(
  device: keyof typeof deviceMotion,
  id: string,
  alt: string,
): ImageSequenceAsset {
  const { frames, widths, aspect } = deviceMotion[device]
  const largest = widths[0]
  return {
    width: largest,
    height: Math.round(largest / aspect),
    renditions: widths.map((width) => ({
      width,
      frames: Array.from(
        { length: frames },
        (_, frame) =>
          `/media/${device}/${id}/frame-${String(frame).padStart(2, '0')}-${width}.webp`,
      ),
    })),
    alt,
  }
}

/**
 * One frame of a device sequence as a still image (e.g. the phone's last frame, facing the
 * viewer), at the sequence's widths.
 */
function deviceStill(
  device: keyof typeof deviceMotion,
  id: string,
  frame: number,
  alt: string,
): ImageAsset {
  const { widths, aspect } = deviceMotion[device]
  const url = (w: number) =>
    `/media/${device}/${id}/frame-${String(frame).padStart(2, '0')}-${w}.webp`
  const [largest] = widths
  return {
    src: url(largest),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest / aspect),
    alt,
  }
}

/**
 * A service stage's looping clip: 1920×1080 with a 1280×720 rendition (the player picks the
 * one that is sharp at the slot's size) and its first frame as a WebP poster at three widths.
 * Encoded by scripts/services-media (sources and licences: public/media/services/README.md).
 */
function serviceClip(id: string, alt: string): ServiceMediaItem {
  const poster = (suffix: string) => `/media/services/${id}-poster${suffix}.webp`
  const image: ImageAsset = {
    src: poster('-960'),
    srcSet: `${poster('-480')} 480w, ${poster('-960')} 960w, ${poster('')} 1920w`,
    width: 1920,
    height: 1080,
    alt,
  }
  return {
    id,
    image,
    video: {
      src: `/media/services/${id}.mp4`,
      type: 'video/mp4',
      width: 1920,
      height: 1080,
      renditions: [{ src: `/media/services/${id}-720.mp4`, width: 1280 }],
      label: alt,
      poster: image,
    },
  }
}

/**
 * One looping clip per service stage, chosen to show what that stage is about: the first
 * a development team at work (Build), reviewing an existing project (Take over), live
 * infrastructure (Run), interface redesign work (Improve) and team planning (Partner).
 */
export const serviceMedia: Record<StageId, ServiceMediaItem> = {
  build: serviceClip('build', 'A software team building together at a development workstation'), // COPY: alt
  takeover: serviceClip(
    'takeover',
    'People reviewing an existing project and its reports together around a laptop',
  ), // COPY: alt
  run: serviceClip('run', 'Network cables and status lights on live server equipment'), // COPY: alt
  grow: serviceClip('grow', 'A designer editing an existing visual layout on a laptop'), // COPY: alt
  partner: serviceClip('partner', 'A team planning a project together around one table'), // COPY: alt
}

export const media = {
  brand: {
    // Generated placeholder (scripts/generate-placeholders.mjs). Replace with a designed 1200×630 PNG/JPG.
    ogImage: {
      src: '/og-image.png',
      alt: 'Stack Studio — brand-led websites, built to convert', // COPY:
      width: 1200,
      height: 630,
    },
  },

  home: {
    // No poster on purpose: until /media/showreel.mp4 exists, the brand-gradient placeholder shows.
    // When you add the real showreel, also add a poster (first frame, 1920×1080) for LCP.
    showreel: video(
      'showreel.mp4',
      'Stack Studio showreel: a montage of websites we have designed and built', // COPY:
    ),
  },

  // The Services device sections, with illustrative apps (not clients'), designed in
  // scripts/devices/screens: a bookings app on the phone, a stock and orders tool on the laptop.
  apps: {
    /** The phone's last frame, facing the viewer (Home packages: the bookings package). */
    phoneStill: deviceStill(
      'phone',
      'app',
      deviceMotion.phone.frames - 1,
      'An orange iPhone showing a bookings app with today’s appointments and weekly takings',
    ), // COPY: alt
    phone: deviceFrames(
      'phone',
      'app',
      'An orange iPhone showing a bookings app with today’s appointments and weekly takings',
    ), // COPY: alt
  },
  desktop: {
    laptop: deviceFrames(
      'laptop',
      'desktop',
      'A MacBook showing a stock and orders app with today’s orders and a weekly chart',
    ), // COPY: alt
  },

  projects: {
    // Cards, showcases and galleries are device mockups rendered from real captures of the
    // live sites (scripts/mockups, 29 Sep 2026). Each project has its own composition for its
    // Work card (`card`) and its Home showcase (`showcase`, also the case study hero), so no
    // two projects or pages repeat a mockup. Missing preview/hero videos show the matching
    // mockup as their poster.
    gcSolar: {
      // Full-page capture of gcsolar-redesign-demo.netlify.app (29 Sep 2026, 1.5×), scrolled on the case study laptop.
      screen: siteCapture(
        'gc-solar',
        5991,
        'The GC Solar website, from the homepage down to the footer', // COPY: alt
      ),
      card: mockup(
        'gc-solar',
        'card',
        'card',
        'The GC Solar homepage on a laptop and a phone', // COPY: alt
      ),
      showcase: mockup(
        'gc-solar',
        'showcase',
        'showcase',
        'Three GC Solar pages floating side by side: solutions, the homepage and projects', // COPY: alt
      ),
      preview: video(
        'gc-solar-preview.mp4',
        'Scrolling through the GC Solar website', // COPY:
        mockup('gc-solar', 'card', 'card', ''),
        1600,
        1200,
      ),
      heroVideo: video(
        'gc-solar-hero.mp4',
        'GC Solar website walkthrough', // COPY:
        mockup('gc-solar', 'showcase', 'showcase', ''),
        2400,
        1350,
      ),
      logo: clientLogo('gc-solar', 570, 113, 'GC Solar logo'),
      gallery: [
        mockup('gc-solar', 'solutions', 'wide', 'The GC Solar solutions page in a browser'), // COPY: alt
        mockup('gc-solar', 'quote-mobile', 'tall', 'The GC Solar quote request on a phone'), // COPY: alt
        mockup('gc-solar', 'projects-mobile', 'tall', 'GC Solar’s completed projects on a phone'), // COPY: alt
        mockup(
          'gc-solar',
          'company',
          'wide',
          'The GC Solar company page behind its quote request page, in two browser windows',
        ), // COPY: alt
      ],
    },
    mpgFoundation: {
      // Full-page capture of mpgf.org.za (29 Sep 2026, 1.5×), scrolled on the case study laptop.
      screen: siteCapture(
        'mpg-foundation',
        9605,
        'The MPG Foundation website, from the homepage down to the footer', // COPY: alt
      ),
      card: mockup(
        'mpg-foundation',
        'card',
        'card',
        'The MPG Foundation homepage on a tablet, with its “What we do” section on a phone', // COPY: alt
      ),
      showcase: mockup(
        'mpg-foundation',
        'showcase',
        'showcase',
        'MPG Foundation’s waterfront project in a browser, with its donate section on a phone', // COPY: alt
      ),
      preview: video(
        'mpg-foundation-preview.mp4',
        'Scrolling through the MPG Foundation website', // COPY:
        mockup('mpg-foundation', 'card', 'card', ''),
        1600,
        1200,
      ),
      heroVideo: video(
        'mpg-foundation-hero.mp4',
        'MPG Foundation website walkthrough', // COPY:
        mockup('mpg-foundation', 'showcase', 'showcase', ''),
        2400,
        1350,
      ),
      logo: clientLogo('mpg-foundation-on-dark', 1000, 1000, 'MPG Foundation logo'),
      gallery: [
        mockup(
          'mpg-foundation',
          'what-we-do',
          'wide',
          'The MPG Foundation “What we do” section in a browser',
        ), // COPY: alt
        mockup(
          'mpg-foundation',
          'donate-mobile',
          'tall',
          'The MPG Foundation donate section on a phone',
        ), // COPY: alt
        mockup(
          'mpg-foundation',
          'what-we-do-mobile',
          'tall',
          'How the MPG Foundation works, on a phone',
        ), // COPY: alt
        mockup(
          'mpg-foundation',
          'story',
          'wide',
          'The MPG Foundation waterfront project behind its donate section, in two browser windows',
        ), // COPY: alt
      ],
    },
    salonFriend: {
      // Full-page capture of salon-friends.web.app (29 Sep 2026, 1.5×), scrolled on the case study laptop.
      screen: siteCapture(
        'salon-friend',
        7142,
        'The Salon Friend website, from the homepage down to the footer', // COPY: alt
      ),
      card: mockup(
        'salon-friend',
        'card',
        'card',
        'Three Salon Friend pages on phones: the homepage, the catalogue and a product', // COPY: alt
      ),
      showcase: mockup(
        'salon-friend',
        'showcase',
        'showcase',
        'The Salon Friend homepage on a laptop between two phones showing the catalogue and a product', // COPY: alt
      ),
      preview: video(
        'salon-friend-preview.mp4',
        'Scrolling through the Salon Friend website', // COPY:
        mockup('salon-friend', 'card', 'card', ''),
        1600,
        1200,
      ),
      logo: clientLogo('salon-friend-on-dark', 682, 468, 'Salon Friend logo'),
      gallery: [
        mockup('salon-friend', 'catalogue', 'wide', 'The Salon Friend catalogue in a browser'), // COPY: alt
        mockup('salon-friend', 'product-mobile', 'tall', 'A Salon Friend product page on a phone'), // COPY: alt
        mockup('salon-friend', 'catalogue-mobile', 'tall', 'The Salon Friend catalogue on a phone'), // COPY: alt
        mockup(
          'salon-friend',
          'brands',
          'wide',
          'The Salon Friend brands page behind a product page, in two browser windows',
        ), // COPY: alt
      ],
    },
  },

  // Real portraits, cropped to 4:5 and encoded to WebP at 1200, 800 and 480 wide
  // (public/media/founders/README.md). COPY: PLACEHOLDER avatar for Enzo until his portrait
  // exists: add it the same way and swap in founderPhoto('enzo', …).
  founders: {
    enzo: founderPlaceholder('enzo', 'Enzo De Vittorio'),
    armand: founderPhoto(
      'armand',
      [1200, 800, 480],
      'Armand Naudé, co-founder of Stack Studio, smiling with his arms folded',
    ), // COPY: alt
  },

  // Pexels License stock (free for commercial use, no attribution), chosen for what each
  // section says; sources in public/media/studio/README.md. Swap for real studio photos later.
  studio: {
    // "Design, motion and development in one team": a designer and a developer at one screen.
    workspace: studioPhoto(
      'one-team',
      [1600, 1000, 640],
      4 / 5,
      'A designer and a developer working through a build together at one screen',
    ), // COPY: alt
    // "Built to grow": a team gathered around one table.
    detail: studioPhoto(
      'growing-team',
      [3200, 2000, 1200],
      1 / 2,
      'A team working together around one large table, seen from above',
    ), // COPY: alt
  },
} as const
