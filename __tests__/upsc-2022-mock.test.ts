import { getAllMockTests, getMockTestBySlug } from '@/lib/content'
import { calculateScore } from '@/lib/quiz'
import type { QuizQuestionState } from '@/types'

describe('UPSC CSE Prelims 2022 GS Paper-1 Mock Test Verification', () => {
  const SLUG = 'upsc-prelims-2022-gs-paper-1'

  it('should be discovered by getAllMockTests() and have status published', () => {
    const allTests = getAllMockTests()
    const test = allTests.find((t) => t.slug === SLUG)
    expect(test).toBeDefined()
    expect(test?.status).toBe('published')
  })

  it('should be retrieved with full metadata by getMockTestBySlug()', () => {
    const test = getMockTestBySlug(SLUG)
    expect(test).not.toBeNull()
    expect(test?.title).toContain('2022')
    expect(test?.durationMinutes).toBe(120)
    expect(test?.totalMarks).toBe(200)
    expect(test?.negativeMarking).toBe(true)
    expect(test?.negativeMarkingValue).toBeCloseTo(0.66, 2)
  })

  it('should contain exactly 100 questions with valid structure and official answer keys', () => {
    const test = getMockTestBySlug(SLUG)
    expect(test?.questions.length).toBe(100)

    const ids = new Set<string>()

    test?.questions.forEach((q, idx) => {
      // Unique ID check
      expect(ids.has(q.id)).toBe(false)
      ids.add(q.id)

      // Question text
      expect(q.questionText.trim().length).toBeGreaterThan(10)

      // 4 options present and non-empty
      expect(q.options).toBeDefined()
      expect(q.options.a.trim().length).toBeGreaterThan(0)
      expect(q.options.b.trim().length).toBeGreaterThan(0)
      expect(q.options.c.trim().length).toBeGreaterThan(0)
      expect(q.options.d.trim().length).toBeGreaterThan(0)

      // Correct answer is a valid option key
      expect(['a', 'b', 'c', 'd']).toContain(q.correctAnswer)

      // Explanation is present and substantive
      expect(q.explanation.trim().length).toBeGreaterThan(20)

      // Subject and topic
      expect(q.subject).toBeDefined()
      expect(q.topic).toBeDefined()

      // Marks
      expect(q.marks).toBe(2)
    })
  })

  it('should accurately calculate score under UPSC 100-question marking scheme', () => {
    const test = getMockTestBySlug(SLUG)
    expect(test).not.toBeNull()
    if (!test) return

    // Simulate 60 correct, 30 incorrect, 10 unattempted
    const answers: Record<string, QuizQuestionState> = {}

    test.questions.forEach((q, idx) => {
      if (idx < 60) {
        // Correct answer (+2 marks)
        answers[q.id] = {
          questionId: q.id,
          selectedAnswer: q.correctAnswer,
          isMarkedForReview: false,
          timeSpentSeconds: 60,
        }
      } else if (idx < 90) {
        // Wrong answer (-0.66 marks)
        const wrongAns = q.correctAnswer === 'a' ? 'b' : 'a'
        answers[q.id] = {
          questionId: q.id,
          selectedAnswer: wrongAns,
          isMarkedForReview: true,
          timeSpentSeconds: 45,
        }
      } else {
        // Unattempted (0 marks)
        answers[q.id] = {
          questionId: q.id,
          selectedAnswer: null,
          isMarkedForReview: false,
          timeSpentSeconds: 10,
        }
      }
    })

    const result = calculateScore({
      questions: test.questions,
      answers,
      totalMarks: test.totalMarks,
      negativeMarking: test.negativeMarking,
      negativeMarkingValue: test.negativeMarkingValue ?? 0.66,
      startedAt: 1000,
      endedAt: 7201000,
    })

    expect(result.totalQuestions).toBe(100)
    expect(result.attempted).toBe(90)
    expect(result.correct).toBe(60)
    expect(result.incorrect).toBe(30)
    expect(result.unattempted).toBe(10)
    expect(result.rawScore).toBe(120) // 60 * 2
    expect(result.negativeMarks).toBeCloseTo(19.8, 1) // 30 * 0.66 = 19.8
    expect(result.finalScore).toBeCloseTo(100.2, 1) // 120 - 19.8 = 100.2
    expect(result.accuracy).toBeCloseTo((60 / 90) * 100, 1)
  })
})
