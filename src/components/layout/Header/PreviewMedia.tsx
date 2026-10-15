import { useEffect, useRef, useState } from 'react'
import type { SectionPreview } from '@/data/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './Header.module.css'

const deviceFrames = {
  phone: Array.from({ length: 18 }, (_, index) => 44 + index * 2),
  laptop: Array.from({ length: 18 }, (_, index) => 36 + index * 2),
} as const

function framePath(device: 'phone' | 'laptop', frame: number) {
  const width = device === 'phone' ? 480 : 800
  const folder = device === 'phone' ? 'phone/app' : 'laptop/desktop'
  return `/media/${folder}/frame-${String(frame).padStart(2, '0')}-${width}.webp`
}

/** Plays the site's existing short service clips and device turns only while the menu is open. */
export function PreviewMedia({ preview, active }: { preview: SectionPreview; active: boolean }) {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const device = preview.device
  const [frame, setFrame] = useState(() => (device ? (deviceFrames[device][0] ?? 0) : 0))

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active && !reducedMotion) void video.play().catch(() => undefined)
    else video.pause()
  }, [active, reducedMotion, preview])

  useEffect(() => {
    if (!device) return
    const frames = deviceFrames[device]
    if (!active || reducedMotion) return

    const images = frames.map((index) => {
      const image = new Image()
      image.src = framePath(device, index)
      return image
    })
    let position = 0
    let direction = 1
    const timer = window.setInterval(() => {
      position += direction
      if (position === frames.length - 1 || position === 0) direction *= -1
      setFrame(frames[position] ?? 0)
    }, 95)
    return () => {
      window.clearInterval(timer)
      images.forEach((image) => image.removeAttribute('src'))
    }
  }, [active, device, reducedMotion])

  if (preview.visual) return null
  if (device) {
    return (
      <img
        className={styles.deviceFrame}
        src={framePath(
          device,
          reducedMotion
            ? (deviceFrames[device].at(-1) ?? 0)
            : frame || deviceFrames[device][0] || 0,
        )}
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
