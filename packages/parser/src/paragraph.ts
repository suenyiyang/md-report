import type Token from 'markdown-it/lib/token'
import type { IBorderOptions } from 'docx'
import { BorderStyle, Math, MathRun, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'
import { StyleId } from '@md-report/types'
import { MathBlockRegExp, sliceTableRow } from './utils'
import { parseInline } from './inline'

export function parseFence(tokens: Token[]): Paragraph {
  // Variables.
  const { content } = tokens[0]
  const children = content.split('\n').filter(item => item !== '').map((item, index) => new TextRun({ text: item, break: index ? 1 : 0 }))
  const border: IBorderOptions = {
    style: BorderStyle.SINGLE,
    space: 5,
    color: '#666666',
  }
  return new Paragraph({
    style: StyleId.code,
    border: {
      top: border,
      bottom: border,
      left: border,
      right: border,
    },
    children,
  })
}

export function parseTable(tokens: Token[]): Table {
  // Variables
  let pos = 0
  const rows: TableRow[] = []
  while (pos < tokens.length) {
    const { tokens: tableRow, offset } = sliceTableRow(tokens.slice(pos))
    rows.push(parseTableRow(tableRow))
    pos += offset
  }
  return new Table({
    style: 'table',
    rows,
  })
}

export function parseTableRow(tokens: Token[]): TableRow {
  const cells: Token[] = tokens.filter(token => token.type === 'inline')
  const children: TableCell[] = cells.map(cell => new TableCell({
    width: {
      size: 1 / cells.length,
      type: WidthType.PERCENTAGE,
    },
    children: [parseInline({
      tokens: [cell],
      style: StyleId.table,
    })],
  }))
  return new TableRow({
    children,
  })
}

export function parseParagraph(tokens: Token[]): Paragraph {
  const inline = tokens.filter(token => token.type === 'inline')
  let style = StyleId.p
  if (inline[0].children?.length === 1 && inline[0].children[0].tag === 'img')
    style = StyleId.image
  // Math blocks.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, mathBlock] = inline[0].content.match(MathBlockRegExp) || []
  if (mathBlock) {
    return new Paragraph({
      style: StyleId.image,
      children: [new Math({
        children: [new MathRun(mathBlock)],
      })],
    })
  }
  return parseInline({
    tokens: inline,
    style,
  })
}

export function parseHeading(tokens: Token[]): Paragraph {
  // Inline token.
  const inline = tokens.filter(token => token.type === 'inline')
  // Heading level.
  const { length } = tokens[0].markup
  return parseInline({
    tokens: inline,
    headingLevel: length,
    style: StyleId[`h${length}` as keyof typeof StyleId],
  })
}

export function parseList(type: StyleId.ol | StyleId.ul): (tokens: Token[]) => Paragraph[] {
  const parser = (tokens: Token[]) => {
    let pos = 0
    const children: Paragraph[] = []
    while (pos < tokens.length) {
      if (tokens[pos].type === 'inline')
        children.push(parseInline({ tokens: [tokens[pos]], style: StyleId.list, isUL: type === StyleId.ul, isOL: type === StyleId.ol }))
      pos++
    }
    return children
  }

  return parser
}

export const paragraphParser: Record<string, (tokens: Token[]) => (Paragraph | Table | Paragraph[])> = {
  code: parseFence,
  table: parseTable,
  p: parseParagraph,
  ul: parseList(StyleId.ul),
  ol: parseList(StyleId.ol),
  h1: parseHeading,
  h2: parseHeading,
  h3: parseHeading,
  h4: parseHeading,
  h5: parseHeading,
  h6: parseHeading,
}
