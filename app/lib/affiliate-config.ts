export const AFFILIATE_CONFIG = {
  v0: {
    baseUrl: 'https://v0.dev/chat',
    affiliateParam: 'via',
    affiliateId: 'PLACEHOLDER', // Set when a real ID is available
  },
  lovable: {
    baseUrl: 'https://lovable.dev/',
    affiliateParam: null as string | null, // Set when a param is available
    affiliateId: 'PLACEHOLDER', // Set when a real ID is available
  },
} as const
