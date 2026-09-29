/**
 * EVERY media path in the site lives here. Swap placeholders for real assets by editing
 * this file only:
 *   - Images: replace picsum URLs with files in /public/media/images (keep width/height accurate).
 *   - Videos: drop MP4s into /public/media/ using the file names below. Until they exist,
 *     <Video> falls back to its poster or an animated brand-gradient placeholder.
 * Placeholder images use picsum.photos with FIXED seeds so they don't change between loads.
 */
import type { ImageAsset, VideoAsset } from '@/types'
import type { StageId } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

/**
 * Full-page desktop capture of a live client site (1440 wide) in /public/media/projects,
 * scrolled on the laptop in the case study. How to recapture: public/media/README.md.
 */
function siteCapture(id: string, height: number, alt: string): ImageAsset {
  return {
    src: `/media/projects/${id}-screen.webp`,
    srcSet: `/media/projects/${id}-screen-small.webp 720w, /media/projects/${id}-screen.webp 1440w`,
    width: 1440,
    height,
    alt,
  }
}

/**
 * Device mockup of a live client site in /public/media/projects/mockups, rendered from real
 * captures by scripts/mockups (see public/media/README.md). Each has a half-size -small copy.
 */
type MockupShape = 'thumb' | 'wide' | 'tall'
const mockupSize: Record<MockupShape, [number, number]> = {
  thumb: [1600, 1200],
  wide: [2400, 1350],
  tall: [1200, 1500],
}
function mockup(project: string, name: string, shape: MockupShape, alt: string): ImageAsset {
  const [width, height] = mockupSize[shape]
  const base = `/media/projects/mockups/${project}-${name}`
  return {
    src: `${base}.webp`,
    srcSet: `${base}-small.webp ${width / 2}w, ${base}.webp ${width}w`,
    width,
    height,
    alt,
  }
}

