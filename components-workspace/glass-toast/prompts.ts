import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a toast notification system with Apple glassmorphism styling on a dark background with a full-bleed background image (an ethereal flower photo loaded from a URL, opacity 60%, object-cover).

The component has two parts: trigger buttons in the center, and a toast stack anchored to the bottom-right corner.

Trigger buttons (centered, wrapping row of 4):
- Success (green #06D6A0, CheckCircle icon), Error (pink #FF5C8A, XCircle icon), Warning (yellow #FFBE0B, Warning icon), Info (blue #3A86FF, Info icon)
- Each button is a frosted glass pill: rgba(255,255,255,0.06) background, backdrop-blur 24px with saturate 1.8, 1px white/10% border, box-shadow with inset top highlight
- Left side: a 32px notification-style tinted badge (rounded-xl corners, not squircle) with the variant icon rendered in its full accent color. The badge background is a very faint tint of the icon color (about 9% opacity) with a subtle matching border (about 13% opacity). No gradient, no gloss, no drop-shadow.
- Right side: the variant label in white/70% semibold text
- On hover: scale up to 1.08. On press: scale down to 0.90. Spring physics: stiffness 300, damping 20.

Toast cards (fixed position, bottom-right, 380px wide on desktop, full-width with padding on mobile):
- Maximum 3 toasts visible at once. Oldest removed when exceeding the limit.
- Each toast is a frosted glass panel with the same glass styling as the buttons
- Layout: a 36px notification-style tinted icon badge on the left (rounded-xl, same flat tinted treatment as buttons — faint color background, subtle matching border, icon in full accent color), then title (white/90% semibold) and optional description (white/50% text-xs) on the right
- A small close button (20x20 circle, white/8% bg, white/12% border) positioned absolute right-center with a 44px touch target
- A 2px progress bar at the bottom that counts down over 4 seconds using the variant color at 60% opacity
- On hover: the progress bar pauses and the card scales up slightly to 1.01
- Cards enter from the right with spring animation (stiffness 300, damping 26), sliding 80px and scaling from 0.95
- Cards exit the same way in reverse
- AnimatePresence with mode="popLayout" for smooth layout shifts

Demo toast content:
- Success: "Changes saved" / "Your settings have been updated successfully"
- Error: "Upload failed" / "The file exceeds the maximum size limit"
- Warning: "Low storage" / "You have less than 100MB remaining"
- Info: "New update" / "Version 2.4 is now available"

Respects prefers-reduced-motion: animations degrade to simple opacity fades.

Build with React, TypeScript, Tailwind CSS, Framer Motion, and Phosphor Icons.`,

  Bolt: `Build a React component GlassToast with Framer Motion and Phosphor Icons (@phosphor-icons/react).

Container: relative div, h-full w-full, flex items-center justify-center, bg-sand-950. Background: <img> absolute inset-0, object-cover, opacity-60, pointer-events-none (ethereal flower image from ImageKit URL).

Constants:
- GLASS_BLUR: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: same }
- GLASS_PANEL: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
- TOAST_DURATION: 4000ms, MAX_TOASTS: 3

4 toast variants (Record<ToastVariant, VariantConfig>):
- success: color #06D6A0, gradient '#06D6A0, #00BFA5', icon CheckCircle, label 'Success'
- error: color #FF5C8A, gradient '#FF5C8A, #FF1744', icon XCircle, label 'Error'
- warning: color #FFBE0B, gradient '#FFBE0B, #FF9800', icon Warning, label 'Warning'
- info: color #3A86FF, gradient '#3A86FF, #2962FF', icon Info, label 'Info'

Custom hook useToastProgress(id, isPaused, onComplete):
- Uses RAF loop (not CSS animation) to track elapsed time
- Updates a ref'd div's transform scaleX from 1 to 0 over TOAST_DURATION
- Pauses when isPaused is true (hover state)
- Calls onComplete when fraction reaches 0
- Cleans up with alive flag + cancelAnimationFrame

ToastCard subcomponent:
- motion.div with layout prop, rounded-2xl, overflow-hidden, GLASS_PANEL styles
- Separate non-animating blur layer div with GLASS_BLUR (avoids animation performance issues)
- Content: flex items-center gap-3, py-3.5 pl-4 pr-10
- Icon: 36x36 notification-style tinted badge, rounded-xl (no clipPath). Background: \${color}18, border: 1px solid \${color}22. Icon size 18 in full accent color via style={{ color }}. No gradient, no gloss, no drop-shadow.
- Text: title text-sm font-semibold text-white/90, description mt-0.5 text-xs text-white/50
- Close: absolute right-0 top-50% -translate-y-50%, 44px touch target wrapping 20x20 visual circle (white/8% bg, white/12% border). X icon size 10.
- Progress: absolute bottom-0, 2px height, scaleX via ref, color+99 hex opacity
- Entry: from {opacity:0, x:80, scale:0.95}, spring stiffness:300 damping:26
- Exit: {opacity:0, x:80, scale:0.95}
- Hover: scale 1.01, pauses progress timer
- Hover on close: bg rgba(255,255,255,0.14), tap scale 0.88

