import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Build a frosted glass display settings panel with four gradient sliders.

The panel floats centered over a blurred background image (use any dark atmospheric image). It has a frosted glass style: semi-transparent white background, backdrop blur, subtle white border, and a top edge highlight line.

Inside the panel, show four sliders labeled: Brightness, Contrast, Warmth, Saturation. Each slider has its own two-color gradient pair:
- Brightness: blue #5B8FF9 → purple #A78BFA
- Contrast: pink #FF6BF5 → red #FF6680
- Warmth: orange #FF7B54 → yellow #FFBE0B
- Saturation: teal #06D6A0 → blue #5B8FF9

Each slider shows the label on the left and the current numeric value on the right (in the color matching the thumb position). The track is a thin 5px rounded line. The fill uses the gradient for that slider. The thumb is a white circle with a colored ring that matches its exact position on the gradient (interpolated between the two colors).

On hover, the label brightens and the track lightens slightly. The thumb scales up with spring physics when dragging. Works on both mouse and touch.

The panel is responsive: full width on small screens with 16px side margins, max 360px wide.

Use Framer Motion for animations. Entrance animation: spring scale + fade.`,

  Bolt: `Create a GlassSlider React component with gradient-interpolated thumbs and hover effects.

PANEL: w-[calc(100%-32px)] max-w-[360px], rounded-3xl, px-7 py-8, gap-7 between sliders.
Style: background rgba(255,255,255,0.08), backdropFilter blur(24px) saturate(1.8), border rgba(255,255,255,0.1), boxShadow 0 8px 32px rgba(0,0,0,0.3).
Top edge: absolute left-7 right-7 top-0 h-[1px] linear-gradient white line.
Entrance: spring opacity+y+scale animation.

SLIDERS config:
{ label: 'Brightness', defaultValue: 72, colorA: '#5B8FF9', colorB: '#A78BFA' },
{ label: 'Contrast',   defaultValue: 45, colorA: '#FF6BF5', colorB: '#FF6680' },
{ label: 'Warmth',     defaultValue: 60, colorA: '#FF7B54', colorB: '#FFBE0B' },
{ label: 'Saturation', defaultValue: 55, colorA: '#06D6A0', colorB: '#5B8FF9' },

THUMB COLOR: Interpolate between colorA and colorB based on value/100 using hex channel lerp.

EACH SLIDER:
- Label row: label left (brightens on hover), value right (in thumbColor)
- Track: h-[5px] rounded-full touch-none, background rgba(255,255,255,0.08) → 0.14 on hover
- Fill: absolute left-0 top-0 h-full, gradient colorA→colorB, drop-shadow glow on hover
- Thumb: 44×44px touch target, 18×18px visible circle, bg-white, boxShadow 0 0 0 2.5px thumbColor
- Drag: onPointerDown → getBoundingClientRect → clamp 0-1 → setValue. useSpring scale 1→1.3

Use Framer Motion useMotionValue + useSpring for thumb scale.`,

  Lovable: `Make a beautiful frosted glass slider panel for display settings.

It should look like a floating card over a dark atmospheric background image. The card has a frosted glass effect — slightly transparent white, blurred background, thin white border.

Inside are four sliders: Brightness, Contrast, Warmth, and Saturation. Each one has its own color theme:
- Brightness goes from blue to purple
- Contrast goes from pink to red
- Warmth goes from orange to yellow
- Saturation goes from teal to blue

The slider track is a thin line. As you drag, the filled portion shows the gradient for that slider. The thumb (circle) changes color to match its exact position on the gradient — so at 50% it's the midpoint color, at 100% it's the end color.

Hovering a slider brightens the label and adds a soft glow to the fill. The thumb scales up with spring physics when dragging. Everything works on touch screens too — the thumb has a large 44×44px touch target.

The panel is responsive: max width 360px, shrinks on small screens with 16px side padding.

Use Framer Motion for smooth animations.`,

  'Claude Code': `Build GlassSlider component ('use client') — frosted glass display panel with 4 gradient sliders.

