'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookMarked, Printer, Copy, Check, ChevronLeft, ChevronRight, Clock, FileText, Tag } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { toggleBookmark, isBookmarked } from '@/lib/bookmarks'
import type { MainsAnswer } from '@/types'

interface Props {
  answer: MainsAnswer
  prev: MainsAnswer | null
  next: MainsAnswer | null
  related: MainsAnswer[]
}

function useBookmark(answer: MainsAnswer) {
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window === 'undefined') return false
    return isBookmarked(`mains-${answer.slug}`)
  })

  const toggle = () => {
    const result = toggleBookmark({
      id: `mains-${answer.slug}`,
      type: 'mains-answer',
      title: answer.title,
      href: `/mains/answers/${answer.slug}`,
      subject: answer.subject,
      addedAt: Date.now(),
    })
    setBookmarked(result)
  }

  return { bookmarked, toggle }
}

export function MainsAnswerContent({ answer, prev, next, related }: Props) {
  const { bookmarked, toggle } = useBookmark(answer)
  const [copied, setCopied] = useState(false)

  const copyQuestion = () => {
    navigator.clipboard.writeText(answer.title)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article>
      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="badge badge-navy text-sm">{answer.paper}</span>
        {answer.year && <span className="badge badge-gray">UPSC {answer.year}</span>}
        <span className="badge badge-saffron">{answer.questionType}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-[1.75rem] font-bold leading-tight mb-5" style={{ color: 'var(--color-primary)' }}>
        {answer.title}
      </h1>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <InfoItem icon={<FileText size={14} />} label="Subject" value={answer.subject} />
        <InfoItem icon={<Tag size={14} />} label="Topic" value={answer.topic} />
        <InfoItem icon={<Clock size={14} />} label="Marks" value={`${answer.marks} marks`} />
        {answer.wordLimit && (
          <InfoItem icon={<FileText size={14} />} label="Word Limit" value={`~${answer.wordLimit}`} />
        )}
      </div>

      {/* Dates and reading time */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6">
        <span>Published {formatDate(answer.date)}</span>
        {answer.wordCount > 0 && <span>{answer.wordCount} words</span>}
        {answer.readingTime > 0 && <span>{answer.readingTime} min read</span>}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mb-8 no-print">
        <button
          onClick={toggle}
          className={cn('btn btn-sm', bookmarked ? 'btn-primary' : 'btn-outline')}
          aria-pressed={bookmarked}
        >
          <BookMarked size={14} />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        <button onClick={copyQuestion} className="btn btn-sm btn-ghost border border-slate-200">
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Question'}
        </button>
        <button onClick={() => window.print()} className="btn btn-sm btn-ghost border border-slate-200">
          <Printer size={14} />
          Print
        </button>
      </div>

      <hr className="divider" />

      {/* Question block */}
      <div className="question-block mb-6">
        <div className="question-label">Question</div>
        <p className="question-text">{answer.title}</p>
        {answer.wordLimit && (
          <p className="text-xs text-slate-500 mt-2">Word limit: approximately {answer.wordLimit} words | {answer.marks} marks</p>
        )}
      </div>

      {/* Answer content */}
      <div className="prose-content">
        <ContentRenderer content={answer.content} />
      </div>

      {/* Tags */}
      {answer.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags:</span>
          {answer.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* References */}
      {answer.references && answer.references.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h3 className="font-semibold text-sm text-slate-700 mb-2">References</h3>
          <ul className="space-y-1">
            {answer.references.map((ref, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-slate-400 mt-0.5">{i + 1}.</span>
                {ref.startsWith('http') ? (
                  <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                    {ref}
                  </a>
                ) : (
                  <span>{ref}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
          {prev ? (
            <Link href={`/mains/answers/${prev.slug}`} className="card p-4 flex items-start gap-3 group hover:border-slate-300">
              <ChevronLeft size={18} className="text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-slate-700" />
              <div>
                <div className="text-xs text-slate-400 mb-1">Previous</div>
                <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900 line-clamp-2">{prev.title}</div>
              </div>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/mains/answers/${next.slug}`} className="card p-4 flex items-start gap-3 group hover:border-slate-300 sm:text-right">
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-1">Next</div>
                <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900 line-clamp-2">{next.title}</div>
              </div>
              <ChevronRight size={18} className="text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-slate-700" />
            </Link>
          )}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10 no-print">
          <h2 className="font-bold text-slate-800 text-lg mb-4">Related Answers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link key={rel.slug} href={`/mains/answers/${rel.slug}`} className="card p-4 group hover:border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-navy text-xs">{rel.paper}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-700 group-hover:text-slate-900 line-clamp-2">{rel.title}</h3>
                <p className="text-xs text-slate-400 mt-2">{rel.subject}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
  )
}

function ContentRenderer({ content }: { content: string }) {
  // Simple markdown-to-HTML converter for display
  // In production this would use next-mdx-remote or remark
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(<h2 key={i}>{line.slice(2)}</h2>)
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i}>{line.slice(3)}</h3>)
    } else if (line.startsWith('### ')) {
      elements.push(<h4 key={i}>{line.slice(4)}</h4>)
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i}>{line.slice(2)}</blockquote>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i}>
          {listItems.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={i}>
          {listItems.map((item, j) => <li key={j}>{item}</li>)}
        </ol>
      )
      continue
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i}><strong>{line.slice(2, -2)}</strong></p>)
    } else if (line.trim() !== '') {
      elements.push(<p key={i}>{renderInlineMarkdown(line)}</p>)
    }
    i++
  }

  return <>{elements}</>
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Handle **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}
