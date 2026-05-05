'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Eye,
  Code,
  Check,
  Copy,
  ArrowLeft,
  ArrowRight,
  Tag as TagIcon,
  Sun,
  Moon,
  CornersOut,
  CornersIn,
  ArrowClockwise,
  DotsThreeVertical,
  Terminal,
  Sparkle,
} from '@phosphor-icons/react'
import type { Tag, Platform } from '../ComponentCard'
import { PLATFORMS } from '../ComponentCard'
import { HeaderSocials } from '../HeaderSocials'
import { Step } from '../Step'
import type { ComponentMeta } from '../../lib/component-registry'
import { AFFILIATE_CONFIG } from '../../lib/affiliate-config'
import { track } from '../../lib/analytics'

// ─── Platform icons (inlined SVGs — no external dependency) ───────────────────

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  'Claude Code': (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  ),
  'Lovable': (
    <svg viewBox="0 0 121 122" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M36.07 0C55.99 0 72.14 16.16 72.14 36.08V49.8H84.14C104.06 49.8 120.21 65.95 120.21 85.88C120.21 105.81 104.06 121.96 84.14 121.96H0V36.08C0 16.16 16.15 0 36.07 0Z" />
    </svg>
  ),
  'V0': (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12 3L22 21H2L12 3Z" />
    </svg>
  ),
}

// ─── ComponentPageView ────────────────────────────────────────────────────────

interface ComponentPageViewProps {
  slug: string
  name: string
  description: string
  headingSubtitle?: string
  tags: Tag[]
  code: string
  prompts: Partial<Record<Platform, string>>
  dualTheme: boolean
  related: ComponentMeta[]
  highlightedCode: ReactNode
  children: ReactNode
}

const RELATED_PAGE_SIZE = 3

