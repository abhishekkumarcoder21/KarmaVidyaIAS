'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookMarked,
  Trash2,
  Clock,
  Award,
  ChevronRight,
  BookOpen,
  HelpCircle,
  FileText,
  Newspaper,
  ClipboardList,
  Sparkles,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import {
  getBookmarks,
  removeBookmark,
  getQuizHistory,
  clearAllLocalData,
  Bookmark,
  QuizHistoryEntry,
} from '@/lib/bookmarks'
import { formatDate } from '@/lib/utils'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>([])
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks')
  const [filterType, setFilterType] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setBookmarks(getBookmarks())
    setQuizHistory(getQuizHistory())
    setMounted(true)
  }, [])

  const handleRemove = (id: string) => {
    removeBookmark(id)
    setBookmarks(getBookmarks())
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all bookmarks and test history from this device?')) {
      clearAllLocalData()
      setBookmarks([])
      setQuizHistory([])
    }
  }

  const filteredBookmarks = bookmarks.filter((b) => {
    if (filterType === 'all') return true
    return b.type === filterType
  })

  if (!mounted) {
    return (
      <div className="container-wide py-12">
        <div className="animate-pulse space-y-4 max-w-xl">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-1/2"></div>
          <div className="h-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Bookmarks & History' }]} />
          <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-700">
                <BookMarked size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                  Bookmarks & Revision
                </h1>
                <p className="text-slate-500 text-sm max-w-xl">
                  Quick access to all your saved Mains answers, study notes, and mock test scores stored locally in your browser.
                </p>
              </div>
            </div>

            {(bookmarks.length > 0 || quizHistory.length > 0) && (
              <button
                onClick={handleClearAll}
                className="btn btn-sm btn-ghost text-rose-600 hover:bg-rose-50 border border-rose-200 self-start md:self-auto"
              >
                <Trash2 size={14} />
                Clear Local Data
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Main tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'border-navy-900 text-navy-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            style={activeTab === 'bookmarks' ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
          >
            <BookMarked size={16} />
            Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-navy-900 text-navy-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            style={activeTab === 'history' ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
          >
            <Award size={16} />
            Mock Test History ({quizHistory.length})
          </button>
        </div>

        {activeTab === 'bookmarks' ? (
          <div>
            {bookmarks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'mains-answer', label: 'Mains Answers' },
                  { id: 'study-material', label: 'Study Notes' },
                  { id: 'current-affairs', label: 'Current Affairs' },
                  { id: 'essay', label: 'Essays' },
                  { id: 'mock-test', label: 'Mock Tests' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilterType(type.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      filterType === type.id
                        ? 'bg-navy-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    style={filterType === type.id ? { background: 'var(--color-primary)' } : {}}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}

            {filteredBookmarks.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <BookMarked size={22} />
                </div>
                <h3 className="font-semibold text-slate-800">No bookmarks saved yet</h3>
                <p className="text-sm text-slate-500 max-w-md">
                  While exploring Mains answers or study materials, click the Bookmark button to save them here for instant offline revision.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link href="/mains" className="btn btn-sm btn-primary">
                    Explore Mains Answers
                  </Link>
                  <Link href="/mock-tests" className="btn btn-sm btn-outline">
                    Browse Mock Tests
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookmarks.map((item) => (
                  <div
                    key={item.id}
                    className="card p-4 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="badge badge-navy text-xs uppercase">{item.type.replace('-', ' ')}</span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remove bookmark"
                          aria-label="Remove bookmark"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <Link href={item.href} className="font-semibold text-slate-800 group-hover:text-navy-900 leading-snug">
                        {item.title}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                      <span>{item.subject ?? 'General'}</span>
                      <Link href={item.href} className="flex items-center gap-1 text-blue-600 font-medium group-hover:underline">
                        Open <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {quizHistory.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Award size={22} />
                </div>
                <h3 className="font-semibold text-slate-800">No mock tests attempted yet</h3>
                <p className="text-sm text-slate-500 max-w-md">
                  Take one of our UPSC-standard timed mock tests. Your scores, accuracy, and completion times will automatically be tracked here.
                </p>
                <Link href="/mock-tests" className="btn btn-sm btn-primary mt-2">
                  Take a Mock Test
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {quizHistory.map((q, idx) => (
                  <div key={idx} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base mb-1">{q.testTitle}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {Math.floor(q.timeTakenSeconds / 60)}m {q.timeTakenSeconds % 60}s
                        </span>
                        <span>•</span>
                        <span>Completed on {new Date(q.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-lg font-bold text-navy-900">
                          {q.score.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ {q.totalMarks}</span>
                        </div>
                        <div className="text-xs font-medium text-emerald-600">{q.accuracy.toFixed(1)}% Accuracy</div>
                      </div>

                      <Link href={`/mock-tests/${q.testSlug}`} className="btn btn-sm btn-outline">
                        Retake
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
