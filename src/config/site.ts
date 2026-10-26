/**
 * Central site configuration.
 * Update this file to change global branding, metadata, and links.
 */
export const siteConfig = {
  name: 'KarmaVidyaIAS',
  shortName: 'KarmaVidyaIAS',
  motto: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
  subMotto: 'LEARN • PRACTISE • PROGRESS',
  tagline: 'Your UPSC Preparation, All in One Place',
  description:
    'Free UPSC CSE learning platform with Mains answer writing, Prelims PYQs, mock tests, study materials, and current affairs. Maintained by an independent aspirant preparing for UPSC 2027.',
  url: 'https://karmavidyaias.vercel.app', // Update with your actual domain
  author: 'An Independent UPSC Aspirant',
  locale: 'en_IN',

  /** Navigation links (desktop header) */
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Mains', href: '/mains' },
    { label: 'Prelims', href: '/prelims' },
    { label: 'Mock Tests', href: '/mock-tests' },
    { label: 'Study Materials', href: '/study-materials' },
    { label: 'Current Affairs', href: '/current-affairs' },
    { label: 'Syllabus', href: '/syllabus' },
    { label: 'UPSC Guide', href: '/upsc-guide' },
  ],

  /** Secondary navigation (footer / more menu) */
  secondaryLinks: [
    { label: 'Essay', href: '/essay' },
    { label: 'CSAT', href: '/csat' },
    { label: 'Ethics & GS4', href: '/ethics' },
    { label: 'Bookmarks', href: '/bookmarks' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ],

  social: {
    github: '',
    twitter: '',
    telegram: '',
    youtube: '',
  },

  contact: {
    email: '', // Add your email when ready
  },

  /** Open Graph defaults */
  ogImage: '/og-default.png',

  /** Legal / footer */
  copyrightYear: 2026,
  disclaimer:
    'This is an independent learning initiative. It is not affiliated with or endorsed by UPSC or any government authority.',

  /** Feature flags */
  features: {
    search: true,
    bookmarks: true,
    mockTests: true,
    currentAffairs: true,
  },
} as const

export type SiteConfig = typeof siteConfig
