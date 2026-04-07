import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Build a glassmorphism AI chat compose box with a text input, toolbar, and model switcher.

The scene has a dark background with an atmospheric orange flower image at 60% opacity. Centered on screen is a single glass panel (rounded-2xl) containing two sections separated by a thin divider line.

Upper section — the compose area:
- A multi-line textarea with placeholder "Ask anything...", auto-grows up to 160px max height. Text is white/90, placeholder white/40. Caret color matches the active AI model's color.
- Below the textarea (gap-6 spacing), a toolbar row with left and right groups:
  - Left: two 32px rounded-xl icon buttons (ImageSquare for image upload, GlobeSimple for web search toggle) plus a flash label. Both buttons have glass-style fill (white 8% bg, white 12% border) and white/50 icons. On hover, buttons brighten to white/14 bg with spring scale 1.08. The globe button toggles web search — when active, it gets a notification-style tinted badge (model color at 18% bg, model color at 22% border) with the icon in the model's full color. A "Web search on" label appears for 1 second then fades out, colored in the active model's color.
  - Right: a 36px rounded-xl send button. When the textarea has content or images are attached, the button activates with the model's color (40% bg, 66% border, icon in full color). When disabled, it fades to 40% opacity with neutral glass fill.
- Image upload: clicking the ImageSquare opens a file picker. Uploaded images appear as 64px rounded-xl thumbnails with spring scale entrance animation. Each thumbnail has a small X button (dark circle) to remove it.

