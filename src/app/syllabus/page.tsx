import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'UPSC CSE Syllabus',
  description: 'Official UPSC Civil Services Examination syllabus for Prelims and Mains, organised by paper and subject.',
}

const SYLLABUS = {
  prelims: {
    title: 'Preliminary Examination',
    papers: [
      {
        name: 'GS Paper I (200 marks)',
        topics: [
          'Current events of national and international importance',
          'History of India and Indian National Movement',
          'Indian and World Geography — Physical, Social, Economic',
          'Indian Polity and Governance — Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues',
          'Economic and Social Development — Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives',
          'General issues on Environmental Ecology, Biodiversity and Climate Change',
          'General Science',
        ],
      },
      {
        name: 'CSAT — GS Paper II (200 marks, qualifying)',
        topics: [
          'Comprehension',
          'Interpersonal skills including communication skills',
          'Logical reasoning and analytical ability',
          'Decision-making and problem solving',
          'General mental ability',
          'Basic numeracy (numbers and their relations, orders of magnitude, etc.)',
          'Data interpretation (charts, graphs, tables, data sufficiency, etc.)',
        ],
      },
    ],
  },
  mains: {
    title: 'Main Examination',
    papers: [
      {
        name: 'Essay — Paper I (250 marks)',
        topics: [
          'Candidates may be required to write essays on multiple topics.',
          'They will be expected to keep closely to the subject of the essay, to arrange their ideas in orderly fashion, and to write concisely.',
          'Credit will be given for effective and exact expression.',
        ],
      },
      {
        name: 'General Studies I (250 marks)',
        topics: [
          'Indian Heritage and Culture, History and Geography of the World and Society',
          'Modern Indian history from about the middle of the eighteenth century until the present',
          'The Freedom Struggle — its various stages and important contributors / contributions',
          'Post-independence consolidation and reorganisation within the country',
          'History of the world — events from 18th century; industrial revolution, world wars, redrawal of national boundaries, colonisation, decolonisation',
          'Indian society — salient features; role of women and women\'s organisation',
          'Urbanisation — problems and remedies',
          'Effects of globalisation on Indian society; social empowerment, communalism, regionalism and secularism',
          'Salient features of world\'s physical geography',
          'Distribution of key natural resources across the world; factors responsible for the location of primary, secondary, and tertiary sector industries',
          'Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone, etc.',
        ],
      },
      {
        name: 'General Studies II (250 marks)',
        topics: [
          'Governance, Constitution, Polity, Social Justice and International Relations',
          'Indian Constitution — historical underpinnings, evolution, features, amendments, significant provisions and basic structure',
          'Functions and responsibilities of the Union and the States; Parliament and State legislatures',
          'Structure, organisation and functioning of the Executive and the Judiciary',
          'Separation of powers between various organs; dispute redressal mechanisms and institutions',
          'Comparison of the Indian constitutional scheme with that of other countries',
          'Welfare schemes for vulnerable sections of the population; mechanisms, laws, institutions and Bodies constituted for the protection and betterment of these vulnerable sections',
          'Government policies and interventions for development in various sectors',
          'Issues relating to development and management of Social Sector/Services relating to Health, Education, Human Resources',
          'Important aspects of governance, transparency and accountability',
          'Role of civil services in a democracy',
          'India and its neighbourhood — relations; Bilateral, regional and global groupings; Effect of policies and politics of developed and developing countries on India\'s interests',
        ],
      },
      {
        name: 'General Studies III (250 marks)',
        topics: [
          'Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management',
          'Indian Economy and issues relating to planning, mobilisation, of resources, growth, development and employment',
          'Inclusive growth and issues arising from it; Government Budgeting',
          'Major crops — cropping patterns in various parts of the country',
          'Infrastructure: Energy, Ports, Roads, Airports, Railways, etc.',
          'Investment models; Science and Technology — developments and their applications',
          'Achievements of Indians in science & technology; indigenisation of technology',
          'Conservation, environmental pollution and degradation, environmental impact assessment',
          'Disaster and disaster management',
          'Linkages between development and spread of extremism; Security challenges and their management',
          'Various Security forces and agencies and their mandate',
        ],
      },
      {
        name: 'General Studies IV — Ethics (250 marks)',
        topics: [
          'Ethics, Integrity and Aptitude',
          'Ethics and Human Interface: Essence, determinants and consequences of Ethics in human actions',
          'Attitude: content, structure, function; its influence and relation with thought and behaviour',
          'Aptitude and foundational values for Civil Services',
          'Emotional intelligence — concepts, and their utilities and application in administration and governance',
          'Contributions of moral thinkers and philosophers from India and world',
          'Public/Civil service values and Ethics in Public administration',
          'Corporate governance',
          'Probity in Governance: Concept of public service; Philosophical basis of governance and probity',
          'Work culture; Quality of service delivery; Utilisation of public funds',
          'Case Studies on above issues',
        ],
      },
    ],
  },
}

function SyllabusSection({
  title,
  papers,
}: {
  title: string
  papers: { name: string; topics: string[] }[]
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--color-primary)' }}>
        {title}
      </h2>
      <div className="space-y-4">
        {papers.map((paper) => (
          <details key={paper.name} className="card group">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none font-semibold text-slate-800 hover:text-navy-900">
              {paper.name}
              <ChevronDown size={18} className="text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="px-5 pb-5 space-y-2">
              {paper.topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-saffron-400 flex-shrink-0" style={{ background: 'var(--color-accent)', opacity: 0.7 }} />
                  {topic}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  )
}

export default function SyllabusPage() {
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'Syllabus' }]} />
          <div className="mt-5">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              UPSC CSE Syllabus
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-xl">
              Official syllabus for the Civil Services Examination. Click each paper to expand the topics.
            </p>
          </div>
        </div>
      </div>

      <div className="container-wide py-10 max-w-4xl">
        <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          <span>
            This syllabus is based on the UPSC Civil Services Examination notification. Always verify with the latest official UPSC notification at{' '}
            <a href="https://www.upsc.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              upsc.gov.in
            </a>.
            Last verified: October 2026.
          </span>
        </div>

        <SyllabusSection title={SYLLABUS.prelims.title} papers={SYLLABUS.prelims.papers} />
        <SyllabusSection title={SYLLABUS.mains.title} papers={SYLLABUS.mains.papers} />

        <div className="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-2">Optional Subjects</h3>
          <p className="text-sm text-slate-500 mb-3">
            UPSC Mains includes two optional subject papers (Paper I and Paper II, each 250 marks). The list of optional subjects includes approximately 48 subjects.
          </p>
          <a
            href="https://www.upsc.gov.in/sites/default/files/Notif-CSE-2025-English.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline"
            style={{ color: 'var(--color-primary)' }}
          >
            View official optional subjects list on UPSC website →
          </a>
        </div>
      </div>
    </div>
  )
}
