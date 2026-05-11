import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // Anonymous CLI copies are valid; just don't record them.
  if (!user) return new NextResponse(null, { status: 204 })

  const body = await request.json().catch(() => null)
  if (!body?.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const { error } = await supabase
    .from('install_history')
    .insert({
      user_id: user.id,
      slug: body.slug,
      system: body.system ?? null,
      pkg_manager: body.pkg_manager ?? null,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
