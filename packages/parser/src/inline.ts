import { readFileSync } from 'fs'
import type { IImageOptions, IRunOptions, ParagraphChild } from 'docx'
import { ImageRun, Paragraph, TextRun } from 'docx'
import type Token from 'markdown-it/lib/token'
import { sliceInlineText } from './utils'

export function parseInline(props: { tokens: Token[]; style?: string }): Paragraph {
  // Variables.
  const { tokens, style = 'normal' } = props
  const { children: childrenTokens } = tokens[0]
  const { length } = childrenTokens || []
  const children: ParagraphChild[] = []
  let pos = 0
  // Parse inline children.
  while (pos < length) {
    const { tokens: paragraphChild, offset: nextPos } = sliceInlineText(tokens.slice(pos))
    if (tokens[0].tag === 'img')
      children.push(parseImage(paragraphChild))
    else
      children.push(parseText(paragraphChild))
    pos = nextPos
  }
  return new Paragraph({
    style,
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
          options = { ...options, font: {}, text: token.content }
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
  const { attrGet, content } = tokens[0]
  const src = attrGet('src')
  if (!src) {
    return new TextRun({
      text: `[MD Report]: Image ${content} is not found.`,
      bold: true,
      color: 'red',
      highlight: 'yellow',
    })
  }
  const options: IImageOptions = {
    data: readFileSync(src).toString('base64'),
    // TODO: Replace width and height with config in image url.
    transformation: {
      width: 100,
      height: 100,
    },
  }
  return new ImageRun(options)
}
