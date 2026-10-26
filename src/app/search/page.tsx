import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchUI } from '@/components/search/SearchUI'
import { buildSearchIndex } from '@/lib/content'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for UPSC questions, study materials, current affairs, and more.',
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  const entries = buildSearchIndex()

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Search' }]} />
          <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary)' }}>
            Search
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Search across {entries.length} published items.
          </p>
        </div>
      </div>
      <div className="container-wide py-8 max-w-3xl">
        <Suspense fallback={<div className="skeleton h-12 w-full rounded-lg" />}>
          <SearchUI entries={entries} />
        </Suspense>
      </div>
    </div>
  )
}
