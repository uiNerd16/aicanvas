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
    .select('package_manager, ai_platform')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    preferences: {
      package_manager: data?.package_manager ?? null,
      ai_platform: data?.ai_platform ?? null,
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
  if (pkg !== null && pkg !== undefined && !PKG_VALUES.includes(pkg)) {
    return NextResponse.json({ error: 'invalid package_manager' }, { status: 400 })
  }
  if (platform !== null && platform !== undefined && !AI_VALUES.includes(platform)) {
    return NextResponse.json({ error: 'invalid ai_platform' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      package_manager: pkg ?? null,
      ai_platform: platform ?? null,
      updated_at: new Date().toISOString(),
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
