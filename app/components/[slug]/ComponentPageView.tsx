'use client'

import { useState, useEffect } from 'react'
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
  X,
} from '@phosphor-icons/react'
import type { Tag, Platform } from '../ComponentCard'
import { PLATFORMS } from '../ComponentCard'
import { HeaderSocials } from '../HeaderSocials'
import type { ComponentMeta } from '../../lib/component-registry'

// ─── Platform icons (inlined SVGs — no external dependency) ───────────────────

const PLATFORM_ICONS: Partial<Record<Platform, React.ReactNode>> = {
  Claude: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  ),
  GPT: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  ),
  Gemini: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
      <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" />
    </svg>
  ),
  V0: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
      <path d="M12 3L22 21H2L12 3Z" />
    </svg>
  ),
}

// ─── ComponentPageView ────────────────────────────────────────────────────────

interface ComponentPageViewProps {
  slug: string
  name: string
  description: string
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
  const [codeCopied, setCodeCopied] = useState(false)
  const [depsCopied, setDepsCopied] = useState(false)
  const [installTab, setInstallTab] = useState<'cli' | 'manual'>('cli')
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm')
  const [darkCopied, setDarkCopied] = useState(false)
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

  // Prompt drawer — replaces the old click-blind dropdown.
  const [promptDrawerOpen, setPromptDrawerOpen] = useState(false)
  const availablePlatforms = PLATFORMS.filter((p) => prompts[p])
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(
    availablePlatforms[0] ?? 'Claude',
  )

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

