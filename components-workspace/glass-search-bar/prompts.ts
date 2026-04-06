import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a glass search bar component on a dark background with a full-bleed background image (an ethereal pink flower photo loaded from a URL, opacity 60%, object-cover).

The search bar is always visible in the center of the screen -- a frosted glass pill with a magnifying glass icon on the left, a text input with "Search components..." placeholder, and the whole bar sitting at 48px tall with rounded-3xl corners.

Default (inactive) state:
- The bar has a deep frosted glass look: blur 24px with saturation 1.8, very subtle white background (8% opacity), and a delicate white/10% border with an inset top highlight and shadow
- The MagnifyingGlass icon sits at white/50%, the placeholder text is white/30%, input text is white/90%
- Clicking or focusing the input activates the bar

Active state:
- A warm orange border glow appears around the bar (rgba 255,160,50 at 50% opacity as a 1.5px ring, plus a 20px ambient glow at 12% opacity), animated with spring physics (stiffness 400, damping 30)
- A frosted glass dropdown panel slides in below the bar with a spring animation (scale from 0.95, slide up 8px, blur from 4px, spring stiffness 350 damping 28)
- The dropdown has the same glass treatment as the bar, plus a subtle horizontal highlight line near its top

Dropdown content:
- A tiny section label ("Suggestions" when empty, "Results" when filtering) in uppercase tracking-widest at white/25%
- Three suggestion rows, each with a notification-style icon badge on the left, a label, and a "Clear" pill on the right
  - Audio visualizers: MusicNote icon, pink #FF5C8A
  - Documentation files: File icon, blue #3A86FF
  - Quick actions: Lightning icon, green #06D6A0
- Each icon badge is a 32px rounded-xl square with a softly tinted background (the item's color at very low opacity, hex + "18"), a subtle matching border (hex + "22"), and the icon drawn in the full accent color at 16px
- Hovering a suggestion row scales the icon+label group to 1.08 and nudges it 3px to the right with spring physics (stiffness 320, damping 20). The "Clear" button on the right stays completely still.
- Suggestion rows stagger in with a subtle delay (60ms base + 40ms per item)

Clear button in the input:
- When the user types text, a small 20px translucent circle with an X icon springs in at the right side of the input (spring stiffness 400, damping 30)
- The circle has white/8% background and white/12% border
- Clicking it clears the text and refocuses the input

Typing in the input live-filters the suggestions by label. Clicking a suggestion fills the input with that suggestion's label. The "Clear" pill on each row permanently hides that suggestion.

Click outside or press Escape to deactivate (clears query, closes dropdown).

Respects prefers-reduced-motion: all animations degrade to simple 150ms opacity fades.

Responsive: the bar is w-[calc(100%-2rem)] max-w-[380px], all touch targets are 44px minimum.

Build with React, TypeScript, Tailwind CSS, Framer Motion, and Phosphor Icons (MagnifyingGlass, X, MusicNote, File, Lightning -- all weight "regular"). Use Manrope font.`,

  Bolt: `Build a React component GlassSearchBar with Framer Motion and Phosphor Icons (@phosphor-icons/react).

Container: relative div, h-full w-full, flex items-center justify-center, bg-sand-950. Background: <img> absolute inset-0, object-cover, opacity-60, pointer-events-none (ethereal pink flower image from ImageKit URL).

Constants:
- BACKGROUND: ImageKit URL for ethereal pink flower image
- SUGGESTIONS: array of 3 items, each with icon (Phosphor component), label, color (hex)
  - { icon: MusicNote, label: 'Audio visualizers', color: '#FF5C8A' }
  - { icon: File, label: 'Documentation files', color: '#3A86FF' }
  - { icon: Lightning, label: 'Quick actions', color: '#06D6A0' }
- BAR_HEIGHT: 48, MIN_TOUCH_TARGET: 44
- GLASS_BLUR: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: same }
- GLASS_PANEL: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
- ACTIVE_GLOW: same boxShadow as GLASS_PANEL plus ', 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)' appended

State: isActive (boolean), query (string), hiddenSuggestions (Set<string>).

Search bar: motion.div, rounded-3xl (borderRadius 24), height BAR_HEIGHT, GLASS_PANEL styles. Separate non-animating blur layer div with GLASS_BLUR at z-[-1] (avoids animation performance issues). Animates boxShadow between GLASS_PANEL.boxShadow and ACTIVE_GLOW. Clicking bar when inactive activates; focusing input also activates.

