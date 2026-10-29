'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Flag, Check, AlertTriangle,
  Clock, BookOpen, Target, RotateCcw, Home, X, Grid,
  Trash2, BarChart2, Award, Filter, CheckCircle2, XCircle,
  HelpCircle, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculateScore, formatTime, formatDuration } from '@/lib/quiz'
import { addQuizHistory } from '@/lib/bookmarks'
import type { MockTest, MockTestQuestion, QuizQuestionState, QuizResult, QuizAnswer } from '@/types'

// ─── Cutoff Data for UPSC Prelims GS-1 ────────────────────────────────────────
const UPSC_2022_CUTOFFS = [
  { category: 'General (UR)', cutoff: 88.22 },
  { category: 'OBC', cutoff: 87.54 },
  { category: 'EWS', cutoff: 82.83 },
  { category: 'SC', cutoff: 74.08 },
  { category: 'ST', cutoff: 69.35 },
  { category: 'PwBD-1', cutoff: 49.84 },
]

const UPSC_2026_CUTOFFS = [
  { category: 'General (UR)', cutoff: 88.00 },
  { category: 'OBC', cutoff: 86.50 },
  { category: 'EWS', cutoff: 82.00 },
  { category: 'SC', cutoff: 73.50 },
  { category: 'ST', cutoff: 68.50 },
  { category: 'PwBD-1', cutoff: 48.00 },
]

function getCutoffInfo(slug: string, totalMarks: number) {
  if (slug.includes('2026')) {
    return {
      title: 'Estimated UPSC 2026 Prelims Cutoff Benchmark',
      description: 'Based on paper difficulty analysis, the estimated qualifying score for General (UR) is projected around 88.00 marks (safe zone: 92+).',
      generalCutoff: 88.00,
      cutoffs: UPSC_2026_CUTOFFS,
    }
  }
  if (slug.includes('2022')) {
    return {
      title: 'Official UPSC 2022 Prelims Cutoff Benchmark',
      description: 'The official UPSC CSE 2022 General Studies Paper-I qualifying cutoff was 88.22 marks for General (UR).',
      generalCutoff: 88.22,
      cutoffs: UPSC_2022_CUTOFFS,
    }
  }
  return {
    title: 'Qualifying Benchmark (45% Threshold)',
    description: `Standard qualifying benchmark for this test is 45% (${(totalMarks * 0.45).toFixed(1)} marks).`,
    generalCutoff: totalMarks * 0.45,
    cutoffs: [
      { category: 'Target Score (50%)', cutoff: totalMarks * 0.5 },
      { category: 'Benchmark (45%)', cutoff: totalMarks * 0.45 },
      { category: 'Minimum (40%)', cutoff: totalMarks * 0.4 },
    ],
  }
}

// ─── Quiz State Types ────────────────────────────────────────────────────────
interface QuizState {
  phase: 'instructions' | 'active' | 'results'
  currentIndex: number
  answers: Record<string, QuizQuestionState>
  startedAt: number
  endedAt: number | null
  result: QuizResult | null
}

