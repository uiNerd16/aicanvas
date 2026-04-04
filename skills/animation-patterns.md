# Animation Patterns

All animations use Framer Motion. No CSS-only keyframes. Ever.

## Core rule: MotionValues over useState

```tsx
// WRONG — never use useState for animation values
const [rotation, setRotation] = useState(0)

// CORRECT — use MotionValues
import { useMotionValue, useTransform, animate } from 'framer-motion'
const rotation = useMotionValue(0)
```

## Entrance animations

Standard entrance — fade + slide up:
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
```

Staggered children:
```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item}>...</motion.li>
</motion.ul>
```

## Hover interactions

Spring-based hover (preferred over duration-based):
```tsx
<motion.div
  whileHover={{ scale: 1.04 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
```

Hover with MotionValue tracking:
```tsx
const x = useMotionValue(0)
const y = useMotionValue(0)

function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  x.set(e.clientX - rect.left - rect.width / 2)
  y.set(e.clientY - rect.top - rect.height / 2)
}
```

## Programmatic animation with cleanup

Always guard with an `alive` flag and return a cleanup function:

```tsx
useEffect(() => {
  let alive = true

  async function run() {
    while (alive) {
      await animate(value, 100, { duration: 1, ease: 'easeInOut' })
      if (!alive) break
      await animate(value, 0, { duration: 1, ease: 'easeInOut' })
    }
  }

  run()
  return () => { alive = false }
}, [])
```

## Spring presets

| Feel | Config |
|---|---|
| Snappy UI | `{ type: 'spring', stiffness: 400, damping: 30 }` |
| Smooth / natural | `{ type: 'spring', stiffness: 200, damping: 20 }` |
| Bouncy | `{ type: 'spring', stiffness: 300, damping: 12 }` |
| Slow / weighty | `{ type: 'spring', stiffness: 100, damping: 25 }` |

## useTransform — derive values from MotionValues

```tsx
const x = useMotionValue(0)
// map x from [-100, 100] to [-15, 15] degrees rotation
const rotate = useTransform(x, [-100, 100], [-15, 15])

<motion.div style={{ x, rotate }} />
```

## Dynamic imports for browser-only APIs

Three.js, canvas, and other browser-only libs must be dynamically imported with an alive guard:

```tsx
useEffect(() => {
  let alive = true

  import('three').then(({ Scene, PerspectiveCamera }) => {
    if (!alive) return
    // setup here
  })

  return () => { alive = false }
}, [])
```

## RAF cleanup

```tsx
useEffect(() => {
  let rafId: number

  function tick() {
    // update logic
    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(rafId)
}, [])
```
