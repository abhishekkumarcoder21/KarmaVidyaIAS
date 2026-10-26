import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllMainsAnswers, getMainsAnswerBySlug } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { MainsAnswerContent } from '@/components/content/MainsAnswerContent'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const answers = getAllMainsAnswers()
  return answers.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const answer = getMainsAnswerBySlug(slug)
  if (!answer) return {}
  return {
    title: answer.title,
    description: `${answer.paper} · ${answer.subject} · ${answer.marks} marks practice answer. ${answer.topic}.`,
    openGraph: {
      title: answer.title,
      description: `UPSC Mains practice answer: ${answer.subject} — ${answer.paper}`,
    },
  }
}

export default async function MainsAnswerPage({ params }: Props) {
  const { slug } = await params
  const answer = getMainsAnswerBySlug(slug)
  if (!answer) notFound()

  const all = getAllMainsAnswers()
  const currentIndex = all.findIndex((a) => a.slug === answer.slug)
  const prev = currentIndex < all.length - 1 ? all[currentIndex + 1] : null
  const next = currentIndex > 0 ? all[currentIndex - 1] : null
  const related = all
    .filter((a) => a.slug !== answer.slug && (a.subject === answer.subject || a.paper === answer.paper))
    .slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="container-wide">
          <Breadcrumbs
            items={[
              { label: 'Mains', href: '/mains' },
              { label: answer.paper, href: `/mains#${answer.paper.toLowerCase()}` },
              { label: answer.title },
            ]}
          />
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="max-w-[800px]">
          {/* Practice notice */}
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
            <span>
              <strong>Practice Answer — Independent Aspirant Submission.</strong> This is a personal practice answer. Not evaluated or endorsed by any official examiner.
            </span>
          </div>

          <MainsAnswerContent answer={answer} prev={prev} next={next} related={related} />
        </div>
      </div>
    </div>
  )
}
