import type { IStylesOptions } from 'docx'

export interface IMarkdownReportConfig {
  /**
   * Global style options.
   */
  styles: IStylesOptions

  /**
   * Markdown report config metadata.
   */
  meta: IMarkdownReportMeta
}

export interface IMarkdownReportMeta {
  /**
   * Creator of the document.
   */
  creator?: string

  /**
   * If the page header should be shown.
   * @default false
   */
  showPageHeader?: boolean

  /**
   * Page header text.
   */
  pageHeaderText?: string

}

export enum StyleId {
  'normal' = 'normal',
  'p' = 'p',
  'h1' = 'heading1',
  'h2' = 'heading2',
  'h3' = 'heading3',
  'h4' = 'heading4',
  'h5' = 'heading5',
  'h6' = 'heading6',
  'table' = 'table',
  'image' = 'image',
  'code' = 'code',
  'header' = 'header',
  'footer' = 'footer',
  'ol' = 'ol',
  'ul' = 'ul',
  'list' = 'list',
}

export enum StyleName {
  'normal' = 'Normal',
  'p' = 'Paragraph',
  'h1' = 'Heading 1',
  'h2' = 'Heading 2',
  'h3' = 'Heading 3',
  'h4' = 'Heading 4',
  'h5' = 'Heading 5',
  'h6' = 'Heading 6',
  'table' = 'Table',
  'image' = 'Image',
  'code' = 'Code',
  'header' = 'Header',
  'footer' = 'Footer',
  'ol' = 'Ordered List',
  'ul' = 'Unordered List',
  'list' = 'List',
}
