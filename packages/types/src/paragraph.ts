import type { Base } from './document'
import type { CodeText, ListChild, Text } from './text'

export enum ParagraphType {
  Normal = 'normal',
  CodeBlock = 'code_block',
  Table = 'table',
  Heading = 'heading',
  OrderedList = 'ordered_list',
  UnorderedList = 'unordered_list',
  Image = 'image',
  Tex = 'tex',
}

export interface NormalParagraph extends Base {
  type: ParagraphType.Normal
  children: Text[]
}

export interface CodeBlock extends Base {
  type: ParagraphType.CodeBlock
  title?: string
  language: string
  children: CodeText[]
}

export interface Heading extends Base {
  type: ParagraphType.Heading
  level: number
  children: Text[]
}

export interface OrderedList extends Base {
  type: ParagraphType.OrderedList
  children: ListChild[]
}

export interface UnorderedList extends Base {
  type: ParagraphType.UnorderedList
  children: ListChild[]
}

export interface Table extends Base {
  type: ParagraphType.Table
  title: string
  children: Text[][][]
}

export interface Tex extends Base {
  type: ParagraphType.Tex
  children: Text
}

export interface Image extends Base {
  type: ParagraphType.Image
  title: string
  children: Text
}

export type Paragraph = NormalParagraph | CodeBlock | Heading | OrderedList | UnorderedList | Table | Tex | Image
