// 60K Particles — Studio tool config
// Typed Config + default + segment value maps used by Renderer.tsx, codeGen.ts,
// and every control in controls/.

export type ColorMode = 'Original' | 'Mono'
export type Idle = 'Still' | 'Calm' | 'Lively' | 'Frantic'
export type HoverArea = 'Small' | 'Medium' | 'Large'
export type Spring = 'Stiff' | 'Smooth' | 'Bouncy'
export type Light = 'Top-Right' | 'Top-Left' | 'Center' | 'None'
export type Depth = 'Flat' | 'Subtle' | '3D'

export interface Config {
  // SOURCE
  svgSource: string | null
  svgFileName: string | null

  // DENSITY
  density: number

  // PARTICLE SIZE
  particleSize: number

  // MARK SIZE — world-space long edge of the rendered mark
  markSize: number

  // COLORS
  colorMode: ColorMode
  monoColor: string

  // BACKGROUND — single hex value, picked from presets or via the colour picker
  backgroundColor: string

  // IDLE MOTION
  idle: Idle

  // HOVER AREA
  hoverArea: HoverArea

  // HOVER STRENGTH
  hoverStrength: number

  // RETURN SPRING
  spring: Spring

  // LIGHT DIRECTION
  light: Light

  // HIGHLIGHT STRENGTH
  highlightStrength: number

  // DEPTH
  depth: Depth
}

export const DEFAULT_CONFIG: Config = {
  svgSource: null,
  svgFileName: null,
  density: 28000,
  particleSize: 5.5,
  markSize: 1.5,
  colorMode: 'Original',
  monoColor: '#A8B94D',
  backgroundColor: '#1A1A19',
  idle: 'Calm',
  hoverArea: 'Medium',
  hoverStrength: 1.4,
  spring: 'Smooth',
  light: 'Top-Right',
  highlightStrength: 0.25,
  depth: 'Subtle',
}

// ── Segment value maps ──────────────────────────────────────────────────────

export const IDLE_MAP: Record<Idle, { amp: number; freq: number }> = {
  Still:   { amp: 0,     freq: 0 },
  Calm:    { amp: 0.013, freq: 1.3 },
  Lively:  { amp: 0.025, freq: 1.8 },
  Frantic: { amp: 0.045, freq: 2.4 },
}

export const HOVER_AREA_MAP: Record<HoverArea, number> = {
  Small:  0.7,
  Medium: 1.2,
  Large:  1.8,
}

export const SPRING_MAP: Record<Spring, { stiffness: number; damping: number }> = {
  Stiff:  { stiffness: 280, damping: 32 },
  Smooth: { stiffness: 180, damping: 18 },
  Bouncy: { stiffness: 140, damping: 10 },
}

// Maps to integer light mode the fragment shader switches on.
// 0 = Top-Right, 1 = Top-Left, 2 = Center, 3 = None
export const LIGHT_MAP: Record<Light, number> = {
  'Top-Right': 0,
  'Top-Left':  1,
  'Center':    2,
  'None':      3,
}

export const DEPTH_MAP: Record<Depth, number> = {
  Flat:    0,
  Subtle:  0.05,
  '3D':    0.2,
}

// ── Background colour resolution (also used by Renderer for the canvas bg) ──

// Background presets shown as swatches. First entry is the implicit default
// (matches DEFAULT_CONFIG.backgroundColor). The trailing colour-picker trigger
// in the UI lets the user pick anything outside this palette.
export const BG_PRESETS: readonly string[] = [
  '#1A1A19', // dark default (was previously the "Default" segment value)
  '#FFFFFF', // pure white
  '#9E9E98', // mid sand
  '#A8B94D', // olive accent
  '#E869B7', // pink
  '#86DAD8', // teal
  '#383836', // deep sand
] as const
