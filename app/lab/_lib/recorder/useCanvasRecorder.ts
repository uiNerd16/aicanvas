'use client'

// Live canvas recording → MP4/H.264 via WebCodecs + mp4-muxer.
// Reusable across LAB tools — pass any HTMLCanvasElement to start().
// All work is local: no upload, no server, no API key.

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrayBufferTarget, Muxer } from 'mp4-muxer'

export type RecorderState = 'idle' | 'recording' | 'encoding'

export type RecorderOptions = {
  fps?: number
  filename?: string
  /**
   * Sample the live canvas into an offscreen 2D context and apply a small
   * saturation/contrast bump before encoding, to compensate for the H.264
   * encoder's BT.709 limited-range squash. Off by default — turn on if
   * recordings look duller than the live view.
   */
  colorBoost?: boolean
  /**
   * Auto-stop after this many milliseconds. Prevents runaway captures
   * that would eat all available RAM (every encoded chunk is held in
   * memory until finalize). Omit for no cap.
   */
  maxDurationMs?: number
}

type Session = {
  encoder: VideoEncoder
  muxer: Muxer<ArrayBufferTarget>
  target: ArrayBufferTarget
  rafId: number
  startTime: number
  frameIndex: number
  width: number
  height: number
  filename: string
  fps: number
  // Optional offscreen buffer for the colour-boost pass.
  boostCanvas: HTMLCanvasElement | null
  boostCtx: CanvasRenderingContext2D | null
}

type CodecContainer = 'avc' | 'hevc'
type RateControl =
  | { mode: 'quantizer'; quantizer: number }
  | { mode: 'variable'; bitrate: number }
type CodecChoice = {
  codec: string
  container: CodecContainer
  rate: RateControl
}

// Codec preference list. We prefer H.264 in quantizer mode (constant-quality)
// because the encoder can target a fixed visual quality (QP 18 ≈ near-
// lossless) and bitrate varies to suit — no DCT macroblock artifacts in flat
// dark regions, which is the killer for variable-bitrate particle content.
// HEVC quantizer mode isn't widely supported via WebCodecs yet, so for HEVC
// we use high variable bitrate. Final fallback: any working profile.
const H264_CODECS = [
  'avc1.640042', // High 6.2 — up to 8K
  'avc1.640034', // High 5.2 — 4K60
  'avc1.640033',
  'avc1.640032',
  'avc1.64002A', // 1080p60
  'avc1.640028',
  'avc1.4D0028', // Main 4.0
  'avc1.42E01F', // Baseline 3.1
] as const

const HEVC_CODECS = [
  'hvc1.1.6.L153.B0', // Main 5.1 — 4K60
  'hvc1.1.6.L150.B0',
  'hvc1.1.6.L120.B0',
  'hev1.1.6.L153.B0',
  'hev1.1.6.L120.B0',
] as const

// H.264 constant-quality target. 0 = lossless, 18 = near-lossless,
// 23 = good, 28 = acceptable. QP 18 hits the sweet spot for particle
// content: dark regions stay clean without ballooning file size.
const TARGET_QP = 18

/**
 * Resolution-aware variable bitrate. Used as a fallback (and for HEVC).
 * ~0.20 bpp for H.264, ~0.12 for HEVC. Clamped to [10, 100] Mbps.
 */
function computeBitrate(width: number, height: number, fps: number, container: CodecContainer) {
  const bpp = container === 'hevc' ? 0.12 : 0.20
  const target = Math.round(width * height * fps * bpp)
  return Math.min(100_000_000, Math.max(10_000_000, target))
}

async function probe(
  codec: string,
  width: number,
  height: number,
  framerate: number,
  rate: RateControl,
): Promise<boolean> {
  try {
    const cfg: VideoEncoderConfig = {
      codec,
      width,
      height,
      framerate,
      hardwareAcceleration: 'prefer-hardware',
      latencyMode: 'quality',
      bitrateMode: rate.mode,
    }
    if (rate.mode === 'variable') cfg.bitrate = rate.bitrate
    const { supported } = await VideoEncoder.isConfigSupported(cfg)
    return !!supported
  } catch {
    return false
  }
}

