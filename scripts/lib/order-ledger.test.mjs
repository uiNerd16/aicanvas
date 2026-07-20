// Run: node scripts/lib/order-ledger.test.mjs
import assert from 'node:assert/strict'
import { reconcileLedger } from './order-ledger.mjs'

const set = (...s) => new Set(s)

// A newly-pushed slug not in the ledger appends at the tail and shows FIRST.
{
  const r = reconcileLedger(['old', 'mid'], ['old', 'mid', 'brandnew'], set('old', 'mid', 'brandnew'))
  assert.deepEqual(r.gridSlugs, ['brandnew', 'mid', 'old'], 'newest push is on top')
  assert.deepEqual(r.ledger, ['old', 'mid', 'brandnew'], 'new slug appended at tail')
  assert.equal(r.grew, true)
}

// A stable ledger (no new slugs) is left untouched; grid is just reversed.
{
  const r = reconcileLedger(['a', 'b', 'c'], ['a', 'b', 'c'], set('a', 'b', 'c'))
  assert.deepEqual(r.gridSlugs, ['c', 'b', 'a'])
  assert.equal(r.grew, false, 'no write needed when nothing new')
}

// Premium interleaves by ledger position, not forced to the top.
{
  const ledger = ['free-old', 'premium-mid', 'free-new'] // premium sits in the middle
  const r = reconcileLedger(ledger, ledger, set('free-old', 'premium-mid', 'free-new'))
  assert.deepEqual(r.gridSlugs, ['free-new', 'premium-mid', 'free-old'], 'premium not pinned above newer free')
}

// A slug no longer listed (hidden/removed) drops out of the grid but the ledger
// keeps its position (so it returns to the same slot if re-listed).
{
  const r = reconcileLedger(['a', 'gone', 'b'], ['a', 'b'], set('a', 'b'))
  assert.deepEqual(r.gridSlugs, ['b', 'a'], 'unlisted slug excluded from grid')
  assert.deepEqual(r.ledger, ['a', 'gone', 'b'], 'position preserved in ledger')
}

// A duplicated ledger entry is collapsed (first wins) so the count stays right.
{
  const r = reconcileLedger(['a', 'b', 'a'], ['a', 'b'], set('a', 'b'))
  assert.deepEqual(r.gridSlugs, ['b', 'a'])
  assert.equal(r.gridSlugs.length, 2, 'no double-count from a dup')
}

// Multiple new slugs append in the given deterministic order (last = newest).
{
  const r = reconcileLedger([], ['f1', 'f2', 'p1'], set('f1', 'f2', 'p1'))
  assert.deepEqual(r.gridSlugs, ['p1', 'f2', 'f1'], 'append order respected, reversed for grid')
  assert.deepEqual(r.ledger, ['f1', 'f2', 'p1'])
}

console.log('order-ledger: all assertions passed')