/** picsum placeholder with a responsive srcSet (webp). */
function picsum(seed: string, width: number, height: number, alt: string): ImageAsset {
  const url = (w: number) =>
    `https://picsum.photos/seed/${seed}/${w}/${Math.round((w * height) / width)}.webp`
  const widths = [480, 800, 1200, 1600, 2400].filter((w) => w < width).concat(width)
  return {
    src: url(width),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    alt,
    width,
    height,
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

/** Locally hosted stock media; sources and processing notes are in public/media/services/README.md. */
function servicePhoto(id: string, alt: string): ServiceMediaItem {
  return {
    id,
    image: {
      src: `/media/services/${id}.webp`,
      srcSet: `/media/services/${id}-small.webp 480w, /media/services/${id}.webp 1200w`,
      width: 1200,
      height: 800,
      alt,
    },
  }
}

function serviceClip(id: string, alt: string): ServiceMediaItem {
  const image: ImageAsset = {
    src: `/media/services/${id}-poster.webp`,
    srcSet: `/media/services/${id}-poster-small.webp 480w, /media/services/${id}-poster.webp 960w`,
    width: 960,
    height: 540,
    alt,
  }
  return {
    id,
    image,
    video: {
      src: `/media/services/${id}.mp4`,
      type: 'video/mp4',
      width: 960,
      height: 540,
      label: alt,
      poster: image,
    },
  }
}

/** One image per service stage, chosen to show what that stage actually involves. */
export const serviceMedia: Record<StageId, ServiceMediaItem> = {
  build: servicePhoto(
    'wireframes',
    'Interface wireframes for a new website sketched in a notebook beside a phone',
  ),
  takeover: servicePhoto(
    'code-review',
    'An existing website’s source code open on a monitor for review',
  ),
  run: serviceClip('run', 'Network cables and status lights on live server equipment'),
  grow: servicePhoto(
    'analytics',
    'A website analytics dashboard showing rising traffic on a desktop display',
  ),
  partner: serviceClip('partner', 'Four collaborators reviewing work together around a laptop'),
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

  projects: {
    // Thumbnails, heroes and galleries are device mockups rendered from real captures of the
    // live sites (scripts/mockups, 29 Sep 2026). The poster of each missing preview/hero video
    // is the matching mockup, so nothing falls back to a stock photo.
    gcSolar: {
      // Full-page capture of gcsolar-redesign-demo.netlify.app (28 Sep 2026), scrolled on the case study laptop.
      screen: siteCapture(
        'gc-solar',
        5991,
        'The GC Solar website, from the homepage down to the footer', // COPY: alt
      ),
      thumbnail: mockup(
        'gc-solar',
        'thumb',
        'thumb',
        'The GC Solar homepage on a laptop and a phone', // COPY: alt
      ),
      preview: video(
        'gc-solar-preview.mp4',
        'Scrolling through the GC Solar website', // COPY:
        mockup('gc-solar', 'thumb', 'thumb', ''),
        1600,
        1200,
      ),
      hero: mockup(
        'gc-solar',
        'hero',
        'wide',
        'The GC Solar solutions page on a laptop, with its projects page on a phone', // COPY: alt
      ),
      heroVideo: video(
        'gc-solar-hero.mp4',
        'GC Solar website walkthrough', // COPY:
        mockup('gc-solar', 'hero', 'wide', ''),
        2400,
        1350,
      ),
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
      // Full-page capture of mpgf.org.za (28 Sep 2026), scrolled on the case study laptop.
      screen: siteCapture(
        'mpg-foundation',
        9605,
        'The MPG Foundation website, from the homepage down to the footer', // COPY: alt
      ),
      thumbnail: mockup(
        'mpg-foundation',
        'thumb',
        'thumb',
        'The MPG Foundation homepage on a laptop, with its “What we do” section on a phone', // COPY: alt
      ),
      preview: video(
        'mpg-foundation-preview.mp4',
        'Scrolling through the MPG Foundation website', // COPY:
        mockup('mpg-foundation', 'thumb', 'thumb', ''),
        1600,
        1200,
      ),
      hero: mockup(
        'mpg-foundation',
        'hero',
        'wide',
        'MPG Foundation’s waterfront project on a laptop, with its donate section on a phone', // COPY: alt
      ),
      heroVideo: video(
        'mpg-foundation-hero.mp4',
        'MPG Foundation website walkthrough', // COPY:
        mockup('mpg-foundation', 'hero', 'wide', ''),
        2400,
        1350,
      ),
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
      // Full-page capture of salon-friends.web.app (28 Sep 2026), scrolled on the case study laptop.
      screen: siteCapture(
        'salon-friend',
        7142,
        'The Salon Friend website, from the homepage down to the footer', // COPY: alt
      ),
      thumbnail: mockup(
        'salon-friend',
        'thumb',
        'thumb',
        'The Salon Friend homepage on a laptop and a phone', // COPY: alt
      ),
      preview: video(
        'salon-friend-preview.mp4',
        'Scrolling through the Salon Friend website', // COPY:
        mockup('salon-friend', 'thumb', 'thumb', ''),
        1600,
        1200,
      ),
      hero: mockup(
        'salon-friend',
        'hero',
        'wide',
        'The Salon Friend catalogue on a laptop, with a product page on a phone', // COPY: alt
      ),
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

  founders: {
    enzo: picsum('stack-founder-enzo', 900, 1125, 'Portrait of Enzo De Vittorio'), // COPY: replace with real portrait
    armand: picsum('stack-founder-armand', 900, 1125, 'Portrait of Armand Naudé'), // COPY: replace with real portrait
  },

  studio: {
    workspace: picsum(
      'stack-studio-workspace',
      2400,
      1350,
      'The Stack Studio workspace in Centurion',
    ), // COPY: alt
    // COPY: alt. Licensed stock already in /public/media/services (see its README). Swap
    // for a real studio photo when there is one.
    detail: servicePhoto('collaboration', 'Two people reviewing software together on a laptop')
      .image,
  },
} as const
