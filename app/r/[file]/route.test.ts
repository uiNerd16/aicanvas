import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'

// Mock ONLY getEntitlement — everything else (classifyContent + loadContentLookup
// reading registry-data/_manifest.json, and readFile reading the real
// registry-data/<slug>.json) runs against the REAL local files. That is the
// point: this test locks in the route's per-TIER behaviour end to end, with the
// only stub being the identity/tier resolution.
vi.mock('@/app/lib/entitlement', () => ({ getEntitlement: vi.fn() }))

import { GET } from './route'
import { getEntitlement } from '@/app/lib/entitlement'

const mockedGetEntitlement = vi.mocked(getEntitlement)

// A REAL free standalone that exists in registry-data/ and is NOT listed in the
// manifest's premiumSlugs / designSystemSlugs / templateSlugs / systemSlugs — so
// classifyContent returns 'standalone'. Its real source contains both 'useState'
// and 'export default', which the gate's placeholder stubs deliberately omit.
const SLUG = 'peel-corner-reveal'
const FILE = `${SLUG}.json`

function call() {
  const req = new NextRequest(`http://localhost/r/${FILE}`)
  return GET(req, { params: Promise.resolve({ file: FILE }) })
}

const REAL_SOURCE_MARKERS = ['useState', 'useEffect', 'export default']

beforeEach(() => {
  mockedGetEntitlement.mockReset()
})

afterEach(() => {
  delete process.env.FREE_ACCOUNT_GATE
})

describe('GET /r/<free-standalone>.json — per-tier install gate', () => {
  it('case 1: gate ON + anonymous → free-account stub (no real source)', async () => {
    process.env.FREE_ACCOUNT_GATE = 'on'
    mockedGetEntitlement.mockResolvedValue({ tier: 'anonymous', userId: null })

    const res = await call()
    const body = await res.text()

    expect(res.status).toBe(200)
    expect(res.headers.get('X-AICanvas-Content-Type')).toBe('free-account-required')
    // Steers the user to create a free account.
    expect(body).toContain('account/sign-up')
    // ZERO real source: the stub must not leak the component's actual code.
    expect(body).not.toContain('useState')
    expect(body).not.toContain('useEffect')
  })

  it("case 2: gate ON + signed-in 'free' tier → REAL standalone source (the gap this closes)", async () => {
    process.env.FREE_ACCOUNT_GATE = 'on'
    mockedGetEntitlement.mockResolvedValue({ tier: 'free', userId: 'u1' })

    const res = await call()
    const body = await res.text()

    expect(res.status).toBe(200)
    expect(res.headers.get('X-AICanvas-Content-Type')).toBe('standalone')
    // A signed-in free account gets the real, unstubbed source.
    expect(body).toContain('useState')
    expect(body).toContain('export default')
  })

  it('case 3: gate ON + premium tier → REAL standalone source', async () => {
    process.env.FREE_ACCOUNT_GATE = 'on'
    mockedGetEntitlement.mockResolvedValue({ tier: 'premium', userId: 'u1' })

    const res = await call()
    const body = await res.text()

    expect(res.status).toBe(200)
    expect(res.headers.get('X-AICanvas-Content-Type')).toBe('standalone')
    expect(body).toContain('useState')
    expect(body).toContain('export default')
  })

  it('case 4: gate ON + getEntitlement throws → REAL source (FAIL OPEN)', async () => {
    process.env.FREE_ACCOUNT_GATE = 'on'
    mockedGetEntitlement.mockRejectedValue(new Error('db blip'))

    const res = await call()
    const body = await res.text()

    expect(res.status).toBe(200)
    expect(res.headers.get('X-AICanvas-Content-Type')).toBe('standalone')
    // Free standalone source is public anyway → a transient error fails OPEN.
    expect(body).toContain('useState')
    expect(body).toContain('export default')
  })

  it('case 5: gate UNSET (dormant) + anonymous → REAL source', async () => {
    delete process.env.FREE_ACCOUNT_GATE
    mockedGetEntitlement.mockResolvedValue({ tier: 'anonymous', userId: null })

    const res = await call()
    const body = await res.text()

    expect(res.status).toBe(200)
    expect(res.headers.get('X-AICanvas-Content-Type')).toBe('standalone')
    // With the kill-switch off, anonymous installs receive the real source,
    // exactly as before the gate shipped.
    for (const marker of REAL_SOURCE_MARKERS) {
      expect(body).toContain(marker)
    }
  })
})

// The servable brain item only exists on vault-reachable builds (inject-premium
// writes it from the private source). Skip cleanly on free-only builds — the
// gate logic itself is still covered by content-type.test.ts.
const BRAIN_FILE = 'andromeda-brain.json'
const brainAvailable = existsSync(join(process.cwd(), 'registry-data', BRAIN_FILE))

function callBrain() {
  const req = new NextRequest(`http://localhost/r/${BRAIN_FILE}`)
  return GET(req, { params: Promise.resolve({ file: BRAIN_FILE }) })
}

describe.skipIf(!brainAvailable)('GET /r/andromeda-brain.json — mode-independent premium gate', () => {
  it('anonymous → 200 locked placeholder, zero rules content', async () => {
    mockedGetEntitlement.mockResolvedValue({ tier: 'anonymous', userId: null })

    const res = await callBrain()
    const item = await res.json()

    expect(res.status).toBe(200)
    expect(res.headers.get('X-AICanvas-Content-Type')).toBe('brain')
    expect(res.headers.get('Cache-Control')).toBe('private, no-store')
    // ONE placeholder .md steering to /pricing — never the real corpus.
    expect(item.files).toHaveLength(1)
    expect(item.files[0].target).toContain('BRAIN-LOCKED.md')
    expect(item.files[0].content).toContain('aicanvas.me/pricing')
  })

  it("signed-in 'free' tier → same locked placeholder", async () => {
    mockedGetEntitlement.mockResolvedValue({ tier: 'free', userId: 'u1' })

    const res = await callBrain()
    const item = await res.json()

    expect(res.status).toBe(200)
    expect(item.files).toHaveLength(1)
    expect(item.files[0].content).toContain('aicanvas.me/pricing')
  })

  it('premium tier → the REAL brain: every file, registry:file with ~/ targets', async () => {
    mockedGetEntitlement.mockResolvedValue({ tier: 'premium', userId: 'u1' })

    const res = await callBrain()
    const item = await res.json()

    expect(res.status).toBe(200)
    expect(item.name).toBe('andromeda-brain')
    expect(item.files.length).toBeGreaterThan(10)
    const index = item.files.find((f: { path: string }) => f.path === 'design-systems/andromeda/rules.md')
    expect(index).toBeDefined()
    expect(index.type).toBe('registry:file')
    expect(index.target).toBe('~/design-systems/andromeda/rules.md')
    expect(index.content.length).toBeGreaterThan(100)
  })

  it('entitlement error → 503, fail CLOSED (never premium bytes)', async () => {
    mockedGetEntitlement.mockRejectedValue(new Error('db blip'))

    const res = await callBrain()

    expect(res.status).toBe(503)
    const body = await res.text()
    expect(body).not.toContain('registry:file')
  })
})
