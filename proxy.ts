/**
 * Edge proxy — logs every request to /r/* (the registry) to PostHog.
 *
 * Why: shadcn CLI installs and the AI Canvas MCP both fetch
 * /r/<slug>.json. Logging here gives us per-component install counts
 * without touching either client.
 *
 * Safety:
 *   - POSTHOG_KEY missing → silently no-op, request passes through unchanged
 *   - PostHog down or slow → fire-and-forget via event.waitUntil(), never blocks the response
 *   - Any thrown error → caught, logged to stderr, request still served
 *
 * Distinguishing CLI from MCP traffic comes from the User-Agent header:
 *   - "aicanvas-mcp/x.y.z" → MCP
 *   - anything else (typically "shadcn/...", "node-fetch/...") → CLI or browser
 */

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

const POSTHOG_KEY = process.env.POSTHOG_KEY
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com'

export function proxy(request: NextRequest, event: NextFetchEvent) {
  try {
    if (POSTHOG_KEY) {
      event.waitUntil(logRegistryHit(request))
    }
  } catch (err) {
    // Never let logging break the request
    console.error('[proxy] logging failed:', err)
  }
  return NextResponse.next()
}

async function logRegistryHit(request: NextRequest): Promise<void> {
  try {
    const { pathname } = request.nextUrl
    // /r/foo.json → "foo"; /r/aicanvas-mcp.json → "aicanvas-mcp" (the index)
    const match = pathname.match(/^\/r\/(.+?)\.json$/)
    if (!match) return

    const slug = match[1]
    const ua = request.headers.get('user-agent') ?? ''
    const client = ua.startsWith('aicanvas-mcp/')
      ? 'mcp'
      : ua.toLowerCase().includes('mozilla')
        ? 'browser'
        : 'cli'

    // PostHog event payload — anonymous; distinct_id derived from UA so
    // repeat hits from the same client coalesce without identifying users.
    const payload = {
      api_key: POSTHOG_KEY,
      event: 'registry_hit',
      distinct_id: `${client}:${hashUa(ua)}`,
      properties: {
        slug,
        client,
        user_agent: ua,
        country: request.headers.get('x-vercel-ip-country') ?? undefined,
        region: request.headers.get('x-vercel-ip-country-region') ?? undefined,
        path: pathname,
        $process_person_profile: false,
      },
      timestamp: new Date().toISOString(),
    }

    await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[proxy] posthog ingest failed:', err)
  }
}

function hashUa(ua: string): string {
  let h = 0
  for (let i = 0; i < ua.length; i++) {
    h = (h * 31 + ua.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

export const config = {
  matcher: '/r/:path*',
}
