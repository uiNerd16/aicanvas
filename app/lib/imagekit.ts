// ImageKit URL helper — appends transformation params for serve-time
// resize + WebP conversion. Non-ImageKit URLs pass through untouched.

type Preset = 'card' | 'detail'

const PRESETS: Record<Preset, string> = {
  // Homepage card thumbnails: ~400px display × 2 for retina
  card: 'w-800,q-85,f-auto',
  // Component detail / larger views: 2× a wider hero crop
  detail: 'w-1600,q-90,f-auto',
}

export function optimizeImageKitUrl(url: string, preset: Preset = 'card'): string {
  if (!url.includes('ik.imagekit.io')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}tr=${PRESETS[preset]}`
}
