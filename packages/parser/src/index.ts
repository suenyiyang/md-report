import type Token from 'markdown-it/lib/token'
import MarkdownIt from 'markdown-it'
import type { ISectionOptions, IStylesOptions, Paragraph, Table, TableOfContents } from 'docx'
import { Document, Packer } from 'docx'
import type { IMarkdownReportConfig } from '@md-report/types'
import { sliceParagraph, sliceSection } from './utils'
import { paragraphParser } from './paragraph'

const md = new MarkdownIt()

export async function getBuffer(props: { markdown: string; config: IMarkdownReportConfig }): Promise<Buffer> {
  const document = parse(props)
  const buffer = await Packer.toBuffer(document)
  return buffer
}

export function parse(props: { markdown: string; config: IMarkdownReportConfig }): Document {
  const { markdown, config } = props
  const { styles } = config
  // Get frontmatter.
  // Get tokens.
  const tokens: Token[] = md.parse(markdown, {})
  return parseDocument(tokens, styles)
}

export function parseDocument(tokens: Token[], styles: IStylesOptions): Document {
  // Variables.
  let pos = 0
  const sections: ISectionOptions[] = []
  // Split and parse sections.
  while (pos < tokens.length) {
    const { tokens: section, offset } = sliceSection(tokens.slice(pos))
    sections.push(parseSection(section))
    pos += offset
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
    const { tokens: paragraph, offset } = sliceParagraph(tokens.slice(pos))
    const parser = paragraphParser[paragraph[0].tag]
    children.push(parser(paragraph))
    pos += offset
  }
  return {
    children,
  }
}
