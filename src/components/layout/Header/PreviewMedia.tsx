import { useEffect, useRef } from 'react'
import type { SectionPreview } from '@/data/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './Header.module.css'

const deviceStill = {
  phone: '/media/phone/app/frame-78-800.webp',
  laptop: '/media/laptop/desktop/frame-70-800.webp',
} as const

/** Shows still device previews and plays short service clips while the menu is open. */
export function PreviewMedia({ preview, active }: { preview: SectionPreview; active: boolean }) {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const device = preview.device

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active && !reducedMotion) void video.play().catch(() => undefined)
    else video.pause()
  }, [active, reducedMotion, preview])

  if (preview.visual) return null
  if (device) {
    return (
      <img
        className={styles.deviceFrame}
        data-device={device}
        src={deviceStill[device]}
        alt=""
        decoding="async"
      />
    )
  }
  if (preview.video && !reducedMotion) {
    return (
      <video
        ref={videoRef}
        key={preview.video}
        src={preview.video}
        poster={preview.image}
        muted
        playsInline
        loop
        autoPlay={active}
        preload="metadata"
        aria-hidden="true"
      />
    )
  }
  return <img className={styles.stillPreview} src={preview.image} alt="" loading="lazy" />
}
