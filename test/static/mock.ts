import { AlignmentType, Paragraph, TextRun } from 'docx'
import { save } from '@md-report/core'

export const cover = {
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '信息与软件工程学院',
          bold: true,
          size: 52,
          font: 'SimSun',
        }),
      ],
    }),
  ],
}

export const doc = {
  sections: [
    cover,
  ],
}

save(doc)
