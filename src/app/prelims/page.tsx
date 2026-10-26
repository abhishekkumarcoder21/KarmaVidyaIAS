import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Prelims PYQs',
  description: 'UPSC Prelims previous year questions with detailed explanations, organised by subject and topic.',
}

import { getAllPrelimsQuestions, getPrelimsQuestionsBySubject } from '@/lib/content'

const SUBJECTS_CONFIG = [
  { label: 'Indian Polity', slug: 'polity' },
  { label: 'History', slug: 'history' },
  { label: 'Economy', slug: 'economy' },
  { label: 'Environment & Ecology', slug: 'environment' },
  { label: 'Geography', slug: 'geography' },
  { label: 'Science & Technology', slug: 'science-technology' },
  { label: 'Art & Culture', slug: 'art-culture' },
  { label: 'Current Affairs', slug: 'current-affairs' },
]

export default function PrelimsPage() {
  const allQuestions = getAllPrelimsQuestions()

  const subjects = SUBJECTS_CONFIG.map((s) => {
    const qCount = getPrelimsQuestionsBySubject(s.slug).length
    return {
      ...s,
      count: qCount,
    }
  })

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Prelims', href: '/prelims' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-50">
              <HelpCircle size={22} className="text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Prelims PYQs
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Previous-year Prelims questions with explanations, organised by subject and year. Select any subject to begin interactive practice.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-slate-800">Browse by Subject</h2>
            <span className="text-xs font-semibold text-slate-500">{allQuestions.length} Total Questions Available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects.map((s) => (
              <Link
                key={s.slug}
                href={`/prelims/${s.slug}`}
                className="card p-4 flex flex-col gap-1.5 group hover:border-amber-200"
              >
                <span className="font-semibold text-sm text-slate-800 group-hover:text-amber-700 transition-colors">
                  {s.label}
                </span>
                <span className="text-xs text-slate-400">
                  {s.count === 0 ? 'Coming soon' : `${s.count} questions`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
