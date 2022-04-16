import type { IRunOptions } from 'docx'
import type { MarkdownItTokenType } from '@md-report/types'
import Token = require('markdown-it/lib/token')
import { KAI_TI_FIRA_CODE_FONTS } from './constants'

export function getParagraphChildType(token: Token): 'image' | 'text' {
  switch (token.type) {
    case 'image':
      return 'image'
    default:
      return 'text'
  }
}

export function getParagraphChildConfig(tokens: Token[]): IRunOptions {
  let config: IRunOptions = {}

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    switch (token.type as MarkdownItTokenType) {
      case 'em_open': {
        config = { ...config, italics: true }
        break
      }
      case 'strong_open': {
        config = { ...config, bold: true }
        break
      }
      case 'mark_open': {
        config = { ...config, shading: { fill: '#bbbbbb' }, style: 'mark' }
        break
      }
      case 'html_inline': {
        if (token.content === '<sup>')
          config = { ...config, superScript: true }
        if (token.content === '<sub>')
          config = { ...config, subScript: true }
        break
      }
      case 's_open': {
        config = { ...config, strike: true }
        break
      }
      case 'code_inline': {
        config = { ...config, font: KAI_TI_FIRA_CODE_FONTS, style: 'code' }
        break
      }
      case 'text': {
        config = { ...config, text: token.content }
      }
    }
  }

  return config
}
