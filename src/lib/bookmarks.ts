/**
 * localStorage-based bookmark and preferences utility.
 * All functions are safe to use in client components.
 * Handles SSR gracefully (returns empty/defaults when window is unavailable).
 */

const BOOKMARKS_KEY = 'cc_bookmarks'
const QUIZ_HISTORY_KEY = 'cc_quiz_history'
const PREFERENCES_KEY = 'cc_preferences'
const ATTEMPTED_KEY = 'cc_attempted_questions'

export interface Bookmark {
  id: string
  type: 'mains-answer' | 'prelims-question' | 'study-material' | 'current-affairs' | 'essay' | 'mock-test'
  title: string
  href: string
  subject?: string
  addedAt: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'sm' | 'md' | 'lg'
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 'md',
}

function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage unavailable (e.g. private browsing quota exceeded)
  }
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export function getBookmarks(): Bookmark[] {
  const raw = safeGetItem(BOOKMARKS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Bookmark[]
  } catch {
    return []
  }
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((b) => b.id === id)
}

export function addBookmark(bookmark: Bookmark): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== bookmark.id)
  bookmarks.unshift(bookmark)
  safeSetItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id)
  safeSetItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

export function toggleBookmark(bookmark: Bookmark): boolean {
  if (isBookmarked(bookmark.id)) {
    removeBookmark(bookmark.id)
    return false
  } else {
    addBookmark(bookmark)
    return true
  }
}

// ─── Quiz History ─────────────────────────────────────────────────────────────

export interface QuizHistoryEntry {
  testSlug: string
  testTitle: string
  completedAt: number
  score: number
  totalMarks: number
  accuracy: number
  timeTakenSeconds: number
}

export function getQuizHistory(): QuizHistoryEntry[] {
  const raw = safeGetItem(QUIZ_HISTORY_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as QuizHistoryEntry[]
  } catch {
    return []
  }
}

export function addQuizHistory(entry: QuizHistoryEntry): void {
  const history = getQuizHistory()
  history.unshift(entry)
  // Keep last 50 attempts
  safeSetItem(QUIZ_HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}

// ─── Attempted Questions ──────────────────────────────────────────────────────

export function getAttemptedQuestions(): string[] {
  const raw = safeGetItem(ATTEMPTED_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function markQuestionAttempted(id: string): void {
  const attempted = getAttemptedQuestions()
  if (!attempted.includes(id)) {
    attempted.push(id)
    safeSetItem(ATTEMPTED_KEY, JSON.stringify(attempted))
  }
}

export function isQuestionAttempted(id: string): boolean {
  return getAttemptedQuestions().includes(id)
}

// ─── Preferences ──────────────────────────────────────────────────────────────

export function getPreferences(): UserPreferences {
  const raw = safeGetItem(PREFERENCES_KEY)
  if (!raw) return DEFAULT_PREFERENCES
  try {
    return { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<UserPreferences>) }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function setPreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences()
  safeSetItem(PREFERENCES_KEY, JSON.stringify({ ...current, ...prefs }))
}

// ─── Clear all data ───────────────────────────────────────────────────────────

export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(BOOKMARKS_KEY)
    localStorage.removeItem(QUIZ_HISTORY_KEY)
    localStorage.removeItem(PREFERENCES_KEY)
    localStorage.removeItem(ATTEMPTED_KEY)
  } catch {
    // ignore
  }
}
