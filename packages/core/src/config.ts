import type { IMarkdownReportConfig } from '@md-report/types'
import { StyleId, StyleName } from '@md-report/types'
import { AlignmentType } from 'docx'
import { lineHeightTimesToNumber, ptToHalfPt, ptToTwip } from './utils'

export const defaultConfig: IMarkdownReportConfig = {
  styles: {
    paragraphStyles: [
      // Normal.
      {
        id: StyleId.normal,
        name: StyleName.normal,
        next: StyleId.normal,
        run: {
          size: ptToHalfPt(12),
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimSun',
          },
        },
        paragraph: {
          indent: {
            firstLine: ptToTwip(24),
          },
          spacing: {
            before: lineHeightTimesToNumber(0.5),
            after: lineHeightTimesToNumber(0.5),
            line: lineHeightTimesToNumber(1.5),
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      // Image.
      {
        id: StyleId.image,
        name: StyleName.image,
        next: StyleId.normal,
        paragraph: {
          alignment: AlignmentType.CENTER,
        },
      },
      // Code.
      {
        id: StyleId.code,
        name: StyleName.code,
        basedOn: StyleId.normal,
        run: {
          size: ptToHalfPt(10),
          color: '#444444',
          font: {
            ascii: 'Monaco',
            eastAsia: 'KaiTi',
          },
        },
        paragraph: {
          indent: {
            firstLine: 0,
          },
          spacing: {
            line: lineHeightTimesToNumber(1),
          },
          alignment: AlignmentType.LEFT,
        },
      },
      // Header.
      {
        id: StyleId.header,
        name: StyleName.header,
        basedOn: StyleId.normal,
        run: {
          size: ptToHalfPt(10.5),
        },
        paragraph: {
          indent: {
            firstLine: 0,
          },
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 0,
            line: lineHeightTimesToNumber(1),
          },
        },
      },
      // Footer.
      {
        id: StyleId.footer,
        name: StyleName.footer,
        basedOn: StyleId.header,
        paragraph: {
          spacing: {
            line: lineHeightTimesToNumber(3),
          },
        },
      },
      // List.
      {
        id: StyleId.list,
        name: StyleName.list,
        basedOn: StyleId.normal,
        paragraph: {
          indent: {
            firstLine: 0,
          },
          spacing: {
            line: lineHeightTimesToNumber(1),
          },
        },
      },
      // Heading 1.
      {
        id: StyleId.h1,
        name: StyleName.h1,
        next: StyleId.normal,
        run: {
          size: ptToHalfPt(16),
          bold: true,
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimHei',
          },
        },
        paragraph: {
          spacing: {
            after: ptToTwip(30),
          },
          alignment: AlignmentType.CENTER,
        },
      },
      // Heading 2.
      {
        id: StyleId.h2,
        name: StyleName.h2,
        basedOn: StyleId.h1,
        run: {
          size: ptToHalfPt(15),
        },
        paragraph: {
          spacing: {
            before: ptToTwip(13),
            after: ptToTwip(13),
          },
        },
      },
      // Heading 3.
      {
        id: StyleId.h3,
        name: StyleName.h3,
        basedOn: StyleId.h1,
        run: {
          size: ptToHalfPt(14),
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimSun',
          },
        },
        paragraph: {
          spacing: {},
        },
      },
      // Heading 4.
      {
        id: StyleId.h4,
        name: StyleName.h4,
        basedOn: StyleId.h3,
        run: {
          size: ptToHalfPt(12),
        },
        paragraph: {
          spacing: {},
        },
      },
    ],
  },
  meta: {},
}

export function defineConfig(config: IMarkdownReportConfig): IMarkdownReportConfig {
  return { ...defaultConfig, ...config }
}
