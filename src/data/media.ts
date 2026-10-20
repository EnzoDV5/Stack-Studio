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
import type {
  IllustrationPoint,
  IllustrationSceneAsset,
  ImageAsset,
  ImageSequenceAsset,
  VideoAsset,
} from '@/types'
import type { StageId } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

/**
 * Full-page desktop capture of a live client site in /public/media/projects, scrolled on the
 * laptop in the case study: the page at 1440 CSS px wide, saved at 1.5× (2160 px), 1× (1440),
 * 0.75× (1080) and 0.5× (720), so phones and 1× screens don't download the 2160 file.
 * `cssHeight` is the page height the capture script prints. How to recapture:
 * public/media/README.md (npm run mockups:capture -- --full).
 */
function siteCapture(id: string, cssHeight: number, alt: string): ImageAsset {
  return {
    src: `/media/projects/${id}-screen.webp`,
    srcSet: [
      `/media/projects/${id}-screen-720.webp 720w`,
      `/media/projects/${id}-screen-small.webp 1080w`,
      `/media/projects/${id}-screen-1440.webp 1440w`,
      `/media/projects/${id}-screen.webp 2160w`,
    ].join(', '),
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
  card: { aspect: 3 / 4, widths: [2400, 1600, 1200, 800] },
  /** Home hero backdrop and work reel, full-bleed on retina screens (16:9). */
  showcase: { aspect: 9 / 16, widths: [3840, 2560, 1920, 1280, 960] },
  /** Full-width gallery images (16:9). */
  wide: { aspect: 9 / 16, widths: [3840, 2560, 1920, 1280, 960] },
  /** Half-width gallery images (4:5). */
  tall: { aspect: 5 / 4, widths: [2000, 1200, 900, 600] },
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
 * A card illustration in /public/media/illustrations at each width (largest first), encoded
 * from the source SVGs in public/Illustrations by scripts/illustrations/encode.mjs (keep the
 * widths in step with it). `aspect` is height ÷ width.
 */
function illustration(id: string, widths: number[], aspect: number, alt: string): ImageAsset {
  const url = (w: number) => `/media/illustrations/${id}-${w}.webp`
  const largest = widths[0] ?? 1200
  return {
    src: url(widths[1] ?? largest),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest * aspect),
    alt,
  }
}

/** A rectangular illustration piece, from its edges in % of the image. */
function rect(left: number, top: number, right: number, bottom: number): IllustrationPoint[] {
  return [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ]
}

/** An octagon around a round illustration piece, so it can spin. Radii in % of width, height. */
function octagon(cx: number, cy: number, rx: number, ry: number): IllustrationPoint[] {
  return Array.from({ length: 8 }, (_, i) => {
    const angle = Math.PI / 8 + (i * Math.PI) / 4
    return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)] as const
  })
}

