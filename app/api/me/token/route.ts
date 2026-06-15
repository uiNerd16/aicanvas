import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Returns the signed-in user's API token so the website can bake it into the
 * copied CLI/MCP commands. RLS restricts the select to the caller's own row.
 * Resilient: any error (e.g. table not yet migrated) returns `{ token: null }`,
 * so the UI falls back to the plain anonymous command instead of breaking.
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ token: null })

  const { data, error } = await supabase
    .from('user_api_keys')
    .select('token')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ token: null })
  return NextResponse.json({ token: data?.token ?? null })
}
