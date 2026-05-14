#!/usr/bin/env node
// predev guard: re-install if package-lock.json is newer than the last
// `npm install` marker. Cheap on the happy path (one stat call, ~10ms);
// only spawns npm install when the lockfile has actually drifted ahead —
// which is exactly the state that produces unhelpful "Can't resolve X"
// errors on cold dev starts in a stale worktree.
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const lock = 'package-lock.json'
const marker = 'node_modules/.package-lock.json'

if (!fs.existsSync(lock)) process.exit(0)
const lockMtime = fs.statSync(lock).mtimeMs
const markerMtime = fs.existsSync(marker) ? fs.statSync(marker).mtimeMs : 0

// 50ms epsilon avoids re-installing on identical mtimes after a fresh install.
if (lockMtime > markerMtime + 50) {
  console.log('[predev] package-lock newer than node_modules — running npm install')
  execSync('npm install --no-audit --no-fund', { stdio: 'inherit' })
}