Inside bar:
- MagnifyingGlass icon: 20px, white/50%, centered in a BAR_HEIGHT x BAR_HEIGHT area
- Input: flex-1, bg-transparent, text-sm font-medium text-white/90, placeholder-white/30, caret color #7D8D41, outline-none
- Clear (X) button: AnimatePresence, appears when query.length > 0. 20x20 circle, bg rgba(255,255,255,0.08), border 1px rgba(255,255,255,0.12), marginRight 14. Entry/exit: scale 0.5 + opacity. whileHover: bg rgba(255,255,255,0.14). whileTap: scale 0.88. Spring: stiffness 400, damping 30.

Dropdown: AnimatePresence, appears when isActive AND filtered suggestions exist. motion.div, absolute below bar (top: BAR_HEIGHT + 8), left-0 right-0, rounded-2xl, p-2, GLASS_PANEL styles, separate blur layer. transformOrigin: 'top center'. Entry: opacity 0, scale 0.95, y -8, filter blur(4px). Animate to: opacity 1, scale 1, y 0, filter blur(0px). Spring: stiffness 350, damping 28.

Inside dropdown:
- Top edge highlight: absolute left-6 right-6 top-0 h-[1px], linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)
- Section label: text-[10px] uppercase tracking-widest text-white/25, shows "Suggestions" or "Results" based on query
- SuggestionRow subcomponent per filtered suggestion

