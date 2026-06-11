import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'

export const runtime = 'nodejs'

const DATA_DIR = join(process.cwd(), 'registry-data')

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params
  // Only allow simple `<slug>.json` names — no path traversal.
  if (!/^[a-z0-9-]+\.json$/.test(file)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  let body: string
  try {
    body = await readFile(join(DATA_DIR, file), 'utf8')
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const lookup = loadContentLookup()
  const contentType = classifyContent(file, lookup)

  // Plan 1: PERMISSIVE. Returns identical bytes to the old static files, but
  // routes every request through the classifier so the entitlement gate has a
  // home in Plan 3 (where this becomes per-caller and conditionally 402s).
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-AICanvas-Content-Type': contentType,
      'Cache-Control': 'public, max-age=300',
    },
  })
}
