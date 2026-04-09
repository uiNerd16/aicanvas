import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassAiCompose\` — a glassmorphism AI prompt composer with per-model theming, textarea, image uploads, web-search toggle, and a layoutId model switcher.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background image (absolute inset-0, object-cover, opacity-60, pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`

MODELS (label, color):
- Claude #FF7B54
- ChatGPT #10A37F
- Perplexity #3A86FF
- Gemini #FFBE0B

Constants: MAX_TEXTAREA_HEIGHT = 160.

Glass shared styles:
- glassBlur: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
- glassPanel: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
- ACTIVE_GLOW: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1.5px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.06)'

State: isActive, message, activeModel (default Claude), images: string[], webSearch, showWebLabel. Refs: containerRef, textareaRef, fileInputRef. useReducedMotion().

Behavior:
- onFocus textarea → setIsActive(true). Click outside containerRef (mousedown + touchstart listeners, cleanup on unmount) → setIsActive(false).
- Auto-resize textarea: on change set height='auto' then scrollHeight capped at 160.
- webSearch useEffect: when true, showWebLabel=true then setTimeout 1000ms → false (cleanup clearTimeout).
- handleImageUpload: FileReader readAsDataURL → push base64 into images. Reset e.target.value.
- Enter (no shift) → handleSend; clears message + images and resets height.
- canSend = message.trim().length > 0 || images.length > 0.

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950.

Panel (motion.div, ref=containerRef wraps inner), className \`relative isolate overflow-hidden rounded-2xl\`, w-[calc(100%-2rem)] max-w-[420px].
- animate boxShadow: isActive ? ACTIVE_GLOW : glassPanel.boxShadow, transition = reducedMotion ? {duration:0.15} : {type:'spring', stiffness:350, damping:28}.
- style: glassPanel background + border (not boxShadow — it's animated).
- Separate blur layer: pointer-events-none absolute inset-0 z-[-1] rounded-2xl style=glassBlur.
- Top highlight: absolute left-6 right-6 top-0 h-[1px] \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`.

