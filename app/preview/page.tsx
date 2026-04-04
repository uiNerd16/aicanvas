'use client'

import { GlassWeatherWidget } from '../../components-workspace/glass-weather-widget'

export default function PreviewPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-sand-950">
      <GlassWeatherWidget />
    </div>
  )
}