function initAnswers(questions: MockTestQuestion[]): Record<string, QuizQuestionState> {
  const answers: Record<string, QuizQuestionState> = {}
  for (const q of questions) {
    answers[q.id] = { questionId: q.id, selectedAnswer: null, isMarkedForReview: false, timeSpentSeconds: 0 }
  }
  return answers
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function InstructionsView({ test, onStart, hasSavedProgress, onResume }: {
  test: MockTest
  onStart: () => void
  hasSavedProgress: boolean
  onResume: () => void
}) {
  const marksPerQ = (test.totalMarks / test.questions.length).toFixed(2)
  const negMark = test.negativeMarking ? (test.negativeMarkingValue ?? 0.66) : 0

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="card p-6 md:p-8 bg-white shadow-sm border border-slate-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-green-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge badge-saffron">{test.subject}</span>
              {test.paper && <span className="badge badge-gray">{test.paper}</span>}
              {test.difficulty && (
                <span className={`badge ${test.difficulty === 'Easy' ? 'badge-green' : test.difficulty === 'Hard' ? 'badge-red' : 'badge-gray'}`}>
                  {test.difficulty}
                </span>
              )}
            </div>
            <h1 className="font-bold text-2xl md:text-3xl text-slate-800 leading-tight">
              {test.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{test.description}</p>
          </div>
        </div>

        {hasSavedProgress && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-blue-900 text-sm">Saved Session Detected</div>
              <div className="text-xs text-blue-700">You have an in-progress attempt for this mock test saved locally.</div>
            </div>
            <button
              onClick={onResume}
              className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 border-transparent flex-shrink-0"
            >
              Resume Saved Attempt
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {[
            ['Questions', test.questions.length],
            ['Duration', formatDuration(test.durationMinutes)],
            ['Total Marks', `${test.totalMarks} Marks`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center">
              <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-3">
          <h2 className="font-bold text-slate-800 text-base">Official Examination Instructions</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>Each question carries <strong>+{marksPerQ} marks</strong> for a correct answer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>
                {test.negativeMarking
                  ? `Penalty for wrong answers: -${negMark} marks (1/3rd negative marking) will be deducted for each incorrect answer.`
                  : 'There is no negative marking in this test.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>Unattempted questions receive 0 marks with no penalty.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>Use the <strong>Question Palette</strong> to jump directly to any question or review marked questions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>You can clear your selected option at any time using the <strong>Clear Response</strong> button.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>The test will automatically submit when the countdown reaches 00:00.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs md:text-sm text-amber-900 mb-6">
          <strong>Practice Mode:</strong> This test simulates real UPSC exam conditions with automated scoring, cutoff analysis, and full solutions.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onStart} className="btn btn-primary btn-lg flex-1 flex items-center justify-center gap-2">
            <Target size={18} />
            {hasSavedProgress ? 'Start Fresh Test' : 'Start Mock Test'}
          </button>
          <Link
            href={`/mock-tests/${test.slug}/instructions`}
            className="btn btn-outline flex items-center justify-center gap-2"
          >
            Detailed Instructions
          </Link>
        </div>
      </div>
    </div>
  )
}

function TimerDisplay({ endAt }: { endAt: number }) {
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, Math.round((endAt - Date.now()) / 1000))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, Math.round((endAt - Date.now()) / 1000)))
    }, 500)
    return () => clearInterval(interval)
  }, [endAt])

  const isLow = remaining < 300 // last 5 minutes
  const isWarning = remaining < 900 // last 15 minutes
  const formatted = formatTime(remaining)

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm tracking-wide transition-colors',
      isLow
        ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
        : isWarning
        ? 'bg-amber-100 text-amber-800 border border-amber-300'
        : 'bg-slate-100 text-slate-800 border border-slate-200'
    )}>
      <Clock size={16} className={isLow ? 'text-red-600' : 'text-slate-600'} />
      <span>{formatted}</span>
    </div>
  )
}

function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  markedCount,
  unattemptedCount,
  endAt
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  totalQuestions: number
  answeredCount: number
  markedCount: number
  unattemptedCount: number
  endAt: number
}) {
  if (!isOpen) return null

  const remainingSeconds = Math.max(0, Math.round((endAt - Date.now()) / 1000))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card w-full max-w-md p-6 bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <AlertTriangle size={20} className="text-amber-600" />
            Submit Mock Test?
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to finish and submit your exam? Here is a summary of your test progress:
        </p>

        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center mb-4">
          <div>
            <div className="text-xl font-bold text-green-700">{answeredCount}</div>
            <div className="text-xs text-slate-500">Answered</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-700">{markedCount}</div>
            <div className="text-xs text-slate-500">Marked</div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-500">{unattemptedCount}</div>
            <div className="text-xs text-slate-500">Left Blank</div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between px-1 mb-6">
          <span>Time Remaining:</span>
          <span className="font-mono font-bold text-slate-700">{formatTime(remainingSeconds)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost border border-slate-200 flex-1 py-2.5"
          >
            Continue Test
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 hover:bg-red-700 text-white border-transparent flex-1 py-2.5 font-bold"
          >
            Yes, Submit Exam
          </button>
        </div>
      </div>
    </div>
  )
}

