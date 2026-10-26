import React from 'react'

interface Props {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: Props) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-slate-900 border-b pb-2">
          {renderInlineMarkdown(line.slice(2))}
        </h2>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-900">
          {renderInlineMarkdown(line.slice(3))}
        </h3>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="text-lg font-semibold mt-5 mb-2 text-slate-800">
          {renderInlineMarkdown(line.slice(4))}
        </h4>
      )
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-amber-500 bg-amber-50/50 p-4 rounded-r-lg my-4 text-slate-700 italic">
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      )
    } else if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm my-4 font-mono">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="list-disc pl-6 space-y-1.5 my-3 text-slate-700">
          {listItems.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={i} className="list-decimal pl-6 space-y-1.5 my-3 text-slate-700">
          {listItems.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      )
      continue
    } else if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|') && lines[i].endsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split('|').slice(1, -1).map(c => c.trim())
        const bodyRows = tableLines.slice(2).map(r => r.split('|').slice(1, -1).map(c => c.trim()))
        elements.push(
          <div key={i} className="overflow-x-auto my-5">
            <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {headerRow.map((h, k) => (
                    <th key={k} className="px-3 py-2 text-left font-semibold text-slate-800">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bodyRows.map((row, rk) => (
                  <tr key={rk} className="hover:bg-slate-50/50">
                    {row.map((cell, ck) => (
                      <td key={ck} className="px-3 py-2 text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    } else if (line.trim() !== '') {
      elements.push(
        <p key={i} className="my-3 text-slate-700 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      )
    }
    i++
  }

  return <div className={`prose-content max-w-none ${className}`}>{elements}</div>
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)

  return tokens.map((tok, idx) => {
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code key={idx} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
          {tok.slice(1, -1)}
        </code>
      )
    }
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-slate-900">{tok.slice(2, -2)}</strong>
    }
    if (tok.startsWith('*') && tok.endsWith('*')) {
      return <em key={idx} className="italic text-slate-800">{tok.slice(1, -1)}</em>
    }
    return tok
  })
}
