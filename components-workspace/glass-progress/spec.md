# Glass Progress Bar

**Slug:** glass-progress
**Description:** Frosted glassmorphism progress bar with glowing animated fill and spring transitions.

## Visual

- Frosted glass track (`rounded-full`) matching glass family aesthetic
- Glass track: `rgba(255,255,255,0.06)` bg, `rgba(255,255,255,0.1)` border, blur(24px) saturate(1.8) on separate layer, standard box shadow
- Fill bar: gradient using the variant color, `rounded-full`, with a soft glow (`drop-shadow`) matching the accent
- A subtle shimmer/pulse on the fill to give it life
- Optional label above: `text-[10px] font-semibold uppercase tracking-widest text-white/40 font-sans`
- Percentage readout on the right in the accent color
- Track height ~8px, compact and elegant
- Same pink flower ImageKit background at 60% opacity

## Behaviour

- Fill width animates with a spring transition when value changes
- Glow intensity scales with progress — brighter as it fills
- Optional `animated` mode: fill slowly pulses with a gentle opacity breathe
- Variant colors: blue `#3A86FF`, pink `#FF5C8A`, green `#06D6A0`, amber `#FFBE0B`

## Tech notes

- Props: `value` (0–100), `color`, `gradient`, `label` (optional), `animated` (boolean)
- Showcase: 4 progress bars stacked vertically — "Storage" 72% blue, "Upload" 45% pink, "Battery" 88% green, "Memory" 30% amber
- Each showcase bar auto-animates from 0 to its target value on mount
- Responsive 320px+, `font-sans` for all text
- All animations respect `useReducedMotion`
- Preview route: `/preview/two`
