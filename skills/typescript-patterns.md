# TypeScript Patterns

This project uses TypeScript 5 with `strict: true`. No `any`. No type assertions unless truly unavoidable.

## Stack versions

```
next:         16.2.1
react:        19.2.4
react-dom:    19.2.4
framer-motion: ^12.38.0
three:        ^0.183.2
typescript:   ^5
```

React Compiler is enabled (`reactCompiler: true` in `next.config.ts`). Do not fight the compiler — avoid patterns it cannot optimize (e.g. mutating props, conditional hooks).

## Component structure

```tsx
'use client'

import { motion, useMotionValue } from 'framer-motion'
import type { ComponentType } from 'react'

// Props interface — export if other files need it
interface MyComponentProps {
  label: string
  accent?: boolean  // optional props use ?
}

export function MyComponent({ label, accent = false }: MyComponentProps) {
  return <div>{label}</div>
}
```

## Event handlers

```tsx
// Inline arrow — fine for simple handlers
<div onMouseEnter={() => setHovered(true)} />

// Named function — preferred when handler has logic
function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  x.set(e.clientX - rect.left)
}
<div onMouseMove={handleMouseMove} />

// Common event types
React.MouseEvent<HTMLDivElement>
React.MouseEvent<HTMLButtonElement>
React.PointerEvent<HTMLDivElement>
React.KeyboardEvent<HTMLDivElement>
React.WheelEvent<HTMLDivElement>
```

## Refs

```tsx
import { useRef } from 'react'

const containerRef = useRef<HTMLDivElement>(null)
const canvasRef    = useRef<HTMLCanvasElement>(null)
const animRef      = useRef<number>(0)         // for RAF id
const aliveRef     = useRef<boolean>(true)     // for cleanup guard

// Always null-check before using
if (!containerRef.current) return
const width = containerRef.current.clientWidth
```

## MotionValues — typed correctly

```tsx
import { useMotionValue, useTransform, MotionValue } from 'framer-motion'

const x = useMotionValue(0)           // MotionValue<number>
const y = useMotionValue(0)
const opacity = useMotionValue(1)

// useTransform — input and output ranges must match length
const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15])

// Passing MotionValue as prop
interface CardProps {
  rotateX: MotionValue<number>
}
```

## useState — typed correctly

```tsx
// TypeScript infers from initial value
const [hovered, setHovered] = useState(false)    // boolean
const [count, setCount]     = useState(0)         // number
const [label, setLabel]     = useState('')        // string

// Explicit type when inference fails
const [theme, setTheme] = useState<'dark' | 'light'>('dark')
const [items, setItems] = useState<string[]>([])

// Functional update pattern
setCount((prev) => prev + 1)
setItems((prev) => [...prev, newItem])
```

## String literal unions

```tsx
// Prefer type unions over enums
type Direction = 'up' | 'down' | 'left' | 'right'
type Status    = 'idle' | 'loading' | 'error'

// Platform type — already defined in app/components/ComponentCard.tsx
// Import it, don't redefine it
import type { Platform } from '../../app/components/ComponentCard'
```

## Dynamic imports (Three.js, canvas)

```tsx
useEffect(() => {
  let alive = true

  // Three.js must be dynamically imported — it's browser-only
  import('three').then(({ WebGLRenderer, Scene, PerspectiveCamera }) => {
    if (!alive) return

    const renderer = new WebGLRenderer({ canvas: canvasRef.current! })
    // ... setup

    function animate() {
      if (!alive) return
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  })

  return () => {
    alive = false
    // dispose renderer, geometries, materials here
  }
}, [])
```

## Non-null assertion — use sparingly

```tsx
// Only when you are certain the value cannot be null
// and TypeScript cannot infer it
const ctx = canvasRef.current!.getContext('2d')!

// Prefer null-check when possible
const canvas = canvasRef.current
if (!canvas) return
const ctx = canvas.getContext('2d')
if (!ctx) return
```

## Type imports

```tsx
// Use `import type` for type-only imports — required with isolatedModules
import type { ComponentType, ReactNode } from 'react'
import type { MotionValue } from 'framer-motion'
import type { Platform } from '../../app/components/ComponentCard'
```

## What strict mode enforces

- No implicit `any` — all parameters must be typed
- No unused variables (will error — remove or prefix with `_`)
- Strict null checks — `null` and `undefined` are not assignable unless explicit
- `noUncheckedIndexedAccess` not enabled — array indexing returns `T`, not `T | undefined`