TriggerButton subcomponent:
- motion.button with GLASS_PANEL styles, rounded-2xl, min-height 44px
- Separate blur layer behind content (z-[-1])
- 32x32 notification-style tinted icon badge, rounded-xl: background \${color}18, border 1px solid \${color}22, icon 16px in full accent color via style={{ color }}. No gradient, no gloss.
- Label: text-sm font-semibold text-white/70
- whileHover scale:1.08, whileTap scale:0.90, spring stiffness:300 damping:20

Main GlassToast:
- State: toasts array (Toast[]), idCounter ref
- addToast: push new toast, enforce MAX_TOASTS by slicing oldest
- Toast container: fixed bottom-4 left-4 right-4 z-50, flex-col-reverse gap-3. On sm+: bottom-6, right-6, w-[380px], left-auto
- AnimatePresence mode="popLayout" initial={false}
- Respects useReducedMotion: animations degrade to opacity-only`,

  Lovable: `Build a beautiful glassmorphism toast notification system -- think Apple's notification banners but floating over a dreamy floral background.

Dark background with an ethereal flower photo at 60% opacity filling the entire viewport.

In the center of the screen, four glass trigger buttons arranged in a row:
- Success (green), Error (pink), Warning (yellow), Info (blue)
- Each button is a frosted glass pill with a small colored icon badge on the left (a rounded tile with soft corners) and a label on the right
- The icon badges are notification-style tinted tiles -- a very faint wash of the icon's color as the background with a matching whisper of a border. The icon itself is drawn in its full accent color. Clean and modern, no gradients or gloss effects.
- Buttons feel physical -- they spring up on hover and compress on click

When you click a button, a toast notification slides in from the right at the bottom of the screen:
- Each toast is a frosted glass card with the same tinted icon badge, a title, and a description
- A thin progress bar at the bottom slowly drains over 4 seconds, showing time remaining
- Hovering a toast pauses the timer and the card lifts very slightly
- A small translucent close button sits on the right side of each toast
- Maximum 3 toasts stack at once -- the oldest gets bumped when a new one appears
- Toasts exit with a smooth spring animation sliding back to the right

The glass effect throughout uses a deep frosted blur (24px) with high saturation, very subtle white backgrounds (6% opacity), and delicate white borders. Everything feels like it's made of translucent ice floating over the flower image.

Demo messages:
- Success: "Changes saved" with "Your settings have been updated successfully"
- Error: "Upload failed" with "The file exceeds the maximum size limit"
- Warning: "Low storage" with "You have less than 100MB remaining"
- Info: "New update" with "Version 2.4 is now available"

Colors: Success #06D6A0, Error #FF5C8A, Warning #FFBE0B, Info #3A86FF.

Respects prefers-reduced-motion by falling back to simple opacity fades.

Use Framer Motion for all animations with spring physics. AnimatePresence for enter/exit. Phosphor Icons for the icon set.`,

  'Claude Code': `Create components-workspace/glass-toast/index.tsx -- a glassmorphism toast notification system.

Structure:
- Root: div, flex h-full w-full items-center justify-center bg-sand-950
- Background: <img> absolute inset-0, object-cover, opacity-60, pointer-events-none (ethereal flower from ImageKit)
- Trigger buttons: relative z-10, flex flex-wrap items-center justify-center gap-3 px-4
- Toast container: fixed bottom-4 left-4 right-4 z-50, flex-col-reverse gap-3. sm: bottom-6 left-auto right-6 w-[380px]

Export: named function GlassToast

Constants:
- GLASS_BLUR: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
- GLASS_PANEL: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
- TOAST_DURATION: 4000
- MAX_TOASTS: 3
- ENTER_SPRING: { type:'spring', stiffness:300, damping:26 }
- BUTTON_SPRING: { type:'spring', stiffness:300, damping:20 }

Types:
- ToastVariant = 'success' | 'error' | 'warning' | 'info'
- Toast = { id: string, variant: ToastVariant, title: string, description?: string }
- VariantConfig = { color: string, gradient: string, icon: typeof CheckCircle, label: string }

