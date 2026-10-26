'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, BookOpen, FileText, Newspaper, ClipboardList, PenLine } from 'lucide-react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { cn } from '@/lib/utils'

export interface SearchEntry {
  id: string
  title: string
  description: string
  tags: string[]
  subject?: string
  topic?: string
  type: string
  href: string
  date?: string
}

interface Props {
  entries: SearchEntry[]
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'mains-answer': <PenLine size={14} />,
  'study-material': <BookOpen size={14} />,
  'current-affairs': <Newspaper size={14} />,
  'mock-test': <ClipboardList size={14} />,
  'essay': <FileText size={14} />,
}

const TYPE_LABELS: Record<string, string> = {
  'mains-answer': 'Mains Answer',
  'study-material': 'Study Material',
  'current-affairs': 'Current Affairs',
  'mock-test': 'Mock Test',
  'essay': 'Essay',
  'prelims-question': 'Prelims PYQ',
  'guide': 'Guide',
  'syllabus': 'Syllabus',
}

const TYPE_COLORS: Record<string, string> = {
  'mains-answer': 'badge-navy',
  'study-material': 'badge-gray',
  'current-affairs': 'badge-saffron',
  'mock-test': 'badge-green',
  'essay': 'badge-gray',
}

export function SearchUI({ entries }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState<SearchEntry[]>([])
  const [selectedType, setSelectedType] = useState<string>('All')

  const fuse = useCallback(
    () =>
      new Fuse(entries, {
        keys: ['title', 'description', 'tags', 'subject', 'topic'],
        threshold: 0.35,
        includeScore: true,
      }),
    [entries]
  )

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }
    const results = fuse()
      .search(q)
      .map((r) => r.item)
    setResults(results)
  }, [query, fuse])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (query) {
      url.searchParams.set('q', query)
    } else {
      url.searchParams.delete('q')
    }
    router.replace(url.pathname + url.search, { scroll: false })
  }, [query, router])

  const types = ['All', ...Array.from(new Set(entries.map((e) => e.type)))]

  const filtered = selectedType === 'All'
    ? results
    : results.filter((r) => r.type === selectedType)

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="search-input"
          type="search"
          autoFocus
          className="input pl-11 pr-10 py-3.5 text-base"
          placeholder="Search questions, topics, study materials…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the site"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Type filter */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {types.map((type) => {
            const count = type === 'All' ? results.length : results.filter((r) => r.type === type).length
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  'tag px-3 py-1.5 font-medium text-xs',
                  selectedType === type ? 'bg-navy-900 text-white border-navy-900' : ''
                )}
                style={selectedType === type ? { background: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' } : {}}
              >
                {type === 'All' ? 'All' : TYPE_LABELS[type] ?? type}
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Results */}
      {query && (
        <div>
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-slate-400 text-sm">
                No results found for <strong>"{query}"</strong>
                {selectedType !== 'All' && ` in ${TYPE_LABELS[selectedType] ?? selectedType}`}.
              </div>
              <p className="text-xs text-slate-300 mt-2">Try a different keyword or browse sections above.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for <strong>"{query}"</strong>
              </p>
              <ul className="space-y-3" role="list">
                {filtered.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={entry.href}
                      className="card p-4 md:p-5 flex flex-col gap-2 group hover:border-slate-300"
                    >
                      <div className="flex items-start gap-3">
                        <span className={cn('badge mt-0.5 flex-shrink-0', TYPE_COLORS[entry.type] ?? 'badge-gray')}>
                          {TYPE_ICONS[entry.type]}
                          {TYPE_LABELS[entry.type] ?? entry.type}
                        </span>
                        <h3 className="font-semibold text-slate-800 group-hover:text-navy-900 text-sm leading-snug flex-1">
                          {highlightQuery(entry.title, query)}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 pl-0 line-clamp-2">{entry.description}</p>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {entry.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="tag text-xs">{tag}</span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Empty state */}
      {!query && (
        <div className="py-12 text-center">
          <Search size={32} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 text-sm">Type a keyword to search across all content.</p>
          <p className="text-xs text-slate-300 mt-1">Try: "federalism", "polity", "environment", "CSAT"</p>
        </div>
      )}
    </div>
  )
}

function highlightQuery(text: string, query: string): React.ReactNode {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-amber-100 text-amber-900 rounded px-0.5">{part}</mark> : part
  )
}
