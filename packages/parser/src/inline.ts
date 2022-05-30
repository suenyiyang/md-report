import { readFileSync } from 'fs'
import { cwd } from 'process'
import path from 'path'
import type { IImageOptions, IRunOptions, ParagraphChild } from 'docx'
import { HeadingLevel, ImageRun, Paragraph, TextRun } from 'docx'
import type Token from 'markdown-it/lib/token'
import { StyleId } from '@md-report/types'
import { sliceInlineText } from './utils'

export function parseInline(props: { tokens: Token[]; style?: StyleId; headingLevel?: number; isUL?: boolean; isOL?: boolean }): Paragraph {
  // Props.
  const { tokens, style = StyleId.p, headingLevel = 0, isOL = false, isUL = false } = props
  const { children: childrenTokens, level } = tokens[0]
  if (!childrenTokens)
    return new Paragraph({})
  // Numbering.
  let numbering: {
    reference: string
    level: number
  } | undefined
  if (isOL) {
    numbering = {
      reference: StyleId.ol,
      level: (level - 1) / 2 - 1,
    }
  }
  else if (isUL) {
    numbering = {
      reference: StyleId.ul,
      level: (level - 1) / 2 - 1,
    }
  }
  const children: ParagraphChild[] = []
  let pos = 0
  // Parse inline children.
  while (pos < childrenTokens.length) {
    const { tokens: paragraphChild, offset } = sliceInlineText(childrenTokens.slice(pos))
    if (paragraphChild[0].tag === 'img')
      children.push(parseImage(paragraphChild))
    else
      children.push(parseText(paragraphChild))
    pos += offset
  }
  return new Paragraph({
    style,
    numbering,
    heading: headingLevel ? HeadingLevel[`HEADING_${headingLevel}` as keyof typeof HeadingLevel] : undefined,
    children,
  })
}

export function parseText(tokens: Token[]): TextRun {
  let options: IRunOptions = {}
  tokens.forEach((token) => {
    if (token.nesting >= 0) {
      // Only deal with opening and text/code tokens.
      switch (token.tag) {
        // Bold.
        case 'strong':
          options = { ...options, bold: true }
          break
        // Italics
        case 'em':
          options = { ...options, italics: true }
          break
        // Subscript.
        case 'sub':
          options = { ...options, subScript: true }
          break
        // Superscript.
        case 'sup':
          options = { ...options, superScript: true }
          break
        // Strikethrough.
        case 's':
          options = { ...options, strike: true }
          break
        // Highlight.
        case 'mark':
          // TODO: Replace highlight color with env data.
          options = { ...options, highlight: 'yellow' }
          break
        // Inline code.
        case 'code':
          // TODO: Replace code font with env data.
          options = {
            ...options,
            size: 20,
            font: {
              ascii: 'Monaco',
              eastAsia: 'KaiTi',
            },
            text: token.content,
          }
          break
        // Normal text.
        default:
          options = { ...options, text: token.content }
      }
    }
  })
  return new TextRun(options)
}

export function parseImage(tokens: Token[]): ImageRun | TextRun {
  const { attrs, content } = tokens[0]
  const src = new Map(attrs).get('src')
  const [name, resolution] = content.split('#')
  const [x = 100, y = 100] = resolution.split('*')
  if (!src) {
    return new TextRun({
      text: `[MD Report]: Image ${name} is not found.`,
      bold: true,
      color: 'red',
      highlight: 'yellow',
    })
  }
  const options: IImageOptions = {
    data: readFileSync(path.resolve(cwd(), src)).toString('base64'),
    // TODO: Replace width and height with config in image url.
    transformation: {
      width: Number(x),
      height: Number(y),
    },
  }
  return new ImageRun(options)
}
