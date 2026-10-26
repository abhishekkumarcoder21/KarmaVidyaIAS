import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, AlertCircle, Calendar, Info } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'UPSC Exam Guide',
  description: 'Complete guide to the UPSC Civil Services Examination — pattern, eligibility, stages, and preparation strategy.',
}

const GUIDE_SECTIONS = [
  {
    id: 'overview',
    title: 'Examination Overview',
    content: `The Union Public Service Commission (UPSC) conducts the Civil Services Examination (CSE) annually to recruit officers for the Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and approximately 24 other All India Services and Central Services.

The examination is conducted in three stages:
1. **Preliminary Examination** — Objective type (screening stage)
2. **Main Examination** — Written descriptive examination
3. **Personality Test (Interview)** — Final stage`
  },
  {
    id: 'eligibility',
    title: 'Eligibility Criteria',
    subsections: [
      {
        title: 'Nationality',
        content: 'Must be a citizen of India (for IAS and IPS). For certain other services, citizenship requirements may differ. Refer to the official notification.'
      },
      {
        title: 'Educational Qualification',
        content: 'Must hold a degree from any of the universities incorporated by an Act of the Central or State Legislature in India, or an equivalent qualification. Final year students appearing for their degree examinations are also eligible.'
      },
      {
        title: 'Age Limits',
        content: 'General: 21–32 years. OBC: 21–35 years (3 years relaxation). SC/ST: 21–37 years (5 years relaxation). PwBD: additional relaxation. Ex-servicemen: additional relaxation. Always verify exact limits from the current official notification.'
      },
      {
        title: 'Number of Attempts',
        content: 'General: 6 attempts. OBC: 9 attempts. SC/ST: No limit (subject to age). PwBD (General/OBC): 9 attempts. Always verify from current official notification as rules can change.'
      },
    ],
  },
  {
    id: 'prelims',
    title: 'Preliminary Examination Pattern',
    subsections: [
      {
        title: 'Paper I — General Studies',
        content: '100 questions, 200 marks, 2 hours. Negative marking: 1/3rd of marks for each wrong answer. Covers: Current Affairs, History, Geography, Polity, Economy, Environment, Science & Technology.'
      },
      {
        title: 'Paper II — CSAT',
        content: '80 questions, 200 marks, 2 hours. Qualifying in nature (minimum 33% required). Covers: Comprehension, Reasoning, Analytical ability, Basic numeracy, Data interpretation. CSAT marks are NOT counted for ranking — only for qualifying.'
      },
    ],
  },
  {
    id: 'mains',
    title: 'Main Examination Pattern',
    subsections: [
      {
        title: 'Structure',
        content: 'The Mains examination consists of 9 papers. 2 qualifying papers (not counted for ranking) + 7 merit papers counting towards ranking.'
      },
      {
        title: 'Qualifying Papers',
        content: 'Paper A: Indian Language (300 marks, qualifying) — any language from 8th Schedule. Paper B: English (300 marks, qualifying).'
      },
      {
        title: 'Merit Papers',
        content: 'Essay (250) + GS I (250) + GS II (250) + GS III (250) + GS IV (250) + Optional I (250) + Optional II (250) = 1750 marks total for written Mains.'
      },
    ],
  },
  {
    id: 'interview',
    title: 'Personality Test (Interview)',
    content: `The interview carries 275 marks. Combined with Mains written marks (1750), the total is 2025 marks for the final merit list.

The interview is conducted by a Board that tests:
- Mental alertness
- Critical powers of assimilation
- Clear and logical exposition
- Balance of judgement
- Variety and depth of interest
- Leadership and social cohesion
- Intellectual and moral integrity`
  },
  {
    id: 'strategy',
    title: 'General Preparation Strategy',
    content: `This section offers broad guidance. The optimal strategy varies by individual background and circumstances.

**For Beginners:**
- Start with NCERTs for History, Geography, Polity, Economy, Science
- Read standard reference books for each subject
- Follow current affairs through reliable sources daily
- Begin answer writing early — do not wait until all syllabus is covered

**For Prelims:**
- Solve previous-year papers extensively
- Work on CSAT reasoning and numeracy regularly
- Focus on environment, science & technology, and current affairs
- Use revision sheets for static topics

**For Mains:**
- Practice answer writing daily
- Focus on structure: Introduction, Body, Conclusion
- Read good editorials and government reports
- Prepare case studies for GS4

**For Interview:**
- Know your optional subject thoroughly
- Be current with national and international affairs
- Prepare DAF thoroughly — every detail matters
- Practice mock interviews`
  },
]

function GuideSection({ section }: { section: typeof GUIDE_SECTIONS[0] }) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
        {section.title}
      </h2>
      {'subsections' in section ? (
        <div className="space-y-4">
          {(section.subsections as { title: string; content: string }[]).map((sub) => (
            <div key={sub.title} className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-2">{sub.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{sub.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="prose-content max-w-none">
          <div className="text-slate-600 text-[0.9375rem] leading-relaxed whitespace-pre-line">
            {(section as { content: string }).content}
          </div>
        </div>
      )}
    </section>
  )
}

export default function UpscGuidePage() {
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'UPSC Guide' }]} />
          <div className="mt-5">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              UPSC Exam Guide
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-xl">
              A comprehensive reference for the Civil Services Examination — pattern, eligibility, stages, and preparation guidance.
            </p>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar TOC */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-20 card p-4">
              <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-3">On This Page</h3>
              <nav>
                <ul className="space-y-1">
                  {GUIDE_SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="block text-sm text-slate-600 hover:text-slate-900 py-1 hover:underline">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Important disclaimer */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-800 flex items-start gap-3">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>Important:</strong> Examination rules, dates, eligibility criteria, and attempt limits can change from year to year. This guide was last reviewed in October 2026. Always verify from the latest official UPSC notification.
                <div className="mt-2">
                  <a
                    href="https://www.upsc.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium underline"
                  >
                    Visit upsc.gov.in <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {GUIDE_SECTIONS.map((s) => (
              <GuideSection key={s.id} section={s} />
            ))}

            {/* Official links */}
            <section className="rounded-xl bg-slate-50 border border-slate-200 p-6">
              <h2 className="font-bold text-lg mb-4 text-slate-800">Official Resources</h2>
              <ul className="space-y-2">
                {[
                  { label: 'UPSC Official Website', href: 'https://www.upsc.gov.in' },
                  { label: 'UPSC Notifications', href: 'https://www.upsc.gov.in/examinations/active-examinations' },
                  { label: 'UPSC Previous Year Papers', href: 'https://www.upsc.gov.in/examinations/previous-question-papers' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <ExternalLink size={13} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
