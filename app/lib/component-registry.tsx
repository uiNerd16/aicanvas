import type { ComponentType } from 'react'
import type { Tag, Platform } from '../components/ComponentCard'
import FloatingCards from '../../components-workspace/floating-cards'
import { prompts as floatingCardsPrompts } from '../../components-workspace/floating-cards/prompts'
import TextBlurReveal from '../../components-workspace/text-blur-reveal'
import { prompts as textBlurRevealPrompts } from '../../components-workspace/text-blur-reveal/prompts'
import ParticleSphere from '../../components-workspace/particle-sphere'
import PolaroidStack from '../../components-workspace/polaroid-stack'
import { prompts as polaroidStackPrompts } from '../../components-workspace/polaroid-stack/prompts'
import GlitchButton from '../../components-workspace/glitch-button'
import { prompts as glitchButtonPrompts } from '../../components-workspace/glitch-button/prompts'
import FlipCalendar from '../../components-workspace/flip-calendar'
import { prompts as flipCalendarPrompts } from '../../components-workspace/flip-calendar/prompts'
import RunwayLoader from '../../components-workspace/runway-loader'
import { prompts as runwayLoaderPrompts } from '../../components-workspace/runway-loader/prompts'
import ChargingWidget from '../../components-workspace/charging-widget'
import { prompts as chargingWidgetPrompts } from '../../components-workspace/charging-widget/prompts'
import InteractiveDotGrid from '../../components-workspace/dot-grid'
import { prompts as dotGridPrompts } from '../../components-workspace/dot-grid/prompts'
import RadialToolbar from '../../components-workspace/radial-toolbar'
import { prompts as radialToolbarPrompts } from '../../components-workspace/radial-toolbar/prompts'
import XGrid from '../../components-workspace/x-grid'
import { prompts as xGridPrompts } from '../../components-workspace/x-grid/prompts'
import BlindPullToggle from '../../components-workspace/blind-pull-toggle'
import { prompts as blindPullTogglePrompts } from '../../components-workspace/blind-pull-toggle/prompts'
import PillToggle from '../../components-workspace/pill-toggle'
import { prompts as pillTogglePrompts } from '../../components-workspace/pill-toggle/prompts'
import MarkToggle from '../../components-workspace/mark-toggle'
import { prompts as markTogglePrompts } from '../../components-workspace/mark-toggle/prompts'
import TagaToggle from '../../components-workspace/taga-toggle'
import { prompts as tagaTogglePrompts } from '../../components-workspace/taga-toggle/prompts'
import NoiseBg from '../../components-workspace/noise-bg'
import { prompts as noiseBgPrompts } from '../../components-workspace/noise-bg/prompts'
import BubbleField from '../../components-workspace/bubble-field'
import { prompts as bubbleFieldPrompts } from '../../components-workspace/bubble-field/prompts'
import GridLines from '../../components-workspace/grid-lines'
import { prompts as gridLinesPrompts } from '../../components-workspace/grid-lines/prompts'
import DistortionGrid from '../../components-workspace/distortion-grid'
import { prompts as distortionGridPrompts } from '../../components-workspace/distortion-grid/prompts'
import WaveLines from '../../components-workspace/wave-lines'
import { prompts as waveLinesPrompts } from '../../components-workspace/wave-lines/prompts'
import SphereLines from '../../components-workspace/sphere-lines'
import { prompts as sphereLinesPrompts } from '../../components-workspace/sphere-lines/prompts'
import MagneticDots from '../../components-workspace/magnetic-dots'
import { prompts as magneticDotsPrompts } from '../../components-workspace/magnetic-dots/prompts'
import ParticleConstellation from '../../components-workspace/particle-constellation'
import { prompts as particleConstellationPrompts } from '../../components-workspace/particle-constellation/prompts'
import ScrambleText from '../../components-workspace/scramble-text'
import { prompts as scrambleTextPrompts } from '../../components-workspace/scramble-text/prompts'
import NeonClock from '../../components-workspace/neon-clock'
import { prompts as neonClockPrompts } from '../../components-workspace/neon-clock/prompts'
import NoiseField from '../../components-workspace/noise-field'
import { prompts as noiseFieldPrompts } from '../../components-workspace/noise-field/prompts'
import EmojiBurst from '../../components-workspace/emoji-burst'
import { prompts as emojiBurstPrompts } from '../../components-workspace/emoji-burst/prompts'
import GlassNavbar from '../../components-workspace/glass-navbar'
import { prompts as glassNavbarPrompts } from '../../components-workspace/glass-navbar/prompts'
import GlassTabBar from '../../components-workspace/glass-tab-bar'
import { prompts as glassTabBarPrompts } from '../../components-workspace/glass-tab-bar/prompts'
import GlassTags from '../../components-workspace/glass-tags'
import { prompts as glassTagsPrompts } from '../../components-workspace/glass-tags/prompts'
import GlassCard from '../../components-workspace/glass-card'
import { prompts as glassCardPrompts } from '../../components-workspace/glass-card/prompts'
import GlassModal from '../../components-workspace/glass-modal'
import { prompts as glassModalPrompts } from '../../components-workspace/glass-modal/prompts'
import GlassDock from '../../components-workspace/glass-dock'
import { prompts as glassDockPrompts } from '../../components-workspace/glass-dock/prompts'
import GlassSlider from '../../components-workspace/glass-slider'
import { prompts as glassSliderPrompts } from '../../components-workspace/glass-slider/prompts'
import GlassToggle from '../../components-workspace/glass-toggle'
import { prompts as glassTogglePrompts } from '../../components-workspace/glass-toggle/prompts'
import GlassMusicPlayer from '../../components-workspace/glass-music-player'
import { prompts as glassMusicPlayerPrompts } from '../../components-workspace/glass-music-player/prompts'
import GlassNotification from '../../components-workspace/glass-notification'
import { prompts as glassNotificationPrompts } from '../../components-workspace/glass-notification/prompts'
import GlassSidebar from '../../components-workspace/glass-sidebar'
import { prompts as glassSidebarPrompts } from '../../components-workspace/glass-sidebar/prompts'
import GlassUserMenu from '../../components-workspace/glass-user-menu'
import { prompts as glassUserMenuPrompts } from '../../components-workspace/glass-user-menu/prompts'
import GlassToast from '../../components-workspace/glass-toast'
import { prompts as glassToastPrompts } from '../../components-workspace/glass-toast/prompts'
import GlassSearchBar from '../../components-workspace/glass-search-bar'
import { prompts as glassSearchBarPrompts } from '../../components-workspace/glass-search-bar/prompts'
import GlassStepper from '../../components-workspace/glass-stepper'
import { prompts as glassStepperPrompts } from '../../components-workspace/glass-stepper/prompts'
import GlassProgress from '../../components-workspace/glass-progress'
import { prompts as glassProgressPrompts } from '../../components-workspace/glass-progress/prompts'
import GlassAiCompose from '../../components-workspace/glass-ai-compose'
import { prompts as glassAiComposePrompts } from '../../components-workspace/glass-ai-compose/prompts'
import AndromedaButton from '../../components-workspace/andromeda-button'
import { prompts as andromedaButtonPrompts } from '../../components-workspace/andromeda-button/prompts'
import AvatarPicker from '../../components-workspace/avatar-picker'
import { prompts as avatarPickerPrompts } from '../../components-workspace/avatar-picker/prompts'
import TaskCards from '../../components-workspace/task-cards'
import { prompts as taskCardsPrompts } from '../../components-workspace/task-cards/prompts'
import SlideDeck from '../../components-workspace/slide-deck'
import { prompts as slideDeckPrompts } from '../../components-workspace/slide-deck/prompts'
import LabelCards from '../../components-workspace/label-cards'
import { prompts as labelCardsPrompts } from '../../components-workspace/label-cards/prompts'
import AiJobCards from '../../components-workspace/ai-job-cards'
import { prompts as aiJobCardsPrompts } from '../../components-workspace/ai-job-cards/prompts'
import DangerStripes from '../../components-workspace/danger-stripes'
import { prompts as dangerStripesPrompts } from '../../components-workspace/danger-stripes/prompts'
import StickerWall from '../../components-workspace/sticker-wall'
import { prompts as stickerWallPrompts } from '../../components-workspace/sticker-wall/prompts'
import PeelCornerReveal from '../../components-workspace/peel-corner-reveal'
import { prompts as peelCornerRevealPrompts } from '../../components-workspace/peel-corner-reveal/prompts'
import JarOfEmotions from '../../components-workspace/jar-of-emotions'
import { prompts as jarOfEmotionsPrompts } from '../../components-workspace/jar-of-emotions/prompts'
import ResponsiveLetters from '../../components-workspace/responsive-letters'
import { prompts as responsiveLettersPrompts } from '../../components-workspace/responsive-letters/prompts'
import GoodVibes from '../../components-workspace/good-vibes'
import { prompts as goodVibesPrompts } from '../../components-workspace/good-vibes/prompts'
import Playful from '../../components-workspace/playful'
import { prompts as playfulPrompts } from '../../components-workspace/playful/prompts'
import WildMorph from '../../components-workspace/wild-morph'
import { prompts as wildMorphPrompts } from '../../components-workspace/wild-morph/prompts'
import Orbit from '../../components-workspace/orbit'
import { prompts as orbitPrompts } from '../../components-workspace/orbit/prompts'
import HaloType from '../../components-workspace/halo-type'
import { prompts as haloTypePrompts } from '../../components-workspace/halo-type/prompts'
import SliceType from '../../components-workspace/slice-type'
import { prompts as sliceTypePrompts } from '../../components-workspace/slice-type/prompts'
import StackTower from '../../components-workspace/stack-tower'
import { prompts as stackTowerPrompts } from '../../components-workspace/stack-tower/prompts'
import RippleType from '../../components-workspace/ripple-type'
import { prompts as rippleTypePrompts } from '../../components-workspace/ripple-type/prompts'
import RadialCards from '../../components-workspace/radial-cards'
import { prompts as radialCardsPrompts } from '../../components-workspace/radial-cards/prompts'
import NewProjectModal from '../../components-workspace/new-project-modal'
import { prompts as newProjectModalPrompts } from '../../components-workspace/new-project-modal/prompts'
import VoiceChatPill from '../../components-workspace/voice-chat-pill'
import { prompts as voiceChatPillPrompts } from '../../components-workspace/voice-chat-pill/prompts'
import UploadProgress from '../../components-workspace/upload-progress'
import { prompts as uploadProgressPrompts } from '../../components-workspace/upload-progress/prompts'
import { componentCodes } from './component-codes.generated'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComponentEntry {
  slug: string
  name: string
  description: string
  tags: Tag[]
  image?: string
  badge?: string
  dualTheme?: boolean
  PreviewComponent: ComponentType
  code: string
  prompts: Partial<Record<Platform, string>>
}

