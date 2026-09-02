// ─── Capability manifest ─────────────────────────────────────────────────────
// The itemised list of what lands in your setup when you install: every part,
// what it does, and whether the behaviour is enforced by the code or is
// direction the model follows. Same table on every product page, so two
// products can be compared line by line.

export type Capability = {
  kind: string
  name: string
  what: string
  enforced: 'code' | 'guidance'
  mono?: boolean
}

export function CapabilityTable({ rows }: { rows: Capability[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-sand-300 dark:border-sand-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
            <th scope="col" className="px-4 py-3 font-semibold text-sand-600 dark:text-sand-400">
              Part
            </th>
            <th scope="col" className="px-4 py-3 font-bold text-sand-900 dark:text-sand-50">
              What it does
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold text-sand-600 dark:text-sand-400">
              Enforced
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-300 bg-sand-50 dark:divide-sand-800 dark:bg-sand-950/40">
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row" className="px-4 py-4 text-left align-top">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-sand-500 dark:text-sand-500">
                  {row.kind}
                </span>
                <span
                  className={`mt-1 block font-semibold text-sand-900 dark:text-sand-50 ${
                    row.mono ? 'font-mono text-[13px]' : ''
                  }`}
                >
                  {row.name}
                </span>
              </th>
              <td className="px-4 py-4 align-top text-sand-700 dark:text-sand-300">
                {row.what}
              </td>
              <td className="px-4 py-4 align-top text-right">
                <span
                  className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    row.enforced === 'code'
                      ? 'bg-olive-500/15 text-olive-600 dark:text-olive-400'
                      : 'bg-sand-300/60 text-sand-700 dark:bg-sand-800 dark:text-sand-300'
                  }`}
                >
                  {row.enforced === 'code' ? 'In code' : 'Guidance'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
