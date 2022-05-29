import type { IStylesOptions } from 'docx'

export interface IMarkdownReportConfig {
  /**
   * Creator of the document.
   */
  creator?: string

  /**
   * Global style options.
   */
  styles: IStylesOptions

}

export enum StyleId {
  'normal' = 'normal',
  'h1' = 'heading1',
  'h2' = 'heading2',
  'h3' = 'heading3',
  'h4' = 'heading4',
  'h5' = 'heading5',
  'h6' = 'heading6',
  'table' = 'table',
}

export enum StyleName {
  'normal' = 'Normal',
  'h1' = 'Heading 1',
  'h2' = 'Heading 2',
  'h3' = 'Heading 3',
  'h4' = 'Heading 4',
  'h5' = 'Heading 5',
  'h6' = 'Heading 6',
}
