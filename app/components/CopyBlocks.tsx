'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy } from '@phosphor-icons/react'

// Shared copy-to-clipboard primitives for install widgets (/mcp,
// /agentic-workflows). Moved out of the /mcp page module so other pages can
// use them without pulling that page's token fetch and tool tables into
// their chunk.

// Geist Mono shapes `--` as a ligature/contextual alternate, which visually
// swallows the space before it (e.g. `aicanvas--scope`). Disable ligatures so
// install commands render with correct spacing.
const NO_LIGATURES = {
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"liga" 0, "calt" 0',
} as const

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 2400)
    return () => clearTimeout(t)
  }, [message])
  return { message, show: setMessage }
}

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-2 rounded-full border border-sand-300 bg-sand-50/95 px-4 py-2.5 text-sm font-semibold text-sand-900 shadow-xl backdrop-blur dark:border-sand-700 dark:bg-sand-800/95 dark:text-sand-50"
          role="status"
        >
          <Check weight="regular" size={15} className="text-olive-500" />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function CodeBlock({
  command,
  copied,
  onCopy,
  label,
  multiline,
}: {
  command: string
  copied: boolean
  onCopy: () => void
  label: string
  multiline?: boolean
}) {
  return (
    <div
      className={`flex gap-3 rounded-lg bg-sand-950 px-4 py-3.5 ${
        multiline ? 'items-start' : 'items-center justify-between'
      }`}
    >
      {multiline ? (
        <pre
          className="min-w-0 flex-1 overflow-x-auto font-mono text-sm leading-relaxed text-sand-300"
          style={NO_LIGATURES}
        >
          {command}
        </pre>
      ) : (
        <code
          className="block min-w-0 flex-1 overflow-x-auto font-mono text-sm text-sand-300"
          style={NO_LIGATURES}
        >
          {command}
        </code>
      )}
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <Check weight="regular" size={14} className="text-olive-500" />
        ) : (
          <Copy weight="regular" size={14} />
        )}
      </button>
    </div>
  )
}