SuggestionRow:
- motion.div: staggered entry with delay 0.06 + index * 0.04, opacity fade
- Tracks own hovered state
- Left group (motion.button): icon badge + label. On hover: x:3, scale:1.08 with spring stiffness 320 damping 20. whileTap: scale 0.90. transformOrigin: 'left center'.
  - Icon badge: 32x32 div, rounded-xl, notification-style tinted: background \`\${color}18\`, border \`1px solid \${color}22\`, icon 16px rendered in the item's accent color (style={{ color }}).
  - Label: text-sm font-semibold, white/75% default, white/95% on hover, transition 0.15s
- Right: "Clear" pill button (stays completely still, no animation from parent). text-[8px] uppercase tracking-wide, white/40%, bg rgba(255,255,255,0.06). Clicking it adds label to hiddenSuggestions Set.

Filtering: suggestions filtered by hiddenSuggestions Set and by query (case-insensitive includes on label).

Deactivation: click outside (mousedown + touchstart listeners on document, check containerRef.contains), Escape key, both clean up listeners in useEffect.

Respects useReducedMotion: all spring animations degrade to { duration: 0.15 } opacity fades.

Responsive: outer container w-[calc(100%-2rem)] max-w-[380px], marginTop -90px to center visually.`,

  Lovable: `Build a gorgeous glassmorphism search bar -- imagine Apple's Spotlight search reimagined as a floating glass element hovering over a dreamy floral background.

Dark background with an ethereal pink flower photo at 60% opacity filling the entire space.

The search bar floats in the center -- a frosted glass pill that feels like translucent ice. It has a magnifying glass icon on the left and a text input with "Search components..." as placeholder text. The glass effect uses a deep 24px blur with high saturation, a barely-there white background (8% opacity), and delicate white borders that catch the light.

When you click or focus the input, the bar comes alive:
- A warm orange glow softly appears around the border -- not harsh neon, but a gentle warm light like candlelight reflecting off glass
- A frosted glass dropdown panel springs in below with a satisfying scale-and-slide animation, starting slightly blurred and small before snapping into place

The dropdown shows three suggestion rows, each with a beautiful notification-style icon badge:
- "Audio visualizers" with a pink MusicNote badge
- "Documentation files" with a blue File badge
- "Quick actions" with a green Lightning badge

Each icon badge is a small 32px rounded square with a softly tinted background in the item's accent color — the color at very low opacity for the fill, slightly more visible for the border, with the icon itself drawn in the full accent color. It feels like a subtle notification indicator. When you hover a suggestion, the icon and label spring slightly to the right and scale up -- it feels physical, like nudging a card on a table. The "Clear" pill on the right side of each row stays perfectly still while the left side moves, creating a nice asymmetric interaction.

The suggestion rows stagger in one after another with a subtle cascading delay.

When you start typing, a tiny translucent circle with an X springs into existence at the right edge of the input -- tap it to clear. The suggestions live-filter as you type.

Clicking a suggestion fills the input with that text. The "Clear" pill on each row permanently dismisses that suggestion.

Click anywhere outside or press Escape to close -- the dropdown gracefully fades and scales away, and the warm orange glow dissolves.

Everything respects reduced motion preferences, falling back to gentle opacity fades.

Colors: pink #FF5C8A, blue #3A86FF, green #06D6A0. Orange glow: rgba(255,160,50). Glass: white at 8% with white/10% borders.

Use Framer Motion for all animations with spring physics. Phosphor Icons for the icon set (MagnifyingGlass, X, MusicNote, File, Lightning). Manrope font throughout.`,

  'Claude Code': `Create components-workspace/glass-search-bar/index.tsx -- a glassmorphism search bar with suggestion dropdown.

Export: default function GlassSearchBar

Structure:
- Root: div, relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
- Background: <img> absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none, src = ImageKit ethereal pink flower URL
- Outer container: div ref={containerRef}, relative w-[calc(100%-2rem)] max-w-[380px], marginTop: -90

Constants:
- BACKGROUND: 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png'
- SUGGESTIONS: array of 3 Suggestion objects:
  - { icon: MusicNote, label: 'Audio visualizers', color: '#FF5C8A' }
  - { icon: File, label: 'Documentation files', color: '#3A86FF' }
  - { icon: Lightning, label: 'Quick actions', color: '#06D6A0' }
- BAR_HEIGHT: 48
- MIN_TOUCH_TARGET: 44
- glassBlur: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
- glassPanel: { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)' }
- ACTIVE_GLOW: glassPanel.boxShadow + ', 0 0 0 1.5px rgba(255, 160, 50, 0.5), 0 0 20px rgba(255, 160, 50, 0.12)'

Types:
- Suggestion = { icon: typeof MusicNote, label: string, color: string }

State (in GlassSearchBar):
- isActive: boolean (default false)
- query: string (default '')
- hiddenSuggestions: Set<string> (default empty Set)
- containerRef: useRef<HTMLDivElement>
- inputRef: useRef<HTMLInputElement>
- prefersReduced via useReducedMotion(), coerced to boolean (prefersReduced ?? false)

Filtered suggestions: SUGGESTIONS filtered by !hiddenSuggestions.has(label) then by query (case-insensitive includes on label; show all if query is empty).

springOrFade: reducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 400, damping: 30 }

Activation/deactivation:
- activate: useCallback, set isActive true, requestAnimationFrame then focus inputRef
- deactivate: useCallback, set isActive false, clear query, blur inputRef
- Click outside: useEffect when isActive, listen mousedown+touchstart on document, check containerRef.contains, call deactivate. Cleanup removes listeners.
- Escape: useEffect when isActive, listen keydown, check e.key === 'Escape', call deactivate. Cleanup removes listener.

Search bar: motion.div
- animate: { boxShadow: isActive ? ACTIVE_GLOW : glassPanel.boxShadow }
- transition: springOrFade
- onClick: !isActive ? activate : undefined
- className: relative isolate flex w-full cursor-text items-center rounded-3xl
- style: { height: BAR_HEIGHT, ...glassPanel, borderRadius: 24 }
- Blur layer: div, pointer-events-none absolute inset-0 z-[-1], style: { ...glassBlur, borderRadius: 24 }
- Search icon: div wrapping MagnifyingGlass size={20} weight="regular" text-white/50, container width/height BAR_HEIGHT, minWidth/minHeight MIN_TOUCH_TARGET
- Input: ref={inputRef}, value={query}, onChange sets query, onFocus calls activate, placeholder="Search components...", className: min-w-0 flex-1 bg-transparent font-sans text-sm font-medium text-white/90 placeholder-white/30 outline-none, style: { caretColor: '#7D8D41' }, aria-label="Search components"
- Clear button: AnimatePresence wrapping motion.button (key="clear"), shown when query.length > 0
  - initial: reducedMotion ? {opacity:0} : {opacity:0, scale:0.5}
  - animate: reducedMotion ? {opacity:1} : {opacity:1, scale:1}
  - exit: reducedMotion ? {opacity:0} : {opacity:0, scale:0.5}
  - transition: springOrFade
  - 20x20 circle, marginRight 14, bg rgba(255,255,255,0.08), border 1px rgba(255,255,255,0.12)
  - whileHover: { backgroundColor: 'rgba(255, 255, 255, 0.14)' }
  - whileTap: { scale: 0.88 }
  - X icon size={10} weight="regular" text-white/60, aria-label="Clear search"

Dropdown: AnimatePresence wrapping motion.div (key="dropdown"), shown when isActive AND filteredSuggestions.length > 0
- initial: reducedMotion ? {opacity:0} : {opacity:0, scale:0.95, y:-8, filter:'blur(4px)'}
- animate: reducedMotion ? {opacity:1} : {opacity:1, scale:1, y:0, filter:'blur(0px)'}
- exit: reducedMotion ? {opacity:0} : {opacity:0, scale:0.95, y:-8, filter:'blur(4px)'}
- transition: reducedMotion ? {duration:0.15} : {type:'spring', stiffness:350, damping:28}
- className: absolute left-0 right-0 isolate rounded-2xl p-2
- style: { ...glassPanel, transformOrigin: 'top center', top: BAR_HEIGHT + 8 }
- Blur layer: div, pointer-events-none absolute inset-0 z-[-1] rounded-2xl, style: glassBlur
- Top highlight: div, absolute left-6 right-6 top-0 h-[1px], background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)
- Section label: p, mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25 font-sans. Text: query.trim() ? 'Results' : 'Suggestions'
- Map filteredSuggestions to SuggestionRow components

SuggestionRow subcomponent (props: suggestion, index, reducedMotion, onSelect, onClear):
- Own hovered state (useState)
- motion.div wrapper: initial {opacity:0}, animate {opacity:1}, exit {opacity:0}, transition: reducedMotion ? {duration:0.15} : {duration:0.15, delay: 0.06 + index * 0.04}
- className: flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans, minHeight MIN_TOUCH_TARGET
- Left group: motion.button, flex min-w-0 flex-1 items-center gap-3
  - animate (not reducedMotion): { x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1 }
  - whileTap: { scale: 0.90 }
  - transition: { type: 'spring', stiffness: 320, damping: 20 }
  - transformOrigin: 'left center'
  - onClick: calls onSelect(label)
  - Icon badge: 32x32 div, rounded-xl, notification-style tinted: background \`\${suggestion.color}18\`, border \`1px solid \${suggestion.color}22\`. Icon size 16 weight regular, style={{ color: suggestion.color }}.
  - Label: span, text-sm font-semibold font-sans, color: white/95% on hover or white/75% default, transition color 0.15s
- Right: button "Clear", stays still (not inside the motion.button). text-[8px] uppercase tracking-wide text-white/40, bg rgba(255,255,255,0.06), rounded-full px-1.5 py-0.5. onClick: e.stopPropagation(), calls onClear(label). aria-label="Clear {label}"

Handlers:
- handleClear: clear query, focus input
- handleSuggestionSelect(label): set query to label, focus input
- handleSuggestionClear(label): add label to hiddenSuggestions Set

Phosphor icons: MagnifyingGlass, X, MusicNote, File, Lightning (all weight="regular")
Font: Manrope (font-sans)
Reduced motion: all springs degrade to { duration: 0.15 } opacity-only transitions`,

  Cursor: `// Glass Search Bar -- Glassmorphism search bar with suggestion dropdown
// Stack: React + TypeScript + Tailwind CSS + Framer Motion + Phosphor Icons
// Font: Manrope (font-sans)

// File: components-workspace/glass-search-bar/index.tsx
// Export: default function GlassSearchBar
// Root: div, relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950

// Background: <img> absolute inset-0 h-full w-full object-cover opacity-60
// URL: 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png'

// Constants:
// - BAR_HEIGHT: 48, MIN_TOUCH_TARGET: 44
// - glassBlur: backdropFilter 'blur(24px) saturate(1.8)' + WebkitBackdropFilter same
// - glassPanel: bg rgba(255,255,255,0.08), border 1px rgba(255,255,255,0.1),
//   boxShadow '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
// - ACTIVE_GLOW: glassPanel.boxShadow + ', 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)'

// 3 suggestions (Suggestion type: { icon, label, color }):
// - MusicNote, 'Audio visualizers', '#FF5C8A'
// - File, 'Documentation files', '#3A86FF'
// - Lightning, 'Quick actions', '#06D6A0'

// State: isActive (bool), query (string), hiddenSuggestions (Set<string>)
// Refs: containerRef (HTMLDivElement), inputRef (HTMLInputElement)
// Reduced motion: useReducedMotion() ?? false

// Filtering: exclude hidden labels, then case-insensitive includes on query (show all if empty)

// springOrFade: reduced ? { duration: 0.15 } : { type:'spring', stiffness:400, damping:30 }

// Activation: set isActive true, rAF then focus input
// Deactivation: set isActive false, clear query, blur input
// Click outside: useEffect, mousedown+touchstart on document, containerRef.contains check
// Escape: useEffect, keydown listener, deactivate on Escape

// Search bar: motion.div
// - animate boxShadow between glassPanel.boxShadow (inactive) and ACTIVE_GLOW (active)
// - transition: springOrFade
// - rounded-3xl (borderRadius 24), height BAR_HEIGHT, glassPanel inline styles
// - Separate blur layer: absolute inset-0 z-[-1], glassBlur, borderRadius 24
// - MagnifyingGlass icon: size 20, white/50%, in BAR_HEIGHT x BAR_HEIGHT container
// - Input: flex-1, bg-transparent, text-sm font-medium text-white/90, placeholder-white/30
//   caretColor '#7D8D41', onFocus activates
// - Clear (X) button: AnimatePresence, shown when query.length > 0
//   20x20 circle, marginRight 14, bg white/8%, border white/12%
//   Entry/exit: scale 0.5 + opacity, springOrFade
//   whileHover bg white/14%, whileTap scale 0.88
//   X icon size 10 white/60

// Dropdown: AnimatePresence, shown when isActive AND filteredSuggestions.length > 0
// - motion.div, absolute left-0 right-0, top: BAR_HEIGHT + 8
// - transformOrigin 'top center', rounded-2xl, p-2, glassPanel styles
// - Entry: opacity 0, scale 0.95, y -8, filter blur(4px)
// - Animate: opacity 1, scale 1, y 0, filter blur(0px)
// - Spring: stiffness 350, damping 28
// - Reduced motion: opacity-only, duration 0.15
// - Separate blur layer: absolute inset-0 z-[-1] rounded-2xl, glassBlur
// - Top highlight: absolute left-6 right-6 top-0 h-[1px],
//   gradient(90deg, transparent, white/18%, transparent)
// - Section label: text-[10px] uppercase tracking-widest white/25
//   Shows 'Results' if query present, 'Suggestions' otherwise

// SuggestionRow subcomponent (props: suggestion, index, reducedMotion, onSelect, onClear):
// - Own hovered state
// - motion.div: staggered opacity entry, delay 0.06 + index * 0.04
// - flex items-center gap-3, rounded-xl, px-3 py-2.5, minHeight MIN_TOUCH_TARGET
// - Left group (motion.button): icon badge + label
//   animate: x hovered?3:0, scale hovered?1.08:1
//   whileTap scale 0.90, spring stiffness 320 damping 20, origin 'left center'
//   onClick: onSelect(label)
// - Icon badge: 32x32, rounded-xl, notification-style tinted:
//   bg \`\${suggestion.color}18\`, border \`1px solid \${suggestion.color}22\`
//   Icon size 16 weight regular, style={{ color: suggestion.color }}
// - Label: text-sm semibold, white/95% hovered, white/75% default, transition 0.15s
// - Right: "Clear" button (NOT inside motion.button, stays still)
//   text-[8px] uppercase tracking-wide white/40%, bg white/6%, rounded-full
//   onClick: stopPropagation, onClear(label)

// Handlers:
// - handleClear: clear query, focus input
// - handleSuggestionSelect(label): set query to label, focus input
// - handleSuggestionClear(label): add to hiddenSuggestions Set

// Outer container: w-[calc(100%-2rem)] max-w-[380px], marginTop -90
// Phosphor icons: MagnifyingGlass, X, MusicNote, File, Lightning (all weight="regular")
// Reduced motion: all springs -> { duration: 0.15 }, opacity-only transitions`,
}
