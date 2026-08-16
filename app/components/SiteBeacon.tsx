'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { beacon } from '../lib/analytics'

/**
 * Renders nothing. Two anonymous signals to /api/e:
 *
 * 1. SPA pageviews — prefetched static routes are served from the router
 *    cache, so client-side navigations mostly never reach the server and
 *    proxy.ts cannot count them. This effect fires on every pathname
 *    change after the first (the initial document load is counted
 *    server-side).
 * 2. Uncaught JS errors and unhandled rejections — deduped per message
 *    and capped per pageload so an error inside a render loop cannot burn
 *    the event budget. Email-shaped substrings are scrubbed before send:
 *    error messages are the one place personal data could sneak into an
 *    otherwise anonymous pipeline.
 */
const MAX_ERRORS_PER_LOAD = 10
// Plain and URL-encoded (%40) email shapes — applied to message AND source,
// since a filename/URL in `source` can carry an address too.
const EMAIL = /[^\s@]+(?:@|%40)[^\s@]+\.[^\s@]+/gi
const scrub = (s: string) => s.replace(EMAIL, '[email]')

export function SiteBeacon() {
  const pathname = usePathname()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if (prevPath.current !== null && prevPath.current !== pathname) {
      beacon('$pageview', {
        $current_url: location.origin + pathname,
        $pathname: pathname,
        $referrer: prevPath.current,
        nav: 'spa',
      })
    }
    prevPath.current = pathname
  }, [pathname])

  useEffect(() => {
    const seen = new Set<string>()

    function report(message: string, source: string) {
      if (seen.size >= MAX_ERRORS_PER_LOAD || seen.has(message)) return
      seen.add(message)
      beacon('js_error', {
        message: scrub(message).slice(0, 300),
        source: scrub(source).slice(0, 200),
      })
    }

    function onError(e: ErrorEvent) {
      report(e.message || 'unknown error', `${e.filename ?? ''}:${e.lineno ?? 0}`)
    }
    function onRejection(e: PromiseRejectionEvent) {
      const r: unknown = e.reason
      report(r instanceof Error ? r.message : String(r), 'unhandledrejection')
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return null
}
