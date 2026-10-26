import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ExternalLink, Mail } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About KarmaVidyaIAS',
  description: 'About KarmaVidyaIAS — an independent free UPSC learning platform maintained by an aspirant preparing for UPSC 2027.',
}

export default function AboutPage() {
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 py-8 md:py-10">
        <div className="container-wide">
          <Breadcrumbs items={[{ label: 'About' }]} />
          <div className="mt-5">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              About KarmaVidyaIAS
            </h1>
            <p className="text-sm text-slate-500 font-serif italic">
              कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । — Learn • Practise • Progress
            </p>
          </div>
        </div>
      </div>
      <div className="container-wide py-10 max-w-3xl">
        <div className="prose-content">
          <div className="rounded-xl p-6 md:p-8 mb-8" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #b47b3b' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/30 shadow-md flex-shrink-0 bg-white">
                <Image
                  src="/images/karmavidya-ias-logo.jpg"
                  alt="KarmaVidyaIAS Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-2xl font-serif" style={{ color: '#0b1e36' }}>
                  Karma<span style={{ color: '#b47b3b' }}>Vidya</span>IAS
                </div>
                <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                  Learn • Practise • Progress
                </div>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans">
              I am an independent UPSC CSE aspirant preparing for the 2027 examination. Inspired by the philosophy of sincere karma and pursuit of true knowledge (*Vidya*), <strong>KarmaVidyaIAS</strong> is my dedicated platform to document my preparation journey, practise answer writing daily, and make top-tier UPSC learning resources freely accessible to every aspirant across Bharat.
            </p>
          </div>

          <h2>What This Platform Offers</h2>
          <ul>
            <li>Daily Mains answer writing practice</li>
            <li>Prelims previous-year questions with explanations</li>
            <li>Mock tests with scoring and answer review</li>
            <li>Subject-wise study materials and notes</li>
            <li>Current affairs with Prelims and Mains relevance</li>
            <li>UPSC syllabus reference</li>
            <li>Essay preparation resources</li>
            <li>CSAT practice</li>
            <li>Ethics and GS4 resources</li>
          </ul>

          <h2>How Content Is Published</h2>
          <p>
            All content is maintained through code. When I write a new Mains answer, I create an MDX file in the repository, commit it, and push it to GitHub. Vercel automatically rebuilds and deploys the website. No admin dashboard is needed.
          </p>
          <p>
            This means content goes through a simple review before publication — I can edit, refine, and add references before pushing. It also ensures the entire content history is version-controlled.
          </p>

          <h2>Important Disclaimers</h2>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 not-prose mb-4">
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                This platform is <strong>not affiliated with or endorsed by UPSC</strong> or any government authority.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                Answers published here are <strong>personal practice answers</strong>, not official model answers or UPSC-evaluated responses.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                Always verify <strong>examination dates, eligibility, and rules</strong> from official UPSC notifications.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                Current affairs content is for study reference only. Verify facts from original news sources.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                This platform does not guarantee selection or any specific outcome.
              </li>
            </ul>
          </div>

          <h2>How to Publish Content</h2>
          <p>
            To add a new Mains answer:
          </p>
          <ol>
            <li>Create a new MDX file at <code>content/mains-answers/YYYY/MM/YYYY-MM-DD-your-slug.mdx</code></li>
            <li>Add the required frontmatter (title, slug, date, paper, subject, etc.)</li>
            <li>Write the question and answer in the content body</li>
            <li>Set <code>status: "published"</code></li>
            <li>Commit and push to GitHub</li>
            <li>Vercel automatically deploys the new content</li>
          </ol>
          <p>The full publishing guide is in the <code>README.md</code> at the root of the repository.</p>

          <h2>Official UPSC Resources</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[
            { label: 'UPSC Official Website', href: 'https://www.upsc.gov.in' },
            { label: 'UPSC Notifications', href: 'https://www.upsc.gov.in/examinations/active-examinations' },
            { label: 'Previous Year Papers', href: 'https://www.upsc.gov.in/examinations/previous-question-papers' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex items-center gap-3 group hover:border-slate-300"
            >
              <ExternalLink size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{link.label}</span>
            </a>
          ))}
        </div>

        {siteConfig.contact.email && (
          <div className="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <Mail size={18} className="text-slate-400" />
            <div>
              <div className="font-semibold text-slate-700 text-sm">Contact</div>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-slate-500 hover:underline">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
