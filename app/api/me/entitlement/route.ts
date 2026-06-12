import { NextRequest, NextResponse } from 'next/server'
import { getEntitlement } from '@/app/lib/entitlement'

export const runtime = 'nodejs'

/**
 * Returns the caller's real tier ({ tier }) for client UI that needs to reflect
 * subscription state (e.g. the pricing page hiding "Go Premium" for premium
 * users). Resolves via session or token, same as the gate.
 */
export async function GET(req: NextRequest) {
  try {
    const { tier } = await getEntitlement(req)
    return NextResponse.json({ tier })
  } catch {
    return NextResponse.json({ tier: 'anonymous' })
  }
}
