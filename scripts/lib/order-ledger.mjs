// Pure grid-ordering over the committed order ledger (component-order.json).
//
// The ledger is a COMMITTED oldest→newest list of every slug that has appeared
// in the catalog. The grid renders it reversed (newest first), so the newest
// push — free or premium — sits on top. It is committed and never recomputed
// from git at build time because production shallow-clones both the public repo
// and the vault (inject-premium: git clone --depth 1), so add-history isn't
// available in the build. The build only APPENDS slugs it has never seen, at the
// tail (= newest); the historical order was seeded once from full local history.

/**
 * @param {string[]} ledger        committed order, oldest→newest (may have stale/removed slugs)
 * @param {string[]} appendOrder   deterministic order to append never-seen present slugs in
 * @param {Set<string>} presentSet slugs currently listed (free + premium)
 * @returns {{ ledger: string[], gridSlugs: string[], grew: boolean }}
 *          ledger    = de-duped, with unseen present slugs appended (persist this)
 *          gridSlugs = present slugs in newest-first order (for the grid)
 *          grew      = whether any slug was appended (i.e. the ledger needs writing)
 */
export function reconcileLedger(ledger, appendOrder, presentSet) {
  // De-dupe defensively (first occurrence wins) so a hand-edited ledger can't
  // double-count a slug and throw off the downstream count assertion.
  const seen = new Set()
  const next = ledger.filter((s) => (seen.has(s) ? false : (seen.add(s), true)))

  let grew = false
  for (const slug of appendOrder) {
    if (presentSet.has(slug) && !seen.has(slug)) {
      next.push(slug)
      seen.add(slug)
      grew = true
    }
  }

  // Grid = present slugs in ledger (oldest→newest) minus anything no longer
  // listed (hidden/removed), reversed to newest-first.
  const gridSlugs = next.filter((s) => presentSet.has(s)).reverse()
  return { ledger: next, gridSlugs, grew }
}
