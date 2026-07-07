'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// Andromeda tokens inlined — avoids importing from @ts-nocheck design-systems/
const C = {
  surface: { base: '#0E0E0F', raised: '#141415', hover: '#1C1C1D', active: '#232325' },
  text: { primary: '#F5F5F5', secondary: '#A3A3A3', muted: '#9A9A9A', faint: '#6E6E6E' },
  accent: { 100: '#BAF8EC', 300: '#0FCFB2', 400: '#109380', 500: '#126059' },
  border: { subtle: '#212122', base: '#3E3E3F' },
}
const FONT = "var(--font-jetbrains-mono, 'JetBrains Mono Variable'), 'JetBrains Mono', monospace"

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
    .replace(/`([^`]+)`/g, (_, t) => `<code style="font-family:inherit;color:${C.accent[300]};background:${C.surface.active};padding:1px 6px;font-size:0.875em">${t}</code>`)
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
      `<pre style="background:${C.surface.raised};border:1px solid ${C.border.subtle};padding:14px 18px;overflow-x:auto;font-size:11px;line-height:1.75;margin:14px 0;font-family:inherit"><code>${esc(code).trimEnd()}</code></pre>`,
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
      const sizes = ['20px', '15px', '12px', '11px']
      const sz = sizes[lvl - 1]
      const tracking = lvl >= 3 ? `letter-spacing:0.16em;text-transform:uppercase` : ''
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
        `<li style="display:flex;gap:10px;padding-bottom:7px;color:${C.text.secondary};line-height:1.65"><span style="color:${C.accent[400]};flex-shrink:0;font-size:11px;min-width:14px">${olm[1]}.</span><span>${inlineFmt(olm[2])}</span></li>`,
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
  const activeName = getDisplayName(activeFile)
  const activeSection = sections.find((s) => s.files.some((f) => f.path === activeFile.path))

  return (
    <div
      style={{
        display: 'flex',
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
      `}</style>

      {/* Left nav */}
      <nav
        aria-label="Brain sections"
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${C.border.subtle}`,
          overflowY: 'auto',
          padding: '20px 0',
        }}
      >
        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: 20 }}>
            {/* Section label */}
            <div
              style={{
                fontSize: 8,
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
                <span style={{ color: C.accent[400], fontSize: 8 }}>{section.count}</span>
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
                    fontSize: 11,
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
        {/* File header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            borderBottom: `1px solid ${C.border.subtle}`,
            background: C.surface.base,
            padding: '10px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {activeSection && (
            <span
              style={{
                fontSize: 8,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.accent[400],
                padding: '2px 6px',
                background: C.surface.active,
              }}
            >
              {activeSection.label}
            </span>
          )}
          <span style={{ fontSize: 12, color: C.text.primary, fontWeight: 600 }}>
            {activeName}
          </span>
        </div>

        {/* Markdown content */}
        <div
          className="brain-content"
          onClick={handleContentClick}
          style={{
            padding: '28px 40px 64px',
            maxWidth: 780,
            fontSize: 12,
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
