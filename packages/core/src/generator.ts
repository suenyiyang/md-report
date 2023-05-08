import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'
import type { CodeBlock, Document, Heading, Image, NormalParagraph, OrderedList, Paragraph, Section, Table, Tex, Text, UnorderedList } from '@md-report/types'
import { ParagraphType, StyleId, TextType } from '@md-report/types'
import * as Docx from 'docx'
import axios from 'axios'

export const getBuffer = (docxDocument: Docx.Document): Promise<Buffer> => {
  const buffer = Docx.Packer.toBuffer(docxDocument)
  return buffer
}

export const generateDocument = async(originDocument: Document): Promise<Docx.Document> => {
  const sections = await Promise.all(originDocument.children.map(generateSection))

  const docxDocument = new Docx.Document({
    sections,
  })

  return docxDocument
}

export async function generateSection(originSection: Section): Promise<Docx.ISectionOptions> {
  const children = (await Promise.all(originSection.children.map(generateParagraph))).flat()

  const docxSection: Docx.ISectionOptions = {
    children,
  }

  return docxSection
}

export async function generateParagraph(originParagraph: Paragraph): Promise<Docx.ISectionOptions['children']> {
  const paragraphType = originParagraph.type

  switch (paragraphType) {
    case ParagraphType.CodeBlock:
      return generateCodeBlock(originParagraph)
    case ParagraphType.Heading:
      return generateHeading(originParagraph)
    case ParagraphType.Image:
      return generateImage(originParagraph)
    case ParagraphType.OrderedList:
      return generateOrderedList(originParagraph)
    case ParagraphType.UnorderedList:
      return generateUnorderedList(originParagraph)
    case ParagraphType.Table:
      return generateTable(originParagraph)
    case ParagraphType.Tex:
      return generateTex(originParagraph)
    case ParagraphType.Normal:
    default:
      return generateNormal(originParagraph)
  }
}