SLIDERS config:
{ label: 'Brightness', defaultValue: 72, colorA: '#5B8FF9', colorB: '#A78BFA' },
{ label: 'Contrast',   defaultValue: 45, colorA: '#FF6BF5', colorB: '#FF6680' },
{ label: 'Warmth',     defaultValue: 60, colorA: '#FF7B54', colorB: '#FFBE0B' },
{ label: 'Saturation', defaultValue: 55, colorA: '#06D6A0', colorB: '#5B8FF9' },

THUMB COLOR — interpolate colorA→colorB at value/100 via per-channel hex lerp:
function lerpHex(a, b, t) — parse r/g/b from each hex, lerp each channel, return hex string.

SLIDER COMPONENT:
- State: value (number), hovered (boolean)
- isDragging = useMotionValue(0)
- thumbScale = useSpring(useTransform(isDragging,[0,1],[1,1.3]),{stiffness:400,damping:20})
- onPointerDown: e.preventDefault(), isDragging.set(1), getBoundingClientRect on track ref,
  clamp+setValue, add pointermove/pointerup listeners on window, set(0) on up
- Track: h-[5px] touch-none rounded-full, bg transitions rgba(255,255,255,0.08)→0.14 on hover
- Fill: absolute inset-y-0 left-0, gradient colorA→colorB, drop-shadow glow on hover
- Thumb wrapper: 44×44px absolute centered at value%, scale=thumbScale, translate -50% -50%
- Thumb inner: 18×18px rounded-full bg-white, boxShadow: 0 0 0 2.5px thumbColor + drop shadow

PANEL: w-[calc(100%-32px)] max-w-[360px] rounded-3xl px-7 py-8 gap-7
Glass: bg rgba(255,255,255,0.08), backdropFilter blur(24px) saturate(1.8), border rgba(255,255,255,0.1)
Shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)
Top highlight: absolute left-7 right-7 top-0 h-[1px] gradient white line
Entrance: motion.div initial opacity:0 y:20 scale:0.96 → spring stiffness:200 damping:22`,

  Cursor: `Implement GlassSlider component with these exact specs:

STRUCTURE:
- Root: relative h-full w-full flex items-center justify-center overflow-hidden bg-sand-950
- Background img: absolute inset-0 object-cover opacity-60
- Panel: motion.div w-[calc(100%-32px)] max-w-[360px] rounded-3xl px-7 py-8 flex flex-col gap-7
- 4 Slider components inside

HEX LERP (thumb color interpolation):
Parse each color's r/g/b channels, lerp each by t=value/100, return hex string.

SLIDER INTERNALS:
isDragging = useMotionValue(0)
thumbScale = useSpring(useTransform(isDragging,[0,1],[1,1.3]),{stiffness:400,damping:20})
thumbColor = lerpHex(colorA, colorB, value/100)

Pointer handling:
- onPointerDown on track div: e.preventDefault(), isDragging.set(1)
- getBoundingClientRect, clamp (clientX-left)/width to 0-1, setValue(Math.round(t*100))
- window pointermove → same update, window pointerup → isDragging.set(0) + cleanup

TRACK: h-[5px] touch-none rounded-full relative w-full cursor-pointer
- bg: rgba(255,255,255,0.08), transitions to 0.14 on hover
FILL: absolute left-0 top-0 h-full rounded-full
- background: linear-gradient(90deg, colorA, colorB)
- filter: drop-shadow glow in thumbColor on hover
THUMB WRAPPER: absolute top-1/2 h-[44px] w-[44px] flex items-center justify-center
- style: left: value%, scale: thumbScale, translate: -50% -50%
THUMB INNER: h-[18px] w-[18px] rounded-full bg-white
- boxShadow: 0 0 0 2.5px thumbColor, 0 2px 10px thumbColor+66

PANEL GLASS STYLE:
background: rgba(255,255,255,0.08)
backdropFilter: blur(24px) saturate(1.8)
border: 1px solid rgba(255,255,255,0.1)
boxShadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)
Top highlight: absolute left-7 right-7 top-0 h-[1px] gradient white line`,
}
