'use client'

// Snapshot the WebGL canvas to a downloadable image. Both formats are
// lossless: PNG by definition, WebP at quality 1.0 (the spec's lossless
// mode). Files are produced from the canvas's current pixel buffer, so
// the snapshot matches exactly what you see on screen — no encoder
// artefacts, no colour-space squash.

export type ImageFormat = 'png' | 'webp'

export async function exportCanvasImage(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  filename: string,
): Promise<void> {
  const mime = format === 'png' ? 'image/png' : 'image/webp'
  // Spec: quality > 0.99 selects lossless WebP. Ignored for PNG.
  const quality = format === 'webp' ? 1.0 : undefined

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mime, quality)
  })
  if (!blob) throw new Error(`Failed to export ${format.toUpperCase()} from canvas`)

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
