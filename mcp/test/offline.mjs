#!/usr/bin/env node
/**
 * Offline / network-failure test + local-registry coverage.
 *
 * Phase A — server pointed at a deliberately unreachable URL, verifies that:
 *   1. The server starts and responds to initialize (no startup network)
 *   2. tools/list works (schemas are local; no network)
 *   3. Tool calls that NEED the registry return a graceful isError (not
 *      a crash, not a swallowed exception)
 *   4. The process stays alive (one bad call doesn't kill the server)
 *
 * Phase B — server pointed at a LOCAL static file server rooted at
 * registry-data/ (the exact files the generator emits, including the new
 * systemComponents bucket). No network. Verifies the design-system parity:
 *   - list_systems returns andromeda
 *   - get_system('andromeda') returns files AND surfaces tokensInstallCommand
 *     + componentSlugs
 *   - get_template resolves a real template
 *   - get_component / get_install_command resolve a DS component slug
 *     ('andromeda-heat-grid') via the systemComponents fallback
 *   - search_components surfaces a DS component
 */

import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const SERVER = new URL('../dist/index.js', import.meta.url).pathname
const BAD_URL = 'http://127.0.0.1:1/r' // Port 1 — guaranteed unreachable
// registry-data/ lives at the repo root, two levels up from mcp/test/.
const REGISTRY_DATA_DIR = new URL('../../registry-data/', import.meta.url).pathname

let pass = 0
let fail = 0
const failures = []

function record(name, ok, detail) {
  if (ok) {
    pass++
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    failures.push(`${name}: ${detail}`)
    console.log(`  ✗ ${name}  — ${detail}`)
  }
}

class McpClient {
  constructor(registryBase = BAD_URL) {
    this.proc = spawn('node', [SERVER], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, AICANVAS_REGISTRY_BASE: registryBase },
    })
    this.buf = ''
    this.pending = new Map()
    this.nextId = 1
    this.stderr = ''

    this.proc.stdout.setEncoding('utf-8')
    this.proc.stdout.on('data', (chunk) => {
      this.buf += chunk
      let nl
      while ((nl = this.buf.indexOf('\n')) !== -1) {
        const line = this.buf.slice(0, nl).trim()
        this.buf = this.buf.slice(nl + 1)
        if (!line) continue
        try {
          const msg = JSON.parse(line)
          if (msg.id != null && this.pending.has(msg.id)) {
            const { resolve } = this.pending.get(msg.id)
            this.pending.delete(msg.id)
            resolve(msg)
          }
        } catch {}
      }
    })
    this.proc.stderr.setEncoding('utf-8')
    this.proc.stderr.on('data', (chunk) => {
      this.stderr += chunk
    })
  }

  request(method, params) {
    const id = this.nextId++
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`timeout: ${method}`))
      }, 30000)
      this.pending.set(id, {
        resolve: (m) => {
          clearTimeout(timer)
          resolve(m)
        },
      })
      this.proc.stdin.write(
        JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n',
      )
    })
  }

  notify(method, params) {
    this.proc.stdin.write(
      JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n',
    )
  }

  async close() {
    this.proc.stdin.end()
    await new Promise((r) => this.proc.once('exit', r))
  }

  isAlive() {
    return this.proc.exitCode == null
  }
}

// ── Local static registry server ───────────────────────────────────────────────
// Serves registry-data/<file> over HTTP so the MCP can fetch real, locally
// generated metadata (aicanvas-mcp.json) and per-slug source — no network, no
// production dependency. The MCP requests `${base}/<name>.json`, so the base
// must point at this server's root.
function startLocalRegistry() {
  return new Promise((resolve) => {
    const srv = createServer(async (req, res) => {
      try {
        // Strip query string and leading slash; reject path traversal.
        const name = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\/+/, '')
        if (!name || name.includes('..')) {
          res.writeHead(404).end('not found')
          return
        }
        const body = await readFile(join(REGISTRY_DATA_DIR, name))
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(body)
      } catch {
        res.writeHead(404, { 'Content-Type': 'application/json' }).end('{}')
      }
    })
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address()
      resolve({ srv, base: `http://127.0.0.1:${port}` })
    })
  })
}

