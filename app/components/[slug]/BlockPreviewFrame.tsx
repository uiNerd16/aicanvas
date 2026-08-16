'use client'

import { useEffect, useRef, useState } from 'react'

// The viewport the block is laid out against, before scaling. Tailwind
// breakpoints are VIEWPORT-based, so this is the whole point of the iframe: a
// section-scale block mounted directly in the ~848px preview box resolves its
// md: rules and squeezes to min-content, while inside a frame of its own it
// lays out exactly the way it will on the buyer's desktop. 1440 is the width
// these blocks are designed against.
const FRAME_WIDTH = 1440

/**
 * The detail page's preview box for a full-width block.
 *
 * Loads the block's own /preview route in an iframe pinned to a real desktop
 * viewport, then CSS-scales that whole viewport down to fit the box. The frame
 * is sized to the box's aspect, so the scaled result covers it exactly: the
 * visitor sees the entire composition shrunk, never a crop of it, and never a
 * screenshot that stopped matching the component months ago.
 */
export function BlockPreviewFrame({
  slug,
  name,
  theme,
  reloadKey,
}: {
  slug: string
  name: string
  theme: 'dark' | 'light'
  /** Bumped by the refresh button; remounts the frame, restarting the block. */
  reloadKey: number
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ width: number; height: number } | null>(null)

  // Measured, not guessed: the box height is fixed by Tailwind (320 / 480) but
  // its width is fluid, and the scale has to follow every resize or the frame
  // stops covering the box.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setBox({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scale = box ? box.width / FRAME_WIDTH : 0
  // Frame-space height. Deriving it from the box aspect rather than fixing it
  // means no letterboxing at any window width, and the block still gets to pick
  // its own layout for the shape it is actually given.
  const frameHeight = box ? (box.height * FRAME_WIDTH) / box.width : 0

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden">
      {box && (
        <iframe
          // Reloads the document rather than nudging it: a block's entrance
          // animation and canvas init only run on a fresh load.
          key={reloadKey}
          src={`/preview/${slug}?frame=1&theme=${theme}`}
          title={`${name} preview`}
          loading="lazy"
          className="absolute top-0 left-0 border-0"
          style={{
            width: FRAME_WIDTH,
            height: frameHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      )}
    </div>
  )
}
