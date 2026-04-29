#!/usr/bin/env node
/**
 * Offline / network-failure test.
 *
 * Spawns the MCP server pointed at a deliberately unreachable URL and
 * verifies that:
 *   1. The server starts and responds to initialize (no startup network)
 *   2. tools/list works (schemas are local; no network)
 *   3. Tool calls that NEED the registry return a graceful isError (not
 *      a crash, not a swallowed exception)
 *   4. The process stays alive — one bad call doesn't kill the server
 */

import { spawn } from 'node:child_process'

const SERVER = new URL('../dist/index.js', import.meta.url).pathname
const BAD_URL = 'http://127.0.0.1:1/r' // Port 1 — guaranteed unreachable

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
  constructor() {
    this.proc = spawn('node', [SERVER], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, AICANVAS_REGISTRY_BASE: BAD_URL },
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

const client = new McpClient()

try {
  console.log(`── Server pointed at unreachable ${BAD_URL} ─────────────────`)

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
    Array.isArray(toolsRes?.result?.tools) && toolsRes.result.tools.length === 5,
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
} catch (err) {
  console.log(`!! HARNESS ERROR: ${err.message}`)
  fail++
  failures.push(`harness: ${err.message}`)
} finally {
  await client.close()
}

console.log(`\n══ ${pass} passed, ${fail} failed ════════════════════════════════`)
if (failures.length > 0) {
  console.log('\nFailures:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
process.exit(0)
