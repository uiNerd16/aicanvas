import { codeToHtml } from 'shiki'

interface Props {
  code: string
}

export async function HighlightedCode({ code }: Props) {
  const html = await codeToHtml(code, {
    lang: 'tsx',
    theme: 'github-dark',
  })

  return (
    <div
      className="font-mono text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-0 [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
