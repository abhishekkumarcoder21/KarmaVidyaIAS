import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllEssays, getEssayBySlug } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer'
import { FileText, Calendar, Clock, Tag, ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const essays = getAllEssays()
  return essays.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const essay = getEssayBySlug(slug)
  if (!essay) return {}
  return {
    title: `${essay.title} | UPSC Essay Preparation`,
    description: `UPSC Essay: ${essay.title}. Topic: ${essay.topic}. Type: ${essay.type}.`,
    openGraph: {
      title: essay.title,
      description: `UPSC Mains Essay outline, quotes, dimensions, and complete practice model essay.`,
    },
  }
}

export default async function EssayDetailPage({ params }: Props) {
  const { slug } = await params
  const essay = getEssayBySlug(slug)
  if (!essay) notFound()

  const all = getAllEssays()
  const related = all.filter((e) => e.slug !== essay.slug).slice(0, 3)

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="container-wide">
          <Breadcrumbs
            items={[
              { label: 'Essay', href: '/essay' },
              { label: essay.topic },
              { label: essay.title },
            ]}
          />
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="max-w-[820px] mx-auto">
          <div className="mb-6">
            <Link
              href="/essay"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 mb-4 transition-colors"
            >
              <ChevronLeft size={14} /> Back to all Essays
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-navy text-xs uppercase">{essay.type.replace('-', ' ')}</span>
              <span className="badge badge-saffron text-xs">{essay.topic}</span>
              {essay.year && <span className="badge badge-gray text-xs">UPSC {essay.year}</span>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: 'var(--color-primary)' }}>
              {essay.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 py-3 border-y border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {formatDate(essay.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {essay.readingTime} min read ({essay.calculatedWordCount} words)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8">
            <MarkdownRenderer content={essay.content} />
          </div>

          {essay.tags && essay.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-8">
              <Tag size={14} className="text-slate-400 mr-1" />
              {essay.tags.map((t) => (
                <span key={t} className="tag text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Related Essay Topics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/essay/${rel.slug}`}
                    className="card p-4 hover:border-slate-300 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="badge badge-gray text-xs mb-2 capitalize">{rel.type.replace('-', ' ')}</span>
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-navy-900 line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 mt-3">{rel.readingTime} min read</span>
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