Variant configs (Record<ToastVariant, VariantConfig>):
- success: color '#06D6A0', gradient '#06D6A0, #00BFA5', icon CheckCircle, label 'Success'
- error: color '#FF5C8A', gradient '#FF5C8A, #FF1744', icon XCircle, label 'Error'
- warning: color '#FFBE0B', gradient '#FFBE0B, #FF9800', icon Warning, label 'Warning'
- info: color '#3A86FF', gradient '#3A86FF, #2962FF', icon Info, label 'Info'

Demo toast content (Record<ToastVariant, {title, description}>):
- success: 'Changes saved' / 'Your settings have been updated successfully'
- error: 'Upload failed' / 'The file exceeds the maximum size limit'
- warning: 'Low storage' / 'You have less than 100MB remaining'
- info: 'New update' / 'Version 2.4 is now available'

Custom hook: useToastProgress(id: string, isPaused: boolean, onComplete: (id: string) => void) => React.RefObject<HTMLDivElement>
- RAF-based countdown timer, NOT CSS animation
- Tracks elapsed time via elapsedRef (cumulative). On each tick: if not paused, add delta (now - lastTime) to elapsed
- Compute fraction = max(0, 1 - elapsed/TOAST_DURATION). Set ref'd div style.transform = scaleX(fraction)
- When fraction <= 0, call onComplete(id)
- Cleanup: alive flag = false, cancelAnimationFrame
- Returns progressRef to attach to the progress bar div

ToastCard component (props: toast: Toast, onDismiss: (id:string)=>void, prefersReduced: boolean|null):
- State: hovered (boolean)
- Get variant config and Icon component from VARIANTS[toast.variant]
- Call useToastProgress with toast.id, hovered, and memoized onComplete callback
- motion.div: layout prop, rounded-2xl, overflow-hidden, GLASS_PANEL inline style
  - initial: prefersReduced ? {opacity:0} : {opacity:0, x:80, scale:0.95}
  - animate: prefersReduced ? {opacity:1} : {opacity:1, x:0, scale:1, scale: hovered && !prefersReduced ? 1.01 : 1}
  - exit: prefersReduced ? {opacity:0} : {opacity:0, x:80, scale:0.95}
  - transition: ENTER_SPRING
- Blur layer: separate non-animating div, absolute inset-0 z-0, GLASS_BLUR styles, rounded-2xl
- Content row: relative z-10, flex items-center gap-3 py-3.5 pl-4 pr-10
  - Icon badge: 36x36 div, rounded-xl (no clipPath, no squircle). Notification-style tinted badge:
    - background: \${variant.color}18
    - border: 1px solid \${variant.color}22
    - Icon: size 18, weight="regular", style={{ color: variant.color }} (full accent color, not white)
    - No gradient, no gloss overlay, no drop-shadow
  - Text: flex min-w-0 flex-1 flex-col. Title: truncate text-sm font-semibold text-white/90. Description: mt-0.5 truncate text-xs text-white/50
- Close button: absolute right-0 top-1/2 -translate-y-1/2 z-20, 44px touch target wrapping 20x20 motion.div circle (bg rgba(255,255,255,0.08), border 1px rgba(255,255,255,0.12)). whileHover: bg rgba(255,255,255,0.14). whileTap: scale 0.88. X icon size 10 text-white/60. role="button" aria-label="Dismiss toast".
- Progress bar: absolute bottom-0 left-0 right-0 h-[2px]. Inner div with ref from useToastProgress, h-full w-full origin-left, background \${color}99.

TriggerButton component (props: variant: ToastVariant, onTrigger: () => void):
- motion.button: rounded-2xl, GLASS_PANEL inline style, outline none, min-height 44px, isolate class
- Separate blur layer: absolute inset-0 z-[-1], GLASS_BLUR styles
- 32x32 notification-style tinted icon badge, rounded-xl: background \${config.color}18, border 1px solid \${config.color}22. Icon size 16, style={{ color: config.color }}. No gradient, no gloss.
- Label: text-sm font-semibold text-white/70
- whileHover: scale 1.08. whileTap: scale 0.90. transition: BUTTON_SPRING

Main GlassToast:
- State: toasts (Toast[]) via useState, idCounter via useRef(0)
- prefersReduced via useReducedMotion()
- dismissToast: useCallback, filter out by id
- addToast: useCallback(variant), create id "toast-\${++counter}", spread DEMO_TOASTS[variant], enforce MAX_TOASTS by slicing from end
- Render trigger buttons by iterating Object.keys(VARIANTS) as ToastVariant[]
- Toast container wraps cards in <AnimatePresence mode="popLayout" initial={false}>

