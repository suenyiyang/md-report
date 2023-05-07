import type { CodeBlock, CodeText, Heading, Image, NormalParagraph, OrderedList, Paragraph, Table, Tex, Text, UnorderedList } from '@md-report/types'
import { ParagraphType, TextType } from '@md-report/types'
import MarkdownIt from 'markdown-it'
import { parseCodeText, parseImage as parseInlineImage, parseText } from './text'
import { HEADING_REGEXP, MATH_BLOCK_REGEXP, sliceInlineText } from './utils'

const md = new MarkdownIt()

type ParagraphParser<T = NormalParagraph> = (raw: string) => T

const parseNormal: ParagraphParser = (raw) => {
  const tokens = md.parseInline(raw, {})[0].children ?? []

  const children: Text[] = []

  const start = 0

  const slice = (end: number, type: TextType) => {
    if (type === TextType.Image) {
      children.push({
        ...parseInlineImage(tokens.slice(start, end)),
      })
    }
    else {
      children.push({
        ...parseText(tokens.slice(start, end), raw),
      })
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    const { tokens: childTokens, offset } = sliceInlineText(tokens.slice(i))
    i += offset
    if (childTokens[0].tag === 'img')
      slice(i, TextType.Image)
    else
      slice(i, TextType.Normal)
  }

  return {
    raw,
    type: ParagraphType.Normal,
    children,
  }
}

const parseCodeBlock: ParagraphParser<CodeBlock> = (raw) => {
  const match = raw.match(/^```(\w*)?(\[([\s\S]*)\])?\n([\s\S]*)\n```$/m)
  const language = match?.[1] ?? ''
  const title = match?.[3]
  const code = match?.[4] ?? ''

  const children: CodeText[] = []
  const lines = code.split(/\r?\n/g)

  for (const [index, line] of lines.entries()) {
    const text = {
      ...parseCodeText(line),
      lineNumber: index + 1,
    }

    children.push(text)
  }

  return {
    raw,
    title,
    type: ParagraphType.CodeBlock,
    language,
    children,
  }
}

const parseHeading: ParagraphParser<Heading> = (raw) => {
  const match = raw.match(HEADING_REGEXP)
  const level = match?.[1].length ?? 1

  const { children } = parseNormal(match?.[2] ?? '')

  return {
    raw,
    type: ParagraphType.Heading,
    level,
    children,
  }
}

const parseOrderedList: ParagraphParser<OrderedList> = (raw) => {
  const lines = raw.split(/\r?\n/g)
  const children: Text[][] = []

  for (const line of lines) {
    const content = line.replace(/^\d+\.\s/, '')
    const { children: textChildren } = parseNormal(content)
    children.push([...textChildren])
  }

  return {
    raw,
    type: ParagraphType.OrderedList,
    children,
  }
}

const parseUnorderedList: ParagraphParser<UnorderedList> = (raw) => {
  const lines = raw.split(/\r?\n/g)
  const children: Text[][] = []

  for (const line of lines) {
    const content = line.replace(/^[\-|\+|\*]\s/, '')
    const { children: textChildren } = parseNormal(content)
    children.push([...textChildren])
  }

  return {
    raw,
    type: ParagraphType.UnorderedList,
    children,
  }
}

const parseTable: ParagraphParser<Table> = (raw) => {
  const lines = raw.split(/\r?\n/g)
  // match text between [[ and ]]
  const matchTableTitle = lines[0].match(/\[\[([\s\S]*)\]\]/m)
  const title = matchTableTitle?.[1] ?? ''

  const rows = matchTableTitle ? lines.slice(1) : lines

  const children: Text[][][] = []

  for (const row of rows) {
    const cells = row.split('|').map(cell => cell.trim())
    const textChildren: Text[][] = []

    // remove first and last empty cell
    cells.pop()
    cells.shift()

    // skip empty row
    if (cells.every(cell => cell.includes('---')))
      continue

    for (const cell of cells) {
      const { children: cellChildren } = parseNormal(cell)
      textChildren.push([...cellChildren])
    }

    children.push(textChildren)
  }

  return {
    type: ParagraphType.Table,
    raw,
    title,
    children,
  }
}

const parseTex: ParagraphParser<Tex> = (raw) => {
  const match = raw.match(MATH_BLOCK_REGEXP)

  const content = match?.[1] ?? ''

  return {
    raw,
    type: ParagraphType.Tex,
    children: {
      raw: content,
      content,
      type: [TextType.Math],
    },
  }
}

const parseImage: ParagraphParser<Image> = (raw) => {
  const match = raw.match(/\!\[([\s\S]*)\]\(([\s\S]*)\)/m)
  const title = match?.[1] ?? ''
  const src = match?.[2] ?? ''

  return {
    raw,
    type: ParagraphType.Image,
    title,
    children: {
      raw,
      type: [TextType.Image],
      content: src,
    },
  }
}

export const parseParagraph = (raw: string, type: ParagraphType = ParagraphType.Normal): Paragraph => {
  switch (type) {
    case ParagraphType.CodeBlock:
      return parseCodeBlock(raw)

    case ParagraphType.Heading:
      return parseHeading(raw)

    case ParagraphType.OrderedList:
      return parseOrderedList(raw)

    case ParagraphType.UnorderedList:
      return parseUnorderedList(raw)

    case ParagraphType.Table:
      return parseTable(raw)

    case ParagraphType.Tex:
      return parseTex(raw)

    case ParagraphType.Image:
      return parseImage(raw)

    case ParagraphType.Normal:
    default:
      return parseNormal(raw)
  }
}
