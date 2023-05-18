import { StyleId, StyleName } from '@md-report/types'
import { AlignmentType, LevelFormat, convertInchesToTwip } from 'docx'
import { lineHeightTimesToNumber, ptToHalfPt, ptToTwip } from '../utils'

export const getDocumentConfig = () => ({
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
          spacing: {
            line: ptToTwip(20),
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      // Paragraph.
      {
        id: StyleId.p,
        name: StyleName.p,
        basedOn: StyleId.normal,
        paragraph: {
          indent: {
            firstLine: ptToTwip(24),
          },
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
        paragraph: {
          indent: {
            firstLine: 0,
          },
          spacing: {
            line: ptToTwip(10),
          },
          alignment: AlignmentType.LEFT,
        },
      },
      // Code content.
      {
        id: StyleId.CodeContent,
        name: StyleName.code,
        basedOn: StyleId.normal,
        run: {
          size: ptToHalfPt(10),
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
            line: ptToTwip(10),
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
        run: {
          size: ptToHalfPt(12),
        },
        paragraph: {
          indent: {
            firstLine: 0,
          },
          spacing: {
            line: lineHeightTimesToNumber(1),
          },
        },
      },
      // Table.
      {
        id: StyleId.table,
        name: StyleName.table,
        basedOn: StyleId.normal,
        run: {},
        paragraph: {
          indent: {
            firstLine: 0,
          },
          spacing: {
            beforeAutoSpacing: true,
            afterAutoSpacing: true,
          },
          alignment: AlignmentType.CENTER,
        },
      },
      // Heading 1.
      {
        id: StyleId.h1,
        name: StyleName.h1,
        next: StyleId.normal,
        run: {
          size: ptToHalfPt(15),
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimHei',
          },
        },
        paragraph: {
          spacing: {
            before: ptToTwip(24),
            after: ptToTwip(18),
            line: ptToTwip(20),
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
          size: ptToHalfPt(14),
        },
        paragraph: {
          spacing: {
            before: ptToTwip(18),
            after: ptToTwip(6),
            line: ptToTwip(20),
          },
          alignment: AlignmentType.LEFT,
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
            eastAsia: 'SimHei',
          },
          bold: false,
        },
        paragraph: {
          spacing: {
            before: ptToTwip(12),
            after: ptToTwip(6),
            line: ptToTwip(20),
          },
          alignment: AlignmentType.LEFT,
        },
      },
      // Heading 4.
      {
        id: StyleId.h4,
        name: StyleName.h4,
        basedOn: StyleId.h3,
        run: {
          size: ptToHalfPt(12),
          font: {
            ascii: 'Times New Roman',
            eastAsia: 'SimHei',
          },
        },
        paragraph: {
          spacing: {
            before: ptToTwip(12),
            after: ptToTwip(6),
          },
        },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: StyleId.ul,
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: '\u25E6',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 2,
            format: LevelFormat.BULLET,
            text: '\u25AA',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 3,
            format: LevelFormat.BULLET,
            text: '\u25AB',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 4,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(1.25), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
        ],
      },
      {
        reference: StyleId.ol,
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 1,
            format: LevelFormat.LOWER_LETTER,
            text: '%2)',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 2,
            format: LevelFormat.LOWER_ROMAN,
            text: '%3.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
          {
            level: 3,
            format: LevelFormat.DECIMAL,
            text: '(%4)',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) },
              },
            },
          },
        ],
      },
    ],
  },
  features: {
    updateFields: true,
  },
  evenAndOddHeaderAndFooters: true,
})
