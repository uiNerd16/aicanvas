/**
 * Edge proxy — two responsibilities:
 *
 * 1. /r/* registry hits → log to PostHog (anonymous, fire-and-forget)
 * 2. Everything else → refresh the Supabase auth-session cookie
 *
 * /r/* is fetched by the shadcn CLI and the AI Canvas MCP, both anonymous.
 * Running Supabase there would just waste cycles. Everything else may carry
 * a logged-in user's cookie — the Supabase session needs a refresh hop here
 * because Server Components can't write cookies themselves.
 */

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { updateSession } from './app/lib/supabase/proxy'

const POSTHOG_KEY = process.env.POSTHOG_KEY
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com'

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/r/')) {
    try {
      if (POSTHOG_KEY) {
        event.waitUntil(logRegistryHit(request))
      }
    } catch (err) {
      console.error('[proxy] logging failed:', err)
    }
    return NextResponse.next()
  }

  return await updateSession(request)
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
  // Skip Next internals + common static assets. Everything else is either
  // /r/* (PostHog branch) or runs through Supabase session refresh.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
