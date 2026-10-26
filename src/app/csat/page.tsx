import type { Metadata } from 'next'
import { Calculator } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'CSAT Preparation',
  description: 'UPSC CSAT preparation — reading comprehension, logical reasoning, numeracy, and data interpretation practice.',
}

const TOPICS = [
  { title: 'Reading Comprehension', desc: 'Practice passages with questions to build speed and accuracy.', status: 'coming-soon' },
  { title: 'Logical Reasoning', desc: 'Statement-conclusion, assumptions, arguments, and inference questions.', status: 'coming-soon' },
  { title: 'Analytical Ability', desc: 'Puzzles, coding-decoding, blood relations, directions, and series.', status: 'coming-soon' },
  { title: 'Basic Numeracy', desc: 'Number systems, percentages, ratio, averages, time and work.', status: 'coming-soon' },
  { title: 'Data Interpretation', desc: 'Bar charts, pie charts, tables, and line graphs with calculations.', status: 'coming-soon' },
  { title: 'Decision Making', desc: 'Case-based decision-making questions for Paper II.', status: 'coming-soon' },
]

export default function CsatPage() {
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'CSAT' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-50">
              <Calculator size={22} className="text-teal-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                CSAT — Paper II
              </h1>
              <p className="text-slate-500 text-sm max-w-xl">
                Practice resources for Prelims Paper II: reading comprehension, logical reasoning, numeracy, and data interpretation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-wide py-10">
        <div className="mb-6 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-800">
          CSAT is a qualifying paper. You need a minimum of 33% (66/200) to qualify. CSAT marks do not count towards your Prelims ranking.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((t) => (
            <div key={t.title} className="card p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{t.title}</h3>
                <span className="badge badge-gray text-xs">Coming soon</span>
              </div>
              <p className="text-sm text-slate-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
