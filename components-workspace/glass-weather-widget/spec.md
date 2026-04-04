# Glass Weather Widget — Spec

## Component
- **Name**: Glass Weather Widget
- **Slug**: `glass-weather-widget`
- **Description**: An animated glassmorphism weather card with live particles, cycling weather states, and a real-time clock.

## Visual
- Large rounded glass card — same frosted glass aesthetic as Glass Dock/Sidebar (rgba white, backdrop-blur, squircle-inspired corners)
- Inside the card:
  - Top row: city name (left) + large temperature (right)
  - Second row: condition label + High / Low temps
  - Animated particle layer rendered on canvas behind the text content
  - Bottom row: 4 hourly slots (time / icon / temp), each in a mini glass pill
  - Weather-condition dots at very bottom to cycle states
- Full-bleed gradient background behind the card that shifts per condition:
  - Sunny  → warm amber/orange gradient
  - Cloudy → cool blue-grey (matches reference image)
  - Rainy  → deep indigo/navy
  - Snowy  → pale blue-white

## Particles (canvas, per condition)
- **Sunny**: slow drifting sun-ray glints / lens-flare specks
- **Cloudy**: soft rounded cloud shapes drifting left
- **Rainy**: diagonal rain streaks falling downward
- **Snowy**: gentle falling snowflakes with subtle rotation

## Behaviour
- On mount: staggered entrance — card slides up, content fades in line by line
- Condition dot tap cycles weather state; gradient and particles cross-fade
- Temperature animates with count-up spring on condition change
- Hourly pills: spring scale on hover
- Live clock: current hour slot updates every minute via setInterval

## Weather states (4)
| State  | Condition | Temp | High | Low | Gradient |
|--------|-----------|------|------|-----|----------|
| Sunny  | Sunny     | 22°  | 25°  | 14° | amber → orange |
| Cloudy | Cloudy    | -1°  | 1°   | -4° | slate → blue-grey |
| Rainy  | Rainy     | 14°  | 16°  | 11° | indigo → navy |
| Snowy  | Snowing   | -5°  | -2°  | -8° | pale blue → white |

City: "Tallinn" (fixed)

## Hourly slots (per state)
Each state has 4 hourly entries: { hour, icon (Phosphor), temp }
- Phosphor icons used: Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudSnow

## Tech notes
- Canvas for particles — RAF loop with `alive` guard pattern for cleanup
- Each weather state is a typed data object
- Temperature count-up: `useSpring` on a MotionValue, display with `useTransform` rounding to integer
- `AnimatePresence` for gradient layer cross-fade on condition change
- Builder should read `.claude/skills/creative-3d-components/SKILL.md` for particle and glow recipes
