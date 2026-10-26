import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

interface ValidationResult {
  file: string
  errors: string[]
  warnings: string[]
}

const results: ValidationResult[] = []
const seenSlugs = new Set<string>()

function record(file: string, errors: string[], warnings: string[] = []) {
  if (errors.length > 0 || warnings.length > 0) {
    results.push({ file, errors, warnings })
  }
}

function checkSlug(slug: any, file: string, errors: string[]) {
  if (!slug || typeof slug !== 'string') {
    errors.push('Missing or non-string "slug"')
    return
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push(`Invalid slug "${slug}". Must only contain lowercase letters, numbers, and hyphens.`)
  }
  if (seenSlugs.has(slug)) {
    errors.push(`Duplicate slug detected: "${slug}"`)
  } else {
    seenSlugs.add(slug)
  }
}

console.log('🔍 Starting Content Integrity & Schema Validation...\n')

// 1. Validate Mains Answers
const mainsDir = path.join(CONTENT_ROOT, 'mains-answers')
let mainsCount = 0
if (fs.existsSync(mainsDir)) {
  const files = fs.readdirSync(mainsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  mainsCount = files.length
  for (const f of files) {
    const filePath = path.join(mainsDir, f)
    const errs: string[] = []
    const warns: string[] = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)

      if (!data.title) errs.push('Missing "title"')
      checkSlug(data.slug, f, errs)
      if (!data.date) errs.push('Missing "date"')
      if (!['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'Optional'].includes(data.paper)) {
        errs.push(`Invalid paper: "${data.paper}". Expected GS1, GS2, GS3, GS4, Essay, or Optional.`)
      }
      if (!data.subject) errs.push('Missing "subject"')
      if (!data.status || !['published', 'draft'].includes(data.status)) {
        errs.push(`Invalid status: "${data.status}". Expected 'published' or 'draft'.`)
      }
      if (!content || content.trim().length < 50) {
        warns.push('Content body is very short (< 50 characters).')
      }
    } catch (e: any) {
      errs.push(`Failed to parse file: ${e.message}`)
    }
    record(path.join('content/mains-answers', f), errs, warns)
  }
}

// 2. Validate Study Materials
const studyDir = path.join(CONTENT_ROOT, 'study-materials')
let studyCount = 0
if (fs.existsSync(studyDir)) {
  const files = fs.readdirSync(studyDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  studyCount = files.length
  for (const f of files) {
    const filePath = path.join(studyDir, f)
    const errs: string[] = []
    const warns: string[] = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)

      if (!data.title) errs.push('Missing "title"')
      checkSlug(data.slug, f, errs)
      if (!data.date) errs.push('Missing "date"')
      if (!data.subject) errs.push('Missing "subject"')
      if (!data.status || !['published', 'draft'].includes(data.status)) {
        errs.push(`Invalid status: "${data.status}".`)
      }
      if (!content || content.trim().length < 50) {
        warns.push('Content body is very short.')
      }
    } catch (e: any) {
      errs.push(`Parse error: ${e.message}`)
    }
    record(path.join('content/study-materials', f), errs, warns)
  }
}

// 3. Validate Current Affairs
const caDir = path.join(CONTENT_ROOT, 'current-affairs')
let caCount = 0
if (fs.existsSync(caDir)) {
  const files = fs.readdirSync(caDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  caCount = files.length
  for (const f of files) {
    const filePath = path.join(caDir, f)
    const errs: string[] = []
    const warns: string[] = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)

      if (!data.title) errs.push('Missing "title"')
      checkSlug(data.slug, f, errs)
      if (!data.date) errs.push('Missing "date"')
      if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
        errs.push('Missing or empty "subjects" array')
      }
      if (!data.status) errs.push('Missing "status"')
    } catch (e: any) {
      errs.push(`Parse error: ${e.message}`)
    }
    record(path.join('content/current-affairs', f), errs, warns)
  }
}

// 4. Validate Essays
const essayDir = path.join(CONTENT_ROOT, 'essays')
let essayCount = 0
if (fs.existsSync(essayDir)) {
  const files = fs.readdirSync(essayDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  essayCount = files.length
  for (const f of files) {
    const filePath = path.join(essayDir, f)
    const errs: string[] = []
    const warns: string[] = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)

      if (!data.title) errs.push('Missing "title"')
      checkSlug(data.slug, f, errs)
      if (!data.date) errs.push('Missing "date"')
      if (!data.topic) errs.push('Missing "topic"')
      if (!data.status) errs.push('Missing "status"')
    } catch (e: any) {
      errs.push(`Parse error: ${e.message}`)
    }
    record(path.join('content/essays', f), errs, warns)
  }
}

