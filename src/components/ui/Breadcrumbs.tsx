import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/" className="flex items-center gap-1 hover:text-slate-700 transition-colors">
        <Home size={13} />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight size={13} className="breadcrumb-separator flex-shrink-0" />
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:text-slate-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-medium truncate max-w-[200px]" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
