import { ParagraphType } from '@md-report/types'
import type { Paragraph, Section } from '@md-report/types'
import { HEADING_REGEXP, isTableWithTitle, matter } from './utils'
import { parseParagraph } from './paragraph'

export const getSectionTitle = (frontmatter: { title?: string }, content: string): string => {
  let title

  if (frontmatter.title) {
    title = String(frontmatter.title)
  }
  else {
    // get first heading content
    const match = content.match(/^(#+) (.*)$/m)
    title = match?.[2]?.trim() ?? ''
  }

  return title
}

export const parseSection = (raw: string): Section => {
  const { data: frontmatter, content } = matter(raw)
  const title = getSectionTitle(frontmatter, content)

  const paragraphs: Paragraph[] = []
  const lines = content.trim().split(/\r?\n/g).filter(line => line.trim() !== '')

  let start = 0

  const slice = (end: number, type?: ParagraphType) => {
    const raw = lines.slice(start, end + 1).join('\n')
    const paragraph = {
      ...parseParagraph(raw, type),
    }
    paragraphs.push(paragraph)

    start = end + 1
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // heading
    if (line.match(HEADING_REGEXP)) {
      slice(i, ParagraphType.Heading)
    }
    // code block or mermaid
    else if (line.startsWith('```')) {
      // collect all code block lines
      for (i += 1; i < lines.length; i++) {
        if (lines[i].startsWith('```'))
          break
      }

      // mermaid
      if (line.includes('mermaid'))
        slice(i, ParagraphType.Mermaid)
      // code block
      else
        slice(i, ParagraphType.CodeBlock)
    }
    // ul
    else if (line.match(/^\-|\+|\* [\s\S]*$/g)) {
      for (i; i < lines.length; i++) {
        if (!lines[i + 1].trimStart().match(/^\-|\+|\* [\s\S]*$/g))
          break
      }
      slice(i, ParagraphType.UnorderedList)
    }
    // ol
    else if (line.match(/^\d+\. [\s\S]*$/g)) {
      for (i; i < lines.length; i++) {
        if (!lines[i + 1].trimStart().match(/^\d+\. [\s\S]*$/g))
          break
      }
      slice(i, ParagraphType.OrderedList)
    }
    // image
    else if (line.match(/^!\[[\s\S]*\]\([\s\S]*\)$/g)) {
      slice(i, ParagraphType.Image)
    }
    // table
    // table with title
    else if (line.match(/^\|[\s\S]*\|$/g) || isTableWithTitle(line, lines[i + 1])) {
      for (i; i < lines.length; i++) {
        if (!lines[i + 1].trimStart().match(/^\|[\s\S]*\|$/g))
          break
      }
      slice(i, ParagraphType.Table)
    }
    // tex
    else if (line.startsWith('$$')) {
      for (i += 1; i < lines.length; i++) {
        if (lines[i].startsWith('$$'))
          break
      }
      slice(i, ParagraphType.Tex)
    }
    // normal
    else {
      slice(i, ParagraphType.Normal)
    }
  }

  return {
    raw,
    title,
    children: paragraphs,
    frontmatter,
  }
}
