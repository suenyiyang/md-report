import type { IMarkdownReportConfig } from '@md-report/types'
import { StyleId, StyleName } from '@md-report/types'
import { AlignmentType } from 'docx'
import { ptToHalfPt } from './utils'

export const defaultConfig: IMarkdownReportConfig = {
  styles: {
    paragraphStyles: [
      {
        id: StyleId.normal,
        name: StyleName.normal,
        run: {
          size: ptToHalfPt(12),
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimSun',
          },
        },
        paragraph: {
          indent: {
            firstLine: 2,
          },
          spacing: {
            before: 120,
            after: 120,
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      {
        id: StyleId.h1,
        name: StyleName.h1,
        run: {
          size: ptToHalfPt(15),
          bold: true,
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimHei',
          },
        },
        paragraph: {
          spacing: {},
          alignment: AlignmentType.CENTER,
        },
      },
    ],
  },
}

export function defineConfig(config: IMarkdownReportConfig): IMarkdownReportConfig {
  return { ...defaultConfig, ...config }
}
