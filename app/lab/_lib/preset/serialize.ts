// Serialize / deserialize a lab tool's Config to a JSON-safe shape for
// localStorage round-trips (auth gate state preservation) and DB persistence
// (saved presets). Non-serializable values like File objects and object URLs
// are converted to base64 data URLs and rebuilt on restore.
//
// Per-tool serializers wrap this — different tools have different Config
// shapes. 60K Particles is the only one wired in v1.

import type { Config as ParticleConfig } from '../particleMark/config'

// Max base64 image size we'll inline into a preset / localStorage handoff.
// 4MB raw → ~5.4MB base64. Anything bigger gets silently dropped (we keep
// the filename so the UI can tell the user they need to re-upload).
const MAX_INLINE_BYTES = 4 * 1024 * 1024

export type SerializedParticleConfig = {
  // Source
  svgSource: string | null
  svgFileName: string | null
  imageDataUrl: string | null   // base64 data URL of the raster, or null if too large
  imageMimeType: string | null

  // Tune
  density: number
  particleSize: number
  markSize: number
  colorMode: ParticleConfig['colorMode']
  monoColor: string
  backgroundColor: string
  idle: ParticleConfig['idle']
  hoverArea: ParticleConfig['hoverArea']
  hoverStrength: number
  spring: ParticleConfig['spring']
  light: ParticleConfig['light']
  highlightStrength: number
  depth: ParticleConfig['depth']
}

export async function serializeParticleConfig(
  config: ParticleConfig,
): Promise<SerializedParticleConfig> {
  let imageDataUrl: string | null = null
  let imageMimeType: string | null = null

  if (config.imageFile && config.imageFile.size <= MAX_INLINE_BYTES) {
    imageDataUrl = await fileToDataUrl(config.imageFile)
    imageMimeType = config.imageFile.type || null
  }

  return {
    svgSource: config.svgSource,
    svgFileName: config.svgFileName,
    imageDataUrl,
    imageMimeType,
    density: config.density,
    particleSize: config.particleSize,
    markSize: config.markSize,
    colorMode: config.colorMode,
    monoColor: config.monoColor,
    backgroundColor: config.backgroundColor,
    idle: config.idle,
    hoverArea: config.hoverArea,
    hoverStrength: config.hoverStrength,
    spring: config.spring,
    light: config.light,
    highlightStrength: config.highlightStrength,
    depth: config.depth,
  }
}

export function deserializeParticleConfig(
  serialized: SerializedParticleConfig,
): ParticleConfig {
  let imageFile: File | null = null
  let imageUrl: string | null = null

  if (serialized.imageDataUrl && serialized.svgFileName) {
    const blob = dataUrlToBlob(serialized.imageDataUrl, serialized.imageMimeType ?? 'image/png')
    imageFile = new File([blob], serialized.svgFileName, {
      type: serialized.imageMimeType ?? 'image/png',
    })
    imageUrl = URL.createObjectURL(blob)
  }

  return {
    svgSource: serialized.svgSource,
    svgFileName: serialized.svgFileName,
    imageFile,
    imageUrl,
    density: serialized.density,
    particleSize: serialized.particleSize,
    markSize: serialized.markSize,
    colorMode: serialized.colorMode,
    monoColor: serialized.monoColor,
    backgroundColor: serialized.backgroundColor,
    idle: serialized.idle,
    hoverArea: serialized.hoverArea,
    hoverStrength: serialized.hoverStrength,
    spring: serialized.spring,
    light: serialized.light,
    highlightStrength: serialized.highlightStrength,
    depth: serialized.depth,
  }
}

// Compact text summary shown on preset cards in the Made-in-Lab tab —
// gives the user a sense of the tune without rendering the canvas.
export function summarizeParticleConfig(c: SerializedParticleConfig): string {
  const bits: string[] = []
  bits.push(`${c.density.toLocaleString()} particles`)
  bits.push(`size ${c.particleSize.toFixed(1)}`)
  if (c.colorMode === 'Mono') bits.push(c.monoColor.toUpperCase())
  bits.push(c.backgroundColor.toUpperCase())
  return bits.join(' · ')
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function dataUrlToBlob(dataUrl: string, fallbackMime: string): Blob {
  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl)
  if (!match) return new Blob([], { type: fallbackMime })
  const mime = match[1] || fallbackMime
  const binary = atob(match[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}
