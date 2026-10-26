import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  FileText,
  HelpCircle,
  Newspaper,
  ClipboardList,
  BookMarked,
  Target,
  PenLine,
  Calculator,
  Scale,
} from 'lucide-react'
import { getAllMainsAnswers, getAllStudyMaterials, getAllCurrentAffairs, getAllMockTests } from '@/lib/content'
import { formatDate, truncate } from '@/lib/utils'
import type { MainsAnswer, StudyMaterial, MockTest } from '@/types'

// ─── Section Card ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    icon: PenLine,
    label: 'Mains Answers',
    description: 'Practice answer writing with detailed model answers for GS papers.',
    href: '/mains',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: HelpCircle,
    label: 'Prelims PYQs',
    description: 'Previous-year questions with explanations, organised by subject.',
    href: '/prelims',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: ClipboardList,
    label: 'Mock Tests',
    description: 'Timed practice tests with scoring and detailed reviews.',
    href: '/mock-tests',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: BookOpen,
    label: 'Study Materials',
    description: 'Subject-wise notes, revision sheets, and important topics.',
    href: '/study-materials',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    icon: Newspaper,
    label: 'Current Affairs',
    description: 'Daily and monthly current affairs with Prelims and Mains relevance.',
    href: '/current-affairs',
    color: 'bg-rose-50 text-rose-700',
  },
  {
    icon: BookMarked,
    label: 'UPSC Syllabus',
    description: 'Official syllabus for Prelims and Mains with navigation links.',
    href: '/syllabus',
    color: 'bg-slate-100 text-slate-700',
  },
  {
    icon: Target,
    label: 'UPSC Guide',
    description: 'Exam pattern, eligibility, strategy, and preparation roadmap.',
    href: '/upsc-guide',
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    icon: FileText,
    label: 'Essay',
    description: 'Essay topics, outlines, and practice essays for the Mains paper.',
    href: '/essay',
    color: 'bg-orange-50 text-orange-700',
  },
  {
    icon: Calculator,
    label: 'CSAT',
    description: 'Reasoning, comprehension, and numeracy practice for Paper II.',
    href: '/csat',
    color: 'bg-teal-50 text-teal-700',
  },
  {
    icon: Scale,
    label: 'Ethics & GS4',
    description: 'Ethics concepts, case studies, and structured answer practice.',
    href: '/ethics',
    color: 'bg-pink-50 text-pink-700',
  },
]

function SectionGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {SECTIONS.map((s) => {
        const Icon = s.icon
        return (
          <Link
            key={s.href}
            href={s.href}
            className="card p-5 flex flex-col gap-3 group hover:border-slate-300 transition-all duration-150"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-navy-900 text-sm mb-1" style={{ '--tw-text-opacity': 1 } as React.CSSProperties}>
                {s.label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ─── Mains answer card ────────────────────────────────────────────────────────

function MainsAnswerCard({ answer }: { answer: MainsAnswer }) {
  return (
    <Link href={`/mains/answers/${answer.slug}`} className="card p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-3">
        <span className="badge badge-navy text-xs">{answer.paper}</span>
        <span className="text-xs text-slate-400">{formatDate(answer.date)}</span>
      </div>
      <h3 className="font-semibold text-slate-800 leading-snug text-sm group-hover:text-navy-900 line-clamp-2">
        {answer.title}
      </h3>
      <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto">
        <span>{answer.subject}</span>
        <span>·</span>
        <span>{answer.marks} marks</span>
        {answer.wordLimit && (
          <>
            <span>·</span>
            <span>~{answer.wordLimit} words</span>
          </>
        )}
      </div>
    </Link>
  )
}

// ─── Study material card ──────────────────────────────────────────────────────

function StudyCard({ material }: { material: StudyMaterial }) {
  return (
    <Link href={`/study-materials/${material.slug}`} className="card p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-3">
        <span className="badge badge-gray text-xs capitalize">{material.type}</span>
        <span className="text-xs text-slate-400">{formatDate(material.date)}</span>
      </div>
      <h3 className="font-semibold text-slate-800 leading-snug text-sm group-hover:text-navy-900 line-clamp-2">
        {material.title}
      </h3>
      <p className="text-xs text-slate-500">{material.subject}</p>
    </Link>
  )
}

// ─── Mock test card ───────────────────────────────────────────────────────────

function MockTestCard({ test }: { test: MockTest }) {
  return (
    <Link href={`/mock-tests/${test.slug}`} className="card p-5 flex flex-col gap-3 group">
      <div className="flex items-start gap-2">
        <span className="badge badge-saffron text-xs">{test.subject}</span>
        {test.difficulty && (
          <span className={`badge text-xs ${test.difficulty === 'Easy' ? 'badge-green' : test.difficulty === 'Hard' ? 'badge-red' : 'badge-gray'}`}>
            {test.difficulty}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-slate-800 leading-snug text-sm group-hover:text-navy-900 line-clamp-2">
        {test.title}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-2">{test.description}</p>
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto">
        <span>{test.questions.length} questions</span>
        <span>·</span>
        <span>{test.durationMinutes} min</span>
        <span>·</span>
        <span>{test.totalMarks} marks</span>
      </div>
    </Link>
  )
}

// ─── How to use ───────────────────────────────────────────────────────────────

function HowToUse() {
  const steps = [
    {
      step: '01',
      title: 'Browse Topics',
      desc: 'Explore subject-wise study materials, PYQs, and answer-writing practice organised by GS paper.',
    },
    {
      step: '02',
      title: 'Practise Answers',
      desc: 'Read model answers to understand structure, content, and presentation expected in UPSC Mains.',
    },
    {
      step: '03',
      title: 'Take Mock Tests',
      desc: 'Attempt timed practice tests to build speed, accuracy, and exam temperament before the actual exam.',
    },
    {
      step: '04',
      title: 'Bookmark & Revise',
      desc: 'Bookmark important questions and articles to revisit during revision without creating an account.',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((s) => (
        <div key={s.step} className="flex flex-col gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            {s.step}
          </div>
          <h3 className="font-semibold text-slate-800">{s.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const mainsAnswers = getAllMainsAnswers().slice(0, 6)
  const studyMaterials = getAllStudyMaterials().slice(0, 6)
  const mockTests = getAllMockTests().slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
        <div className="container-wide py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-amber-900 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-3 font-serif" style={{ color: '#0b1e36' }}>
                Karma<span style={{ color: '#b47b3b' }}>Vidya</span>IAS
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-700 mb-4">
                Your UPSC CSE Preparation, <span style={{ color: 'var(--color-accent)' }}>All in One Place</span>
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-xl">
                Practise daily Mains answer writing, master subject-wise Prelims PYQs, take timed mock tests, and revise high-yield notes. A 100% free learning resource for UPSC aspirants.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/mains" className="btn btn-primary btn-lg shadow-sm">
                  Start Mains Practice
                </Link>
                <Link href="/prelims" className="btn btn-outline btn-lg">
                  Explore PYQs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-3.5 rounded-2xl bg-white border border-amber-200/70 shadow-lg max-w-xs sm:max-w-sm w-full text-center">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-100">
                  <Image
                    src="/images/karmavidya-ias-logo.jpg"
                    alt="KarmaVidyaIAS Logo - कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="pt-3 pb-1">
                  <p className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                    Learn • Practise • Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick search */}
      <section className="border-b border-slate-100 py-5">
        <div className="container-wide">
          <Link
            href="/search"
            className="flex items-center gap-3 w-full md:max-w-2xl border border-slate-200 rounded-xl px-5 py-3.5 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="text-sm">Search for questions, topics, study materials…</span>
            <span className="ml-auto text-xs font-medium text-slate-300 bg-slate-100 px-2 py-1 rounded hidden sm:inline">⌘K</span>
          </Link>
        </div>
      </section>

      {/* Sections grid */}
      <section className="section-gap border-b border-slate-100">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading" style={{ color: 'var(--color-primary)' }}>Explore Sections</h2>
          </div>
          <SectionGrid />
        </div>
      </section>

      {/* Recent Mains Answers */}
      <section className="section-gap border-b border-slate-100">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading" style={{ color: 'var(--color-primary)' }}>Recent Mains Answers</h2>
            <Link href="/mains" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
              View all →
            </Link>
          </div>
          {mainsAnswers.length === 0 ? (
            <EmptyState
              title="No answers published yet"
              message="Mains practice answers will appear here once published. Start by adding an MDX file to content/mains-answers/."
              action={{ label: 'Learn how to add content', href: '/about' }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainsAnswers.map((a) => <MainsAnswerCard key={a.slug} answer={a} />)}
            </div>
          )}
        </div>
      </section>

      {/* Study Materials */}
      <section className="section-gap border-b border-slate-100 bg-slate-50">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading" style={{ color: 'var(--color-primary)' }}>Study Materials</h2>
            <Link href="/study-materials" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
              View all →
            </Link>
          </div>
          {studyMaterials.length === 0 ? (
            <EmptyState
              title="Study materials coming soon"
              message="Subject-wise notes, revision sheets, and topic guides will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyMaterials.map((m) => <StudyCard key={m.slug} material={m} />)}
            </div>
          )}
        </div>
      </section>

      {/* Mock Tests */}
      <section className="section-gap border-b border-slate-100">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading" style={{ color: 'var(--color-primary)' }}>Practice Tests</h2>
            <Link href="/mock-tests" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
              View all →
            </Link>
          </div>
          {mockTests.length === 0 ? (
            <EmptyState
              title="Mock tests coming soon"
              message="Timed practice tests with answer explanations will be added regularly."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTests.map((t) => <MockTestCard key={t.slug} test={t} />)}
            </div>
          )}
        </div>
      </section>

      {/* How to use */}
      <section className="section-gap border-b border-slate-100 bg-slate-50">
        <div className="container-wide">
          <div className="mb-10">
            <h2 className="section-heading mb-2" style={{ color: 'var(--color-primary)' }}>How to Use This Platform</h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Everything you need for UPSC preparation, designed to work the way you study.
            </p>
          </div>
          <HowToUse />
        </div>
      </section>

      {/* About disclaimer */}
      <section className="py-10 border-b border-slate-100">
        <div className="container-wide">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Independent Learning Resource</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                This platform is maintained by an independent UPSC aspirant. Answers published here are personal practice answers, not official model answers. This site is not affiliated with or endorsed by UPSC or any government authority. Always verify time-sensitive information from official UPSC notifications.
              </p>
              <Link href="/about" className="inline-block mt-3 text-sm font-medium text-amber-700 hover:underline">
                Learn more about this platform →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
        <BookOpen size={22} className="text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md">{message}</p>
      {action && (
        <Link href={action.href} className="text-sm font-medium mt-1" style={{ color: 'var(--color-primary)' }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
