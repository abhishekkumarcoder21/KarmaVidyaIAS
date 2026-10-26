import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'

interface PageSeoProps {
  title?: string
  description?: string
  path?: string
  ogImage?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path = '/',
  ogImage,
  noIndex = false,
}: PageSeoProps): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`
  const desc = description ?? siteConfig.description
  const url = `${siteConfig.url}${path}`
  const image = ogImage ?? siteConfig.ogImage

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}
