'use client'

import { useState } from 'react'
import { Step } from '../components/Step'
import { CodeBlock, Toast, useToast } from '../components/CopyBlocks'
import { copyText } from '../components/useCopied'

// memoryHD ships from its own public repository. Two paths in: the plugin
// marketplace (persistent) or a plain clone + --plugin-dir (try it first).
const MARKETPLACE_ADD = '/plugin marketplace add uiNerd16/memoryHD'
const PLUGIN_INSTALL = '/plugin install memoryhd'
const CLONE_TRY = `git clone https://github.com/uiNerd16/memoryHD.git
claude --plugin-dir ./memoryHD`

const TEST_PROMPT = 'remember that we deploy from the release branch, never from main'

type Path = 'marketplace' | 'try'

export function MemoryInstall() {
  const { message, show } = useToast()
  const [path, setPath] = useState<Path>('marketplace')
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(text: string, toast: string, key: string) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      show('Copy not supported, copy it manually')
      return
    }
    if (!(await copyText(text))) {
      show('Copy failed, try again')
      return
    }
    setCopied(key)
    show(toast)
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sand-300 dark:border-sand-800">
      {/* Path toggle */}
      <div className="flex gap-1.5 border-b border-sand-300 bg-sand-100 p-1.5 dark:border-sand-800 dark:bg-sand-900">
        {(
          [
            { id: 'marketplace', label: 'Install the plugin' },
            { id: 'try', label: 'Try it from a clone' },
          ] as { id: Path; label: string }[]
        ).map((t) => {
          const active = path === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setPath(t.id)}
              aria-pressed={active}
              className={`relative min-h-11 min-w-0 flex-1 rounded-lg px-2 py-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                active
                  ? 'bg-sand-50 text-sand-900 shadow-sm ring-1 ring-sand-300 dark:bg-sand-800 dark:text-sand-50 dark:ring-sand-700'
                  : 'text-sand-500 hover:text-sand-700 dark:text-sand-500 dark:hover:text-sand-300'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Steps */}
      <div className="space-y-6 bg-sand-100 px-5 py-6 dark:bg-sand-900">
        {path === 'marketplace' ? (
          <>
            <Step number={1}>
              <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                Inside Claude Code, add the marketplace, then install:
              </p>
              <div className="space-y-2">
                <CodeBlock
                  command={MARKETPLACE_ADD}
                  copied={copied === 'add'}
                  onCopy={() => copy(MARKETPLACE_ADD, 'Command copied', 'add')}
                  label="marketplace add command"
                />
                <CodeBlock
                  command={PLUGIN_INSTALL}
                  copied={copied === 'install'}
                  onCopy={() => copy(PLUGIN_INSTALL, 'Command copied', 'install')}
                  label="plugin install command"
                />
              </div>
            </Step>
            <Step number={2}>
              <p className="text-sm text-sand-600 dark:text-sand-400">
                Claude Code activates it as it installs; if it does not say so,
                run <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">/reload-plugins</code>.
                That is the whole setup: no config file, no API key, no service.
              </p>
            </Step>
          </>
        ) : (
          <>
            <Step number={1}>
              <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                Clone the repository and start Claude Code with the plugin, for
                this session only:
              </p>
              <CodeBlock
                command={CLONE_TRY}
                copied={copied === 'clone'}
                onCopy={() => copy(CLONE_TRY, 'Commands copied', 'clone')}
                label="clone and run commands"
                multiline
              />
            </Step>
            <Step number={2}>
              <p className="text-sm text-sand-600 dark:text-sand-400">
                Nothing is installed permanently. Exit the session and the
                plugin is gone; keep it by installing from the marketplace tab.
              </p>
            </Step>
          </>
        )}

        <Step number={3} isLast>
          <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
            Test it. Say this, then start a new session and ask about deploys:
          </p>
          <CodeBlock
            command={TEST_PROMPT}
            copied={copied === 'test'}
            onCopy={() => copy(TEST_PROMPT, 'Test prompt copied', 'test')}
            label="test prompt"
          />
        </Step>
      </div>

      <Toast message={message} />
    </div>
  )
}
