import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Mail, Github } from 'lucide-react'
import { siteConfig } from '@/config/site'

const footerSections = [
  {
    heading: 'Prepare',
    links: [
      { label: 'Mains Answers', href: '/mains' },
      { label: 'Prelims PYQs', href: '/prelims' },
      { label: 'Mock Tests', href: '/mock-tests' },
      { label: 'Study Materials', href: '/study-materials' },
      { label: 'Current Affairs', href: '/current-affairs' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'UPSC Syllabus', href: '/syllabus' },
      { label: 'UPSC Guide', href: '/upsc-guide' },
      { label: 'Essay Preparation', href: '/essay' },
      { label: 'CSAT', href: '/csat' },
      { label: 'Ethics & GS4', href: '/ethics' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Search', href: '/search' },
      { label: 'Bookmarks', href: '/bookmarks' },
      { label: 'About', href: '/about' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto" role="contentinfo">
      <div className="container-wide py-14">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400/40 bg-white flex-shrink-0">
                <Image
                  src="/images/karmavidya-ias-logo.jpg"
                  alt="KarmaVidyaIAS Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
                  Karma<span style={{ color: '#d97706' }}>Vidya</span>IAS
                </span>
                <span className="text-[10px] text-amber-300/80 font-medium tracking-wide mt-1">
                  कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
                </span>
              </div>
            </Link>
            <p className="text-xs text-amber-200/90 font-medium tracking-widest uppercase">
              Learn • Practise • Progress
            </p>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              A free, independent UPSC CSE learning platform maintained by an aspirant preparing for the 2027 examination.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {siteConfig.disclaimer}
            </p>
            <div className="flex items-center gap-3">
              {siteConfig.social.github && (
                <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors" aria-label="GitHub">
                  <Github size={18} />
                </a>
              )}
              {siteConfig.contact.email && (
                <a href={`mailto:${siteConfig.contact.email}`} className="p-2 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors" aria-label="Email">
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Nav sections */}
          {footerSections.map((section) => (
            <div key={section.heading} className="space-y-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                {section.heading}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {siteConfig.copyrightYear} {siteConfig.name}. Content available for personal study use.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Built with Next.js · Hosted on Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
