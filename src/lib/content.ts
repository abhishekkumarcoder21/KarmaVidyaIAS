import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type {
  MainsAnswer,
  MainsAnswerFrontmatter,
  StudyMaterial,
  StudyMaterialFrontmatter,
  CurrentAffairs,
  CurrentAffairsFrontmatter,
  Essay,
  EssayFrontmatter,
  MockTest,
  MockTestFrontmatter,
  MockTestQuestion,
  PrelimsQuestion,
  PrelimsQuestionFile,
} from '@/types'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

function getContentDir(type: string): string {
  return path.join(CONTENT_ROOT, type)
}

function getAllMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const files: string[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath))
    } else if (item.name.endsWith('.mdx') || item.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  return files
}

function countWords(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/[#*_[\]()]/g, '') // remove markdown symbols
    .split(/\s+/)
    .filter(Boolean).length
}

// ─── Mains Answers ────────────────────────────────────────────────────────────

export function getAllMainsAnswers(): MainsAnswer[] {
  const dir = getContentDir('mains-answers')
  const files = getAllMdxFiles(dir)

  const answers: MainsAnswer[] = []

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      const fm = data as MainsAnswerFrontmatter

      if (!fm.title || !fm.slug || !fm.date || !fm.paper || !fm.subject || !fm.status) {
        console.warn(`[content] Missing required frontmatter in ${filePath}`)
        continue
      }

      if (fm.status !== 'published') continue

      const rt = readingTime(content)

      answers.push({
        ...fm,
        content,
        wordCount: countWords(content),
        readingTime: Math.ceil(rt.minutes),
        filePath,
      })
    } catch (err) {
      console.error(`[content] Error parsing ${filePath}:`, err)
    }
  }

  return answers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getMainsAnswerBySlug(slug: string): MainsAnswer | null {
  const all = getAllMainsAnswers()
  return all.find((a) => a.slug === slug) ?? null
}

// ─── Study Materials ─────────────────────────────────────────────────────────

export function getAllStudyMaterials(): StudyMaterial[] {
  const dir = getContentDir('study-materials')
  const files = getAllMdxFiles(dir)

  const materials: StudyMaterial[] = []

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      const fm = data as StudyMaterialFrontmatter

      if (!fm.title || !fm.slug || !fm.status) {
        console.warn(`[content] Missing required frontmatter in ${filePath}`)
        continue
      }

      if (fm.status !== 'published') continue

      const rt = readingTime(content)

      materials.push({
        ...fm,
        content,
        wordCount: countWords(content),
        readingTime: Math.ceil(rt.minutes),
        filePath,
      })
    } catch (err) {
      console.error(`[content] Error parsing ${filePath}:`, err)
    }
  }

  return materials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getStudyMaterialBySlug(slug: string): StudyMaterial | null {
  return getAllStudyMaterials().find((m) => m.slug === slug) ?? null
}

// ─── Current Affairs ─────────────────────────────────────────────────────────

export function getAllCurrentAffairs(): CurrentAffairs[] {
  const dir = getContentDir('current-affairs')
  const files = getAllMdxFiles(dir)

  const articles: CurrentAffairs[] = []

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      const fm = data as CurrentAffairsFrontmatter

      if (!fm.title || !fm.slug || !fm.status) {
        console.warn(`[content] Missing required frontmatter in ${filePath}`)
        continue
      }

      if (fm.status !== 'published') continue

      const rt = readingTime(content)

      articles.push({
        ...fm,
        content,
        wordCount: countWords(content),
        readingTime: Math.ceil(rt.minutes),
        filePath,
      })
    } catch (err) {
      console.error(`[content] Error parsing ${filePath}:`, err)
    }
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getCurrentAffairsBySlug(slug: string): CurrentAffairs | null {
  return getAllCurrentAffairs().find((a) => a.slug === slug) ?? null
}

// ─── Essays ──────────────────────────────────────────────────────────────────

export function getAllEssays(): Essay[] {
  const dir = getContentDir('essays')
  const files = getAllMdxFiles(dir)

  const essays: Essay[] = []

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      const fm = data as EssayFrontmatter

      if (!fm.title || !fm.slug || !fm.status) {
        console.warn(`[content] Missing required frontmatter in ${filePath}`)
        continue
      }

      if (fm.status !== 'published') continue

      const rt = readingTime(content)

      essays.push({
        ...fm,
        content,
        calculatedWordCount: countWords(content),
        readingTime: Math.ceil(rt.minutes),
        filePath,
      })
    } catch (err) {
      console.error(`[content] Error parsing ${filePath}:`, err)
    }
  }

  return essays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getEssayBySlug(slug: string): Essay | null {
  return getAllEssays().find((e) => e.slug === slug) ?? null
}

