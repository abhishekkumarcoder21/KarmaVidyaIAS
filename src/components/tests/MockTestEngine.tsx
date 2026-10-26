'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, Flag, Check, AlertTriangle,
  Clock, BookOpen, Target, RotateCcw, Home
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { calculateScore, formatTime, formatDuration } from '@/lib/quiz'
import { addQuizHistory } from '@/lib/bookmarks'
import type { MockTest, MockTestQuestion, QuizQuestionState, QuizResult, QuizAnswer } from '@/types'

// ─── Quiz Engine ──────────────────────────────────────────────────────────────

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

function InstructionsView({ test, onStart }: { test: MockTest; onStart: () => void }) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <BookOpen size={22} className="text-green-700" />
          </div>
          <div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>{test.title}</h1>
            <p className="text-sm text-slate-500">{test.subject}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ['Questions', test.questions.length],
            ['Duration', formatDuration(test.durationMinutes)],
            ['Total Marks', test.totalMarks],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-4 text-center">
              <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">Instructions</h2>
          <ul className="space-y-2">
            {(test.instructions && test.instructions.length > 0 ? test.instructions : [
              'Each question has four options. Select the best answer.',
              `Each correct answer carries ${test.totalMarks / test.questions.length} mark(s).`,
              test.negativeMarking
                ? `Incorrect answers carry a negative marking of ${test.negativeMarkingValue ?? 0.33} marks.`
                : 'There is no negative marking in this test.',
              'You can mark questions for review and return to them.',
              'Click "Submit Test" when done, or the test will auto-submit when time expires.',
              'Results are stored locally in your browser.',
            ]).map((inst, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                {inst}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 mb-6">
          This is a practice test. It is not monitored or proctored. Results are for self-assessment only.
        </div>

        <button onClick={onStart} className="btn btn-primary btn-lg w-full">
          <Target size={18} />
          Start Test
        </button>
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
  const formatted = formatTime(remaining)

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-semibold text-sm',
      isLow ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
    )}>
      <Clock size={15} />
      {formatted}
    </div>
  )
}

