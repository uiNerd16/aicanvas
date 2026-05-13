'use client'

// 60K Particles — LAB tool
// Two-pane layout: live preview (left, DOM first) + control sidebar (right).
// Source order matches visual order so hydration doesn't flash from one to the
// other when the dynamically-imported Canvas mounts.

import { useCallback, useMemo, useState } from 'react'
import Renderer from '../_lib/particleMark/Renderer'
import {
  type Config,
  type ColorMode,
  type Idle,
  type HoverArea,
  type Spring,
  type Light,
  type Depth,
  DEFAULT_CONFIG,
  BG_PRESETS,
} from '../_lib/particleMark/config'
import { generateTSX } from '../_lib/particleMark/codeGen'
import { PLACEHOLDER_SVG } from '../_lib/particleMark/svgSampler'
import { SectionLabel } from '../_lib/particleMark/controls/SectionLabel'
import { Segmented } from '../_lib/particleMark/controls/Segmented'
import { Slider } from '../_lib/particleMark/controls/Slider'
import { ColorInput } from '../_lib/particleMark/controls/ColorInput'
import { FileDrop } from '../_lib/particleMark/controls/FileDrop'
import { CircleHalfTilt, Sun, Prohibit } from '@phosphor-icons/react'

// Phosphor icons for the Light Direction segmented control. Each icon depicts
// a sphere shaded as if the light were coming from that direction — much more
// semantically accurate than plain directional arrows.
const LIGHT_ICONS: Record<Light, React.ReactNode> = {
  'Top-Right': <CircleHalfTilt size={16} weight="regular" />,
  'Top-Left':  <CircleHalfTilt size={16} weight="regular" className="-scale-x-100" />,
  'Center':    <Sun            size={16} weight="regular" />,
  'None':      <Prohibit       size={16} weight="regular" />,
}

const COLOR_MODE_OPTIONS: readonly ColorMode[]   = ['Original', 'Mono'] as const
const IDLE_OPTIONS:      readonly Idle[]         = ['Still', 'Calm', 'Lively', 'Frantic'] as const
const HOVER_OPTIONS:     readonly HoverArea[]    = ['Small', 'Medium', 'Large'] as const
const SPRING_OPTIONS:    readonly Spring[]       = ['Stiff', 'Smooth', 'Bouncy'] as const
const LIGHT_OPTIONS:     readonly Light[]        = ['Top-Right', 'Top-Left', 'Center', 'None'] as const
const DEPTH_OPTIONS:     readonly Depth[]        = ['Flat', 'Subtle', '3D'] as const

