'use client'

// Remounts on every route change (that is what a template.tsx is for), which
// makes it the place that plays the page-enter fade on client-side
// navigations. It renders NO wrapper element: the animation is applied to the
// existing scroll column so the layout's scroll and height contracts stay
// untouched. Duration lives with the keyframe in globals.css.

import { useEffect, type ReactNode } from 'react'

const ENTER_MS = 200

let initialLoad = true

export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    // The very first mount is the full page load: the server HTML is already
    // painted (and heroes carry their own entrances), so only client-side
    // navigations animate.
    if (initialLoad) {
      initialLoad = false
      return
    }
    const col = document.querySelector<HTMLElement>('.app-scroll-column')
    if (!col) return
    col.classList.remove('aic-page-enter')
    // Forces a style flush so re-adding the class restarts the animation even
    // when the previous run has not finished.
    void col.offsetWidth
    col.classList.add('aic-page-enter')
    const done = () => col.classList.remove('aic-page-enter')
    col.addEventListener('animationend', done, { once: true })
    const timer = setTimeout(done, ENTER_MS + 200)
    return () => {
      clearTimeout(timer)
      col.removeEventListener('animationend', done)
      done()
    }
  }, [])

  return <>{children}</>
}
