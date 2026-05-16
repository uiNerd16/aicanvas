import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../lib/supabase/server'
import type { AiPlatform, PackageManager } from '../../lib/supabase/types'

const PKG_VALUES: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']
const AI_VALUES: AiPlatform[] = ['Claude Code', 'Lovable', 'V0']

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ preferences: null })

  const { data, error } = await supabase
    .from('user_preferences')
    .select('package_manager, ai_platform, newsletter_opt_in')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('[preferences GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({
    preferences: {
      package_manager: data?.package_manager ?? null,
      ai_platform: data?.ai_platform ?? null,
      // newsletter_opt_in defaults to true at the DB level (migration 0004) —
      // mirror that here for users who don't yet have a row.
      newsletter_opt_in: data?.newsletter_opt_in ?? true,
    },
  })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'invalid body' }, { status: 400 })

  const pkg = body.package_manager
  const platform = body.ai_platform
  const newsletter = body.newsletter_opt_in

  if (pkg !== null && pkg !== undefined && !PKG_VALUES.includes(pkg)) {
    return NextResponse.json({ error: 'invalid package_manager' }, { status: 400 })
  }
  if (platform !== null && platform !== undefined && !AI_VALUES.includes(platform)) {
    return NextResponse.json({ error: 'invalid ai_platform' }, { status: 400 })
  }
  if (newsletter !== undefined && typeof newsletter !== 'boolean') {
    return NextResponse.json({ error: 'invalid newsletter_opt_in' }, { status: 400 })
  }

  // Only include fields the client explicitly sent. Without this, a partial
  // update (e.g. just toggling newsletter_opt_in) would clobber other fields
  // to null when the client's in-memory preferences haven't loaded yet.
  const upsert: {
    user_id: string
    package_manager?: PackageManager | null
    ai_platform?: AiPlatform | null
    newsletter_opt_in?: boolean
    updated_at: string
  } = {
    user_id: user.id,
    updated_at: new Date().toISOString(),
  }
  if (pkg !== undefined) upsert.package_manager = pkg
  if (platform !== undefined) upsert.ai_platform = platform
  if (newsletter !== undefined) upsert.newsletter_opt_in = newsletter

  const { error } = await supabase
    .from('user_preferences')
    .upsert(upsert)

  if (error) {
    console.error('[preferences PUT]', error, 'payload:', upsert)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
