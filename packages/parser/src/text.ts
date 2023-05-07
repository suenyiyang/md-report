/* eslint-disable no-cond-assign */
import type { CodeText, Text } from '@md-report/types'
import { TextType } from '@md-report/types'
import type Token from 'markdown-it/lib/token'
import { COMMENT_REGEXP } from './utils'

export const parseText = (tokens: Token[], raw: string): Text => {
  const type: TextType[] = []
  let content = ''

  for (const token of tokens) {
    if (token.nesting < 0)
      continue

    switch (token.tag) {
      // bold
      case 'strong':
        type.push(TextType.Bold)
        break
      // italics
      case 'em':
        type.push(TextType.Italic)
        break
      // subscript
      case 'sub':
        type.push(TextType.Subscript)
        break
      // superscript
      case 'sup':
        type.push(TextType.Superscript)
        break
      // strikethrough.
      case 's':
        type.push(TextType.Strikethrough)
        break
      // highlight.
      case 'mark':
        type.push(TextType.Highlight)
        break
      // inline code
      case 'code':
        type.push(TextType.InlineCode)
        content = token.content
        break
      // normal text
      default:
        // ignore comments
        if (token.content.match(COMMENT_REGEXP))
          continue
        // eslint-disable-next-line no-case-declarations
        let match
        // inline math
        if (match = token.content.match(/^\$(.*)\$$/)) {
          type.push(TextType.Math)
          content = match[1]
          break
        }
        // footnote
        else if (match = token.content.match(/^\[\^([\s\S]+)\]$/)) {
          type.push(TextType.Link, TextType.Superscript)
          content = match[1]
          break
        }
        // normal
        else {
          content = token.content
          break
        }
    }
  }

  return {
    raw,
    type,
    content,
  }
}

export const parseImage = (tokens: Token[]): Text => {
  const { attrs, content } = tokens[0]
  const src = new Map(attrs).get('src') ?? ''

  return {
    raw: content,
    type: [TextType.Image],
    content: src,
  }
}

export const parseCodeText = (raw: string): Omit<CodeText, 'lineNumber'> => {
  return {
    raw,
    content: raw,
    type: [TextType.InlineCode],
  }
}
