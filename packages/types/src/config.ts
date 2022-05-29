import type { IStylesOptions } from 'docx'

export interface IMarkdownReportConfig {
  /**
   * Creator of the document.
   */
  creator: string

  /**
   * Global style options.
   */
  styles: IStylesOptions

}

export enum StyleName {
  'normal' = 'normal',
  'h1' = 'heading1',
  'h2' = 'heading2',
  'h3' = 'heading3',
  'h4' = 'heading4',
  'h5' = 'heading5',
  'h6' = 'heading6',
  'table' = 'table',
}
