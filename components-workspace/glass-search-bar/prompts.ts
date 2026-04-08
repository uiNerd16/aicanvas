import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/glass-search-bar/index.tsx -- a glassmorphism search bar with suggestion dropdown.

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
}
