import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllStudyMaterials, getStudyMaterialBySlug } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer'
import { BookOpen, Calendar, Clock, Tag, ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const materials = getAllStudyMaterials()
  return materials.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const material = getStudyMaterialBySlug(slug)
  if (!material) return {}
  return {
    title: material.title,
    description: `${material.subject} · ${material.type} notes for UPSC CSE preparation. ${material.topic}`,
    openGraph: {
      title: material.title,
      description: `${material.subject} study notes for UPSC Civil Services Examination.`,
    },
  }
}

export default async function StudyMaterialDetailPage({ params }: Props) {
  const { slug } = await params
  const material = getStudyMaterialBySlug(slug)
  if (!material) notFound()

  const all = getAllStudyMaterials()
  const related = all
    .filter((m) => m.slug !== material.slug && m.subject === material.subject)
    .slice(0, 3)

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="container-wide">
          <Breadcrumbs
            items={[
              { label: 'Study Materials', href: '/study-materials' },
              { label: material.subject },
              { label: material.title },
            ]}
          />
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="max-w-[820px] mx-auto">
          <div className="mb-6">
            <Link
              href="/study-materials"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 mb-4 transition-colors"
            >
              <ChevronLeft size={14} /> Back to all Study Materials
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-navy text-xs uppercase">{material.type}</span>
              <span className="badge badge-saffron text-xs">{material.subject}</span>
              {material.paper && <span className="badge badge-gray text-xs">{material.paper}</span>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: 'var(--color-primary)' }}>
              {material.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 py-3 border-y border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {formatDate(material.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {material.readingTime} min read ({material.wordCount} words)
              </span>
              {material.lastVerified && (
                <span className="text-emerald-600 font-medium">✓ Verified {material.lastVerified}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8">
            <MarkdownRenderer content={material.content} />
          </div>

          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-8">
              <Tag size={14} className="text-slate-400 mr-1" />
              {material.tags.map((t) => (
                <span key={t} className="tag text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}

          {material.references && material.references.length > 0 && (
            <div className="rounded-xl p-5 bg-slate-50 border border-slate-200 mb-8">
              <h3 className="font-semibold text-sm text-slate-800 mb-2">Sources & References</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {material.references.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    {r.startsWith('http') ? (
                      <a href={r} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {r}
                      </a>
                    ) : (
                      <span>{r}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Related Study Materials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/study-materials/${rel.slug}`}
                    className="card p-4 hover:border-slate-300 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="badge badge-gray text-xs mb-2 capitalize">{rel.type}</span>
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
