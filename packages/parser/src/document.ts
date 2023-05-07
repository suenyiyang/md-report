import type { Document, Section } from '@md-report/types'
import { parseSection } from './section'

export const createDocument = (raw: string, title: string, children: Section[]): Document => {
  return {
    raw,
    title,
    children,
  }
}

export const parseDocument = (raw: string): Document => {
  const lines = raw.split(/\r?\n/g)
  const sections: Section[] = []

  let start = 0

  const slice = (end: number) => {
    if (start === end)
      return

    const raw = lines.slice(start, end).join('\n')
    const section = {
      ...parseSection(raw),
    }
    sections.push(section)
    start = end + 1
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd()

    if (line.match(/^---+/)) {
      slice(i)

      const next = lines[i + 1]
      // found frontmatter, skip next dash
      if (line.match(/^---([^-].*)?$/) && !next?.match(/^\s*$/)) {
        start = i
        for (i += 1; i < lines.length; i++) {
          if (lines[i].trimEnd().match(/^---$/))
            break
        }
      }
    }
  }

  if (start < lines.length)
    slice(lines.length)

  const title = sections[0].title

  return {
    raw,
    title,
    children: sections,
  }
}

export * from './section'
export * from './paragraph'
export * from './text'
