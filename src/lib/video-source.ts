import type { VideoAsset } from '@/types'

/**
 * The smallest encode of a clip that is still sharp where it's shown. The video covers its
 * box (object-fit: cover), so in a tall box it's drawn wider than the box: the width that
 * matters is the larger of the box width and the box height × the video's aspect. Picks the
 * first rendition at least that many device pixels wide (with 10% slack, since video is soft
 * anyway), or the largest one there is.
 */
export function pickVideoSource(
  video: VideoAsset,
  box: { width: number; height: number },
  pixelRatio = 1,
): string {
  const drawnWidth = Math.max(box.width, box.height * (video.width / video.height))
  const needed = drawnWidth * pixelRatio * 0.9
  const all = [{ src: video.src, width: video.width }, ...(video.renditions ?? [])].sort(
    (a, b) => a.width - b.width,
  )
  return (all.find((r) => r.width >= needed) ?? all[all.length - 1] ?? { src: video.src }).src
}
