import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCurrentAffairs } from '@/lib/content'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDate } from '@/lib/utils'
import { Newspaper } from 'lucide-react'
import type { CurrentAffairs } from '@/types'

export const metadata: Metadata = {
  title: 'Current Affairs',
  description: 'Daily and monthly UPSC current affairs with Prelims and Mains relevance.',
}

function ArticleCard({ article }: { article: CurrentAffairs }) {
  return (
    <Link href={`/current-affairs/${article.slug}`} className="card p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {article.prelimsRelevance && <span className="badge badge-saffron text-xs">Prelims</span>}
          {article.mainsRelevance?.map((p) => (
            <span key={p} className="badge badge-navy text-xs">{p}</span>
          ))}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(article.date)}</span>
      </div>
      <h2 className="font-semibold text-slate-800 group-hover:text-navy-900 text-sm leading-snug line-clamp-2">
        {article.title}
      </h2>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag text-xs">{tag}</span>
        ))}
      </div>
      <div className="text-xs text-slate-400">{article.readingTime} min read</div>
    </Link>
  )
}

export default function CurrentAffairsPage() {
  const articles = getAllCurrentAffairs()

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Current Affairs' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-rose-50">
              <Newspaper size={22} className="text-rose-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Current Affairs
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Daily and monthly current affairs with Prelims and Mains relevance. Content is updated by the platform maintainer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          <span>
            Always verify current affairs from original news sources and official notifications. Content here is for study reference only.
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
              <Newspaper size={22} className="text-rose-400" />
            </div>
            <h3 className="font-semibold text-slate-700">Current Affairs Coming Soon</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Current affairs articles will be published here. Add MDX files to <code className="bg-slate-100 px-1 py-0.5 rounded">content/current-affairs/</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        )}
      </div>
    </div>
  )
}
