'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { deserializeParticleConfig, type SerializedParticleConfig } from './serialize'
import type { Config } from '../particleMark/config'

// Small live preview of a saved particle preset, used inside Made-in-Lab
// cards. Renders the same Renderer the full tool uses, but with density
// clamped low so many thumbs can run side-by-side. Mounts lazily via
// IntersectionObserver — off-screen cards don't spin up a WebGL context
// until they scroll into view, so a long list of presets stays cheap.

const Renderer = dynamic(() => import('../particleMark/Renderer'), { ssr: false })

// Density used inside thumbnails. Cheap enough that a dozen+ live previews
// can share the GPU without dropping frames, dense enough that the shape of
// the mark still reads at 200×120.
const THUMB_DENSITY = 4000

export function PresetThumb({ serialized }: { serialized: SerializedParticleConfig }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState<Config | null>(null)

  // Lazy mount — once intersecting, stay mounted (no remount thrash on scroll).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin: '120px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const base = deserializeParticleConfig(serialized)
    setConfig({ ...base, density: THUMB_DENSITY })
    return () => {
      if (base.imageUrl) URL.revokeObjectURL(base.imageUrl)
    }
  }, [visible, serialized])

  const bg = useMemo(() => serialized.backgroundColor, [serialized.backgroundColor])

  return (
    <div
      ref={containerRef}
      className="relative h-[120px] w-full overflow-hidden rounded-md"
      style={{ background: bg }}
    >
      {/* pointer-events-none so the parent Link receives clicks instead of
          the canvas swallowing them for hover dispersion. */}
      {config && (
        <div className="pointer-events-none absolute inset-0">
          <Renderer config={config} />
        </div>
      )}
    </div>
  )
}
