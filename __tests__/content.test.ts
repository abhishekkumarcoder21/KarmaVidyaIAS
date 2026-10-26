import {
  getAllMainsAnswers,
  getMainsAnswerBySlug,
  getAllStudyMaterials,
  getStudyMaterialBySlug,
  getAllCurrentAffairs,
  getAllMockTests,
  getMockTestBySlug,
  getAllPrelimsQuestions,
  getPrelimsQuestionsBySubject,
  buildSearchIndex,
} from '@/lib/content'

describe('Content Engine (lib/content)', () => {
  describe('Mains Answers', () => {
    it('should load all published Mains answers', () => {
      const answers = getAllMainsAnswers()
      expect(Array.isArray(answers)).toBe(true)
      expect(answers.length).toBeGreaterThanOrEqual(1)

      const first = answers[0]
      expect(first).toHaveProperty('title')
      expect(first).toHaveProperty('slug')
      expect(first).toHaveProperty('paper')
      expect(first).toHaveProperty('content')
      expect(first.status).toBe('published')
    })

    it('should sort answers in reverse chronological order (newest first)', () => {
      const answers = getAllMainsAnswers()
      if (answers.length > 1) {
        const time0 = new Date(answers[0].date).getTime()
        const time1 = new Date(answers[1].date).getTime()
        expect(time0).toBeGreaterThanOrEqual(time1)
      }
    })

    it('should retrieve a specific answer by slug', () => {
      const all = getAllMainsAnswers()
      const sample = all[0]
      const found = getMainsAnswerBySlug(sample.slug)
      expect(found).not.toBeNull()
      expect(found?.slug).toBe(sample.slug)
      expect(found?.title).toBe(sample.title)
    })

    it('should return null for non-existent slug', () => {
      const nonExistent = getMainsAnswerBySlug('non-existent-answer-slug-xyz')
      expect(nonExistent).toBeNull()
    })
  })

  describe('Study Materials', () => {
    it('should load study materials with calculated reading times', () => {
      const materials = getAllStudyMaterials()
      expect(Array.isArray(materials)).toBe(true)
      expect(materials.length).toBeGreaterThanOrEqual(1)

      for (const m of materials) {
        expect(m.readingTime).toBeGreaterThanOrEqual(1)
        expect(m.wordCount).toBeGreaterThan(0)
      }
    })

    it('should find study material by slug', () => {
      const materials = getAllStudyMaterials()
      const first = materials[0]
      const fetched = getStudyMaterialBySlug(first.slug)
      expect(fetched?.slug).toBe(first.slug)
    })
  })

  describe('Mock Tests', () => {
    it('should load mock tests with valid question arrays', () => {
      const tests = getAllMockTests()
      expect(tests.length).toBeGreaterThanOrEqual(1)

      for (const test of tests) {
        expect(test.questions.length).toBeGreaterThan(0)
        expect(test.durationMinutes).toBeGreaterThan(0)
        expect(test.totalMarks).toBeGreaterThan(0)

        for (const q of test.questions) {
          expect(['a', 'b', 'c', 'd']).toContain(q.correctAnswer)
          expect(q.options.a).toBeDefined()
          expect(q.options.b).toBeDefined()
          expect(q.options.c).toBeDefined()
          expect(q.options.d).toBeDefined()
        }
      }
    })

    it('should retrieve mock test by slug', () => {
      const tests = getAllMockTests()
      const first = tests[0]
      const found = getMockTestBySlug(first.slug)
      expect(found?.title).toBe(first.title)
    })
  })

  describe('Prelims Questions', () => {
    it('should load all prelims PYQs', () => {
      const questions = getAllPrelimsQuestions()
      expect(Array.isArray(questions)).toBe(true)
      expect(questions.length).toBeGreaterThanOrEqual(1)

      for (const q of questions) {
        expect(q.id).toBeDefined()
        expect(q.questionText).toBeDefined()
        expect(['a', 'b', 'c', 'd']).toContain(q.correctAnswer)
      }
    })

    it('should filter prelims questions by subject slug', () => {
      const polityQuestions = getPrelimsQuestionsBySubject('polity')
      expect(Array.isArray(polityQuestions)).toBe(true)
      for (const q of polityQuestions) {
        expect(q.subject.toLowerCase()).toContain('polity')
      }
    })
  })

  describe('Search Index Builder', () => {
    it('should aggregate content from all sources into search index', () => {
      const index = buildSearchIndex()
      expect(Array.isArray(index)).toBe(true)
      expect(index.length).toBeGreaterThanOrEqual(5)

      const types = new Set(index.map((i) => i.type))
      expect(types.has('mains-answer')).toBe(true)
      expect(types.has('mock-test')).toBe(true)
      expect(types.has('study-material')).toBe(true)
    })
  })
})
