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
  ClientLogoSet,
  IllustrationPoint,
  IllustrationJourneyAsset,
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

/** A ring around a round illustration piece (an octagon with an octagon cut out), so it can spin. */
function ring(cx: number, cy: number, outer: number, inner: number): IllustrationPoint[] {
  const out = octagon(cx, cy, outer, outer)
  const hole = octagon(cx, cy, inner, inner).reverse()
  // One outline: around the outside, then back round the hole the other way.
  return [...out, ...out.slice(0, 1), ...hole, ...hole.slice(0, 1)]
}

/** A Studio value icon: decorative (the value's title says it), 112 CSS px wide. */
function valueIcon(id: string): ImageAsset {
  return illustration(`value-${id}`, [360, 240, 160], 1, '')
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
 * A client logo (transparent WebP in /public/logos/clients). Each client has one drawn for each
 * page tone; the missing one is generated (-on-dark or -on-light, scripts/mockups/logos.mjs).
 */
function clientLogo(file: string, width: number, height: number, alt: string): ImageAsset {
  return { src: `/logos/clients/${file}.webp`, width, height, alt }
}

/** Every client logo, for dark and light backgrounds (case study titles, testimonials). */
const clientLogos = {
  gcSolar: {
    onDark: clientLogo('gc-solar', 570, 113, 'GC Solar logo'),
    onLight: clientLogo('gc-solar-on-light', 570, 113, 'GC Solar logo'),
  },
  mpgFoundation: {
    onDark: clientLogo('mpg-foundation-on-dark', 400, 400, 'MPG Foundation logo'),
    onLight: clientLogo('mpg-foundation', 400, 400, 'MPG Foundation logo'),
  },
  salonFriend: {
    onDark: clientLogo('salon-friend-on-dark', 480, 329, 'Salon Friend logo'),
    onLight: clientLogo('salon-friend', 480, 329, 'Salon Friend logo'),
  },
} satisfies Record<string, ClientLogoSet>

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
  clients: clientLogos,
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
    // The work reel's closing card. Most of it is held in hands or joined by the path, so
    // only the loose parts move: the path's dots, the chat bubble and the content on the
    // browser and the card (IllustrationScene).
    startToFinish: {
      image: illustration(
        'start-to-finish',
        [1200, 800, 480],
        3 / 4,
        'Illustration of a team collaborating on a website', // COPY:
      ),
      pieces: [
        {
          id: 'dot-1',
          shape: octagon(33.92, 10.78, 1.92, 2.56),
          enter: 'pop',
          idle: 'pulse',
        },
        { id: 'wireframe', shape: rect(43.4, 33.3, 54.8, 47.4), enter: 'draw' },
        { id: 'dot-2', shape: octagon(75, 22.22, 1.25, 1.67), enter: 'pop', idle: 'pulse' },
        { id: 'bubble', shape: rect(76.25, 19.6, 83.2, 27), enter: 'pop' },
        { id: 'bubble-lines', shape: rect(77, 21.2, 82, 25.6), parent: 'bubble', enter: 'draw' },
        {
          id: 'dot-3',
          shape: octagon(84.83, 34.11, 1.33, 1.78),
          enter: 'pop',
          idle: 'pulse',
        },
        { id: 'card-photo', shape: octagon(77.67, 44.56, 2.7, 3.6), enter: 'pop' },
        { id: 'card-lines', shape: rect(73.5, 47.9, 81.2, 51.8), enter: 'draw' },
      ],
    } satisfies IllustrationSceneAsset,
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
      logo: clientLogos.gcSolar.onDark,
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
      logo: clientLogos.mpgFoundation.onDark,
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
      logo: clientLogos.salonFriend.onDark,
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

  // Process, under the page title: the six steps along one path, from the client's brief to
  // care after launch (ProcessJourney). Each piece plays in its step (0 Discover … 5 Care);
  // coordinates are % of the cropped strip (scripts/illustrations crops the 16:9 source).
  process: {
    image: illustration(
      'process',
      [1480, 1150, 760, 480],
      372 / 1480,
      'One person sharing a brief, then a wireframe, a design, code, a rocket launching and a gear with a tick, joined by one path to a second person who looks after the site', // COPY: alt
    ),
    stops: [14.5, 26.2, 40.8, 55.9, 71.3, 85.2],
    pieces: [
      // 01 Discover: the brief pops out of the laptop and writes itself.
      {
        id: 'brief',
        shape: rect(9.4, 13.2, 19.4, 35.3),
        enter: 'pop',
        origin: [11.5, 34],
        idle: 'float',
        step: 0,
      },
      {
        id: 'brief-text',
        parent: 'brief',
        shape: rect(10.8, 17, 18.2, 26.5),
        enter: 'draw',
        step: 0,
      },
      // 02 Define: the path reaches the wireframe, which rises and sketches its layout.
      {
        id: 'path-define',
        // From the top of the laptop, round it, to the wireframe.
        shape: [
          [11.2, 35.3],
          [21, 35.3],
          [21, 56],
          [13.6, 56],
          [13.6, 47.5],
          [11.2, 47.5],
        ],
        enter: 'draw',
        step: 1,
      },
      { id: 'wireframe', shape: rect(21, 26.6, 31.2, 71.4), enter: 'rise', step: 1 },
      {
        id: 'wireframe-sketch',
        parent: 'wireframe',
        shape: rect(22, 35.5, 30.4, 67.5),
        enter: 'draw',
        step: 1,
      },
      // 03 Design: the canvas pops up, the shapes and picture land, the cursor clicks, sparks fly.
      { id: 'path-design', shape: rect(31.2, 39, 34.7, 56), enter: 'draw', step: 2 },
      { id: 'design', shape: rect(34.7, 27.6, 46.6, 73.6), enter: 'pop', step: 2 },
      {
        id: 'design-shapes',
        parent: 'design',
        shape: rect(35.6, 33.5, 38.2, 61.5),
        enter: 'pop',
        step: 2,
      },
      {
        id: 'design-picture',
        parent: 'design',
        shape: [
          [38.4, 33.5],
          [45.3, 33.5],
          [45.3, 56.8],
          [42.9, 56.8],
          [42.9, 61.5],
          [38.4, 61.5],
        ],
        enter: 'draw',
        step: 2,
      },
      {
        id: 'cursor',
        parent: 'design',
        shape: rect(42.9, 57, 46.5, 73.2),
        enter: 'click',
        origin: [43.2, 57.5],
        step: 2,
      },
      {
        id: 'design-sparks',
        shape: rect(42, 16.5, 47.6, 27.6),
        enter: 'pop',
        origin: [43.5, 27],
        idle: 'pulse',
        step: 2,
      },
      // 04 Build: the editor rises, the tags pop in and the code writes itself.
      { id: 'path-build', shape: rect(46.6, 41.5, 50.2, 62), enter: 'draw', step: 3 },
      { id: 'code', shape: rect(50.2, 28.1, 61.2, 71.4), enter: 'rise', step: 3 },
      { id: 'code-tags', parent: 'code', shape: rect(52, 38.8, 57.4, 49.6), enter: 'pop', step: 3 },
      {
        id: 'code-lines',
        parent: 'code',
        shape: rect(52, 51.8, 59.8, 66.5),
        enter: 'draw',
        step: 3,
      },
      // 05 Launch: the window rises and the rocket blasts up out of the clouds.
      {
        id: 'path-launch',
        shape: [
          [61.2, 41],
          [65.6, 41],
          [65.6, 59],
          [70.5, 59],
          [70.5, 63],
          [61.2, 63],
        ],
        enter: 'draw',
        step: 4,
      },
      { id: 'launch', shape: rect(65.6, 16.5, 77, 59), enter: 'rise', step: 4 },
      {
        id: 'rocket',
        parent: 'launch',
        // Narrow through the gap in the window's top border, so the border stays put as it hovers.
        shape: [
          [69.5, 16.7],
          [72.3, 16.7],
          [72.3, 21.2],
          [73.8, 21.2],
          [73.8, 45.5],
          [69, 45.5],
          [69, 21.2],
          [69.5, 21.2],
        ],
        enter: 'launch',
        idle: 'float',
        step: 4,
      },
      {
        id: 'launch-sparks',
        shape: rect(68.6, 4.5, 74.4, 16.3),
        enter: 'pop',
        origin: [71.5, 16],
        idle: 'pulse',
        step: 4,
      },
      // 06 Care: the settings window pops up, the gear spins up and the tick stamps on.
      { id: 'path-care', shape: rect(77, 33, 80.5, 56), enter: 'draw', step: 5 },
      { id: 'care', shape: rect(80.5, 13.6, 89.5, 50.4), enter: 'pop', origin: [85, 49], step: 5 },
      {
        id: 'gear',
        parent: 'care',
        shape: octagon(84.65, 33, 2.5, 10),
        enter: 'pop',
        idle: 'spin',
        step: 5,
      },
      {
        id: 'tick',
        parent: 'care',
        shape: octagon(87.8, 19.9, 1.6, 6.3),
        enter: 'pop',
        idle: 'pulse',
        step: 5,
      },
      {
        id: 'plant',
        shape: rect(93.9, 57.5, 99.3, 84.5),
        enter: 'grow',
        origin: [96.5, 84.5],
        idle: 'sway',
        step: 5,
      },
    ],
  } satisfies IllustrationJourneyAsset,
  studio: {
    // "Design, motion and development in one team": the team around one site. The panels are
    // joined by the path, so the loose details move: the browser and panel content, the
    // path's dots and the sparks (IllustrationScene).
    oneTeam: {
      image: illustration(
        'studio',
        [1280, 960, 640, 480],
        1,
        'Three people building a website together, surrounded by panels for images, video and code', // COPY: alt
      ),
      pieces: [
        { id: 'browser-dots', shape: rect(30.5, 36.6, 37, 38.6), enter: 'pop' },
        { id: 'shape-triangle', shape: rect(14.2, 23, 17.2, 26.2), enter: 'pop' },
        { id: 'shape-circle', shape: rect(14.1, 27.2, 17.2, 30.4), enter: 'pop' },
        { id: 'shape-square', shape: rect(14.1, 31.2, 17.2, 34.4), enter: 'pop' },
        { id: 'sun', shape: octagon(27.97, 26.8, 2.1, 2.1), enter: 'pop' },
        { id: 'play', shape: rect(70.7, 19.8, 75.8, 24.4), enter: 'pop', idle: 'pulse' },
        { id: 'progress', shape: rect(64.7, 27.1, 81.7, 29.1), enter: 'draw' },
        { id: 'code-tag', shape: rect(78.5, 37.3, 93.8, 43), enter: 'draw' },
        { id: 'code-lines', shape: rect(81.2, 43, 93.8, 47.9), enter: 'draw' },
        { id: 'copy', shape: rect(51.2, 41.5, 68, 49), enter: 'draw' },
        { id: 'button', shape: rect(51.2, 49.8, 62.7, 54.4), enter: 'pop', idle: 'pulse' },
        { id: 'circle-1', shape: octagon(42.03, 59.14, 3, 3), enter: 'pop' },
        { id: 'circle-2', shape: octagon(50.63, 59.14, 3, 3), enter: 'pop' },
        { id: 'circle-3', shape: octagon(59.22, 59.14, 3, 3), enter: 'pop' },
        { id: 'captions', shape: rect(38.8, 62.2, 63, 65.2), enter: 'draw' },
        { id: 'dot-1', shape: octagon(30.31, 20.7, 1.6, 1.6), enter: 'pop', idle: 'pulse' },
        { id: 'dot-2', shape: octagon(90.86, 32.97, 1.3, 1.3), enter: 'pop', idle: 'pulse' },
        { id: 'dot-3', shape: octagon(87.89, 58.98, 1.3, 1.3), enter: 'pop', idle: 'pulse' },
        { id: 'dot-4', shape: octagon(7.81, 41.41, 1.3, 1.3), enter: 'pop', idle: 'pulse' },
        { id: 'spark-1', shape: rect(41.8, 20.3, 46.4, 25.4), enter: 'pop', idle: 'pulse' },
        { id: 'spark-2', shape: rect(85.2, 18.8, 90, 23.4), enter: 'pop', idle: 'pulse' },
        { id: 'spark-3', shape: rect(23, 39, 26, 41.8), enter: 'pop', idle: 'pulse' },
      ],
    } satisfies IllustrationSceneAsset,
    // The four value icons (transparent PNG sources in public/Illustrations). Each comes apart
    // into its loose parts, which assemble as the list reaches the middle of the screen.
    values: {
      proof: {
        image: valueIcon('proof'),
        pieces: [
          { id: 'picture', shape: rect(28.6, 33.8, 54, 53.2), enter: 'pop' },
          { id: 'lines', shape: rect(28.8, 56.2, 52.4, 71.4), enter: 'draw' },
          {
            id: 'tick',
            shape: [
              [57.4, 52.6],
              [73.4, 52.6],
              [73.4, 58.5],
              [66.5, 64.2],
              [57.4, 64.2],
            ],
            enter: 'draw',
          },
          { id: 'pupil', shape: octagon(73.9, 69.4, 5, 5), enter: 'pop', idle: 'pulse' },
        ],
      } satisfies IllustrationSceneAsset,
      craft: {
        image: valueIcon('craft'),
        pieces: [
          {
            // Sketches: it rocks on its tip.
            id: 'pencil',
            shape: [
              [40.6, 59.6],
              [44.4, 46.6],
              [69.4, 21.8],
              [73.5, 20.8],
              [78.6, 25],
              [78.8, 30],
              [53.6, 55.2],
            ],
            enter: 'right',
            idle: 'sway',
            origin: [42, 58.4],
          },
        ],
      } satisfies IllustrationSceneAsset,
      clarity: {
        image: valueIcon('clarity'),
        pieces: [
          { id: 'dots', shape: rect(25.4, 31.6, 40.4, 35.8), enter: 'pop' },
          { id: 'path', shape: rect(25.6, 44.6, 76, 66), enter: 'draw' },
          {
            id: 'stop-1',
            shape: octagon(29, 62.4, 3.4, 3.4),
            parent: 'path',
            enter: 'pop',
            idle: 'pulse',
          },
          {
            id: 'stop-2',
            shape: octagon(43.8, 62.4, 3.4, 3.4),
            parent: 'path',
            enter: 'pop',
            idle: 'pulse',
          },
          {
            id: 'stop-3',
            shape: octagon(57.9, 50.5, 3.4, 3.4),
            parent: 'path',
            enter: 'pop',
            idle: 'pulse',
          },
        ],
      } satisfies IllustrationSceneAsset,
      longRun: {
        image: valueIcon('long-run'),
        pieces: [
          { id: 'shield', shape: octagon(50, 50.2, 21.3, 21.3), enter: 'pop' },
          {
            id: 'wrench',
            shape: [
              [48, 41],
              [62.6, 41],
              [62.6, 52],
              [50, 63.6],
              [45, 63.6],
              [40.8, 59],
              [40.8, 55],
            ],
            parent: 'shield',
            enter: 'pop',
            idle: 'sway',
          },
          // The arrows circle the shield, slowly.
          { id: 'cycle', shape: ring(50, 50.2, 38, 21.5), enter: 'pop', idle: 'spin' },
        ],
      } satisfies IllustrationSceneAsset,
    },
    // Pexels License stock (free for commercial use, no attribution); source in
    // public/media/studio/README.md. Swap for a real studio photo later.
    // "Built to grow": a team gathered around one table.
    detail: studioPhoto(
      'growing-team',
      [3200, 2000, 1600, 1200, 800],
      1 / 2,
      'A team working together around one large table, seen from above',
    ), // COPY: alt
  },
} as const
