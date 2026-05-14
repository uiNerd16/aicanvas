// 60K Particles — SVG → particle sampler
// Renders any SVG to an offscreen canvas via <img> + data URL (so all fills,
// gradients, strokes, and embedded styles work — not just hardcoded paths),
// then for each requested particle picks a random opaque pixel and returns its
// world-space position + RGB colour sampled from that pixel.

export interface SamplerResult {
  positions: Float32Array
  colors: Float32Array
  sourceAspect: number // height / width
}

const TARGET_LONG_EDGE = 1600          // px on the longer side of the offscreen canvas
const DEFAULT_WORLD_LONG_EDGE = 2.6    // default world units on the longer side
const PADDING_PCT = 0.06               // 6% padding around the silhouette
const Z_JITTER_BASE = 1       // multiplied by config Z jitter at sample time

const EMPTY: SamplerResult = {
  positions: new Float32Array(0),
  colors: new Float32Array(0),
  sourceAspect: 1,
}

// Default placeholder — the AI Canvas mark itself. Kept inline so the sampler
// is self-contained and the preview is never empty before the user uploads.
export const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 28 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.8513 0C20.5626 0 21.2204 0.377823 21.5788 0.992258L22.75 3L27.4122 10.9923C27.7754 11.615 27.7754 12.385 27.4122 13.0077L22.75 21L21.5788 23.0077C21.2204 23.6222 20.5626 24 19.8513 24H8.14874C7.43741 24 6.7796 23.6222 6.42118 23.0077L0.587849 13.0077C0.224593 12.385 0.224593 11.615 0.58785 10.9923L6.42118 0.992257C6.7796 0.377822 7.43741 0 8.14874 0H19.8513ZM4 12L9 21H18.25L13 12L18.25 3H9L4 12Z" fill="url(#g)"/>
<path d="M9 21L4 12H13L18.25 21H9Z" fill="#1E1E1E"/>
<path d="M13 12H4L9 3H18.25L13 12Z" fill="#4F4F4C"/>
<defs><linearGradient id="g" x1="9" y1="3" x2="24.8756" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="#BECF5D"/><stop offset="1" stop-color="#92A143"/></linearGradient></defs>
</svg>`

// Load an SVG source string into an HTMLImageElement.
function loadSvgAsImage(svgSource: string): Promise<HTMLImageElement> {
  const blob = new Blob([svgSource], { type: 'image/svg+xml' })
  return loadBlobAsImage(blob)
}

// Load any binary image (Blob / File — PNG, JPEG, WebP, …) into an
// HTMLImageElement. Used for raster uploads alongside the SVG path.
function loadBlobAsImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.crossOrigin = 'anonymous'
    img.src = url
  })
}

// Read the intrinsic aspect (h/w) of the SVG. We trust the image's natural
// dimensions, which the browser computes from the viewBox or width/height.
function pickCanvasSize(img: HTMLImageElement): { cw: number; ch: number; aspect: number } {
  const iw = img.naturalWidth || img.width || 1
  const ih = img.naturalHeight || img.height || 1
  const aspect = ih / iw
  let cw: number
  let ch: number
  if (iw >= ih) {
    cw = TARGET_LONG_EDGE
    ch = Math.max(1, Math.round(TARGET_LONG_EDGE * aspect))
  } else {
    ch = TARGET_LONG_EDGE
    cw = Math.max(1, Math.round(TARGET_LONG_EDGE / aspect))
  }
  return { cw, ch, aspect }
}

/**
 * Sample `count` particles from an SVG source string.
 */
export async function sampleSvg(
  svgSource: string,
  count: number,
  zJitter: number = 0.05,
  worldLongEdge: number = DEFAULT_WORLD_LONG_EDGE,
): Promise<SamplerResult> {
  if (typeof document === 'undefined' || count <= 0) return EMPTY
  let img: HTMLImageElement
  try {
    img = await loadSvgAsImage(svgSource)
  } catch {
    return EMPTY
  }
  return sampleFromImage(img, count, zJitter, worldLongEdge)
}

/**
 * Sample `count` particles from a raster image (PNG / JPEG / WebP) Blob.
 * Same sampling logic as `sampleSvg` — the only difference is how the source
 * gets rasterized.
 */
export async function sampleImage(
  blob: Blob,
  count: number,
  zJitter: number = 0.05,
  worldLongEdge: number = DEFAULT_WORLD_LONG_EDGE,
): Promise<SamplerResult> {
  if (typeof document === 'undefined' || count <= 0) return EMPTY
  let img: HTMLImageElement
  try {
    img = await loadBlobAsImage(blob)
  } catch {
    return EMPTY
  }
  return sampleFromImage(img, count, zJitter, worldLongEdge)
}

async function sampleFromImage(
  img: HTMLImageElement,
  count: number,
  zJitter: number,
  worldLongEdge: number,
): Promise<SamplerResult> {
  const { cw, ch, aspect } = pickCanvasSize(img)

  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return EMPTY

  // Centred draw with PADDING_PCT around the silhouette.
  const drawW = cw * (1 - 2 * PADDING_PCT)
  const drawH = ch * (1 - 2 * PADDING_PCT)
  // The image already has the right aspect, so we can size to fit the smaller
  // inner box and centre it.
  const fitScale = Math.min(drawW / cw, drawH / ch)
  const finalW = cw * fitScale
  const finalH = ch * fitScale
  const ox = (cw - finalW) / 2
  const oy = (ch - finalH) / 2

  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, ox, oy, finalW, finalH)

  const data = ctx.getImageData(0, 0, cw, ch).data

  // Index of every opaque pixel.
  const opaque: number[] = []
  const total = cw * ch
  for (let i = 0; i < total; i++) {
    if (data[i * 4 + 3] > 128) opaque.push(i)
  }

  if (opaque.length === 0) return { ...EMPTY, sourceAspect: aspect }

  // World extents — longer side = worldLongEdge, shorter side scaled by aspect.
  const worldW = cw >= ch ? worldLongEdge : worldLongEdge / aspect
  const worldH = cw >= ch ? worldLongEdge * aspect : worldLongEdge

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const pixelIdx = opaque[(Math.random() * opaque.length) | 0]
    const px = pixelIdx % cw
    const py = (pixelIdx / cw) | 0

    positions[i * 3]     = (px / cw - 0.5) * worldW
    positions[i * 3 + 1] = -((py / ch) - 0.5) * worldH
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * zJitter * Z_JITTER_BASE

    const ci = pixelIdx * 4
    colors[i * 3]     = data[ci]     / 255
    colors[i * 3 + 1] = data[ci + 1] / 255
    colors[i * 3 + 2] = data[ci + 2] / 255
  }

  return { positions, colors, sourceAspect: aspect }
}