export default function ComponentPageView({
  slug,
  name,
  description,
  headingSubtitle,
  tags,
  code,
  prompts,
  dualTheme,
  related,
  highlightedCode,
  children,
}: ComponentPageViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [cardTheme, setCardTheme] = useState<'dark' | 'light'>('dark')
  const [cliCopied, setCliCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [depsCopied, setDepsCopied] = useState(false)
  const [installTab, setInstallTab] = useState<'cli' | 'manual'>('cli')
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm')
  const [darkCopied, setDarkCopied] = useState(false)
  const [fontCopied, setFontCopied] = useState(false)
  const [fontFramework, setFontFramework] = useState<'html' | 'nextjs'>('html')
  const [fontPkgInstallCopied, setFontPkgInstallCopied] = useState(false)
  const [fontPkgSnippetCopied, setFontPkgSnippetCopied] = useState(false)

  // Extract font name from code comment (e.g. "// font: Manrope") — Google Fonts
  const fontMatch = code.match(/^\/\/ font: (.+)$/m)
  const fontName = fontMatch ? fontMatch[1].trim() : null
  const fontGoogleId = fontName ? fontName.replace(/ /g, '+') : null
  const fontImportId = fontName ? fontName.replace(/ /g, '_') : null
  const FONT_SNIPPETS = fontName ? {
    html: `<link href="https://fonts.googleapis.com/css2?family=${fontGoogleId}:wght@400;500;600;700;800&display=swap" rel="stylesheet">`,
    nextjs: `import { ${fontImportId} } from 'next/font/google'\nconst font = ${fontImportId}({ subsets: ['latin'] })`,
  } : null

  // Extract package font from code comment (e.g. "// font-pkg: geist/font/pixel|GeistPixelCircle|--font-geist-pixel-circle")
  const fontPkgMatch = code.match(/^\/\/ font-pkg: (.+)$/m)
  const fontPkgInfo = fontPkgMatch ? fontPkgMatch[1].trim().split('|') : null
  const fontPkgPath = fontPkgInfo?.[0] ?? null        // e.g. "geist/font/pixel"
  const fontPkgClass = fontPkgInfo?.[1] ?? null       // e.g. "GeistPixelCircle"
  const fontPkgVar = fontPkgInfo?.[2] ?? null         // e.g. "--font-geist-pixel-circle"
  const fontPkgName = fontPkgPath ? fontPkgPath.split('/')[0] : null  // e.g. "geist"
  const FONT_PKG_INSTALL = fontPkgName ? `npm install ${fontPkgName}` : null
  // If CSS var is provided → needs layout.tsx registration; otherwise self-contained in component
  const FONT_PKG_SNIPPET = fontPkgPath && fontPkgClass && fontPkgVar
    ? `import { ${fontPkgClass} } from '${fontPkgPath}'\n\nconst font = ${fontPkgClass}({ variable: '${fontPkgVar}' })\n\n// Add font.variable to your <html> className`
    : null
  const fontPkgSelfContained = fontPkgName && !fontPkgVar // font used via .className, no layout setup needed
  const [promptCopied, setPromptCopied] = useState<Platform | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  // Extract npm install command from code comment (e.g. "// npm install framer-motion")
  // Extract package names from the "// npm install ..." comment
  const depsMatch = code.match(/^\/\/ npm install (.+)$/m)
  const depsPackages = depsMatch ? depsMatch[1] : null

  const PKG_COMMANDS: Record<typeof pkgManager, string> = {
    pnpm: `pnpm add ${depsPackages}`,
    npm: `npm install ${depsPackages}`,
    yarn: `yarn add ${depsPackages}`,
    bun: `bun add ${depsPackages}`,
  }
  const depsCommand = depsPackages ? PKG_COMMANDS[pkgManager] : null

  async function copyDeps() {
    if (!depsCommand) return
    try {
      await navigator.clipboard.writeText(depsCommand)
      setDepsCopied(true)
      setTimeout(() => setDepsCopied(false), 2000)
    } catch {}
  }

  // Refresh button — incrementing this key remounts the preview wrapper,
  // which restarts any animations / effects / canvas inits inside the
  // children component.
  const [previewKey, setPreviewKey] = useState(0)

  // Prompt dropdown
  const [promptDropdownOpen, setPromptDropdownOpen] = useState(false)
  const promptDropdownRef = useRef<HTMLDivElement>(null)
  const mainCardRef = useRef<HTMLDivElement>(null)
  const availablePlatforms = PLATFORMS.filter((p) => prompts[p])

  // Related pagination — sliding window of RELATED_PAGE_SIZE cards advancing
  // ONE card at a time. The exiting card stays in place but drops behind the
  // others (zIndex -1) and fades out, so the next card visually slides ON TOP
  // of it as the layout animation runs. `relatedDir` tracks which arrow was
  // last pressed so the entering card slides in from the correct edge.
  const [relatedStart, setRelatedStart] = useState(0)
  const [relatedDir, setRelatedDir] = useState<1 | -1>(1)
  const visibleRelated = related.slice(
    relatedStart,
    relatedStart + RELATED_PAGE_SIZE,
  )
  const canPaginate = related.length > RELATED_PAGE_SIZE
  const canGoPrev = relatedStart > 0
  const canGoNext = relatedStart < related.length - RELATED_PAGE_SIZE

  function pageRelated(dir: 1 | -1) {
    setRelatedDir(dir)
    setRelatedStart((s) =>
      dir === 1
        ? Math.min(related.length - RELATED_PAGE_SIZE, s + 1)
        : Math.max(0, s - 1),
    )
  }

  // Escape key closes fullscreen; click-outside closes prompt dropdown
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (fullscreen) setFullscreen(false)
      if (promptDropdownOpen) setPromptDropdownOpen(false)
    }
    if (fullscreen || promptDropdownOpen) {
      document.addEventListener('keydown', onKey)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen, promptDropdownOpen])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (promptDropdownRef.current && !promptDropdownRef.current.contains(e.target as Node)) {
        setPromptDropdownOpen(false)
      }
    }
    if (promptDropdownOpen) {
      document.addEventListener('mousedown', onClickOutside)
      return () => document.removeEventListener('mousedown', onClickOutside)
    }
  }, [promptDropdownOpen])

  function refreshPreview() {
    setPreviewKey((k) => k + 1)
  }

  const cliCommand = `npx shadcn@latest add @aicanvas/${slug}`

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {}
  }

  async function copyCli() {
    try {
      track('CLI Copy', { component: slug })
      await navigator.clipboard.writeText(cliCommand)
      setCliCopied(true)
      setTimeout(() => setCliCopied(false), 4000)
    } catch {}
  }

  async function handlePlatformClick(platform: Platform) {
    try {
      const text = prompts[platform]
      if (!text) return

      track('Remix Platform Click', { component: slug, platform })

      // Always copy to clipboard
      await navigator.clipboard.writeText(text)
      setPromptCopied(platform)
      setTimeout(() => setPromptCopied(null), 3000)

      // Deep link for V0
      if (platform === 'V0') {
        const { baseUrl, affiliateParam, affiliateId } = AFFILIATE_CONFIG.v0
        const url = new URL(baseUrl)
        url.searchParams.set('q', text)
        if (affiliateId !== 'PLACEHOLDER') {
          url.searchParams.set(affiliateParam, affiliateId)
        }
        window.open(url.toString(), '_blank')
      }

      // Deep link for Lovable
      if (platform === 'Lovable') {
        const { baseUrl, affiliateParam, affiliateId } = AFFILIATE_CONFIG.lovable
        let url = `${baseUrl}?autosubmit=true`
        if (affiliateParam && affiliateId !== 'PLACEHOLDER') {
          url += `&${affiliateParam}=${affiliateId}`
        }
        url += `#prompt=${encodeURIComponent(text)}`
        window.open(url, '_blank')
      }
    } catch {}
  }

  return (
    <>
      {/* Top stripe — sticky (desktop only; mobile uses MobileNav) */}
      <div className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-sand-700 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-200"
        >
          <ArrowLeft weight="regular" size={15} />
          Back
        </button>

        <span className="text-sm font-semibold text-olive-500">/{name}</span>

        <div className="flex justify-end">
          <HeaderSocials />
        </div>
      </div>

      <main className="bg-sand-200 dark:bg-sand-950">
        <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-12">

          {/* Mobile back button */}
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-sand-700 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-200 md:hidden"
          >
            <ArrowLeft weight="regular" size={15} />
            Back
          </button>

          {/* Header */}
          <div className="mb-8">
            {/* Page heading — bold (700). Subtitle is an answer-block for GEO:
                the first 200 tokens on each page carry a definitional answer. */}
            <h1 className="text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
              <span className="block">{name}</span>
              {headingSubtitle && (
                <span className="mt-2 block text-base font-normal leading-relaxed tracking-normal text-sand-600 dark:text-sand-400 sm:text-lg">
                  {headingSubtitle}
                </span>
              )}
            </h1>
            {/* Description — normal (400). Hidden when subtitle already covers it. */}
            {!headingSubtitle && (
              <p className="mt-3 font-normal text-sand-600 dark:text-sand-400">{description}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <TagIcon weight="regular" size={14} className="shrink-0 text-sand-400 dark:text-sand-500" />
              {tags.map((tag) =>
                tag.accent ? (
                  <span key={tag.label} className="rounded-full border border-olive-500/25 bg-olive-500/10 px-2.5 py-0.5 text-xs font-semibold text-olive-600 dark:text-olive-400">
                    {tag.label}
                  </span>
                ) : (
                  <span key={tag.label} className="rounded-full border border-sand-300 bg-sand-200 px-2.5 py-0.5 text-xs font-semibold text-sand-600 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-400">
                    {tag.label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Main card */}
          <div ref={mainCardRef} className="overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 shadow-sm dark:border-sand-800 dark:bg-sand-900 dark:shadow-none">

            {/* Tab bar — tabs left, card theme toggle right */}
            <div className="flex items-center justify-between border-b border-sand-300 px-3 py-3 dark:border-sand-800 sm:px-5 sm:py-4">

              {/* Preview / Code tabs */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
                  }`}
                >
                  <Eye weight="regular" size={15} />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'code'
                      ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
                  }`}
                >
                  <Code weight="regular" size={15} />
                  Code
                </button>
              </div>

              {/* Right-side controls */}
              <div className="flex items-center gap-0.5 sm:gap-2">

                {/* Theme toggle — hidden on code tab */}
                <div className="group/toggle relative" style={{ cursor: !dualTheme ? 'not-allowed' : undefined, display: activeTab === 'code' ? 'none' : undefined }}>
                  <button
                    onClick={() => dualTheme && setCardTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border transition-all duration-150 ${
                      dualTheme
                        ? 'border-sand-300 text-sand-500 hover:border-sand-400 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:text-sand-400 dark:hover:border-sand-600 dark:hover:text-sand-100'
                        : 'pointer-events-none border-sand-300 text-sand-400 opacity-40 dark:border-sand-700 dark:text-sand-600'
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {cardTheme === 'dark' ? (
                        <motion.span
                          key="moon"
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Moon weight="regular" size={16} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="sun"
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Sun weight="regular" size={16} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/toggle:block">
                    {dualTheme
                      ? cardTheme === 'dark' ? 'Switch to light' : 'Switch to dark'
                      : 'Dark mode only'}
                  </div>
                </div>

                {/* Refresh — preview only */}
                {activeTab === 'preview' && (
                  <div className="group/refresh relative">
                    <button
                      onClick={refreshPreview}
                      aria-label="Restart animation"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand-300 text-sand-500 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:text-sand-400 dark:hover:border-sand-600 dark:hover:text-sand-100"
                    >
                      <ArrowClockwise weight="regular" size={16} />
                    </button>
                    <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/refresh:block">
                      Refresh
                    </div>
                  </div>
                )}

                {/* Fullscreen — preview only, accented */}
                {activeTab === 'preview' && (
                  <div className="group/fullscreen relative">
                    <button
                      onClick={() => {
                        track('Fullscreen Open', { component: slug })
                        setFullscreen(true)
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand-300 bg-sand-200 text-sand-700 transition-colors hover:border-sand-400 hover:bg-sand-300 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-700 dark:hover:text-sand-100"
                    >
                      <CornersOut weight="regular" size={16} />
                    </button>
                    <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/fullscreen:block">
                      Full screen
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Content area — background controlled by cardTheme, isolated from global theme */}
            <div
              data-card-theme={cardTheme}
              className={`relative h-[320px] overflow-hidden transition-colors duration-300 sm:h-[480px] ${
                cardTheme === 'dark' ? 'dark bg-sand-950' : 'bg-sand-100'
              }`}
            >
              {/* Both tabs stay mounted so the syntax-highlighted code is in the
                  server-rendered HTML — Google indexes it even while the Preview
                  tab is active. Visibility toggled via opacity + pointer-events. */}
              <motion.div
                initial={false}
                animate={{ opacity: activeTab === 'preview' ? 1 : 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ pointerEvents: activeTab === 'preview' ? 'auto' : 'none' }}
                aria-hidden={activeTab !== 'preview'}
              >
                {/* Keyed wrapper so the refresh button can force a remount.
                    Skipped while fullscreen is open so the preview component
                    only mounts ONCE — otherwise it runs in parallel with the
                    fullscreen instance and tanks framerate (especially for
                    canvas / three.js / heavy framer-motion components). */}
                {!fullscreen && (
                  <div key={previewKey} className="contents">
                    {children}
                  </div>
                )}
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: activeTab === 'code' ? 1 : 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-sand-950 p-5"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4A453F transparent',
                  pointerEvents: activeTab === 'code' ? 'auto' : 'none',
                }}
                aria-hidden={activeTab !== 'code'}
              >
                {highlightedCode}
              </motion.div>
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-end gap-2 border-t border-sand-300 px-3 py-3 dark:border-sand-800 sm:px-5 sm:py-4">

              {/* Copy CLI — copies npx shadcn install command */}
              <button
                onClick={copyCli}
                className="flex items-center gap-2 rounded-lg border border-sand-300 bg-sand-50 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-all hover:border-sand-400 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-50"
              >
                {cliCopied
                  ? <Check weight="regular" size={15} />
                  : <Terminal weight="regular" size={15} />}
                {cliCopied ? 'Copied!' : 'Copy CLI'}
              </button>

              {/* Copy Prompt — dropdown with 3 platforms.
                  Hidden entirely when no prompts are available so the button
                  can never open an empty dropdown. */}
              {availablePlatforms.length > 0 && (
                <div className="relative" ref={promptDropdownRef}>
                  <button
                    onClick={() => setPromptDropdownOpen((o) => {
                      if (!o) track('Remix Open', { component: slug })
                      return !o
                    })}
                    className="flex items-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
                  >
                    {promptCopied ? <Check weight="regular" size={15} /> : <Sparkle weight="regular" size={15} />}
                    {promptCopied ? 'Copied!' : 'Remix with AI'}
                    {!promptCopied && <DotsThreeVertical weight="bold" size={15} />}
                  </button>
                  {promptDropdownOpen && (
                    <div className="absolute bottom-full right-0 z-40 mb-2 w-52 overflow-hidden rounded-xl border border-sand-300 bg-sand-100 shadow-xl dark:border-sand-700 dark:bg-sand-900">
                      {availablePlatforms.map((platform) => (
                        <button
                          key={platform}
                          onClick={() => {
                            handlePlatformClick(platform)
                            setPromptDropdownOpen(false)
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-sand-700 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
                        >
                          {PLATFORM_ICONS[platform]}
                          Try in {platform}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* ── Installation ─────────────────────────────────────────────── */}
          {(() => {
            // Dynamic step numbers for Manual tab — deps step is optional
            const manualStep = {
              deps: depsCommand ? 1 : null,
              code: depsCommand ? 2 : 1,
              dark: depsCommand ? 3 : 2,
              font: depsCommand ? 4 : 3,
            }
            return (
            <section className="mt-12">
              <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">
                Add to your project
              </h2>
              <p className="mb-4 mt-1 text-sm text-sand-500 dark:text-sand-400">
                One command adds this component to your project.
              </p>

              {/* CLI / Manual tabs */}
              <div className="overflow-hidden rounded-xl border border-sand-300 dark:border-sand-800">
                <div className="flex border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
                  <button
                    onClick={() => {
                      if (installTab !== 'cli') track('Install Tab Switch', { component: slug, tab: 'cli' })
                      setInstallTab('cli')
                    }}
                    className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                      installTab === 'cli'
                        ? 'text-sand-900 dark:text-sand-50'
                        : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
                    }`}
                  >
                    CLI
                    {installTab === 'cli' && (
                      <span className="absolute inset-x-0 -bottom-px h-px bg-sand-900 dark:bg-sand-50" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (installTab !== 'manual') track('Install Tab Switch', { component: slug, tab: 'manual' })
                      setInstallTab('manual')
                    }}
                    className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                      installTab === 'manual'
                        ? 'text-sand-900 dark:text-sand-50'
                        : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
                    }`}
                  >
                    Manual
                    {installTab === 'manual' && (
                      <span className="absolute inset-x-0 -bottom-px h-px bg-sand-900 dark:bg-sand-50" />
                    )}
                  </button>
                </div>

                <div className="bg-sand-100 px-5 py-6 dark:bg-sand-900">
                  {installTab === 'cli' ? (
                    <div className="space-y-6">
                      {/* Step 1 — shadcn add */}
                      <Step number={1}>
                          <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                            Run the following command. New project? Run <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">npx shadcn@latest init</code> first to set up Tailwind and path aliases.
                          </p>
                          <div className="overflow-hidden rounded-lg bg-sand-950">
                            {/* Package manager switcher */}
                            <div className="flex items-center gap-1 border-b border-sand-800 px-4 py-2">
                              {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                                <button
                                  key={pm}
                                  onClick={() => { setPkgManager(pm); setDepsCopied(false) }}
                                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                    pkgManager === pm
                                      ? 'bg-sand-800 text-sand-100'
                                      : 'text-sand-500 hover:text-sand-300'
                                  }`}
                                >
                                  {pm}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  const cmd = pkgManager === 'npm'
                                    ? `npx shadcn@latest add @aicanvas/${slug}`
                                    : pkgManager === 'pnpm'
                                    ? `pnpm dlx shadcn@latest add @aicanvas/${slug}`
                                    : pkgManager === 'yarn'
                                    ? `npx shadcn@latest add @aicanvas/${slug}`
                                    : `bunx shadcn@latest add @aicanvas/${slug}`
                                  navigator.clipboard.writeText(cmd)
                                  setDepsCopied(true)
                                  setTimeout(() => setDepsCopied(false), 2000)
                                }}
                                className="ml-auto shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                              >
                                {depsCopied
                                  ? <Check weight="regular" size={14} className="text-olive-500" />
                                  : <Copy weight="regular" size={14} />}
                              </button>
                            </div>

                            {/* Command */}
                            <div className="px-4 py-3.5">
                              <code className="font-mono text-sm text-sand-300">
                                {pkgManager === 'pnpm'
                                  ? `pnpm dlx shadcn@latest add @aicanvas/${slug}`
                                  : pkgManager === 'bun'
                                  ? `bunx shadcn@latest add @aicanvas/${slug}`
                                  : `npx shadcn@latest add @aicanvas/${slug}`}
                              </code>
                            </div>
                          </div>
                      </Step>

                      {/* Step 2 — Dark mode (optional) */}
                      <Step
                        number={2}
                        isLast={!FONT_SNIPPETS && !FONT_PKG_SNIPPET && !fontPkgSelfContained}
                      >
                          <div className="mb-2.5 flex items-center gap-2">
                            <p className="text-sm text-sand-600 dark:text-sand-400">
                              For dark mode, add the <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">dark</code> class to your <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">&lt;html&gt;</code> element:
                            </p>
                            <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">Optional</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-sand-950 px-4 py-3">
                            <code className="font-mono text-sm text-sand-300">{'<html class="dark">'}</code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('<html class="dark">')
                                setDarkCopied(true)
                                setTimeout(() => setDarkCopied(false), 2000)
                              }}
                              className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                            >
                              {darkCopied
                                ? <Check weight="regular" size={14} className="text-olive-500" />
                                : <Copy weight="regular" size={14} />}
                            </button>
                          </div>
                      </Step>

                      {/* Step 3 — Font (optional, only when component specifies a font) */}
                      {FONT_SNIPPETS && (
                        <Step number={3} isLast={!FONT_PKG_SNIPPET && !fontPkgSelfContained}>
                            <div className="mb-2.5 flex items-center gap-2">
                              <p className="text-sm text-sand-600 dark:text-sand-400">
                                This component uses <span className="font-semibold text-sand-700 dark:text-sand-300">{fontName}</span>. Add it to your project:
                              </p>
                              <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">Optional</span>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-sand-950">
                              <div className="flex items-center gap-1 border-b border-sand-800 px-4 py-2">
                                {(['html', 'nextjs'] as const).map((fw) => (
                                  <button
                                    key={fw}
                                    onClick={() => { setFontFramework(fw); setFontCopied(false) }}
                                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${fontFramework === fw ? 'bg-sand-800 text-sand-100' : 'text-sand-500 hover:text-sand-300'}`}
                                  >
                                    {fw === 'html' ? 'HTML' : 'Next.js'}
                                  </button>
                                ))}
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(FONT_SNIPPETS[fontFramework])
                                    setFontCopied(true)
                                    setTimeout(() => setFontCopied(false), 2000)
                                  }}
                                  className="ml-auto shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                                >
                                  {fontCopied
                                    ? <Check weight="regular" size={14} className="text-olive-500" />
                                    : <Copy weight="regular" size={14} />}
                                </button>
                              </div>
                              <div className="px-4 py-3.5">
                                <code className="whitespace-pre font-mono text-sm text-sand-300">{FONT_SNIPPETS[fontFramework]}</code>
                              </div>
                            </div>
                        </Step>
                      )}

                      {/* Step 3 — Package font (optional, only when component specifies a font-pkg) */}
                      {(FONT_PKG_SNIPPET || fontPkgSelfContained) && (
                        <Step number={3} isLast>
                            <div className="mb-2.5 flex items-center gap-2">
                              <p className="text-sm text-sand-600 dark:text-sand-400">
                                This component uses <span className="font-semibold text-sand-700 dark:text-sand-300">{fontPkgClass}</span> from <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">{fontPkgName}</code>.{fontPkgSelfContained ? ' Install the package:' : ' Install and register it:'}
                              </p>
                              <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">Optional</span>
                            </div>
                            <div className={`flex items-center justify-between rounded-lg bg-sand-950 px-4 py-3 ${FONT_PKG_SNIPPET ? 'mb-2' : ''}`}>
                              <code className="font-mono text-sm text-sand-300">{FONT_PKG_INSTALL}</code>
                              <button
                                onClick={() => { navigator.clipboard.writeText(FONT_PKG_INSTALL!); setFontPkgInstallCopied(true); setTimeout(() => setFontPkgInstallCopied(false), 2000) }}
                                className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                              >
                                {fontPkgInstallCopied ? <Check weight="regular" size={14} className="text-olive-500" /> : <Copy weight="regular" size={14} />}
                              </button>
                            </div>
                            {FONT_PKG_SNIPPET && (
                              <div className="overflow-hidden rounded-lg bg-sand-950">
                                <div className="flex items-center justify-between border-b border-sand-800 px-4 py-2">
                                  <span className="font-mono text-xs text-sand-500">layout.tsx</span>
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(FONT_PKG_SNIPPET!); setFontPkgSnippetCopied(true); setTimeout(() => setFontPkgSnippetCopied(false), 2000) }}
                                    className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                                  >
                                    {fontPkgSnippetCopied ? <Check weight="regular" size={14} className="text-olive-500" /> : <Copy weight="regular" size={14} />}
                                  </button>
                                </div>
                                <div className="px-4 py-3.5">
                                  <code className="whitespace-pre font-mono text-sm text-sand-300">{FONT_PKG_SNIPPET}</code>
                                </div>
                              </div>
                            )}
                        </Step>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Step 1 — Install deps (only when component has deps) */}
                      {depsCommand && (
                      <Step number={1}>
                          <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                            Install the following dependencies:
                          </p>
                          <div className="flex items-center justify-between rounded-lg bg-sand-950 px-4 py-3">
                            <code className="font-mono text-sm text-sand-300">
                              {depsCommand}
                            </code>
                            <button
                              onClick={copyDeps}
                              className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                            >
                              {depsCopied
                                ? <Check weight="regular" size={14} className="text-olive-500" />
                                : <Copy weight="regular" size={14} />}
                            </button>
                          </div>
                      </Step>
                      )}

                      {/* Step — Copy the code */}
                      <Step number={manualStep.code}>
                          <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                            Copy and paste the following code into your project:
                          </p>
                          <div className="relative rounded-lg bg-sand-950">
                            <div className="flex items-center justify-between border-b border-sand-800 px-4 py-2">
                              <span className="font-mono text-xs text-sand-500">
                                {slug}.tsx
                              </span>
                              <button
                                onClick={copyCode}
                                className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                              >
                                {codeCopied
                                  ? <Check weight="regular" size={14} className="text-olive-500" />
                                  : <Copy weight="regular" size={14} />}
                              </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A453F transparent' }}>
                              {highlightedCode}
                            </div>
                          </div>
                      </Step>

                      {/* Step — Dark mode (optional) */}
                      <Step
                        number={manualStep.dark}
                        isLast={!FONT_SNIPPETS && !FONT_PKG_SNIPPET}
                      >
                          <div className="mb-2.5 flex items-center gap-2">
                            <p className="text-sm text-sand-600 dark:text-sand-400">
                              For dark mode, add the <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">dark</code> class to your <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">&lt;html&gt;</code> element:
                            </p>
                            <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">Optional</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-sand-950 px-4 py-3">
                            <code className="font-mono text-sm text-sand-300">{'<html class="dark">'}</code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('<html class="dark">')
                                setDarkCopied(true)
                                setTimeout(() => setDarkCopied(false), 2000)
                              }}
                              className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                            >
                              {darkCopied
                                ? <Check weight="regular" size={14} className="text-olive-500" />
                                : <Copy weight="regular" size={14} />}
                            </button>
                          </div>
                      </Step>

                      {/* Step — Font (optional, only when component specifies a font) */}
                      {FONT_SNIPPETS && (
                        <Step number={manualStep.font} isLast={!FONT_PKG_SNIPPET}>
                            <div className="mb-2.5 flex items-center gap-2">
                              <p className="text-sm text-sand-600 dark:text-sand-400">
                                This component uses <span className="font-semibold text-sand-700 dark:text-sand-300">{fontName}</span>. Add it to your project:
                              </p>
                              <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">Optional</span>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-sand-950">
                              <div className="flex items-center gap-1 border-b border-sand-800 px-4 py-2">
                                {(['html', 'nextjs'] as const).map((fw) => (
                                  <button
                                    key={fw}
                                    onClick={() => { setFontFramework(fw); setFontCopied(false) }}
                                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${fontFramework === fw ? 'bg-sand-800 text-sand-100' : 'text-sand-500 hover:text-sand-300'}`}
                                  >
                                    {fw === 'html' ? 'HTML' : 'Next.js'}
                                  </button>
                                ))}
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(FONT_SNIPPETS[fontFramework])
                                    setFontCopied(true)
                                    setTimeout(() => setFontCopied(false), 2000)
                                  }}
                                  className="ml-auto shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                                >
                                  {fontCopied
                                    ? <Check weight="regular" size={14} className="text-olive-500" />
                                    : <Copy weight="regular" size={14} />}
                                </button>
                              </div>
                              <div className="px-4 py-3.5">
                                <code className="whitespace-pre font-mono text-sm text-sand-300">{FONT_SNIPPETS[fontFramework]}</code>
                              </div>
                            </div>
                        </Step>
                      )}

                      {/* Step — Package font (optional, only when component specifies a font-pkg) */}
                      {FONT_PKG_SNIPPET && (
                        <Step number={manualStep.font} isLast>
                            <div className="mb-2.5 flex items-center gap-2">
                              <p className="text-sm text-sand-600 dark:text-sand-400">
                                This component uses <span className="font-semibold text-sand-700 dark:text-sand-300">{fontPkgClass}</span> from <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">{fontPkgName}</code>. Install and register it:
                              </p>
                              <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">Optional</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-sand-950 px-4 py-3 mb-2">
                              <code className="font-mono text-sm text-sand-300">{FONT_PKG_INSTALL}</code>
                              <button
                                onClick={() => { navigator.clipboard.writeText(FONT_PKG_INSTALL!); setFontPkgInstallCopied(true); setTimeout(() => setFontPkgInstallCopied(false), 2000) }}
                                className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                              >
                                {fontPkgInstallCopied ? <Check weight="regular" size={14} className="text-olive-500" /> : <Copy weight="regular" size={14} />}
                              </button>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-sand-950">
                              <div className="flex items-center justify-between border-b border-sand-800 px-4 py-2">
                                <span className="font-mono text-xs text-sand-500">layout.tsx</span>
                                <button
                                  onClick={() => { navigator.clipboard.writeText(FONT_PKG_SNIPPET!); setFontPkgSnippetCopied(true); setTimeout(() => setFontPkgSnippetCopied(false), 2000) }}
                                  className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                                >
                                  {fontPkgSnippetCopied ? <Check weight="regular" size={14} className="text-olive-500" /> : <Copy weight="regular" size={14} />}
                                </button>
                              </div>
                              <div className="px-4 py-3.5">
                                <code className="whitespace-pre font-mono text-sm text-sand-300">{FONT_PKG_SNIPPET}</code>
                              </div>
                            </div>
                        </Step>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )})()}

          {/* ── Related components ─────────────────────────────────────────── */}
          {related.length > 0 && (
            <section className="mt-16">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="text-lg font-bold text-sand-900 dark:text-sand-50">
                  More like this
                </h2>
                {canPaginate && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => pageRelated(-1)}
                      disabled={!canGoPrev}
                      aria-label="Previous related components"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand-300 bg-sand-100 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <ArrowLeft weight="regular" size={15} />
                    </button>
                    <button
                      onClick={() => pageRelated(1)}
                      disabled={!canGoNext}
                      aria-label="Next related components"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand-300 bg-sand-100 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <ArrowRight weight="regular" size={15} />
                    </button>
                  </div>
                )}
              </div>
              <div className="relative overflow-hidden">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence
                    mode="popLayout"
                    custom={relatedDir}
                    initial={false}
                  >
                    {visibleRelated.map((c, i) => (
                      <motion.div
                        key={c.slug}
                        layout
                        custom={relatedDir}
                        variants={{
                          enter: (dir: 1 | -1) => ({
                            x: dir > 0 ? '110%' : '-110%',
                            opacity: 0,
                            zIndex: 10,
                          }),
                          center: { x: 0, opacity: 1, zIndex: 10 },
                          exit: { x: 0, opacity: 0, zIndex: -1 },
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                          layout: {
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        className="relative"
                      >
                        <Link
                          href={`/components/${c.slug}`}
                          onClick={() => track('Component Card Click', { component: c.slug, position: relatedStart + i, source: 'related' })}
                          className="group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-sand-100 transition-colors duration-200 hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
                        >
                          <div className="relative aspect-video overflow-hidden bg-sand-950">
                            {c.image ? (
                              <img
                                src={c.image}
                                alt={c.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                              />
                            ) : (
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage:
                                    'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                                  backgroundSize: '18px 18px',
                                }}
                              />
                            )}
                          </div>
                          <div className="px-3 py-2.5">
                            <h3 className="truncate text-sm font-semibold text-sand-900 dark:text-sand-50">
                              {c.name}
                            </h3>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ── Fullscreen overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            key="fullscreen-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75"
            onClick={() => setFullscreen(false)}
          >
            <motion.div
              key="fullscreen-panel"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              data-card-theme={cardTheme}
              className={`absolute inset-0 overflow-hidden transition-colors duration-300 sm:inset-10 sm:rounded-2xl sm:border sm:shadow-2xl ${
                cardTheme === 'dark'
                  ? 'dark bg-sand-950 sm:border-sand-800'
                  : 'bg-sand-100 sm:border-sand-300'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {children}

              {/* Close button */}
              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg border border-sand-700 bg-sand-900/95 text-sand-400 transition-all duration-150 hover:border-sand-500 hover:bg-sand-800 hover:text-sand-100 active:scale-95"
              >
                <CornersIn weight="regular" size={17} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CLI copied toast ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {cliCopied && (
          <motion.div
            key="cli-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-16 z-50 -translate-x-1/2"
            style={{
              left: mainCardRef.current
                ? mainCardRef.current.getBoundingClientRect().left + mainCardRef.current.offsetWidth / 2
                : '50%',
            }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-sand-700 bg-sand-800 px-4 py-3 shadow-lg">
              <Check weight="regular" size={16} className="shrink-0 text-olive-500" />
              <div>
                <p className="text-sm font-semibold text-sand-50">
                  Install command copied
                </p>
                <p className="mt-0.5 text-xs text-sand-400">
                  Paste into your terminal to add this component.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt copied toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {promptCopied && (
          <motion.div
            key="prompt-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-16 z-50 -translate-x-1/2"
            style={{
              left: mainCardRef.current
                ? mainCardRef.current.getBoundingClientRect().left + mainCardRef.current.offsetWidth / 2
                : '50%',
            }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-sand-700 bg-sand-800 px-4 py-3 shadow-lg">
              <Check weight="regular" size={16} className="shrink-0 text-olive-500" />
              <div>
                <p className="text-sm font-semibold text-sand-50">
                  {promptCopied} prompt copied
                </p>
                <p className="mt-0.5 text-xs text-sand-400">
                  Paste into {promptCopied} to remix this component.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
