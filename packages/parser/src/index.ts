import type Token from 'markdown-it/lib/token'
import MarkdownIt from 'markdown-it'
import type { ISectionOptions, IStylesOptions, Paragraph, Table, TableOfContents } from 'docx'
import { Document } from 'docx'
import { sliceParagraph, sliceSection } from './utils'
import { paragraphParser } from './paragraph'

const md = new MarkdownIt()

export function parse(props: { markdown: string; config: { meta: Record<string, any>; styles: IStylesOptions } }): Document {
  const { markdown, config } = props
  const { meta, styles } = config
  // Get frontmatter.
  // Get tokens.
  const tokens: Token[] = md.parse(markdown, meta)
  return parseDocument(tokens, styles)
}

export function parseDocument(tokens: Token[], styles: IStylesOptions): Document {
  // Variables.
  let pos = 0
  const sections: ISectionOptions[] = []
  // Split and parse sections.
  while (pos < tokens.length) {
    const { tokens: section, offset: nextPos } = sliceSection(tokens.slice(pos))
    sections.push(parseSection(section))
    pos = nextPos
  }
  return new Document({
    styles,
    sections,
  })
}

export function parseSection(tokens: Token[]): ISectionOptions {
  // Variables.
  let pos = 0
  const children: (Paragraph | Table | TableOfContents)[] = []
  // Split and parse paragraphs.
  while (pos < tokens.length) {
    const { tokens: paragraph, offset: nextPos } = sliceParagraph(tokens.slice(pos))
    const parser = paragraphParser[tokens[0].tag]
    children.push(parser(paragraph))
    pos = nextPos
  }
  return {
    children,
  }
}
