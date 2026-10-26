import { calculateScore, formatTime, formatDuration } from '@/lib/quiz'
import type { MockTestQuestion, QuizQuestionState } from '@/types'

describe('Quiz & Scoring Logic (lib/quiz)', () => {
  const mockQuestions: MockTestQuestion[] = [
    {
      id: 'q1',
      questionText: 'Question 1',
      options: { a: 'A', b: 'B', c: 'C', d: 'D' },
      correctAnswer: 'a',
      explanation: 'Explanation 1',
    },
    {
      id: 'q2',
      questionText: 'Question 2',
      options: { a: 'A', b: 'B', c: 'C', d: 'D' },
      correctAnswer: 'b',
      explanation: 'Explanation 2',
    },
    {
      id: 'q3',
      questionText: 'Question 3',
      options: { a: 'A', b: 'B', c: 'C', d: 'D' },
      correctAnswer: 'c',
      explanation: 'Explanation 3',
    },
    {
      id: 'q4',
      questionText: 'Question 4',
      options: { a: 'A', b: 'B', c: 'C', d: 'D' },
      correctAnswer: 'd',
      explanation: 'Explanation 4',
    },
  ]

  it('should calculate 100% score for all correct answers without negative marks', () => {
    const answers: Record<string, QuizQuestionState> = {
      q1: { questionId: 'q1', selectedAnswer: 'a', isMarkedForReview: false, timeSpentSeconds: 10 },
      q2: { questionId: 'q2', selectedAnswer: 'b', isMarkedForReview: false, timeSpentSeconds: 10 },
      q3: { questionId: 'q3', selectedAnswer: 'c', isMarkedForReview: false, timeSpentSeconds: 10 },
      q4: { questionId: 'q4', selectedAnswer: 'd', isMarkedForReview: false, timeSpentSeconds: 10 },
    }

    const result = calculateScore({
      questions: mockQuestions,
      answers,
      totalMarks: 8, // 2 marks each
      negativeMarking: true,
      negativeMarkingValue: 0.66,
      startedAt: 1000,
      endedAt: 61000, // 60 seconds
    })

    expect(result.correct).toBe(4)
    expect(result.incorrect).toBe(0)
    expect(result.unattempted).toBe(0)
    expect(result.accuracy).toBe(100)
    expect(result.rawScore).toBe(8)
    expect(result.negativeMarks).toBe(0)
    expect(result.finalScore).toBe(8)
    expect(result.timeTakenSeconds).toBe(60)
  })

  it('should accurately deduct UPSC negative marks (0.66 per wrong answer)', () => {
    const answers: Record<string, QuizQuestionState> = {
      q1: { questionId: 'q1', selectedAnswer: 'a', isMarkedForReview: false, timeSpentSeconds: 10 }, // correct (+2)
      q2: { questionId: 'q2', selectedAnswer: 'c', isMarkedForReview: false, timeSpentSeconds: 10 }, // incorrect (-0.66)
      q3: { questionId: 'q3', selectedAnswer: null, isMarkedForReview: false, timeSpentSeconds: 0 }, // unattempted (0)
      q4: { questionId: 'q4', selectedAnswer: null, isMarkedForReview: false, timeSpentSeconds: 0 }, // unattempted (0)
    }

    const result = calculateScore({
      questions: mockQuestions,
      answers,
      totalMarks: 8,
      negativeMarking: true,
      negativeMarkingValue: 0.66,
      startedAt: 0,
      endedAt: 30000,
    })

    expect(result.attempted).toBe(2)
    expect(result.correct).toBe(1)
    expect(result.incorrect).toBe(1)
    expect(result.unattempted).toBe(2)
    expect(result.accuracy).toBe(50)
    expect(result.rawScore).toBe(2)
    expect(result.negativeMarks).toBeCloseTo(0.66, 2)
    expect(result.finalScore).toBeCloseTo(1.34, 2)
  })

  it('should not allow negative final scores (caps at 0)', () => {
    const answers: Record<string, QuizQuestionState> = {
      q1: { questionId: 'q1', selectedAnswer: 'b', isMarkedForReview: false, timeSpentSeconds: 5 }, // wrong
      q2: { questionId: 'q2', selectedAnswer: 'a', isMarkedForReview: false, timeSpentSeconds: 5 }, // wrong
    }

    const result = calculateScore({
      questions: mockQuestions,
      answers,
      totalMarks: 8,
      negativeMarking: true,
      negativeMarkingValue: 0.66,
      startedAt: 0,
      endedAt: 10000,
    })

    expect(result.correct).toBe(0)
    expect(result.incorrect).toBe(2)
    expect(result.finalScore).toBe(0) // Math.max(0, rawScore - negativeMarks)
  })

  it('should format seconds into MM:SS correctly', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(900)).toBe('15:00')
  })

  it('should format duration minutes into human readable text', () => {
    expect(formatDuration(15)).toBe('15 min')
    expect(formatDuration(60)).toBe('1h')
    expect(formatDuration(120)).toBe('2h')
    expect(formatDuration(90)).toBe('1h 30min')
  })
})