export const generateImageImpl = async(originImageConfig: Text): Promise<Docx.ParagraphChild> => {
  if (!originImageConfig.type.includes(TextType.Image))
    throw new Error('Image config is not an image')

  const { content: src, raw: alt } = originImageConfig
  const [name, resolution] = alt.split('#')

  let data: Docx.IImageOptions['data']

  // local image
  if (src.match(/^(\.+)?[\\|\/]/m)) {
    const path = resolve(cwd(), src)
    data = readFileSync(path)
  }
  // image from network
  else if (src.match(/^https?:\/\//m)) {
    const response = await axios.get(src, { responseType: 'arraybuffer' })
    data = Buffer.from(response.data, 'utf-8')
  }
  // unsupported image path
  else {
    return new Docx.TextRun({ text: name })
  }

  const [width = 100, height = 100] = resolution?.split('*')

  const transformation: Docx.IImageOptions['transformation'] = {
    width: Number(width),
    height: Number(height),
  }

  return new Docx.ImageRun({ data, transformation })
}

export const generateText = async(originText: Text): Promise<Docx.ParagraphChild> => {
  let options: Docx.IRunOptions = {}
  for (const type of originText.type) {
    switch (type) {
      case TextType.Bold:
        options = { ...options, bold: true }
        break
      case TextType.Italic:
        options = { ...options, italics: true }
        break
      case TextType.Underline:
        options = { ...options, underline: {} }
        break
      case TextType.Strikethrough:
        options = { ...options, strike: true }
        break
      case TextType.InlineCode:
        options = {
          ...options,
          size: 20,
          font: {
            ascii: 'Monaco',
            eastAsia: 'KaiTi',
          },
        }
        break
      case TextType.Link:
        options = { ...options, color: '#0000FF' }
        break
      case TextType.Highlight:
        options = { ...options, highlight: 'yellow' }
        break
      case TextType.Subscript:
        options = { ...options, subScript: true }
        break
      case TextType.Superscript:
        options = { ...options, superScript: true }
        break
      case TextType.Image:
        return await generateImageImpl(originText)
      case TextType.Normal:
      default:
        break
    }
  }
  options = { ...options, text: originText.content }

  return new Docx.TextRun(options)
}

async function generateCodeBlock(originParagraph: CodeBlock): Promise<Docx.Table[]> {
  const borderX = {
    style: Docx.BorderStyle.SINGLE,
    space: 5,
    color: '#666666',
  }

  const borders = {
    top: borderX,
    bottom: borderX,
    left: borderX,
    right: borderX,
  }

  const children = originParagraph.children.map(item => new Docx.Paragraph(item.content))

  const codeBlock = new Docx.Table({
    style: StyleId.code,
    borders,
    width: {
      size: 100,
      type: Docx.WidthType.PERCENTAGE,
    },
    rows: [new Docx.TableRow({
      children: [new Docx.TableCell({
        children,
      })],
    })],
  })

  return [codeBlock]
}

async function generateHeading(originParagraph: Heading): Promise<Docx.Paragraph[]> {
  const style = StyleId[`h${originParagraph.level}` as keyof typeof StyleId]

  if (!style) {
    return generateNormal({
      children: originParagraph.children,
    } as NormalParagraph)
  }

  const children = await Promise.all(originParagraph.children.map(generateText))

  const docxParagraph = new Docx.Paragraph({
    style,
    children,
  })

  return [docxParagraph]
}

async function generateImage(originParagraph: Image): Promise<Docx.Paragraph[]> {
  const { title } = originParagraph
  const [text] = title.split('#')

  const children = [await generateImageImpl(originParagraph.children)]

  const ImageParagraph = new Docx.Paragraph({
    style: StyleId.image,
    alignment: Docx.AlignmentType.CENTER,
    children,
  })

  if (!text)
    return [ImageParagraph]

  const ImageTitleParagraph = new Docx.Paragraph({
    style: StyleId.ImageTitle,
    alignment: Docx.AlignmentType.CENTER,
    children: [new Docx.TextRun({ text })],
  })

  return [ImageParagraph, ImageTitleParagraph]
}

async function generateOrderedList(originParagraph: OrderedList): Promise<Docx.Paragraph[]> {
  const { children: list } = originParagraph

  const result: Docx.Paragraph[] = []

  for (const listChild of list) {
    const { level, text } = listChild
    const numbering: Docx.IParagraphOptions['numbering'] = {
      reference: StyleId.ol,
      level,
    }
    const children = await Promise.all(text.map(generateText))
    result.push(new Docx.Paragraph({ numbering, children }))
  }

  return result
}

async function generateUnorderedList(originParagraph: UnorderedList): Promise<Docx.Paragraph[]> {
  const { children: list } = originParagraph

  const result: Docx.Paragraph[] = []

  for (const listChild of list) {
    const { level, text } = listChild
    const numbering: Docx.IParagraphOptions['numbering'] = {
      reference: StyleId.ul,
      level,
    }
    const children = await Promise.all(text.map(generateText))
    result.push(new Docx.Paragraph({ numbering, children }))
  }

  return result
}

async function generateTable(originParagraph: Table): Promise<Docx.Table[]> {
  const { children: originRows, title: text } = originParagraph
  const rows: Docx.ITableOptions['rows'] = []

  for (const originCells of originRows) {
    const cells: Docx.ITableRowOptions['children'] = []

    for (const originCell of originCells) {
      const paragraphChildren = await Promise.all(originCell.map(generateText))
      const children = [new Docx.Paragraph({
        style: StyleId.TableContent,
        children: paragraphChildren,
      })]
      cells.push(new Docx.TableCell({ children }))
    }

    rows.push(new Docx.TableRow({ children: cells }))
  }

  if (!text) {
    return [new Docx.Table({
      width: {
        size: 100,
        type: Docx.WidthType.PERCENTAGE,
      },
      style: StyleId.table,
      rows,
    })]
  }

  return [
    new Docx.Paragraph({
      style: StyleId.TableTitle,
      children: [new Docx.TextRun({ text })],
    }),
    new Docx.Table({
      width: {
        size: 100,
        type: Docx.WidthType.PERCENTAGE,
      },
      style: StyleId.table,
      rows,
    }),
  ]
}

async function generateTex(originParagraph: Tex): Promise<Docx.Paragraph[]> {
  const { children: mathChild } = originParagraph
  const { content } = mathChild

  const children = [new Docx.Math({
    children: [new Docx.MathRun(content)],
  })]

  return [new Docx.Paragraph({
    style: StyleId.Math,
    children,
  })]
}

async function generateNormal(originParagraph: NormalParagraph): Promise<Docx.Paragraph[]> {
  const { children: textList } = originParagraph

  const children = await Promise.all(textList.map(generateText))

  return [new Docx.Paragraph({
    style: StyleId.normal,
    children,
  })]
}