function QuestionPaletteContent({
  questions,
  answers,
  currentIndex,
  onJump,
  activeFilter,
  setActiveFilter,
}: {
  questions: MockTestQuestion[]
  answers: Record<string, QuizQuestionState>
  currentIndex: number
  onJump: (idx: number) => void
  activeFilter: 'all' | 'answered' | 'marked' | 'unattempted'
  setActiveFilter: (f: 'all' | 'answered' | 'marked' | 'unattempted') => void
}) {
  const stats = useMemo(() => {
    let answered = 0
    let marked = 0
    let unattempted = 0
    for (const q of questions) {
      const a = answers[q.id]
      if (a?.selectedAnswer !== null) answered++
      if (a?.isMarkedForReview) marked++
      if (a?.selectedAnswer === null) unattempted++
    }
    return { answered, marked, unattempted, total: questions.length }
  }, [questions, answers])

  return (
    <div className="flex flex-col h-full">
      {/* Header & Stats */}
      <div className="p-3 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <Grid size={15} />
            Question Palette
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {stats.answered}/{stats.total}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn('py-1 px-1.5 rounded text-center transition-all', activeFilter === 'all' ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700')}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('answered')}
            className={cn('py-1 px-1.5 rounded text-center transition-all', activeFilter === 'answered' ? 'bg-white text-green-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700')}
          >
            Ans ({stats.answered})
          </button>
          <button
            onClick={() => setActiveFilter('marked')}
            className={cn('py-1 px-1.5 rounded text-center transition-all', activeFilter === 'marked' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700')}
          >
            Mark ({stats.marked})
          </button>
          <button
            onClick={() => setActiveFilter('unattempted')}
            className={cn('py-1 px-1.5 rounded text-center transition-all', activeFilter === 'unattempted' ? 'bg-white text-slate-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700')}
          >
            Left ({stats.unattempted})
          </button>
        </div>
      </div>

      {/* Grid of buttons */}
      <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-1.5">
          {questions.map((q, idx) => {
            const ans = answers[q.id]
            const isAttempted = ans?.selectedAnswer !== null
            const isReview = ans?.isMarkedForReview
            const isCurrent = idx === currentIndex

            // Filter visibility
            if (activeFilter === 'answered' && !isAttempted) return null
            if (activeFilter === 'marked' && !isReview) return null
            if (activeFilter === 'unattempted' && isAttempted) return null

            let badgeStyle = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            if (isAttempted && isReview) {
              badgeStyle = 'bg-purple-700 text-white border-purple-800 font-bold'
            } else if (isReview) {
              badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
            } else if (isAttempted) {
              badgeStyle = 'bg-slate-900 text-white border-transparent font-bold'
            }

            return (
              <button
                key={q.id}
                onClick={() => onJump(idx)}
                className={cn(
                  'h-8 rounded text-xs transition-all border flex items-center justify-center font-medium',
                  badgeStyle,
                  isCurrent && 'ring-2 ring-blue-600 ring-offset-1 font-bold scale-105 shadow-sm'
                )}
                aria-label={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="p-3 border-t border-slate-200 bg-white text-xs space-y-1.5 text-slate-600 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-slate-900 flex-shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 flex-shrink-0" />
          <span>Marked for review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-purple-700 flex-shrink-0" />
          <span>Answered & Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-white border border-slate-200 flex-shrink-0" />
          <span>Not attempted</span>
        </div>
      </div>
    </div>
  )
}

function QuestionView({
  question,
  state,
  questionNumber,
  totalQuestions,
  onSelect,
  onClearResponse,
  onToggleReview,
  onNext,
  onPrev,
  onSubmitPrompt,
  endAt,
  onOpenPalette,
}: {
  question: MockTestQuestion
  state: QuizQuestionState
  questionNumber: number
  totalQuestions: number
  onSelect: (ans: QuizAnswer) => void
  onClearResponse: () => void
  onToggleReview: () => void
  onNext: () => void
  onPrev: () => void
  onSubmitPrompt: () => void
  endAt: number
  onOpenPalette: () => void
}) {
  const options: { key: QuizAnswer; label: string }[] = [
    { key: 'a', label: question.options.a },
    { key: 'b', label: question.options.b },
    { key: 'c', label: question.options.c },
    { key: 'd', label: question.options.d },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Test Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPalette}
            className="btn btn-sm btn-ghost border border-slate-200 lg:hidden flex items-center gap-1.5"
            aria-label="Open Question Palette"
          >
            <Grid size={15} />
            <span className="font-semibold">{questionNumber}/{totalQuestions}</span>
          </button>
          <span className="hidden lg:inline text-sm font-bold text-slate-700">
            Question {questionNumber} of {totalQuestions}
          </span>
          {state.isMarkedForReview && (
            <span className="badge badge-saffron flex items-center gap-1 text-xs">
              <Flag size={10} /> Marked
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <TimerDisplay endAt={endAt} />
          <button
            onClick={onSubmitPrompt}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-transparent font-semibold shadow-sm px-3 md:px-4"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Question Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Question Card */}
          <div className="card p-5 md:p-6 bg-white shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question {questionNumber}
              </span>
              <div className="flex items-center gap-2">
                {question.subject && <span className="tag text-xs">{question.subject}</span>}
                {question.topic && <span className="tag text-xs hidden sm:inline">{question.topic}</span>}
                <span className="text-xs font-semibold text-slate-500">2.0 Marks</span>
              </div>
            </div>

            <div className="text-base md:text-lg font-medium text-slate-800 leading-relaxed whitespace-pre-line mb-6">
              {question.questionText}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {options.map(({ key, label }) => {
                const isSelected = state.selectedAnswer === key
                return (
                  <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className={cn(
                      'w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all flex items-start gap-3.5',
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    )}
                    aria-pressed={isSelected}
                  >
                    <span className={cn(
                      'w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 uppercase transition-colors',
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 text-slate-500'
                    )}>
                      {key}
                    </span>
                    <span className={cn(
                      'text-sm md:text-base leading-relaxed',
                      isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700'
                    )}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex-shrink-0">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleReview}
              className={cn(
                'btn btn-sm flex items-center gap-1.5 transition-all',
                state.isMarkedForReview
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                  : 'btn-ghost border border-slate-200 text-slate-600'
              )}
            >
              <Flag size={14} className={state.isMarkedForReview ? 'fill-amber-600 text-amber-600' : ''} />
              <span>{state.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>

            {state.selectedAnswer !== null && (
              <button
                onClick={onClearResponse}
                className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1 text-xs"
              >
                <Trash2 size={13} />
                <span>Clear Response</span>
              </button>
            )}
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={questionNumber === 1}
              className="btn btn-sm btn-ghost border border-slate-200 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={onNext}
              disabled={questionNumber === totalQuestions}
              className="btn btn-sm btn-primary flex items-center gap-1"
            >
              <span className="hidden sm:inline">Save & Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultsEvaluationView({
  test,
  result,
  answers,
  onRetake,
}: {
  test: MockTest
  result: QuizResult
  answers: Record<string, QuizQuestionState>
  onRetake: () => void
}) {
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct' | 'unattempted' | 'marked'>('all')
  const [showReview, setShowReview] = useState(true)

  // Subject performance calculation
  const subjectBreakdown = useMemo(() => {
    const map: Record<string, { total: number; correct: number; incorrect: number; unattempted: number }> = {}
    for (const q of test.questions) {
      const subj = q.subject || 'General Studies'
      if (!map[subj]) map[subj] = { total: 0, correct: 0, incorrect: 0, unattempted: 0 }
      map[subj].total++
      const ans = answers[q.id]?.selectedAnswer
      if (ans === q.correctAnswer) map[subj].correct++
      else if (ans === null) map[subj].unattempted++
      else map[subj].incorrect++
    }
    return map
  }, [test.questions, answers])

  const cutoffInfo = useMemo(() => getCutoffInfo(test.slug, test.totalMarks), [test.slug, test.totalMarks])
  const clearedCutoff = result.finalScore >= cutoffInfo.generalCutoff

  const filteredQuestions = useMemo(() => {
    return test.questions.filter((q) => {
      const ans = answers[q.id]?.selectedAnswer
      const isMarked = answers[q.id]?.isMarkedForReview
      if (reviewFilter === 'incorrect') return ans !== null && ans !== q.correctAnswer
      if (reviewFilter === 'correct') return ans === q.correctAnswer
      if (reviewFilter === 'unattempted') return ans === null
      if (reviewFilter === 'marked') return isMarked
      return true
    })
  }, [test.questions, answers, reviewFilter])

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Header Card */}
      <div className="card p-6 md:p-8 bg-white shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
              clearedCutoff ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            )}>
              <Award size={26} />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Evaluation & Scorecard</div>
              <h1 className="text-2xl font-bold text-slate-800">{test.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onRetake} className="btn btn-sm btn-ghost border border-slate-200 flex items-center gap-1.5">
              <RotateCcw size={14} />
              Retake Test
            </button>
            <Link href="/mock-tests" className="btn btn-sm btn-ghost border border-slate-200 flex items-center gap-1.5">
              <Home size={14} />
              All Tests
            </Link>
          </div>
        </div>

        {/* Score & Cutoff Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="md:col-span-1 rounded-2xl p-6 text-center flex flex-col justify-center border" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Final Net Score</div>
            <div className="text-5xl font-black mb-1" style={{ color: 'var(--color-primary)' }}>
              {result.finalScore.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 font-medium">out of {result.totalMarks} Marks</div>
            <div className="mt-3 pt-3 border-t border-slate-200 text-sm font-semibold text-slate-700">
              Accuracy: {result.accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{cutoffInfo.title}</span>
                <span className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-bold',
                  clearedCutoff ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                )}>
                  {clearedCutoff ? 'Cutoff Qualified' : 'Below Cutoff'}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                {cutoffInfo.description}
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
              {cutoffInfo.cutoffs.slice(0, 5).map((c) => {
                const passed = result.finalScore >= c.cutoff
                return (
                  <div key={c.category} className={cn(
                    'p-2 rounded-lg border',
                    passed ? 'bg-green-50/70 border-green-200 text-green-900' : 'bg-white border-slate-200 text-slate-700'
                  )}>
                    <div className="font-bold">{typeof c.cutoff === 'number' ? c.cutoff.toFixed(1) : c.cutoff}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{c.category}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
            <div className="text-2xl font-bold text-green-700">{result.correct}</div>
            <div className="text-xs text-green-800 font-medium mt-0.5">Correct (+{(result.correct * 2).toFixed(2)})</div>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-center">
            <div className="text-2xl font-bold text-red-600">{result.incorrect}</div>
            <div className="text-xs text-red-800 font-medium mt-0.5">Incorrect (-{result.negativeMarks.toFixed(2)})</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-slate-600">{result.unattempted}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Unattempted</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-slate-800">{formatTime(result.timeTakenSeconds)}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Time Taken</div>
          </div>
        </div>

        {/* Subject-wise Performance Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-slate-500" />
            Subject-wise Performance Breakdown
          </h2>

          <div className="space-y-3">
            {Object.entries(subjectBreakdown).map(([subject, stats]) => {
              const accuracy = stats.total > 0 && (stats.correct + stats.incorrect) > 0
                ? (stats.correct / (stats.correct + stats.incorrect)) * 100
                : 0
              return (
                <div key={subject} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-800">{subject}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {stats.correct} / {stats.total} correct · {accuracy.toFixed(0)}% acc
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-green-600 h-full transition-all"
                      style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                    />
                    <div
                      className="bg-red-500 h-full transition-all"
                      style={{ width: `${(stats.incorrect / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="font-bold text-lg text-slate-800">Question Solutions & Explanations</h2>
            <p className="text-xs text-slate-500">Showing {filteredQuestions.length} of {test.questions.length} questions</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(['all', 'incorrect', 'correct', 'unattempted', 'marked'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setReviewFilter(mode)}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all capitalize',
                  reviewFilter === mode
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {filteredQuestions.map((q) => {
          const originalIndex = test.questions.findIndex((item) => item.id === q.id)
          const ans = answers[q.id]
          const selected = ans?.selectedAnswer ?? null
          const correct = q.correctAnswer
          const isCorrect = selected === correct
          const isSkipped = selected === null

          return (
            <div
              key={q.id}
              className={cn(
                'card p-5 md:p-6 transition-all border',
                isSkipped
                  ? 'border-slate-200 bg-white'
                  : isCorrect
                  ? 'border-green-200 bg-green-50/20'
                  : 'border-red-200 bg-red-50/20'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1',
                    isSkipped
                      ? 'bg-slate-100 text-slate-600'
                      : isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {isSkipped && <HelpCircle size={12} />}
                    {isCorrect && <CheckCircle2 size={12} />}
                    {!isSkipped && !isCorrect && <XCircle size={12} />}
                    Q{originalIndex + 1} · {isSkipped ? 'Unattempted' : isCorrect ? 'Correct (+2.0)' : 'Incorrect (-0.66)'}
                  </span>
                  {ans?.isMarkedForReview && (
                    <span className="badge badge-saffron text-[10px] py-0.5">Marked for Review</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {q.subject && <span className="text-xs text-slate-500 font-medium">{q.subject}</span>}
                </div>
              </div>

              <p className="text-base font-semibold text-slate-800 leading-relaxed mb-4 whitespace-pre-line">
                {q.questionText}
              </p>

              {/* Options Breakdown */}
              <div className="space-y-2 mb-4">
                {(['a', 'b', 'c', 'd'] as const).map((key) => {
                  const isOptionCorrect = key === correct
                  const isUserSelection = key === selected

                  let rowStyle = 'border-slate-200 bg-white text-slate-700'
                  if (isOptionCorrect) {
                    rowStyle = 'border-green-400 bg-green-50 text-green-950 font-semibold'
                  } else if (isUserSelection && !isOptionCorrect) {
                    rowStyle = 'border-red-400 bg-red-50 text-red-900 line-through'
                  }

                  return (
                    <div
                      key={key}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border text-sm',
                        rowStyle
                      )}
                    >
                      <span className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs uppercase flex-shrink-0',
                        isOptionCorrect
                          ? 'bg-green-600 text-white'
                          : isUserSelection
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      )}>
                        {key}
                      </span>
                      <span className="flex-1 leading-relaxed">{q.options[key]}</span>
                      {isOptionCorrect && (
                        <span className="text-xs text-green-700 font-bold ml-2">✓ Correct Answer</span>
                      )}
                      {isUserSelection && !isOptionCorrect && (
                        <span className="text-xs text-red-600 font-bold ml-2">✗ Your Choice</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Comprehensive Explanation */}
              {q.explanation && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">
                  <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-blue-600" />
                    UPSC Answer & Solution:
                  </div>
                  <div className="whitespace-pre-line">{q.explanation}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Engine Component ───────────────────────────────────────────────────

interface Props {
  test: MockTest
}

export function MockTestEngine({ test }: Props) {
  const [state, setState] = useState<QuizState>({
    phase: 'instructions',
    currentIndex: 0,
    answers: initAnswers(test.questions),
    startedAt: 0,
    endedAt: null,
    result: null,
  })

  const [hasSavedProgress, setHasSavedProgress] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'answered' | 'marked' | 'unattempted'>('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const endAtRef = useRef<number>(0)

  const storageKey = `mock_session_${test.slug}`

  // Check for saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.answers && parsed.endAt > Date.now()) {
          setHasSavedProgress(true)
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey])

  // Save session periodically during active exam
  useEffect(() => {
    if (state.phase !== 'active') return
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          currentIndex: state.currentIndex,
          answers: state.answers,
          startedAt: state.startedAt,
          endAt: endAtRef.current,
        })
      )
    } catch {
      // ignore storage errors
    }
  }, [state, storageKey])

  const handleStart = useCallback(() => {
    const now = Date.now()
    const endAt = now + test.durationMinutes * 60 * 1000
    endAtRef.current = endAt
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
    setState({
      phase: 'active',
      currentIndex: 0,
      startedAt: now,
      endedAt: null,
      result: null,
      answers: initAnswers(test.questions),
    })
  }, [test, storageKey])

  const handleResume = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        endAtRef.current = parsed.endAt
        setState({
          phase: 'active',
          currentIndex: parsed.currentIndex || 0,
          startedAt: parsed.startedAt,
          endedAt: null,
          result: null,
          answers: parsed.answers,
        })
      }
    } catch {
      handleStart()
    }
  }, [storageKey, handleStart])

  const executeSubmission = useCallback(() => {
    setShowSubmitModal(false)
    const endedAt = Date.now()
    const result = calculateScore({
      questions: test.questions,
      answers: state.answers,
      totalMarks: test.totalMarks,
      negativeMarking: test.negativeMarking,
      negativeMarkingValue: test.negativeMarkingValue ?? 0.66,
      startedAt: state.startedAt,
      endedAt,
    })

    addQuizHistory({
      testSlug: test.slug,
      testTitle: test.title,
      completedAt: endedAt,
      score: result.finalScore,
      totalMarks: result.totalMarks,
      accuracy: result.accuracy,
      timeTakenSeconds: result.timeTakenSeconds,
    })

    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }

    setState((s) => ({ ...s, phase: 'results', endedAt, result }))
  }, [state.answers, state.startedAt, test, storageKey])

  // Timer auto-submit on expiry
  useEffect(() => {
    if (state.phase !== 'active') return
    const timer = setInterval(() => {
      if (Date.now() >= endAtRef.current) {
        clearInterval(timer)
        executeSubmission()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [state.phase, executeSubmission])

  const selectAnswer = (ans: QuizAnswer) => {
    const q = test.questions[state.currentIndex]
    setState((s) => ({
      ...s,
      answers: {
        ...s.answers,
        [q.id]: { ...s.answers[q.id], selectedAnswer: ans },
      },
    }))
  }

  const clearAnswer = () => {
    const q = test.questions[state.currentIndex]
    setState((s) => ({
      ...s,
      answers: {
        ...s.answers,
        [q.id]: { ...s.answers[q.id], selectedAnswer: null },
      },
    }))
  }

  const toggleReview = () => {
    const q = test.questions[state.currentIndex]
    setState((s) => ({
      ...s,
      answers: {
        ...s.answers,
        [q.id]: { ...s.answers[q.id], isMarkedForReview: !s.answers[q.id].isMarkedForReview },
      },
    }))
  }

  const jumpToQuestion = (idx: number) => {
    setState((s) => ({ ...s, currentIndex: idx }))
    setShowPalette(false) // Auto close palette on mobile after jump
  }

  if (state.phase === 'instructions') {
    return (
      <InstructionsView
        test={test}
        onStart={handleStart}
        hasSavedProgress={hasSavedProgress}
        onResume={handleResume}
      />
    )
  }

  if (state.phase === 'results' && state.result) {
    return (
      <ResultsEvaluationView
        test={test}
        result={state.result}
        answers={state.answers}
        onRetake={() => setState({
          phase: 'instructions',
          currentIndex: 0,
          answers: initAnswers(test.questions),
          startedAt: 0,
          endedAt: null,
          result: null,
        })}
      />
    )
  }

  const currentQuestion = test.questions[state.currentIndex]

  // Counts for confirmation dialog
  let answeredCount = 0
  let markedCount = 0
  let unattemptedCount = 0
  for (const q of test.questions) {
    const a = state.answers[q.id]
    if (a?.selectedAnswer !== null) answeredCount++
    if (a?.isMarkedForReview) markedCount++
    if (a?.selectedAnswer === null) unattemptedCount++
  }

  return (
    <div className="flex h-[calc(100vh-64px)] relative overflow-hidden bg-slate-50">
      {/* Question Content View */}
      <div className="flex-1 flex flex-col min-h-0">
        <QuestionView
          question={currentQuestion}
          state={state.answers[currentQuestion.id]}
          questionNumber={state.currentIndex + 1}
          totalQuestions={test.questions.length}
          onSelect={selectAnswer}
          onClearResponse={clearAnswer}
          onToggleReview={toggleReview}
          onNext={() => setState((s) => ({ ...s, currentIndex: Math.min(s.currentIndex + 1, test.questions.length - 1) }))}
          onPrev={() => setState((s) => ({ ...s, currentIndex: Math.max(s.currentIndex - 1, 0) }))}
          onSubmitPrompt={() => setShowSubmitModal(true)}
          endAt={endAtRef.current}
          onOpenPalette={() => setShowPalette(true)}
        />
      </div>

      {/* Desktop Question Palette Sidebar */}
      <div className="w-64 xl:w-72 flex-shrink-0 hidden lg:block border-l border-slate-200 bg-white">
        <QuestionPaletteContent
          questions={test.questions}
          answers={state.answers}
          currentIndex={state.currentIndex}
          onJump={jumpToQuestion}
          activeFilter={paletteFilter}
          setActiveFilter={setPaletteFilter}
        />
      </div>

      {/* Mobile / Tablet Drawer Question Palette */}
      {showPalette && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-80 max-w-[85vw] h-full bg-white shadow-2xl ml-auto flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Navigation Palette</span>
              <button
                onClick={() => setShowPalette(false)}
                className="p-1 rounded text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <QuestionPaletteContent
                questions={test.questions}
                answers={state.answers}
                currentIndex={state.currentIndex}
                onJump={jumpToQuestion}
                activeFilter={paletteFilter}
                setActiveFilter={setPaletteFilter}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={executeSubmission}
        totalQuestions={test.questions.length}
        answeredCount={answeredCount}
        markedCount={markedCount}
        unattemptedCount={unattemptedCount}
        endAt={endAtRef.current}
      />
    </div>
  )
}
