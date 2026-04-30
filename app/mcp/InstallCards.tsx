'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy } from '@phosphor-icons/react'
import { Step } from '../components/Step'

// ── Static config ────────────────────────────────────────────────────────────

const PACKAGE = '@aicanvas/mcp'
const SERVER_NAME = 'aicanvas'

const GLOBAL_CLI = `claude mcp add ${SERVER_NAME} --scope user -- npx -y ${PACKAGE}`
const PROJECT_CLI = `claude mcp add ${SERVER_NAME} -- npx -y ${PACKAGE}`
const TEST_PROMPT = `Use AI Canvas to find me an animated card stack and tell me how to install it.`

type Scope = 'global' | 'project'

// ── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 2400)
    return () => clearTimeout(t)
  }, [message])
  return { message, show: setMessage }
}

function Toast({ message }: { message: string | null }) {
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

// ── Code block with copy button (matches the per-component install style) ───

function CodeBlock({
  command,
  copied,
  onCopy,
}: {
  command: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-sand-950 px-4 py-3.5">
      <code className="flex-1 overflow-x-auto font-mono text-sm text-sand-300">
        {command}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
        aria-label="Copy command"
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

// ── Main ─────────────────────────────────────────────────────────────────────

export function InstallCards() {
  const { message, show } = useToast()
  const [scope, setScope] = useState<Scope>('global')
  const [installCopied, setInstallCopied] = useState(false)
  const [testCopied, setTestCopied] = useState(false)

  function copy(text: string, toast: string, setLocal: (v: boolean) => void) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      show('Copy not supported — copy manually')
      return
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setLocal(true)
        show(toast)
        setTimeout(() => setLocal(false), 2000)
      })
      .catch(() => show('Copy failed — try again'))
  }

  const installCommand = scope === 'global' ? GLOBAL_CLI : PROJECT_CLI

  return (
    <section className="mt-2">
      {/* Tabbed install widget — matches the per-component "Add to your project" */}
      <div className="overflow-hidden rounded-xl border border-sand-300 dark:border-sand-800">
        {/* Scope tabs */}
        <div className="flex border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
          <button
            onClick={() => setScope('global')}
            className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
              scope === 'global'
                ? 'text-sand-900 dark:text-sand-50'
                : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
            }`}
          >
            Add MCP globally
            {scope === 'global' && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-sand-900 dark:bg-sand-50" />
            )}
          </button>
          <button
            onClick={() => setScope('project')}
            className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
              scope === 'project'
                ? 'text-sand-900 dark:text-sand-50'
                : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
            }`}
          >
            Add MCP to a single project
            {scope === 'project' && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-sand-900 dark:bg-sand-50" />
            )}
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6 bg-sand-100 px-5 py-6 dark:bg-sand-900">
          <Step number={1}>
            <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
              {scope === 'global' ? (
                <>Run this command in any terminal. Works in every project after.</>
              ) : (
                <>
                  Run this command in your project root. Only this project will
                  see the MCP.
                </>
              )}
            </p>
            <CodeBlock
              command={installCommand}
              copied={installCopied}
              onCopy={() =>
                copy(installCommand, 'Install command copied', setInstallCopied)
              }
            />
          </Step>

          <Step number={2}>
            <p className="text-sm text-sand-600 dark:text-sand-400">
              Restart Claude Code. The{' '}
              <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">
                aicanvas
              </code>{' '}
              MCP loads automatically.
            </p>
          </Step>

          <Step number={3} isLast>
            <div className="mb-2.5 flex items-center gap-2">
              <p className="text-sm text-sand-600 dark:text-sand-400">
                Test it. Ask Claude:
              </p>
              <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">
                Optional
              </span>
            </div>
            <CodeBlock
              command={TEST_PROMPT}
              copied={testCopied}
              onCopy={() =>
                copy(TEST_PROMPT, 'Test prompt copied', setTestCopied)
              }
            />
          </Step>
        </div>
      </div>

      <Toast message={message} />
    </section>
  )
}