Compose area (relative z-10 flex flex-col gap-6 p-4 pb-2):
- textarea placeholder "Ask anything..." rows=1, bg-transparent text-white/90 placeholder-white/40, caretColor: activeModel.color, maxHeight 160.
- AnimatePresence thumbnails: motion.div wrapper (opacity/height 0↔auto). Each thumbnail 64px rounded-xl border rgba(255,255,255,0.12), spring {stiffness:350, damping:25} scale 0.8↔1; X button (5x5 absolute top-1 right-1, bg rgba(0,0,0,0.6), X size 10 text-white/80).
- Toolbar flex justify-between:
  Left (gap-2): Upload button 32x32 rounded-xl bg rgba(255,255,255,0.08) border rgba(255,255,255,0.12), ImageSquare size 16 color rgba(255,255,255,0.5). Hidden file input accept image/* multiple.
  Globe toggle 32x32 same base; when webSearch: bg \`\${activeModel.color}18\`, border \`1px solid \${activeModel.color}22\`, icon activeModel.color. whileHover scale 1.08 bg white/14 (or \`\${color}28\` when active); whileTap 0.88; spring {320,20}.
  AnimatePresence "Web search on" label: motion.span text-[10px] font-semibold, color \`\${activeModel.color}88\`, opacity+x -4 fade.
  Right: Send button 36x36 rounded-xl. animate: canSend ? { background: \`\${activeModel.color}40\`, border: \`1px solid \${activeModel.color}66\` } : { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)' }. opacity canSend?1:0.4 pointerEvents none when disabled. PaperPlaneRight size 16 colored accent or white/30.

Divider: mx-4 h-[1px] rgba(255,255,255,0.07).

Model switcher row (px-3 py-2.5): 4 buttons flex-1 rounded-lg px-3 py-1.5. Active button renders motion.div layoutId="model-pill" absolute inset-0 rounded-lg with bg \`\${color}18\` border \`1px solid \${color}22\` spring {stiffness:400, damping:28}. Label text-[11px] font-semibold color=isActive?color:'rgba(255,255,255,0.50)'.

Icons from @phosphor-icons/react (weight="regular"): PaperPlaneRight, ImageSquare, GlobeSimple, X. Framer Motion: motion, AnimatePresence, useReducedMotion.`,

  GPT: `Build a React client component named \`GlassAiCompose\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
MODELS = [
  { label: 'Claude',     color: '#FF7B54' },
  { label: 'ChatGPT',    color: '#10A37F' },
  { label: 'Perplexity', color: '#3A86FF' },
  { label: 'Gemini',     color: '#FFBE0B' },
] as const. Default activeModel = MODELS[0].
MAX_TEXTAREA_HEIGHT = 160.
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133

## Glass surface
- Panel bg: rgba(255,255,255,0.08). Border: 1px solid rgba(255,255,255,0.1). Rounded-2xl, overflow-hidden, isolate.
- backdrop-filter: blur(24px) saturate(1.8) — applied on separate child div (pointer-events-none absolute inset-0 z-[-1] rounded-2xl), not on the animated parent.
- Base boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'.
- ACTIVE_GLOW (on focus): '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1.5px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.06)'.
- Top highlight: absolute left-6 right-6 top-0 h-[1px] linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent).
- Divider: mx-4 h-[1px] rgba(255,255,255,0.07) between compose area and model row.

## State (useState)
isActive:boolean, message:string, activeModel (one of MODELS), images:string[], webSearch:boolean, showWebLabel:boolean. Refs: containerRef(div), textareaRef(textarea), fileInputRef(input). useReducedMotion(). canSend = message.trim().length>0 || images.length>0.

## Effects
1. showWebLabel: useEffect([webSearch]) — if !webSearch set false & return; else set true then setTimeout 1000 → false. Cleanup clearTimeout.
2. Click outside: useEffect([isActive]) add mousedown + touchstart on document; handler checks containerRef.current && !contains(e.target) → setIsActive(false). Cleanup removes both.
3. Auto-resize textarea on change: el.style.height='auto'; el.style.height = \`\${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px\`.
4. handleImageUpload: loop files, FileReader.readAsDataURL, push results into images. e.target.value=''.
5. handleSend: clears message + images; resets textarea height.
6. Enter (no shift) preventDefault + handleSend.

## Framer Motion
- Panel: motion.div animate={{ boxShadow: isActive ? ACTIVE_GLOW : baseShadow }} transition = reducedMotion ? {duration:0.15} : {type:'spring', stiffness:350, damping:28}.
- Image thumb: initial {opacity:0, scale:0.8}, animate {opacity:1, scale:1}, exit {opacity:0, scale:0.8}, {type:'spring', stiffness:350, damping:25}.
- AnimatePresence wrapper for thumbnail row: initial {opacity:0, height:0}, animate {opacity:1, height:'auto'}, exit {opacity:0, height:0}.
- Upload/Globe/Send buttons: whileHover {scale:1.08, ...}, whileTap {scale:0.88}, {type:'spring', stiffness:320, damping:20}.
- Model pill: motion.div layoutId="model-pill" absolute inset-0 rounded-lg style bg \`\${color}18\` border \`1px solid \${color}22\` transition {type:'spring', stiffness:400, damping:28}.
- Web-label motion.span: initial {opacity:0, x:-4}, animate {opacity:1, x:0}, exit {opacity:0, x:-4}, {duration:0.15}.

## Hover state
Globe toggle when active: bg \`\${activeModel.color}18\`, border \`1px solid \${activeModel.color}22\`, icon activeModel.color; whileHover background \`\${activeModel.color}28\`. Send button when canSend: bg \`\${activeModel.color}40\`, border \`1px solid \${activeModel.color}66\`, icon activeModel.color. Disabled: bg rgba(255,255,255,0.06), border rgba(255,255,255,0.08), opacity 0.4, pointerEvents none.

## JSX structure
Root div: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Inside: <img> background. Panel wrapper ref=containerRef (w-[calc(100%-2rem)] max-w-[420px]). Panel motion.div (rounded-2xl isolate), blur layer, top highlight, compose col (p-4 pb-2 gap-6): textarea ("Ask anything...", caretColor = activeModel.color, text-white/90 placeholder-white/40); AnimatePresence thumbnails row gap-2; toolbar flex justify-between with left group [ImageSquare 32x32, GlobeSimple 32x32, label] and right Send 36x36. Divider. Model row px-3 py-2.5 — 4 buttons flex-1 rounded-lg px-3 py-1.5, active pill + text-[11px] font-semibold (active=color, inactive='rgba(255,255,255,0.50)').

Icons (weight="regular"): PaperPlaneRight, ImageSquare, GlobeSimple, X. Hidden file input accept="image/*" multiple.`,

  Gemini: `Implement a React client component named \`GlassAiCompose\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { PaperPlaneRight, ImageSquare, GlobeSimple, X } from '@phosphor-icons/react'

## API guardrails
USE only the hooks listed above. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, \`useFramerMotion\`, or helpers not shown. Call useState/useRef/useEffect/useCallback/useReducedMotion at the top of the component function only — never inline in JSX. Icons must be written exactly as \`PaperPlaneRight\`, \`ImageSquare\`, \`GlobeSimple\`, \`X\` with \`weight="regular"\`. Do not use framer-motion's \`useAnimate\` or the \`animate()\` imperative function.

## Constants (module scope)
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'
const MODELS = [
  { label: 'Claude',     color: '#FF7B54' },
  { label: 'ChatGPT',    color: '#10A37F' },
  { label: 'Perplexity', color: '#3A86FF' },
  { label: 'Gemini',     color: '#FFBE0B' },
] as const
type Model = (typeof MODELS)[number]
const MAX_TEXTAREA_HEIGHT = 160
const glassBlur = { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' } as const
const glassPanel = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
} as const
const ACTIVE_GLOW = '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1.5px rgba(255, 255, 255, 0.25), 0 0 20px rgba(255, 255, 255, 0.06)'

## State
isActive (false), message (''), activeModel (MODELS[0]), images (string[] = []), webSearch (false), showWebLabel (false). Refs containerRef, textareaRef, fileInputRef. canSend = message.trim().length > 0 || images.length > 0.

## Effects
1) useEffect([webSearch]): if !webSearch, setShowWebLabel(false), return; otherwise setShowWebLabel(true); const t = setTimeout(() => setShowWebLabel(false), 1000); return () => clearTimeout(t).
2) useEffect([isActive]): if !isActive return; define handler(e) → if containerRef.current && !containerRef.current.contains(e.target as Node) setIsActive(false); document.addEventListener('mousedown', handler); document.addEventListener('touchstart', handler); return cleanup that removes both.
3) resizeTextarea (useCallback): el=textareaRef.current; el.style.height='auto'; el.style.height = \`\${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px\`.
4) handleImageUpload: iterate files, FileReader readAsDataURL, setImages(prev => [...prev, result]). e.target.value=''.
5) handleSend: return if !canSend; clear message, images, reset textarea height. handleKeyDown: Enter no shift → preventDefault+send.

## Framer Motion
- Panel: motion.div animate={{ boxShadow: isActive ? ACTIVE_GLOW : glassPanel.boxShadow }}, transition = reducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 350, damping: 28 }.
- Thumbnail motion.div: initial {opacity:0, scale:0.8}, animate {opacity:1, scale:1}, exit {opacity:0, scale:0.8}, transition {type:'spring', stiffness:350, damping:25}.
- Button hovers (Upload/Globe/Send): whileHover {scale:1.08, ...}, whileTap {scale:0.88}, transition {type:'spring', stiffness:320, damping:20}.
- Model pill: motion.div layoutId="model-pill", transition {type:'spring', stiffness:400, damping:28}.
- Web-label span: initial {opacity:0, x:-4}, animate {opacity:1, x:0}, exit {opacity:0, x:-4}, transition {duration:0.15}.

## Layout
Root: <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">. Background <img src={BACKGROUND} absolute inset-0 object-cover opacity-60 pointer-events-none>. Container ref=containerRef (relative z-10 w-[calc(100%-2rem)] max-w-[420px]).
Panel motion.div rounded-2xl overflow-hidden isolate, style: glassPanel background+border. Children: blur layer; top highlight (left-6 right-6 top-0 h-[1px]); compose col (relative z-10 flex flex-col gap-6 p-4 pb-2): textarea ("Ask anything...", caretColor = activeModel.color, text-white/90 placeholder-white/40, resize-none, maxHeight MAX_TEXTAREA_HEIGHT), AnimatePresence thumbs row, toolbar flex justify-between — left group with Upload 32x32 rounded-xl, Globe toggle 32x32 (when webSearch bg \`\${activeModel.color}18\`/border \`\${activeModel.color}22\`/icon activeModel.color), "Web search on" animated span text-[10px] color \`\${activeModel.color}88\`; right Send button 36x36 rounded-xl colored accent based on canSend; divider mx-4 h-[1px] rgba(255,255,255,0.07); model switcher row px-3 py-2.5 with 4 buttons flex-1 rounded-lg px-3 py-1.5 and layoutId="model-pill" highlight. Labels text-[11px] font-semibold. Icons size 16 except X size 10. Hidden <input type="file" accept="image/*" multiple>.

No \`any\` types. No props. Named export \`GlassAiCompose\`.`,

  V0: `Create a GlassAiCompose component — a floating frosted-glass AI prompt composer centered over a dreamy orange-flower background photo (opacity 60). It looks like an Apple-style chat input card.

The card (rounded-2xl, max-width 420px) has a semi-transparent white fill (about 8%), a fine 1px white border, a deep ambient drop shadow with a subtle inset top highlight, and a 24px backdrop blur with 1.8 saturation (apply the blur on a separate absolute-positioned child so it doesn't re-render on every keystroke). A faint 1px gradient highlight line runs across the top edge. When the textarea is focused, the whole card gains a subtle white ring + 20px outer glow (spring transition).

Inside, top to bottom: a multiline textarea with placeholder "Ask anything...", text in white/90, placeholder white/40, auto-growing up to 160px. The caret color matches the currently active model. Press Enter to send, Shift+Enter for newline. Clicking outside the card removes the focus glow.

Below the textarea, a toolbar row. Left group: a 32px rounded-xl image upload button (ImageSquare icon) and a 32px rounded-xl web-search toggle (GlobeSimple). Both have a glassy neutral fill by default; when web-search is on, the toggle tints to the active model's color and a small "Web search on" label (text-[10px], colored) fades in for ~1 second next to it. Right side: a 36px rounded-xl Send button (PaperPlaneRight) that lights up in the active model's color (bg at 40%, border at 66%) when there's text or an attached image, and dims to 40% opacity otherwise.

Uploaded images appear as a row of 64px rounded-xl thumbnails between the textarea and toolbar, each with a tiny X button (dark round) to remove it. Thumbnails pop in with a springy scale.

Under a thin divider line, a four-up model switcher: Claude (#FF7B54), ChatGPT (#10A37F), Perplexity (#3A86FF), Gemini (#FFBE0B). The active model gets a pill-shaped tinted background in its own color at ~10% opacity that slides between models using Framer Motion's layoutId ("model-pill"). Active label is colored, inactive is white/50. Switching models retints the caret, the send button, and the web-search toggle.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Icons: PaperPlaneRight, ImageSquare, GlobeSimple, X.`,
}
