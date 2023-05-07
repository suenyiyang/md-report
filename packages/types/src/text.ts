import type { Base } from './document'

export enum TextType {
  Bold = 'bold',
  Italic = 'italic',
  InlineCode = 'inline_code',
  Link = 'link',
  Image = 'image',
  Delete = 'delete',
  Math = 'math',
  Subscript = 'subscript',
  Superscript = 'superscript',
  Highlight = 'highlight',
  Strikethrough = 'strikethrough',
  Normal = 'normal',
}

export interface Text extends Base {
  raw: string
  type: TextType[]
  content: string
}

export interface CodeText extends Text {
  lineNumber: number
}
