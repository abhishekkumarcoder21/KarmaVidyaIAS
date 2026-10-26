import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardList, Clock, Target, AlertCircle } from 'lucide-react'
import { getAllMockTests } from '@/lib/content'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDuration } from '@/lib/quiz'
import type { MockTest } from '@/types'

export const metadata: Metadata = {
  title: 'Mock Tests',
  description: 'UPSC practice tests with timed mode, negative marking, and detailed answer explanations.',
}

function TestCard({ test }: { test: MockTest }) {
  return (
    <div className="card p-5 md:p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-saffron">{test.subject}</span>
        {test.difficulty && (
          <span className={`badge ${test.difficulty === 'Easy' ? 'badge-green' : test.difficulty === 'Hard' ? 'badge-red' : 'badge-gray'}`}>
            {test.difficulty}
          </span>
        )}
        {test.negativeMarking && (
          <span className="badge badge-red flex items-center gap-1">
            <AlertCircle size={10} />
            Negative Marking
          </span>
        )}
      </div>

      <div>
        <h2 className="font-bold text-slate-800 text-lg mb-2 leading-snug">{test.title}</h2>
        <p className="text-sm text-slate-500 leading-relaxed">{test.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-1">
        <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50">
          <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{test.questions.length}</span>
          <span className="text-xs text-slate-400 mt-0.5">Questions</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50">
          <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{formatDuration(test.durationMinutes)}</span>
          <span className="text-xs text-slate-400 mt-0.5">Duration</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50">
          <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{test.totalMarks}</span>
          <span className="text-xs text-slate-400 mt-0.5">Marks</span>
        </div>
      </div>

      {test.instructions && test.instructions.length > 0 && (
        <ul className="text-xs text-slate-500 space-y-1">
          {test.instructions.slice(0, 2).map((inst, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-slate-300 mt-0.5">•</span>
              {inst}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 mt-auto pt-2">
        <Link
          href={`/mock-tests/${test.slug}`}
          className="btn btn-primary flex-1"
        >
          <Target size={15} />
          Start Test
        </Link>
        <Link
          href={`/mock-tests/${test.slug}/instructions`}
          className="btn btn-outline"
        >
          <Clock size={15} />
          Instructions
        </Link>
      </div>
    </div>
  )
}

export default function MockTestsPage() {
  const tests = getAllMockTests()

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Mock Tests', href: '/mock-tests' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-50">
              <ClipboardList size={22} className="text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Practice Tests
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Timed mock tests with question navigation, review mode, and detailed answer explanations. Practice locally — no login required.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>
            Tests run entirely in your browser. Scores are saved locally and are not synchronized between devices. This is a practice tool, not a proctored examination system.
          </span>
        </div>

        {tests.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <ClipboardList size={22} className="text-green-400" />
            </div>
            <h3 className="font-semibold text-slate-700">Sample Tests Coming Soon</h3>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Practice tests will be added here. Tests are stored as JSON files in <code className="bg-slate-100 px-1.5 py-0.5 rounded">content/mock-tests/</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => <TestCard key={test.slug} test={test} />)}
          </div>
        )}
      </div>
    </div>
  )
}
