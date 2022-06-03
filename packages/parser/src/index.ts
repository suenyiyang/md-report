import type Token from 'markdown-it/lib/token'
import MarkdownIt from 'markdown-it'
import type { ISectionOptions, Table } from 'docx'
import { AlignmentType, BorderStyle, Document, Footer, Header, LevelFormat, Packer, PageNumber, Paragraph, SectionType, StyleLevel, TableOfContents, TextRun, convertInchesToTwip } from 'docx'
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
  // Get frontmatter.
  // Get tokens.
  const tokens: Token[] = md.parse(markdown, {})
  return parseDocument(tokens, config)
}

export function parseDocument(tokens: Token[], config: IMarkdownReportConfig): Document {
  // Variables.
  let pos = 0
  const { styles, meta } = config
  // With default content section.
  const sections: ISectionOptions[] = [{
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
          // TODO: replace with i18n value.
          text: '目录',
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
          // TODO: replace with document title.
          text: meta.pageHeaderText,
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
    children: [
      new TableOfContents('TOC', {
        stylesWithLevels: [
          new StyleLevel(StyleId.h1, 1),
          new StyleLevel(StyleId.h2, 2),
          new StyleLevel(StyleId.h3, 3),
          new StyleLevel(StyleId.h4, 4),
          new StyleLevel(StyleId.h5, 5),
          new StyleLevel(StyleId.h6, 6),
        ],
        useAppliedParagraphOutlineLevel: true,
        hyperlink: true,
        headingStyleRange: '1-3',
      }),
    ],
  }]
  // Split and parse sections.
  while (pos < tokens.length) {
    const { tokens: section, offset } = sliceSection(tokens.slice(pos))
    sections.push(parseSection(section, config))
    pos += offset
  }
  return new Document({
    numbering: {
      config: [
        {
          reference: StyleId.ul,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.BULLET,
              text: '\u25E6',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 2,
              format: LevelFormat.BULLET,
              text: '\u25AA',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 3,
              format: LevelFormat.BULLET,
              text: '\u25AB',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 4,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(1.25), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
          ],
        },
        {
          reference: StyleId.ol,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.LOWER_LETTER,
              text: '%2)',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 2,
              format: LevelFormat.LOWER_ROMAN,
              text: '%3.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
            {
              level: 3,
              format: LevelFormat.DECIMAL,
              text: '(%4)',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
          ],
        },
      ],
    },
    features: {
      updateFields: true,
    },
    evenAndOddHeaderAndFooters: true,
    styles,
    sections,
  })
}

export function parseSection(tokens: Token[], config: IMarkdownReportConfig): ISectionOptions {
  // Variables.
  let pos = 0
  const { meta } = config
  const children: (Paragraph | Table | TableOfContents)[] = []
  const { content: sectionHeader = '' } = tokens[1]
  // Split and parse paragraphs.
  while (pos < tokens.length) {
    const { tokens: paragraph, offset } = sliceParagraph(tokens.slice(pos))
    const parser = paragraphParser[paragraph[0].tag]
    const parseResult = parser(paragraph)
    if (Array.isArray(parseResult))
      children.push(...parseResult)
    else
      children.push(parseResult)
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
          text: sectionHeader,
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
          // TODO: replace with document title.
          text: meta.pageHeaderText,
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
