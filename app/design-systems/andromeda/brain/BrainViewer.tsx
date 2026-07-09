'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { DownloadSimple } from '@phosphor-icons/react'
import { zipSync, strToU8 } from 'fflate'

// AI Canvas site tokens: sand neutrals + olive accent, Manrope UI + Geist mono for code.
const C = {
  surface: { base: '#0E0E0F', raised: '#1B1B1C', hover: '#232325', active: '#2D2D2E' },
  text: { primary: '#F4F4FA', secondary: '#9B9B9E', muted: '#9B9B9E', faint: '#7B7B7D' },
  accent: { 100: '#EAF0C8', 300: '#DAE4A0', 400: '#A8B94D', 500: '#869631' },
  border: { subtle: '#2D2D2E', base: '#373738' },
}
const SANS = "var(--font-sans), 'Manrope', system-ui, sans-serif"
const MONO = "var(--font-mono, var(--font-jetbrains-mono)), 'Geist Mono', monospace"
const FONT = SANS

export interface BrainFile {
  path: string
  content: string
}

interface Section {
  id: string
  label: string
  count: string
  files: BrainFile[]
}

function getDisplayName(f: BrainFile): string {
  const parts = f.path.split('/')
  const name = parts.at(-1) ?? ''
  if (name === 'rules.md') return 'Brain Index'
  if (name === 'SKILL.md') return parts.at(-2) ?? 'Skill'
  if (name.endsWith('.rules.md')) return name.replace('.rules.md', '')
  return name.replace('.md', '')
}

function getSectionKey(f: BrainFile): string {
  if (f.path.includes('/foundations/')) return 'foundations'
  if (f.path.includes('/components/')) return 'components'
  if (f.path.includes('/_skills/')) return 'skills'
  return 'index'
}

function categorize(files: BrainFile[]): Section[] {
  const groups: Record<string, BrainFile[]> = { index: [], foundations: [], components: [], skills: [] }
  for (const f of files) groups[getSectionKey(f)].push(f)
  groups.components.sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)))

  const labels: Record<string, string> = {
    index: 'INDEX',
    foundations: 'FOUNDATIONS',
    components: 'COMPONENTS',
    skills: 'SKILLS',
  }
  return ['index', 'foundations', 'components', 'skills']
    .filter((k) => groups[k].length > 0)
    .map((k) => ({
      id: k,
      label: labels[k],
      count: groups[k].length > 1 ? `${groups[k].length}` : '',
      files: groups[k],
    }))
}

// ── Markdown renderer ──────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineFmt(raw: string): string {
  const s = esc(raw)
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const internal = href.endsWith('.md') && !href.startsWith('http')
      if (internal) {
        return `<a data-brain-file="${href}" style="color:${C.accent[300]};text-decoration:underline;text-decoration-color:${C.accent[500]};cursor:pointer">${text}</a>`
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:${C.accent[300]};text-decoration:underline;text-decoration-color:${C.accent[500]}">${text}</a>`
    })
    .replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong style="color:${C.text.primary};font-weight:600">${t}</strong>`)
    .replace(/`([^`]+)`/g, (_, t) => `<code style="font-family:${MONO};color:${C.text.secondary};background:${C.surface.raised};padding:1px 6px;border-radius:4px;font-size:0.875em">${t}</code>`)
}

function stripFrontmatter(md: string): string {
  if (!md.startsWith('---\n')) return md
  const end = md.indexOf('\n---\n', 4)
  return end === -1 ? md : md.slice(end + 5).trimStart()
}

