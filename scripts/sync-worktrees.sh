#!/bin/bash
# Silent background sync — merges origin/main into every active worktree.
#
# Runs hourly via launchd (~/Library/LaunchAgents/me.aicanvas.sync-worktrees.plist).
# On clean merges: leaves the local worktree up-to-date with main, no push.
# On conflicts: aborts cleanly, logs the conflict, takes no further action.
# Skips worktrees with uncommitted changes or unrelated states.
#
# No notifications, no emails — just a log file you can tail when curious.

set -u

LOG_DIR="/Users/alexandrudaniel/aicanvas/scripts/sync-output"
LOG="$LOG_DIR/sync.log"
mkdir -p "$LOG_DIR"

WORKTREES=(
  "/Users/alexandrudaniel/aicanvas:ideation"
  "/Users/alexandrudaniel/aicanvas-auth:feat/user-accounts"
  "/Users/alexandrudaniel/aicanvas-mobile:feat/mobile"
)

ts() { date "+%Y-%m-%d %H:%M:%S"; }
log() { echo "[$(ts)] $*" >> "$LOG"; }

# Use the main repo to fetch — fetch updates the shared object store for all worktrees.
MAIN_REPO="/Users/alexandrudaniel/aicanvas"
if ! git -C "$MAIN_REPO" fetch origin --quiet 2>>"$LOG"; then
  log "fetch failed — aborting run"
  exit 0
fi

for entry in "${WORKTREES[@]}"; do
  path="${entry%%:*}"
  branch="${entry##*:}"

  if [ ! -d "$path" ]; then
    log "[$branch] skipped — worktree missing at $path"
    continue
  fi

  # Confirm the worktree is actually on the branch we think it is.
  current=$(git -C "$path" branch --show-current 2>/dev/null)
  if [ "$current" != "$branch" ]; then
    log "[$branch] skipped — worktree is on '$current'"
    continue
  fi

  # Skip if the working tree isn't clean. Don't touch the user's WIP.
  if [ -n "$(git -C "$path" status --porcelain)" ]; then
    log "[$branch] skipped — uncommitted changes"
    continue
  fi

  # Already up to date? Quiet — nothing to do.
  if git -C "$path" merge-base --is-ancestor origin/main HEAD 2>/dev/null; then
    continue
  fi

  # Attempt the merge with a fixed message; abort on any failure.
  if git -C "$path" merge --no-edit -m "chore: sync with main" origin/main >>"$LOG" 2>&1; then
    log "[$branch] synced with main"
  else
    git -C "$path" merge --abort 2>/dev/null
    log "[$branch] CONFLICT — manual merge needed"
  fi
done
