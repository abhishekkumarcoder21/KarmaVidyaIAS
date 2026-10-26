/**
 * Shared TypeScript types for all content schemas.
 * Each content type has its own frontmatter interface + a resolved type.
 */

// ─── Shared ──────────────────────────────────────────────────────────────────

export type PublishStatus = 'published' | 'draft'

export type GsPaper = 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' | 'Optional' | 'CSAT'

export type ExamStage = 'Prelims' | 'Mains' | 'Both'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

// ─── Mains Answers ────────────────────────────────────────────────────────────

export interface MainsAnswerFrontmatter {
  title: string
  slug: string
  date: string
  paper: GsPaper
  subject: string
  topic: string
  questionType: 'Mains Practice' | 'UPSC PYQ' | 'Essay'
  marks: 10 | 15 | 20 | 25 | 125 | 250
  wordLimit?: number
  year?: number
  tags: string[]
  status: PublishStatus
  references?: string[]
  disclaimer?: string
}

export interface MainsAnswer extends MainsAnswerFrontmatter {
  content: string
  wordCount: number
  readingTime: number
  filePath: string
}

// ─── Prelims PYQ ─────────────────────────────────────────────────────────────

export interface PrelimsQuestion {
  id: string
  questionText: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  explanation: string
  optionExplanations?: {
    a?: string
    b?: string
    c?: string
    d?: string
  }
  year?: number
  examStage: ExamStage
  subject: string
  topic: string
  difficulty?: Difficulty
  source?: string
  tags: string[]
  isVerified: boolean
  status: PublishStatus
}

export interface PrelimsQuestionFileFrontmatter {
  subject: string
  topic: string
  year?: number
  source?: string
  status: PublishStatus
}

export interface PrelimsQuestionFile extends PrelimsQuestionFileFrontmatter {
  questions: PrelimsQuestion[]
  slug: string
  filePath: string
}

// ─── Mock Tests ──────────────────────────────────────────────────────────────

export interface MockTestQuestion {
  id: string
  questionText: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  explanation: string
  subject?: string
  topic?: string
  marks?: number
}

export interface MockTestFrontmatter {
  title: string
  slug: string
  description: string
  subject: string
  paper?: GsPaper
  durationMinutes: number
  totalMarks: number
  negativeMarking: boolean
  negativeMarkingValue?: number
  tags: string[]
  status: PublishStatus
  difficulty?: Difficulty
  instructions?: string[]
}

export interface MockTest extends MockTestFrontmatter {
  questions: MockTestQuestion[]
  filePath: string
}

// ─── Study Materials ─────────────────────────────────────────────────────────

export interface StudyMaterialFrontmatter {
  title: string
  slug: string
  date: string
  subject: string
  topic: string
  paper?: GsPaper
  type: 'article' | 'notes' | 'revision' | 'mindmap' | 'table' | 'definition'
  tags: string[]
  status: PublishStatus
  references?: string[]
  lastVerified?: string
}

export interface StudyMaterial extends StudyMaterialFrontmatter {
  content: string
  wordCount: number
  readingTime: number
  filePath: string
}

// ─── Current Affairs ─────────────────────────────────────────────────────────

export interface CurrentAffairsFrontmatter {
  title: string
  slug: string
  date: string
  subjects: string[]
  prelimsRelevance: boolean
  mainsRelevance?: GsPaper[]
  tags: string[]
  status: PublishStatus
  source?: string[]
  importantFacts?: string[]
  lastVerified?: string
}

export interface CurrentAffairs extends CurrentAffairsFrontmatter {
  content: string
  wordCount: number
  readingTime: number
  filePath: string
}

// ─── Essays ──────────────────────────────────────────────────────────────────

export interface EssayFrontmatter {
  title: string
  slug: string
  date: string
  topic: string
  type: 'practice-essay' | 'outline' | 'guide' | 'topic-analysis'
  tags: string[]
  status: PublishStatus
  wordCount?: number
  year?: number
}

export interface Essay extends EssayFrontmatter {
  content: string
  calculatedWordCount: number
  readingTime: number
  filePath: string
}

// ─── Search Index ─────────────────────────────────────────────────────────────

export interface SearchIndexEntry {
  id: string
  title: string
  description: string
  tags: string[]
  subject?: string
  topic?: string
  type: 'mains-answer' | 'prelims-question' | 'study-material' | 'current-affairs' | 'mock-test' | 'essay' | 'guide' | 'syllabus'
  href: string
  date?: string
}

// ─── Quiz State ───────────────────────────────────────────────────────────────

export type QuizAnswer = 'a' | 'b' | 'c' | 'd' | null

export interface QuizQuestionState {
  questionId: string
  selectedAnswer: QuizAnswer
  isMarkedForReview: boolean
  timeSpentSeconds: number
}

export interface QuizSession {
  testSlug: string
  testTitle: string
  startedAt: number
  endedAt?: number
  durationMinutes: number
  answers: Record<string, QuizQuestionState>
  submitted: boolean
  score?: QuizResult
}

export interface QuizResult {
  totalQuestions: number
  attempted: number
  correct: number
  incorrect: number
  unattempted: number
  rawScore: number
  totalMarks: number
  negativeMarks: number
  finalScore: number
  accuracy: number
  timeTakenSeconds: number
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: PaginationMeta
}
