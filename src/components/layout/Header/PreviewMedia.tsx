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

/** Plays each device turn once and holds its final frame. */
export function PreviewMedia({
  preview,
  active,
  played = false,
  previewKey,
  onDeviceComplete,
}: {
  preview: SectionPreview
  active: boolean
  played?: boolean
  previewKey?: string
  onDeviceComplete?: (key: string) => void
}) {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const device = preview.device
  const [frame, setFrame] = useState(() =>
    device
      ? (deviceFrames[device][played || reducedMotion ? deviceFrames[device].length - 1 : 0] ?? 0)
      : 0,
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active && !reducedMotion) void video.play().catch(() => undefined)
    else video.pause()
  }, [active, reducedMotion, preview])

  useEffect(() => {
    if (!device || played || reducedMotion || !active) return
    const frames = deviceFrames[device]
    const images = frames.map((index) => {
      const image = new Image()
      image.src = framePath(device, index)
      return image
    })
    let cancelled = false
    let timer: number | undefined

    // Wait for every frame to decode before swapping image sources on screen.
    void Promise.all(images.map((image) => image.decode())).then(
      () => {
        if (cancelled) return
        let position = 0
        timer = window.setInterval(() => {
          position += 1
          setFrame(frames[position] ?? frames[frames.length - 1] ?? 0)
          if (position === frames.length - 1) {
            window.clearInterval(timer)
            if (previewKey) onDeviceComplete?.(previewKey)
          }
        }, 95)
      },
      () => {
        if (cancelled) return
        setFrame(frames[frames.length - 1] ?? 0)
        if (previewKey) onDeviceComplete?.(previewKey)
      },
    )
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [active, device, onDeviceComplete, played, previewKey, reducedMotion])

  if (preview.visual) return null
  if (device) {
    return (
      <img
        className={styles.deviceFrame}
        src={framePath(
          device,
          reducedMotion || played
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
