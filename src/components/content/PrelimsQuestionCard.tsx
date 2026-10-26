'use client'

import { useState } from 'react'
import { Check, X, HelpCircle, BookMarked, ChevronDown, ChevronUp } from 'lucide-react'
import { toggleBookmark, isBookmarked } from '@/lib/bookmarks'
import type { PrelimsQuestion } from '@/types'

interface Props {
  question: PrelimsQuestion
  questionNumber: number
}

export function PrelimsQuestionCard({ question, questionNumber }: Props) {
  const [selected, setSelected] = useState<'a' | 'b' | 'c' | 'd' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window === 'undefined') return false
    return isBookmarked(`prelims-${question.id}`)
  })

  const handleSelect = (key: 'a' | 'b' | 'c' | 'd') => {
    setSelected(key)
    setShowExplanation(true)
  }

  const handleBookmark = () => {
    const res = toggleBookmark({
      id: `prelims-${question.id}`,
      type: 'prelims-question',
      title: question.questionText.slice(0, 100) + '...',
      href: `/prelims/${question.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      subject: question.subject,
      addedAt: Date.now(),
    })
    setBookmarked(res)
  }

  const isAnswered = selected !== null
  const isCorrect = selected === question.correctAnswer

  return (
    <div className="card p-6 border border-slate-200 hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-navy text-xs font-semibold">Q{questionNumber}</span>
          {question.year && <span className="badge badge-saffron text-xs">UPSC {question.year}</span>}
          <span className="badge badge-gray text-xs">{question.topic}</span>
          {question.difficulty && <span className="badge badge-gray text-xs">{question.difficulty}</span>}
        </div>

        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
            bookmarked
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title={bookmarked ? 'Bookmarked' : 'Bookmark question'}
          aria-label="Bookmark question"
        >
          <BookMarked size={14} />
          <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      <p className="font-medium text-slate-800 text-base leading-relaxed mb-5 whitespace-pre-line">
        {question.questionText}
      </p>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {(['a', 'b', 'c', 'd'] as const).map((key) => {
          const optText = question.options[key]
          const isSelected = selected === key
          const isThisCorrect = key === question.correctAnswer

          let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 bg-white'

          if (isAnswered) {
            if (isThisCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-semibold ring-1 ring-emerald-500'
            } else if (isSelected && !isThisCorrect) {
              optionStyle = 'border-rose-400 bg-rose-50/60 text-rose-900 font-medium'
            } else {
              optionStyle = 'border-slate-200 text-slate-400 opacity-70 bg-white'
            }
          }

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={isAnswered}
              className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${optionStyle}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 mt-0.5 ${
                  isAnswered && isThisCorrect
                    ? 'bg-emerald-600 text-white'
                    : isAnswered && isSelected
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {key}
              </span>
              <span className="flex-1 text-sm leading-relaxed">{optText}</span>
              {isAnswered && isThisCorrect && <Check size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />}
              {isAnswered && isSelected && !isThisCorrect && (
                <X size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Show answer button & accordion */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            {showExplanation ? (
              <>
                <ChevronUp size={14} /> Hide Explanation
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Show Correct Answer & Explanation
              </>
            )}
          </button>

          {isAnswered && (
            <span
              className={`text-xs font-bold ${
                isCorrect ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isCorrect ? '✓ Correct Answer (+2.0)' : '✗ Incorrect Answer (-0.66)'}
            </span>
          )}
        </div>

        {showExplanation && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mt-1 text-sm text-slate-700 animate-fadeIn">
            <div className="font-bold text-navy-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs uppercase">
                {question.correctAnswer}
              </span>
              <span>Correct Answer: Option ({question.correctAnswer.toUpperCase()})</span>
            </div>
            <p className="leading-relaxed mb-3 text-slate-700 whitespace-pre-line">{question.explanation}</p>

            {question.optionExplanations && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 uppercase tracking-wide">Option Breakdown:</span>
                {(['a', 'b', 'c', 'd'] as const).map((key) => {
                  const expl = question.optionExplanations?.[key]
                  if (!expl) return null
                  return (
                    <div key={key} className="flex items-start gap-1.5">
                      <strong className="uppercase text-slate-800">({key}):</strong>
                      <span>{expl}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
