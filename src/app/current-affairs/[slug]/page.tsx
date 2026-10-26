import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllCurrentAffairs, getCurrentAffairsBySlug } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer'
import { Newspaper, Calendar, Clock, Tag, ChevronLeft, CheckCircle2 } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllCurrentAffairs()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getCurrentAffairsBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} | UPSC Current Affairs`,
    description: `UPSC Current Affairs analysis: ${article.title}. Relevance: ${article.prelimsRelevance ? 'Prelims' : ''} ${article.mainsRelevance?.join(', ') || ''}.`,
    openGraph: {
      title: article.title,
      description: `UPSC Current Affairs analysis and facts for Prelims & Mains.`,
    },
  }
}

export default async function CurrentAffairsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = getCurrentAffairsBySlug(slug)
  if (!article) notFound()

  const all = getAllCurrentAffairs()
  const related = all.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="container-wide">
          <Breadcrumbs
            items={[
              { label: 'Current Affairs', href: '/current-affairs' },
              { label: article.subjects[0] || 'General' },
              { label: article.title },
            ]}
          />
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="max-w-[820px] mx-auto">
          <div className="mb-6">
            <Link
              href="/current-affairs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 mb-4 transition-colors"
            >
              <ChevronLeft size={14} /> Back to all Current Affairs
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {article.prelimsRelevance && <span className="badge badge-saffron text-xs">Prelims Relevant</span>}
              {article.mainsRelevance?.map((p) => (
                <span key={p} className="badge badge-navy text-xs">
                  {p}
                </span>
              ))}
              {article.subjects.map((s) => (
                <span key={s} className="badge badge-gray text-xs">
                  {s}
                </span>
              ))}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: 'var(--color-primary)' }}>
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 py-3 border-y border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {article.readingTime} min read ({article.wordCount} words)
              </span>
            </div>
          </div>

          {article.importantFacts && article.importantFacts.length > 0 && (
            <div className="mb-6 rounded-xl bg-amber-50/70 border border-amber-200 p-5">
              <h3 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-amber-600" /> Key Exam Facts (Prelims Pointer)
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
                {article.importantFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">▪</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8">
            <MarkdownRenderer content={article.content} />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-8">
              <Tag size={14} className="text-slate-400 mr-1" />
              {article.tags.map((t) => (
                <span key={t} className="tag text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}

          {article.source && article.source.length > 0 && (
            <div className="rounded-xl p-5 bg-slate-50 border border-slate-200 mb-8">
              <h3 className="font-semibold text-sm text-slate-800 mb-2">Sources & References</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {article.source.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    {s.startsWith('http') ? (
                      <a href={s} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {s}
                      </a>
                    ) : (
                      <span>{s}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Related Current Affairs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/current-affairs/${rel.slug}`}
                    className="card p-4 hover:border-slate-300 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="badge badge-saffron text-xs mb-2">Current Affairs</span>
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-navy-900 line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 mt-3">{formatDate(rel.date)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
