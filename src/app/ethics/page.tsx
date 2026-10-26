import type { Metadata } from 'next'
import { Scale } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Ethics & GS Paper IV',
  description: 'UPSC GS Paper IV preparation — ethics concepts, case studies, thinkers, and structured answer writing.',
}

const TOPICS = [
  { title: 'Ethics and Human Interface', desc: 'Determinants and consequences of ethical conduct; moral dimensions of human behaviour.' },
  { title: 'Attitude', desc: 'Content, structure, function; influence on thought and behaviour; moral and political attitudes.' },
  { title: 'Aptitude and Values for Civil Services', desc: 'Integrity, impartiality, non-partisanship, objectivity, dedication, empathy, tolerance.' },
  { title: 'Emotional Intelligence', desc: 'Concepts, utilities, and application in governance and administration.' },
  { title: 'Moral Thinkers', desc: 'Contributions of thinkers from India and the world: Gandhi, Kant, Mill, Rawls, and others.' },
  { title: 'Public Service Ethics', desc: 'Public service values, ethics in administration, conflicts of interest, probity.' },
  { title: 'Corporate Governance', desc: 'Ethical concerns, shareholder vs stakeholder, CSR, whistleblower protection.' },
  { title: 'Case Studies', desc: 'Structured approach to ethical dilemmas, stakeholder analysis, and decision-making.' },
]

export default function EthicsPage() {
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Ethics & GS4' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-pink-50">
              <Scale size={22} className="text-pink-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Ethics & GS Paper IV
              </h1>
              <p className="text-slate-500 text-sm max-w-xl">
                Ethics concepts, important thinkers, case study approaches, and structured answer-writing practice for GS Paper IV.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-wide py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="mt-8 p-5 rounded-xl bg-pink-50 border border-pink-200">
          <h3 className="font-semibold text-pink-900 mb-2">About GS Paper IV</h3>
          <p className="text-sm text-pink-800 leading-relaxed">
            GS Paper IV carries 250 marks and tests candidates on ethics, integrity, and aptitude. It includes theoretical questions and case studies. Candidates are expected to demonstrate ethical reasoning, not just knowledge of definitions. Practice answer writing with real case studies.
          </p>
        </div>
      </div>
    </div>
  )
}
