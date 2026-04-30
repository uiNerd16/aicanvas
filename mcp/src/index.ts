#!/usr/bin/env node
/**
 * AI Canvas MCP server
 * --------------------
 * Exposes the AI Canvas standalone component registry to AI editors
 * (Claude Code, Cursor, Claude Desktop, Codex). The AI can search,
 * inspect, and install components without leaving the chat.
 *
 * Data flow:
 *   - aicanvas.me/r/aicanvas-mcp.json   → all 64+ components' metadata
 *   - aicanvas.me/r/<slug>.json         → full source code per component
 *
 * Both are static files, served from Vercel's CDN. Stateless server.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// ── Configuration ────────────────────────────────────────────────────────────

const REGISTRY_BASE =
  process.env.AICANVAS_REGISTRY_BASE ?? 'https://aicanvas.me/r'
const META_URL = `${REGISTRY_BASE}/aicanvas-mcp.json`
const META_TTL_MS = 5 * 60 * 1000 // 5 minutes — meta updates with deploys

// ── Types ────────────────────────────────────────────────────────────────────

interface ComponentMeta {
  slug: string
  name: string
  description: string
  categories: string[]
  tags: string[]
  image?: string
  badge?: string
  dualTheme?: boolean
  dependencies: string[]
  homepageUrl: string
  sourceUrl: string
  installCommand: string
}

interface MetaPayload {
  name: string
  homepage: string
  generatedAt: string
  componentCount: number
  categories: Array<{ label: string; count: number }>
  components: ComponentMeta[]
}

interface ShadcnRegistryItem {
  name: string
  type: string
  title: string
  description: string
  dependencies: string[]
  files: Array<{ path: string; content: string; type: string; target: string }>
}

// ── Cached fetchers ──────────────────────────────────────────────────────────

let metaCache: { data: MetaPayload; fetchedAt: number } | null = null

async function fetchMeta(): Promise<MetaPayload> {
  if (metaCache && Date.now() - metaCache.fetchedAt < META_TTL_MS) {
    return metaCache.data
  }
  const res = await fetch(META_URL, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch AI Canvas registry meta from ${META_URL}: ${res.status} ${res.statusText}`,
    )
  }
  const data = (await res.json()) as MetaPayload
  metaCache = { data, fetchedAt: Date.now() }
  return data
}

async function fetchComponentSource(slug: string): Promise<ShadcnRegistryItem> {
  const url = `${REGISTRY_BASE}/${encodeURIComponent(slug)}.json`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch source for "${slug}" from ${url}: ${res.status} ${res.statusText}`,
    )
  }
  return (await res.json()) as ShadcnRegistryItem
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function scoreMatch(query: string, c: ComponentMeta): number {
  const q = normalize(query)
  if (!q) return 0
  // Drop tokens of <=2 chars — they cause false positives via substring
  // matches in unrelated words (e.g. "no" hits "notification").
  const tokens = q.split(/\s+/).filter((t) => t.length > 2)
  if (tokens.length === 0) return 0

  // Searchable surface — slug carries the most weight, then name, then
  // description, then categories/tags.
  const fields = [
    { text: normalize(c.slug), weight: 5 },
    { text: normalize(c.name), weight: 4 },
    { text: normalize(c.description), weight: 1 },
    { text: normalize(c.categories.join(' ')), weight: 2 },
    { text: normalize(c.tags.join(' ')), weight: 1 },
  ]

  let score = 0
  for (const tok of tokens) {
    for (const f of fields) {
      if (!f.text) continue
      // Whole-word match scores higher than substring.
      if (new RegExp(`\\b${escapeRegExp(tok)}\\b`).test(f.text)) {
        score += f.weight * 2
      } else if (f.text.includes(tok)) {
        score += f.weight
      }
    }
  }
  return score
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function asTextContent(value: unknown): { type: 'text'; text: string } {
  return {
    type: 'text',
    text: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
  }
}

function errorResult(message: string) {
  return {
    content: [asTextContent(`Error: ${message}`)],
    isError: true as const,
  }
}

// ── Server ───────────────────────────────────────────────────────────────────

const server = new McpServer(
  { name: 'aicanvas-mcp', version: '0.1.0' },
  { capabilities: { tools: {}, logging: {} } },
)

// ── Tool: list_categories ────────────────────────────────────────────────────

server.registerTool(
  'list_categories',
  {
    title: 'List AI Canvas categories',
    description:
      'Return every category in the AI Canvas standalone component library, with the number of components in each. Use to orient before listing or searching — e.g. "what kinds of components are available?"',
    inputSchema: {},
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  },
  async () => {
    try {
      const meta = await fetchMeta()
      const lines = [
        `AI Canvas — ${meta.componentCount} components across ${meta.categories.length} categories.`,
        '',
        ...meta.categories.map(
          (c) => `  ${c.label.padEnd(24)}  ${String(c.count).padStart(3)} components`,
        ),
      ]
      return {
        content: [asTextContent(lines.join('\n'))],
        structuredContent: {
          componentCount: meta.componentCount,
          categories: meta.categories,
        },
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err))
    }
  },
)

// ── Tool: list_components ────────────────────────────────────────────────────

server.registerTool(
  'list_components',
  {
    title: 'List AI Canvas components',
    description:
      'Return AI Canvas components, optionally filtered by category. Use after `list_categories` to drill into one, or pass no filter to browse everything. Each result includes slug, name, description, categories, screenshot URL, install command, and homepage URL — enough to evaluate without a separate `get_component` call. Pagination via `limit` and `offset`.',
    inputSchema: {
      category: z
        .string()
        .optional()
        .describe(
          'Optional category label, e.g. "Cards & Modals", "Backgrounds", "Typography". Case-insensitive. Omit to list all components.',
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(200)
        .optional()
        .describe('Max number of components to return. Default 25.'),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe('Number of components to skip (for pagination). Default 0.'),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  },
  async ({ category, limit = 25, offset = 0 }) => {
    try {
      const meta = await fetchMeta()
      let pool = meta.components
      if (category) {
        const wanted = normalize(category)
        pool = pool.filter((c) =>
          c.categories.some((cat) => normalize(cat) === wanted),
        )
      }
      const total = pool.length
      const slice = pool.slice(offset, offset + limit)
      const summary =
        category != null
          ? `${total} components in category "${category}"` +
            (total > slice.length
              ? ` (showing ${slice.length} from offset ${offset})`
              : '')
          : `${total} components total` +
            (total > slice.length
              ? ` (showing ${slice.length} from offset ${offset})`
              : '')

      return {
        content: [asTextContent(summary + '\n\n' + JSON.stringify(slice, null, 2))],
        structuredContent: {
          total,
          offset,
          limit,
          returned: slice.length,
          components: slice,
        },
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err))
    }
  },
)

// ── Tool: search_components ──────────────────────────────────────────────────

server.registerTool(
  'search_components',
  {
    title: 'Search AI Canvas components',
    description:
      'Fuzzy keyword search across component slug, name, description, categories, and tags. Returns best matches ranked by relevance. Use when the user describes what they want in their own words, e.g. "an animated card stack", "background with waves", "typography that reveals on scroll". Results include screenshot URLs and install commands for immediate evaluation.',
    inputSchema: {
      query: z
        .string()
        .min(1)
        .describe(
          'Free-text search query. Multiple words are tokenized and matched independently.',
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe('Max number of matches to return. Default 10.'),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  },
  async ({ query, limit = 10 }) => {
    try {
      const meta = await fetchMeta()
      const ranked = meta.components
        .map((c) => ({ component: c, score: scoreMatch(query, c) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((r) => r.component)

      const summary =
        ranked.length === 0
          ? `No matches for "${query}". Try \`list_categories\` to browse what exists.`
          : `${ranked.length} match${ranked.length === 1 ? '' : 'es'} for "${query}"`

      return {
        content: [asTextContent(summary + '\n\n' + JSON.stringify(ranked, null, 2))],
        structuredContent: { query, count: ranked.length, components: ranked },
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err))
    }
  },
)

// ── Tool: get_component ──────────────────────────────────────────────────────

server.registerTool(
  'get_component',
  {
    title: 'Get an AI Canvas component (full metadata + source code)',
    description:
      'Return the complete record for a single component: metadata + the entire .tsx source code as a string. Use after the user picks one from a search/list result and wants to see the implementation, or before installing if they want to inspect first. The source is the exact file the CLI install would write into a project.',
    inputSchema: {
      slug: z
        .string()
        .min(1)
        .describe(
          'The component slug, e.g. "ai-job-cards", "wave-lines", "halo-type". Use exact slugs from list/search results.',
        ),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  },
  async ({ slug }) => {
    try {
      const meta = await fetchMeta()
      const component = meta.components.find((c) => c.slug === slug)
      if (!component) {
        return errorResult(
          `No component found with slug "${slug}". Use \`search_components\` or \`list_components\` to find valid slugs.`,
        )
      }
      const source = await fetchComponentSource(slug)
      const code = source.files[0]?.content ?? ''
      const filePath = source.files[0]?.path ?? `components/aicanvas/${slug}.tsx`

      const result = {
        ...component,
        filePath,
        code,
      }

      return {
        content: [
          asTextContent(
            [
              `# ${component.name}`,
              '',
              component.description,
              '',
              `Categories: ${component.categories.join(', ') || '(none)'}`,
              `Dependencies: ${component.dependencies.join(', ') || '(none)'}`,
              `Install: ${component.installCommand}`,
              `Homepage: ${component.homepageUrl}`,
              '',
              `--- ${filePath} ---`,
              code,
            ].join('\n'),
          ),
        ],
        structuredContent: result,
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err))
    }
  },
)

// ── Tool: get_install_command ────────────────────────────────────────────────

server.registerTool(
  'get_install_command',
  {
    title: 'Get the AI Canvas install command for a component',
    description:
      'Return the shadcn CLI command to install a single component into the user\'s project. After calling this, suggest the user run the command (or run it yourself if you have shell access). Requires shadcn-aware setup (Tailwind v4, components.json) — for projects without that, fall back to `get_component` and write the file manually.',
    inputSchema: {
      slug: z
        .string()
        .min(1)
        .describe('The component slug, e.g. "ai-job-cards".'),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  },
  async ({ slug }) => {
    try {
      const meta = await fetchMeta()
      const component = meta.components.find((c) => c.slug === slug)
      if (!component) {
        return errorResult(
          `No component found with slug "${slug}". Use \`search_components\` to find valid slugs.`,
        )
      }
      const out = {
        slug: component.slug,
        name: component.name,
        installCommand: component.installCommand,
        sourceUrl: component.sourceUrl,
        homepageUrl: component.homepageUrl,
        dependencies: component.dependencies,
      }
      return {
        content: [
          asTextContent(
            [
              `Install ${component.name}:`,
              '',
              `  ${component.installCommand}`,
              '',
              `Dependencies: ${component.dependencies.join(', ') || '(none — React only)'}`,
              `Source: ${component.sourceUrl}`,
              `Preview: ${component.homepageUrl}`,
            ].join('\n'),
          ),
        ],
        structuredContent: out,
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err))
    }
  },
)

// ── Boot ─────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  // stdio transport runs forever — closes when host kills stdin
}

main().catch((err) => {
  // stderr only — stdout is reserved for JSON-RPC
  console.error('aicanvas-mcp fatal:', err)
  process.exit(1)
})
