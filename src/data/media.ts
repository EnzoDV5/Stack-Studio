/**
 * EVERY media path in the site lives here. Swap placeholders for real assets by editing
 * this file only:
 *   - Images: replace picsum URLs with files in /public/media/images (keep width/height accurate).
 *   - Videos: drop MP4s into /public/media/ using the file names below. Until they exist,
 *     <Video> falls back to its poster or an animated brand-gradient placeholder.
 * Placeholder images use picsum.photos with FIXED seeds so they don't change between loads.
 */
import type { ImageAsset, VideoAsset } from '@/types'

/** picsum placeholder with a responsive srcSet (webp). */
function picsum(seed: string, width: number, height: number, alt: string): ImageAsset {
  const url = (w: number) =>
    `https://picsum.photos/seed/${seed}/${w}/${Math.round((w * height) / width)}.webp`
  const widths = [Math.round(width / 2), width].filter((w, i, all) => all.indexOf(w) === i)
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
      thumbnail: picsum('stack-gc-solar-thumb', 1600, 1200, 'GC Solar website shown on a laptop'), // COPY: alt
      preview: video(
        'gc-solar-preview.mp4',
        'Scrolling through the GC Solar website', // COPY:
        picsum('stack-gc-solar-thumb', 1600, 1200, ''),
        1600,
        1200,
      ),
      hero: picsum('stack-gc-solar-hero', 2400, 1350, 'GC Solar homepage hero with rooftop solar installation'), // COPY: alt
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
      thumbnail: picsum('stack-mpg-thumb', 1600, 1200, 'MPG Foundation website on a tablet'), // COPY: alt
      preview: video(
        'mpg-foundation-preview.mp4',
        'Scrolling through the MPG Foundation website', // COPY:
        picsum('stack-mpg-thumb', 1600, 1200, ''),
        1600,
        1200,
      ),
      hero: picsum('stack-mpg-hero', 2400, 1350, 'MPG Foundation homepage with community programme imagery'), // COPY: alt
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
    sample: {
      thumbnail: picsum('stack-sample-thumb', 1600, 1200, 'Sample project placeholder image'), // COPY: alt
      preview: video(
        'sample-preview.mp4',
        'Sample project preview', // COPY:
        picsum('stack-sample-thumb', 1600, 1200, ''),
        1600,
        1200,
      ),
      hero: picsum('stack-sample-hero', 2400, 1350, 'Sample project hero placeholder'), // COPY: alt
      gallery: [
        picsum('stack-sample-g1', 2400, 1350, 'Sample project page placeholder'), // COPY: alt
        picsum('stack-sample-g2', 1200, 1500, 'Sample project mobile placeholder'), // COPY: alt
        picsum('stack-sample-g3', 1200, 1500, 'Sample project mobile placeholder'), // COPY: alt
      ],
    },
  },

  founders: {
    enzo: picsum('stack-founder-enzo', 900, 1125, 'Portrait of Enzo De Vittorio'), // COPY: replace with real portrait
    armand: picsum('stack-founder-armand', 900, 1125, 'Portrait of Armand Naudé'), // COPY: replace with real portrait
  },

  studio: {
    workspace: picsum('stack-studio-workspace', 2400, 1350, 'The Stack Studio workspace in Centurion'), // COPY: alt
    detail: picsum('stack-studio-detail', 1200, 1500, 'Wireframes and sketches on a desk'), // COPY: alt
  },
} as const