Phosphor icons used: CheckCircle, XCircle, Warning, Info, X (all weight="regular")`,

  Cursor: `// Glass Toast — Glassmorphism toast notification system
// Stack: React + TypeScript + Tailwind CSS + Framer Motion + Phosphor Icons

// File: components-workspace/glass-toast/index.tsx
// Export: GlassToast (named export)
// Root: div, flex h-full w-full items-center justify-center bg-sand-950

// Background: <img> absolute inset-0, object-cover, opacity-60, ethereal flower URL

// Constants:
// - GLASS_BLUR: backdropFilter 'blur(24px) saturate(1.8)' + WebkitBackdropFilter same
// - GLASS_PANEL: bg rgba(255,255,255,0.06), border 1px rgba(255,255,255,0.1), boxShadow '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
// - TOAST_DURATION: 4000ms
// - MAX_TOASTS: 3
// - ENTER_SPRING: { type:'spring', stiffness:300, damping:26 }
// - BUTTON_SPRING: { type:'spring', stiffness:300, damping:20 }

// 4 variants (success/error/warning/info):
// - success: #06D6A0, gradient to #00BFA5, CheckCircle, 'Success'
// - error: #FF5C8A, gradient to #FF1744, XCircle, 'Error'
// - warning: #FFBE0B, gradient to #FF9800, Warning, 'Warning'
// - info: #3A86FF, gradient to #2962FF, Info, 'Info'

// Demo content per variant:
// - success: 'Changes saved' / 'Your settings have been updated successfully'
// - error: 'Upload failed' / 'The file exceeds the maximum size limit'
// - warning: 'Low storage' / 'You have less than 100MB remaining'
// - info: 'New update' / 'Version 2.4 is now available'

// Custom hook useToastProgress(id, isPaused, onComplete):
// - RAF-based timer, tracks elapsed via ref, pauses on hover
// - Sets ref'd div transform scaleX(fraction) where fraction = max(0, 1 - elapsed/4000)
// - Calls onComplete(id) when fraction <= 0
// - Cleanup: alive flag false + cancelAnimationFrame

// ToastCard subcomponent (props: toast, onDismiss, prefersReduced):
// - motion.div: layout, rounded-2xl, overflow-hidden, GLASS_PANEL inline styles
// - Separate non-animating blur layer: absolute inset-0 z-0, GLASS_BLUR
// - Entry: {opacity:0, x:80, scale:0.95} -> {opacity:1, x:0, scale:1}, ENTER_SPRING
// - Exit: {opacity:0, x:80, scale:0.95}
// - Hover: scale 1.01, pauses progress timer
// - Reduced motion: opacity-only transitions
// - Content row: flex items-center gap-3 py-3.5 pl-4 pr-10
// - Icon badge: 36x36, rounded-xl (no clipPath). bg: color+18, border: 1px solid color+22
//   Icon size 18, style={{ color: variant.color }} (full accent, not white). No gradient/gloss/shadow
// - Text: title text-sm semibold white/90, description text-xs white/50, both truncate
// - Close: absolute right-0 top-50% -translate-y-50% z-20, 44px touch target
//   Inner: 20x20 circle, bg white/8%, border white/12%, X size 10 white/60
//   whileHover bg white/14%, whileTap scale 0.88
// - Progress bar: absolute bottom-0 h-[2px], inner div ref, origin-left, bg color+99

// TriggerButton subcomponent (props: variant, onTrigger):
// - motion.button: rounded-2xl, GLASS_PANEL, isolate, min-h-44px
// - Separate blur layer z-[-1]
// - 32x32 tinted icon badge, rounded-xl: bg color+18, border color+22, icon 16px full accent color
// - Label: text-sm semibold white/70
// - whileHover scale:1.08, whileTap scale:0.90, BUTTON_SPRING

// Main GlassToast:
// - State: toasts Toast[], idCounter useRef(0), prefersReduced useReducedMotion()
// - addToast: push with id "toast-\${++counter}", enforce MAX_TOASTS via slice
// - dismissToast: filter by id
// - Trigger buttons: centered flex-wrap row, one per variant
// - Toast container: fixed bottom-4 left-4 right-4 z-50, flex-col-reverse gap-3
//   sm: bottom-6 left-auto right-6 w-[380px]
// - AnimatePresence mode="popLayout" initial={false}
// - Phosphor icons: CheckCircle, XCircle, Warning, Info, X (all weight="regular")`,
}
