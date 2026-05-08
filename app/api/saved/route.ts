import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ slugs: [] })

  const { data, error } = await supabase
    .from('saved_components')
    .select('slug')
    .order('saved_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ slugs: (data ?? []).map((row: { slug: string }) => row.slug) })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body?.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const { error } = await supabase
    .from('saved_components')
    .upsert({ user_id: user.id, slug: body.slug, system: body.system ?? null })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body?.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const { error } = await supabase
    .from('saved_components')
    .delete()
    .eq('slug', body.slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