/** A square Services icon in /public/media/services/icons (192, 128 and 96 px WebP). */
function serviceIcon(id: string): ImageAsset {
  const url = (w: number) => `/media/services/icons/${id}-${w}.webp`
  return {
    src: url(192),
    srcSet: `${url(96)} 96w, ${url(128)} 128w, ${url(192)} 192w`,
    width: 192,
    height: 192,
    alt: '',
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
 * A service stage's looping clip: 1920×1080 with a 1280×720 rendition (the player picks the
 * one that is sharp at the slot's size) and its first frame as a WebP poster at five widths.
 * Encoded by scripts/services-media (sources and licences: public/media/services/README.md).
 */
function serviceClip(id: string, alt: string): ServiceMediaItem {
  const poster = (suffix: string) => `/media/services/${id}-poster${suffix}.webp`
  const image: ImageAsset = {
    src: poster('-960'),
    srcSet: [
      `${poster('-480')} 480w`,
      `${poster('-720')} 720w`,
      `${poster('-960')} 960w`,
      `${poster('-1280')} 1280w`,
      `${poster('')} 1920w`,
    ].join(', '),
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
      alt: 'Stack Studio logo on a dark grid background', // COPY:
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
    startToFinish: illustration(
      'start-to-finish',
      [1200, 800, 480],
      3 / 4,
      'Illustration of a team collaborating on a website', // COPY:
    ),
  },

  services: {
    // Comes apart into pieces that assemble as it scrolls in, then idle (IllustrationScene).
    // Shapes are in % of the image; the figure and the card in their hands stay put.
    fixOrImprove: {
      image: illustration(
        'fix-or-improve',
        [1760, 1200, 800, 480],
        991 / 1760,
        'A designer rearranging website components, with symbols for improvements and growth',
      ),
      pieces: [
        { id: 'sliders', shape: rect(6, 17.6, 20.8, 37.8), enter: 'left', idle: 'float' },
        { id: 'refresh', shape: rect(6.1, 40.8, 16.2, 57.4), enter: 'left', idle: 'float' },
        {
          id: 'refresh-arrows',
          shape: octagon(11.22, 49.1, 3.75, 6.66),
          parent: 'refresh',
          enter: 'pop',
          idle: 'spin',
        },
        { id: 'growth', shape: rect(79.6, 16.4, 93.5, 37.8), enter: 'right', idle: 'float' },
        {
          id: 'growth-chart',
          shape: rect(81.4, 19.2, 91.6, 35.5),
          parent: 'growth',
          enter: 'draw',
        },
        { id: 'add', shape: rect(79.6, 40, 90.2, 57.4), enter: 'right', idle: 'float' },
        { id: 'slot', shape: rect(59.9, 21, 75.9, 39.6), enter: 'pop', idle: 'pulse' },
        { id: 'chart', shape: rect(62.2, 42.6, 74.6, 56.3), enter: 'draw' },
        { id: 'tile-1', shape: rect(35.4, 58.6, 48.8, 71), enter: 'rise' },
        { id: 'tile-2', shape: rect(48.9, 58.6, 62.4, 71), enter: 'rise' },
        { id: 'tile-3', shape: rect(62.5, 58.6, 75.9, 71), enter: 'rise' },
        { id: 'copy', shape: rect(35.6, 73.6, 53.4, 83), enter: 'draw' },
        { id: 'dot-1', shape: rect(57.2, 73, 62.1, 82), enter: 'pop', idle: 'pulse' },
        { id: 'dot-2', shape: rect(63.5, 73, 68.5, 82), enter: 'pop', idle: 'pulse' },
        { id: 'dot-3', shape: rect(69.8, 73, 74.8, 82), enter: 'pop', idle: 'pulse' },
        {
          // L-shaped: the leaves reach up beside the card above and stop short of the box.
          id: 'plant',
          shape: [
            [90.4, 52.4],
            [97.8, 52.4],
            [97.8, 78.4],
            [87, 78.4],
            [87, 75.6],
            [83.6, 75.6],
            [83.6, 58.4],
            [90.4, 58.4],
          ],
          enter: 'grow',
          idle: 'sway',
          origin: [91.5, 78.4],
        },
      ],
    } satisfies IllustrationSceneAsset,
    /**
     * The quick-pick icons at the top of Services, keyed by the section they jump to. Encoded
     * from the sources in public/Icons by scripts/icons/encode.mjs. Decorative (the label
     * names each section), so no alt.
     */
    icons: {
      'stage-build': serviceIcon('new-website'),
      apps: serviceIcon('apps'),
      desktop: serviceIcon('desktop'),
      'stage-grow': serviceIcon('fix-or-improve'),
      plans: serviceIcon('hosting-and-care'),
      'services-faq': serviceIcon('questions'),
    } as Record<string, ImageAsset>,
  },

  // The Services device sections, with illustrative apps (not clients'), designed in
  // scripts/devices/screens: a bookings app on the phone, a stock and orders tool on the laptop.
  apps: {
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
      logo: clientLogo('mpg-foundation-on-dark', 400, 400, 'MPG Foundation logo'),
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
      logo: clientLogo('salon-friend-on-dark', 480, 329, 'Salon Friend logo'),
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
  // (public/media/founders/README.md).
  founders: {
    enzo: founderPhoto(
      'enzo',
      [1200, 800, 480],
      'Enzo De Vittorio, co-founder of Stack Studio, standing in a field of dry grass at golden hour',
    ), // COPY: alt
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
      [1600, 1200, 1000, 800, 640],
      4 / 5,
      'A designer and a developer working through a build together at one screen',
    ), // COPY: alt
    // "Built to grow": a team gathered around one table.
    detail: studioPhoto(
      'growing-team',
      [3200, 2000, 1600, 1200, 800],
      1 / 2,
      'A team working together around one large table, seen from above',
    ), // COPY: alt
  },
} as const
