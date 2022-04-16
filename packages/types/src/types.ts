import type { IRunOptions } from 'docx'

export interface ReportConfig{
  title: string
  logo?: string
  subtitle?: string
  subtitlePos?: 'up' | 'down'
  coverInfo?: Record<string, any>
  disablePageNumber?: boolean
  disablePageHeader?: boolean
}

export interface ReportMarkdown{
  raw: string
  frontmatter: ReportConfig
  content: ReportMarkdownSection[]
}

export type MarkdownItTokenType = 'strong_open' | 'em_open' | 's_open' | 'mark_open' | 'html_inline' | 'text' | 'code_inline'

export interface ContentBase{
  type: string
  children?: ContentBase[]
}

export interface ReportMarkdownSection extends ContentBase {
  type: 'section'
  children: ReportMarkdownParagraph[]
}

export interface ReportMarkdownParagraph extends ContentBase{
  type: 'paragraph' | 'heading'
  children: ReportMarkdownParagraphChild[]
  level?: number
}

export interface ReportMarkdownParagraphChild extends ContentBase{
  type: 'text' | 'image'
  config: IRunOptions
}
