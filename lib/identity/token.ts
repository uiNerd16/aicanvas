const TOKEN_RE = /^aic_[0-9a-f]{48}$/

export function isWellFormedToken(value: string): boolean {
  return TOKEN_RE.test(value)
}

/** Pull a token from ?token= (CLI path) or an Authorization: Bearer header (MCP). */
export function extractToken(req: Request): string | null {
  const url = new URL(req.url)
  const q = url.searchParams.get('token')
  if (q && isWellFormedToken(q)) return q

  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    const t = auth.slice('Bearer '.length).trim()
    if (isWellFormedToken(t)) return t
  }
  return null
}
