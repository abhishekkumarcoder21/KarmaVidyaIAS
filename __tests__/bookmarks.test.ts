import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  toggleBookmark,
  isBookmarked,
  getQuizHistory,
  addQuizHistory,
  clearAllLocalData,
  Bookmark,
} from '@/lib/bookmarks'

describe('Bookmarks & Local Storage (lib/bookmarks)', () => {
  beforeEach(() => {
    // Clear localStorage mock
    window.localStorage.clear()
  })

  it('should return empty array when no bookmarks exist', () => {
    expect(getBookmarks()).toEqual([])
  })

  it('should add and retrieve bookmarks', () => {
    const bookmark: Bookmark = {
      id: 'mains-test-1',
      type: 'mains-answer',
      title: 'Bhakti Movement Model Answer',
      href: '/mains/answers/bhakti-movement',
      subject: 'Art and Culture',
      addedAt: Date.now(),
    }

    addBookmark(bookmark)
    expect(isBookmarked('mains-test-1')).toBe(true)

    const list = getBookmarks()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe('mains-test-1')
  })

  it('should toggle bookmarks on and off', () => {
    const bookmark: Bookmark = {
      id: 'test-toggle-1',
      type: 'mock-test',
      title: 'Polity Mock',
      href: '/mock-tests/polity',
      addedAt: Date.now(),
    }

    const state1 = toggleBookmark(bookmark)
    expect(state1).toBe(true)
    expect(isBookmarked('test-toggle-1')).toBe(true)

    const state2 = toggleBookmark(bookmark)
    expect(state2).toBe(false)
    expect(isBookmarked('test-toggle-1')).toBe(false)
  })

  it('should remove bookmark by id', () => {
    const b1: Bookmark = { id: 'b1', type: 'essay', title: 'Essay 1', href: '/essay/1', addedAt: 1 }
    const b2: Bookmark = { id: 'b2', type: 'study-material', title: 'Study 2', href: '/study/2', addedAt: 2 }

    addBookmark(b1)
    addBookmark(b2)
    expect(getBookmarks().length).toBe(2)

    removeBookmark('b1')
    const remaining = getBookmarks()
    expect(remaining.length).toBe(1)
    expect(remaining[0].id).toBe('b2')
  })

  it('should record quiz history entries up to limit', () => {
    expect(getQuizHistory()).toEqual([])

    addQuizHistory({
      testSlug: 'mock-1',
      testTitle: 'Polity Mock 1',
      completedAt: Date.now(),
      score: 14.68,
      totalMarks: 16,
      accuracy: 92.5,
      timeTakenSeconds: 520,
    })

    const history = getQuizHistory()
    expect(history.length).toBe(1)
    expect(history[0].testSlug).toBe('mock-1')
    expect(history[0].score).toBe(14.68)
  })

  it('should clear all local data cleanly', () => {
    addBookmark({ id: 'b1', type: 'essay', title: 'E', href: '/e', addedAt: 1 })
    addQuizHistory({
      testSlug: 'm',
      testTitle: 'M',
      completedAt: 1,
      score: 10,
      totalMarks: 10,
      accuracy: 100,
      timeTakenSeconds: 30,
    })

    expect(getBookmarks().length).toBe(1)
    expect(getQuizHistory().length).toBe(1)

    clearAllLocalData()

    expect(getBookmarks().length).toBe(0)
    expect(getQuizHistory().length).toBe(0)
  })
})
