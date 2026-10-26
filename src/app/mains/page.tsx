import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllMainsAnswers } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import type { MainsAnswer, GsPaper } from '@/types'
import { generatePageMetadata } from '@/lib/seo'
import { PenLine } from 'lucide-react'

export const metadata: Metadata = generatePageMetadata({
  title: 'Mains Answer Writing',
  description: 'UPSC Mains answer writing practice. Browse GS Paper I, II, III, IV answers with structured content, word counts, and subject tags.',
  path: '/mains',
})

const PAPERS: { value: GsPaper | 'All'; label: string }[] = [
  { value: 'All', label: 'All Papers' },
  { value: 'GS1', label: 'GS Paper I' },
  { value: 'GS2', label: 'GS Paper II' },
  { value: 'GS3', label: 'GS Paper III' },
  { value: 'GS4', label: 'GS Paper IV' },
  { value: 'Essay', label: 'Essay' },
  { value: 'Optional', label: 'Optional' },
]

function AnswerCard({ answer }: { answer: MainsAnswer }) {
  return (
    <Link
      href={`/mains/answers/${answer.slug}`}
      className="card p-5 md:p-6 flex flex-col gap-3 group hover:border-blue-200 transition-all"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-navy">{answer.paper}</span>
        {answer.year && <span className="badge badge-gray">UPSC {answer.year}</span>}
        <span className="ml-auto text-xs text-slate-400">{formatDate(answer.date)}</span>
      </div>
      <h2 className="font-semibold text-slate-800 leading-snug text-[0.9375rem] group-hover:text-navy-900 line-clamp-3">
        {answer.title}
      </h2>
      <div className="flex flex-wrap gap-2 mt-1">
        {answer.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto pt-2 border-t border-slate-100">
        <span>{answer.subject}</span>
        <span>·</span>
        <span>{answer.marks} marks</span>
        {answer.wordCount > 0 && (
          <>
            <span>·</span>
            <span>{answer.wordCount} words</span>
          </>
        )}
        {answer.readingTime > 0 && (
          <>
            <span>·</span>
            <span>{answer.readingTime} min read</span>
          </>
        )}
      </div>
    </Link>
  )
}

export default function MainsPage() {
  const answers = getAllMainsAnswers()

  // Group by paper
  const byPaper: Record<string, MainsAnswer[]> = {}
  for (const ans of answers) {
    if (!byPaper[ans.paper]) byPaper[ans.paper] = []
    byPaper[ans.paper].push(ans)
  }

  // Subject list
  const subjects = [...new Set(answers.map((a) => a.subject))].sort()

  return (
    <div>
      {/* Page header */}
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Mains', href: '/mains' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f0f4ff' }}>
              <PenLine size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Mains Answer Writing
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Practice answers for UPSC Mains GS papers. Each answer includes the question, structured response, word count, and relevant tags.
              </p>
            </div>
          </div>

          {/* Practice notice */}
          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
            <span>
              <strong>Practice Answer — Independent Aspirant Submission.</strong> These are personal practice answers, not evaluated or endorsed by UPSC or any official examiner.
            </span>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        {answers.length === 0 ? (
          <EmptyMainsState />
        ) : (
          <>
            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-8 text-sm text-slate-600">
              <span><strong className="text-slate-800">{answers.length}</strong> answers published</span>
              <span><strong className="text-slate-800">{Object.keys(byPaper).length}</strong> papers covered</span>
              <span><strong className="text-slate-800">{subjects.length}</strong> subjects</span>
            </div>

            {/* Paper filter links */}
            <div className="flex flex-wrap gap-2 mb-8">
              {PAPERS.filter((p) => p.value === 'All' || byPaper[p.value]?.length > 0).map((paper) => (
                <a
                  key={paper.value}
                  href={paper.value === 'All' ? '#all' : `#${paper.value.toLowerCase()}`}
                  className="tag text-xs font-medium px-3 py-1.5"
                >
                  {paper.label}
                  {paper.value !== 'All' && byPaper[paper.value] && (
                    <span className="ml-1 text-slate-400">({byPaper[paper.value].length})</span>
                  )}
                </a>
              ))}
            </div>

            {/* All answers */}
            <div id="all" className="space-y-10">
              {Object.entries(byPaper).map(([paper, paperAnswers]) => (
                <section key={paper} id={paper.toLowerCase()}>
                  <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <span className="badge badge-navy text-sm">{paper}</span>
                    <span className="text-slate-400 font-normal text-sm">({paperAnswers.length} answers)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paperAnswers.map((a) => <AnswerCard key={a.slug} answer={a} />)}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyMainsState() {
  return (
    <div className="py-16 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
        <PenLine size={28} className="text-blue-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-700">No answers published yet</h2>
      <p className="text-slate-500 max-w-md leading-relaxed">
        Mains practice answers will appear here. To publish your first answer, create an MDX file in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">content/mains-answers/</code>.
      </p>
      <Link href="/about" className="btn btn-outline mt-2">
        Publishing Guide
      </Link>
    </div>
  )
}