Lower section — model switcher:
- Four AI model pills in a row: Claude (orange #FF7B54), ChatGPT (green #10A37F), Perplexity (blue #3A86FF), Gemini (yellow #FFBE0B).
- The active model has a notification-style tinted pill behind it (layoutId spring animation). Inactive labels are white/50. Active label is in the model's color.
- Switching models changes the caret color, send button color, and web search toggle color throughout.

Glass panel style: background rgba(255,255,255,0.08), border 1px solid rgba(255,255,255,0.1), boxShadow with 40px ambient + inset top highlight. Blur on separate static z-[-1] layer (blur 24px, saturate 1.8) with isolate parent. Top edge highlight: 1px gradient line (transparent → white/18% → transparent).

Active state: when textarea is focused, the panel gets a subtle white glow (1.5px white ring at 25% + 20px ambient at 6%), animated with spring physics. Click outside deactivates.

Enter sends the message (Shift+Enter for newline). Supports prefers-reduced-motion.

Use Framer Motion and Phosphor icons (PaperPlaneRight, ImageSquare, GlobeSimple, X — all weight "regular").`,

  Bolt: `Create GlassAiCompose React component — glassmorphism AI chat compose box with model switcher.

MODELS:
[
  { label: 'Claude', color: '#FF7B54' },
  { label: 'ChatGPT', color: '#10A37F' },
  { label: 'Perplexity', color: '#3A86FF' },
  { label: 'Gemini', color: '#FFBE0B' },
]

GLASS STYLE (two consts for perf):
glassPanel: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
glassBlur (separate static div z-[-1], isolate parent): { backdropFilter: 'blur(24px) saturate(1.8)' }

ACTIVE_GLOW (white, applied to panel when focused):
'...0 0 0 1.5px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.06)'

SINGLE GLASS PANEL (rounded-2xl) with TWO SECTIONS separated by divider:

UPPER — compose area (p-4 pb-2, gap-6):
- Textarea: auto-grow (scrollHeight capped at 160px), placeholder "Ask anything...", caretColor: activeModel.color. Enter sends, Shift+Enter newline.
- Image thumbnails: AnimatePresence, 64px rounded-xl, spring scale 0.8→1. X button: 20px dark circle, top-right.
- Toolbar row (flex justify-between):
  Left: two 32x32 rounded-xl buttons (ImageSquare + GlobeSimple), gap-2
    - Default: bg white/8%, border white/12%, icon white/50%
    - Hover: bg white/14%, scale 1.08 (spring 320/20)
    - Globe active: bg \`\${model.color}18\`, border \`\${model.color}22\`, icon in model color. Hover: bg \`\${model.color}28\`
    - "Web search on" label: AnimatePresence, shows 1s then fades, color \`\${model.color}88\`
  Right: 36x36 send button (PaperPlaneRight)
    - Active (canSend): bg \`\${model.color}40\`, border \`\${model.color}66\`, icon in model color
    - Disabled: bg white/6%, border white/8%, opacity 0.4

DIVIDER: mx-4 h-[1px] rgba(255,255,255,0.07)

LOWER — model switcher (px-3 py-2.5):
- 4 buttons, flex-1 each, rounded-lg px-3 py-1.5
- Active: motion.div layoutId="model-pill", bg \`\${color}18\`, border \`1px solid \${color}22\`, spring 400/28
- Label: text-[11px] font-semibold, active=model color, inactive=white/50%

CLOSE: useEffect mousedown+touchstart, check ref.current.contains.
Reduced motion: springs → duration 0.15.`,

  Lovable: `Build a beautiful glassmorphism AI chat compose box where users can type messages, upload images, toggle web search, and switch between AI models.

The component is a single frosted glass panel with two sections separated by a thin divider.

The top section is the compose area. It has a multi-line text field with the placeholder "Ask anything..." that auto-grows as you type. Below the text field are two small glass icon buttons — one for uploading images and one for toggling web search. When you click the image button, a file picker opens and uploaded images appear as small thumbnails with a spring animation. Each thumbnail has a tiny X to remove it. The web search button toggles on/off — when active, it takes on the selected AI model's accent color with a tinted background. A brief "Web search on" label flashes for 1 second next to it. Both buttons brighten slightly on hover.

On the right side of the toolbar is a send button that lights up in the active model's color when there's content to send.

The bottom section has four AI model pills: Claude (orange), ChatGPT (green), Perplexity (blue), and Gemini (yellow). The active model has a tinted pill indicator that slides between them with spring physics. Switching models changes accent colors throughout — the send button, web search toggle, text caret, and label all adapt.

When you click into the text field, the whole panel gets a subtle white glow border. Click outside to deactivate. Press Enter to send, Shift+Enter for newlines.

The glass effect uses the standard family style — subtle white background, thin border, deep shadow with inset top highlight, and blur on a separate non-animating layer for performance. There's a delicate gradient highlight along the top edge.

Use Framer Motion for all animations and Phosphor icons (PaperPlaneRight, ImageSquare, GlobeSimple, X — all weight "regular").`,

  'Claude Code': `Build GlassAiCompose component ('use client') — glassmorphism AI compose box with model switcher.

MODELS = [
  { label: 'Claude', color: '#FF7B54' },
  { label: 'ChatGPT', color: '#10A37F' },
  { label: 'Perplexity', color: '#3A86FF' },
  { label: 'Gemini', color: '#FFBE0B' },
]

GLASS STYLE (two consts — blur on separate static layer for perf):
glassBlur: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: same }
glassPanel: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }

ACTIVE_GLOW (white glow when focused):
'0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1.5px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.06)'

SINGLE PANEL: motion.div rounded-2xl, animate boxShadow isActive?ACTIVE_GLOW:glassPanel.boxShadow.
Style: bg + border from glassPanel (boxShadow is animated).
Blur div: absolute inset-0 z-[-1], isolate on parent.
Top highlight: absolute left-6 right-6 top-0 h-[1px] gradient line.

STATE: isActive, message, activeModel, images (string[]), webSearch, showWebLabel.

WEB SEARCH LABEL: useEffect on [webSearch] — set showWebLabel true, setTimeout 1000ms → false.

TEXTAREA: auto-resize via callback (el.style.height=auto then scrollHeight capped at 160px).
onFocus → setIsActive(true). onKeyDown: Enter sends (preventDefault), Shift+Enter newline.
caretColor: activeModel.color. placeholder-white/40, text-white/90.

IMAGE UPLOAD: hidden input ref, fileInputRef.current.click(). FileReader → base64 data URLs.
ImageThumbnail: 64px rounded-xl, spring scale 0.8→1 enter, 0.8 exit. X button: 20px dark circle.

TOOLBAR (flex justify-between):
Left group (gap-2):
  Upload btn: 32x32 rounded-xl, bg white/8%, border white/12%, icon white/50%.
    whileHover: scale 1.08, bg white/14%. whileTap: scale 0.88. Spring 320/20.
  Globe btn: same default style. When webSearch=true: bg \`\${activeModel.color}18\`,
    border \`\${activeModel.color}22\`, icon in activeModel.color.
    Hover when active: bg \`\${activeModel.color}28\`.
  Label: AnimatePresence, showWebLabel → motion.span opacity+x fade, text-[10px], \`\${activeModel.color}88\`.

Right: Send btn 36x36 rounded-xl.
  canSend (message.trim() || images.length): bg \`\${activeModel.color}40\`, border \`\${activeModel.color}66\`, icon activeModel.color.
  Disabled: bg white/6%, border white/8%, opacity 0.4, pointerEvents none.

DIVIDER: mx-4 h-[1px] rgba(255,255,255,0.07).

MODEL SWITCHER (px-3 py-2.5): ModelSwitcher component.
  4 buttons flex-1, rounded-lg px-3 py-1.5.
  Active: motion.div layoutId="model-pill" bg \`\${color}18\` border \`1px solid \${color}22\`, spring 400/28.
  Label: text-[11px] semibold, active=color, inactive=white/50%.

CLOSE OUTSIDE: useEffect [isActive], mousedown+touchstart → ref.current.contains.
REDUCED MOTION: useReducedMotion() — springs → duration 0.15.
Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950.`,

  Cursor: `Implement GlassAiCompose with these exact specs:

STRUCTURE:
Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
Background img: absolute inset-0 object-cover opacity-60
Container (ref): relative z-10 w-[calc(100%-2rem)] max-w-[420px]

SINGLE GLASS PANEL (motion.div rounded-2xl):
animate boxShadow: isActive ? ACTIVE_GLOW : glassPanel.boxShadow
style: background + border from glassPanel (NOT boxShadow — animated)
Blur div: absolute inset-0 z-[-1] rounded-2xl, isolate on parent
Top highlight: absolute left-6 right-6 top-0 z-10 h-[1px] gradient

GLASS STYLE:
glassBlur: backdropFilter blur(24px) saturate(1.8)
glassPanel: bg rgba(255,255,255,0.08), border 1px solid rgba(255,255,255,0.1),
  boxShadow 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)
ACTIVE_GLOW: ...+ 0 0 0 1.5px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.06)

MODELS: Claude #FF7B54, ChatGPT #10A37F, Perplexity #3A86FF, Gemini #FFBE0B

COMPOSE AREA (p-4 pb-2, flex-col gap-6):

TEXTAREA: rows=1, resize-none, bg-transparent, text-sm font-medium text-white/90
  placeholder="Ask anything..." placeholder-white/40
  caretColor: activeModel.color, maxHeight: 160px
  Auto-resize: el.style.height='auto' then min(scrollHeight, 160)
  onFocus → setIsActive(true), Enter sends, Shift+Enter newline

IMAGE THUMBNAILS: AnimatePresence wrapping flex gap-2
  ImageThumbnail: h-16 w-16 rounded-xl, border white/12%
    initial: opacity 0 scale 0.8, animate: 1/1, exit: 0/0.8, spring 350/25
    X button: absolute right-1 top-1, h-5 w-5 rounded-full, bg black/60%, border white/15%

TOOLBAR (flex items-center justify-between):
Left (flex gap-2):
  Upload btn (motion.button): 32x32 rounded-xl
    bg rgba(255,255,255,0.08), border 1px solid rgba(255,255,255,0.12)
    Icon: ImageSquare size 16, color white/50%
    whileHover: scale 1.08, bg rgba(255,255,255,0.14). whileTap: scale 0.88
    Hidden input: type=file accept=image/* multiple, onChange reads as dataURL

  Globe btn (motion.button): 32x32 rounded-xl, same default as upload
    When webSearch=true: bg \`\${activeModel.color}18\`, border \`\${activeModel.color}22\`
      icon color: activeModel.color. Hover bg: \`\${activeModel.color}28\`
    When false: same as upload button
    Icon: GlobeSimple size 16

  Label: AnimatePresence → motion.span (showWebLabel state)
    initial opacity:0 x:-4, animate 1/0, exit 0/-4, duration 0.15
    text-[10px] font-semibold, color \`\${activeModel.color}88\`
    "Web search on" — auto-hides after 1000ms via useEffect+setTimeout

Right: Send btn (motion.button) 36x36 rounded-xl
  canSend = message.trim().length > 0 || images.length > 0
  Active: animate bg \`\${activeModel.color}40\`, border \`\${activeModel.color}66\`
    icon PaperPlaneRight 16 color activeModel.color. whileHover scale 1.08
  Disabled: bg white/6%, border white/8%, opacity 0.4, pointerEvents none

DIVIDER: mx-4 h-[1px] bg rgba(255,255,255,0.07)

MODEL SWITCHER (div px-3 py-2.5):
ModelSwitcher component: flex gap-0.5, 4 buttons flex-1
  Each: rounded-lg px-3 py-1.5, bg transparent
  Active: motion.div layoutId="model-pill" absolute inset-0 rounded-lg
    bg \`\${color}18\`, border \`1px solid \${color}22\`, spring 400/28
  Label: text-[11px] font-semibold, z-10
    active: model.color, inactive: rgba(255,255,255,0.50), transition 0.15s

CLOSE OUTSIDE: useEffect [isActive] mousedown+touchstart → ref.current.contains
REDUCED MOTION: useReducedMotion() — all springs → { duration: 0.15 }`,
}
