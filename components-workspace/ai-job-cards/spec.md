# Spec: AI Job Cards

**Component:** AI Job Cards
**Slug:** `ai-job-cards`
**design-system:** standalone

## Description
A responsive grid of AI-industry job listing cards. Soft pale blue-grey page background, warm cream card surfaces, inline AI company brand logos, bookmark toggle, and spring-based hover interactions.

## Visual

### Page / container
- Background: pale blue-grey `#CADBDD` (light), `#0d0d0c` (dark)
- Grid: 3-col desktop → 2-col tablet → 1-col mobile, `gap-4`

### Card anatomy (top → bottom)
1. **Top row:** Rate badge (`$120/hr`) left — outline bookmark icon right
2. **Title block:** Large bold job title (2–3 lines), arrow `→` bottom-right
3. **Pagination dots:** 3 dots, one filled — decorative indicator
4. **Divider**
5. **Bottom row:** AI brand logo (24px) + role label — dark pill "View" button

### Card styling
- Background: `#F7F7EF` (light cream), dark: `#1e1e1c`
- Border radius: `rounded-2xl`
- Shadow: subtle `shadow-sm`, deepens on hover
- Card size: fills column width, min-height ~220px

## Cards data (6 cards)

| Rate | Title | Company | Logo |
|---|---|---|---|
| $120/hr | Prompt Engineer | Anthropic | Claude |
| $150/hr | AI Product Manager | OpenAI | GPT |
| $130–160/hr | LLM Platform Engineer | Google | Gemini |
| $140/hr | AI Infrastructure Lead | Vercel | Vercel |
| $125/hr | ML Safety Researcher | Mistral | Mistral |
| $160/hr | Generative AI Lead | Perplexity | Perplexity |

## Brand logos
All inlined as small SVG React components — no external deps. Logos:
- **Claude/Anthropic** — use Anthropic's stylised "A" or Claude's circular logomark
- **OpenAI/GPT** — OpenAI flower/bloom SVG mark
- **Google Gemini** — Gemini star/sparkle mark
- **Vercel** — triangle mark (already in `/public/vercel.svg`)
- **Mistral** — Mistral's orange/red pinwheel/grid mark
- **Perplexity** — Perplexity's "P" or star burst mark

## Behaviour
- **Mount:** cards stagger-reveal with `staggerChildren: 0.08`, `y: 20 → 0`, `opacity: 0 → 1`
- **Card hover:** `y: -4`, shadow deepens, spring `{ stiffness: 300, damping: 20 }`
- **Bookmark:** click toggles filled ↔ outline, spring scale pop `1 → 1.3 → 1`, colour shifts to rose/pink when saved
- **View button:** hover `scale: 1.03`, press `scale: 0.97`, spring easing

## Mobile
- 1-column stack, cards full-width
- All interactions preserved via `onClick` (tap-friendly)
- Minimum readable text at 320px width

## Tech notes
- `'use client'` required
- No external icon libraries — all brand SVGs inline
- `useTheme` from `../../app/components/ThemeProvider` for hex colour switching
- Framer Motion for all animations
- Static data array — no API calls
