import type Token from 'markdown-it/lib/token'
import { Paragraph, Table, TableCell, TableRow, TextRun } from 'docx'
import { StyleId } from '@md-report/types'
import { sliceTableRow } from './utils'
import { parseInline } from './inline'

export function parseFence(tokens: Token[]): Paragraph {
  // Variables.
  const { content } = tokens[0]
  const children = content.split('\n').filter(item => item !== '').map((item, index) => new TextRun({ text: item, break: index ? 1 : 0 }))
  return new Paragraph({
    style: StyleId.code,
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
  let style = StyleId.normal
  if (inline[0].children?.length === 1 && inline[0].children[0].tag === 'img')
    style = StyleId.image

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
    style: StyleId[`h${length}` as keyof typeof StyleId],
  })
}

export const paragraphParser: Record<string, (tokens: Token[]) => (Paragraph|Table)> = {
  code: parseFence,
  table: parseTable,
  p: parseParagraph,
  h1: parseHeading,
  h2: parseHeading,
  h3: parseHeading,
  h4: parseHeading,
  h5: parseHeading,
  h6: parseHeading,
}