const client = new McpClient()
let local = null
let localClient = null

try {
  console.log(`── Phase A: server pointed at unreachable ${BAD_URL} ─────────`)

  const initRes = await client.request('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'offline-test', version: '0.0.1' },
  })
  record(
    'initialize succeeds with bad registry URL (no startup network)',
    initRes?.result?.serverInfo?.name === 'aicanvas-mcp',
    `got ${JSON.stringify(initRes?.result)?.slice(0, 100)}`,
  )

  client.notify('notifications/initialized')

  const toolsRes = await client.request('tools/list')
  record(
    'tools/list works without registry (schemas are local)',
    Array.isArray(toolsRes?.result?.tools) && toolsRes.result.tools.length === 8,
    `got ${toolsRes?.result?.tools?.length} tools`,
  )

  // First tool call should fail gracefully — fetch will fail to connect
  const lcRes = await client.request('tools/call', {
    name: 'list_categories',
    arguments: {},
  })
  record(
    'list_categories returns isError when registry unreachable',
    lcRes?.result?.isError === true,
    `got ${JSON.stringify(lcRes?.result)?.slice(0, 120)}`,
  )

  // Second call — server should still be alive
  record(
    'server still alive after first failed tool call',
    client.isAlive(),
    'server died after one network failure',
  )

  const sRes = await client.request('tools/call', {
    name: 'search_components',
    arguments: { query: 'card' },
  })
  record(
    'search_components returns isError when registry unreachable',
    sRes?.result?.isError === true,
    `got ${JSON.stringify(sRes?.result)?.slice(0, 120)}`,
  )

  const gicRes = await client.request('tools/call', {
    name: 'get_install_command',
    arguments: { slug: 'wave-lines' },
  })
  record(
    'get_install_command returns isError when registry unreachable',
    gicRes?.result?.isError === true,
    `got ${JSON.stringify(gicRes?.result)?.slice(0, 120)}`,
  )

  record(
    'server still alive after multiple failed tool calls',
    client.isAlive(),
    'server died',
  )

  // ── Phase B: server pointed at a local registry-data/ file server ──────────
  local = await startLocalRegistry()
  console.log(`\n── Phase B: server pointed at local registry ${local.base} ──`)
  localClient = new McpClient(local.base)

  const initB = await localClient.request('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'offline-test-local', version: '0.0.1' },
  })
  record(
    'local: initialize succeeds',
    initB?.result?.serverInfo?.name === 'aicanvas-mcp',
    `got ${JSON.stringify(initB?.result)?.slice(0, 100)}`,
  )
  localClient.notify('notifications/initialized')

  const call = (name, args) =>
    localClient.request('tools/call', { name, arguments: args ?? {} })
  const sc = (res) => res?.result?.structuredContent

  // list_systems → andromeda
  const lsRes = await call('list_systems')
  const lsSystems = sc(lsRes)?.systems ?? []
  record(
    'local: list_systems returns andromeda',
    !lsRes?.result?.isError && lsSystems.some((s) => s.slug === 'andromeda'),
    `got ${JSON.stringify(lsSystems.map((s) => s.slug))}`,
  )

  // get_system('andromeda') → files + tokensInstallCommand + componentSlugs
  const gsRes = await call('get_system', { slug: 'andromeda' })
  const gsSc = sc(gsRes)
  record(
    'local: get_system(andromeda) returns files',
    !gsRes?.result?.isError && Array.isArray(gsSc?.files) && gsSc.files.length > 0,
    `isError=${gsRes?.result?.isError}, files=${gsSc?.files?.length}`,
  )
  record(
    'local: get_system surfaces tokensInstallCommand',
    typeof gsSc?.tokensInstallCommand === 'string' &&
      gsSc.tokensInstallCommand.includes('andromeda-tokens'),
    `got ${gsSc?.tokensInstallCommand}`,
  )
  record(
    'local: get_system surfaces componentSlugs (incl. andromeda-heat-grid)',
    Array.isArray(gsSc?.componentSlugs) &&
      gsSc.componentSlugs.includes('andromeda-heat-grid'),
    `got ${gsSc?.componentSlugs?.length} slugs`,
  )
  record(
    'local: get_system summary notes the shared tokens must also be installed',
    /tokens/i.test(
      gsRes?.result?.content?.[0]?.type === 'text'
        ? gsRes.result.content[0].text
        : '',
    ),
    'tokens note missing from summary',
  )

  // get_template → a real template
  const gtRes = await call('get_template', { slug: 'andromeda-mission-control' })
  const gtSc = sc(gtRes)
  record(
    'local: get_template(andromeda-mission-control) returns files',
    !gtRes?.result?.isError && Array.isArray(gtSc?.files) && gtSc.files.length > 0,
    `isError=${gtRes?.result?.isError}, files=${gtSc?.files?.length}`,
  )
  record(
    'local: get_template surfaces registryDependencies',
    Array.isArray(gtSc?.registryDependencies) &&
      gtSc.registryDependencies.length > 0,
    `got ${JSON.stringify(gtSc?.registryDependencies)?.slice(0, 80)}`,
  )

  // get_component → DS slug via systemComponents fallback
  const gcRes = await call('get_component', { slug: 'andromeda-heat-grid' })
  const gcSc = sc(gcRes)
  record(
    'local: get_component(andromeda-heat-grid) resolves via systemComponents fallback',
    !gcRes?.result?.isError &&
      gcSc?.slug === 'andromeda-heat-grid' &&
      gcSc?.system === 'andromeda',
    `isError=${gcRes?.result?.isError}, slug=${gcSc?.slug}, system=${gcSc?.system}`,
  )
  record(
    'local: get_component(andromeda-heat-grid) returns non-empty source code',
    typeof gcSc?.code === 'string' && gcSc.code.length > 100,
    `code length ${gcSc?.code?.length}`,
  )

  // get_install_command → DS slug via systemComponents fallback
  const gicB = await call('get_install_command', { slug: 'andromeda-heat-grid' })
  const gicBSc = sc(gicB)
  record(
    'local: get_install_command(andromeda-heat-grid) resolves via fallback',
    !gicB?.result?.isError &&
      gicBSc?.installCommand === 'npx shadcn@latest add @aicanvas/andromeda-heat-grid',
    `got ${gicBSc?.installCommand}`,
  )

  // search_components → a DS component surfaces
  const srB = await call('search_components', { query: 'heat grid', limit: 10 })
  const srBSc = sc(srB)
  record(
    'local: search_components surfaces the DS component andromeda-heat-grid',
    !srB?.result?.isError &&
      (srBSc?.components ?? []).some((c) => c.slug === 'andromeda-heat-grid'),
    `got ${JSON.stringify((srBSc?.components ?? []).map((c) => c.slug))?.slice(0, 120)}`,
  )

  // list_components must NOT leak DS components into the standalone catalog.
  // (Note: `andromeda-button` is a genuine standalone wrapper in
  // components-workspace/ and legitimately appears here; the DS Button ships as
  // `andromeda-button-system`. So compare against the real systemComponents set,
  // not a name prefix.)
  const dsSlugs = new Set((gsSc?.componentSlugs ?? []))
  const lcB = await call('list_components', { limit: 200 })
  const lcBSlugs = (sc(lcB)?.components ?? []).map((c) => c.slug)
  record(
    'local: list_components excludes design-system components',
    !lcBSlugs.some((s) => dsSlugs.has(s)),
    `leaked: ${lcBSlugs.filter((s) => dsSlugs.has(s)).join(', ')}`,
  )
} catch (err) {
  console.log(`!! HARNESS ERROR: ${err.message}`)
  fail++
  failures.push(`harness: ${err.message}`)
} finally {
  await client.close()
  if (localClient) await localClient.close()
  if (local) await new Promise((r) => local.srv.close(r))
}

console.log(`\n══ ${pass} passed, ${fail} failed ════════════════════════════════`)
if (failures.length > 0) {
  console.log('\nFailures:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
process.exit(0)
