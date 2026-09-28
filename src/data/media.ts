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
    gcSolar: {
      // Full-page capture of gcsolar-redesign-demo.netlify.app (28 Sep 2026), scrolled on the case study laptop.
      screen: siteCapture(
        'gc-solar',
        5991,
        'The GC Solar website, from the homepage down to the footer', // COPY: alt
      ),
      thumbnail: picsum('stack-gc-solar-thumb', 1600, 1200, 'GC Solar website shown on a laptop'), // COPY: alt
      preview: video(
        'gc-solar-preview.mp4',
        'Scrolling through the GC Solar website', // COPY:
        picsum('stack-gc-solar-thumb', 1600, 1200, ''),
        1600,
        1200,
      ),
      hero: picsum(
        'stack-gc-solar-hero',
        2400,
        1350,
        'GC Solar homepage hero with rooftop solar installation',
      ), // COPY: alt
      heroVideo: video(
        'gc-solar-hero.mp4',
        'GC Solar website walkthrough', // COPY:
        picsum('stack-gc-solar-hero', 2400, 1350, ''),
        2400,
        1350,
      ),
      gallery: [
        picsum('stack-gc-solar-g1', 2400, 1350, 'GC Solar services page on desktop'), // COPY: alt
        picsum('stack-gc-solar-g2', 1200, 1500, 'GC Solar quote form on mobile'), // COPY: alt
        picsum('stack-gc-solar-g3', 1200, 1500, 'GC Solar project gallery on mobile'), // COPY: alt
        picsum('stack-gc-solar-g4', 2400, 1350, 'GC Solar about page with team photography'), // COPY: alt
      ],
    },
    mpgFoundation: {
      // Full-page capture of mpgf.org.za (28 Sep 2026), scrolled on the case study laptop.
      screen: siteCapture(
        'mpg-foundation',
        9605,
        'The MPG Foundation website, from the homepage down to the footer', // COPY: alt
      ),
      thumbnail: picsum('stack-mpg-thumb', 1600, 1200, 'MPG Foundation website on a tablet'), // COPY: alt
      preview: video(
        'mpg-foundation-preview.mp4',
        'Scrolling through the MPG Foundation website', // COPY:
        picsum('stack-mpg-thumb', 1600, 1200, ''),
        1600,
        1200,
      ),
      hero: picsum(
        'stack-mpg-hero',
        2400,
        1350,
        'MPG Foundation homepage with community programme imagery',
      ), // COPY: alt
      heroVideo: video(
        'mpg-foundation-hero.mp4',
        'MPG Foundation website walkthrough', // COPY:
        picsum('stack-mpg-hero', 2400, 1350, ''),
        2400,
        1350,
      ),
      gallery: [
        picsum('stack-mpg-g1', 2400, 1350, 'MPG Foundation programmes overview'), // COPY: alt
        picsum('stack-mpg-g2', 1200, 1500, 'MPG Foundation donate flow on mobile'), // COPY: alt
        picsum('stack-mpg-g3', 1200, 1500, 'MPG Foundation impact stories on mobile'), // COPY: alt
        picsum('stack-mpg-g4', 2400, 1350, 'MPG Foundation volunteer sign-up page'), // COPY: alt
      ],
    },
    salonFriend: {
      // Full-page capture of salon-friends.web.app (28 Sep 2026), scrolled on the case study laptop.
      screen: siteCapture(
        'salon-friend',
        7142,
        'The Salon Friend website, from the homepage down to the footer', // COPY: alt
      ),
      thumbnail: picsum('stack-salon-friend-thumb', 1600, 1200, 'The Salon Friend website'), // COPY: alt, replace with a real screenshot
      preview: video(
        'salon-friend-preview.mp4',
        'Scrolling through the Salon Friend website', // COPY:
        picsum('stack-salon-friend-thumb', 1600, 1200, ''),
        1600,
        1200,
      ),
      hero: picsum('stack-salon-friend-hero', 2400, 1350, 'The Salon Friend homepage'), // COPY: alt
      gallery: [
        picsum('stack-salon-friend-g1', 2400, 1350, 'Salon Friend page on desktop'), // COPY: alt
        picsum('stack-salon-friend-g2', 1200, 1500, 'Salon Friend on mobile'), // COPY: alt
        picsum('stack-salon-friend-g3', 1200, 1500, 'Salon Friend on mobile'), // COPY: alt
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
