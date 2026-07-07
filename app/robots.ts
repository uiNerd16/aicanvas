import type { MetadataRoute } from 'next'
import { SITE_URL } from './lib/config'

// /ideation and /ideation/* are the internal dev playground (it renders
// duplicate previews of shipped pages); keep them out of every index.
const DISALLOW = ['/ideation', '/ideation/']

// AI/LLM crawlers, allowed explicitly. Being recommended by assistants is a
// distribution channel for an open component registry, so the site opts IN to
// AI training and retrieval crawlers rather than relying on the implicit `*`.
const AI_CRAWLERS = [
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic — current agents plus the legacy tokens (harmless if unused).
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'Claude-Web',
  'anthropic-ai',
  // Others
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
