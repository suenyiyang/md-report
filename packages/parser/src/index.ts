import type Token from 'markdown-it/lib/token'
import MarkdownIt from 'markdown-it'
import type { ISectionOptions, IStylesOptions, Table, TableOfContents } from 'docx'
import { BorderStyle, Document, Footer, Header, Packer, PageNumber, Paragraph, SectionType, TextRun, convertInchesToTwip } from 'docx'
import type { IMarkdownReportConfig } from '@md-report/types'
import { StyleId } from '@md-report/types'
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
    evenAndOddHeaderAndFooters: true,
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
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        margin: {
          top: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1.25),
          right: convertInchesToTwip(1.25),
        },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          style: StyleId.header,
          border: {
            bottom: {
              color: 'auto',
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          text: '111',
        })],
      }),
      even: new Header({
        children: [new Paragraph({
          style: StyleId.header,
          border: {
            bottom: {
              color: 'auto',
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          text: '222',
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          style: StyleId.footer,
          children: [new TextRun({
            children: [PageNumber.CURRENT],
          })],
        })],
      }),
      even: new Footer({
        children: [new Paragraph({
          style: StyleId.footer,
          children: [new TextRun({
            children: [PageNumber.CURRENT],
          })],
        })],
      }),
    },
    children,
  }
}
