import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { getAllEssays } from '@/lib/content'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Essay Preparation',
  description: 'UPSC Essay preparation — practice essays, topic lists, outlines, and writing guides.',
}

export default function EssayPage() {
  const essays = getAllEssays()
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Essay' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-50">
              <FileText size={22} className="text-orange-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Essay Preparation
              </h1>
              <p className="text-slate-500 text-sm max-w-xl">
                Essay topics, outlines, practice essays, and writing guidance for the UPSC Mains Essay paper.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-wide py-10">
        {essays.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <FileText size={22} className="text-orange-300" />
            </div>
            <h3 className="font-semibold text-slate-700">Essay Content Coming Soon</h3>
            <p className="text-sm text-slate-400 max-w-md">Essay topics, outlines, and practice essays will be added to <code className="bg-slate-100 px-1 py-0.5 rounded">content/essays/</code>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {essays.map((e) => (
              <Link key={e.slug} href={`/essay/${e.slug}`} className="card p-5 group flex flex-col gap-3">
                <span className="badge badge-gray capitalize">{e.type.replace('-', ' ')}</span>
                <h2 className="font-semibold text-slate-800 group-hover:text-navy-900 text-sm line-clamp-2">{e.title}</h2>
                <div className="text-xs text-slate-400">{formatDate(e.date)} · {e.readingTime} min read</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
