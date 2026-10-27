import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  BookOpen, Clock, Target, AlertTriangle, CheckCircle,
  HelpCircle, Flag, ArrowLeft, PlayCircle
} from 'lucide-react'
import { getMockTestBySlug, getAllMockTests } from '@/lib/content'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDuration } from '@/lib/quiz'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllMockTests().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const test = getMockTestBySlug(slug)
  if (!test) return {}
  return {
    title: `Instructions: ${test.title}`,
    description: `Examination guidelines, marking scheme, and instructions for ${test.title}.`,
  }
}

export default async function InstructionsPage({ params }: Props) {
  const { slug } = await params
  const test = getMockTestBySlug(slug)
  if (!test) notFound()

  const marksPerQuestion = (test.totalMarks / test.questions.length).toFixed(2)
  const negativeMark = test.negativeMarking ? (test.negativeMarkingValue ?? 0.66) : 0

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container-wide max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'Mock Tests', href: '/mock-tests' },
            { label: test.title, href: `/mock-tests/${test.slug}` },
            { label: 'Instructions', href: `/mock-tests/${test.slug}/instructions` },
          ]}
        />

        <div className="card mt-6 p-6 md:p-8 bg-white shadow-sm border border-slate-200">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-saffron">{test.subject}</span>
                {test.paper && <span className="badge badge-gray">{test.paper}</span>}
                {test.difficulty && (
                  <span className={`badge ${test.difficulty === 'Easy' ? 'badge-green' : test.difficulty === 'Hard' ? 'badge-red' : 'badge-gray'}`}>
                    {test.difficulty}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                {test.title}
              </h1>
              <p className="text-slate-500 text-sm mt-1">{test.description}</p>
            </div>

            <Link
              href={`/mock-tests/${test.slug}`}
              className="btn btn-primary flex items-center justify-center gap-2 flex-shrink-0 self-start md:self-auto px-6 py-3"
            >
              <PlayCircle size={18} />
              Start Test Now
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {test.questions.length}
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Questions</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {formatDuration(test.durationMinutes)}
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Duration</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {test.totalMarks}
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Total Marks</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-2xl font-bold text-red-600">
                {test.negativeMarking ? `-${negativeMark}` : 'Nil'}
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Negative Marking</div>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-slate-500" />
                Examination Pattern & Structure
              </h2>
              <div className="rounded-xl bg-slate-50 p-4 space-y-2.5 text-sm leading-relaxed border border-slate-100">
                <p>• <strong>Total Questions:</strong> The test comprises {test.questions.length} multiple-choice questions (MCQs).</p>
                <p>• <strong>Marking Scheme:</strong> Each correct response awards <strong>+{marksPerQuestion} marks</strong>.</p>
                <p>• <strong>Penalty for Wrong Answers:</strong> {test.negativeMarking ? (
                  <>There is a negative penalty of <strong>{negativeMark} marks (1/3rd)</strong> for each incorrect response. Be cautious of blind guessing.</>
                ) : (
                  <>No marks are deducted for incorrect answers in this test.</>
                )}</p>
                <p>• <strong>Unattempted Questions:</strong> Questions left blank receive <strong>0 marks</strong> with no penalty.</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <HelpCircle size={18} className="text-slate-500" />
                Question Palette Status Guide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="w-8 h-8 rounded bg-white border border-slate-300 text-slate-400 font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Not Attempted</div>
                    <div className="text-xs text-slate-500">Question has not been answered yet</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="w-8 h-8 rounded bg-navy-900 text-white font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary)' }}>
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Answered</div>
                    <div className="text-xs text-slate-500">Response selected and saved</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="w-8 h-8 rounded bg-amber-100 border border-amber-300 text-amber-800 font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Marked for Review</div>
                    <div className="text-xs text-slate-500">Marked to revisit before final submission</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="w-8 h-8 rounded bg-purple-700 text-white font-bold flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Answered & Marked</div>
                    <div className="text-xs text-slate-500">Answered but marked for double-check</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock size={18} className="text-slate-500" />
                Timer & Submission Guidelines
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 leading-relaxed">
                <li>The countdown timer starts as soon as you click "Start Test".</li>
                <li>The test will automatically submit when the allotted time runs out.</li>
                <li>You can clear your selected choice on any question at any time by clicking "Clear Response".</li>
                <li>Clicking "Submit Test" triggers a confirmation dialog summarizing your attempted, marked, and unattempted question count.</li>
                <li>Detailed solutions, explanations, and UPSC cutoff benchmark evaluation will be displayed immediately upon submission.</li>
              </ul>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Local Examination Environment:</strong> This mock test runs client-side in your web browser. Your progress and history are safely saved in local storage. Do not clear your browsing data while a test is in progress.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/mock-tests"
              className="btn btn-ghost border border-slate-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowLeft size={16} />
              Back to All Tests
            </Link>

            <Link
              href={`/mock-tests/${test.slug}`}
              className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 text-base"
            >
              <Target size={18} />
              I Have Read the Instructions — Begin Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
