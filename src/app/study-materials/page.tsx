import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllStudyMaterials } from '@/lib/content'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDate } from '@/lib/utils'
import { BookOpen } from 'lucide-react'
import type { StudyMaterial } from '@/types'

export const metadata: Metadata = {
  title: 'Study Materials',
  description: 'Subject-wise UPSC study materials including notes, revision sheets, and important topics.',
}

const SUBJECTS = [
  'Indian History', 'Indian Polity', 'Geography', 'Indian Economy',
  'Environment and Ecology', 'Science and Technology', 'Art and Culture',
  'Governance', 'Social Justice', 'International Relations',
  'Internal Security', 'Ethics', 'Essay Writing', 'CSAT',
]

function MaterialCard({ material }: { material: StudyMaterial }) {
  return (
    <Link href={`/study-materials/${material.slug}`} className="card p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-2">
        <span className="badge badge-gray capitalize">{material.type}</span>
        <span className="text-xs text-slate-400">{formatDate(material.date)}</span>
      </div>
      <h2 className="font-semibold text-slate-800 group-hover:text-navy-900 text-sm leading-snug line-clamp-2">
        {material.title}
      </h2>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {material.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag text-xs">{tag}</span>
        ))}
      </div>
      <div className="text-xs text-slate-400">
        {material.subject} · {material.readingTime} min read
      </div>
    </Link>
  )
}

export default function StudyMaterialsPage() {
  const materials = getAllStudyMaterials()

  const bySubject: Record<string, StudyMaterial[]> = {}
  for (const mat of materials) {
    if (!bySubject[mat.subject]) bySubject[mat.subject] = []
    bySubject[mat.subject].push(mat)
  }

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Study Materials' }]} />
          <div className="mt-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-50">
              <BookOpen size={22} className="text-purple-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Study Materials
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Subject-wise notes, revision sheets, and topic guides for UPSC Prelims and Mains preparation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        {materials.length === 0 ? (
          <div>
            {/* Subject index - showing planned subjects */}
            <h2 className="font-bold text-lg text-slate-800 mb-4">Planned Subjects</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
              {SUBJECTS.map((s) => (
                <div key={s} className="card p-4 flex flex-col gap-1">
                  <span className="font-semibold text-sm text-slate-700">{s}</span>
                  <span className="text-xs text-slate-400">Coming soon</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <BookOpen size={22} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-700">Materials Being Added</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Study materials will be published progressively. Add MDX files to <code className="bg-slate-100 px-1 py-0.5 rounded">content/study-materials/</code>.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(bySubject).map(([subject, mats]) => (
              <section key={subject}>
                <h2 className="font-bold text-lg text-slate-800 mb-4">{subject}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mats.map((m) => <MaterialCard key={m.slug} material={m} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
