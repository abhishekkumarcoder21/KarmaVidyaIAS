import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PrelimsQuestionCard } from '@/components/content/PrelimsQuestionCard'
import { getPrelimsQuestionsBySubject, getAllPrelimsQuestions } from '@/lib/content'
import { ChevronLeft, HelpCircle } from 'lucide-react'

const SUBJECT_MAP: Record<string, string> = {
  history: 'History',
  polity: 'Indian Polity',
  geography: 'Geography',
  economy: 'Economy',
  environment: 'Environment & Ecology',
  'science-technology': 'Science & Technology',
  'art-culture': 'Art & Culture',
  'current-affairs': 'Current Affairs',
}

interface Props {
  params: Promise<{ subject: string }>
}

export async function generateStaticParams() {
  return Object.keys(SUBJECT_MAP).map((subject) => ({ subject }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params
  const subjectName = SUBJECT_MAP[subject] || subject
  return {
    title: `${subjectName} Prelims PYQs`,
    description: `UPSC Prelims previous year questions for ${subjectName} with detailed explanations and option breakdown.`,
  }
}

export default async function SubjectPrelimsPage({ params }: Props) {
  const { subject } = await params
  const subjectName = SUBJECT_MAP[subject] || subject
  const questions = getPrelimsQuestionsBySubject(subject)

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs
            items={[
              { label: 'Prelims', href: '/prelims' },
              { label: subjectName },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-50">
              <HelpCircle size={22} className="text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                {subjectName} — Prelims PYQs
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Practice UPSC Civil Services Prelims questions for {subjectName}. Select an option to check your answer and view official explanation keys.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="mb-6">
          <Link
            href="/prelims"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
          >
            <ChevronLeft size={14} /> Back to all Subjects
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <HelpCircle size={22} />
            </div>
            <h3 className="font-semibold text-slate-700">Questions Being Curated</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Verified {subjectName} PYQs with proven key references are being added. Check back shortly or explore another subject!
            </p>
            <Link href="/prelims" className="btn btn-sm btn-outline mt-2">
              Explore other Subjects
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {questions.map((q, idx) => (
              <PrelimsQuestionCard key={q.id} question={q} questionNumber={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