// ─── Mock Tests ──────────────────────────────────────────────────────────────

export function getAllMockTests(): MockTest[] {
  const dir = getContentDir('mock-tests')
  if (!fs.existsSync(dir)) return []

  const tests: MockTest[] = []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))

  for (const file of files) {
    try {
      const filePath = path.join(dir, file)
      const raw = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(raw) as MockTest

      if (!data.title || !data.slug || !data.status) {
        console.warn(`[content] Missing required fields in ${filePath}`)
        continue
      }

      if (data.status !== 'published') continue

      tests.push({ ...data, filePath })
    } catch (err) {
      console.error(`[content] Error parsing mock test ${file}:`, err)
    }
  }

  return tests
}

export function getMockTestBySlug(slug: string): MockTest | null {
  return getAllMockTests().find((t) => t.slug === slug) ?? null
}

// ─── Prelims PYQs ─────────────────────────────────────────────────────────────

export function getAllPrelimsQuestions(): PrelimsQuestion[] {
  const dir = getContentDir('prelims-pyqs')
  if (!fs.existsSync(dir)) return []

  const questions: PrelimsQuestion[] = []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))

  for (const file of files) {
    try {
      const filePath = path.join(dir, file)
      const raw = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(raw) as PrelimsQuestionFile | PrelimsQuestion[]

      if (Array.isArray(data)) {
        questions.push(...data.filter((q) => q.status === 'published'))
      } else if (data.questions && Array.isArray(data.questions)) {
        questions.push(...data.questions.filter((q) => q.status === 'published'))
      }
    } catch (err) {
      console.error(`[content] Error parsing prelims pyq ${file}:`, err)
    }
  }

  return questions
}

export function getPrelimsQuestionsBySubject(subjectSlug?: string): PrelimsQuestion[] {
  if (!subjectSlug) return []
  const all = getAllPrelimsQuestions()
  return all.filter((q) => {
    if (!q.subject) return false
    const slugified = q.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return slugified === subjectSlug.toLowerCase() || q.subject.toLowerCase() === subjectSlug.toLowerCase()
  })
}


// ─── Search Index ─────────────────────────────────────────────────────────────

export function buildSearchIndex() {
  const entries: Array<{
    id: string
    title: string
    description: string
    tags: string[]
    subject?: string
    topic?: string
    type: string
    href: string
    date?: string
  }> = []

  const mainsAnswers = getAllMainsAnswers()
  for (const ans of mainsAnswers) {
    entries.push({
      id: `mains-${ans.slug}`,
      title: ans.title,
      description: `${ans.paper} · ${ans.subject} · ${ans.marks} marks`,
      tags: ans.tags,
      subject: ans.subject,
      topic: ans.topic,
      type: 'mains-answer',
      href: `/mains/answers/${ans.slug}`,
      date: ans.date,
    })
  }

  const studyMaterials = getAllStudyMaterials()
  for (const mat of studyMaterials) {
    entries.push({
      id: `study-${mat.slug}`,
      title: mat.title,
      description: `${mat.subject} · ${mat.type}`,
      tags: mat.tags,
      subject: mat.subject,
      topic: mat.topic,
      type: 'study-material',
      href: `/study-materials/${mat.slug}`,
      date: mat.date,
    })
  }

  const currentAffairs = getAllCurrentAffairs()
  for (const ca of currentAffairs) {
    entries.push({
      id: `ca-${ca.slug}`,
      title: ca.title,
      description: ca.subjects.join(', '),
      tags: ca.tags,
      subject: ca.subjects[0],
      type: 'current-affairs',
      href: `/current-affairs/${ca.slug}`,
      date: ca.date,
    })
  }

  const essays = getAllEssays()
  for (const essay of essays) {
    entries.push({
      id: `essay-${essay.slug}`,
      title: essay.title,
      description: `Essay · ${essay.topic}`,
      tags: essay.tags,
      topic: essay.topic,
      type: 'essay',
      href: `/essay/${essay.slug}`,
      date: essay.date,
    })
  }

  const mockTests = getAllMockTests()
  for (const test of mockTests) {
    entries.push({
      id: `test-${test.slug}`,
      title: test.title,
      description: test.description,
      tags: test.tags,
      subject: test.subject,
      type: 'mock-test',
      href: `/mock-tests/${test.slug}`,
    })
  }

  return entries
}