// 5. Validate Mock Tests
const mockDir = path.join(CONTENT_ROOT, 'mock-tests')
let mockCount = 0
let mockQuestionsCount = 0
if (fs.existsSync(mockDir)) {
  const files = fs.readdirSync(mockDir).filter(f => f.endsWith('.json'))
  mockCount = files.length
  for (const f of files) {
    const filePath = path.join(mockDir, f)
    const errs: string[] = []
    const warns: string[] = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(raw)

      if (!data.title) errs.push('Missing "title"')
      checkSlug(data.slug, f, errs)
      if (typeof data.durationMinutes !== 'number' || data.durationMinutes <= 0) {
        errs.push('Invalid or missing "durationMinutes"')
      }
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        errs.push('Mock test has no questions array')
      } else {
        mockQuestionsCount += data.questions.length
        data.questions.forEach((q: any, idx: number) => {
          if (!q.id) errs.push(`Question #${idx + 1} is missing "id"`)
          if (!q.questionText) errs.push(`Question #${idx + 1} missing "questionText"`)
          if (!q.options || !q.options.a || !q.options.b || !q.options.c || !q.options.d) {
            errs.push(`Question #${idx + 1} options must contain a, b, c, d keys`)
          }
          if (!['a', 'b', 'c', 'd'].includes(q.correctAnswer)) {
            errs.push(`Question #${idx + 1} invalid correctAnswer: "${q.correctAnswer}"`)
          }
          if (!q.explanation) warns.push(`Question #${idx + 1} has empty explanation`)
        })
      }
    } catch (e: any) {
      errs.push(`JSON parse error: ${e.message}`)
    }
    record(path.join('content/mock-tests', f), errs, warns)
  }
}

// 6. Validate Prelims PYQs
const pyqDir = path.join(CONTENT_ROOT, 'prelims-pyqs')
let pyqFileCount = 0
let pyqQuestionsCount = 0
if (fs.existsSync(pyqDir)) {
  const files = fs.readdirSync(pyqDir).filter(f => f.endsWith('.json'))
  pyqFileCount = files.length
  for (const f of files) {
    const filePath = path.join(pyqDir, f)
    const errs: string[] = []
    const warns: string[] = []
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(raw)
      const qList = Array.isArray(data) ? data : data.questions

      if (!Array.isArray(qList)) {
        errs.push('File does not contain a question list')
      } else {
        pyqQuestionsCount += qList.length
        qList.forEach((q: any, idx: number) => {
          if (!q.id) errs.push(`Question #${idx + 1} missing "id"`)
          if (!q.questionText) errs.push(`Question #${idx + 1} missing "questionText"`)
          if (!q.options || !q.options.a || !q.options.b || !q.options.c || !q.options.d) {
            errs.push(`Question #${idx + 1} options must have a, b, c, d keys`)
          }
          if (!['a', 'b', 'c', 'd'].includes(q.correctAnswer)) {
            errs.push(`Question #${idx + 1} invalid correctAnswer: "${q.correctAnswer}"`)
          }
          if (!q.explanation) errs.push(`Question #${idx + 1} missing explanation`)
        })
      }
    } catch (e: any) {
      errs.push(`JSON parse error: ${e.message}`)
    }
    record(path.join('content/prelims-pyqs', f), errs, warns)
  }
}

// Summary Report
console.log('📊 Content Summary:')
console.log(`   - Mains Answers:   ${mainsCount} documents`)
console.log(`   - Study Materials: ${studyCount} documents`)
console.log(`   - Current Affairs: ${caCount} articles`)
console.log(`   - Essays:          ${essayCount} essays`)
console.log(`   - Mock Tests:      ${mockCount} tests (${mockQuestionsCount} total questions)`)
console.log(`   - Prelims PYQs:    ${pyqFileCount} files (${pyqQuestionsCount} verified questions)\n`)

const totalErrors = results.reduce((acc, r) => acc + r.errors.length, 0)
const totalWarnings = results.reduce((acc, r) => acc + r.warnings.length, 0)

if (totalErrors > 0) {
  console.error(`❌ Validation Failed with ${totalErrors} error(s):\n`)
  for (const r of results) {
    if (r.errors.length > 0) {
      console.error(`  📄 ${r.file}:`)
      r.errors.forEach(e => console.error(`     - ❌ ${e}`))
    }
    if (r.warnings.length > 0) {
      r.warnings.forEach(w => console.warn(`     - ⚠️  ${w}`))
    }
  }
  process.exit(1)
} else {
  if (totalWarnings > 0) {
    console.warn(`⚠️  Validation passed with ${totalWarnings} warning(s):`)
    for (const r of results) {
      if (r.warnings.length > 0) {
        console.warn(`  📄 ${r.file}:`)
        r.warnings.forEach(w => console.warn(`     - ⚠️  ${w}`))
      }
    }
  }
  console.log('✅ All content verified successfully! 100% compliant with schemas and standards.')
  process.exit(0)
}
