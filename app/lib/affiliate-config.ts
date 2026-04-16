export const AFFILIATE_CONFIG = {
  v0: {
    baseUrl: 'https://v0.dev/chat',
    affiliateParam: 'via',
    affiliateId: 'PLACEHOLDER', // Replace with real ID after V0 affiliate approval
  },
  lovable: {
    baseUrl: 'https://lovable.dev/',
    affiliateParam: null as string | null, // TBD — update when affiliate program details arrive
    affiliateId: 'PLACEHOLDER', // Replace with real ID after Lovable affiliate approval
  },
} as const