export default function ParticleMarkLabPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)
  const [copied, setCopied] = useState(false)

  const update = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }, [])

  // File handling — read SVG into string state.
  const onSvgFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      if (!text.trim().startsWith('<')) return
      setConfig((prev) => ({ ...prev, svgSource: text, svgFileName: file.name }))
    }
    reader.readAsText(file)
  }, [])

  const onClearSvg = useCallback(() => {
    setConfig((prev) => ({ ...prev, svgSource: null, svgFileName: null }))
  }, [])

  // Copy code to clipboard.
  const onCopy = useCallback(async () => {
    const svg = config.svgSource ?? PLACEHOLDER_SVG
    const tsx = generateTSX(config, svg)
    try {
      await navigator.clipboard.writeText(tsx)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can fail outside secure contexts — fall back to a manual copy.
      const ta = document.createElement('textarea')
      ta.value = tsx
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* swallow */ }
      ta.remove()
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [config])

  // The renderer rebuilds geometry whenever density/depth/svg changes — these
  // are the inputs that require a resample. Everything else updates uniforms
  // in place.
  const rendererConfig = useMemo(() => config, [config])

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .particle-mark-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: var(--color-sand-300);
          outline: none;
        }
        .dark .particle-mark-slider {
          background: var(--color-sand-700);
        }
        .particle-mark-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-sand-50);
          border: 1px solid var(--color-sand-400);
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .dark .particle-mark-slider::-webkit-slider-thumb {
          background: var(--color-sand-100);
          border-color: var(--color-sand-600);
        }
        .particle-mark-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-sand-50);
          border: 1px solid var(--color-sand-400);
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .particle-mark-slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `,
        }}
      />

      <main className="flex min-h-0 flex-1 flex-col bg-sand-200 dark:bg-sand-950">
        {/* Edge-to-edge two-pane: full-height canvas (left) + compact controls
            rail (right). Height comes from flex-1 chain — no fragile calc(). */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* ── Preview ───────────────────────────────────────────────────
              Full-height, edge-to-edge canvas. No toolbar — Copy code lives
              at the bottom of the controls panel. */}
          <section className="flex w-full flex-col overflow-hidden md:min-w-0 md:flex-1">
            <CanvasArea config={rendererConfig} onFile={onSvgFile} />
          </section>

          {/* ── Controls ──────────────────────────────────────────────────
              Right rail. On desktop it owns its own scroll so the canvas
              stays pinned. Compact spacing, no dividers. */}
          <aside className="w-full shrink-0 border-t border-sand-300 px-5 py-6 dark:border-sand-800 md:w-[340px] md:overflow-y-auto md:border-l md:border-t-0 md:px-5 md:py-6">
            <header className="mb-5">
              <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50">
                60K Particles
              </h1>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sand-500 dark:text-sand-500">
                Turn any SVG into interactive particles
              </p>
            </header>

            <div className="space-y-5">
              {/* SOURCE */}
              <section>
                <SectionLabel>Source</SectionLabel>
                <FileDrop
                  accept="image/svg+xml"
                  onFile={onSvgFile}
                  fileName={config.svgFileName}
                  onClear={onClearSvg}
                />
              </section>

              <Slider
                label="Density"
                value={config.density}
                min={2000}
                max={60000}
                step={1000}
                onChange={(v) => update('density', v)}
                format={(v) => v.toLocaleString()}
              />

              <Slider
                label="Particle Size"
                value={config.particleSize}
                min={2}
                max={12}
                step={0.5}
                onChange={(v) => update('particleSize', v)}
                format={(v) => v.toFixed(1)}
              />

              <Slider
                label="Mark Size"
                value={config.markSize}
                min={1}
                max={4}
                step={0.05}
                onChange={(v) => update('markSize', v)}
                format={(v) => v.toFixed(2)}
              />

{/* COLORS */}
              <section>
                <SectionLabel>Colors</SectionLabel>
                <Segmented
                  options={COLOR_MODE_OPTIONS}
                  value={config.colorMode}
                  onChange={(v) => update('colorMode', v)}
                />
                {config.colorMode === 'Mono' && (
                  <div className="mt-3 flex items-center gap-2">
                    <ColorInput
                      variant="swatch"
                      appearance="solid"
                      value={config.monoColor}
                      onChange={(v) => update('monoColor', v)}
                    />
                    <span className="font-mono text-xs text-sand-700 dark:text-sand-300">
                      {config.monoColor.toUpperCase()}
                    </span>
                  </div>
                )}
              </section>

{/* BACKGROUND */}
              <section>
                <SectionLabel>Background</SectionLabel>
                <div className="flex flex-wrap items-center gap-2">
                  {BG_PRESETS.map((hex) => {
                    const active = config.backgroundColor.toLowerCase() === hex.toLowerCase()
                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => update('backgroundColor', hex)}
                        title={hex}
                        aria-label={`Use ${hex} as background`}
                        className={`h-7 w-7 rounded-full border transition-all ${
                          active
                            ? 'border-olive-500 ring-2 ring-olive-500/40'
                            : 'border-sand-400 hover:scale-110 dark:border-sand-700'
                        }`}
                        style={{ background: hex }}
                      />
                    )
                  })}
                  <ColorInput
                    variant="swatch"
                    active={
                      !BG_PRESETS.some(
                        (p) => p.toLowerCase() === config.backgroundColor.toLowerCase(),
                      )
                    }
                    value={config.backgroundColor}
                    onChange={(v) => update('backgroundColor', v)}
                  />
                </div>
              </section>

{/* IDLE MOTION */}
              <section>
                <SectionLabel>Idle Motion</SectionLabel>
                <Segmented
                  options={IDLE_OPTIONS}
                  value={config.idle}
                  onChange={(v) => update('idle', v)}
                />
              </section>

{/* HOVER AREA */}
              <section>
                <SectionLabel>Hover Area</SectionLabel>
                <Segmented
                  options={HOVER_OPTIONS}
                  value={config.hoverArea}
                  onChange={(v) => update('hoverArea', v)}
                />
              </section>

              <Slider
                label="Hover Strength"
                value={config.hoverStrength}
                min={0}
                max={2}
                step={0.05}
                onChange={(v) => update('hoverStrength', v)}
                format={(v) => v.toFixed(2)}
              />

{/* RETURN SPRING */}
              <section>
                <SectionLabel>Return Spring</SectionLabel>
                <Segmented
                  options={SPRING_OPTIONS}
                  value={config.spring}
                  onChange={(v) => update('spring', v)}
                />
              </section>

{/* LIGHT DIRECTION */}
              <section>
                <SectionLabel>Light Direction</SectionLabel>
                <Segmented
                  options={LIGHT_OPTIONS}
                  value={config.light}
                  onChange={(v) => update('light', v)}
                  renderOption={(opt) => LIGHT_ICONS[opt]}
                />
              </section>

              <Slider
                label="Highlight Strength"
                value={config.highlightStrength}
                min={0}
                max={0.5}
                step={0.025}
                disabled={config.light === 'None'}
                onChange={(v) => update('highlightStrength', v)}
                format={(v) => v.toFixed(3)}
              />

{/* DEPTH */}
              <section>
                <SectionLabel>Depth</SectionLabel>
                <Segmented
                  options={DEPTH_OPTIONS}
                  value={config.depth}
                  onChange={(v) => update('depth', v)}
                />
              </section>

              {/* EXPORT — flush with bottom, no divider above */}
              <section className="pt-2">
                <SectionLabel>Export</SectionLabel>
                <button
                  type="button"
                  onClick={onCopy}
                  className="w-full rounded-md bg-olive-500 px-3 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-600"
                >
                  {copied ? 'Copied ✓' : 'Copy code (TSX)'}
                </button>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}

// Wraps the renderer with a drop zone that covers the canvas area so files
// dropped on the preview also load.
function CanvasArea({
  config,
  onFile,
}: {
  config: Config
  onFile: (file: File) => void
}) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
      className="relative h-[60vh] min-h-[420px] w-full md:h-auto md:min-h-0 md:flex-1"
    >
      <Renderer config={config} />
      {dragOver && (
        <div className="pointer-events-none absolute inset-2 flex items-center justify-center rounded-lg border-2 border-dashed border-olive-500 bg-olive-500/10 text-sm font-semibold text-olive-500 dark:text-olive-400">
          Drop SVG to load
        </div>
      )}
    </div>
  )
}