async function pickCodec(
  width: number,
  height: number,
  framerate: number,
): Promise<CodecChoice | null> {
  if (typeof VideoEncoder === 'undefined') return null

  // 1. Best-quality path: H.264 in quantizer mode → constant near-lossless.
  for (const codec of H264_CODECS) {
    if (await probe(codec, width, height, framerate, { mode: 'quantizer', quantizer: TARGET_QP })) {
      return { codec, container: 'avc', rate: { mode: 'quantizer', quantizer: TARGET_QP } }
    }
  }

  // 2. Fallback: HEVC variable @ high bitrate.
  const hevcBitrate = computeBitrate(width, height, framerate, 'hevc')
  for (const codec of HEVC_CODECS) {
    if (await probe(codec, width, height, framerate, { mode: 'variable', bitrate: hevcBitrate })) {
      return { codec, container: 'hevc', rate: { mode: 'variable', bitrate: hevcBitrate } }
    }
  }

  // 3. Last resort: H.264 variable @ high bitrate.
  const avcBitrate = computeBitrate(width, height, framerate, 'avc')
  for (const codec of H264_CODECS) {
    if (await probe(codec, width, height, framerate, { mode: 'variable', bitrate: avcBitrate })) {
      return { codec, container: 'avc', rate: { mode: 'variable', bitrate: avcBitrate } }
    }
  }
  return null
}

function isSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof VideoEncoder !== 'undefined' &&
    typeof VideoFrame !== 'undefined'
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

export type RecorderInfo = {
  codec: string
  container: CodecContainer
  width: number
  height: number
  /** Set when the encoder is running in variable-bitrate mode. */
  bitrateMbps?: number
  /** Set when the encoder is running in constant-quality (quantizer) mode. */
  quantizer?: number
}