// Serializable subset of ComponentEntry — pass this across the
// server/client boundary when you don't need PreviewComponent / code / prompts
// (related grid, prev/next nav, etc).
export type ComponentMeta = Pick<
  ComponentEntry,
  'slug' | 'name' | 'description' | 'tags' | 'image' | 'badge'
>


// Code strings are now auto-generated from source files — see component-codes.generated.ts

const COMPONENTS_RAW: ComponentEntry[] = [
  {
    slug: 'wave-lines',
    image: 'https://ik.imagekit.io/aitoolkit/wave-lines.png',
    name: 'Wave Lines',
    description: 'Dense vertical lines that ripple across the canvas — two layered sine waves create organic bunching and breathing. Hover to send the lines into extreme waves across the whole canvas.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: WaveLines,
    code: componentCodes['wave-lines'],
    prompts: waveLinesPrompts,
  },
  {
    slug: 'distortion-grid',
    image: 'https://ik.imagekit.io/aitoolkit/distortion-grid.png',
    name: 'Distortion Grid',
    description: 'A canvas grid of thin lines that slowly undulate with large sweeping waves. Hovering repels the grid fabric outward from the cursor, amplifying the distortion across the entire canvas.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: DistortionGrid,
    code: componentCodes['distortion-grid'],
    prompts: distortionGridPrompts,
  },
  {
    slug: 'grid-lines',
    image: 'https://ik.imagekit.io/aitoolkit/grid-lines.png?v=3',
    name: 'Grid Lines',
    description: 'A dot grid connected by thin lines. On hover, a radial wave pulses outward from the cursor, illuminating lines and dots as it spreads.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: GridLines,
    code: componentCodes['grid-lines'],
    prompts: gridLinesPrompts,
  },
  {
    slug: 'bubble-field',
    image: 'https://ik.imagekit.io/aitoolkit/bubble-field.png?v=2',
    name: 'Bubble Field',
    description: 'A grid of outline circles that burst on hover — each expanding and fading like a soap bubble popping, then reforming, with a soft pastel blue palette.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: BubbleField,
    code: componentCodes['bubble-field'],
    prompts: bubbleFieldPrompts,
  },
  {
    slug: 'noise-bg',
    image: 'https://ik.imagekit.io/aitoolkit/noise-bg.png',
    name: 'Noise Background',
    description: 'A canvas-based grain background of randomly scattered dots that illuminate with a soft Gaussian glow and organic connection lines on hover.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: NoiseBg,
    code: componentCodes['noise-bg'],
    prompts: noiseBgPrompts,
  },
  {
    slug: 'pill-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/pill-toggle.png',
    name: 'Pill Toggle',
    description: 'A minimal iOS-style slider toggle — thumb glides between off (grey) and on (green) with a snappy spring. Fully responsive.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: PillToggle,
    code: componentCodes['pill-toggle'],
    prompts: pillTogglePrompts,
  },
  {
    slug: 'mark-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/mark-toggle.png',
    name: 'Mark Toggle',
    description: 'An iOS-style pill toggle in warm earth and sand tones — the thumb carries a small icon that morphs from X to checkmark as it slides across.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: MarkToggle,
    code: componentCodes['mark-toggle'],
    prompts: markTogglePrompts,
  },
  {
    slug: 'taga-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/taga-toggle.png',
    name: 'Taga Toggle',
    description: 'A playful pill toggle with an expressive face on the thumb — dead (×× eyes, flat mouth) when off, happy (arc eyes, big smile) when on. Track warms from grey to yellow.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: TagaToggle,
    code: componentCodes['taga-toggle'],
    prompts: tagaTogglePrompts,
  },
  {
    slug: 'blind-pull-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/blind-pull-toggle.png',
    name: 'Blind Pull Toggle',
    description: 'A dark/light mode toggle styled as a window-blind pull cord — click to yank the cord and watch the icon swap through a venetian-blind slat animation.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: BlindPullToggle,
    code: componentCodes['blind-pull-toggle'],
    prompts: blindPullTogglePrompts,
  },
  {
    slug: 'x-grid',
    image: 'https://ik.imagekit.io/aitoolkit/x-grid.png',
    name: 'X Grid',
    description: 'A canvas-based interactive background of × marks that illuminate and connect to neighbours with constellation lines on hover.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: XGrid,
    code: componentCodes['x-grid'],
    prompts: xGridPrompts,
  },
  {
    slug: 'radial-toolbar',
    image: 'https://ik.imagekit.io/aitoolkit/radial-toolbar.png',
    name: 'Radial Toolbar',
    description: 'A radial context menu that fans out formatting tools around a centre button, with active toggle states and an animated label pill.',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Framer Motion' },
      { label: 'SVG' },
    ],
    dualTheme: true,
    PreviewComponent: RadialToolbar,
    code: componentCodes['radial-toolbar'],
    prompts: radialToolbarPrompts,
  },
  {
    slug: 'dot-grid',
    image: 'https://ik.imagekit.io/aitoolkit/dot-grid.png',
    name: 'Dot Grid',
    description:
      'A canvas-based dot grid background where hovering illuminates nearby dots with a smooth radial glow and organic fade.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: InteractiveDotGrid,
    code: componentCodes['dot-grid'],
    prompts: dotGridPrompts,
  },
  {
    slug: 'charging-widget',
    image: 'https://ik.imagekit.io/aitoolkit/charging-widget.png',
    name: 'Charging Widget',
    description:
      'Circular battery indicator with animated liquid waves that rise as the percentage counts up, looping continuously.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'SVG' },
    ],
    dualTheme: true,
    PreviewComponent: ChargingWidget,
    code: componentCodes['charging-widget'],
    prompts: chargingWidgetPrompts,
  },
  {
    slug: 'runway-loader',
    image: 'https://ik.imagekit.io/aitoolkit/runway-loader.png',
    name: 'Runway Loader',
    description: 'An airplane taxis down a runway progress bar, nose tilting up and taking off at 100%.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    PreviewComponent: RunwayLoader,
    code: componentCodes['runway-loader'],
    prompts: runwayLoaderPrompts,
  },
  {
    slug: 'flip-calendar',
    image: 'https://ik.imagekit.io/aitoolkit/flip-calendar.png',
    name: 'Flip Calendar',
    description: 'A desk-calendar widget showing dates 1–31 with a satisfying flip-clock page-turn animation.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: FlipCalendar,
    code: componentCodes['flip-calendar'],
    prompts: flipCalendarPrompts,
  },
  {
    slug: 'glitch-button',
    image: 'https://ik.imagekit.io/aitoolkit/glitch-button.png',
    name: 'Glitch Button',
    description: 'A terminal-inspired button with a text scramble glitch effect on hover.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Terminal' },
    ],
    dualTheme: true,
    PreviewComponent: GlitchButton,
    code: componentCodes['glitch-button'],
    prompts: glitchButtonPrompts,
  },
  {
    slug: 'traveldeck',
    image: 'https://ik.imagekit.io/aitoolkit/floating-cards.png?v=3',
    name: 'Travel Deck',
    description:
      'A swipeable deck of destination cards. Drag the front card down to send it to the back — each card reveals an animated hotels counter as it comes forward.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: FloatingCards,
    code: componentCodes['floating-cards'],
    prompts: floatingCardsPrompts,
  },
  {
    slug: 'text-blur-reveal',
    image: 'https://ik.imagekit.io/aitoolkit/text-blur-reveal.png',
    name: 'Text Blur Reveal',
    description:
      'Words animate into view one by one with a satisfying blur-to-sharp entrance, auto-replaying in a loop.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: TextBlurReveal,
    code: componentCodes['text-blur-reveal'],
    prompts: textBlurRevealPrompts,
  },
  {
    slug: 'particle-sphere',
    image: 'https://ik.imagekit.io/aitoolkit/particle-sphere.png',
    name: 'Particle Sphere',
    description:
      '9,000 particles arranged on a sphere with warm gold and cool silver tones, slowly spinning in Three.js.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Three.js' },
    ],
    PreviewComponent: ParticleSphere,
    code: componentCodes['particle-sphere'],
    prompts: {
      'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create a new file called ParticleSphere.tsx. It should export a React client component that renders an animated 3D particle sphere using Three.js.

Requirements:
- 'use client' at the top
- Import useEffect, useRef from react; import * as THREE from 'three'
- PARTICLE_COUNT = 9000
- makeSprite(): creates a 64×64 canvas with radial white→transparent gradient, returns THREE.CanvasTexture
- colorFromY(ny): returns [r,g,b] — ny≥0: warm gold [1, 0.55+ny*0.37, ny*0.63]; ny<0: silver [v,v,v+...] where v=0.38+(-ny)*0.62
- useEffect: create scene, PerspectiveCamera(52, W/H, 0.1, 100), camera.position.z=2.9
- WebGLRenderer, setClearColor(0x000000), appendChild to container div
- Fill positions/colors Float32Arrays using spherical coords (acos(2*rand-1), 2π*rand) with r±0.07 jitter
- BufferGeometry with position + color attributes
- PointsMaterial: size 0.032, map=sprite, vertexColors, transparent, depthWrite false, blending THREE.AdditiveBlending
- mesh.rotation.x=0.28, mesh.rotation.z=0.08 (tilt)
- RAF loop: t+=0.004/frame, mesh.rotation.y=t, z wobble via sin
- Cleanup: cancelAnimationFrame, dispose geo/mat/sprite/renderer, removeChild
- Return: <div ref={containerRef} className="h-full w-full" />`,
      'Lovable': `Create a new file called ParticleSphere.tsx. It should export a React client component that renders an animated 3D particle sphere using Three.js.

Requirements:
- 'use client' at the top
- Import useEffect, useRef from react; import * as THREE from 'three'
- PARTICLE_COUNT = 9000
- makeSprite(): creates a 64×64 canvas with radial white→transparent gradient, returns THREE.CanvasTexture
- colorFromY(ny): returns [r,g,b] — ny≥0: warm gold [1, 0.55+ny*0.37, ny*0.63]; ny<0: silver [v,v,v+...] where v=0.38+(-ny)*0.62
- useEffect: create scene, PerspectiveCamera(52, W/H, 0.1, 100), camera.position.z=2.9
- WebGLRenderer, setClearColor(0x000000), appendChild to container div
- Fill positions/colors Float32Arrays using spherical coords (acos(2*rand-1), 2π*rand) with r±0.07 jitter
- BufferGeometry with position + color attributes
- PointsMaterial: size 0.032, map=sprite, vertexColors, transparent, depthWrite false, blending THREE.AdditiveBlending
- mesh.rotation.x=0.28, mesh.rotation.z=0.08 (tilt)
- RAF loop: t+=0.004/frame, mesh.rotation.y=t, z wobble via sin
- Cleanup: cancelAnimationFrame, dispose geo/mat/sprite/renderer, removeChild
- Return: <div ref={containerRef} className="h-full w-full" />`,
      'V0': `Create a ParticleSphere component using React and Three.js. Render 9,000 particles distributed uniformly across a sphere surface using spherical coordinates (theta = acos(2*rand-1), phi = 2π*rand). Add slight radial jitter (r = 1 ± 0.07) for volumetric depth. Color each particle by its normalised Y position: upper hemisphere → warm gold-to-orange (rgb 1.0, 0.55+t*0.37, t*0.63), lower hemisphere → cool white-to-silver (v = 0.38+t*0.62). Use THREE.PointsMaterial with AdditiveBlending, a soft radial glow sprite as the map, and depthWrite: false. Tilt the mesh (rotation.x=0.28, rotation.z=0.08) and animate rotation.y continuously. Black background. TypeScript + 'use client'.`,
    },
  },
  {
    slug: 'polaroid-stack',
    image: 'https://ik.imagekit.io/aitoolkit/polaroid-stack.png',
    name: 'Polaroid Stack',
    description:
      'Five polaroid photo cards stacked in a casual pile — click to fan them out in a spring-animated arc, hover to lift, click a card to spotlight it.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: PolaroidStack,
    code: componentCodes['polaroid-stack'],
    prompts: polaroidStackPrompts,
  },
  {
    slug: 'sphere-lines',
    image: 'https://ik.imagekit.io/aitoolkit/sphere-lines.png',
    name: 'Living Sphere',
    description: 'A wire-frame globe that breathes on its own — a narrow wave band drifts quietly across the surface. Hover to ripple the lines right where your cursor lands.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: SphereLines,
    code: componentCodes['sphere-lines'],
    prompts: sphereLinesPrompts,
  },
  {
    slug: 'magnetic-dots',
    image: 'https://ik.imagekit.io/aitoolkit/magnetic-dots.png',
    name: 'Magnetic Dots',
    description: 'A dense grid of dots that get magnetically pulled toward the cursor, snapping back with a satisfying elastic bounce when you leave.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: MagneticDots,
    code: componentCodes['magnetic-dots'],
    prompts: magneticDotsPrompts,
  },
  {
    slug: 'particle-constellation',
    image: 'https://ik.imagekit.io/aitoolkit/particle-constellation.png?v=2',
    name: 'Spider Web',
    description: 'An organic silk web that breathes with a slow idle bow. Hover to physically push the nodes — each intersection bounces back with tension, fading the strings near your cursor.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: ParticleConstellation,
    code: componentCodes['particle-constellation'],
    prompts: particleConstellationPrompts,
  },
  {
    slug: 'scramble-text',
    image: 'https://ik.imagekit.io/aitoolkit/scramble-text.png?v=3',
    name: 'Encrypted Text',
    description: 'Two words scramble continuously in a pixel cipher. Hover the container to decrypt them one by one — mouse out and they snap back to noise.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
    ],
    dualTheme: false,
    PreviewComponent: ScrambleText,
    code: componentCodes['scramble-text'],
    prompts: scrambleTextPrompts,
  },
  {
    slug: 'neon-clock',
    image: 'https://ik.imagekit.io/aitoolkit/neon-clock.png?v=9',
    name: 'LCD Clock',
    description: 'A retro 7-segment LCD clock with pixel-grid overlay. Shows live HH:MM:SS with blinking colon, AM/PM indicator, day of week row, and full date.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Clock' },
      { label: 'Interactive' },
    ],
    PreviewComponent: NeonClock,
    code: componentCodes['neon-clock'],
    prompts: neonClockPrompts,
  },
  {
    slug: 'noise-field',
    image: 'https://ik.imagekit.io/aitoolkit/noise-field.png',
    name: 'Noise Field',
    description: 'A grid of flowing arrows driven by layered sine-wave noise — like wind mapped on a weather chart. Hover to create a swirling vortex at the cursor.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: NoiseField,
    code: componentCodes['noise-field'],
    prompts: noiseFieldPrompts,
  },
  {
    slug: 'emoji-burst',
    image: 'https://ik.imagekit.io/aitoolkit/emoji-burst.png',
    name: 'Emoji Burst',
    description: 'A button that explodes emojis outward in all directions. Five emoji sets cycle on each click.',
    tags: [{ label: 'Buttons & Toggles', accent: true }, { label: 'Interactive' }, { label: 'Animation' }],
    dualTheme: true,
    PreviewComponent: EmojiBurst,
    code: componentCodes['emoji-burst'],
    prompts: emojiBurstPrompts,
  },
  {
    slug: 'glass-navbar',
    image: 'https://ik.imagekit.io/aitoolkit/glass-navbar.png',
    name: 'Glass Navbar',
    description: "Frosted glass navigation bar with animated active tab indicator, ambient color blobs, and spring-physics entrance.",
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassNavbar,
    code: componentCodes['glass-navbar'],
    prompts: glassNavbarPrompts,
  },
  {
    slug: 'glass-tab-bar',
    image: 'https://ik.imagekit.io/aitoolkit/glass-tab-bar.png?updatedAt=1775974874535',
    name: 'Glass Tab Bar',
    description: "Frosted glass pill tab bar with a sliding active indicator. Edge tabs snap flush to the container wall.",
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Mobile' },
    ],
    PreviewComponent: GlassTabBar,
    code: componentCodes['glass-tab-bar'],
    prompts: glassTabBarPrompts,
  },
  {
    slug: 'glass-tags',
    image: 'https://ik.imagekit.io/aitoolkit/glass-tags.png',
    name: 'Glass Tags',
    description: "Selectable pill-shaped tags with glass surfaces, unique color accents, and spring-animated check marks.",
    tags: [
      { label: 'Notifications', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassTags,
    code: componentCodes['glass-tags'],
    prompts: glassTagsPrompts,
  },
  {
    slug: 'glass-card',
    image: 'https://ik.imagekit.io/aitoolkit/glass-card.png?updatedAt=1775460137',
    name: 'Glass Card',
    description: "Glassmorphism content cards with 3D tilt-on-hover, spring physics, and a cursor-following glare highlight.",
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Glass', accent: true },
      { label: '3D' },
    ],
    PreviewComponent: GlassCard,
    code: componentCodes['glass-card'],
    prompts: glassCardPrompts,
  },
  {
    slug: 'glass-modal',
    image: 'https://ik.imagekit.io/aitoolkit/glass-modal.png',
    name: 'Glass Modal',
    description: "Centered dialog with deep glass blur, scale-spring entrance, and staggered content reveal.",
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassModal,
    code: componentCodes['glass-modal'],
    prompts: glassModalPrompts,
  },
  {
    slug: 'glass-dock',
    name: 'Glass Dock',
    description: "Glassmorphism macOS-style dock with cursor-proximity magnification. Icons scale with spring physics as the mouse approaches.",
    image: 'https://ik.imagekit.io/aitoolkit/glass-dock.png?updatedAt=1775599200',
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassDock,
    code: componentCodes['glass-dock'],
    prompts: glassDockPrompts,
  },
  {
    slug: 'glass-slider',
    name: 'Glass Slider',
    description: "Range sliders with glass tracks, glowing colored fills, and spring-animated thumbs that scale on drag.",
    image: 'https://ik.imagekit.io/aitoolkit/glass-slider.png',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassSlider,
    code: componentCodes['glass-slider'],
    prompts: glassSliderPrompts,
  },
  {
    slug: 'glass-toggle',
    name: 'Glass Toggle',
    description: "On/off toggles with glass housing and liquid-feel spring animation. Track color transitions smoothly.",
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    image: 'https://ik.imagekit.io/aitoolkit/glass-toggle.png',
    PreviewComponent: GlassToggle,
    code: componentCodes['glass-toggle'],
    prompts: glassTogglePrompts,
  },
  {
    slug: 'glass-music-player',
    image: 'https://ik.imagekit.io/aitoolkit/glass-music-player.png',
    name: 'Glass Music Player',
    description: "Mini music player with glass surface, spinning vinyl art, animated progress bar, and ambient glow.",
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassMusicPlayer,
    code: componentCodes['glass-music-player'],
    prompts: glassMusicPlayerPrompts,
  },
  {
    slug: 'glass-notification',
    image: 'https://ik.imagekit.io/aitoolkit/glass-notification.png',
    name: 'Glass Notifications',
    description: "Swipe-to-dismiss notification stack with glass cards and spring-animated layout transitions.",
    tags: [
      { label: 'Notifications', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassNotification,
    code: componentCodes['glass-notification'],
    prompts: glassNotificationPrompts,
  },
  {
    slug: 'glass-sidebar',
    image: 'https://ik.imagekit.io/aitoolkit/glass-sidebar.png?updatedAt=1775460137',
    name: 'Glass Sidebar',
    description: 'Collapsible glassmorphism sidebar with icon-only and full label states, spring-animated expand and collapse.',
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: GlassSidebar,
    code: componentCodes['glass-sidebar'],
    prompts: glassSidebarPrompts,
  },
  {
    slug: 'glass-user-menu',
    name: 'Glass User Menu',
    description: 'Frosted glass user avatar trigger with animated dropdown, grouped menu items, and Log Out.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-user-menu.png?updatedAt=1775834492638',
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassUserMenu,
    code: componentCodes['glass-user-menu'],
    prompts: glassUserMenuPrompts,
  },
  {
    slug: 'glass-toast',
    name: 'Glass Toast',
    description: 'Frosted glassmorphism toast notification stack with 4 variants, auto-dismiss progress bar, and spring-animated stacking.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-toast.png?updatedAt=1775460137',
    tags: [
      { label: 'Notifications', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassToast,
    code: componentCodes['glass-toast'],
    prompts: glassToastPrompts,
  },
  {
    slug: 'glass-search-bar',
    name: 'Glass Search Bar',
    description: 'Glassmorphism search bar with animated suggestion dropdown, active state glow, and reduced-motion support.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-search-bar.png',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassSearchBar,
    code: componentCodes['glass-search-bar'],
    prompts: glassSearchBarPrompts,
  },
  {
    slug: 'glass-stepper',
    name: 'Glass Stepper',
    description: 'Glassmorphism numeric stepper with spring number flip, notification-style tinted buttons, and configurable min/max/step.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-stepper.png',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassStepper,
    code: componentCodes['glass-stepper'],
    prompts: glassStepperPrompts,
  },
  {
    slug: 'glass-progress',
    name: 'Glass Progress',
    description: 'Glassmorphism progress bar panel with glowing gradient fills, spring-animated counters, staggered reveal, and replay button.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-progress.png',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassProgress,
    code: componentCodes['glass-progress'],
    prompts: glassProgressPrompts,
  },
  {
    slug: 'glass-ai-compose',
    name: 'Glass AI Chat',
    description: 'Glassmorphism AI chat input with image upload, web search toggle, and model switcher.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-ai-compose.png',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassAiCompose,
    code: componentCodes['glass-ai-compose'],
    prompts: glassAiComposePrompts,
  },
  {
    slug: 'andromeda-button',
    name: 'Andromeda Button',
    description: 'A sci-fi / blueprint-aesthetic button with five variants (default, outline, ghost, destructive, link), three sizes (small, medium, large), optional leading icon, and full hover / focus / active / disabled state coverage. Transparent hairline surfaces sit on a near-black canvas, with an electric-blue accent that brightens and glows on interaction.',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda-button.png?updatedAt=1775998697243',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Andromeda' },
    ],
    PreviewComponent: AndromedaButton,
    code: componentCodes['andromeda-button'],
    prompts: andromedaButtonPrompts,
  },
  {
    slug: 'meet-the-crew',
    name: 'Meet the Crew',
    description: 'A swipeable portrait card stack perfect for introducing a team, showcasing crew members, or picking an avatar. Four stacked cards fan out with soft rotations — drag to browse, tap to choose. Drop in your own photos and names for an About Us section, a character selector, or an onboarding profile picker.',
    image: 'https://ik.imagekit.io/aitoolkit/meet-the-crew.png',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: AvatarPicker,
    code: componentCodes['avatar-picker'],
    prompts: avatarPickerPrompts,
  },
  {
    slug: 'task-cards',
    image: 'https://ik.imagekit.io/aitoolkit/task-cards.png',
    name: 'Task Cards',
    description: 'A swipeable project task card stack where each card has a unique accent colour, status badge, and due date. Drag left or right to cycle through tasks — springs back the dismissed card to the bottom of the deck.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: TaskCards,
    code: componentCodes['task-cards'],
    prompts: taskCardsPrompts,
  },
  {
    slug: 'slide-deck',
    name: 'Slide Deck',
    description: 'Swipeable card deck with four editorial slides. Navigate forward and back by drag or tap.',
    image: 'https://ik.imagekit.io/aitoolkit/slide-deck.png',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Interactive' },
      { label: 'Typography' },
    ],
    dualTheme: true,
    PreviewComponent: SlideDeck,
    code: componentCodes['slide-deck'],
    prompts: slideDeckPrompts,
  },
  {
    slug: 'label-cards',
    name: 'Label Cards',
    description: 'Colour-blocked label cards scattered at random angles. Tap one to spring it to centre.',
    image: 'https://ik.imagekit.io/aitoolkit/label-cards.png',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: LabelCards,
    code: componentCodes['label-cards'],
    prompts: labelCardsPrompts,
  },
  {
    slug: 'ai-job-cards',
    name: 'AI Job Cards',
    image: 'https://ik.imagekit.io/aitoolkit/ai-job-cards.png',
    description: 'Three AI job card stacks with swipe-to-cycle. Brand logos, bookmark toggle, springs.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: AiJobCards,
    code: componentCodes['ai-job-cards'],
    prompts: aiJobCardsPrompts,
  },
  {
    slug: 'danger-stripes',
    name: 'Danger Stripes',
    image: 'https://ik.imagekit.io/aitoolkit/danger-stripes.png?v=2',
    description: 'Three crossing caution-tape stripes on orange. Hover to shake, click to intensify.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: DangerStripes,
    code: componentCodes['danger-stripes'],
    prompts: dangerStripesPrompts,
  },
  {
    slug: 'sticker-wall',
    name: 'Sticker Wall',
    image: 'https://ik.imagekit.io/aitoolkit/sticker-wall.png',
    description: 'A draggable sticker card wall. Drop notes, toss emoji, pile them up with real 2D physics.',
    dualTheme: true,
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'Matter.js' },
    ],
    PreviewComponent: StickerWall,
    code: componentCodes['sticker-wall'],
    prompts: stickerWallPrompts,
  },
  {
    slug: 'peel-corner-reveal',
    name: 'Peel to Scan',
    image: 'https://ik.imagekit.io/aitoolkit/peel-corner-reveal.png',
    description: 'A portrait card whose corner peels on tap, revealing a scannable Wi-Fi QR code.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Framer Motion' },
      { label: 'SVG' },
    ],
    dualTheme: true,
    PreviewComponent: PeelCornerReveal,
    code: componentCodes['peel-corner-reveal'],
    prompts: peelCornerRevealPrompts,
  },
  {
    slug: 'jar-of-emotions',
    name: 'The Verdict Jar',
    image: 'https://ik.imagekit.io/aitoolkit/jar-of-emotions.png',
    description: 'Glass jar widget — click a reaction to spring the lid and watch the emoji bounce down.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Matter.js' },
    ],
    dualTheme: true,
    PreviewComponent: JarOfEmotions,
    code: componentCodes['jar-of-emotions'],
    prompts: jarOfEmotionsPrompts,
  },
  {
    slug: 'responsive-letters',
    name: 'Responsive Letters',
    description: 'Interactive text where each letter responds to cursor proximity, animating variable font properties (weight, stretch, italic, letter-spacing, skew) to create a deformation-under-pressure effect.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/responsive-letters.png',
    PreviewComponent: ResponsiveLetters,
    code: componentCodes['responsive-letters'],
    prompts: responsiveLettersPrompts,
  },
  {
    slug: 'good-vibes',
    name: 'Good Vibes',
    description: 'Interactive typography where letters scale 2x and become bold on hover.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/good-vibes.png?v=2',
    PreviewComponent: GoodVibes,
    code: componentCodes['good-vibes'],
    prompts: goodVibesPrompts,
  },
  {
    slug: 'playful',
    name: 'Playful',
    description: 'Kinetic typography where letters jump, drop, and rotate on cursor proximity.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/playful.png',
    PreviewComponent: Playful,
    code: componentCodes['playful'],
    prompts: playfulPrompts,
  },
  {
    slug: 'wild-morph',
    name: 'Wild Morph',
    description: 'Italic SVG word that warps under the cursor — a spring-physics text animation.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/wild-morph.png',
    PreviewComponent: WildMorph,
    code: componentCodes['wild-morph'],
    prompts: wildMorphPrompts,
  },
  {
    slug: 'orbit',
    name: 'Orbit',
    description: 'Kinetic text animation arranged in a circle. Hover slows the spin; letters push outward.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/orbit.png',
    PreviewComponent: Orbit,
    code: componentCodes['orbit'],
    prompts: orbitPrompts,
  },
  {
    slug: 'halo-type',
    name: 'Halo Type',
    description: 'Rotating 3D ring text animation — the front arc reads upright, the back arc upside-down.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Animation' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/halo-type.png',
    PreviewComponent: HaloType,
    code: componentCodes['halo-type'],
    prompts: haloTypePrompts,
  },
  {
    slug: 'slice-type',
    name: 'Slice Type',
    description: 'A typographic magic trick. At rest you read one ambiguous word; hover and it splits into two — LIGHT lifting up, NIGHT sinking down, the shared letters resolving into separate glyphs.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Animation' },
      { label: 'Interactive' },
    ],
    dualTheme: false,
    image: 'https://ik.imagekit.io/aitoolkit/slice-type.png?v=1',
    PreviewComponent: SliceType,
    code: componentCodes['slice-type'],
    prompts: sliceTypePrompts,
  },
  {
    slug: 'stack-tower',
    name: 'Stack Tower',
    description: 'A column of 12 stacked words that reads as a rotating 3D cylinder — 2D transforms skew, scale and shift each row so the rotation travels down the stack. Hover lights one row in warm orange without breaking the rhythm.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Animation' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/stack-tower.png?v=1',
    PreviewComponent: StackTower,
    code: componentCodes['stack-tower'],
    prompts: stackTowerPrompts,
  },
  {
    slug: 'ripple-type',
    name: 'Ripple Type',
    description: 'SVG text animation warped by a turbulence filter. Toggle the fan — letters ripple.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Animation' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/ripple-type.png?v=1',
    PreviewComponent: RippleType,
    code: componentCodes['ripple-type'],
    prompts: rippleTypePrompts,
  },
  {
    slug: 'radial-cards',
    name: 'Radial Cards',
    description: 'Seven health-metric cards bloom into a slowly rotating flower — tap any petal to pull it forward and read your stats up close.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Animation' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/radial-cards.png',
    PreviewComponent: RadialCards,
    code: componentCodes['radial-cards'],
    prompts: radialCardsPrompts,
  },
  {
    slug: 'new-project-modal',
    name: 'New Project Modal',
    description: 'A pill button that morphs into a soft-UI project creation form — title, description, 7-swatch color label picker, Private toggle, and a checkmark-confirm Create button.',
    tags: [
      { label: 'UI', accent: true },
      { label: 'Modal' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/new-projectmodal.png',
    PreviewComponent: NewProjectModal,
    code: componentCodes['new-project-modal'],
    prompts: newProjectModalPrompts,
  },
  {
    slug: 'voice-chat-pill',
    name: 'Live Session Pill',
    description: 'A compact live-session presence pill with an animated speaking indicator and overlapping avatars — clicks open a soft-UI modal showing all participants with a Join Now button.',
    tags: [
      { label: 'UI', accent: true },
      { label: 'Modal' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/voice-chat-pill.png?v=2026050501',
    PreviewComponent: VoiceChatPill,
    code: componentCodes['voice-chat-pill'],
    prompts: voiceChatPillPrompts,
  },
  {
    slug: 'upload-progress',
    name: 'Upload Progress',
    description: 'A collapsible file upload widget with a shimmer progress bar — indigo while uploading, amber on pause. Expand to see per-file rows with live progress, time remaining, and pause, resume, refresh, and stop controls.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Interactive' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    image: 'https://ik.imagekit.io/aitoolkit/upload-progress.png?v=3',
    PreviewComponent: UploadProgress,
    code: componentCodes['upload-progress'],
    prompts: uploadProgressPrompts,
  },
]

// Newest first — append new components at the bottom of COMPONENTS_RAW
export const COMPONENTS: ComponentEntry[] = [...COMPONENTS_RAW].reverse()

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getComponent(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug)
}
