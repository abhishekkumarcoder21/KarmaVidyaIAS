'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Menu,
  X,
  Search,
  BookOpen,
  BookMarked,
  ChevronDown,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

const MORE_LINKS = [
  { label: 'Essay', href: '/essay' },
  { label: 'CSAT', href: '/csat' },
  { label: 'Ethics & GS4', href: '/ethics' },
  { label: 'About', href: '/about' },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none group" aria-label={siteConfig.name + ' home'}>
      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-200/60 shadow-sm flex-shrink-0 bg-white">
        <Image
          src="/images/karmavidya-ias-logo.jpg"
          alt="KarmaVidyaIAS Logo"
          width={36}
          height={36}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight leading-none" style={{ color: '#0b1e36', fontFamily: 'var(--font-serif)' }}>
          Karma<span style={{ color: '#b47b3b' }}>Vidya</span>IAS
        </span>
        <span className="text-[9px] text-slate-500 font-medium tracking-wider uppercase hidden sm:inline leading-tight mt-0.5">
          Learn • Practise • Progress
        </span>
      </div>
    </Link>
  )
}

function DesktopNav({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false)

  const mainLinks = siteConfig.navLinks.slice(1) // skip Home

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
      {mainLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'px-3.5 py-2 rounded-md text-sm font-medium transition-colors',
            pathname === link.href || pathname.startsWith(link.href + '/')
              ? 'bg-navy-50 text-navy-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          style={
            pathname === link.href || pathname.startsWith(link.href + '/')
              ? { background: '#f0f4ff', color: 'var(--color-primary)' }
              : {}
          }
        >
          {link.label}
        </Link>
      ))}

      {/* More dropdown */}
      <div className="relative">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
          className="flex items-center gap-1 px-3.5 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          aria-expanded={moreOpen}
          aria-haspopup="true"
        >
          More
          <ChevronDown size={14} className={cn('transition-transform', moreOpen && 'rotate-180')} />
        </button>
        {moreOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50">
            {MORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const allLinks = [...siteConfig.navLinks, ...MORE_LINKS.filter(l => !siteConfig.navLinks.some(nl => nl.href === l.href))]

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200">
          <Logo />
          <button onClick={onClose} className="p-2 rounded-md text-slate-500 hover:bg-slate-100" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          <ul className="space-y-0.5">
            {allLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-navy-900 bg-navy-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  style={
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? { background: '#f0f4ff', color: 'var(--color-primary)' }
                      : {}
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Link
            href="/bookmarks"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <BookMarked size={16} />
            My Bookmarks
          </Link>
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 h-16 bg-white transition-shadow duration-200',
          scrolled ? 'shadow-sm border-b border-slate-200' : 'border-b border-slate-100'
        )}
        role="banner"
      >
        <div className="container-wide h-full flex items-center justify-between gap-4">
          <Logo />

          <DesktopNav pathname={pathname} />

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {/* Search */}
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-colors min-w-[140px] lg:min-w-[200px]"
              aria-label="Search"
            >
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <span className="hidden sm:inline">Search…</span>
            </Link>

            {/* Bookmarks */}
            <Link
              href="/bookmarks"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="Bookmarks"
            >
              <BookMarked size={16} />
              <span className="hidden lg:inline">Bookmarks</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  )
}