export function useCanvasRecorder() {
  const [state, setState] = useState<RecorderState>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<RecorderInfo | null>(null)
  const sessionRef = useRef<Session | null>(null)
  const startingRef = useRef(false)
  const tickRef = useRef<number | null>(null)

  const cleanup = useCallback(() => {
    const s = sessionRef.current
    if (s) {
      cancelAnimationFrame(s.rafId)
      try { if (s.encoder.state !== 'closed') s.encoder.close() } catch { /* swallow */ }
      sessionRef.current = null
    }
    if (tickRef.current !== null) {
      cancelAnimationFrame(tickRef.current)
      tickRef.current = null
    }
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  const start = useCallback(
    async (canvas: HTMLCanvasElement, opts: RecorderOptions = {}) => {
      // Guards against (1) a second start while a session is live and
      // (2) a second start fired during the async setup window before
      // sessionRef is populated. Without the second guard a rapid double-
      // click on Record would create two encoders, leaking the first.
      if (sessionRef.current || startingRef.current) return
      startingRef.current = true
      setError(null)

      if (!isSupported()) {
        setError('Your browser does not support WebCodecs recording. Try Chrome, Edge, Safari 16.4+, or Firefox 130+.')
        startingRef.current = false
        return
      }

      const fps = opts.fps ?? 60
      const filename = opts.filename ?? `recording-${Date.now()}.mp4`
      const colorBoost = opts.colorBoost ?? false
      const maxDurationMs = opts.maxDurationMs ?? Infinity

      // Lock encoder dimensions to the canvas's actual pixel buffer so the
      // encoder never has to scale. Just round down to even numbers (H.264
      // refuses odd dimensions).
      const width = canvas.width - (canvas.width % 2)
      const height = canvas.height - (canvas.height % 2)
      if (width < 16 || height < 16) {
        setError(`Canvas is too small to record (${width}×${height}).`)
        startingRef.current = false
        return
      }

      const choice = await pickCodec(width, height, fps)
      if (!choice) {
        setError(`No supported H.264/HEVC profile for ${width}×${height} on this browser.`)
        startingRef.current = false
        return
      }

      // Optional colour-boost offscreen canvas. Re-draws the source canvas
      // with a small saturation/contrast bump via CSS filter to claw back
      // the punch that BT.709 limited-range encoding takes away.
      let boostCanvas: HTMLCanvasElement | null = null
      let boostCtx: CanvasRenderingContext2D | null = null
      if (colorBoost) {
        boostCanvas = document.createElement('canvas')
        boostCanvas.width = width
        boostCanvas.height = height
        boostCtx = boostCanvas.getContext('2d', { alpha: false, colorSpace: 'srgb' })
        if (boostCtx) boostCtx.filter = 'saturate(1.18) contrast(1.08)'
      }

      const target = new ArrayBufferTarget()
      const muxer = new Muxer({
        target,
        video: { codec: choice.container, width, height, frameRate: fps },
        fastStart: 'in-memory',
        firstTimestampBehavior: 'offset',
      })

      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => {
          setError(e.message || String(e))
          cleanup()
          setState('idle')
        },
      })
      const encoderConfig: VideoEncoderConfig = {
        codec: choice.codec,
        width,
        height,
        framerate: fps,
        bitrateMode: choice.rate.mode,
        hardwareAcceleration: 'prefer-hardware',
        latencyMode: 'quality',
      }
      if (choice.rate.mode === 'variable') {
        encoderConfig.bitrate = choice.rate.bitrate
      }
      encoder.configure(encoderConfig)

      const startTime = performance.now()
      const session: Session = {
        encoder,
        muxer,
        target,
        rafId: 0,
        startTime,
        frameIndex: 0,
        width,
        height,
        filename,
        fps,
        boostCanvas,
        boostCtx,
      }

      const captureFrame = () => {
        const s = sessionRef.current
        if (!s || s.encoder.state !== 'configured') return

        // Backpressure: skip frame if encoder is falling behind.
        if (s.encoder.encodeQueueSize > 4) {
          s.rafId = requestAnimationFrame(captureFrame)
          return
        }

        // Canvas may have been removed / resized — bail rather than throw.
        if (!canvas.isConnected) {
          s.rafId = requestAnimationFrame(captureFrame)
          return
        }

        const timestampUs = Math.round((performance.now() - s.startTime) * 1000)
        try {
          // Force the WebGL pipeline to settle before we read the buffer.
          // Without this, the compositor can occasionally hand us a stale
          // or mid-resolve GPU texture — most visible when the canvas's
          // clear-colour matches a nearby DOM background (e.g. #1A1A19,
          // shared with the page wrapper), where the optimizer is more
          // willing to short-circuit and a bright neighbouring texture
          // bleeds in as a single-frame flash.
          const gl =
            (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
            (canvas.getContext('webgl') as WebGLRenderingContext | null)
          gl?.finish()

          // If colour-boost is on, draw the WebGL canvas through a 2D
          // context that applies a saturation/contrast bump, then capture
          // that. Otherwise capture the WebGL canvas directly.
          let source: HTMLCanvasElement = canvas
          if (s.boostCtx && s.boostCanvas) {
            s.boostCtx.drawImage(canvas, 0, 0, s.width, s.height)
            source = s.boostCanvas
          }
          const frame = new VideoFrame(source, { timestamp: timestampUs })
          // Always keyframe every 1s of footage so the file is seekable.
          const keyFrame = s.frameIndex % s.fps === 0
          // In quantizer mode pass the per-frame QP via the codec-specific
          // option. Cast through unknown because the TS lib types haven't
          // caught up with the spec extension yet (avc.quantizer / hevc.quantizer).
          const encodeOpts: VideoEncoderEncodeOptions = { keyFrame }
          if (choice.rate.mode === 'quantizer') {
            const q = choice.rate.quantizer
            if (choice.container === 'avc') {
              ;(encodeOpts as unknown as { avc?: { quantizer: number } }).avc = { quantizer: q }
            } else {
              ;(encodeOpts as unknown as { hevc?: { quantizer: number } }).hevc = { quantizer: q }
            }
          }
          s.encoder.encode(frame, encodeOpts)
          frame.close()
          s.frameIndex += 1
        } catch (err) {
          // Most common cause: canvas dimensions changed mid-record. Skip frame.
          // eslint-disable-next-line no-console
          console.warn('[recorder] frame capture failed', err)
        }
        s.rafId = requestAnimationFrame(captureFrame)
      }

      sessionRef.current = session
      session.rafId = requestAnimationFrame(captureFrame)

      // Elapsed-time ticker, decoupled from the capture loop so the UI
      // updates even when frames are throttled. Also enforces the duration
      // cap by triggering stop() once the elapsed time crosses the limit —
      // stop is captured via closure (it's a sibling useCallback below).
      const tick = () => {
        const s = sessionRef.current
        if (!s) return
        const elapsed = performance.now() - s.startTime
        setElapsedMs(elapsed)
        if (elapsed >= maxDurationMs) {
          void stop()
          return
        }
        tickRef.current = requestAnimationFrame(tick)
      }
      tickRef.current = requestAnimationFrame(tick)

      setElapsedMs(0)
      setInfo({
        codec: choice.codec,
        container: choice.container,
        width,
        height,
        bitrateMbps:
          choice.rate.mode === 'variable' ? Math.round(choice.rate.bitrate / 1_000_000) : undefined,
        quantizer: choice.rate.mode === 'quantizer' ? choice.rate.quantizer : undefined,
      })
      setState('recording')
      startingRef.current = false
    },
    [cleanup],
  )

  const stop = useCallback(async () => {
    const s = sessionRef.current
    if (!s) return
    cancelAnimationFrame(s.rafId)
    if (tickRef.current !== null) {
      cancelAnimationFrame(tickRef.current)
      tickRef.current = null
    }
    setState('encoding')
    try {
      await s.encoder.flush()
      s.encoder.close()
      s.muxer.finalize()
      const blob = new Blob([s.target.buffer], { type: 'video/mp4' })
      triggerDownload(blob, s.filename)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      sessionRef.current = null
      setState('idle')
    }
  }, [])

  return {
    state,
    elapsedMs,
    error,
    info,
    supported: typeof window !== 'undefined' && isSupported(),
    start,
    stop,
  }
}
