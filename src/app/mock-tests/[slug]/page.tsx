import { notFound } from 'next/navigation'
import { getMockTestBySlug, getAllMockTests } from '@/lib/content'
import { MockTestEngine } from '@/components/tests/MockTestEngine'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllMockTests().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const test = getMockTestBySlug(slug)
  if (!test) return {}
  return {
    title: test.title,
    description: test.description,
  }
}

export default async function MockTestPage({ params }: Props) {
  const { slug } = await params
  const test = getMockTestBySlug(slug)
  if (!test) notFound()
  return <MockTestEngine test={test} />
}
