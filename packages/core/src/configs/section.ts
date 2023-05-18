import { StyleId } from '@md-report/types'
import { BorderStyle, Footer, Header, PageNumber, Paragraph, SectionType, TextRun, convertMillimetersToTwip } from 'docx'

export const getSectionConfig = (sectionTitle: string, documentTitle: string) => ({
  properties: {
    type: SectionType.NEXT_PAGE,
    page: {
      margin: {
        top: convertMillimetersToTwip(30),
        bottom: convertMillimetersToTwip(30),
        left: convertMillimetersToTwip(30),
        right: convertMillimetersToTwip(30),
        header: convertMillimetersToTwip(20),
        footer: convertMillimetersToTwip(20),
      },
    },
  },
  headers: {
    default: new Header({
      children: [new Paragraph({
        style: StyleId.header,
        border: {
          bottom: {
            color: 'auto',
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        text: sectionTitle,
      })],
    }),
    even: new Header({
      children: [new Paragraph({
        style: StyleId.header,
        border: {
          bottom: {
            color: 'auto',
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        text: documentTitle,
      })],
    }),
  },
  footers: {
    default: new Footer({
      children: [new Paragraph({
        style: StyleId.footer,
        children: [new TextRun({
          children: [PageNumber.CURRENT],
        })],
      })],
    }),
    even: new Footer({
      children: [new Paragraph({
        style: StyleId.footer,
        children: [new TextRun({
          children: [PageNumber.CURRENT],
        })],
      })],
    }),
  },
})
