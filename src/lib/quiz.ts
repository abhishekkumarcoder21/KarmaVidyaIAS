/**
 * Quiz scoring utility.
 * Pure functions — easy to unit test.
 */
import type { MockTest, MockTestQuestion, QuizQuestionState, QuizResult } from '@/types'

export interface ScoreInput {
  questions: MockTestQuestion[]
  answers: Record<string, QuizQuestionState>
  totalMarks: number
  negativeMarking: boolean
  negativeMarkingValue: number // e.g. 0.33 or 1
  startedAt: number
  endedAt: number
}

export function calculateScore(input: ScoreInput): QuizResult {
  const { questions, answers, totalMarks, negativeMarking, negativeMarkingValue, startedAt, endedAt } = input

  let correct = 0
  let incorrect = 0
  let unattempted = 0
  const marksPerQuestion = totalMarks / questions.length

  for (const q of questions) {
    const ans = answers[q.id]
    if (!ans || ans.selectedAnswer === null) {
      unattempted++
    } else if (ans.selectedAnswer === q.correctAnswer) {
      correct++
    } else {
      incorrect++
    }
  }

  const rawScore = correct * marksPerQuestion
  const negativeMarks = negativeMarking ? incorrect * negativeMarkingValue : 0
  const finalScore = Math.max(0, rawScore - negativeMarks)
  const attempted = correct + incorrect
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0
  const timeTakenSeconds = Math.round((endedAt - startedAt) / 1000)

  return {
    totalQuestions: questions.length,
    attempted,
    correct,
    incorrect,
    unattempted,
    rawScore,
    totalMarks,
    negativeMarks,
    finalScore,
    accuracy,
    timeTakenSeconds,
  }
}

/** Validate that test questions sum to a sensible total marks */
export function validateTestMarks(test: MockTest): boolean {
  const marksPerQuestion = test.totalMarks / test.questions.length
  return marksPerQuestion > 0 && Number.isFinite(marksPerQuestion)
}

/** Format seconds as MM:SS */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Format duration in minutes as a human readable string */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}
