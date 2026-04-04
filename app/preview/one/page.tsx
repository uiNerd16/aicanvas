'use client'

import { GlassMusicPlayer } from '../../../components-workspace/glass-music-player'

export default function PreviewOnePage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-sand-950">
      <div data-card-theme className="dark" style={{ width: 480, height: 600 }}>
        <GlassMusicPlayer />
      </div>
    </div>
  )
}