function QuestionView({
  question,
  state,
  questionNumber,
  totalQuestions,
  onSelect,
  onToggleReview,
  onNext,
  onPrev,
  onSubmit,
  endAt,
  revealed,
  onReveal,
}: {
  question: MockTestQuestion
  state: QuizQuestionState
  questionNumber: number
  totalQuestions: number
  onSelect: (ans: QuizAnswer) => void
  onToggleReview: () => void
  onNext: () => void
  onPrev: () => void
  onSubmit: () => void
  endAt: number
  revealed: boolean
  onReveal: () => void
}) {
  const options: { key: QuizAnswer; label: string }[] = [
    { key: 'a', label: question.options.a },
    { key: 'b', label: question.options.b },
    { key: 'c', label: question.options.c },
    { key: 'd', label: question.options.d },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <span className="text-sm font-medium text-slate-600">
          Q {questionNumber} / {totalQuestions}
        </span>
        <TimerDisplay endAt={endAt} />
        <button
          onClick={onSubmit}
          className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-transparent"
        >
          Submit Test
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="question-block mb-6">
          <div className="question-label">Question {questionNumber}</div>
          <p className="question-text">{question.questionText}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                'mcq-option w-full text-left',
                state.selectedAnswer === key && 'selected'
              )}
              aria-pressed={state.selectedAnswer === key}
            >
              <span className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 uppercase',
                state.selectedAnswer === key
                  ? 'border-navy-700 bg-navy-700 text-white'
                  : 'border-slate-300 text-slate-400'
              )} style={state.selectedAnswer === key ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary)' } : {}}>
                {key}
              </span>
              <span className="text-sm text-slate-700">{label}</span>
            </button>
          ))}
        </div>

        {/* Tags */}
        {(question.subject || question.topic) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {question.subject && <span className="tag">{question.subject}</span>}
            {question.topic && <span className="tag">{question.topic}</span>}
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
        <button
          onClick={onToggleReview}
          className={cn('btn btn-sm', state.isMarkedForReview ? 'btn-accent' : 'btn-ghost border border-slate-200')}
        >
          <Flag size={13} />
          {state.isMarkedForReview ? 'Marked' : 'Mark for Review'}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onPrev} disabled={questionNumber === 1} className="btn btn-sm btn-ghost border border-slate-200">
            <ChevronLeft size={16} />
          </button>
          <button onClick={onNext} disabled={questionNumber === totalQuestions} className="btn btn-sm btn-primary">
            <ChevronRight size={16} />
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function PalettePanel({
  questions,
  answers,
  currentIndex,
  onJump,
}: {
  questions: MockTestQuestion[]
  answers: Record<string, QuizQuestionState>
  currentIndex: number
  onJump: (idx: number) => void
}) {
  return (
    <div className="p-4 border-l border-slate-200 bg-slate-50 overflow-y-auto">
      <h3 className="font-semibold text-sm text-slate-700 mb-3">Question Palette</h3>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, idx) => {
          const ans = answers[q.id]
          const isAttempted = ans?.selectedAnswer !== null
          const isReview = ans?.isMarkedForReview
          const isCurrent = idx === currentIndex

          return (
            <button
              key={q.id}
              onClick={() => onJump(idx)}
              className={cn(
                'w-8 h-8 rounded text-xs font-semibold transition-all border',
                isCurrent && 'ring-2 ring-navy-900 ring-offset-1',
                isReview ? 'bg-amber-100 text-amber-800 border-amber-300' :
                isAttempted ? 'bg-navy-900 text-white border-transparent' :
                'bg-white text-slate-500 border-slate-200'
              )}
              aria-label={`Question ${idx + 1}${isAttempted ? ', answered' : ', not answered'}${isReview ? ', marked for review' : ''}`}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>
      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded" style={{ background: 'var(--color-primary)' }} />Answered</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />Marked for review</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-white border border-slate-200" />Not attempted</div>
      </div>
    </div>
  )
}

function ResultsView({ test, result, answers, onRetake }: {
  test: MockTest
  result: QuizResult
  answers: Record<string, QuizQuestionState>
  onRetake: () => void
}) {
  const [showReview, setShowReview] = useState(false)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="card p-6 md:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={22} className="text-green-700" />
          </div>
          <div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>Test Completed</h1>
            <p className="text-sm text-slate-500">{test.title}</p>
          </div>
        </div>

        {/* Score highlight */}
        <div className="rounded-xl p-6 mb-6 text-center" style={{ background: '#f0f4ff' }}>
          <div className="text-5xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
            {result.finalScore.toFixed(2)}
          </div>
          <div className="text-slate-500 text-sm">out of {result.totalMarks} marks</div>
          <div className="text-2xl font-semibold mt-2 text-slate-700">
            {result.accuracy.toFixed(1)}% accuracy
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Correct', value: result.correct, color: 'text-green-700' },
            { label: 'Incorrect', value: result.incorrect, color: 'text-red-600' },
            { label: 'Unattempted', value: result.unattempted, color: 'text-slate-400' },
            { label: 'Time Taken', value: formatTime(result.timeTakenSeconds), color: 'text-slate-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {result.negativeMarks > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={14} />
            Negative marks deducted: {result.negativeMarks.toFixed(2)} marks
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowReview(!showReview)} className="btn btn-outline">
            {showReview ? 'Hide' : 'Review'} Answers
          </button>
          <button onClick={onRetake} className="btn btn-ghost border border-slate-200">
            <RotateCcw size={14} />
            Retake Test
          </button>
          <a href="/mock-tests" className="btn btn-ghost border border-slate-200">
            <Home size={14} />
            All Tests
          </a>
        </div>
      </div>

      {/* Review answers */}
      {showReview && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-slate-800">Answer Review</h2>
          {test.questions.map((q, idx) => {
            const ans = answers[q.id]
            const selected = ans?.selectedAnswer ?? null
            const correct = q.correctAnswer
            const isCorrect = selected === correct
            const isSkipped = selected === null

            return (
              <div key={q.id} className={cn(
                'card p-5',
                isSkipped ? 'border-slate-200' :
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              )}>
                <div className="flex items-start gap-2 mb-3">
                  <span className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded',
                    isSkipped ? 'bg-slate-100 text-slate-500' :
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  )}>
                    Q{idx + 1} {isSkipped ? 'Skipped' : isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 mb-3">{q.questionText}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {(['a', 'b', 'c', 'd'] as const).map((key) => (
                    <div key={key} className={cn(
                      'flex items-start gap-2 p-2 rounded text-sm',
                      key === correct ? 'bg-green-100 text-green-800 font-medium' :
                      key === selected && !isCorrect ? 'bg-red-100 text-red-700 line-through' :
                      'text-slate-600'
                    )}>
                      <span className="font-bold uppercase">{key})</span>
                      {q.options[key]}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="text-sm text-slate-700 bg-white/70 rounded p-3 border border-slate-200">
                    <span className="font-semibold text-slate-600">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

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

  const [showPalette, setShowPalette] = useState(false)
  const endAtRef = useRef<number>(0)

  const handleStart = useCallback(() => {
    const now = Date.now()
    const endAt = now + test.durationMinutes * 60 * 1000
    endAtRef.current = endAt
    setState((s) => ({ ...s, phase: 'active', startedAt: now, answers: initAnswers(test.questions) }))
  }, [test])

  const handleSubmit = useCallback(() => {
    if (state.phase !== 'active') return
    const endedAt = Date.now()
    const result = calculateScore({
      questions: test.questions,
      answers: state.answers,
      totalMarks: test.totalMarks,
      negativeMarking: test.negativeMarking,
      negativeMarkingValue: test.negativeMarkingValue ?? 0.33,
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

    setState((s) => ({ ...s, phase: 'results', endedAt, result }))
  }, [state, test])

  // Auto-submit on timer end
  useEffect(() => {
    if (state.phase !== 'active') return
    const check = setInterval(() => {
      if (Date.now() >= endAtRef.current) {
        handleSubmit()
        clearInterval(check)
      }
    }, 1000)
    return () => clearInterval(check)
  }, [state.phase, handleSubmit])

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

  if (state.phase === 'instructions') {
    return <InstructionsView test={test} onStart={handleStart} />
  }

  if (state.phase === 'results' && state.result) {
    return (
      <ResultsView
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

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-0">
        <QuestionView
          question={currentQuestion}
          state={state.answers[currentQuestion.id]}
          questionNumber={state.currentIndex + 1}
          totalQuestions={test.questions.length}
          onSelect={selectAnswer}
          onToggleReview={toggleReview}
          onNext={() => setState((s) => ({ ...s, currentIndex: Math.min(s.currentIndex + 1, test.questions.length - 1) }))}
          onPrev={() => setState((s) => ({ ...s, currentIndex: Math.max(s.currentIndex - 1, 0) }))}
          onSubmit={handleSubmit}
          endAt={endAtRef.current}
          revealed={false}
          onReveal={() => {}}
        />
      </div>

      {/* Palette: hidden on mobile, shown on desktop or when toggled */}
      <div className={cn(
        'w-56 flex-shrink-0 hidden lg:block',
      )}>
        <PalettePanel
          questions={test.questions}
          answers={state.answers}
          currentIndex={state.currentIndex}
          onJump={(idx) => setState((s) => ({ ...s, currentIndex: idx }))}
        />
      </div>
    </div>
  )
}