  // Escape key closes whichever overlay is open (fullscreen or drawer).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (fullscreen) setFullscreen(false)
      if (promptDrawerOpen) setPromptDrawerOpen(false)
    }
    if (fullscreen || promptDrawerOpen) {
      document.addEventListener('keydown', onKey)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen, promptDrawerOpen])

  function refreshPreview() {
    setPreviewKey((k) => k + 1)
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {}
  }

  async function copyPrompt(platform: Platform) {
    try {
      const text = prompts[platform]
      if (!text) return
      await navigator.clipboard.writeText(text)
      setPromptCopied(platform)
      setTimeout(() => setPromptCopied(null), 2000)
    } catch {}
  }

  return (
    <>
      {/* Top stripe — sticky (desktop only; mobile uses MobileNav) */}
      <div className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-sand-300 bg-sand-200/90 px-6 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90 md:grid">
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
            {/* Page heading — bold (700) */}
            <h1 className="text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
              {name}
            </h1>
            {/* Description — normal (400) */}
            <p className="mt-3 font-normal text-sand-600 dark:text-sand-400">{description}</p>
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
          <div className="overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 shadow-sm dark:border-sand-800 dark:bg-sand-900 dark:shadow-none">

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

                {/* Refresh icon button — only visible during preview tab */}
                {activeTab === 'preview' && (
                  <div className="group/refresh relative">
                    <button
                      onClick={refreshPreview}
                      aria-label="Restart animation"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <ArrowClockwise weight="regular" size={16} />
                    </button>
                    <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/refresh:block">
                      Reset
                    </div>
                  </div>
                )}

                {/* Fullscreen icon button — preview only */}
                {activeTab === 'preview' && (
                  <div className="group/fullscreen relative">
                    <button
                      onClick={() => setFullscreen(true)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <CornersOut weight="regular" size={16} />
                    </button>
                    <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/fullscreen:block">
                      Full screen
                    </div>
                  </div>
                )}

                {/* Theme pill — hidden on code tab, sun / moon icons on preview */}
                <div className="group/toggle relative" style={{ cursor: !dualTheme ? 'not-allowed' : undefined, display: activeTab === 'code' ? 'none' : undefined }}>
                  <button
                    onClick={() => dualTheme && setCardTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    className={`flex items-center gap-1 rounded-full border px-3.5 py-2 transition-all duration-150 ${
                      dualTheme
                        ? cardTheme === 'dark'
                          ? 'border-sand-300 bg-sand-200 text-sand-700 hover:border-sand-400 hover:bg-sand-300 active:scale-95 active:bg-sand-400 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-700 dark:active:bg-sand-600'
                          : 'border-olive-500/40 bg-olive-500/10 text-olive-600 hover:bg-olive-500/20 active:scale-95 active:bg-olive-500/30 dark:border-olive-500/40 dark:text-olive-400 dark:hover:bg-olive-500/20 dark:active:bg-olive-500/30'
                        : 'pointer-events-none border-sand-300 bg-sand-200 text-sand-400 opacity-40 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-600'
                    }`}
                  >
                    <Moon weight="regular" size={15} className={cardTheme === 'light' ? 'opacity-40' : ''} />
                    <span className="h-3.5 w-px bg-current opacity-20" />
                    <Sun weight="regular" size={15} className={cardTheme === 'dark' ? 'opacity-40' : ''} />
                  </button>
                  <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/toggle:block">
                    {dualTheme
                      ? cardTheme === 'dark' ? 'Switch to light' : 'Switch to dark'
                      : 'Dark mode only'}
                  </div>
                </div>

              </div>
            </div>

            {/* Content area — background controlled by cardTheme, isolated from global theme */}
            <div
              data-card-theme={cardTheme}
              className={`relative h-[320px] overflow-hidden transition-colors duration-300 sm:h-[480px] ${
                cardTheme === 'dark' ? 'dark bg-sand-950' : 'bg-sand-100'
              }`}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'preview' ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
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
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden p-5"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A453F transparent' }}
                  >
                    {highlightedCode}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 border-t border-sand-300 px-3 py-3 dark:border-sand-800 sm:px-5 sm:py-4">

              {/* Dependencies pill — only shown when the component has external deps */}
              {depsCommand && (
                <button
                  onClick={copyDeps}
                  className="group mr-auto flex items-center gap-2 rounded-lg border border-sand-300 bg-sand-100 px-3 py-2 font-mono text-xs text-sand-500 transition-all hover:border-sand-400 hover:text-sand-700 active:scale-95 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-500 dark:hover:border-sand-700 dark:hover:text-sand-300"
                >
                  <span className="text-olive-500">$</span>
                  <span>{depsCommand}</span>
                  {depsCopied
                    ? <Check weight="regular" size={13} className="shrink-0 text-olive-500" />
                    : <Copy weight="regular" size={13} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />}
                </button>
              )}

              {/* Copy Code — semibold (600) */}
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-lg border border-sand-300 bg-sand-50 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-all hover:border-sand-400 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-50"
              >
                {codeCopied
                  ? <Check weight="regular" size={15} />
                  : <Copy weight="regular" size={15} />}
                {codeCopied ? 'Copied!' : 'Copy Code'}
              </button>

              {/* Copy Prompt — opens prompt drawer */}
              <button
                onClick={() => setPromptDrawerOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
              >
                {promptCopied && <Check weight="regular" size={15} />}
                {promptCopied ? `${promptCopied} copied!` : 'Copy Prompt'}
              </button>

            </div>
          </div>

          {/* ── Installation ─────────────────────────────────────────────── */}
          {depsCommand && (
            <section className="mt-12">
              <h2 className="mb-4 text-base font-bold text-sand-900 dark:text-sand-50">
                Installation
              </h2>

              {/* CLI / Manual tabs */}
              <div className="overflow-hidden rounded-xl border border-sand-300 dark:border-sand-800">
                <div className="flex border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
                  <button
                    onClick={() => setInstallTab('cli')}
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
                    onClick={() => setInstallTab('manual')}
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

                <div className="bg-sand-100 px-5 py-5 dark:bg-sand-900">
                  {installTab === 'cli' ? (
                    <div className="space-y-5">
                      {/* Step 1 — shadcn add */}
                      <div className="flex gap-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand-300 text-xs font-semibold text-sand-500 dark:border-sand-700 dark:text-sand-400">1</span>
                        <div className="min-w-0 flex-1">
                          <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                            Run the following command:
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
                                    ? `npx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`
                                    : pkgManager === 'pnpm'
                                    ? `pnpm dlx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`
                                    : pkgManager === 'yarn'
                                    ? `npx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`
                                    : `bunx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`
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
                                  ? `pnpm dlx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`
                                  : pkgManager === 'bun'
                                  ? `bunx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`
                                  : `npx shadcn@latest add "https://aicanvas.me/r/${slug}.json"`}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 — Dark mode (optional) */}
                      <div className="flex gap-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand-300 text-xs font-semibold text-sand-500 dark:border-sand-700 dark:text-sand-400">2</span>
                        <div className="min-w-0 flex-1">
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
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Step 1 — Install deps */}
                      <div className="flex gap-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand-300 text-xs font-semibold text-sand-500 dark:border-sand-700 dark:text-sand-400">1</span>
                        <div className="min-w-0 flex-1">
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
                        </div>
                      </div>

                      {/* Step 2 — Copy the code */}
                      <div className="flex gap-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand-300 text-xs font-semibold text-sand-500 dark:border-sand-700 dark:text-sand-400">2</span>
                        <div className="min-w-0 flex-1">
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
                        </div>
                      </div>

                      {/* Step 3 — Dark mode (optional) */}
                      <div className="flex gap-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand-300 text-xs font-semibold text-sand-500 dark:border-sand-700 dark:text-sand-400">3</span>
                        <div className="min-w-0 flex-1">
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
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

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
                    {visibleRelated.map((c) => (
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

      {/* ── Prompt drawer ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {promptDrawerOpen && (
          <motion.div
            key="prompt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setPromptDrawerOpen(false)}
          >
            <motion.div
              key="prompt-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-sand-300 bg-sand-100 shadow-2xl dark:border-sand-800 dark:bg-sand-900 sm:w-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="flex shrink-0 items-center justify-between border-b border-sand-300 px-5 py-4 dark:border-sand-800">
                <div>
                  <h2 className="text-sm font-semibold text-sand-900 dark:text-sand-50">Prompts</h2>
                  <p className="mt-0.5 text-xs text-sand-500 dark:text-sand-400">
                    Read it, then copy for the AI tool you use.
                  </p>
                </div>
                <button
                  onClick={() => setPromptDrawerOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-200 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <X weight="regular" size={16} />
                </button>
              </div>

              {/* Platform tabs */}
              <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-sand-300 px-5 py-3 dark:border-sand-800">
                {availablePlatforms.map((platform) => {
                  const isActive = selectedPlatform === platform
                  return (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-sand-300 text-sand-900 dark:bg-sand-700 dark:text-sand-50'
                          : 'bg-transparent text-sand-500 hover:bg-sand-200 hover:text-sand-700 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-200'
                      }`}
                    >
                      {PLATFORM_ICONS[platform]}
                      {platform}
                    </button>
                  )
                })}
              </div>

              {/* Prompt body */}
              <div
                className="flex-1 overflow-auto px-5 py-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A453F transparent' }}
              >
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-sand-700 dark:text-sand-400">
                  {prompts[selectedPlatform]}
                </pre>
              </div>

              {/* Footer — copy CTA */}
              <div className="shrink-0 border-t border-sand-300 px-5 py-4 dark:border-sand-800">
                <button
                  onClick={() => copyPrompt(selectedPlatform)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2.5 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
                >
                  {promptCopied === selectedPlatform ? (
                    <>
                      <Check weight="regular" size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy weight="regular" size={16} />
                      Copy {selectedPlatform} prompt
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
