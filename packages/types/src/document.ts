import type { Paragraph } from './paragraph'

export interface Base {
  raw: string
}

export interface Document extends Base {
  title: string
  children: Section[]
}

export interface Section extends Base {
  title: string
  children: Paragraph[]
  frontmatter: object
}