function renderMd(raw: string): string {
  const md = stripFrontmatter(raw)

  // Protect fenced code blocks first
  const blocks: string[] = []
  let text = md.replace(/```[\w]*\n([\s\S]*?)```/gm, (_, code) => {
    const i = blocks.length
    blocks.push(
      `<pre style="background:${C.surface.raised};border:1px solid ${C.border.subtle};padding:14px 18px;overflow-x:auto;font-size:12px;line-height:1.75;margin:14px 0;font-family:${MONO}"><code>${esc(code).trimEnd()}</code></pre>`,
    )
    return `\x00B${i}\x00`
  })

  const lines = text.split('\n')
  const out: string[] = []
  let inUl = false
  let pBuf: string[] = []

  const flushParagraph = () => {
    const joined = pBuf.join(' ').trim()
    if (joined) {
      out.push(`<p style="margin:0 0 14px;line-height:1.8;color:${C.text.secondary}">${inlineFmt(joined)}</p>`)
    }
    pBuf = []
  }
  const closeList = () => {
    if (inUl) {
      out.push('</ul>')
      inUl = false
    }
  }

  for (const line of lines) {
    // Code block placeholder
    if (line.includes('\x00B')) {
      flushParagraph()
      closeList()
      out.push(line.replace(/\x00B(\d+)\x00/g, (_, i) => blocks[+i]))
      continue
    }

    // Headings
    const hm = line.match(/^(#{1,4}) (.+)/)
    if (hm) {
      flushParagraph()
      closeList()
      const lvl = hm[1].length
      const sizes = ['20px', '16px', '14px', '12px']
      const sz = sizes[lvl - 1]
      const tracking = ''
      const color = lvl === 1 ? C.text.primary : lvl === 2 ? C.text.secondary : C.text.muted
      const mt = lvl === 1 ? '0' : lvl === 2 ? '28px' : '20px'
      out.push(
        `<h${lvl} style="font-size:${sz};font-weight:${lvl <= 2 ? 700 : 600};color:${color};margin:${mt} 0 6px;${tracking}">${inlineFmt(hm[2])}</h${lvl}>`,
      )
      if (lvl <= 2) {
        out.push(`<div style="height:1px;background:${C.border.subtle};margin-bottom:16px"></div>`)
      }
      continue
    }

    // Horizontal rule
    if (/^-{3,}$/.test(line.trim())) {
      flushParagraph()
      closeList()
      out.push(`<hr style="border:none;border-top:1px solid ${C.border.subtle};margin:22px 0" />`)
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushParagraph()
      closeList()
      out.push(
        `<blockquote style="border-left:2px solid ${C.accent[300]};padding:10px 16px;margin:14px 0;background:${C.surface.raised};color:${C.text.muted};font-style:italic">${inlineFmt(line.slice(2))}</blockquote>`,
      )
      continue
    }

    // Unordered list
    const ulm = line.match(/^- (.+)/)
    if (ulm) {
      flushParagraph()
      if (!inUl) {
        out.push(`<ul style="margin:8px 0 14px 0;padding:0;list-style:none">`)
        inUl = true
      }
      out.push(
        `<li style="display:flex;gap:10px;padding-bottom:7px;color:${C.text.secondary};line-height:1.65"><span style="color:${C.accent[400]};flex-shrink:0;margin-top:1px;font-size:12px">›</span><span>${inlineFmt(ulm[1])}</span></li>`,
      )
      continue
    }

    // Ordered list
    const olm = line.match(/^(\d+)\. (.+)/)
    if (olm) {
      flushParagraph()
      if (!inUl) {
        out.push(`<ul style="margin:8px 0 14px 0;padding:0;list-style:none">`)
        inUl = true
      }
      out.push(
        `<li style="display:flex;gap:10px;padding-bottom:7px;color:${C.text.secondary};line-height:1.65"><span style="color:${C.accent[400]};flex-shrink:0;font-size:12px;min-width:14px">${olm[1]}.</span><span>${inlineFmt(olm[2])}</span></li>`,
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      flushParagraph()
      closeList()
      continue
    }

    // Buffer into paragraph
    closeList()
    pBuf.push(line)
  }

  flushParagraph()
  closeList()
  return out.join('\n')
}

// ── Component ──────────────────────────────────────────────────────────────

export function BrainViewer({ files }: { files: BrainFile[] }) {
  const sections = categorize(files)

  // Default to the Brain Index (rules.md)
  const defaultFile = files.find((f) => f.path.endsWith('andromeda/rules.md')) ?? files[0]
  const [activeFile, setActiveFile] = useState<BrainFile>(defaultFile)
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll content to top whenever the active file changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [activeFile])

  // Internal brain-link navigation (links with data-brain-file="...")
  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest('[data-brain-file]') as HTMLElement | null
      if (!target) return
      e.preventDefault()
      const rel = target.getAttribute('data-brain-file') ?? ''
      const found = files.find((f) => {
        const parts = f.path.split('/')
        // Match by the tail segments in the href (e.g. "foundations/build-workflow.md")
        return f.path.endsWith(rel.replace(/^\.\.\//, '').replace(/^\.\//, ''))
      })
      if (found) setActiveFile(found)
    },
    [files],
  )

  const html = renderMd(activeFile.content)
  const isIndex = getSectionKey(activeFile) === 'index'

  // Honest, self-updating counts for the intro copy: total files + rounded KB of
  // brain content (not the zip, which compresses smaller).
  const { fileCount, sizeKb } = useMemo(() => {
    const enc = new TextEncoder()
    const bytes = files.reduce((n, f) => n + enc.encode(f.content).length, 0)
    return { fileCount: files.length, sizeKb: Math.round(bytes / 1024 / 10) * 10 }
  }, [files])

  // Zip every brain file (paths preserved) in the browser and download it. The
  // viewer only renders for entitled users, so this is already access-gated.
  const downloadBrain = useCallback(() => {
    const entries: Record<string, Uint8Array> = {}
    for (const f of files) entries[f.path] = strToU8(f.content)
    const zipped = zipSync(entries, { level: 6 })
    const blob = new Blob([zipped], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'andromeda-brain.zip'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [files])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        fontFamily: FONT,
      }}
    >
      <style>{`
        .brain-nav-item { transition: background 0.1s, color 0.1s; }
        .brain-nav-item:hover { background: ${C.surface.hover} !important; color: ${C.text.secondary} !important; }
        .brain-nav-item.active { background: ${C.surface.raised} !important; color: ${C.text.primary} !important; }
        .brain-content a[data-brain-file]:hover { color: ${C.accent[100]} !important; }
        .brain-content a[href]:hover { color: ${C.accent[100]} !important; }
        .brain-dl { transition: background 0.12s; }
        .brain-dl:hover { background: ${C.accent[300]} !important; }
      `}</style>

      {/* Nav (file index) — rendered on the RIGHT via row-reverse on the root,
          so it doesn't sit beside the global app sidebar on the left. */}
      <nav
        aria-label="Brain sections"
        style={{
          width: 220,
          flexShrink: 0,
          borderLeft: `1px solid ${C.border.subtle}`,
          overflowY: 'auto',
          padding: '20px 0',
        }}
      >
        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: 20 }}>
            {/* Section label */}
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.text.faint,
                padding: '0 16px',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{section.label}</span>
              {section.count && (
                <span style={{ color: C.accent[400], fontSize: 10 }}>{section.count}</span>
              )}
            </div>

            {/* File rows */}
            {section.files.map((f) => {
              const isActive = f.path === activeFile.path
              const name = getDisplayName(f)
              return (
                <button
                  key={f.path}
                  className={`brain-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setActiveFile(f)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 16px',
                    fontSize: 12,
                    fontFamily: FONT,
                    cursor: 'pointer',
                    border: 'none',
                    borderLeft: isActive ? `2px solid ${C.accent[300]}` : '2px solid transparent',
                    background: isActive ? C.surface.raised : 'transparent',
                    color: isActive ? C.text.primary : C.text.faint,
                    lineHeight: 1.4,
                  }}
                >
                  {name}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Content panel */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Human-only intro — only on the index landing, kept small so it never
            competes with Index / Foundations / Components. */}
        {isIndex && (
          <div style={{ padding: '28px 40px 0', maxWidth: 780 }}>
            <div
              style={{
                border: `1px solid ${C.border.subtle}`,
                borderRadius: 12,
                background: C.surface.raised,
                padding: '16px 18px',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text.primary, marginBottom: 6 }}>
                Get the brain
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: C.text.secondary, margin: '0 0 14px' }}>
                Easy to work with. Download the brain as a zip ({fileCount} files, ~{sizeKb} KB) and
                drop it into your project. Your AI reads it from there.
              </p>
              <button
                type="button"
                className="brain-dl"
                onClick={downloadBrain}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: C.accent[400],
                  color: C.surface.base,
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: FONT,
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <DownloadSimple weight="regular" size={16} />
                Download the brain
              </button>
            </div>
          </div>
        )}

        {/* Markdown content */}
        <div
          className="brain-content"
          onClick={handleContentClick}
          style={{
            padding: '28px 40px 64px',
            maxWidth: 780,
            fontSize: 14,
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
